from typing import Optional, List
from datetime import date
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.member import MemberStatus


class MemberCreate(BaseModel):
    first_name: str
    last_name: Optional[str] = ""
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    avatar_url: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    emergency_contact: Optional[str] = None
    plan_id: Optional[str] = None
    plan_name: Optional[str] = None
    start_date: Optional[date] = None
    trainer_id: Optional[str] = None
    notes: Optional[str] = None
    use_existing_user: Optional[bool] = False


class MemberUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    emergency_contact: Optional[str] = None
    status: Optional[MemberStatus] = None
    trainer_id: Optional[str] = None
    notes: Optional[str] = None
    user_id: Optional[str] = None


class MemberResponse(BaseModel):
    id: str
    workspace_id: str
    user_id: Optional[str] = None
    first_name: str
    last_name: Optional[str] = ""
    email: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    status: MemberStatus
    repsi_access: str
    joined_date: date
    trainer_id: Optional[str] = None
    gender: Optional[str] = None
    emergency_contact: Optional[str] = None
    plan_name: Optional[str] = "Monthly"

    model_config = ConfigDict(from_attributes=True)


class MemberListResponse(BaseModel):
    items: List[MemberResponse]
    total: int
    page: int
    page_size: int


class CheckContactRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None


class CheckContactResponse(BaseModel):
    exists: bool
    user_id: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

