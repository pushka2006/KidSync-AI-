# KidSync AI — AI-Powered Caregiver Discovery, Matching, Booking & Live Monitoring Platform

![KidSync AI](https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80)

> **Trusted Care. Brighter Tomorrows.**  
> A production-oriented, full-stack childcare marketplace that connects parents with verified caregivers through explainable AI-assisted matching, transparent profiles, conflict-preventing booking, live check-in monitoring, and integrated payments.

---

## 🌟 Key Features & Seven Connected Experiences

### 1. Landing / Marketing Page
- Public-facing homepage introducing KidSync AI trust & safety standards.
- Three core value proposition pillars: **Key Care Propositions**, **Trust & Safety**, and **Warm Care Highlights**.
- 4-point caregiver verification breakdown and interactive walkthrough.

### 2. Parent Dashboard — Central Hub
- Pixel-perfect reproduction of the reference design.
- **Deep Navy Persistent Sidebar**: Navigation with active states, unread badge counters, user card, and quick logout.
- **Hero Banner**: "Good Morning, Sarah!" greeting with family photography, "Happy Kids, Happy Parents" callout, and "Find Care Now" CTA.
- **Quick AI Matching Card**: Stepper walkthrough and quick match entry.
- **4 Real-Time Metrics**: Upcoming Bookings, Completed Sessions, Pending Requests, and Unread Notifications.
- **Active Care Session Widget**: Pulsing "Live Now" indicator with one-click transition to live monitoring.
- **3-Column Grid Layout**:
  - Upcoming Bookings (Confirmed, Pending, Scheduled status tags).
  - Active Session & Recent Activity Notifications.
  - Top AI Matching Results with circular match scores, verified badges, and rate cards.

### 3. AI Matching Intake Wizard
- Multi-step interactive wizard collecting childcare requirements:
  - **Step 1: Care Needs**: Care arrangement type, child ages, number of children, recurrence.
  - **Step 2: Location & Preferences**: Service area, travel distance radius slider, language preferences.
  - **Step 3: Budget Range**: Dual slider with fair-market rate validation and flexibility toggle.
  - **Step 4: Availability Grid**: Mon-Sun interactive matrix with morning, afternoon, and evening time blocks.
  - **Step 5: Special Requirements**: Mandatory vs preferred certifications (Pediatric First Aid/CPR, Montessori, allergy precautions).
  - **Step 6: Review & Submit**: Comprehensive preview before triggering the scoring pipeline.

### 4. Explainable AI Match Results
- Ranked caregiver discovery with two evaluation perspectives:
  - **Ranked by Fit (Parent Preferences)**: Weights availability (30%), experience (25%), budget (20%), qualifications (15%), and preferences (10%).
  - **Ranked by Overall Suitability**: Incorporates historical review volume and verification depth.
- Transparent score factor meters showing individual category scores.
- Dynamic natural-language match rationale.
- Interactive rate and experience filters with empty-state handling.

### 5. Caregiver Detail Profile
- Comprehensive profile pages for vetted caregivers (Aarti Sharma, Priya Singh, Meha Gupta, etc.).
- Transparent background check badges and Red Cross / AMI certification verification dates.
- Verified parent reviews and star ratings.
- Weekly availability schedule overview.
- Modal booking request flow with server-side rate calculation and double-booking conflict prevention.

### 6. Live Care Monitoring & Activity Stream
- Real-time monitoring screen for active care sessions (Priya Singh).
- **Check-in Timeline**: Geolocation-verified caregiver arrival, snacks, storytime, and activity milestones.
- **Activity Stream & Photos**: High-resolution photo moments with lightbox viewer.
- **AI Care Intelligence Summary**: Synthesized natural-language status update generated exclusively from verified updates.
- **Interactive Caregiver Simulation Tool**: Test caregiver updates, new photos, and instant AI re-summarization in demo mode.

### 7. Account & Payment Settings
- Parent profile management (contact details, emergency contacts, children notes).
- Saved payment methods (PCI-DSS compliant test Stripe cards).
- Transaction history with invoices and downloadable receipts.
- Multi-channel notification preferences (SMS, push, email).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend** | FastAPI, Python 3.12, Pydantic v2, SQLAlchemy ORM, Uvicorn, WebSockets |
| **Database** | SQLite (development/local) / PostgreSQL ready, relational models with foreign keys |
| **Testing** | Pytest, FastAPI TestClient, Next.js production compiler validation |

