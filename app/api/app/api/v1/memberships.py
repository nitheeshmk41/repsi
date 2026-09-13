from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.member import MembershipPlan, Membership
from app.schemas.membership import (
    MembershipPlanCreate,
    MembershipPlanResponse,
    MembershipCreate,
    MembershipResponse,
)
from app.repositories.base import BaseTenantRepository
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/memberships", tags=["Memberships"])


@router.get("/plans", response_model=List[MembershipPlanResponse])
def get_plans(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[MembershipPlan](MembershipPlan, db, tenant.workspace_id)
    plans = repo.get_multi(limit=50)
    if not plans:
        # Provide standard default plans
        return [
            MembershipPlanResponse(
                id="plan-001",
                workspace_id=tenant.workspace_id,
                name="Monthly Standard",
                duration_months=1,
                price=2499.0,
                is_active=True
            ),
            MembershipPlanResponse(
                id="plan-002",
                workspace_id=tenant.workspace_id,
                name="Quarterly Pro",
                duration_months=3,
                price=6499.0,
                is_active=True
            ),
            MembershipPlanResponse(
                id="plan-003",
                workspace_id=tenant.workspace_id,
                name="Annual Transformation",
                duration_months=12,
                price=18999.0,
                is_active=True
            ),
        ]
    return plans


@router.post("/plans", response_model=MembershipPlanResponse, status_code=status.HTTP_201_CREATED)
def create_plan(
    data: MembershipPlanCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[MembershipPlan](MembershipPlan, db, tenant.workspace_id)
    return repo.create(**data.model_dump())
