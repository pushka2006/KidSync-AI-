from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .routers import auth, dashboard, caregivers, matching, bookings, sessions, payments, notifications, account

# Ensure database tables and initial seed data are populated
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema & seed if needed
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="KidSync AI API",
    description="Full-stack AI-Powered Caregiver Discovery, Matching, Booking & Live Monitoring Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api
app.include_router(auth.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(caregivers.router, prefix="/api")
app.include_router(matching.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(account.router, prefix="/api")

@app.get("/")
def root():
    return {
        "service": "KidSync AI Backend",
        "status": "online",
        "documentation": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
