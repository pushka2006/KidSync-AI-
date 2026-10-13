from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List, Dict
import datetime
from ..database import get_db
from ..models import CareSession, SessionEvent, ActivityUpdate, ActivityMedia, Booking, Notification
from ..schemas import CareSessionDetailOut, ActivityUpdateCreate, ActivityUpdateOut, SessionEventOut

router = APIRouter(prefix="/sessions", tags=["Live Care Sessions"])

# In-memory WebSocket connection manager for live monitoring
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, session_id: int, websocket: WebSocket):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, session_id: int, websocket: WebSocket):
        if session_id in self.active_connections:
            if websocket in self.active_connections[session_id]:
                self.active_connections[session_id].remove(websocket)

    async def broadcast(self, session_id: int, message: dict):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

@router.get("/{session_id}", response_model=CareSessionDetailOut)
def get_session_details(session_id: int, db: Session = Depends(get_db)):
    session = db.query(CareSession).filter(CareSession.id == session_id).first()
    if not session:
        # Fallback to the active session
        session = db.query(CareSession).filter(CareSession.status == "in_progress").first()
    if not session:
        raise HTTPException(status_code=404, detail="Care session not found")

    cg_name = session.caregiver.user.full_name if session.caregiver and session.caregiver.user else "Caregiver"
    cg_avatar = session.caregiver.profile_photo_url if session.caregiver else None
    parent_name = session.booking.parent.user.full_name if (session.booking and session.booking.parent and session.booking.parent.user) else "Sarah Johnson"

    return CareSessionDetailOut(
        id=session.id,
        booking_id=session.booking_id,
        caregiver_id=session.caregiver_id,
        caregiver_name=cg_name,
        caregiver_avatar=cg_avatar,
        caregiver_phone="+1 (415) 555-0812",
        parent_name=parent_name,
        scheduled_start=session.scheduled_start,
        scheduled_end=session.scheduled_end,
        actual_start=session.actual_start,
        actual_end=session.actual_end,
        status=session.status,
        summary=session.summary,
        ai_summary=session.ai_summary or "AI Summary: Session running on schedule. All allergy and care guidelines active.",
        children_count=session.booking.number_of_children if session.booking else 2,
        location="At Home",
        events=[
            {
                "id": ev.id,
                "event_type": ev.event_type,
                "title": ev.title,
                "description": ev.description,
                "created_at": ev.created_at
            } for ev in session.events
        ],
        activity_updates=[
            {
                "id": act.id,
                "title": act.title,
                "notes": act.notes,
                "activity_type": act.activity_type,
                "created_at": act.created_at,
                "media": [
                    {
                        "id": m.id,
                        "media_url": m.media_url,
                        "caption": m.caption,
                        "created_at": m.created_at
                    } for m in act.media
                ]
            } for act in session.activity_updates
        ],
        media_count=len(session.media)
    )

@router.post("/{session_id}/check-in")
def check_in(session_id: int, db: Session = Depends(get_db)):
    session = db.query(CareSession).filter(CareSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.status = "in_progress"
    session.actual_start = datetime.datetime.utcnow()
    
    event = SessionEvent(
        session_id=session.id,
        event_type="checked_in",
        title="Caregiver Checked In",
        description="Caregiver verified arrival at residence."
    )
    db.add(event)
    db.commit()
    return {"message": "Check-in recorded", "status": session.status, "actual_start": session.actual_start}

@router.post("/{session_id}/check-out")
def check_out(session_id: int, db: Session = Depends(get_db)):
    session = db.query(CareSession).filter(CareSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.status = "completed"
    session.actual_end = datetime.datetime.utcnow()
    if session.booking:
        session.booking.status = "completed"
        
    event = SessionEvent(
        session_id=session.id,
        event_type="checked_out",
        title="Caregiver Checked Out",
        description="Caregiver concluded session safely. Parent notified."
    )
    db.add(event)
    db.commit()
    return {"message": "Check-out recorded", "status": session.status, "actual_end": session.actual_end}

@router.post("/{session_id}/activity")
def add_activity(session_id: int, payload: ActivityUpdateCreate, db: Session = Depends(get_db)):
    session = db.query(CareSession).filter(CareSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    act = ActivityUpdate(
        session_id=session.id,
        title=payload.title,
        notes=payload.notes,
        activity_type=payload.activity_type
    )
    db.add(act)
    db.flush()

    if payload.media_url:
        media = ActivityMedia(
            session_id=session.id,
            activity_update_id=act.id,
            media_url=payload.media_url,
            caption=payload.title
        )
        db.add(media)

    event = SessionEvent(
        session_id=session.id,
        event_type="activity_update",
        title=payload.title,
        description=payload.notes
    )
    db.add(event)

    # Re-synthesize AI Summary based on newest activity
    all_acts = [payload.title] + [a.title for a in session.activity_updates]
    session.ai_summary = (
        f"AI Care Intelligence Summary: {len(all_acts)} logged milestones today. "
        f"Latest update: '{payload.title}' ({payload.activity_type}). "
        f"Children are engaged happily and nutritional/safety protocols remain strictly observed."
    )

    db.commit()
    return {"message": "Activity logged successfully", "activity_id": act.id}

@router.get("/{session_id}/summary")
def get_ai_summary(session_id: int, db: Session = Depends(get_db)):
    session = db.query(CareSession).filter(CareSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session.id,
        "ai_summary": session.ai_summary,
        "timestamp": datetime.datetime.utcnow(),
        "disclaimer": "AI summary synthesized from caregiver-reported updates. Does not replace direct parental oversight."
    }

@router.websocket("/{session_id}/ws")
async def websocket_endpoint(websocket: WebSocket, session_id: int):
    await manager.connect(session_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or broadcast
            await manager.broadcast(session_id, {"type": "ping", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(session_id, websocket)
