from typing import Optional, List
from datetime import date
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.member import MemberStatus


class MemberCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    avatar_url: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    emergency_contact: Optional[str] = None
    plan_id: Optional[str] = None
    trainer_id: Optional[str] = None
    notes: Optional[str] = None


class MemberUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    status: Optional[MemberStatus] = None
    trainer_id: Optional[str] = None
    notes: Optional[str] = None


class MemberResponse(BaseModel):
    id: str
    workspace_id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    avatar_url: Optional[str] = None
    status: MemberStatus
    joined_date: date
    trainer_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class MemberListResponse(BaseModel):
    items: List[MemberResponse]
    total: int
    page: int
    page_size: int
