export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'parent' | 'caregiver' | 'admin';
  phone?: string;
  avatar_url?: string;
}

export interface Certification {
  id: number;
  name: string;
  issuing_org: string;
  issue_date?: string;
  expiry_date?: string;
  is_verified: boolean;
  verified_date?: string;
}

export interface AvailabilitySlot {
  id: number;
  day_of_week: number; // 0=Mon, 6=Sun
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface Review {
  id: number;
  parent_name: string;
  rating: number;
  comment: string;
  is_verified_booking: boolean;
  created_at: string;
}

export interface Caregiver {
  id: number;
  user_id: number;
  full_name: string;
  headline: string;
  bio: string;
  hourly_rate: number;
  experience_years: number;
  service_area: string;
  max_travel_km: number;
  languages: string[];
  preferred_age_groups: string[];
  special_skills: string[];
  verification_status: 'verified' | 'pending' | 'not_started';
  background_check_status: 'verified' | 'pending' | 'not_started';
  overall_rating: number;
  review_count: number;
  profile_photo_url: string;
  certifications?: Certification[];
  availabilities?: AvailabilitySlot[];
  reviews?: Review[];
}

export interface MatchScoreBreakdown {
  availability: number;
  experience: number;
  budget: number;
  qualifications: number;
  preferences: number;
}

export interface MatchResultItem {
  id: number;
  caregiver_id: number;
  caregiver_name: string;
  caregiver_avatar?: string;
  hourly_rate: number;
  experience_years: number;
  overall_rating: number;
  review_count: number;
  verification_status: string;
  background_check_status: string;
  overall_score: number;
  fit_score: number;
  suitability_score: number;
  score_breakdown: MatchScoreBreakdown;
  strengths: string[];
  explanation: string;
}

export interface Booking {
  id: number;
  parent_id: number;
  caregiver_id: number;
  caregiver_name: string;
  caregiver_avatar?: string;
  care_type: string;
  number_of_children: number;
  start_time: string;
  end_time: string;
  hourly_rate: number;
  total_amount: number;
  status: 'confirmed' | 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  address: string;
  notes?: string;
  session_id?: number;
  created_at: string;
}

export interface SessionEvent {
  id: number;
  event_type: 'scheduled' | 'checked_in' | 'activity_update' | 'photo_added' | 'parent_notified' | 'checked_out' | 'completed';
  title: string;
  description?: string;
  created_at: string;
}

export interface ActivityMedia {
  id: number;
  media_url: string;
  caption?: string;
  created_at: string;
}

export interface ActivityUpdate {
  id: number;
  title: string;
  notes: string;
  activity_type: string;
  created_at: string;
  media?: ActivityMedia[];
}

export interface CareSession {
  id: number;
  booking_id: number;
  caregiver_id: number;
  caregiver_name: string;
  caregiver_avatar?: string;
  caregiver_phone?: string;
  parent_name: string;
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  status: 'scheduled' | 'awaiting_checkin' | 'in_progress' | 'checked_out' | 'completed' | 'cancelled';
  summary?: string;
  ai_summary?: string;
  children_count: number;
  location: string;
  events: SessionEvent[];
  activity_updates: ActivityUpdate[];
  media_count: number;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notification_type: 'booking' | 'match' | 'payment' | 'activity' | 'safety';
  is_read: boolean;
  related_id?: number;
  created_at: string;
}

export interface PaymentMethod {
  id: number;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export interface PaymentTransaction {
  id: number;
  booking_id?: number;
  amount: number;
  currency: string;
  status: 'successful' | 'pending' | 'failed' | 'refunded';
  description: string;
  receipt_url?: string;
  created_at: string;
}

export interface DashboardData {
  parent_name: string;
  avatar_url?: string;
  upcoming_bookings_count: number;
  completed_sessions_count: number;
  pending_requests_count: number;
  unread_notifications_count: number;
  active_sessions_count: number;
  upcoming_bookings: Booking[];
  active_session?: CareSession;
  recent_notifications: NotificationItem[];
  recommended_matches: MatchResultItem[];
  preferences_summary: string;
}

export interface MatchingIntakePayload {
  care_type: string;
  child_age_range: string;
  number_of_children: number;
  start_date: string;
  is_recurring: boolean;
  min_budget: number;
  max_budget: number;
  currency: string;
  location_area: string;
  max_distance_km: number;
  required_languages: string[];
  required_certifications: string[];
  schedule_days: string[];
  schedule_time_range: string;
  special_requirements: string[];
}
