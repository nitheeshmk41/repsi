from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class PlanFeatureSchema(BaseModel):
    key: str
    name: str
    enabled: bool

class SubscriptionPlanSchema(BaseModel):
    id: str
    code: str
    name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    monthly_price_inr: float
    annual_price_inr: float
    monthly_price_usd: float
    annual_price_usd: float
    member_limit: int
    trainer_limit: int
    branch_limit: int
    is_popular: bool = False
    display_order: int = 0
    features: Dict[str, Any]

class UsageMetric(BaseModel):
    current: int
    limit: int
    unlimited: bool = False
    percentage: float = 0.0
    warning_triggered: bool = False
    limit_reached: bool = False

class WorkspaceUsageSchema(BaseModel):
    members: UsageMetric
    trainers: UsageMetric
    branches: UsageMetric

class SubscriptionDetailsSchema(BaseModel):
    id: str
    workspace_id: str
    plan: SubscriptionPlanSchema
    status: str
    billing_cycle: str
    currency: str
    trial_start: Optional[datetime] = None
    trial_end: Optional[datetime] = None
    trial_started_at: Optional[datetime] = None
    trial_ends_at: Optional[datetime] = None
    trial_days_left: Optional[int] = None
    trial_hours_left: Optional[int] = None
    trial_progress_pct: Optional[float] = None
    trial_state: Optional[str] = None
    is_expired: Optional[bool] = False
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool = False

class SubscriptionBillingOverviewSchema(BaseModel):
    subscription: SubscriptionDetailsSchema
    usage: WorkspaceUsageSchema
    features: Dict[str, bool]

class TrialStatusResponse(BaseModel):
    workspace_id: str
    status: str
    is_trial: bool
    is_expired: bool
    is_paid: bool
    trial_started_at: str
    trial_ends_at: str
    trial_converted_at: Optional[str] = None
    total_trial_days: int = 14
    days_remaining: int
    hours_remaining: int
    progress_pct: float
    trial_state: str
    plan_code: str
    plan_name: str
    member_limit: int
    is_complimentary: bool = False
    can_upgrade: bool = True
    server_time_utc: str

class CheckoutSessionRequest(BaseModel):
    plan_code: str
    billing_cycle: str = "monthly" # monthly or annual
    currency: str = "INR" # INR or USD

class CheckoutSessionResponse(BaseModel):
    payment_session_id: str
    order_id: str
    amount: float
    currency: str
    cf_environment: str = "production"

class PaymentVerifyRequest(BaseModel):
    cashfree_order_id: str
    cashfree_payment_id: str
    amount: float

class PaymentVerifyResponse(BaseModel):
    success: bool
    status: str
    message: str
    subscription_id: str
    invoice_id: Optional[str] = None

class ChangePlanRequest(BaseModel):
    target_plan_code: str
    billing_cycle: str = "monthly"

class ChangePlanResponse(BaseModel):
    success: bool
    is_downgrade: bool = False
    limit_blocked: bool = False
    message: str
    excess_members: int = 0
    excess_trainers: int = 0
    excess_branches: int = 0

class AdminTrialExtensionRequest(BaseModel):
    workspace_id: str
    additional_days: int = 14
    reason: Optional[str] = None

class AdminManualOverrideRequest(BaseModel):
    workspace_id: str
    target_plan_code: str
    billing_cycle: str = "monthly"
    reason: Optional[str] = None
