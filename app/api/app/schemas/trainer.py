from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.trainer import TrainerStatus, TrainerClientStatus, SessionStatus
from app.models.workout import WorkoutStatus


class TrainerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    specialization: Optional[str] = "General Fitness"
    hourly_rate: float = 0.0
    commission_percentage: float = 0.0
    bio: Optional[str] = None
    experience: Optional[str] = None
    joining_date: Optional[date] = None
    certifications: Optional[str] = None
    working_hours: Optional[str] = None
    emergency_contact: Optional[str] = None


class TrainerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None
    hourly_rate: Optional[float] = None
    commission_percentage: Optional[float] = None
    status: Optional[TrainerStatus] = None
    is_active: Optional[bool] = None
    profile_photo: Optional[str] = None
    experience: Optional[str] = None
    joining_date: Optional[date] = None
    certifications: Optional[str] = None
    working_hours: Optional[str] = None
    emergency_contact: Optional[str] = None


class TrainerResponse(BaseModel):
    id: str
    workspace_id: str
    user_id: Optional[str] = None
    name: str
    phone: str
    email: Optional[str] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None
    hourly_rate: float
    commission_percentage: float
    status: TrainerStatus
    is_active: bool
    profile_photo: Optional[str] = None
    experience: Optional[str] = None
    joining_date: Optional[date] = None
    certifications: Optional[str] = None
    working_hours: Optional[str] = None
    emergency_contact: Optional[str] = None
    assigned_clients_count: int = 0
    today_sessions_count: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TrainerClientAssignRequest(BaseModel):
    trainer_id: str
    client_id: str
    notes: Optional[str] = None


class TrainerClientRequest(BaseModel):
    client_id: str
    notes: Optional[str] = None


class TrainerClientStatusUpdate(BaseModel):
    status: TrainerClientStatus
    notes: Optional[str] = None


class TrainerClientResponse(BaseModel):
    id: str
    workspace_id: str
    trainer_id: str
    client_id: str
    status: TrainerClientStatus
    assigned_by: Optional[str] = None
    assigned_at: datetime
    started_at: datetime
    ended_at: Optional[datetime] = None
    notes: Optional[str] = None
    client_name: Optional[str] = None
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    trainer_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class WorkoutCreateRequest(BaseModel):
    title: str
    client_id: Optional[str] = None
    difficulty: Optional[str] = "Intermediate"
    target_muscle_groups: Optional[str] = None
    description: Optional[str] = None
    exercises_json: Optional[str] = None  # JSON string of exercises list
    scheduled_date: Optional[date] = None
    status: Optional[WorkoutStatus] = WorkoutStatus.ACTIVE


class WorkoutUpdateRequest(BaseModel):
    title: Optional[str] = None
    difficulty: Optional[str] = None
    target_muscle_groups: Optional[str] = None
    description: Optional[str] = None
    exercises_json: Optional[str] = None
    scheduled_date: Optional[date] = None
    status: Optional[WorkoutStatus] = None
    completion_percentage: Optional[float] = None
    trainer_feedback: Optional[str] = None


class WorkoutResponse(BaseModel):
    id: str
    workspace_id: str
    trainer_id: Optional[str] = None
    member_id: Optional[str] = None
    title: str
    difficulty: Optional[str] = "Intermediate"
    target_muscle_groups: Optional[str] = None
    description: Optional[str] = None
    exercises_json: Optional[str] = None
    scheduled_date: Optional[date] = None
    status: WorkoutStatus
    completion_percentage: float = 0.0
    client_logged_at: Optional[datetime] = None
    trainer_feedback: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SessionCreateRequest(BaseModel):
    title: str
    client_id: Optional[str] = None
    class_id: Optional[str] = None
    scheduled_at: datetime
    duration_minutes: int = 60
    notes: Optional[str] = None


class SessionUpdateRequest(BaseModel):
    title: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    status: Optional[SessionStatus] = None
    notes: Optional[str] = None


class SessionResponse(BaseModel):
    id: str
    workspace_id: str
    trainer_id: str
    client_id: Optional[str] = None
    class_id: Optional[str] = None
    title: str
    scheduled_at: datetime
    duration_minutes: int
    status: SessionStatus
    notes: Optional[str] = None
    client_name: Optional[str] = None
    trainer_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ClientNoteCreateRequest(BaseModel):
    content: str


class ClientNoteResponse(BaseModel):
    id: str
    workspace_id: str
    trainer_id: str
    client_id: str
    content: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
