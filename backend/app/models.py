import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="parent", nullable=False)  # parent, caregiver, admin
    phone = Column(String(50), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    parent_profile = relationship("ParentProfile", back_populates="user", uselist=False)
    caregiver_profile = relationship("CaregiverProfile", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user")
    payment_methods = relationship("PaymentMethod", back_populates="user")


class ParentProfile(Base):
    __tablename__ = "parent_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    preferred_contact = Column(String(50), default="In-App")
    emergency_contact = Column(String(255), nullable=True)
    address = Column(String(255), default="1428 Elm Grove Ave")
    city = Column(String(100), default="San Francisco")
    state = Column(String(50), default="CA")
    zip_code = Column(String(20), default="94107")
    children_count = Column(Integer, default=2)
    children_info = Column(JSON, default=list)  # list of {name, age, notes}

    user = relationship("User", back_populates="parent_profile")
    matching_requests = relationship("MatchingRequest", back_populates="parent")
    bookings = relationship("Booking", back_populates="parent")


class CaregiverProfile(Base):
    __tablename__ = "caregiver_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    headline = Column(String(255), default="Nurturing, certified early childhood specialist")
    bio = Column(Text, nullable=True)
    hourly_rate = Column(Float, nullable=False, default=20.0)
    experience_years = Column(Integer, default=4)
    service_area = Column(String(100), default="San Francisco Bay Area")
    max_travel_km = Column(Float, default=15.0)
    languages = Column(JSON, default=lambda: ["English"])
    preferred_age_groups = Column(JSON, default=lambda: ["Infant", "Toddler", "Pre-school", "School-age"])
    special_skills = Column(JSON, default=lambda: ["CPR/First Aid", "Homework Help", "Creative Arts", "Early Reading"])
    
    verification_status = Column(String(50), default="verified")  # verified, pending, not_started
    background_check_status = Column(String(50), default="verified")  # verified, pending, expired
    
    overall_rating = Column(Float, default=4.9)
    review_count = Column(Integer, default=124)
    profile_photo_url = Column(String(500), nullable=True)

    user = relationship("User", back_populates="caregiver_profile")
    certifications = relationship("CaregiverCertification", back_populates="caregiver", cascade="all, delete-orphan")
    availabilities = relationship("CaregiverAvailability", back_populates="caregiver", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="caregiver")
    reviews = relationship("Review", back_populates="caregiver")


class CaregiverCertification(Base):
    __tablename__ = "caregiver_certifications"

    id = Column(Integer, primary_key=True, index=True)
    caregiver_id = Column(Integer, ForeignKey("caregiver_profiles.id"), nullable=False)
    name = Column(String(255), nullable=False)  # e.g., "Pediatric First Aid & CPR"
    issuing_org = Column(String(255), nullable=False)  # e.g., "American Red Cross"
    issue_date = Column(String(50), nullable=True)
    expiry_date = Column(String(50), nullable=True)
    is_verified = Column(Boolean, default=True)
    verified_date = Column(String(50), nullable=True)

    caregiver = relationship("CaregiverProfile", back_populates="certifications")


class CaregiverAvailability(Base):
    __tablename__ = "caregiver_availability"

    id = Column(Integer, primary_key=True, index=True)
    caregiver_id = Column(Integer, ForeignKey("caregiver_profiles.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = Column(String(20), nullable=False)  # "08:00"
    end_time = Column(String(20), nullable=False)  # "18:00"
    is_active = Column(Boolean, default=True)

    caregiver = relationship("CaregiverProfile", back_populates="availabilities")


class MatchingRequest(Base):
    __tablename__ = "matching_requests"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("parent_profiles.id"), nullable=False)
    care_type = Column(String(100), default="Babysitting")  # Babysitting, After School Care, Recurring Care, Infant Care
    child_age_range = Column(String(100), default="Toddler (2-4 yrs), School-age (5-8 yrs)")
    number_of_children = Column(Integer, default=2)
    start_date = Column(String(50), nullable=True)
    is_recurring = Column(Boolean, default=True)
    min_budget = Column(Float, default=15.0)
    max_budget = Column(Float, default=25.0)
    currency = Column(String(10), default="USD")
    location_area = Column(String(100), default="San Francisco, CA")
    max_distance_km = Column(Float, default=10.0)
    required_languages = Column(JSON, default=lambda: ["English"])
    required_certifications = Column(JSON, default=lambda: ["CPR/First Aid"])
    schedule_preferences = Column(JSON, default=lambda: {"days": ["Mon", "Tue", "Wed", "Thu"], "time_range": "3:00 PM - 7:00 PM"})
    special_requirements = Column(JSON, default=list)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    parent = relationship("ParentProfile", back_populates="matching_requests")
    match_results = relationship("MatchResult", back_populates="request", cascade="all, delete-orphan")


class MatchResult(Base):
    __tablename__ = "match_results"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("matching_requests.id"), nullable=False)
    caregiver_id = Column(Integer, ForeignKey("caregiver_profiles.id"), nullable=False)
    overall_score = Column(Float, nullable=False)  # e.g. 94.0
    fit_score = Column(Float, nullable=False)
    suitability_score = Column(Float, nullable=False)
    score_breakdown = Column(JSON, default=dict)  # availability, experience, budget, qualifications, language
    strengths = Column(JSON, default=list)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    request = relationship("MatchingRequest", back_populates="match_results")
    caregiver = relationship("CaregiverProfile")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("parent_profiles.id"), nullable=False)
    caregiver_id = Column(Integer, ForeignKey("caregiver_profiles.id"), nullable=False)
    care_type = Column(String(100), default="Babysitting")
    number_of_children = Column(Integer, default=2)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    hourly_rate = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="confirmed")  # confirmed, pending, scheduled, in_progress, completed, cancelled
    address = Column(String(255), default="1428 Elm Grove Ave, San Francisco, CA")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    parent = relationship("ParentProfile", back_populates="bookings")
    caregiver = relationship("CaregiverProfile", back_populates="bookings")
    session = relationship("CareSession", back_populates="booking", uselist=False)
    review = relationship("Review", back_populates="booking", uselist=False)


