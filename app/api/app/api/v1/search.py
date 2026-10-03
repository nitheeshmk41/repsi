import re
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.core.database import get_db
from app.middleware.tenant import get_current_tenant, TenantContext
from app.models.member import Member, MemberStatus
from app.models.trainer import Trainer, TrainerClient, TrainerClientStatus
from app.models.user import User

router = APIRouter(prefix="/search", tags=["Global Search"])

OWNER_FEATURES = [
    {
        "id": "attendance",
        "title": "Attendance",
        "description": "Manage member attendance and check-in records",
        "category": "Operations",
        "href": "/attendance",
        "keywords": ["attendance", "check-in", "checkin", "entry", "logs", "presence", "rollcall"]
    },
    {
        "id": "members",
        "title": "Members",
        "description": "View, filter and manage member profiles & memberships",
        "category": "Directory",
        "href": "/members",
        "keywords": ["members", "member", "user", "users", "clients", "client", "directory", "people", "subscribers", "profiles"]
    },
    {
        "id": "trainers",
        "title": "Trainers",
        "description": "Manage fitness trainers, schedules, and payouts",
        "category": "Directory",
        "href": "/trainers",
        "keywords": ["trainers", "trainer", "coaches", "coach", "instructors", "staff", "pt", "employee", "employees"]
    },
    {
        "id": "payments",
        "title": "Payments",
        "description": "Track payments, invoices, billing and financial receipts",
        "category": "Finance",
        "href": "/payments",
        "keywords": ["payments", "payment", "billing", "invoices", "revenue", "transactions", "money", "receipts", "cash", "upi", "card"]
    },
    {
        "id": "memberships",
        "title": "Memberships",
        "description": "Membership plans, pricing, renewals and packages",
        "category": "Plans",
        "href": "/memberships",
        "keywords": ["memberships", "membership", "plans", "pricing", "subscriptions", "packages", "rates", "renewals"]
    },
    {
        "id": "reports",
        "title": "Reports & Analytics",
        "description": "Analytics reports, revenue insights & retention metrics",
        "category": "Analytics",
        "href": "/reports",
        "keywords": ["reports", "report", "analytics", "insights", "graphs", "revenue", "metrics", "stats"]
    },
    {
        "id": "expenses",
        "title": "Expenses",
        "description": "Track gym operational expenses and equipment costs",
        "category": "Finance",
        "href": "/expenses",
        "keywords": ["expenses", "expense", "costs", "spending", "bills", "outflow", "purchases"]
    },
    {
        "id": "crm",
        "title": "Leads & CRM",
        "description": "CRM leads, sales pipeline and prospect conversion",
        "category": "Growth",
        "href": "/crm",
        "keywords": ["leads", "lead", "crm", "sales", "pipeline", "prospects", "inquiries", "growth", "deals"]
    },
    {
        "id": "website",
        "title": "Website Builder",
        "description": "Customize public gym landing page, branding & theme",
        "category": "Growth",
        "href": "/website",
        "keywords": ["website", "builder", "landing", "domain", "slug", "site", "online"]
    },
    {
        "id": "settings",
        "title": "Settings",
        "description": "Workspace settings, roles, integrations and profile",
        "category": "System",
        "href": "/settings",
        "keywords": ["settings", "setting", "preferences", "config", "profile", "account", "gym", "roles", "workspace"]
    }
]

TRAINER_FEATURES = [
    {
        "id": "my-clients",
        "title": "My Clients",
        "description": "View and manage your assigned fitness clients",
        "category": "Clients",
        "href": "/trainer/members",
        "keywords": ["clients", "client", "user", "users", "my clients", "members", "assigned", "trainees"]
    },
    {
        "id": "attendance",
        "title": "Attendance",
        "description": "Member check-ins and session attendance",
        "category": "Operations",
        "href": "/attendance",
        "keywords": ["attendance", "check-in", "sessions", "presence"]
    },
    {
        "id": "workouts",
        "title": "Workouts",
        "description": "Workout routines, plans, and exercise tracking",
        "category": "Training",
        "href": "/workouts",
        "keywords": ["workouts", "workout", "routines", "exercises", "plans", "fitness"]
    },
    {
        "id": "progress",
        "title": "Progress",
        "description": "Client fitness progress and metric analytics",
        "category": "Analytics",
        "href": "/reports",
        "keywords": ["progress", "reports", "metrics", "goals", "results"]
    },
    {
        "id": "schedule",
        "title": "Schedule",
        "description": "Class schedules, training sessions, and calendar",
        "category": "Schedule",
        "href": "/classes",
        "keywords": ["schedule", "classes", "calendar", "sessions", "timetable"]
    },
    {
        "id": "messages",
        "title": "Messages",
        "description": "Direct messages and notifications with clients",
        "category": "Communication",
        "href": "/chat",
        "keywords": ["messages", "message", "chat", "notifications", "communication"]
    },
    {
        "id": "tasks",
        "title": "Tasks",
        "description": "Trainer tasks, follow-ups, and client reminders",
        "category": "Tasks",
        "href": "/crm",
        "keywords": ["tasks", "task", "todo", "followups", "reminders"]
    }
]


