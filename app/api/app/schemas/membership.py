from typing import Optional, List
from datetime import date
from pydantic import BaseModel, ConfigDict
from app.models.member import MemberStatus


class MembershipPlanCreate(BaseModel):
    name: str
    description: Optional[str] = None
    duration_months: int = 1
    price: float
    features: Optional[str] = None


class MembershipPlanResponse(BaseModel):
    id: str
    workspace_id: str
    name: str
    description: Optional[str] = None
    duration_months: int
    price: float
    features: Optional[str] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class MembershipCreate(BaseModel):
    member_id: str
    plan_id: str
    start_date: date
    price_paid: float
    auto_renew: bool = False


class MembershipResponse(BaseModel):
    id: str
    workspace_id: str
    member_id: str
    plan_id: str
    start_date: date
    end_date: date
    status: MemberStatus
    price_paid: float
    auto_renew: bool

    model_config = ConfigDict(from_attributes=True)


class ExpiringMembershipItem(BaseModel):
    membership_id: str
    member_id: str
    member_name: str
    phone: str
    email: str
    plan_name: str
    start_date: date
    end_date: date
    days_remaining: int
    status: MemberStatus
    price_paid: float


class RenewalReminderItem(BaseModel):
    member_id: str
    member_name: str
    phone: str
    email: str
    plan_name: str
    expiry_date: date
    days_remaining: int
    amount_due: float
    message_template: str
    whatsapp_url: str
