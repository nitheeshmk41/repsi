from typing import Optional
from fastapi import Header, HTTPException, status, Depends
from jose import JWTError, jwt
from app.core.config import settings
from app.core.security import decode_access_token


from app.core.database import get_db
from sqlalchemy.orm import Session


class TenantContext:
    def __init__(self, workspace_id: str, user_id: str, role: Optional[str] = None):
        self.workspace_id = workspace_id
        self.user_id = user_id
        self.role = role


def get_current_tenant(
    authorization: Optional[str] = Header(None),
    x_workspace_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> TenantContext:
    """
    Extracts authenticated tenant context securely from JWT claims.
    Header override (X-Workspace-ID) is strictly restricted to SUPER_ADMIN.
    """
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]

    payload = decode_access_token(token) if token else None

    if payload and payload.get("sub"):
        user_id = payload.get("sub")
        jwt_workspace_id = payload.get("workspace_id")
        role = payload.get("role")

        workspace_id = x_workspace_id or jwt_workspace_id

        if role == "SUPER_ADMIN":
            return TenantContext(workspace_id=workspace_id or "platform", user_id=user_id, role="SUPER_ADMIN")

        if workspace_id:
            # Strictly verify tenant isolation and active membership in the workspace
            from app.models.user import WorkspaceMember
            member = db.query(WorkspaceMember).filter(
                WorkspaceMember.workspace_id == workspace_id,
                WorkspaceMember.user_id == user_id,
            ).first()
            if not member or not member.is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied. You do not have an active account in this gym workspace.",
                )
            role = member.role.value if hasattr(member.role, "value") else str(member.role)
            return TenantContext(workspace_id=workspace_id, user_id=user_id, role=role)

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication token required" if not authorization else "Invalid or expired authentication token",
        headers={"WWW-Authenticate": "Bearer"},
    )
