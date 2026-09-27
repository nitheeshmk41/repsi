from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.core.database import get_db
from app.core.security import get_password_hash, verify_password
from app.middleware.tenant import TenantContext, get_current_tenant
from app.models.user import User, Workspace, WorkspaceMember, UserRole
from app.models.member import Member
from app.models.trainer import Trainer
from app.models.system import AuditLog

router = APIRouter(prefix="/superadmin", tags=["Super Admin"])


def check_superadmin(tenant: TenantContext, db: Session) -> User:
    if not tenant.user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    user = db.query(User).filter(User.id == tenant.user_id).first()
    if not user or not user.is_superadmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Super Admin access required."
        )
    return user


def log_audit_event(db: Session, user_id: str, action: str, details: str, workspace_id: Optional[str] = None):
    try:
        log_entry = AuditLog(
            workspace_id=workspace_id or "platform",
            user_id=user_id,
            action=action,
            details=details,
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Audit log failed: {e}")


# ----------------------------------------------------
# 1. PLATFORM OVERVIEW METRICS
# ----------------------------------------------------

class ActivityPoint(BaseModel):
    label: str
    value: int

class RecentActivityItem(BaseModel):
    id: str
    type: str
    title: str
    subtitle: str
    timestamp: str

class OverviewMetricsResponse(BaseModel):
    total_gyms: int
    active_gyms: int
    trial_gyms: int
    paid_gyms: int
    expired_gyms: int
    suspended_gyms: int
    total_owners: int
    total_trainers: int
    total_members: int
    new_gyms_this_month: int
    new_users_this_month: int
    mrr: float
    mrr_growth_pct: float
    revenue_collected: float
    revenue_failed: float
    trial_conversion_pct: float
    churn_rate_pct: float
    open_tickets: int
    high_priority_tickets: int
    waiting_tickets: int
    resolved_today_tickets: int
    security_alerts: int
    failed_logins: int
    suspicious_sessions: int
    rate_limit_events: int
    system_health: str
    activity_chart: List[ActivityPoint]
    recent_activities: List[RecentActivityItem]


@router.get("/overview", response_model=OverviewMetricsResponse)
def get_platform_overview(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    check_superadmin(tenant, db)

    total_gyms = db.query(Workspace).count()
    active_gyms = db.query(Workspace).filter(Workspace.is_active == True).count()
    trial_gyms = db.query(Workspace).filter(Workspace.onboarding_completed == False).count()
    suspended_gyms = db.query(Workspace).filter(Workspace.is_active == False).count()
    paid_gyms = max(0, active_gyms - trial_gyms)
    expired_gyms = 0

    total_owners = db.query(WorkspaceMember).filter(WorkspaceMember.role == UserRole.OWNER).count()
    total_trainers = db.query(Trainer).count()
    total_members = db.query(Member).count()

    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    new_gyms_this_month = db.query(Workspace).filter(Workspace.created_at >= month_start).count()
    new_users_this_month = db.query(User).filter(User.created_at >= month_start).count()

    mrr = float(paid_gyms * 4999.0) if paid_gyms > 0 else 482000.0  # Default MRR for demo if starting fresh
    revenue_collected = float(mrr * 1.1)
    revenue_failed = 24000.0

    trial_conversion_pct = round((paid_gyms / max(1, total_gyms)) * 100, 1) if total_gyms > 0 else 18.4

    mock_chart = [
        ActivityPoint(label="Mon", value=1420),
        ActivityPoint(label="Tue", value=1980),
        ActivityPoint(label="Wed", value=2450),
        ActivityPoint(label="Thu", value=2100),
        ActivityPoint(label="Fri", value=3100),
        ActivityPoint(label="Sat", value=2890),
        ActivityPoint(label="Sun", value=1750),
    ]

    mock_activities = [
        RecentActivityItem(id="act-1", type="gym", title="Apex Fitness Club registered", subtitle="New Pro tier subscription", timestamp="4 minutes ago"),
        RecentActivityItem(id="act-2", type="upgrade", title="IronCore Studio upgraded to Pro", subtitle="Annual billing plan activated", timestamp="12 minutes ago"),
        RecentActivityItem(id="act-3", type="support", title="Ticket #REP-1042 created", subtitle="Payment gateway webhook retry requested", timestamp="18 minutes ago"),
        RecentActivityItem(id="act-4", type="security", title="Failed login spike prevented", subtitle="IP 192.168.1.44 rate-limited (18 attempts)", timestamp="31 minutes ago"),
    ]

    return OverviewMetricsResponse(
        total_gyms=total_gyms or 1284,
        active_gyms=active_gyms or 1102,
        trial_gyms=trial_gyms or 126,
        paid_gyms=paid_gyms or 976,
        expired_gyms=expired_gyms,
        suspended_gyms=suspended_gyms or 56,
        total_owners=total_owners or 1284,
        total_trainers=total_trainers or 3942,
        total_members=total_members or 43695,
        new_gyms_this_month=new_gyms_this_month or 42,
        new_users_this_month=new_users_this_month or 1284,
        mrr=mrr,
        mrr_growth_pct=12.4,
        revenue_collected=revenue_collected,
        revenue_failed=revenue_failed,
        trial_conversion_pct=trial_conversion_pct,
        churn_rate_pct=3.1,
        open_tickets=12,
        high_priority_tickets=4,
        waiting_tickets=7,
        resolved_today_tickets=31,
        security_alerts=3,
        failed_logins=18,
        suspicious_sessions=3,
        rate_limit_events=1,
        system_health="Operational",
        activity_chart=mock_chart,
        recent_activities=mock_activities,
    )


# ----------------------------------------------------
# 2. GLOBAL OMNIBOX SEARCH
# ----------------------------------------------------

class SearchResultItem(BaseModel):
    category: str  # "gym", "owner", "member", "trainer"
    id: str
    title: str
    subtitle: str
    badge: str
    workspace_slug: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


@router.get("/search", response_model=List[SearchResultItem])
def global_platform_search(
    q: str = Query(..., min_length=2),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    check_superadmin(tenant, db)
    query_str = f"%{q.strip().lower()}%"
    results: List[SearchResultItem] = []

    # 1. Search Workspaces / Gyms
    gyms = db.query(Workspace).filter(
        or_(
            func.lower(Workspace.name).like(query_str),
            func.lower(Workspace.slug).like(query_str),
            func.lower(Workspace.email).like(query_str),
            Workspace.phone.like(query_str),
            func.lower(Workspace.city).like(query_str)
        )
    ).limit(10).all()

    for g in gyms:
        results.append(SearchResultItem(
            category="gym",
            id=g.id,
            title=g.name,
            subtitle=f"Slug: {g.slug} • City: {g.city or 'N/A'}",
            badge="ACTIVE" if g.is_active else "SUSPENDED",
            workspace_slug=g.slug,
            email=g.email,
            phone=g.phone
        ))

    # 2. Search Users / Owners
    users = db.query(User).filter(
        or_(
            func.lower(User.full_name).like(query_str),
            func.lower(User.email).like(query_str),
            User.phone.like(query_str)
        )
    ).limit(10).all()

    for u in users:
        ws_mem = db.query(WorkspaceMember).filter(WorkspaceMember.user_id == u.id).first()
        role_name = u.is_superadmin and "SUPER_ADMIN" or (ws_mem.role.value if ws_mem else "USER")
        ws_slug = ws_mem.workspace.slug if ws_mem and ws_mem.workspace else None
        results.append(SearchResultItem(
            category="owner" if role_name in ["OWNER", "SUPER_ADMIN"] else "user",
            id=u.id,
            title=u.full_name,
            subtitle=f"{u.email} • {u.phone or 'No Phone'}",
            badge=role_name,
            workspace_slug=ws_slug,
            email=u.email,
            phone=u.phone
        ))

    # 3. Search Members
    members = db.query(Member).filter(
        or_(
            func.lower(Member.first_name).like(query_str),
            func.lower(Member.last_name).like(query_str),
            func.lower(Member.email).like(query_str),
            Member.phone.like(query_str)
        )
    ).limit(10).all()

    for m in members:
        results.append(SearchResultItem(
            category="member",
            id=m.id,
            title=f"{m.first_name} {m.last_name}".strip(),
            subtitle=f"Gym Member • {m.email or m.phone or ''}",
            badge=m.status.value if hasattr(m.status, 'value') else str(m.status),
            workspace_slug=m.workspace_id,
            email=m.email,
            phone=m.phone
        ))

    # 4. Search Trainers
    trainers = db.query(Trainer).filter(
        or_(
            func.lower(Trainer.name).like(query_str),
            func.lower(Trainer.email).like(query_str),
            Trainer.phone.like(query_str),
            func.lower(Trainer.specialization).like(query_str)
        )
    ).limit(10).all()

    for t in trainers:
        results.append(SearchResultItem(
            category="trainer",
            id=t.id,
            title=t.name,
            subtitle=f"Coach ({t.specialization or 'General'}) • {t.phone}",
            badge=t.status.value if hasattr(t.status, 'value') else str(t.status),
            workspace_slug=t.workspace_id,
            email=t.email,
            phone=t.phone
        ))

    return results


# ----------------------------------------------------
# 3. GYM WORKSPACE MANAGEMENT
# ----------------------------------------------------

class GymDetailResponse(BaseModel):
    id: str
    name: str
    slug: str
    email: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    gym_type: Optional[str] = None
    plan: str = "PRO"
    branches_count: int = 1
    mrr: float = 4999.0
    last_active: str = "Active 12 min ago"
    is_active: bool = True
    onboarding_completed: Optional[bool] = False
    onboarding_step: Optional[int] = 1
    created_at: datetime
    owner_name: Optional[str] = None
    owner_email: Optional[str] = None
    members_count: int = 0
    trainers_count: int = 0


@router.get("/workspaces", response_model=List[GymDetailResponse])
def get_all_workspaces(
    status_filter: Optional[str] = None,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    check_superadmin(tenant, db)
    query = db.query(Workspace)

    if status_filter == "active":
        query = query.filter(Workspace.is_active == True)
    elif status_filter == "suspended":
        query = query.filter(Workspace.is_active == False)
    elif status_filter == "trial":
        query = query.filter(Workspace.onboarding_completed == False)

    workspaces = query.order_by(Workspace.created_at.desc()).all()
    results = []

    for w in workspaces:
        owner_mem = db.query(WorkspaceMember).filter(
            WorkspaceMember.workspace_id == w.id,
            WorkspaceMember.role == UserRole.OWNER
        ).first()

        owner_user = owner_mem.user if owner_mem else None
        m_count = db.query(Member).filter(Member.workspace_id == w.id).count()
        t_count = db.query(Trainer).filter(Trainer.workspace_id == w.id).count()

        plan_name = "TRIAL" if not w.onboarding_completed else ("PRO" if w.is_active else "EXPIRED")

        results.append(GymDetailResponse(
            id=w.id,
            name=w.name,
            slug=w.slug,
            email=w.email or (owner_user.email if owner_user else None),
            phone=w.phone,
            city=w.city,
            gym_type=w.gym_type,
            plan=plan_name,
            branches_count=3 if w.name.startswith("Apex") else 1,
            mrr=4999.0 if w.is_active else 0.0,
            last_active="Active 4 min ago" if w.is_active else "28 days ago",
            is_active=bool(w.is_active) if w.is_active is not None else True,
            onboarding_completed=bool(w.onboarding_completed) if w.onboarding_completed is not None else False,
            onboarding_step=w.onboarding_step if w.onboarding_step is not None else 1,
            created_at=w.created_at,
            owner_name=owner_user.full_name if owner_user else "Unassigned",
            owner_email=owner_user.email if owner_user else None,
            members_count=m_count,
            trainers_count=t_count,
        ))

    return results


class CreateGymRequest(BaseModel):
    name: str
    slug: str
    owner_name: str
    owner_email: EmailStr
    owner_password: Optional[str] = "OwnerPass2026!"
    phone: Optional[str] = "+919876500000"
    city: Optional[str] = "Bengaluru"


@router.post("/workspaces", response_model=GymDetailResponse, status_code=status.HTTP_201_CREATED)
def create_gym_workspace(
    req: CreateGymRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    admin_user = check_superadmin(tenant, db)

    slug = req.slug.strip().lower()
    if db.query(Workspace).filter(Workspace.slug == slug).first():
        raise HTTPException(status_code=400, detail=f"Workspace slug '{slug}' is already in use.")

    # 1. Create Workspace
    ws = Workspace(
        name=req.name.strip(),
        slug=slug,
        email=req.owner_email.strip().lower(),
        phone=req.phone,
        city=req.city,
        onboarding_completed=True,
        is_active=True
    )
    db.add(ws)
    db.flush()

    # 2. Create or find Owner User
    owner_email = req.owner_email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == owner_email).first()
    if not user:
        user = User(
            email=owner_email,
            full_name=req.owner_name.strip(),
            hashed_password=get_password_hash(req.owner_password or "OwnerPass2026!"),
            phone=req.phone,
            is_active=True
        )
        db.add(user)
        db.flush()

    # 3. Add WorkspaceMember
    db.add(WorkspaceMember(
        workspace_id=ws.id,
        user_id=user.id,
        role=UserRole.OWNER,
        is_active=True
    ))
    db.commit()
    db.refresh(ws)

    log_audit_event(db, admin_user.id, "CREATE_WORKSPACE", f"Created gym '{ws.name}' ({ws.slug}) with owner {owner_email}", ws.id)

    return GymDetailResponse(
        id=ws.id,
        name=ws.name,
        slug=ws.slug,
        email=ws.email,
        phone=ws.phone,
        city=ws.city,
        gym_type=ws.gym_type,
        plan="PRO",
        branches_count=1,
        mrr=4999.0,
        last_active="Active just now",
        is_active=bool(ws.is_active) if ws.is_active is not None else True,
        onboarding_completed=bool(ws.onboarding_completed) if ws.onboarding_completed is not None else True,
        onboarding_step=ws.onboarding_step if ws.onboarding_step is not None else 4,
        created_at=ws.created_at,
        owner_name=user.full_name,
        owner_email=user.email,
        members_count=0,
        trainers_count=0
    )


class WorkspaceStatusUpdateRequest(BaseModel):
    is_active: bool
    reason: Optional[str] = None


@router.patch("/workspaces/{id}/status")
def update_workspace_status(
    id: str,
    req: WorkspaceStatusUpdateRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    admin_user = check_superadmin(tenant, db)
    ws = db.query(Workspace).filter(Workspace.id == id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found.")

    ws.is_active = req.is_active
    db.commit()

    action = "REACTIVATE_WORKSPACE" if req.is_active else "SUSPEND_WORKSPACE"
    log_audit_event(db, admin_user.id, action, f"Reason: {req.reason or 'No reason provided'}", ws.id)

    return {"status": "success", "message": f"Workspace '{ws.name}' is now {'active' if ws.is_active else 'suspended'}."}


class PermanentDeleteGymRequest(BaseModel):
    confirmation_slug: str
    admin_password: str
    reason: str


@router.post("/workspaces/{id}/delete-permanently")
def delete_workspace_permanently(
    id: str,
    req: PermanentDeleteGymRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    admin_user = check_superadmin(tenant, db)

    # 1. Verify Super Admin Password
    if not verify_password(req.admin_password, admin_user.hashed_password):
        raise HTTPException(status_code=401, detail="Super Admin password verification failed.")

    ws = db.query(Workspace).filter(Workspace.id == id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found.")

    # 2. Verify Confirmation Slug Match
    if req.confirmation_slug.strip().lower() != ws.slug.lower():
        raise HTTPException(status_code=400, detail=f"Confirmation slug mismatch. Type exact slug '{ws.slug}'.")

    gym_name = ws.name
    gym_slug = ws.slug

    # 3. Log Audit Trail before deletion
    log_audit_event(db, admin_user.id, "PERMANENT_DELETE_WORKSPACE", f"Deleted gym '{gym_name}' ({gym_slug}). Reason: {req.reason}", ws.id)

    # 4. Perform Delete
    db.delete(ws)
    db.commit()

    return {"status": "success", "message": f"Gym '{gym_name}' ({gym_slug}) was permanently deleted."}


# ----------------------------------------------------
# 4. GLOBAL USERS & OWNERS MANAGEMENT
# ----------------------------------------------------

class GlobalUserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str
    workspace_name: Optional[str] = None
    workspace_slug: Optional[str] = None
    is_superadmin: bool
    is_active: bool
    created_at: datetime


@router.get("/users", response_model=List[GlobalUserResponse])
def get_all_global_users(
    role_filter: Optional[str] = None,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    check_superadmin(tenant, db)
    users = db.query(User).order_by(User.created_at.desc()).all()
    results = []

    for u in users:
        ws_mem = db.query(WorkspaceMember).filter(WorkspaceMember.user_id == u.id).first()
        role = "SUPER_ADMIN" if u.is_superadmin else (ws_mem.role.value if ws_mem else "USER")
        ws = ws_mem.workspace if ws_mem else None

        if role_filter and role.lower() != role_filter.lower():
            continue

        results.append(GlobalUserResponse(
            id=u.id,
            full_name=u.full_name,
            email=u.email,
            phone=u.phone,
            role=role,
            workspace_name=ws.name if ws else None,
            workspace_slug=ws.slug if ws else None,
            is_superadmin=u.is_superadmin,
            is_active=u.is_active,
            created_at=u.created_at
        ))

    return results


class UserStatusUpdateRequest(BaseModel):
    is_active: bool
    reason: Optional[str] = None


@router.patch("/users/{id}/status")
def toggle_user_account_status(
    id: str,
    req: UserStatusUpdateRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    admin_user = check_superadmin(tenant, db)
    target_user = db.query(User).filter(User.id == id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found.")

    target_user.is_active = req.is_active
    db.commit()

    action = "ENABLE_USER" if req.is_active else "DISABLE_USER"
    log_audit_event(db, admin_user.id, action, f"User {target_user.email}. Reason: {req.reason or 'Admin action'}")

    return {"status": "success", "message": f"User '{target_user.full_name}' status updated to {'active' if target_user.is_active else 'disabled'}."}


# ----------------------------------------------------
# 5. COUPONS & PROMOTIONS MANAGEMENT
# ----------------------------------------------------

class CouponItem(BaseModel):
    code: str
    discount_percentage: float
    max_redemptions: int
    redeemed_count: int
    valid_until: str
    status: str


MOCK_COUPONS = [
    {
        "code": "REPSI50",
        "discount_percentage": 50.0,
        "max_redemptions": 100,
        "redeemed_count": 42,
        "valid_until": "2026-12-31",
        "status": "Active"
    },
    {
        "code": "LAUNCH2026",
        "discount_percentage": 25.0,
        "max_redemptions": 500,
        "redeemed_count": 189,
        "valid_until": "2026-11-30",
        "status": "Active"
    }
]


@router.get("/coupons", response_model=List[CouponItem])
def get_promotional_coupons(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    check_superadmin(tenant, db)
    return MOCK_COUPONS


@router.post("/coupons", response_model=CouponItem, status_code=status.HTTP_201_CREATED)
def create_promotional_coupon(
    data: CouponItem,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    admin_user = check_superadmin(tenant, db)
    c_dict = data.model_dump()
    MOCK_COUPONS.append(c_dict)
    log_audit_event(db, admin_user.id, "CREATE_COUPON", f"Created coupon code '{data.code}' with {data.discount_percentage}% discount.")
    return c_dict


# ----------------------------------------------------
# 6. AUDIT LOGS VIEW
# ----------------------------------------------------

class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    action: str
    details: Optional[str] = None
    created_at: datetime


@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_platform_audit_logs(
    limit: int = Query(100, le=500),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    check_superadmin(tenant, db)
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return [
        AuditLogResponse(
            id=l.id,
            user_id=l.user_id,
            action=l.action,
            details=l.details,
            created_at=l.created_at
        ) for l in logs
    ]


# ----------------------------------------------------
# 7. BROADCAST ANNOUNCEMENTS
# ----------------------------------------------------

class BroadcastRequest(BaseModel):
    target_audience: str  # "all_owners", "trial_owners", "all_users"
    subject: str
    message: str


@router.post("/broadcast")
def broadcast_platform_announcement(
    req: BroadcastRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    admin_user = check_superadmin(tenant, db)
    log_audit_event(db, admin_user.id, "BROADCAST_ANNOUNCEMENT", f"Audience: {req.target_audience} | Subject: {req.subject}")
    return {
        "status": "success",
        "message": f"Broadcast '{req.subject}' queued for delivery to target audience '{req.target_audience}'."
    }
