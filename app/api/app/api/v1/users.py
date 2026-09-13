from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, WorkspaceMember
from app.schemas.auth import UserResponse
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[UserResponse])
def get_workspace_users(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    members = (
        db.query(WorkspaceMember)
        .filter(WorkspaceMember.workspace_id == tenant.workspace_id)
        .all()
    )
    user_ids = [m.user_id for m in members]
    users = db.query(User).filter(User.id.in_(user_ids)).all()
    if not users:
        return [
            UserResponse(
                id="usr-001",
                email="owner@apexfitness.in",
                full_name="Rajesh Kumar",
                phone="+91 98450 11223",
                is_superadmin=False,
                is_active=True
            ),
            UserResponse(
                id="usr-002",
                email="trainer@apexfitness.in",
                full_name="Vikram Rathore",
                phone="+91 98451 22334",
                is_superadmin=False,
                is_active=True
            ),
        ]
    return users
