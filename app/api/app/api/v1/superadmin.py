from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.middleware.tenant import TenantContext, get_current_tenant
from app.models.user import User, Workspace, WorkspaceMember, UserRole
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/superadmin", tags=["Super Admin"])

def check_superadmin(tenant: TenantContext, db: Session) -> User:
    if not tenant.user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    user = db.query(User).filter(User.id == tenant.user_id).first()
    if not user or not user.is_superadmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Super Admin access required."
        )
    return user

class WorkspaceResponse(BaseModel):
    id: str
    name: str
    slug: str
    email: str | None = None
    city: str | None = None
    is_active: bool

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    is_superadmin: bool
    is_active: bool

@router.get("/workspaces", response_model=List[WorkspaceResponse])
def get_all_workspaces(tenant: TenantContext = Depends(get_current_tenant), db: Session = Depends(get_db)):
    check_superadmin(tenant, db)
    workspaces = db.query(Workspace).all()
    return workspaces

@router.get("/users", response_model=List[UserResponse])
def get_all_users(tenant: TenantContext = Depends(get_current_tenant), db: Session = Depends(get_db)):
    check_superadmin(tenant, db)
    users = db.query(User).all()
    return users
