import datetime
from sqlalchemy.orm import Session
from .models import (
    User, ParentProfile, CaregiverProfile, CaregiverCertification, 
    CaregiverAvailability, MatchingRequest, MatchResult, Booking, 
    CareSession, SessionEvent, ActivityUpdate, ActivityMedia, Review, 
    Notification, PaymentMethod, PaymentTransaction, AuditLog
)

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).filter_by(email="sarah.johnson@kidsync.ai").first():
        return

    # 1. Create Parent User (Sarah Johnson)
    sarah_user = User(
        email="sarah.johnson@kidsync.ai",
        hashed_password="mock_hashed_password_kidsync2026",
        full_name="Sarah Johnson",
        role="parent",
        phone="+1 (415) 555-0192",
        avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    )
    db.add(sarah_user)
    db.flush()

    sarah_profile = ParentProfile(
        user_id=sarah_user.id,
        preferred_contact="In-App & SMS",
        emergency_contact="Mark Johnson (+1 415-555-0199)",
        address="1428 Elm Grove Ave",
        city="San Francisco",
        state="CA",
        zip_code="94107",
        children_count=2,
        children_info=[
            {"name": "Maya", "age": 4, "notes": "Loves arts, drawing and dinosaur stories"},
            {"name": "Leo", "age": 2, "notes": "Nap routine at 1:30 PM, peanut allergy (strictly allergen free)"}
        ]
    )
    db.add(sarah_profile)
    db.flush()

    # 2. Caregiver Users & Profiles
    caregivers_data = [
        {
            "name": "Aarti Sharma",
            "email": "aarti.sharma@kidsync.ai",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            "headline": "Montessori Trained Early Childhood Educator & Pediatric First-Aid Specialist",
            "bio": "Certified early educator with 5+ years of experience helping children explore arts, STEM, and literacy through structured play. Loving, attentive, and CPR certified.",
            "rate": 18.0,
            "exp": 5,
            "rating": 4.9,
            "reviews": 124,
            "certs": [
                {"name": "Pediatric First Aid & CPR", "org": "American Red Cross", "exp": "2027-08"},
                {"name": "Montessori Early Childhood Credential", "org": "AMI", "exp": "Lifetime"}
            ]
        },
        {
            "name": "Priya Singh",
            "email": "priya.singh@kidsync.ai",
            "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
            "headline": "Compassionate & Active Babysitter with Child Psychology Background",
            "bio": "4+ years providing thoughtful, active in-home care for toddlers and young children. Experienced in bedtime routines, healthy meal prep, and creative sensory activities.",
            "rate": 20.0,
            "exp": 4,
            "rating": 4.8,
            "reviews": 98,
            "certs": [
                {"name": "Pediatric CPR / BLS", "org": "American Heart Association", "exp": "2027-04"},
                {"name": "Child Nutrition and Cooking", "org": "Stanford Online", "exp": "Lifetime"}
            ]
        },
        {
            "name": "Meha Gupta",
            "email": "meha.gupta@kidsync.ai",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            "headline": "Experienced Nanny & Elementary Homework Tutor",
            "bio": "6+ years supporting busy families with school pick-ups, engaging homework tutoring, and fun outdoor games. Reliable, calm, and bilingual in English and Hindi.",
            "rate": 17.0,
            "exp": 6,
            "rating": 4.7,
            "reviews": 76,
            "certs": [
                {"name": "Advanced Child Care Training", "org": "Red Cross", "exp": "2027-01"}
            ]
        },
        {
            "name": "Emily Carter",
            "email": "emily.carter@kidsync.ai",
            "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
            "headline": "Creative Arts Specialist & Loving Weekend Caregiver",
            "bio": "Former preschool assistant teacher passionate about storytime, puppet shows, and hands-on crafts.",
            "rate": 19.0,
            "exp": 4,
            "rating": 4.9,
            "reviews": 85,
            "certs": [
                {"name": "Infant & Child First Aid", "org": "National Safety Council", "exp": "2027-03"}
            ]
        },
        {
            "name": "Jessica Miller",
            "email": "jessica.miller@kidsync.ai",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
            "headline": "STEM & Music Tutor with 4 Years Babysitting",
            "bio": "Undergraduate student in Pediatric Occupational Therapy. Loves introducing music and simple science experiments.",
            "rate": 22.0,
            "exp": 4,
            "rating": 4.9,
            "reviews": 63,
            "certs": [
                {"name": "Standard First Aid", "org": "Red Cross", "exp": "2026-12"}
            ]
        },
        {
            "name": "Amanda Lee",
            "email": "amanda.lee@kidsync.ai",
            "avatar": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
            "headline": "Special Needs Trained & Dependable Recurring Nanny",
            "bio": "Patient, structured, and certified in positive behavioral support. 5 years caring for multiple children.",
            "rate": 21.0,
            "exp": 5,
            "rating": 4.8,
            "reviews": 51,
            "certs": [
                {"name": "CPR / AED Certified", "org": "AHA", "exp": "2027-05"}
            ]
        }
    ]

    caregiver_records = {}

    for cdata in caregivers_data:
        u = User(
            email=cdata["email"],
            hashed_password="mock_hashed_password_caregiver2026",
            full_name=cdata["name"],
            role="caregiver",
            avatar_url=cdata["avatar"]
        )
        db.add(u)
        db.flush()

        cg = CaregiverProfile(
            user_id=u.id,
            headline=cdata["headline"],
            bio=cdata["bio"],
            hourly_rate=cdata["rate"],
            experience_years=cdata["exp"],
            service_area="San Francisco Bay Area",
            max_travel_km=15.0,
            languages=["English", "Hindi"] if "Sharma" in cdata["name"] or "Singh" in cdata["name"] or "Gupta" in cdata["name"] else ["English"],
            preferred_age_groups=["Infant", "Toddler", "Pre-school", "School-age"],
            special_skills=["Pediatric CPR", "Homework Tutoring", "Creative Arts", "Healthy Snacks"],
            verification_status="verified",
            background_check_status="verified",
            overall_rating=cdata["rating"],
            review_count=cdata["reviews"],
            profile_photo_url=cdata["avatar"]
        )
        db.add(cg)
        db.flush()
        caregiver_records[cdata["name"]] = cg

        # Certifications
        for cert in cdata["certs"]:
            c_rec = CaregiverCertification(
                caregiver_id=cg.id,
                name=cert["name"],
                issuing_org=cert["org"],
                expiry_date=cert["exp"],
                is_verified=True,
                verified_date="2026-01-15"
            )
            db.add(c_rec)

        # Weekly availability (Mon - Sun active)
        for day in range(7):
            av = CaregiverAvailability(
                caregiver_id=cg.id,
                day_of_week=day,
                start_time="08:00",
                end_time="19:00",
                is_active=True
            )
            db.add(av)

    # 3. Create Default Matching Request for Sarah
    match_req = MatchingRequest(
        parent_id=sarah_profile.id,
        care_type="Babysitting",
        child_age_range="Toddler & Preschool (2-4 yrs)",
        number_of_children=2,
        start_date="2026-10-16",
        is_recurring=True,
        min_budget=15.0,
        max_budget=25.0,
        currency="USD",
        location_area="San Francisco, CA (Within 10 km)",
        max_distance_km=10.0,
        required_languages=["English"],
        required_certifications=["Pediatric CPR / First Aid"],
        schedule_preferences={"days": ["Mon", "Tue", "Wed", "Thu"], "time_range": "3:00 PM - 7:00 PM"},
        special_requirements=["Allergen-conscious kitchen", "Non-smoker"],
        status="active"
    )
    db.add(match_req)
    db.flush()

    # Pre-calculated match results for Aarti, Priya, Meha
    db.add(MatchResult(
        request_id=match_req.id,
        caregiver_id=caregiver_records["Aarti Sharma"].id,
        overall_score=94.0,
        fit_score=95.0,
        suitability_score=96.0,
        score_breakdown={"availability": 100.0, "experience": 100.0, "budget": 100.0, "qualifications": 95.0, "preferences": 100.0},
        strengths=["Available Mon-Thu 3:00-7:00 PM", "Pediatric CPR & First Aid Certified", "$18/hr within your $15-$25 budget", "5+ years early childhood experience"],
        explanation="Aarti Sharma matches 94% with your care requirements. She is available during all requested weekday afternoon hours and holds verified Red Cross CPR certification."
    ))

    db.add(MatchResult(
        request_id=match_req.id,
        caregiver_id=caregiver_records["Priya Singh"].id,
        overall_score=91.0,
        fit_score=92.0,
        suitability_score=93.0,
        score_breakdown={"availability": 95.0, "experience": 90.0, "budget": 95.0, "qualifications": 92.0, "preferences": 95.0},
        strengths=["4+ years experience", "CPR / BLS Certified", "$20/hr within budget", "Available for scheduled sessions"],
        explanation="Priya Singh matches 91% with your criteria. Highly recommended for toddler engagement and structured afternoon routines."
    ))

    db.add(MatchResult(
        request_id=match_req.id,
        caregiver_id=caregiver_records["Meha Gupta"].id,
        overall_score=87.0,
        fit_score=88.0,
        suitability_score=89.0,
        score_breakdown={"availability": 88.0, "experience": 100.0, "budget": 100.0, "qualifications": 85.0, "preferences": 90.0},
        strengths=["6+ years experience", "$17/hr budget-friendly", "Homework tutoring", "Verified background check"],
        explanation="Meha Gupta has an 87% match score, offering rich experience in elementary learning and after-school guidance."
    ))

    # 4. Create Bookings (matching reference image)
    now = datetime.datetime.utcnow()

    # Active Booking with Priya Singh (Today 2:00 PM - 6:00 PM)
    b_active = Booking(
        parent_id=sarah_profile.id,
        caregiver_id=caregiver_records["Priya Singh"].id,
        care_type="Babysitting",
        number_of_children=2,
        start_time=datetime.datetime(2026, 10, 13, 14, 0, 0),
        end_time=datetime.datetime(2026, 10, 13, 18, 0, 0),
        hourly_rate=20.0,
        total_amount=80.0,
        status="in_progress",
        address="1428 Elm Grove Ave, San Francisco, CA",
        notes="Maya has craft project, Leo takes nap at 2:30 PM. Nut-free snack prepared."
    )
    db.add(b_active)
    db.flush()

    # Create active CareSession for Priya Singh
    session_active = CareSession(
        booking_id=b_active.id,
        caregiver_id=caregiver_records["Priya Singh"].id,
        parent_id=sarah_profile.id,
        scheduled_start=datetime.datetime(2026, 10, 13, 14, 0, 0),
        scheduled_end=datetime.datetime(2026, 10, 13, 18, 0, 0),
        actual_start=datetime.datetime(2026, 10, 13, 13, 58, 0),
        status="in_progress",
        summary="Session underway smoothly. Maya and Leo finished healthy afternoon snack and are building a lego spaceship.",
        ai_summary="AI Care Intelligence: Priya checked in promptly at 1:58 PM. Both Maya and Leo had snack at 2:15 PM (all allergy guidelines followed). Interactive playtime in progress. No safety concerns detected."
    )
    db.add(session_active)
    db.flush()

    # Add Session Events
    db.add(SessionEvent(
        session_id=session_active.id,
        event_type="checked_in",
        title="Caregiver Checked In",
        description="Priya Singh arrived and checked in via verified in-app geolocation.",
        created_at=datetime.datetime(2026, 10, 13, 13, 58, 0)
    ))
    db.add(SessionEvent(
        session_id=session_active.id,
        event_type="activity_update",
        title="Afternoon Snack & Story",
        description="Apple slices and almond-free oat cookies. Read 'The Gruffalo' with Maya and Leo.",
        created_at=datetime.datetime(2026, 10, 13, 14, 30, 0)
    ))
    db.add(SessionEvent(
        session_id=session_active.id,
        event_type="photo_added",
        title="Activity Photo Uploaded",
        description="Priya uploaded 2 photos from creative drawing time.",
        created_at=datetime.datetime(2026, 10, 13, 15, 15, 0)
    ))

    # Activity Updates
    act_update1 = ActivityUpdate(
        session_id=session_active.id,
        title="Creative Arts & Drawing",
        activity_type="play",
        notes="Maya drew a portrait of our family cat! Leo practiced stacking wooden blocks with big smiles.",
        created_at=datetime.datetime(2026, 10, 13, 15, 10, 0)
    )
    db.add(act_update1)
    db.flush()

    db.add(ActivityMedia(
        session_id=session_active.id,
        activity_update_id=act_update1.id,
        media_url="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
        caption="Maya working on her colorful watercolor painting"
    ))

    # Upcoming Booking 1: Emily Carter (Confirmed)
    b_emily = Booking(
        parent_id=sarah_profile.id,
        caregiver_id=caregiver_records["Emily Carter"].id,
        care_type="Babysitting",
        number_of_children=2,
        start_time=datetime.datetime(2026, 10, 16, 9, 0, 0),
        end_time=datetime.datetime(2026, 10, 16, 17, 0, 0),
        hourly_rate=19.0,
        total_amount=152.0,
        status="confirmed",
        address="1428 Elm Grove Ave, San Francisco, CA",
        notes="Full day care. Light lunch provided in fridge."
    )
    db.add(b_emily)

    # Upcoming Booking 2: Jessica Miller (Pending)
    b_jessica = Booking(
        parent_id=sarah_profile.id,
        caregiver_id=caregiver_records["Jessica Miller"].id,
        care_type="After School Care",
        number_of_children=1,
        start_time=datetime.datetime(2026, 10, 17, 15, 0, 0),
        end_time=datetime.datetime(2026, 10, 17, 19, 0, 0),
        hourly_rate=22.0,
        total_amount=88.0,
        status="pending",
        address="1428 Elm Grove Ave, San Francisco, CA",
        notes="Pick up Maya from Lincoln Elementary gate 2 at 3:15 PM."
    )
    db.add(b_jessica)

    # Upcoming Booking 3: Amanda Lee (Scheduled)
    b_amanda = Booking(
        parent_id=sarah_profile.id,
        caregiver_id=caregiver_records["Amanda Lee"].id,
        care_type="Recurring Care",
        number_of_children=2,
        start_time=datetime.datetime(2026, 10, 20, 8, 0, 0),
        end_time=datetime.datetime(2026, 10, 20, 16, 0, 0),
        hourly_rate=21.0,
        total_amount=168.0,
        status="scheduled",
        address="1428 Elm Grove Ave, San Francisco, CA",
        notes="Recurring Monday care."
    )
    db.add(b_amanda)

    # 5. Reviews for Caregivers
    db.add(Review(
        parent_id=sarah_profile.id,
        caregiver_id=caregiver_records["Aarti Sharma"].id,
        rating=5.0,
        comment="Aarti is extraordinary! Our 4-year-old adored her right away. She brought educational games and was thoroughly professional.",
        is_verified_booking=True
    ))
    db.add(Review(
        parent_id=sarah_profile.id,
        caregiver_id=caregiver_records["Priya Singh"].id,
        rating=5.0,
        comment="Priya brings wonderful calm and warmth. Her real-time photo check-ins gave us complete peace of mind while away.",
        is_verified_booking=True
    ))

    # 6. Notifications (matching reference image)
    db.add(Notification(
        user_id=sarah_user.id,
        title="Booking Confirmed",
        message="Your booking with Emily Carter is confirmed.",
        notification_type="booking",
        is_read=False,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2)
    ))
    db.add(Notification(
        user_id=sarah_user.id,
        title="New Match Available",
        message="We found 3 new caregivers for your request.",
        notification_type="match",
        is_read=False,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=4)
    ))
    db.add(Notification(
        user_id=sarah_user.id,
        title="Payment Successful",
        message="$120.00 paid for session on Oct 12, 2026.",
        notification_type="payment",
        is_read=False,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
    ))
    db.add(Notification(
        user_id=sarah_user.id,
        title="Caregiver Update",
        message="Jessica Miller shared 5 photos from today's session.",
        notification_type="activity",
        is_read=True,
        created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
    ))

    # 7. Payment Methods
    pm = PaymentMethod(
        user_id=sarah_user.id,
        provider="stripe_test",
        brand="Visa",
        last4="4242",
        exp_month=12,
        exp_year=2028,
        is_default=True
    )
    db.add(pm)
    db.flush()

    # 8. Past Completed Transactions (for Completed Sessions: 5 this month)
    past_dates = [1, 3, 5, 8, 12]
    for d in past_dates:
        db.add(PaymentTransaction(
            user_id=sarah_user.id,
            amount=120.0,
            currency="USD",
            status="successful",
            payment_method_id=pm.id,
            description=f"Childcare Session - Oct {d:02d}, 2026",
            receipt_url=f"https://kidsync.ai/receipts/rec_202610{d:02d}",
            created_at=datetime.datetime(2026, 10, d, 18, 0, 0)
        ))

    db.commit()
    print("KidSync AI Database successfully seeded with high-fidelity production data!")
