import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# --- Auth & User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "parent"
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# --- Caregiver Schemas ---
class CertificationOut(BaseModel):
    id: int
    name: str
    issuing_org: str
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    is_verified: bool = True
    verified_date: Optional[str] = None

    class Config:
        from_attributes = True

class AvailabilityOut(BaseModel):
    id: int
    day_of_week: int
    start_time: str
    end_time: str
    is_active: bool

    class Config:
        from_attributes = True

class ReviewOut(BaseModel):
    id: int
    parent_name: Optional[str] = "Parent"
    rating: float
    comment: str
    is_verified_booking: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class CaregiverProfileOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    headline: str
    bio: Optional[str] = None
    hourly_rate: float
    experience_years: int
    service_area: str
    max_travel_km: float
    languages: List[str]
    preferred_age_groups: List[str]
    special_skills: List[str]
    verification_status: str
    background_check_status: str
    overall_rating: float
    review_count: int
    profile_photo_url: Optional[str] = None
    certifications: List[CertificationOut] = []
    availabilities: List[AvailabilityOut] = []
    reviews: List[ReviewOut] = []

    class Config:
        from_attributes = True

# --- Matching Schemas ---
class MatchingIntakeRequest(BaseModel):
    care_type: str = "Babysitting"
    child_age_range: str = "Toddler (2-4 yrs), School-age (5-8 yrs)"
    number_of_children: int = 2
    start_date: Optional[str] = "2026-10-16"
    is_recurring: bool = True
    min_budget: float = 15.0
    max_budget: float = 25.0
    currency: str = "USD"
    location_area: str = "San Francisco, CA"
    max_distance_km: float = 10.0
    required_languages: List[str] = ["English"]
    required_certifications: List[str] = ["CPR/First Aid"]
    schedule_days: List[str] = ["Mon", "Tue", "Wed", "Thu"]
    schedule_time_range: str = "3:00 PM - 7:00 PM"
    special_requirements: List[str] = []

class MatchResultItem(BaseModel):
    id: int
    caregiver_id: int
    caregiver_name: str
    caregiver_avatar: Optional[str] = None
    hourly_rate: float
    experience_years: int
    overall_rating: float
    review_count: int
    verification_status: str
    background_check_status: str
    overall_score: float
    fit_score: float
    suitability_score: float
    score_breakdown: Dict[str, float]
    strengths: List[str]
    explanation: str

class MatchingResponse(BaseModel):
    request_id: int
    criteria_summary: str
    eligible_count: int
    results: List[MatchResultItem]

# --- Booking Schemas ---
class BookingCreate(BaseModel):
    caregiver_id: int
    care_type: str = "Babysitting"
    number_of_children: int = 2
    start_time: datetime.datetime
    end_time: datetime.datetime
    notes: Optional[str] = None
    address: Optional[str] = "1428 Elm Grove Ave, San Francisco, CA"

class BookingOut(BaseModel):
    id: int
    parent_id: int
    caregiver_id: int
    caregiver_name: str
    caregiver_avatar: Optional[str] = None
    care_type: str
    number_of_children: int
    start_time: datetime.datetime
    end_time: datetime.datetime
    hourly_rate: float
    total_amount: float
    status: str  # confirmed, pending, scheduled, in_progress, completed, cancelled
    address: str
    notes: Optional[str] = None
    session_id: Optional[int] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Live Care Session Schemas ---
class SessionEventOut(BaseModel):
    id: int
    event_type: str
    title: str
    description: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ActivityMediaOut(BaseModel):
    id: int
    media_url: str
    caption: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ActivityUpdateCreate(BaseModel):
    title: str
    notes: str
    activity_type: str = "play"  # play, meal, nap, outdoor, reading, craft
    media_url: Optional[str] = None

class ActivityUpdateOut(BaseModel):
    id: int
    title: str
    notes: str
    activity_type: str
    created_at: datetime.datetime
    media: List[ActivityMediaOut] = []

    class Config:
        from_attributes = True

class CareSessionDetailOut(BaseModel):
    id: int
    booking_id: int
    caregiver_id: int
    caregiver_name: str
    caregiver_avatar: Optional[str] = None
    caregiver_phone: Optional[str] = None
    parent_name: str
    scheduled_start: datetime.datetime
    scheduled_end: datetime.datetime
    actual_start: Optional[datetime.datetime] = None
    actual_end: Optional[datetime.datetime] = None
    status: str
    summary: Optional[str] = None
    ai_summary: Optional[str] = None
    children_count: int
    location: str
    events: List[SessionEventOut] = []
    activity_updates: List[ActivityUpdateOut] = []
    media_count: int

# --- Notification Schemas ---
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    related_id: Optional[int] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Payment Schemas ---
class PaymentMethodOut(BaseModel):
    id: int
    brand: str
    last4: str
    exp_month: int
    exp_year: int
    is_default: bool

    class Config:
        from_attributes = True

class PaymentTransactionOut(BaseModel):
    id: int
    booking_id: Optional[int] = None
    amount: float
    currency: str
    status: str
    description: str
    receipt_url: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Dashboard Unified Schema ---
class DashboardOverview(BaseModel):
    parent_name: str
    avatar_url: Optional[str] = None
    upcoming_bookings_count: int
    completed_sessions_count: int
    pending_requests_count: int
    unread_notifications_count: int
    active_sessions_count: int
    
    upcoming_bookings: List[BookingOut]
    active_session: Optional[CareSessionDetailOut] = None
    recent_notifications: List[NotificationOut]
    recommended_matches: List[MatchResultItem]
    preferences_summary: str
