from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.workout import Workout, WorkoutPlan
from app.repositories.base import BaseTenantRepository
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/workouts", tags=["Workouts"])


class WorkoutCreate(BaseModel):
    title: str
    difficulty: str = "Intermediate"
    target_muscle_groups: Optional[str] = "Chest, Shoulders, Triceps"
    description: Optional[str] = None


class WorkoutResponse(BaseModel):
    id: str
    workspace_id: str
    title: str
    difficulty: str
    target_muscle_groups: Optional[str] = None
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


@router.get("/", response_model=List[WorkoutResponse])
def get_workouts(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[Workout](Workout, db, tenant.workspace_id)
    items = repo.get_multi()
    if not items:
        return [
            WorkoutResponse(
                id="wko-001",
                workspace_id=tenant.workspace_id,
                title="Push Day (Hypertrophy)",
                difficulty="Intermediate",
                target_muscle_groups="Chest, Deltoids, Triceps",
                description="Bench press, overhead dumbbell press, cable flyes, dips."
            ),
            WorkoutResponse(
                id="wko-002",
                workspace_id=tenant.workspace_id,
                title="Pull Day (Strength Focus)",
                difficulty="Advanced",
                target_muscle_groups="Lats, Rhomboids, Biceps",
                description="Deadlifts, pull-ups, barbell rows, face pulls."
            ),
        ]
    return items


@router.post("/", response_model=WorkoutResponse, status_code=status.HTTP_201_CREATED)
def create_workout(
    data: WorkoutCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[Workout](Workout, db, tenant.workspace_id)
    return repo.create(**data.model_dump())
