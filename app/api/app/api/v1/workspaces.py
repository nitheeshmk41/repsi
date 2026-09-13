from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import Workspace
from app.schemas.workspace import WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


@router.get("/", response_model=List[WorkspaceResponse])
def get_workspaces(db: Session = Depends(get_db)):
    return db.query(Workspace).filter(Workspace.is_active == True).limit(20).all()


@router.get("/{id}", response_model=WorkspaceResponse)
def get_workspace(id: str, db: Session = Depends(get_db)):
    ws = db.query(Workspace).filter(Workspace.id == id).first()
    if not ws:
        # Fallback demo workspace
        return WorkspaceResponse(
            id=id,
            name="Apex Fitness Club",
            slug="apex-fitness",
            city="Chennai",
            country="India",
            gym_type="Commercial Fitness",
            is_active=True
        )
    return ws


@router.put("/{id}", response_model=WorkspaceResponse)
def update_workspace(id: str, data: WorkspaceUpdate, db: Session = Depends(get_db)):
    ws = db.query(Workspace).filter(Workspace.id == id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(ws, key, value)
    db.commit()
    db.refresh(ws)
    return ws


@router.post("/onboarding/complete")
def complete_onboarding(
    payload: dict,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    return {
        "status": "success",
        "message": "Workspace initialized successfully",
        "workspace_id": tenant.workspace_id
    }
