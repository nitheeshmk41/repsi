from typing import List
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.finance import Expense
from app.schemas.finance import ExpenseCreate, ExpenseResponse
from app.repositories.base import BaseTenantRepository
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[Expense](Expense, db, tenant.workspace_id)
    expenses = repo.get_multi(limit=50)
    if not expenses:
        return [
            ExpenseResponse(
                id="exp-001",
                workspace_id=tenant.workspace_id,
                category="Facility Rent",
                title="Monthly Commercial Floor Lease",
                amount=120000.0,
                expense_date=date.today(),
                vendor="Prestige Commercials"
            ),
            ExpenseResponse(
                id="exp-002",
                workspace_id=tenant.workspace_id,
                category="Utilities",
                title="Electricity & HVAC Grid Bill",
                amount=38500.0,
                expense_date=date.today(),
                vendor="Bescom Power"
            ),
        ]
    return expenses


@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def record_expense(
    data: ExpenseCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[Expense](Expense, db, tenant.workspace_id)
    return repo.create(
        category=data.category,
        title=data.title,
        amount=data.amount,
        expense_date=data.expense_date or date.today(),
        vendor=data.vendor,
        payment_method=data.payment_method,
        notes=data.notes
    )
