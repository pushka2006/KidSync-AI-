from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ParentProfile, Booking, CareSession, Notification, MatchResult, CaregiverProfile
from ..schemas import DashboardOverview, BookingOut, CareSessionDetailOut, NotificationOut, MatchResultItem

router = APIRouter(prefix="/dashboard", tags=["Parent Dashboard"])

@router.get("/parent", response_model=DashboardOverview)
def get_parent_dashboard(db: Session = Depends(get_db)):
    sarah_user = db.query(User).filter(User.email == "sarah.johnson@kidsync.ai").first()
    if not sarah_user:
        sarah_user = db.query(User).filter(User.role == "parent").first()
    
    parent_profile = sarah_user.parent_profile if sarah_user else None
    parent_id = parent_profile.id if parent_profile else 1

    # Bookings
    bookings = db.query(Booking).filter(
        Booking.parent_id == parent_id,
        Booking.status.in_(["confirmed", "pending", "scheduled", "in_progress"])
    ).order_by(Booking.start_time.asc()).all()

    upcoming_booking_items = []
    for b in bookings:
        cg_name = b.caregiver.user.full_name if b.caregiver and b.caregiver.user else "Caregiver"
        cg_avatar = b.caregiver.profile_photo_url if b.caregiver else None
        upcoming_booking_items.append(BookingOut(
            id=b.id,
            parent_id=b.parent_id,
            caregiver_id=b.caregiver_id,
            caregiver_name=cg_name,
            caregiver_avatar=cg_avatar,
            care_type=b.care_type,
            number_of_children=b.number_of_children,
            start_time=b.start_time,
            end_time=b.end_time,
            hourly_rate=b.hourly_rate,
            total_amount=b.total_amount,
            status=b.status,
            address=b.address,
            notes=b.notes,
            session_id=b.session.id if b.session else None,
            created_at=b.created_at
        ))

    # Active session
    active_session_obj = db.query(CareSession).filter(
        CareSession.parent_id == parent_id,
        CareSession.status == "in_progress"
    ).first()

    active_session_detail = None
    if active_session_obj:
        cg_name = active_session_obj.caregiver.user.full_name if active_session_obj.caregiver and active_session_obj.caregiver.user else "Caregiver"
        cg_avatar = active_session_obj.caregiver.profile_photo_url if active_session_obj.caregiver else None
        active_session_detail = CareSessionDetailOut(
            id=active_session_obj.id,
            booking_id=active_session_obj.booking_id,
            caregiver_id=active_session_obj.caregiver_id,
            caregiver_name=cg_name,
            caregiver_avatar=cg_avatar,
            caregiver_phone="+1 (415) 555-0812",
            parent_name=sarah_user.full_name if sarah_user else "Sarah Johnson",
            scheduled_start=active_session_obj.scheduled_start,
            scheduled_end=active_session_obj.scheduled_end,
            actual_start=active_session_obj.actual_start,
            actual_end=active_session_obj.actual_end,
            status=active_session_obj.status,
            summary=active_session_obj.summary,
            ai_summary=active_session_obj.ai_summary,
            children_count=2,
            location="At Home",
            events=[
                {
                    "id": ev.id,
                    "event_type": ev.event_type,
                    "title": ev.title,
                    "description": ev.description,
                    "created_at": ev.created_at
                } for ev in active_session_obj.events
            ],
            activity_updates=[
                {
                    "id": act.id,
                    "title": act.title,
                    "notes": act.notes,
                    "activity_type": act.activity_type,
                    "created_at": act.created_at,
                    "media": [
                        {
                            "id": m.id,
                            "media_url": m.media_url,
                            "caption": m.caption,
                            "created_at": m.created_at
                        } for m in act.media
                    ]
                } for act in active_session_obj.activity_updates
            ],
            media_count=len(active_session_obj.media)
        )

    # Notifications
    notifications = db.query(Notification).filter(
        Notification.user_id == (sarah_user.id if sarah_user else 1)
    ).order_by(Notification.created_at.desc()).limit(10).all()

    unread_count = sum(1 for n in notifications if not n.is_read)

    # Match results
    stored_matches = db.query(MatchResult).order_by(MatchResult.overall_score.desc()).limit(3).all()
    match_items = []
    for m in stored_matches:
        cg = m.caregiver
        match_items.append(MatchResultItem(
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

    return DashboardOverview(
        parent_name=sarah_user.full_name if sarah_user else "Sarah Johnson",
        avatar_url=sarah_user.avatar_url if sarah_user else None,
        upcoming_bookings_count=len([b for b in upcoming_booking_items if b.status in ["confirmed", "scheduled"]]),
        completed_sessions_count=5,
        pending_requests_count=len([b for b in upcoming_booking_items if b.status == "pending"]),
        unread_notifications_count=unread_count or 3,
        active_sessions_count=1 if active_session_detail else 0,
        upcoming_bookings=upcoming_booking_items,
        active_session=active_session_detail,
        recent_notifications=notifications,
        recommended_matches=match_items,
        preferences_summary="Babysitting · 2 children · Mon-Thu 3:00 PM - 7:00 PM · Within 10 km · $15 - $25/hour"
    )
