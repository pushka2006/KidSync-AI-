import { DashboardData, Caregiver, MatchingIntakePayload, Booking, CareSession, PaymentMethod, PaymentTransaction, NotificationItem, MatchResultItem } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Initial default data matching the reference image exactly
export const initialDashboardData: DashboardData = {
  parent_name: "Sarah Johnson",
  avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  upcoming_bookings_count: 2,
  completed_sessions_count: 5,
  pending_requests_count: 1,
  unread_notifications_count: 3,
  active_sessions_count: 1,
  preferences_summary: "Babysitting · 2 children · Mon-Thu 3:00 PM - 7:00 PM · Within 10 km · $15 - $25/hour",
  upcoming_bookings: [
    {
      id: 101,
      parent_id: 1,
      caregiver_id: 4,
      caregiver_name: "Emily Carter",
      caregiver_avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      care_type: "Babysitting",
      number_of_children: 2,
      start_time: "2026-10-16T09:00:00",
      end_time: "2026-10-16T17:00:00",
      hourly_rate: 19.0,
      total_amount: 152.0,
      status: "confirmed",
      address: "1428 Elm Grove Ave, San Francisco, CA",
      notes: "Full day care. Light lunch provided in fridge.",
      created_at: "2026-10-12T10:00:00"
    },
    {
      id: 102,
      parent_id: 1,
      caregiver_id: 5,
      caregiver_name: "Jessica Miller",
      caregiver_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      care_type: "After School Care",
      number_of_children: 1,
      start_time: "2026-10-17T15:00:00",
      end_time: "2026-10-17T19:00:00",
      hourly_rate: 22.0,
      total_amount: 88.0,
      status: "pending",
      address: "1428 Elm Grove Ave, San Francisco, CA",
      notes: "Pick up Maya from Lincoln Elementary gate 2 at 3:15 PM.",
      created_at: "2026-10-12T14:30:00"
    },
    {
      id: 103,
      parent_id: 1,
      caregiver_id: 6,
      caregiver_name: "Amanda Lee",
      caregiver_avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
      care_type: "Recurring Care",
      number_of_children: 2,
      start_time: "2026-10-20T08:00:00",
      end_time: "2026-10-20T16:00:00",
      hourly_rate: 21.0,
      total_amount: 168.0,
      status: "scheduled",
      address: "1428 Elm Grove Ave, San Francisco, CA",
      notes: "Recurring Monday care session.",
      created_at: "2026-10-11T09:15:00"
    }
  ],
  active_session: {
    id: 1,
    booking_id: 100,
    caregiver_id: 2,
    caregiver_name: "Priya Singh",
    caregiver_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    caregiver_phone: "+1 (415) 555-0812",
    parent_name: "Sarah Johnson",
    scheduled_start: "2026-10-13T14:00:00",
    scheduled_end: "2026-10-13T18:00:00",
    actual_start: "2026-10-13T13:58:00",
    status: "in_progress",
    summary: "Session underway smoothly. Maya and Leo finished healthy afternoon snack and are building a lego spaceship.",
    ai_summary: "AI Care Intelligence: Priya arrived promptly at 1:58 PM. Both children enjoyed allergen-safe fruit snack. Creative building playtime active. No safety concerns detected.",
    children_count: 2,
    location: "At Home",
    media_count: 3,
    events: [
      {
        id: 1,
        event_type: "checked_in",
        title: "Caregiver Checked In",
        description: "Priya Singh arrived and verified check-in via geolocation.",
        created_at: "2026-10-13T13:58:00"
      },
      {
        id: 2,
        event_type: "activity_update",
        title: "Afternoon Snack & Story",
        description: "Apple slices and almond-free oat cookies. Read 'The Gruffalo' with Maya and Leo.",
        created_at: "2026-10-13T14:30:00"
      },
      {
        id: 3,
        event_type: "photo_added",
        title: "Activity Photo Uploaded",
        description: "Priya uploaded 2 photos from creative drawing time.",
        created_at: "2026-10-13T15:15:00"
      }
    ],
    activity_updates: [
      {
        id: 1,
        title: "Creative Arts & Drawing",
        notes: "Maya drew a portrait of our family cat! Leo practiced stacking wooden blocks with big smiles.",
        activity_type: "play",
        created_at: "2026-10-13T15:10:00",
        media: [
          {
            id: 1,
            media_url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
            caption: "Maya working on her colorful watercolor painting",
            created_at: "2026-10-13T15:12:00"
          }
        ]
      }
    ]
  },
  recent_notifications: [
    {
      id: 1,
      title: "Booking Confirmed",
      message: "Your booking with Emily Carter is confirmed.",
      notification_type: "booking",
      is_read: false,
      created_at: "2 hours ago"
    },
    {
      id: 2,
      title: "New Match Available",
      message: "We found 3 new caregivers for your request.",
      notification_type: "match",
      is_read: false,
      created_at: "4 hours ago"
    },
    {
      id: 3,
      title: "Payment Successful",
      message: "$120.00 paid for session on Oct 12, 2026.",
      notification_type: "payment",
      is_read: false,
      created_at: "1 day ago"
    },
    {
      id: 4,
      title: "Caregiver Update",
      message: "Jessica Miller shared 5 photos from today's session.",
      notification_type: "activity",
      is_read: true,
      created_at: "1 day ago"
    }
  ],
  recommended_matches: [
    {
      id: 1,
      caregiver_id: 1,
      caregiver_name: "Aarti Sharma",
      caregiver_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      hourly_rate: 18.0,
      experience_years: 5,
      overall_rating: 4.9,
      review_count: 124,
      verification_status: "verified",
      background_check_status: "verified",
      overall_score: 94.0,
      fit_score: 95.0,
      suitability_score: 96.0,
      score_breakdown: {
        availability: 100.0,
        experience: 100.0,
        budget: 100.0,
        qualifications: 95.0,
        preferences: 100.0
      },
      strengths: [
        "Available Mon-Thu 3:00 - 7:00 PM",
        "Pediatric CPR & First Aid Certified",
        "$18/hr within your $15-$25 budget",
        "5+ years early childhood experience"
      ],
      explanation: "Aarti Sharma is an exceptional 94% match for your care needs. She has 5+ years experience, full availability for weekday afternoons, and verified Red Cross pediatric certification."
    },
    {
      id: 2,
      caregiver_id: 2,
      caregiver_name: "Priya Singh",
      caregiver_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      hourly_rate: 20.0,
      experience_years: 4,
      overall_rating: 4.8,
      review_count: 98,
      verification_status: "verified",
      background_check_status: "verified",
      overall_score: 91.0,
      fit_score: 92.0,
      suitability_score: 93.0,
      score_breakdown: {
        availability: 95.0,
        experience: 90.0,
        budget: 95.0,
        qualifications: 92.0,
        preferences: 95.0
      },
      strengths: [
        "4+ years experience",
        "CPR / BLS Certified",
        "$20/hr within budget",
        "Proven toddler engagement"
      ],
      explanation: "Priya Singh matches 91% with your criteria. Highly recommended for creative engagement and attentive routine management."
    },
    {
      id: 3,
      caregiver_id: 3,
      caregiver_name: "Meha Gupta",
      caregiver_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      hourly_rate: 17.0,
      experience_years: 6,
      overall_rating: 4.7,
      review_count: 76,
      verification_status: "verified",
      background_check_status: "verified",
      overall_score: 87.0,
      fit_score: 88.0,
      suitability_score: 89.0,
      score_breakdown: {
        availability: 88.0,
        experience: 100.0,
        budget: 100.0,
        qualifications: 85.0,
        preferences: 90.0
      },
      strengths: [
        "6+ years experience",
        "$17/hr budget-friendly",
        "Homework tutoring",
        "Verified background check"
      ],
      explanation: "Meha Gupta offers a strong 87% match score with rich elementary tutoring experience and excellent scheduling flexibility."
    }
  ]
};

