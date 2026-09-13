from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/summary")
def get_reports_summary(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    return {
        "workspace_id": tenant.workspace_id,
        "reports": [
            {
                "id": "rep-001",
                "name": "Monthly GST Tax & Invoicing Summary",
                "period": "March 2025",
                "status": "ready",
                "format": "PDF / Excel",
                "generated_at": "2025-03-01T10:00:00Z"
            },
            {
                "id": "rep-002",
                "name": "Turnstile Attendance & Peak Hour Utilization",
                "period": "Last 30 Days",
                "status": "ready",
                "format": "CSV",
                "generated_at": "2025-03-05T12:00:00Z"
            },
            {
                "id": "rep-003",
                "name": "Trainer Commissions & PT Payout Sheet",
                "period": "February 2025",
                "status": "ready",
                "format": "Excel",
                "generated_at": "2025-03-01T08:00:00Z"
            }
        ]
    }
