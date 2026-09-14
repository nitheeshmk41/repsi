from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.machine import GymMachine
from app.repositories.base import BaseTenantRepository
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/machines", tags=["Machines"])


class MachineCreate(BaseModel):
    name: str
    category: str = "Strength"
    brand: str = "Generic"
    model: str = "Standard"
    muscle_group: str = "Full Body"
    status: str = "Available"
    instructions: Optional[str] = None
    last_serviced: Optional[str] = None


class MachineUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    muscle_group: Optional[str] = None
    status: Optional[str] = None
    instructions: Optional[str] = None
    last_serviced: Optional[str] = None


class MachineResponse(BaseModel):
    id: str
    workspace_id: str
    name: str
    category: str
    brand: str
    model: str
    muscle_group: str
    status: str
    instructions: Optional[str] = None
    last_serviced: Optional[str] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


@router.get("/", response_model=List[MachineResponse])
def get_machines(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[GymMachine](GymMachine, db, tenant.workspace_id)
    machines = repo.get_multi()
    return machines or []


@router.get("/{id}", response_model=MachineResponse)
def get_machine(
    id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[GymMachine](GymMachine, db, tenant.workspace_id)
    machine = repo.get(id)
    if not machine:
        raise HTTPException(status_code=404, detail="Equipment not found in this workspace")
    return machine


@router.post("/", response_model=MachineResponse, status_code=status.HTTP_201_CREATED)
def create_machine(
    data: MachineCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[GymMachine](GymMachine, db, tenant.workspace_id)
    return repo.create(**data.model_dump())


@router.put("/{id}", response_model=MachineResponse)
def update_machine(
    id: str,
    data: MachineUpdate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[GymMachine](GymMachine, db, tenant.workspace_id)
    machine = repo.get(id)
    if not machine:
        raise HTTPException(status_code=404, detail="Equipment not found in this workspace")
    return repo.update(machine, **data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_machine(
    id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[GymMachine](GymMachine, db, tenant.workspace_id)
    machine = repo.get(id)
    if not machine:
        raise HTTPException(status_code=404, detail="Equipment not found in this workspace")
    repo.remove(id)
    return {"status": "success", "message": "Equipment removed successfully"}
