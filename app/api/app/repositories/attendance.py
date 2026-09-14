from datetime import datetime, date, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.attendance import Attendance
from app.repositories.base import BaseTenantRepository


class AttendanceRepository(BaseTenantRepository[Attendance]):
    def __init__(self, db: Session, workspace_id: str):
        super().__init__(Attendance, db, workspace_id)

    def count_today(self) -> int:
        today_start = datetime.combine(date.today(), datetime.min.time())
        return (
            self.db.query(Attendance)
            .filter(
                Attendance.workspace_id == self.workspace_id,
                Attendance.check_in_time >= today_start
            )
            .count()
        )

    def count_currently_inside(self) -> int:
        today_start = datetime.combine(date.today(), datetime.min.time())
        return (
            self.db.query(Attendance)
            .filter(
                Attendance.workspace_id == self.workspace_id,
                Attendance.check_in_time >= today_start,
                Attendance.check_out_time.is_(None)
            )
            .count()
        )

    def get_multi_by_member(self, member_id: str) -> list[Attendance]:
        return (
            self.db.query(Attendance)
            .filter(
                Attendance.workspace_id == self.workspace_id,
                Attendance.member_id == member_id
            )
            .order_by(Attendance.check_in_time.desc())
            .all()
        )