@router.get("/global")
def global_search(
    q: Optional[str] = Query(default="", description="Search query string"),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    query_str = (q or "").strip()
    query_lower = query_str.lower()
    digits_only = re.sub(r"\D", "", query_str)

    # Determine user role
    role_str = str(tenant.role or "").upper()
    is_trainer = (role_str == "TRAINER")

    matched_members = []
    matched_trainers = []
    matched_features = []

    # 1. Feature search
    feature_list = TRAINER_FEATURES if is_trainer else OWNER_FEATURES
    if not query_str:
        matched_features = feature_list
    else:
        for f in feature_list:
            if (query_lower in f["title"].lower() or 
                query_lower in f["description"].lower() or 
                any(query_lower in kw or kw in query_lower for kw in f["keywords"])):
                matched_features.append(f)

    # 2. Member & Trainer search
    if query_str:
        like_pattern = f"%{query_str}%"

        # MEMBER QUERY (outerjoin User model to match connected user names/emails)
        member_query = db.query(Member).outerjoin(User, Member.user_id == User.id).filter(
            Member.workspace_id == tenant.workspace_id
        )

        if is_trainer:
            trainer_obj = db.query(Trainer).filter(
                Trainer.workspace_id == tenant.workspace_id,
                Trainer.user_id == tenant.user_id
            ).first()

            if trainer_obj:
                assigned_client_ids = [
                    tc.client_id for tc in db.query(TrainerClient.client_id).filter(
                        TrainerClient.workspace_id == tenant.workspace_id,
                        TrainerClient.trainer_id == trainer_obj.id,
                        TrainerClient.status == TrainerClientStatus.ACTIVE
                    ).all()
                ]
                member_query = member_query.filter(
                    or_(
                        Member.trainer_id == trainer_obj.id,
                        Member.id.in_(assigned_client_ids) if assigned_client_ids else False
                    )
                )
            else:
                member_query = member_query.filter(False)

        # Safe string expressions using coalesce to prevent NULL concatenation issues
        first_name_safe = func.coalesce(Member.first_name, "")
        last_name_safe = func.coalesce(Member.last_name, "")
        full_name_safe = func.concat(first_name_safe, " ", last_name_safe)

        filter_conditions = [
            first_name_safe.ilike(like_pattern),
            last_name_safe.ilike(like_pattern),
            full_name_safe.ilike(like_pattern),
            Member.email.ilike(like_pattern),
            Member.phone.ilike(like_pattern),
            Member.notes.ilike(like_pattern),
            Member.id.ilike(like_pattern),
            User.full_name.ilike(like_pattern),
            User.email.ilike(like_pattern),
        ]

        if digits_only and len(digits_only) >= 2:
            filter_conditions.append(Member.phone.ilike(f"%{digits_only}%"))
            filter_conditions.append(Member.id.ilike(f"%{digits_only}%"))

        if query_lower in ["active", "expired", "expiring", "frozen", "cancelled"]:
            filter_conditions.append(Member.status.ilike(query_lower))

        member_query = member_query.filter(or_(*filter_conditions))

        members_db = member_query.limit(12).all()
        for idx, m in enumerate(members_db):
            name = f"{m.first_name or ''} {m.last_name or ''}".strip() or "Unnamed Member"
            code_num = m.id[-4:].upper() if len(m.id) >= 4 else f"{idx+1020}"
            member_code = f"RP-{code_num}"
            status_val = m.status.value if hasattr(m.status, "value") else str(m.status)
            status_title = status_val.capitalize()
            plan_str = m.plan_name if hasattr(m, "plan_name") else "Monthly"
            
            matched_members.append({
                "id": m.id,
                "name": name,
                "code": member_code,
                "status": status_title,
                "email": m.email or "",
                "phone": m.phone or "",
                "plan": plan_str,
                "subtitle": f"{member_code} · {status_title} member",
                "meta": f"Phone: {m.phone}" if m.phone else (f"Plan: {plan_str}"),
                "href": f"/members/{m.id}" if not is_trainer else f"/trainer/members/{m.id}"
            })

        # TRAINER QUERY (Only for Owner / Admin / SuperAdmin)
        if not is_trainer:
            trainer_conditions = [
                Trainer.name.ilike(like_pattern),
                Trainer.email.ilike(like_pattern),
                Trainer.phone.ilike(like_pattern),
                Trainer.specialization.ilike(like_pattern),
                Trainer.id.ilike(like_pattern)
            ]
            if digits_only and len(digits_only) >= 2:
                trainer_conditions.append(Trainer.phone.ilike(f"%{digits_only}%"))
                trainer_conditions.append(Trainer.id.ilike(f"%{digits_only}%"))

            trainer_query = db.query(Trainer).filter(
                Trainer.workspace_id == tenant.workspace_id,
                or_(*trainer_conditions)
            )
            trainers_db = trainer_query.limit(8).all()
            for idx, tr in enumerate(trainers_db):
                code_num = tr.id[-3:].upper() if len(tr.id) >= 3 else f"{idx+10}"
                trainer_code = f"TR-{code_num}"
                spec = tr.specialization or "Personal Trainer"
                
                matched_trainers.append({
                    "id": tr.id,
                    "name": tr.name,
                    "code": trainer_code,
                    "specialization": spec,
                    "phone": tr.phone or "",
                    "subtitle": f"{trainer_code} · {spec}",
                    "meta": f"Phone: {tr.phone}" if tr.phone else "",
                    "href": f"/trainers/{tr.id}"
                })

    return {
        "query": query_str,
        "role": role_str,
        "members": matched_members,
        "trainers": matched_trainers,
        "features": matched_features
    }
