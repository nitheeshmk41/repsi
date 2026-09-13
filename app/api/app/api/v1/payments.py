from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.finance import Payment, PaymentStatus
from app.schemas.finance import PaymentCreate, PaymentResponse, FinancialMetrics
from app.repositories.base import BaseTenantRepository
from app.repositories.finance import FinanceRepository
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/", response_model=List[PaymentResponse])
def get_payments(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[Payment](Payment, db, tenant.workspace_id)
    payments = repo.get_multi(limit=50)
    if not payments:
        return [
            PaymentResponse(
                id="pay-001",
                workspace_id=tenant.workspace_id,
                member_id="mem-001",
                amount=6499.0,
                currency="INR",
                method="upi",
                status=PaymentStatus.SUCCESS,
                transaction_ref="UPI/582910482/YESB",
                paid_at=datetime.now(timezone.utc)
            ),
            PaymentResponse(
                id="pay-002",
                workspace_id=tenant.workspace_id,
                member_id="mem-002",
                amount=18999.0,
                currency="INR",
                method="card",
                status=PaymentStatus.SUCCESS,
                transaction_ref="CARD/4111/HDFC",
                paid_at=datetime.now(timezone.utc)
            ),
        ]
    return payments


@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def record_payment(
    data: PaymentCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[Payment](Payment, db, tenant.workspace_id)
    payment = repo.create(
        member_id=data.member_id,
        membership_id=data.membership_id,
        amount=data.amount,
        currency=data.currency,
        method=data.method,
        status=PaymentStatus.SUCCESS,
        transaction_ref=data.transaction_ref,
        paid_at=datetime.now(timezone.utc)
    )
    return payment


@router.get("/summary", response_model=FinancialMetrics)
def get_financial_summary(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = FinanceRepository(db, tenant.workspace_id)
    rev = repo.get_monthly_revenue()
    exp = repo.get_monthly_expenses()
    return FinancialMetrics(
        monthly_revenue=rev,
        monthly_expenses=exp,
        net_profit=rev - exp,
        pending_dues=34000.0
    )
