import time
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.dashboard import DashboardMetricsResponse
from app.services.dashboard import DashboardService
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="", tags=["Dashboard"])


@router.get("/dashboard/metrics", response_model=DashboardMetricsResponse)
@router.get("/owner/dashboard", response_model=DashboardMetricsResponse)
def get_dashboard_metrics(
    response: Response,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    t0 = time.perf_counter()
    service = DashboardService(db, tenant.workspace_id)
    metrics = service.get_owner_metrics()
    t1 = time.perf_counter()
    dur_ms = round((t1 - t0) * 1000, 2)
    response.headers["Server-Timing"] = f"db;dur={dur_ms};desc=\"Owner Dashboard Aggregate Query\""
    return metrics
