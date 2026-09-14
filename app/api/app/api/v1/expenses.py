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
    if tenant.role not in ["OWNER", "ADMIN", "STAFF"]:
        raise HTTPException(status_code=403, detail="Forbidden. Only staff/owners can view expenses.")
    repo = BaseTenantRepository[Expense](Expense, db, tenant.workspace_id)
    expenses = repo.get_multi(limit=50)
    return expenses or []


@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def record_expense(
    data: ExpenseCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    if tenant.role not in ["OWNER", "ADMIN", "STAFF"]:
        raise HTTPException(status_code=403, detail="Forbidden. Only staff/owners can record expenses.")
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
