from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.trainer import GymClass
from app.repositories.base import BaseTenantRepository
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/classes", tags=["Classes"])


class ClassCreate(BaseModel):
    name: str
    schedule: str
    trainer_id: Optional[str] = None
    category: str = "Strength"
    capacity: int = 20
    room: str = "Studio A"


class ClassResponse(BaseModel):
    id: str
    workspace_id: str
    name: str
    schedule: str
    trainer_id: Optional[str] = None
    category: str
    capacity: int
    room: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


@router.get("/", response_model=List[ClassResponse])
def get_classes(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[GymClass](GymClass, db, tenant.workspace_id)
    classes = repo.get_multi()
    return classes or []


@router.post("/", response_model=ClassResponse, status_code=status.HTTP_201_CREATED)
def create_class(
    data: ClassCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[GymClass](GymClass, db, tenant.workspace_id)
    return repo.create(**data.model_dump())
