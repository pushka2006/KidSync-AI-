from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime
from ..database import get_db
from ..models import Booking, CaregiverProfile, ParentProfile, User, Notification, CareSession, SessionEvent
from ..schemas import BookingCreate, BookingOut

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("", response_model=BookingOut)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    sarah_user = db.query(User).filter(User.email == "sarah.johnson@kidsync.ai").first()
    parent_id = sarah_user.parent_profile.id if (sarah_user and sarah_user.parent_profile) else 1

    caregiver = db.query(CaregiverProfile).filter(CaregiverProfile.id == payload.caregiver_id).first()
    if not caregiver:
        raise HTTPException(status_code=404, detail="Caregiver not found")

    # Conflict check (Double-booking prevention)
    conflict = db.query(Booking).filter(
        Booking.caregiver_id == payload.caregiver_id,
        Booking.status.in_(["confirmed", "scheduled", "in_progress"]),
        Booking.start_time < payload.end_time,
        Booking.end_time > payload.start_time
    ).first()
    if conflict:
        raise HTTPException(
            status_code=400, 
            detail=f"Scheduling conflict: Caregiver is already booked from {conflict.start_time.strftime('%I:%M %p')} to {conflict.end_time.strftime('%I:%M %p')}."
        )

    # Server-side pricing calculation
    duration_hours = max(1.0, (payload.end_time - payload.start_time).total_seconds() / 3600.0)
    hourly = caregiver.hourly_rate
    total = round(duration_hours * hourly, 2)

    booking = Booking(
        parent_id=parent_id,
        caregiver_id=payload.caregiver_id,
        care_type=payload.care_type,
        number_of_children=payload.number_of_children,
        start_time=payload.start_time,
        end_time=payload.end_time,
        hourly_rate=hourly,
        total_amount=total,
        status="confirmed",
        address=payload.address or "1428 Elm Grove Ave, San Francisco, CA",
        notes=payload.notes
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    # Automatically initialize CareSession for the booking
    session = CareSession(
        booking_id=booking.id,
        caregiver_id=caregiver.id,
        parent_id=parent_id,
        scheduled_start=booking.start_time,
        scheduled_end=booking.end_time,
        status="scheduled"
    )
    db.add(session)
    db.flush()

    # Initial session event
    db.add(SessionEvent(
        session_id=session.id,
        event_type="scheduled",
        title="Session Confirmed",
        description=f"Care booking confirmed for {booking.start_time.strftime('%b %d, %Y at %I:%M %p')} with {caregiver.user.full_name}."
    ))

    # Add confirmation notification
    db.add(Notification(
        user_id=sarah_user.id if sarah_user else 1,
        title="Booking Confirmed",
        message=f"Your booking with {caregiver.user.full_name} is confirmed for {booking.start_time.strftime('%a, %d %b')}.",
        notification_type="booking",
        related_id=booking.id
    ))
    db.commit()

    return BookingOut(
        id=booking.id,
        parent_id=booking.parent_id,
        caregiver_id=booking.caregiver_id,
        caregiver_name=caregiver.user.full_name,
        caregiver_avatar=caregiver.profile_photo_url,
        care_type=booking.care_type,
        number_of_children=booking.number_of_children,
        start_time=booking.start_time,
        end_time=booking.end_time,
        hourly_rate=booking.hourly_rate,
        total_amount=booking.total_amount,
        status=booking.status,
        address=booking.address,
        notes=booking.notes,
        session_id=session.id,
        created_at=booking.created_at
    )

@router.get("", response_model=List[BookingOut])
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).order_by(Booking.start_time.asc()).all()
    out = []
    for b in bookings:
        cg_name = b.caregiver.user.full_name if b.caregiver and b.caregiver.user else "Caregiver"
        cg_avatar = b.caregiver.profile_photo_url if b.caregiver else None
        out.append(BookingOut(
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
    return out

@router.post("/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    b = db.query(Booking).filter(Booking.id == booking_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    b.status = "cancelled"
    if b.session:
        b.session.status = "cancelled"
    db.commit()
    return {"message": "Booking successfully cancelled", "booking_id": booking_id}
