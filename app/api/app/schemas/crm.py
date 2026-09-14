from typing import Optional, List, Any
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict, model_validator
from app.models.crm import LeadStatus, LeadPriority, FollowUpType, FollowUpStatus


class LeadActivityResponse(BaseModel):
    id: str
    lead_id: str
    activity_type: str
    title: str
    description: Optional[str] = None
    performed_by_id: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LeadFollowUpCreate(BaseModel):
    lead_id: Optional[str] = None
    member_id: Optional[str] = None
    follow_up_type: FollowUpType = FollowUpType.CALL
    scheduled_at: Optional[datetime] = None
    scheduled_date: Optional[str] = None
    notes: Optional[str] = None
    assigned_to_id: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_followup(cls, data: Any) -> Any:
        if isinstance(data, dict):
            ft = data.get("follow_up_type")
            if isinstance(ft, str):
                data["follow_up_type"] = ft.lower()
            if not data.get("scheduled_at") and data.get("scheduled_date"):
                # parse date string into datetime
                try:
                    data["scheduled_at"] = datetime.fromisoformat(data["scheduled_date"])
                except Exception:
                    data["scheduled_at"] = datetime.now()
            elif not data.get("scheduled_at"):
                data["scheduled_at"] = datetime.now()
        return data


class LeadFollowUpUpdate(BaseModel):
    status: FollowUpStatus
    notes: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_status(cls, data: Any) -> Any:
        if isinstance(data, dict) and isinstance(data.get("status"), str):
            data["status"] = data["status"].lower()
        return data


class LeadFollowUpResponse(BaseModel):
    id: str
    workspace_id: str
    lead_id: Optional[str] = None
    member_id: Optional[str] = None
    lead_name: Optional[str] = None
    lead_phone: Optional[str] = None
    follow_up_type: FollowUpType
    scheduled_at: datetime
    status: FollowUpStatus
    notes: Optional[str] = None
    assigned_to_id: Optional[str] = None
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class LeadCreate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = ""
    full_name: Optional[str] = None
    phone: str
    email: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    source: str = "Walk-in"
    lead_source: Optional[str] = None
    priority: LeadPriority = LeadPriority.MEDIUM
    interested_plan: Optional[str] = None
    interested_service: Optional[str] = None
    assigned_staff_id: Optional[str] = None
    expected_value: float = 0.0
    notes: Optional[str] = None
    tags: Optional[str] = None
    next_follow_up_at: Optional[datetime] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_lead(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "full_name" in data and not data.get("first_name"):
                parts = data["full_name"].strip().split(" ", 1)
                data["first_name"] = parts[0]
                data["last_name"] = parts[1] if len(parts) > 1 else ""
            if "lead_source" in data and not data.get("source"):
                data["source"] = data["lead_source"]
            if isinstance(data.get("priority"), str):
                data["priority"] = data["priority"].lower()
            if isinstance(data.get("status"), str):
                data["status"] = data["status"].lower().replace(" ", "_")
        return data


class LeadUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    gender: Optional[str] = None
    source: Optional[str] = None
    status: Optional[LeadStatus] = None
    priority: Optional[LeadPriority] = None
    interested_plan: Optional[str] = None
    interested_service: Optional[str] = None
    assigned_staff_id: Optional[str] = None
    expected_value: Optional[float] = None
    lost_reason: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[str] = None
    next_follow_up_at: Optional[datetime] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_update(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "full_name" in data and not data.get("first_name"):
                parts = data["full_name"].strip().split(" ", 1)
                data["first_name"] = parts[0]
                data["last_name"] = parts[1] if len(parts) > 1 else ""
            if "lead_source" in data and not data.get("source"):
                data["source"] = data["lead_source"]
            if isinstance(data.get("priority"), str):
                data["priority"] = data["priority"].lower()
            if isinstance(data.get("status"), str):
                data["status"] = data["status"].lower().replace(" ", "_")
        return data


class LeadStatusUpdate(BaseModel):
    status: LeadStatus
    notes: Optional[str] = None
    note: Optional[str] = None
    lost_reason: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_status_update(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if isinstance(data.get("status"), str):
                data["status"] = data["status"].lower().replace(" ", "_")
            if "note" in data and not data.get("notes"):
                data["notes"] = data["note"]
        return data


class LeadConvertRequest(BaseModel):
    plan_id: Optional[str] = None
    plan_name: Optional[str] = None
    start_date: Optional[date] = None
    price_paid: Optional[float] = None
    amount_paid: Optional[float] = None
    payment_method: Optional[str] = "upi"

    @model_validator(mode="before")
    @classmethod
    def normalize_convert(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "amount_paid" in data and not data.get("price_paid"):
                data["price_paid"] = data["amount_paid"]
        return data


class LeadResponse(BaseModel):
    id: str
    workspace_id: str
    first_name: str
    last_name: str
    phone: str
    email: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    source: str
    status: LeadStatus
    priority: LeadPriority
    interested_plan: Optional[str] = None
    interested_service: Optional[str] = None
    assigned_staff_id: Optional[str] = None
    expected_value: float
    last_contacted_at: Optional[datetime] = None
    next_follow_up_at: Optional[datetime] = None
    converted_member_id: Optional[str] = None
    converted_at: Optional[datetime] = None
    lost_reason: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    full_name: Optional[str] = None
    lead_source: Optional[str] = None

    activities: Optional[List[LeadActivityResponse]] = []

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def populate_full_name(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if not data.get("full_name"):
                first = data.get("first_name", "")
                last = data.get("last_name", "")
                data["full_name"] = f"{first} {last}".strip()
            if not data.get("lead_source"):
                data["lead_source"] = data.get("source")
        elif hasattr(data, "first_name"):
            first = getattr(data, "first_name", "") or ""
            last = getattr(data, "last_name", "") or ""
            setattr(data, "full_name", f"{first} {last}".strip())
            setattr(data, "lead_source", getattr(data, "source", "Walk-in"))
        return data


class LeadListResponse(BaseModel):
    items: List[LeadResponse]
    total: int
    page: int
    page_size: int


class PipelineStageSummary(BaseModel):
    stage: LeadStatus
    title: str
    count: int
    total_value: float
    leads: List[LeadResponse]


class CrmDashboardMetrics(BaseModel):
    total_leads: int
    new_leads: int
    contacted_leads: int
    trials: int
    converted_leads: int
    lost_leads: int
    conversion_rate_pct: float
    follow_ups_due_today: int
    overdue_follow_ups: int
    upcoming_follow_ups: int
    renewals_due_count: int
    inactive_members_count: int
    estimated_pipeline_value: float
    funnel: List[dict]
    leads_by_source: List[dict]


class AtRiskMemberItem(BaseModel):
    member_id: str
    member_name: str
    phone: str
    email: str
    days_inactive: int
    last_visit: Optional[str] = None
    risk_level: str  # Attention (7-13d), At Risk (14-29d), High Risk (30d+)
    current_plan: Optional[str] = None