class CareSession(Base):
    __tablename__ = "care_sessions"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True, nullable=False)
    caregiver_id = Column(Integer, ForeignKey("caregiver_profiles.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("parent_profiles.id"), nullable=False)
    scheduled_start = Column(DateTime, nullable=False)
    scheduled_end = Column(DateTime, nullable=False)
    actual_start = Column(DateTime, nullable=True)
    actual_end = Column(DateTime, nullable=True)
    status = Column(String(50), default="in_progress")  # scheduled, awaiting_checkin, in_progress, checked_out, completed
    summary = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship("Booking", back_populates="session")
    caregiver = relationship("CaregiverProfile")
    events = relationship("SessionEvent", back_populates="session", cascade="all, delete-orphan", order_by="SessionEvent.created_at.desc()")
    activity_updates = relationship("ActivityUpdate", back_populates="session", cascade="all, delete-orphan", order_by="ActivityUpdate.created_at.desc()")
    media = relationship("ActivityMedia", back_populates="session", cascade="all, delete-orphan")


class SessionEvent(Base):
    __tablename__ = "session_events"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("care_sessions.id"), nullable=False)
    event_type = Column(String(50), nullable=False)  # checked_in, activity_update, photo_added, parent_notified, checked_out
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("CareSession", back_populates="events")


class ActivityUpdate(Base):
    __tablename__ = "activity_updates"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("care_sessions.id"), nullable=False)
    title = Column(String(255), nullable=False)
    activity_type = Column(String(50), default="play")  # play, meal, nap, outdoor, reading, craft
    notes = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("CareSession", back_populates="activity_updates")
    media = relationship("ActivityMedia", back_populates="activity_update")


class ActivityMedia(Base):
    __tablename__ = "activity_media"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("care_sessions.id"), nullable=False)
    activity_update_id = Column(Integer, ForeignKey("activity_updates.id"), nullable=True)
    media_url = Column(String(500), nullable=False)
    caption = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("CareSession", back_populates="media")
    activity_update = relationship("ActivityUpdate", back_populates="media")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    parent_id = Column(Integer, ForeignKey("parent_profiles.id"), nullable=False)
    caregiver_id = Column(Integer, ForeignKey("caregiver_profiles.id"), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=False)
    is_verified_booking = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship("Booking", back_populates="review")
    caregiver = relationship("CaregiverProfile", back_populates="reviews")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="booking")  # booking, match, payment, activity, safety
    is_read = Column(Boolean, default=False)
    related_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider = Column(String(50), default="stripe_test")
    brand = Column(String(50), default="Visa")  # Visa, Mastercard, Amex
    last4 = Column(String(10), default="4242")
    exp_month = Column(Integer, default=12)
    exp_year = Column(Integer, default=2028)
    is_default = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="payment_methods")


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    status = Column(String(50), default="successful")  # successful, pending, failed, refunded
    payment_method_id = Column(Integer, ForeignKey("payment_methods.id"), nullable=True)
    description = Column(String(255), nullable=False)
    receipt_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    target_entity = Column(String(100), nullable=False)
    details = Column(JSON, default=dict)
    ip_address = Column(String(50), default="127.0.0.1")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
