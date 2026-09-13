from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.attendance import AttendanceMethod


class CheckInRequest(BaseModel):
    member_id: str
    method: AttendanceMethod = AttendanceMethod.QR
    terminal_id: Optional[str] = None


class CheckOutRequest(BaseModel):
    attendance_id: str


class AttendanceResponse(BaseModel):
    id: str
    workspace_id: str
    member_id: str
    check_in_time: datetime
    check_out_time: Optional[datetime] = None
    method: AttendanceMethod
    terminal_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AttendanceSummary(BaseModel):
    today_total: int
    currently_inside: int
    peak_hour: str
    average_dwell_minutes: int
