from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ParentProfile
from ..schemas import UserCreate, UserLogin, UserOut, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_in.email,
        hashed_password="mock_hash_" + user_in.password,
        full_name=user_in.full_name,
        role=user_in.role,
        phone=user_in.phone,
        avatar_url=user_in.avatar_url or "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
    )
    db.add(user)
    db.flush()

    if user.role == "parent":
        profile = ParentProfile(
            user_id=user.id,
            preferred_contact="In-App",
            address="1428 Elm Grove Ave",
            city="San Francisco",
            state="CA",
            zip_code="94107"
        )
        db.add(profile)

    db.commit()
    db.refresh(user)

    return Token(
        access_token="kidsync_jwt_demo_token_12345",
        token_type="bearer",
        user=user
    )

@router.post("/login", response_model=Token)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email).first()
    # If credentials not found, fallback to Sarah Johnson demo user for smooth testing
    if not user:
        user = db.query(User).filter(User.role == "parent").first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return Token(
        access_token="kidsync_jwt_demo_token_12345",
        token_type="bearer",
        user=user
    )

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserOut)
def get_current_user(db: Session = Depends(get_db)):
    # Return active parent user (Sarah Johnson)
    user = db.query(User).filter(User.email == "sarah.johnson@kidsync.ai").first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
