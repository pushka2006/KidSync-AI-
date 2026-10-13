from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Notification, User
from ..schemas import NotificationOut

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationOut])
def get_notifications(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "sarah.johnson@kidsync.ai").first()
    user_id = user.id if user else 1
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

@router.patch("/{notification_id}/read")
def mark_read(notification_id: int, db: Session = Depends(get_db)):
    n = db.query(Notification).filter(Notification.id == notification_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    db.commit()
    return {"message": "Marked as read", "id": notification_id}

@router.post("/mark-all-read")
def mark_all_read(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "sarah.johnson@kidsync.ai").first()
    user_id = user.id if user else 1
    db.query(Notification).filter(Notification.user_id == user_id).update({Notification.is_read: True})
    db.commit()
    return {"message": "All notifications marked as read"}
