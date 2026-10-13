from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import CaregiverProfile, CaregiverAvailability, Review
from ..schemas import CaregiverProfileOut, AvailabilityOut, ReviewOut

router = APIRouter(prefix="/caregivers", tags=["Caregivers"])

@router.get("", response_model=List[CaregiverProfileOut])
def list_caregivers(
    search: Optional[str] = None,
    max_rate: Optional[float] = None,
    min_rating: Optional[float] = None,
    verified_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(CaregiverProfile)
    if verified_only:
        query = query.filter(CaregiverProfile.verification_status == "verified")
    if max_rate:
        query = query.filter(CaregiverProfile.hourly_rate <= max_rate)
    if min_rating:
        query = query.filter(CaregiverProfile.overall_rating >= min_rating)
    
    caregivers = query.all()
    results = []
    for cg in caregivers:
        if search and search.lower() not in (cg.user.full_name.lower() if cg.user else "") and search.lower() not in (cg.headline.lower() if cg.headline else ""):
            continue
        results.append(CaregiverProfileOut(
            id=cg.id,
            user_id=cg.user_id,
            full_name=cg.user.full_name if cg.user else "Caregiver",
            headline=cg.headline or "",
            bio=cg.bio or "",
            hourly_rate=cg.hourly_rate,
            experience_years=cg.experience_years,
            service_area=cg.service_area or "San Francisco Bay Area",
            max_travel_km=cg.max_travel_km,
            languages=cg.languages or ["English"],
            preferred_age_groups=cg.preferred_age_groups or [],
            special_skills=cg.special_skills or [],
            verification_status=cg.verification_status,
            background_check_status=cg.background_check_status,
            overall_rating=cg.overall_rating,
            review_count=cg.review_count,
            profile_photo_url=cg.profile_photo_url,
            certifications=[
                {
                    "id": c.id,
                    "name": c.name,
                    "issuing_org": c.issuing_org,
                    "issue_date": c.issue_date,
                    "expiry_date": c.expiry_date,
                    "is_verified": c.is_verified,
                    "verified_date": c.verified_date
                } for c in cg.certifications
            ],
            availabilities=[
                {
                    "id": a.id,
                    "day_of_week": a.day_of_week,
                    "start_time": a.start_time,
                    "end_time": a.end_time,
                    "is_active": a.is_active
                } for a in cg.availabilities
            ],
            reviews=[
                {
                    "id": r.id,
                    "parent_name": "Verified Parent",
                    "rating": r.rating,
                    "comment": r.comment,
                    "is_verified_booking": r.is_verified_booking,
                    "created_at": r.created_at
                } for r in cg.reviews
            ]
        ))
    return results

@router.get("/{caregiver_id}", response_model=CaregiverProfileOut)
def get_caregiver_detail(caregiver_id: int, db: Session = Depends(get_db)):
    cg = db.query(CaregiverProfile).filter(CaregiverProfile.id == caregiver_id).first()
    if not cg:
        raise HTTPException(status_code=404, detail="Caregiver not found")
    
    return CaregiverProfileOut(
        id=cg.id,
        user_id=cg.user_id,
        full_name=cg.user.full_name if cg.user else "Caregiver",
        headline=cg.headline or "",
        bio=cg.bio or "",
        hourly_rate=cg.hourly_rate,
        experience_years=cg.experience_years,
        service_area=cg.service_area or "San Francisco Bay Area",
        max_travel_km=cg.max_travel_km,
        languages=cg.languages or ["English"],
        preferred_age_groups=cg.preferred_age_groups or [],
        special_skills=cg.special_skills or [],
        verification_status=cg.verification_status,
        background_check_status=cg.background_check_status,
        overall_rating=cg.overall_rating,
        review_count=cg.review_count,
        profile_photo_url=cg.profile_photo_url,
        certifications=[
            {
                "id": c.id,
                "name": c.name,
                "issuing_org": c.issuing_org,
                "issue_date": c.issue_date,
                "expiry_date": c.expiry_date,
                "is_verified": c.is_verified,
                "verified_date": c.verified_date
            } for c in cg.certifications
        ],
        availabilities=[
            {
                "id": a.id,
                "day_of_week": a.day_of_week,
                "start_time": a.start_time,
                "end_time": a.end_time,
                "is_active": a.is_active
            } for a in cg.availabilities
        ],
        reviews=[
            {
                "id": r.id,
                "parent_name": "Verified Parent",
                "rating": r.rating,
                "comment": r.comment,
                "is_verified_booking": r.is_verified_booking,
                "created_at": r.created_at
            } for r in cg.reviews
        ]
    )

@router.get("/{caregiver_id}/availability", response_model=List[AvailabilityOut])
def get_caregiver_availability(caregiver_id: int, db: Session = Depends(get_db)):
    avails = db.query(CaregiverAvailability).filter(
        CaregiverAvailability.caregiver_id == caregiver_id,
        CaregiverAvailability.is_active == True
    ).all()
    return avails

@router.get("/{caregiver_id}/reviews", response_model=List[ReviewOut])
def get_caregiver_reviews(caregiver_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.caregiver_id == caregiver_id).all()
    return [
        ReviewOut(
            id=r.id,
            parent_name="Verified Parent",
            rating=r.rating,
            comment=r.comment,
            is_verified_booking=r.is_verified_booking,
            created_at=r.created_at
        ) for r in reviews
    ]
