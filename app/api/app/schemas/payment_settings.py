from typing import Optional, List, Dict, Any
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict, Field


class PaymentSettingsSchema(BaseModel):
    id: str
    workspace_id: str
    upi_enabled: bool = True
    upi_id: Optional[str] = None
    upi_name: Optional[str] = None
    upi_instructions: Optional[str] = None

    qr_enabled: bool = False
    qr_image_url: Optional[str] = None
    qr_filename: Optional[str] = None

    phone_enabled: bool = False
    phone_number: Optional[str] = None
    phone_name: Optional[str] = None

    bank_enabled: bool = False
    bank_account_name: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    bank_branch: Optional[str] = None
    bank_instructions: Optional[str] = None

    general_notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PaymentSettingsUpdate(BaseModel):
    upi_enabled: Optional[bool] = None
    upi_id: Optional[str] = None
    upi_name: Optional[str] = None
    upi_instructions: Optional[str] = None

    qr_enabled: Optional[bool] = None

    phone_enabled: Optional[bool] = None
    phone_number: Optional[str] = None
    phone_name: Optional[str] = None

    bank_enabled: Optional[bool] = None
    bank_account_name: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    bank_branch: Optional[str] = None
    bank_instructions: Optional[str] = None

    general_notes: Optional[str] = None


class PaymentMethodInfo(BaseModel):
    enabled: bool
    details: Dict[str, Any] = {}


class PaymentInstructionsResponse(BaseModel):
    invoice_id: str
    invoice_number: str
    amount_due: float
    outstanding_balance: float
    due_date: Optional[date] = None
    plan_name: Optional[str] = None
    reference_code: str
    gym_name: str
    has_active_methods: bool
    upi: Optional[Dict[str, Any]] = None
    qr: Optional[Dict[str, Any]] = None
    phone: Optional[Dict[str, Any]] = None
    bank: Optional[Dict[str, Any]] = None
    instructions_text: str = ""


class PaymentSubmissionCreate(BaseModel):
    invoice_id: str
    amount: float
    payment_method: str = "upi"
    transaction_ref: Optional[str] = None
    payment_date: Optional[datetime] = None
    notes: Optional[str] = None


class PaymentSubmissionResponse(BaseModel):
    id: str
    workspace_id: str
    member_id: str
    member_name: Optional[str] = None
    member_phone: Optional[str] = None
    member_email: Optional[str] = None

    invoice_id: str
    invoice_number: Optional[str] = None
    invoice_total: Optional[float] = None
    membership_plan_name: Optional[str] = None

    amount: float
    currency: str = "INR"
    payment_method: str
    transaction_ref: Optional[str] = None
    reference_code: Optional[str] = None
    payment_date: datetime

    receipt_url: Optional[str] = None
    receipt_filename: Optional[str] = None
    receipt_content_type: Optional[str] = None
    receipt_file_size: Optional[int] = None

    status: str
    notes: Optional[str] = None

    reviewer_id: Optional[str] = None
    reviewer_name: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    payment_id: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaymentSubmissionReview(BaseModel):
    decision: str  # "approve" or "reject"
    rejection_reason: Optional[str] = None
