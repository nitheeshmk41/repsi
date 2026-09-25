from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.middleware.tenant import get_current_tenant, TenantContext
from app.models.trainer import (
    Trainer,
    TrainerStatus,
    TrainerClient,
    TrainerClientStatus,
    TrainingSession,
    SessionStatus,
    ClientNote,
    GymClass,
)
from app.models.member import Member
from app.models.user import User
from app.models.system import Notification
from app.models.workout import Workout, WorkoutStatus
from app.schemas.trainer import (
    TrainerCreate,
    TrainerUpdate,
    TrainerResponse,
    TrainerClientAssignRequest,
    TrainerClientRequest,
    TrainerClientStatusUpdate,
    TrainerClientResponse,
    WorkoutCreateRequest,
    WorkoutUpdateRequest,
    WorkoutResponse,
    SessionCreateRequest,
    SessionUpdateRequest,
    SessionResponse,
    ClientNoteCreateRequest,
    ClientNoteResponse,
)
from app.services.trainer import TrainerService

router = APIRouter(tags=["Trainers & Training Operations"])


# ----------------------------------------------------
# 1. TRAINER MANAGEMENT ENDPOINTS (Owner & Trainer)
# ----------------------------------------------------

@router.get("/trainers", response_model=List[TrainerResponse])
def get_trainers(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)
    return service.list_trainers()


