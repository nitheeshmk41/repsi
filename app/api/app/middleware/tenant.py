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

        workspace_id = jwt_workspace_id
        if role == "SUPER_ADMIN" and x_workspace_id:
            workspace_id = x_workspace_id

        if workspace_id:
            return TenantContext(workspace_id=workspace_id, user_id=user_id, role=role)

    # In dev mode, if an authorization header is present but token is invalid/expired, fall back to local active workspace
    if (settings.DEBUG or settings.ENVIRONMENT == "development") and authorization:
        from app.models.user import Workspace, WorkspaceMember
        ws = None
        if x_workspace_id:
            ws = db.query(Workspace).filter((Workspace.id == x_workspace_id) | (Workspace.slug == x_workspace_id)).first()
        if not ws:
            ws = db.query(Workspace).first()

        if ws:
            member = db.query(WorkspaceMember).filter(
                WorkspaceMember.workspace_id == ws.id,
                WorkspaceMember.is_active == True
            ).first()
            user_id = member.user_id if member else "usr_owner_demo"
            role = member.role.value if member else "OWNER"
            return TenantContext(workspace_id=ws.id, user_id=user_id, role=role)

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication token required" if not authorization else "Invalid or expired authentication token",
        headers={"WWW-Authenticate": "Bearer"},
    )
