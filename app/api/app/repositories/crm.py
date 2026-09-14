from typing import Optional, List, Dict, Any
from datetime import datetime, date, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_
from app.models.crm import Lead, LeadActivity, LeadFollowUp, LeadStatus, LeadPriority, FollowUpStatus
from app.models.member import Member, MemberStatus, Membership
from app.models.attendance import Attendance
from app.repositories.base import BaseTenantRepository


class CrmRepository(BaseTenantRepository[Lead]):
    def __init__(self, db: Session, workspace_id: str):
        super().__init__(Lead, db, workspace_id)

    def search_leads(
        self,
        query: Optional[str] = None,
        status: Optional[str] = None,
        source: Optional[str] = None,
        priority: Optional[str] = None,
        assigned_staff_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> List[Lead]:
        q = self.scoped_query()

        if query:
            term = f"%{query.strip().lower()}%"
            q = q.filter(
                or_(
                    func.lower(Lead.first_name).like(term),
                    func.lower(Lead.last_name).like(term),
                    Lead.phone.like(term),
                    func.lower(Lead.email).like(term),
                )
            )

        if status and status != "all":
            q = q.filter(Lead.status == status)

        if source and source != "all":
            q = q.filter(Lead.source == source)

        if priority and priority != "all":
            q = q.filter(Lead.priority == priority)

        if assigned_staff_id and assigned_staff_id != "all":
            q = q.filter(Lead.assigned_staff_id == assigned_staff_id)

        return q.order_by(desc(Lead.created_at)).offset(skip).limit(limit).all()

    def count_leads(
        self,
        query: Optional[str] = None,
        status: Optional[str] = None,
        source: Optional[str] = None,
    ) -> int:
        q = self.scoped_query()
        if query:
            term = f"%{query.strip().lower()}%"
            q = q.filter(
                or_(
                    func.lower(Lead.first_name).like(term),
                    func.lower(Lead.last_name).like(term),
                    Lead.phone.like(term),
                    func.lower(Lead.email).like(term),
                )
            )
        if status and status != "all":
            q = q.filter(Lead.status == status)
        if source and source != "all":
            q = q.filter(Lead.source == source)
        return q.count()

    def log_activity(
        self,
        lead_id: str,
        activity_type: str,
        title: str,
        description: Optional[str] = None,
        performed_by_id: Optional[str] = None,
    ) -> LeadActivity:
        act = LeadActivity(
            workspace_id=self.workspace_id,
            lead_id=lead_id,
            activity_type=activity_type,
            title=title,
            description=description,
            performed_by_id=performed_by_id,
            created_at=datetime.now(timezone.utc),
        )
        self.db.add(act)
        self.db.commit()
        self.db.refresh(act)
        return act

    def get_pipeline(self) -> Dict[LeadStatus, List[Lead]]:
        leads = self.scoped_query().order_by(desc(Lead.created_at)).all()
        pipeline = {s: [] for s in LeadStatus}
        for lead in leads:
            pipeline[lead.status].append(lead)
        return pipeline

    def get_dashboard_metrics(self) -> Dict[str, Any]:
        leads = self.scoped_query().all()
        total = len(leads)
        new_cnt = sum(1 for l in leads if l.status == LeadStatus.NEW)
        contacted = sum(1 for l in leads if l.status == LeadStatus.CONTACTED)
        trials = sum(1 for l in leads if l.status == LeadStatus.TRIAL)
        converted = sum(1 for l in leads if l.status == LeadStatus.CONVERTED)
        lost = sum(1 for l in leads if l.status == LeadStatus.LOST)

        conv_rate = (converted / total * 100) if total > 0 else 0.0
        pipeline_val = sum(l.expected_value for l in leads if l.status not in [LeadStatus.CONVERTED, LeadStatus.LOST])

        # Follow-ups
        now = datetime.now(timezone.utc)
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = now.replace(hour=23, minute=59, second=59, microsecond=999999)

        fu_query = self.db.query(LeadFollowUp).filter(LeadFollowUp.workspace_id == self.workspace_id)
        due_today = fu_query.filter(
            LeadFollowUp.status == FollowUpStatus.PENDING,
            LeadFollowUp.scheduled_at >= today_start,
            LeadFollowUp.scheduled_at <= today_end,
        ).count()

        overdue = fu_query.filter(
            LeadFollowUp.status == FollowUpStatus.PENDING,
            LeadFollowUp.scheduled_at < today_start,
        ).count()

        upcoming = fu_query.filter(
            LeadFollowUp.status == FollowUpStatus.PENDING,
            LeadFollowUp.scheduled_at > today_end,
        ).count()

        # Funnel
        funnel = [
            {"stage": "New", "count": new_cnt, "pct": round(new_cnt / total * 100, 1) if total else 0},
            {"stage": "Contacted", "count": contacted, "pct": round(contacted / total * 100, 1) if total else 0},
            {"stage": "Trials", "count": trials, "pct": round(trials / total * 100, 1) if total else 0},
            {"stage": "Converted", "count": converted, "pct": round(converted / total * 100, 1) if total else 0},
            {"stage": "Lost", "count": lost, "pct": round(lost / total * 100, 1) if total else 0},
        ]

        # Sources
        sources_map: Dict[str, int] = {}
        for l in leads:
            s = l.source or "Other"
            sources_map[s] = sources_map.get(s, 0) + 1
        leads_by_source = [{"source": k, "count": v} for k, v in sources_map.items()]

        # Expired / At-Risk counts
        expired_count = self.db.query(Member).filter(
            Member.workspace_id == self.workspace_id,
            Member.status == MemberStatus.EXPIRED,
        ).count()

        return {
            "total_leads": total,
            "new_leads": new_cnt,
            "contacted_leads": contacted,
            "trials": trials,
            "converted_leads": converted,
            "lost_leads": lost,
            "conversion_rate_pct": round(conv_rate, 1),
            "follow_ups_due_today": due_today,
            "overdue_follow_ups": overdue,
            "upcoming_follow_ups": upcoming,
            "renewals_due_count": 0,
            "inactive_members_count": expired_count,
            "estimated_pipeline_value": pipeline_val,
            "funnel": funnel,
            "leads_by_source": leads_by_source,
        }

    def get_at_risk_members(self) -> List[Dict[str, Any]]:
        """
        Scans members to find days since last attendance check-in.
        Thresholds:
        - 7-13 days: Attention
        - 14-29 days: At Risk
        - 30+ days: High Risk
        """
        members = self.db.query(Member).filter(
            Member.workspace_id == self.workspace_id,
            Member.status == MemberStatus.ACTIVE,
        ).limit(200).all()

        today = date.today()
        at_risk = []

        for m in members:
            # Find last check in
            last_att = (
                self.db.query(Attendance)
                .filter(
                    Attendance.workspace_id == self.workspace_id,
                    Attendance.member_id == m.id,
                )
                .order_by(desc(Attendance.check_in_time))
                .first()
            )

            if last_att:
                last_date = last_att.check_in_time.date()
                days_inactive = (today - last_date).days
            else:
                days_inactive = (today - m.joined_date).days

            if days_inactive >= 7:
                if days_inactive >= 30:
                    risk_level = "High Risk"
                elif days_inactive >= 14:
                    risk_level = "At Risk"
                else:
                    risk_level = "Attention"

                at_risk.append({
                    "member_id": m.id,
                    "member_name": f"{m.first_name} {m.last_name}".strip(),
                    "phone": m.phone,
                    "email": m.email,
                    "days_inactive": days_inactive,
                    "last_visit": last_att.check_in_time.strftime("%d %b %Y") if last_att else "No visits yet",
                    "risk_level": risk_level,
                    "current_plan": "Standard",
                })

        # Sort by most inactive
        at_risk.sort(key=lambda x: x["days_inactive"], reverse=True)
        return at_risk
