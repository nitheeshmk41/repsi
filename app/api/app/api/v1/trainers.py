from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.trainer import Trainer
from app.repositories.base import BaseTenantRepository
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/trainers", tags=["Trainers"])


class TrainerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    specialization: Optional[str] = "General Fitness"
    hourly_rate: float = 500.0


class TrainerResponse(BaseModel):
    id: str
    workspace_id: str
    name: str
    phone: str
    email: Optional[str] = None
    specialization: Optional[str] = None
    hourly_rate: float
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


@router.get("/", response_model=List[TrainerResponse])
def get_trainers(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[Trainer](Trainer, db, tenant.workspace_id)
    trainers = repo.get_multi()
    return trainers or []


@router.post("/", response_model=TrainerResponse, status_code=status.HTTP_201_CREATED)
def create_trainer(
    data: TrainerCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[Trainer](Trainer, db, tenant.workspace_id)
    return repo.create(**data.model_dump())
