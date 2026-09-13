from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.dashboard import DashboardMetricsResponse
from app.services.dashboard import DashboardService
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/metrics", response_model=DashboardMetricsResponse)
def get_dashboard_metrics(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    service = DashboardService(db, tenant.workspace_id)
    return service.get_owner_metrics()
