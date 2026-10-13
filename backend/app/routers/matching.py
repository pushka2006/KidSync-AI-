from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, ParentProfile, MatchingRequest, MatchResult
from ..schemas import MatchingIntakeRequest, MatchingResponse, MatchResultItem
from ..matching_engine import MatchingEngine

router = APIRouter(prefix="/matching", tags=["AI Matching"])

@router.post("/requests", response_model=MatchingResponse)
def submit_matching_intake(intake: MatchingIntakeRequest, db: Session = Depends(get_db)):
    sarah_user = db.query(User).filter(User.email == "sarah.johnson@kidsync.ai").first()
    parent_id = sarah_user.parent_profile.id if (sarah_user and sarah_user.parent_profile) else 1

    req = MatchingRequest(
        parent_id=parent_id,
        care_type=intake.care_type,
        child_age_range=intake.child_age_range,
        number_of_children=intake.number_of_children,
        start_date=intake.start_date,
        is_recurring=intake.is_recurring,
        min_budget=intake.min_budget,
        max_budget=intake.max_budget,
        currency=intake.currency,
        location_area=intake.location_area,
        max_distance_km=intake.max_distance_km,
        required_languages=intake.required_languages,
        required_certifications=intake.required_certifications,
        schedule_preferences={"days": intake.schedule_days, "time_range": intake.schedule_time_range},
        special_requirements=intake.special_requirements,
        status="active"
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    # Run AI Matching Engine
    results: List[MatchResultItem] = MatchingEngine.run_matching(db, intake, req.id)

    # Persist match results
    for res in results:
        mr = MatchResult(
            request_id=req.id,
            caregiver_id=res.caregiver_id,
            overall_score=res.overall_score,
            fit_score=res.fit_score,
            suitability_score=res.suitability_score,
            score_breakdown=res.score_breakdown,
            strengths=res.strengths,
            explanation=res.explanation
        )
        db.add(mr)
    db.commit()

    criteria_summary = f"{intake.care_type} · {intake.number_of_children} children · {', '.join(intake.schedule_days)} {intake.schedule_time_range} · Within {intake.max_distance_km:.0f} km · ${intake.min_budget:.0f} - ${intake.max_budget:.0f}/hour"

    return MatchingResponse(
        request_id=req.id,
        criteria_summary=criteria_summary,
        eligible_count=len(results),
        results=results
    )

@router.get("/requests/{request_id}/results", response_model=MatchingResponse)
def get_matching_results(request_id: int, db: Session = Depends(get_db)):
    req = db.query(MatchingRequest).filter(MatchingRequest.id == request_id).first()
    if not req:
        # Fallback to latest request
        req = db.query(MatchingRequest).order_by(MatchingRequest.id.desc()).first()
    
    if not req:
        raise HTTPException(status_code=404, detail="Matching request not found")

    stored = db.query(MatchResult).filter(MatchResult.request_id == req.id).all()
    results = []
    for m in stored:
        cg = m.caregiver
        results.append(MatchResultItem(
            id=m.id,
            caregiver_id=cg.id,
            caregiver_name=cg.user.full_name if cg.user else "Caregiver",
            caregiver_avatar=cg.profile_photo_url,
            hourly_rate=cg.hourly_rate,
            experience_years=cg.experience_years,
            overall_rating=cg.overall_rating,
            review_count=cg.review_count,
            verification_status=cg.verification_status,
            background_check_status=cg.background_check_status,
            overall_score=m.overall_score,
            fit_score=m.fit_score,
            suitability_score=m.suitability_score,
            score_breakdown=m.score_breakdown or {},
            strengths=m.strengths or [],
            explanation=m.explanation or ""
        ))
    
    days = req.schedule_preferences.get("days", ["Mon", "Tue", "Wed", "Thu"]) if isinstance(req.schedule_preferences, dict) else ["Mon", "Tue"]
    time_range = req.schedule_preferences.get("time_range", "3:00 PM - 7:00 PM") if isinstance(req.schedule_preferences, dict) else "3:00 PM - 7:00 PM"
    summary = f"{req.care_type} · {req.number_of_children} children · {', '.join(days)} {time_range} · Within {req.max_distance_km:.0f} km · ${req.min_budget:.0f} - ${req.max_budget:.0f}/hour"

    return MatchingResponse(
        request_id=req.id,
        criteria_summary=summary,
        eligible_count=len(results),
        results=results
    )
