from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime
from ..database import get_db
from ..models import PaymentMethod, PaymentTransaction, User
from ..schemas import PaymentMethodOut, PaymentTransactionOut

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.get("/methods", response_model=List[PaymentMethodOut])
def get_payment_methods(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "sarah.johnson@kidsync.ai").first()
    user_id = user.id if user else 1
    return db.query(PaymentMethod).filter(PaymentMethod.user_id == user_id).all()

@router.post("/setup")
def add_payment_method(card_last4: str = "4242", brand: str = "Visa", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "sarah.johnson@kidsync.ai").first()
    user_id = user.id if user else 1

    pm = PaymentMethod(
        user_id=user_id,
        provider="stripe_test",
        brand=brand,
        last4=card_last4,
        exp_month=8,
        exp_year=2028,
        is_default=False
    )
    db.add(pm)
    db.commit()
    db.refresh(pm)
    return {"message": "Payment method saved securely", "id": pm.id, "last4": pm.last4}

@router.delete("/methods/{method_id}")
def delete_payment_method(method_id: int, db: Session = Depends(get_db)):
    pm = db.query(PaymentMethod).filter(PaymentMethod.id == method_id).first()
    if not pm:
        raise HTTPException(status_code=404, detail="Payment method not found")
    db.delete(pm)
    db.commit()
    return {"message": "Payment method removed"}

@router.get("/transactions", response_model=List[PaymentTransactionOut])
def get_transactions(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "sarah.johnson@kidsync.ai").first()
    user_id = user.id if user else 1
    return db.query(PaymentTransaction).filter(PaymentTransaction.user_id == user_id).order_by(PaymentTransaction.created_at.desc()).all()
