import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_auth_me():
    response = client.get("/api/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert "Sarah Johnson" in data["full_name"]
    assert data["role"] == "parent"

def test_parent_dashboard():
    response = client.get("/api/dashboard/parent")
    assert response.status_code == 200
    data = response.json()
    assert data["parent_name"] == "Sarah Johnson"
    assert data["upcoming_bookings_count"] >= 1
    assert data["active_sessions_count"] == 1
    assert data["active_session"] is not None
    assert "Priya Singh" in data["active_session"]["caregiver_name"]

def test_caregivers_listing():
    response = client.get("/api/caregivers")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    names = [c["full_name"] for c in data]
    assert "Aarti Sharma" in names
    assert "Priya Singh" in names
    assert "Meha Gupta" in names

def test_caregiver_detail():
    response = client.get("/api/caregivers/1")
    assert response.status_code == 200
    data = response.json()
    assert data["verification_status"] == "verified"
    assert len(data["certifications"]) >= 1

def test_matching_intake_and_scoring():
    payload = {
        "care_type": "Babysitting",
        "child_age_range": "Toddler (2-4 yrs)",
        "number_of_children": 2,
        "start_date": "2026-10-16",
        "is_recurring": True,
        "min_budget": 15.0,
        "max_budget": 25.0,
        "currency": "USD",
        "location_area": "San Francisco, CA",
        "max_distance_km": 10.0,
        "required_languages": ["English"],
        "required_certifications": ["Pediatric First Aid & CPR"],
        "schedule_days": ["Mon", "Tue", "Wed", "Thu"],
        "schedule_time_range": "3:00 PM - 7:00 PM",
        "special_requirements": ["Non-smoker"]
    }
    response = client.post("/api/matching/requests", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["eligible_count"] >= 3
    top = data["results"][0]
    assert top["overall_score"] >= 80.0
    assert len(top["strengths"]) > 0
    assert len(top["explanation"]) > 10

def test_booking_conflict_prevention():
    # Attempt booking Priya during existing active hours
    conflict_payload = {
        "caregiver_id": 2,  # Priya Singh
        "care_type": "Babysitting",
        "number_of_children": 2,
        "start_time": "2026-10-13T15:00:00",
        "end_time": "2026-10-13T17:00:00",
        "notes": "Test conflict booking",
        "address": "1428 Elm Grove Ave, San Francisco, CA"
    }
    response = client.post("/api/bookings", json=conflict_payload)
    assert response.status_code == 400
    assert "Scheduling conflict" in response.json()["detail"]

def test_live_session_activity_and_summary():
    response = client.get("/api/sessions/1")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "in_progress"
    assert len(data["events"]) >= 1

    # Add activity
    act_payload = {
        "title": "Evening Storytime",
        "notes": "Read bedtime story books and washed hands.",
        "activity_type": "reading"
    }
    res_act = client.post("/api/sessions/1/activity", json=act_payload)
    assert res_act.status_code == 200

def test_payment_methods():
    response = client.get("/api/payments/methods")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["last4"] == "4242"
