import math
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from .models import CaregiverProfile, MatchingRequest, MatchResult, User
from .schemas import MatchingIntakeRequest, MatchResultItem

class MatchingEngine:
    WEIGHT_AVAILABILITY = 0.30
    WEIGHT_EXPERIENCE = 0.25
    WEIGHT_BUDGET = 0.20
    WEIGHT_QUALIFICATIONS = 0.15
    WEIGHT_PREFERENCES = 0.10

    @classmethod
    def evaluate_caregiver(
        cls, 
        caregiver: CaregiverProfile, 
        request: MatchingIntakeRequest
    ) -> Tuple[float, float, float, Dict[str, float], List[str], str]:
        """
        Evaluates a single caregiver against parent request criteria.
        Returns:
            overall_score (0-100)
            fit_score (0-100 based primarily on parent preferences)
            suitability_score (0-100 including platform reputation and rating)
            score_breakdown
            strengths (list of readable highlights)
            explanation (clear paragraph)
        """
        strengths = []
        breakdown = {}

        # 1. Budget Compatibility (0-100)
        # Perfect if within [min_budget, max_budget], soft decay if higher
        hourly = caregiver.hourly_rate
        if hourly <= request.max_budget:
            budget_score = 100.0
            strengths.append(f"Within your selected budget (${hourly:.0f}/hr vs max ${request.max_budget:.0f}/hr)")
        elif hourly <= request.max_budget * 1.15:
            budget_score = 80.0
            strengths.append(f"Near your budget range (${hourly:.0f}/hr)")
        elif hourly <= request.max_budget * 1.30:
            budget_score = 60.0
        else:
            budget_score = 30.0
        breakdown["budget"] = round(budget_score, 1)

        # 2. Availability Compatibility (0-100)
        # Check if caregiver has active availability matching requested days
        avail_days = {a.day_of_week for a in caregiver.availabilities if a.is_active}
        day_mapping = {"Mon": 0, "Tue": 1, "Wed": 2, "Thu": 3, "Fri": 4, "Sat": 5, "Sun": 6}
        requested_day_indices = {day_mapping.get(d, 0) for d in request.schedule_days}
        
        if requested_day_indices and avail_days:
            matching_days_count = len(requested_day_indices.intersection(avail_days))
            avail_ratio = matching_days_count / len(requested_day_indices)
            availability_score = min(100.0, avail_ratio * 100.0)
            if avail_ratio >= 0.75:
                strengths.append("Available during your requested weekly schedule")
        else:
            availability_score = 85.0  # Flexible baseline
        breakdown["availability"] = round(availability_score, 1)

        # 3. Experience Relevance (0-100)
        exp_years = caregiver.experience_years or 0
        if exp_years >= 5:
            exp_score = 100.0
            strengths.append(f"{exp_years}+ years of specialized childcare experience")
        elif exp_years >= 3:
            exp_score = 85.0
            strengths.append(f"{exp_years} years of proven childcare experience")
        elif exp_years >= 1:
            exp_score = 70.0
        else:
            exp_score = 50.0
        breakdown["experience"] = round(exp_score, 1)

        # 4. Qualifications & Verification Alignment (0-100)
        cert_names = [c.name.lower() for c in caregiver.certifications if c.is_verified]
        req_certs = [c.lower() for c in request.required_certifications]
        
        qual_hits = sum(1 for req in req_certs if any(req in c for c in cert_names))
        qual_ratio = qual_hits / max(1, len(req_certs)) if req_certs else 1.0
        
        # Add boost for Red Cross CPR, First Aid, background check
        verification_boost = 15.0 if caregiver.background_check_status == "verified" else 0.0
        qual_score = min(100.0, (qual_ratio * 85.0) + verification_boost)
        
        if caregiver.background_check_status == "verified":
            strengths.append("Identity verified & comprehensive background check passed")
        if qual_hits > 0:
            strengths.append("Certified in Pediatric CPR / First Aid")
        breakdown["qualifications"] = round(qual_score, 1)

        # 5. Language & Other Preferences (0-100)
        cg_langs = [l.lower() for l in (caregiver.languages or ["English"])]
        req_langs = [l.lower() for l in request.required_languages]
        lang_match = any(l in cg_langs for l in req_langs) if req_langs else True
        pref_score = 100.0 if lang_match else 70.0
        if lang_match:
            strengths.append(f"Fluent in {', '.join(caregiver.languages)}")
        breakdown["preferences"] = round(pref_score, 1)

        # Calculate Fit Score (focus on parent requirements)
        fit_score = (
            cls.WEIGHT_AVAILABILITY * availability_score +
            cls.WEIGHT_EXPERIENCE * exp_score +
            cls.WEIGHT_BUDGET * budget_score +
            cls.WEIGHT_QUALIFICATIONS * qual_score +
            cls.WEIGHT_PREFERENCES * pref_score
        )

        # Calculate Suitability Score (includes caregiver rating & reviews reliability)
        rating_factor = ((caregiver.overall_rating or 4.5) / 5.0) * 100.0
        suitability_score = (fit_score * 0.70) + (rating_factor * 0.30)

        # Final Overall Score normalized to 0-100
        overall_score = round((fit_score * 0.85) + (rating_factor * 0.15), 1)
        fit_score = round(fit_score, 1)
        suitability_score = round(suitability_score, 1)

        # Synthesize explainable rationale
        explanation = (
            f"{caregiver.user.full_name if caregiver.user else 'Caregiver'} is an exceptional fit ({overall_score:.0f}%) "
            f"offering {caregiver.experience_years}+ years of experience at ${caregiver.hourly_rate:.0f}/hr. "
            f"Full schedule alignment for {', '.join(request.schedule_days)} {request.schedule_time_range}. "
            f"Holds verified credentials ({', '.join([c.name for c in caregiver.certifications[:2]]) or 'Childcare certification'}) "
            f"and has maintained a {caregiver.overall_rating:.1f} rating across {caregiver.review_count} verified families."
        )

        return overall_score, fit_score, suitability_score, breakdown, strengths, explanation

    @classmethod
    def run_matching(
        cls, 
        db: Session, 
        request: MatchingIntakeRequest, 
        request_id: int
    ) -> List[MatchResultItem]:
        caregivers = db.query(CaregiverProfile).all()
        results: List[MatchResultItem] = []

        for cg in caregivers:
            overall, fit, suitability, breakdown, strengths, explanation = cls.evaluate_caregiver(cg, request)
            
            # Format result
            item = MatchResultItem(
                id=cg.id,
                caregiver_id=cg.id,
                caregiver_name=cg.user.full_name if cg.user else "Caregiver",
                caregiver_avatar=cg.profile_photo_url,
                hourly_rate=cg.hourly_rate,
                experience_years=cg.experience_years,
                overall_rating=cg.overall_rating,
                review_count=cg.review_count,
                verification_status=cg.verification_status,
                background_check_status=cg.background_check_status,
                overall_score=overall,
                fit_score=fit,
                suitability_score=suitability,
                score_breakdown=breakdown,
                strengths=strengths,
                explanation=explanation,
            )
            results.append(item)

        # Rank by overall_score descending
        results.sort(key=lambda x: x.overall_score, reverse=True)
        return results
