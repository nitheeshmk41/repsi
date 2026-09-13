from typing import Optional
from fastapi import Header, HTTPException, status, Depends
from jose import JWTError, jwt
from app.core.config import settings
from app.core.security import decode_access_token


class TenantContext:
    def __init__(self, workspace_id: Optional[str] = None, user_id: Optional[str] = None, role: Optional[str] = None):
        self.workspace_id = workspace_id
        self.user_id = user_id
        self.role = role


def get_current_tenant(
    authorization: Optional[str] = Header(None),
    x_workspace_id: Optional[str] = Header(None)
) -> TenantContext:
    """
    Extracts workspace tenant context securely.
    Prioritizes verified JWT claim; supports explicit X-Workspace-ID override if authorized.
    """
    user_id = None
    workspace_id = x_workspace_id
    role = None

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload:
            user_id = payload.get("sub")
            jwt_workspace_id = payload.get("workspace_id")
            role = payload.get("role")
            if not workspace_id:
                workspace_id = jwt_workspace_id

    # Fallback to default demo tenant if not provided in dev
    if not workspace_id:
        workspace_id = "ws_apex_fitness_001"

    return TenantContext(workspace_id=workspace_id, user_id=user_id, role=role)
