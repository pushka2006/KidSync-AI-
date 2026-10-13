from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ..database import get_db
from ..models import User, ParentProfile

router = APIRouter(prefix="/account", tags=["Account"])

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    preferred_contact: Optional[str] = None

@router.get("/profile")
def get_profile(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "sarah.johnson@kidsync.ai").first()
    if not user:
        user = db.query(User).filter(User.role == "parent").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    parent_prof = user.parent_profile
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "phone": user.phone,
        "avatar_url": user.avatar_url,
        "address": parent_prof.address if parent_prof else "1428 Elm Grove Ave",
        "city": parent_prof.city if parent_prof else "San Francisco",
        "state": parent_prof.state if parent_prof else "CA",
        "zip_code": parent_prof.zip_code if parent_prof else "94107",
        "emergency_contact": parent_prof.emergency_contact if parent_prof else "Mark Johnson (+1 415-555-0199)",
        "preferred_contact": parent_prof.preferred_contact if parent_prof else "In-App & SMS",
        "children_count": parent_prof.children_count if parent_prof else 2,
        "children_info": parent_prof.children_info if parent_prof else []
    }

@router.patch("/profile")
def update_profile(payload: ProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "sarah.johnson@kidsync.ai").first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.full_name:
        user.full_name = payload.full_name
    if payload.phone:
        user.phone = payload.phone

    p = user.parent_profile
    if p:
        if payload.emergency_contact is not None:
            p.emergency_contact = payload.emergency_contact
        if payload.address is not None:
            p.address = payload.address
        if payload.city is not None:
            p.city = payload.city
        if payload.state is not None:
            p.state = payload.state
        if payload.zip_code is not None:
            p.zip_code = payload.zip_code
        if payload.preferred_contact is not None:
            p.preferred_contact = payload.preferred_contact

    db.commit()
    return {"message": "Profile updated successfully"}