---

## 📂 Project Directory Structure

```
kidsyncai/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app & lifespan DB initialization
│   │   ├── config.py            # App configuration
│   │   ├── database.py          # SQLAlchemy session & engine
│   │   ├── models.py            # Relational models (Users, Bookings, Sessions, etc.)
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   ├── matching_engine.py   # Modular explainable weighted matching algorithm
│   │   ├── seed_data.py         # Production demo seed generator
│   │   └── routers/
│   │       ├── auth.py          # Authentication & user profile
│   │       ├── dashboard.py     # Aggregated parent dashboard
│   │       ├── caregivers.py    # Caregiver discovery & profile endpoints
│   │       ├── matching.py      # Matching requests & results
│   │       ├── bookings.py      # Bookings & scheduling conflict checks
│   │       ├── sessions.py      # Live care monitoring & WebSockets
│   │       ├── payments.py      # Cards & transaction records
│   │       ├── notifications.py # Notification management
│   │       └── account.py       # Profile settings
│   ├── tests/
│   │   └── test_kidsync.py      # Comprehensive 9-suite backend integration tests
│   ├── requirements.txt         # Backend Python packages
│   └── run.py                   # Uvicorn server launcher
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css      # Design system styles
│   │   │   ├── layout.tsx       # Root layout & SEO metadata
│   │   │   └── page.tsx         # Unified application entrypoint
│   │   ├── components/
│   │   │   ├── Sidebar.tsx      # Navy persistent navigation sidebar
│   │   │   ├── TopHeader.tsx    # Search bar & user controls
│   │   │   ├── DashboardView.tsx # Central Parent Hub (matches reference image)
│   │   │   ├── IntakeWizardView.tsx # 6-step AI matching wizard
│   │   │   ├── MatchResultsView.tsx # Explainable recommendation results
│   │   │   ├── CaregiverProfileView.tsx # Caregiver profile & credentials
│   │   │   ├── LiveMonitoringView.tsx   # Live session monitoring & stream
│   │   │   ├── BookingsView.tsx # Bookings management & cancellation
│   │   │   ├── SettingsView.tsx # Account, payments & notifications
│   │   │   ├── LandingPageView.tsx # Public marketing site
│   │   │   ├── BookingModal.tsx # Booking dialog with price estimation
│   │   │   ├── NotificationCenterModal.tsx # In-app notification drawer
│   │   │   └── HowItWorksModal.tsx # Video/Platform walkthrough modal
│   │   ├── lib/
│   │   │   └── api.ts           # Resilient API client connecting to backend
│   │   └── types/
│   │       └── index.ts         # TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24.14.0)
- **Python**: v3.10+ (tested on v3.12.10)
- **Git**

### 2. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the test suite
python -m pytest tests/test_kidsync.py

# Start the FastAPI server (runs on http://localhost:8000)
python run.py
```
*API interactive documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).*

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server (runs on http://localhost:3000)
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## 🧪 Automated Testing

### Backend Unit & Integration Tests
The backend includes 9 test suites validating core system behavior:
```bash
cd backend
python -m pytest tests/test_kidsync.py
```
Tests cover:
- Health checks and system status.
- Authentication and user permissions.
- Parent dashboard aggregations.
- Caregiver listing and credential verification.
- AI matching intake and explainable scoring weights.
- Booking conflict detection and double-booking prevention.
- Live session check-in, activity logging, and AI summary synthesis.
- Secure payment methods.

### Frontend Compilation & Type Checking
```bash
cd frontend
npm run build
```

---

## 🔒 Security & Privacy Practices
- **No plaintext credentials**: Passwords hashed; payment credentials handled via secure tokens.
- **Privacy preservation**: Parent full street addresses are never exposed to public marketplace search results.
- **Server-side validation**: All booking pricing and conflict checks are validated server-side.
- **Truth in verification**: Verified badges are only issued when backing verification records exist in the database.

---

## 📄 License
MIT License. © 2026 KidSync AI Inc.
