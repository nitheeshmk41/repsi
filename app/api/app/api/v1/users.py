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
        .filter(WorkspaceMember.workspace_id == tenant.workspace_id, WorkspaceMember.is_active == True)
        .all()
    )
    if not members:
        return []

    member_role_map = {m.user_id: m.role.value for m in members}
    users = db.query(User).filter(User.id.in_(list(member_role_map.keys()))).all()
    return [
        UserResponse(
            id=u.id,
            email=u.email,
            full_name=u.full_name,
            phone=u.phone,
            is_superadmin=u.is_superadmin,
            is_active=u.is_active,
            role="SUPER_ADMIN" if u.is_superadmin else member_role_map.get(u.id, "STAFF"),
            workspace_id=tenant.workspace_id,
        )
        for u in users
    ]
