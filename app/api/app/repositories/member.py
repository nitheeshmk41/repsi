from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.member import Member, Membership, MembershipPlan, MemberStatus
from app.repositories.base import BaseTenantRepository


class MemberRepository(BaseTenantRepository[Member]):
    def __init__(self, db: Session, workspace_id: str):
        super().__init__(Member, db, workspace_id)

    def search(self, query: str, status: Optional[str] = None, skip: int = 0, limit: int = 50) -> List[Member]:
        q = self.db.query(Member).filter(Member.workspace_id == self.workspace_id)
        if query:
            search_filter = or_(
                Member.first_name.ilike(f"%{query}%"),
                Member.last_name.ilike(f"%{query}%"),
                Member.email.ilike(f"%{query}%"),
                Member.phone.ilike(f"%{query}%"),
            )
            q = q.filter(search_filter)
        if status and status != "all":
            q = q.filter(Member.status == status)
        return q.offset(skip).limit(limit).all()

    def count_active(self) -> int:
        return (
            self.db.query(Member)
            .filter(Member.workspace_id == self.workspace_id, Member.status == MemberStatus.ACTIVE)
            .count()
        )

    def count_expiring(self) -> int:
        return (
            self.db.query(Member)
            .filter(Member.workspace_id == self.workspace_id, Member.status == MemberStatus.EXPIRING)
            .count()
        )
