from typing import Optional
from fastapi import Header, HTTPException, status, Depends
from jose import JWTError, jwt
from app.core.config import settings
from app.core.security import decode_access_token


class TenantContext:
    def __init__(self, workspace_id: str, user_id: str, role: Optional[str] = None):
        self.workspace_id = workspace_id
        self.user_id = user_id
        self.role = role


def get_current_tenant(
    authorization: Optional[str] = Header(None),
    x_workspace_id: Optional[str] = Header(None)
) -> TenantContext:
    """
    Extracts authenticated tenant context securely from JWT claims.
    Header override (X-Workspace-ID) is strictly restricted to SUPER_ADMIN.
    Raises 401 Unauthorized if invalid or missing authentication token.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    jwt_workspace_id = payload.get("workspace_id")
    role = payload.get("role")

    workspace_id = jwt_workspace_id
    if role == "SUPER_ADMIN" and x_workspace_id:
        workspace_id = x_workspace_id

    if not workspace_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not associated with an active gym workspace."
        )

    return TenantContext(workspace_id=workspace_id, user_id=user_id, role=role)
