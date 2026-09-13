from typing import List
from pydantic import BaseModel


class ChartDataPoint(BaseModel):
    label: str
    value: float


class DashboardMetricsResponse(BaseModel):
    active_members: int
    monthly_revenue: float
    today_attendance: int
    expiring_memberships: int
    revenue_growth_pct: float
    attendance_peak_hour: str
    recent_checkins_count: int
    revenue_chart: List[ChartDataPoint]
    attendance_chart: List[ChartDataPoint]