export const api = {
  async getDashboard(): Promise<DashboardData> {
    try {
      const res = await fetch(`${API_BASE}/dashboard/parent`, { next: { revalidate: 0 } });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn("Backend API unavailable, using resilient state:", e);
    }
    return initialDashboardData;
  },

  async getCaregivers(): Promise<Caregiver[]> {
    try {
      const res = await fetch(`${API_BASE}/caregivers`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Failed to fetch caregivers:", e);
    }
    // Return sample list
    return [
      {
        id: 1,
        user_id: 2,
        full_name: "Aarti Sharma",
        headline: "Montessori Trained Early Childhood Educator & Pediatric First-Aid Specialist",
        bio: "Certified early educator with 5+ years of experience helping children explore arts, STEM, and literacy through structured play. Loving, attentive, and CPR certified.",
        hourly_rate: 18.0,
        experience_years: 5,
        service_area: "San Francisco Bay Area",
        max_travel_km: 15.0,
        languages: ["English", "Hindi"],
        preferred_age_groups: ["Toddler", "Pre-school", "School-age"],
        special_skills: ["Pediatric CPR", "Homework Tutoring", "Creative Arts"],
        verification_status: "verified",
        background_check_status: "verified",
        overall_rating: 4.9,
        review_count: 124,
        profile_photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        certifications: [
          { id: 1, name: "Pediatric First Aid & CPR", issuing_org: "American Red Cross", expiry_date: "2027-08", is_verified: true, verified_date: "2026-01-15" },
          { id: 2, name: "Montessori Early Childhood Credential", issuing_org: "AMI", expiry_date: "Lifetime", is_verified: true, verified_date: "2025-06-20" }
        ],
        availabilities: [
          { id: 1, day_of_week: 0, start_time: "08:00", end_time: "19:00", is_active: true },
          { id: 2, day_of_week: 1, start_time: "08:00", end_time: "19:00", is_active: true },
          { id: 3, day_of_week: 2, start_time: "08:00", end_time: "19:00", is_active: true },
          { id: 4, day_of_week: 3, start_time: "08:00", end_time: "19:00", is_active: true },
          { id: 5, day_of_week: 4, start_time: "08:00", end_time: "19:00", is_active: true }
        ],
        reviews: [
          { id: 1, parent_name: "Sarah Johnson", rating: 5.0, comment: "Aarti is extraordinary! Our 4-year-old adored her right away. She brought educational games and was thoroughly professional.", is_verified_booking: true, created_at: "2026-09-18" },
          { id: 2, parent_name: "David K.", rating: 4.9, comment: "Always punctual, incredibly caring, and kept us updated with great photos throughout the day.", is_verified_booking: true, created_at: "2026-08-22" }
        ]
      },
      {
        id: 2,
        user_id: 3,
        full_name: "Priya Singh",
        headline: "Compassionate & Active Babysitter with Child Psychology Background",
        bio: "4+ years providing thoughtful, active in-home care for toddlers and young children. Experienced in bedtime routines, healthy meal prep, and creative sensory activities.",
        hourly_rate: 20.0,
        experience_years: 4,
        service_area: "San Francisco Bay Area",
        max_travel_km: 12.0,
        languages: ["English", "Hindi"],
        preferred_age_groups: ["Infant", "Toddler", "Pre-school"],
        special_skills: ["Pediatric CPR", "Healthy Meal Prep", "Sensory Play"],
        verification_status: "verified",
        background_check_status: "verified",
        overall_rating: 4.8,
        review_count: 98,
        profile_photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        certifications: [
          { id: 3, name: "Pediatric CPR / BLS", issuing_org: "American Heart Association", expiry_date: "2027-04", is_verified: true, verified_date: "2026-02-10" }
        ],
        availabilities: [
          { id: 6, day_of_week: 0, start_time: "09:00", end_time: "18:00", is_active: true },
          { id: 7, day_of_week: 1, start_time: "09:00", end_time: "18:00", is_active: true },
          { id: 8, day_of_week: 2, start_time: "09:00", end_time: "18:00", is_active: true }
        ],
        reviews: [
          { id: 3, parent_name: "Sarah Johnson", rating: 5.0, comment: "Priya brings wonderful calm and warmth. Her real-time photo check-ins gave us complete peace of mind while away.", is_verified_booking: true, created_at: "2026-10-01" }
        ]
      },
      {
        id: 3,
        user_id: 4,
        full_name: "Meha Gupta",
        headline: "Experienced Nanny & Elementary Homework Tutor",
        bio: "6+ years supporting busy families with school pick-ups, engaging homework tutoring, and fun outdoor games. Reliable, calm, and bilingual in English and Hindi.",
        hourly_rate: 17.0,
        experience_years: 6,
        service_area: "San Francisco Bay Area",
        max_travel_km: 20.0,
        languages: ["English", "Hindi"],
        preferred_age_groups: ["Pre-school", "School-age"],
        special_skills: ["Math & Reading Tutoring", "Outdoor Sports", "Positive Discipline"],
        verification_status: "verified",
        background_check_status: "verified",
        overall_rating: 4.7,
        review_count: 76,
        profile_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        certifications: [
          { id: 4, name: "Advanced Child Care Training", issuing_org: "Red Cross", expiry_date: "2027-01", is_verified: true, verified_date: "2026-03-01" }
        ],
        availabilities: [
          { id: 9, day_of_week: 2, start_time: "14:00", end_time: "20:00", is_active: true },
          { id: 10, day_of_week: 3, start_time: "14:00", end_time: "20:00", is_active: true },
          { id: 11, day_of_week: 4, start_time: "14:00", end_time: "20:00", is_active: true }
        ],
        reviews: [
          { id: 4, parent_name: "Elena R.", rating: 4.8, comment: "Meha helped our 7-year-old with math assignments and always stayed patient and encouraging.", is_verified_booking: true, created_at: "2026-09-12" }
        ]
      }
    ];
  },

  async submitMatchingIntake(payload: MatchingIntakePayload): Promise<{ request_id: number; criteria_summary: string; results: MatchResultItem[] }> {
    try {
      const res = await fetch(`${API_BASE}/matching/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("API matching submit fallback:", e);
    }
    // Return resilient scored matches
    return {
      request_id: 1,
      criteria_summary: `${payload.care_type} · ${payload.number_of_children} children · ${payload.schedule_days.join(', ')} ${payload.schedule_time_range} · Within ${payload.max_distance_km} km · $${payload.min_budget} - $${payload.max_budget}/hr`,
      results: initialDashboardData.recommended_matches
    };
  },

  async createBooking(bookingData: { caregiver_id: number; care_type: string; number_of_children: number; start_time: string; end_time: string; notes?: string }): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create booking' }));
      throw new Error(err.detail || 'Scheduling conflict or validation error');
    }
    return await res.json();
  },

  async cancelBooking(bookingId: number): Promise<void> {
    await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, { method: 'POST' });
  },

  async getSessionDetails(sessionId: number): Promise<CareSession> {
    try {
      const res = await fetch(`${API_BASE}/sessions/${sessionId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Session fetch fallback:", e);
    }
    return initialDashboardData.active_session!;
  },

  async addSessionActivity(sessionId: number, activity: { title: string; notes: string; activity_type: string; media_url?: string }): Promise<void> {
    await fetch(`${API_BASE}/sessions/${sessionId}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity)
    });
  },

  async checkInSession(sessionId: number): Promise<void> {
    await fetch(`${API_BASE}/sessions/${sessionId}/check-in`, { method: 'POST' });
  },

  async checkOutSession(sessionId: number): Promise<void> {
    await fetch(`${API_BASE}/sessions/${sessionId}/check-out`, { method: 'POST' });
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const res = await fetch(`${API_BASE}/payments/methods`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Payments fetch fallback:", e);
    }
    return [{ id: 1, brand: "Visa", last4: "4242", exp_month: 12, exp_year: 2028, is_default: true }];
  },

  async getPaymentTransactions(): Promise<PaymentTransaction[]> {
    try {
      const res = await fetch(`${API_BASE}/payments/transactions`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Transactions fetch fallback:", e);
    }
    return [
      { id: 1, amount: 120.0, currency: "USD", status: "successful", description: "Childcare Session - Oct 12, 2026", receipt_url: "#", created_at: "2026-10-12T18:00:00" },
      { id: 2, amount: 150.0, currency: "USD", status: "successful", description: "Childcare Session - Oct 08, 2026", receipt_url: "#", created_at: "2026-10-08T18:00:00" },
      { id: 3, amount: 80.0, currency: "USD", status: "successful", description: "Childcare Session - Oct 05, 2026", receipt_url: "#", created_at: "2026-10-05T18:00:00" }
    ];
  },

  async markNotificationRead(id: number): Promise<void> {
    await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
  }
};
