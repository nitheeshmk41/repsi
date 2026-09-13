from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict
from app.models.finance import PaymentMethod, PaymentStatus


class PaymentCreate(BaseModel):
    member_id: str
    membership_id: Optional[str] = None
    amount: float
    currency: str = "INR"
    method: PaymentMethod = PaymentMethod.UPI
    transaction_ref: Optional[str] = None


class PaymentResponse(BaseModel):
    id: str
    workspace_id: str
    member_id: str
    amount: float
    currency: str
    method: PaymentMethod
    status: PaymentStatus
    transaction_ref: Optional[str] = None
    paid_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ExpenseCreate(BaseModel):
    category: str
    title: str
    amount: float
    expense_date: Optional[date] = None
    vendor: Optional[str] = None
    payment_method: str = "bank_transfer"
    notes: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: str
    workspace_id: str
    category: str
    title: str
    amount: float
    expense_date: date
    vendor: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class FinancialMetrics(BaseModel):
    monthly_revenue: float
    monthly_expenses: float
    net_profit: float
    pending_dues: float