@router.post("/trainers", response_model=TrainerResponse, status_code=status.HTTP_201_CREATED)
def create_trainer(
    data: TrainerCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    if tenant.role not in ["OWNER", "SUPER_ADMIN", "ADMIN", "MANAGER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only gym owners and managers can add trainers directly."
        )

    service = TrainerService(db, tenant)
    # Check if trainer with email already exists in workspace
    if data.email:
        existing = db.query(Trainer).filter(
            Trainer.workspace_id == tenant.workspace_id,
            Trainer.email == data.email.lower().strip(),
            Trainer.status != TrainerStatus.REMOVED
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Trainer with this email already exists.")

    trainer = Trainer(
        workspace_id=tenant.workspace_id,
        name=data.name.strip(),
        phone=data.phone.strip(),
        email=data.email.lower().strip() if data.email else None,
        specialization=data.specialization or "General Fitness",
        hourly_rate=data.hourly_rate,
        commission_percentage=data.commission_percentage,
        bio=data.bio,
        experience=data.experience,
        joining_date=data.joining_date,
        certifications=data.certifications,
        working_hours=data.working_hours,
        emergency_contact=data.emergency_contact,
        status=TrainerStatus.ACTIVE,
        is_active=True,
    )
    db.add(trainer)
    db.commit()
    db.refresh(trainer)

    return service.list_trainers()[0] if False else {
        **trainer.__dict__,
        "assigned_clients_count": 0,
        "today_sessions_count": 0,
    }


@router.get("/trainers/me", response_model=TrainerResponse)
def get_current_trainer_profile(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)
    trainer = service.verify_trainer_access()
    
    clients_count = db.query(TrainerClient).filter(
        TrainerClient.workspace_id == tenant.workspace_id,
        TrainerClient.trainer_id == trainer.id,
        TrainerClient.status == TrainerClientStatus.ACTIVE
    ).count()

    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start.replace(hour=23, minute=59, second=59)

    today_sessions = db.query(TrainingSession).filter(
        TrainingSession.workspace_id == tenant.workspace_id,
        TrainingSession.trainer_id == trainer.id,
        TrainingSession.scheduled_at >= today_start,
        TrainingSession.scheduled_at <= today_end
    ).count()

    return {
        **trainer.__dict__,
        "assigned_clients_count": clients_count,
        "today_sessions_count": today_sessions,
    }


@router.get("/trainers/me/clients")
def get_current_trainer_clients(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)
    trainer = service.verify_trainer_access()
    return service.get_assigned_clients(trainer.id, search=search, filter_status=status_filter)


@router.get("/trainers/me/schedule")
def get_current_trainer_schedule(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)
    trainer = service.verify_trainer_access()

    sessions = db.query(TrainingSession).filter(
        TrainingSession.workspace_id == tenant.workspace_id,
        TrainingSession.trainer_id == trainer.id
    ).order_by(TrainingSession.scheduled_at.asc()).all()

    classes = db.query(GymClass).filter(
        GymClass.workspace_id == tenant.workspace_id,
        GymClass.trainer_id == trainer.id,
        GymClass.is_active == True
    ).all()

    session_list = []
    for s in sessions:
        client_name = None
        if s.client_id:
            m = db.query(Member).filter(Member.id == s.client_id).first()
            if m:
                client_name = f"{m.first_name} {m.last_name}".strip()

        session_list.append({
            "id": s.id,
            "title": s.title,
            "scheduled_at": s.scheduled_at,
            "duration_minutes": s.duration_minutes,
            "status": s.status.value,
            "client_id": s.client_id,
            "client_name": client_name,
            "class_id": s.class_id,
            "notes": s.notes,
            "type": "SESSION"
        })

    class_list = [{
        "id": c.id,
        "title": c.name,
        "category": c.category,
        "schedule": c.schedule,
        "duration_minutes": c.duration_minutes,
        "capacity": c.capacity,
        "room": c.room,
        "type": "CLASS"
    } for c in classes]

    return {
        "sessions": session_list,
        "classes": class_list
    }


@router.get("/trainers/{trainer_id}", response_model=TrainerResponse)
def get_trainer_by_id(
    trainer_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)
    trainer = db.query(Trainer).filter(
        Trainer.workspace_id == tenant.workspace_id,
        Trainer.id == trainer_id
    ).first()
    if not trainer or trainer.status == TrainerStatus.REMOVED:
        raise HTTPException(status_code=404, detail="Trainer not found.")

    clients_count = db.query(TrainerClient).filter(
        TrainerClient.workspace_id == tenant.workspace_id,
        TrainerClient.trainer_id == trainer.id,
        TrainerClient.status == TrainerClientStatus.ACTIVE
    ).count()

    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start.replace(hour=23, minute=59, second=59)

    today_sessions = db.query(TrainingSession).filter(
        TrainingSession.workspace_id == tenant.workspace_id,
        TrainingSession.trainer_id == trainer.id,
        TrainingSession.scheduled_at >= today_start,
        TrainingSession.scheduled_at <= today_end
    ).count()

    return {
        **trainer.__dict__,
        "assigned_clients_count": clients_count,
        "today_sessions_count": today_sessions,
    }


@router.patch("/trainers/{trainer_id}", response_model=TrainerResponse)
def update_trainer(
    trainer_id: str,
    data: TrainerUpdate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    if tenant.role not in ["OWNER", "SUPER_ADMIN", "ADMIN", "MANAGER"]:
        service = TrainerService(db, tenant)
        current_trainer = service.verify_trainer_access()
        if current_trainer.id != trainer_id:
            raise HTTPException(status_code=403, detail="Cannot edit another trainer's profile.")

    trainer = db.query(Trainer).filter(
        Trainer.workspace_id == tenant.workspace_id,
        Trainer.id == trainer_id
    ).first()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found.")

    update_data = data.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        setattr(trainer, key, val)

    if data.status:
        trainer.is_active = (data.status == TrainerStatus.ACTIVE)

    db.commit()
    db.refresh(trainer)

    clients_count = db.query(TrainerClient).filter(
        TrainerClient.workspace_id == tenant.workspace_id,
        TrainerClient.trainer_id == trainer.id,
        TrainerClient.status == TrainerClientStatus.ACTIVE
    ).count()

    return {
        **trainer.__dict__,
        "assigned_clients_count": clients_count,
        "today_sessions_count": 0,
    }


@router.delete("/trainers/{trainer_id}")
def delete_trainer(
    trainer_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    if tenant.role not in ["OWNER", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Only owners can remove trainers.")

    trainer = db.query(Trainer).filter(
        Trainer.workspace_id == tenant.workspace_id,
        Trainer.id == trainer_id
    ).first()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found.")

    # Soft delete
    trainer.status = TrainerStatus.REMOVED
    trainer.is_active = False

    # Deactivate trainer client relationships
    db.query(TrainerClient).filter(
        TrainerClient.workspace_id == tenant.workspace_id,
        TrainerClient.trainer_id == trainer_id
    ).update({"status": TrainerClientStatus.ENDED, "ended_at": datetime.now(timezone.utc)})

    db.commit()
    return {"status": "success", "message": "Trainer soft-deleted and unassigned from active clients."}


# ----------------------------------------------------
# 2. TRAINER ↔ CLIENT RELATIONSHIP ENDPOINTS
# ----------------------------------------------------

@router.post("/trainer-client/assign", response_model=TrainerClientResponse)
def assign_trainer_client(
    data: TrainerClientAssignRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)
    relationship = service.assign_client_to_trainer(
        trainer_id=data.trainer_id,
        client_id=data.client_id,
        notes=data.notes
    )
    
    trainer = db.query(Trainer).filter(Trainer.id == data.trainer_id).first()
    member = db.query(Member).filter(Member.id == data.client_id).first()

    return {
        **relationship.__dict__,
        "trainer_name": trainer.name if trainer else None,
        "client_name": f"{member.first_name} {member.last_name}".strip() if member else None,
        "client_email": member.email if member else None,
        "client_phone": member.phone if member else None,
    }


@router.post("/trainer-client/request", response_model=TrainerClientResponse)
def request_trainer_client(
    data: TrainerClientRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)
    trainer = service.verify_trainer_access()
    relationship = service.assign_client_to_trainer(
        trainer_id=trainer.id,
        client_id=data.client_id,
        notes=data.notes
    )

    member = db.query(Member).filter(Member.id == data.client_id).first()
    return {
        **relationship.__dict__,
        "trainer_name": trainer.name,
        "client_name": f"{member.first_name} {member.last_name}".strip() if member else None,
        "client_email": member.email if member else None,
        "client_phone": member.phone if member else None,
    }


@router.patch("/trainer-client/{relationship_id}", response_model=TrainerClientResponse)
def update_trainer_client_status(
    relationship_id: str,
    data: TrainerClientStatusUpdate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    relationship = db.query(TrainerClient).filter(
        TrainerClient.workspace_id == tenant.workspace_id,
        TrainerClient.id == relationship_id
    ).first()
    if not relationship:
        raise HTTPException(status_code=404, detail="Trainer-client relationship not found.")

    service = TrainerService(db, tenant)
    if tenant.role not in ["OWNER", "SUPER_ADMIN"]:
        service.verify_trainer_access(relationship.trainer_id)

    relationship.status = data.status
    if data.notes:
        relationship.notes = data.notes
    if data.status in [TrainerClientStatus.ENDED, TrainerClientStatus.INACTIVE]:
        relationship.ended_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(relationship)

    trainer = db.query(Trainer).filter(Trainer.id == relationship.trainer_id).first()
    member = db.query(Member).filter(Member.id == relationship.client_id).first()

    return {
        **relationship.__dict__,
        "trainer_name": trainer.name if trainer else None,
        "client_name": f"{member.first_name} {member.last_name}".strip() if member else None,
        "client_email": member.email if member else None,
        "client_phone": member.phone if member else None,
    }


@router.delete("/trainer-client/{relationship_id}")
def delete_trainer_client_relationship(
    relationship_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    relationship = db.query(TrainerClient).filter(
        TrainerClient.workspace_id == tenant.workspace_id,
        TrainerClient.id == relationship_id
    ).first()
    if not relationship:
        raise HTTPException(status_code=404, detail="Relationship not found.")

    service = TrainerService(db, tenant)
    if tenant.role not in ["OWNER", "SUPER_ADMIN"]:
        service.verify_trainer_access(relationship.trainer_id)

    service.unassign_client_from_trainer(relationship.trainer_id, relationship.client_id)
    return {"status": "success", "message": "Trainer-client assignment ended."}


@router.get("/clients/{client_id}/trainers")
def get_client_trainers(
    client_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    # Retrieve active trainers for member
    relationships = db.query(TrainerClient, Trainer).join(
        Trainer, TrainerClient.trainer_id == Trainer.id
    ).filter(
        TrainerClient.workspace_id == tenant.workspace_id,
        TrainerClient.client_id == client_id,
        TrainerClient.status == TrainerClientStatus.ACTIVE,
        Trainer.status == TrainerStatus.ACTIVE
    ).all()

    return [{
        "relationship_id": tc.id,
        "trainer_id": t.id,
        "name": t.name,
        "email": t.email,
        "phone": t.phone,
        "specialization": t.specialization,
        "bio": t.bio,
        "profile_photo": t.profile_photo,
        "experience": t.experience,
        "assigned_at": tc.assigned_at
    } for tc, t in relationships]


# ----------------------------------------------------
# 3. WORKOUT MANAGEMENT ENDPOINTS
# ----------------------------------------------------

@router.get("/trainer/clients/{client_id}/workouts", response_model=List[WorkoutResponse])
def get_client_workouts(
    client_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)
    service.verify_client_access(client_id)

    workouts = db.query(Workout).filter(
        Workout.workspace_id == tenant.workspace_id,
        Workout.member_id == client_id
    ).order_by(Workout.created_at.desc()).all()

    return workouts or []


@router.post("/trainer/clients/{client_id}/workouts", response_model=WorkoutResponse, status_code=status.HTTP_201_CREATED)
def create_client_workout(
    client_id: str,
    data: WorkoutCreateRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)
    service.verify_client_access(client_id)

    trainer = None
    if tenant.role not in ["OWNER", "SUPER_ADMIN"]:
        trainer = service.verify_trainer_access()

    workout = Workout(
        workspace_id=tenant.workspace_id,
        trainer_id=trainer.id if trainer else None,
        member_id=client_id,
        title=data.title.strip(),
        difficulty=data.difficulty or "Intermediate",
        target_muscle_groups=data.target_muscle_groups,
        description=data.description,
        exercises_json=data.exercises_json,
        scheduled_date=data.scheduled_date,
        status=data.status or WorkoutStatus.ACTIVE,
    )
    db.add(workout)

    # Also notify client if member linked to user
    member = db.query(Member).filter(Member.id == client_id).first()
    if member and member.email:
        client_user = db.query(User).filter(User.email == member.email.lower()).first()
        if client_user:
            notif = Notification(
                workspace_id=tenant.workspace_id,
                user_id=client_user.id,
                title="New Workout Assigned",
                message=f"Your trainer assigned a new routine: '{data.title}'",
            )
            db.add(notif)

    db.commit()
    db.refresh(workout)
    return workout


@router.patch("/workouts/{workout_id}", response_model=WorkoutResponse)
def update_workout(
    workout_id: str,
    data: WorkoutUpdateRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    workout = db.query(Workout).filter(
        Workout.workspace_id == tenant.workspace_id,
        Workout.id == workout_id
    ).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found.")

    update_dict = data.model_dump(exclude_unset=True)
    for k, v in update_dict.items():
        setattr(workout, k, v)

    if data.completion_percentage is not None and data.completion_percentage >= 100.0:
        workout.status = WorkoutStatus.COMPLETED
        if not workout.client_logged_at:
            workout.client_logged_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(workout)
    return workout


@router.post("/workouts/{workout_id}/complete", response_model=WorkoutResponse)
def complete_workout(
    workout_id: str,
    completion_percentage: float = 100.0,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    workout = db.query(Workout).filter(
        Workout.workspace_id == tenant.workspace_id,
        Workout.id == workout_id
    ).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found.")

    workout.status = WorkoutStatus.COMPLETED
    workout.completion_percentage = completion_percentage
    workout.client_logged_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(workout)
    return workout


# ----------------------------------------------------
# 4. TRAINING SESSIONS & SCHEDULE ENDPOINTS
# ----------------------------------------------------

@router.get("/trainer/sessions", response_model=List[SessionResponse])
def get_training_sessions(
    client_id: Optional[str] = None,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)

    query = db.query(TrainingSession).filter(
        TrainingSession.workspace_id == tenant.workspace_id
    )

    if tenant.role not in ["OWNER", "SUPER_ADMIN"]:
        trainer = service.verify_trainer_access()
        query = query.filter(TrainingSession.trainer_id == trainer.id)

    if client_id:
        query = query.filter(TrainingSession.client_id == client_id)

    sessions = query.order_by(TrainingSession.scheduled_at.asc()).all()

    res = []
    for s in sessions:
        trainer_obj = db.query(Trainer).filter(Trainer.id == s.trainer_id).first()
        member_obj = db.query(Member).filter(Member.id == s.client_id).first() if s.client_id else None
        res.append({
            **s.__dict__,
            "trainer_name": trainer_obj.name if trainer_obj else None,
            "client_name": f"{member_obj.first_name} {member_obj.last_name}".strip() if member_obj else None,
        })

    return res


@router.post("/trainer/sessions", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_training_session(
    data: SessionCreateRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)
    trainer = service.verify_trainer_access()

    if data.client_id:
        service.verify_client_access(data.client_id, trainer.id)

    session_obj = TrainingSession(
        workspace_id=tenant.workspace_id,
        trainer_id=trainer.id,
        client_id=data.client_id,
        class_id=data.class_id,
        title=data.title.strip(),
        scheduled_at=data.scheduled_at,
        duration_minutes=data.duration_minutes,
        status=SessionStatus.SCHEDULED,
        notes=data.notes,
    )
    db.add(session_obj)

    if data.client_id:
        member = db.query(Member).filter(Member.id == data.client_id).first()
        if member and member.email:
            user_obj = db.query(User).filter(User.email == member.email.lower()).first()
            if user_obj:
                notif = Notification(
                    workspace_id=tenant.workspace_id,
                    user_id=user_obj.id,
                    title="Training Session Scheduled",
                    message=f"Session '{data.title}' scheduled for {data.scheduled_at.strftime('%d %b %H:%M')}",
                )
                db.add(notif)

    db.commit()
    db.refresh(session_obj)

    member_obj = db.query(Member).filter(Member.id == data.client_id).first() if data.client_id else None
    return {
        **session_obj.__dict__,
        "trainer_name": trainer.name,
        "client_name": f"{member_obj.first_name} {member_obj.last_name}".strip() if member_obj else None,
    }


@router.patch("/trainer/sessions/{session_id}", response_model=SessionResponse)
def update_training_session(
    session_id: str,
    data: SessionUpdateRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    session_obj = db.query(TrainingSession).filter(
        TrainingSession.workspace_id == tenant.workspace_id,
        TrainingSession.id == session_id
    ).first()
    if not session_obj:
        raise HTTPException(status_code=404, detail="Training session not found.")

    service = TrainerService(db, tenant)
    if tenant.role not in ["OWNER", "SUPER_ADMIN"]:
        service.verify_trainer_access(session_obj.trainer_id)

    update_dict = data.model_dump(exclude_unset=True)
    for k, v in update_dict.items():
        setattr(session_obj, k, v)

    db.commit()
    db.refresh(session_obj)

    trainer_obj = db.query(Trainer).filter(Trainer.id == session_obj.trainer_id).first()
    member_obj = db.query(Member).filter(Member.id == session_obj.client_id).first() if session_obj.client_id else None

    return {
        **session_obj.__dict__,
        "trainer_name": trainer_obj.name if trainer_obj else None,
        "client_name": f"{member_obj.first_name} {member_obj.last_name}".strip() if member_obj else None,
    }


# ----------------------------------------------------
# 5. CLIENT NOTES ENDPOINTS
# ----------------------------------------------------

@router.get("/trainer/clients/{client_id}/notes", response_model=List[ClientNoteResponse])
def get_client_notes(
    client_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)
    service.verify_client_access(client_id)

    notes = db.query(ClientNote).filter(
        ClientNote.workspace_id == tenant.workspace_id,
        ClientNote.client_id == client_id
    ).order_by(ClientNote.created_at.desc()).all()

    return notes or []


@router.post("/trainer/clients/{client_id}/notes", response_model=ClientNoteResponse, status_code=status.HTTP_201_CREATED)
def create_client_note(
    client_id: str,
    data: ClientNoteCreateRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = TrainerService(db, tenant)
    service.verify_client_access(client_id)
    trainer = service.verify_trainer_access()

    note = ClientNote(
        workspace_id=tenant.workspace_id,
        trainer_id=trainer.id,
        client_id=client_id,
        content=data.content.strip(),
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note
