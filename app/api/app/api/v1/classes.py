from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.trainer import GymClass
from app.models.attendance import ClassAttendance
from app.models.member import Member
from app.repositories.base import BaseTenantRepository
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/classes", tags=["Classes"])


class ClassCreate(BaseModel):
    name: str
    schedule: str
    trainer_id: Optional[str] = None
    category: str = "Strength"
    capacity: int = 20
    room: str = "Studio A"


class ClassResponse(BaseModel):
    id: str
    workspace_id: str
    name: str
    schedule: str
    trainer_id: Optional[str] = None
    category: str
    capacity: int
    room: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class MarkClassAttendanceRequest(BaseModel):
    member_id: str
    status: str = "attended"  # attended, late, absent, cancelled


@router.get("/", response_model=List[ClassResponse])
def get_classes(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[GymClass](GymClass, db, tenant.workspace_id)
    classes = repo.get_multi()
    return classes or []


@router.post("/", response_model=ClassResponse, status_code=status.HTTP_201_CREATED)
def create_class(
    data: ClassCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[GymClass](GymClass, db, tenant.workspace_id)
    return repo.create(**data.model_dump())


@router.get("/{class_id}/participants")
def get_class_participants(
    class_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    records = db.query(ClassAttendance, Member).join(
        Member, ClassAttendance.member_id == Member.id
    ).filter(
        ClassAttendance.workspace_id == tenant.workspace_id,
        ClassAttendance.class_id == class_id
    ).all()

    return [{
        "attendance_id": ca.id,
        "member_id": m.id,
        "name": f"{m.first_name} {m.last_name}".strip(),
        "phone": m.phone,
        "email": m.email,
        "status": ca.status,
        "check_in_time": ca.check_in_time
    } for ca, m in records]


@router.post("/{class_id}/attendance", status_code=status.HTTP_201_CREATED)
def mark_class_attendance(
    class_id: str,
    data: MarkClassAttendanceRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    gym_class = db.query(GymClass).filter(
        GymClass.workspace_id == tenant.workspace_id,
        GymClass.id == class_id
    ).first()
    if not gym_class:
        raise HTTPException(status_code=404, detail="Class not found.")

    member = db.query(Member).filter(
        Member.workspace_id == tenant.workspace_id,
        Member.id == data.member_id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found.")

    attendance_record = ClassAttendance(
        workspace_id=tenant.workspace_id,
        class_id=class_id,
        member_id=data.member_id,
        status=data.status,
        check_in_time=datetime.now(timezone.utc)
    )
    db.add(attendance_record)
    db.commit()
    db.refresh(attendance_record)

    return {
        "status": "success",
        "attendance_id": attendance_record.id,
        "member_name": f"{member.first_name} {member.last_name}".strip(),
        "class_name": gym_class.name,
        "attendance_status": attendance_record.status
    }

