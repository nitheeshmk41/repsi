from typing import List, Optional
from datetime import date, timedelta
from urllib.parse import quote
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.member import MembershipPlan, Membership, Member, MemberStatus
from app.models.user import Workspace
from app.schemas.membership import (
    MembershipPlanCreate,
    MembershipPlanResponse,
    MembershipCreate,
    MembershipResponse,
    ExpiringMembershipItem,
    RenewalReminderItem,
)
from app.repositories.base import BaseTenantRepository
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/memberships", tags=["Memberships"])


@router.get("/plans", response_model=List[MembershipPlanResponse])
def get_plans(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[MembershipPlan](MembershipPlan, db, tenant.workspace_id)
    plans = repo.get_multi(limit=50)
    return plans or []


@router.post("/plans", response_model=MembershipPlanResponse, status_code=status.HTTP_201_CREATED)
def create_plan(
    data: MembershipPlanCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    if tenant.role not in ["OWNER", "ADMIN", "STAFF"]:
        raise HTTPException(status_code=403, detail="Forbidden. Only staff/owners can create membership plans.")
    repo = BaseTenantRepository[MembershipPlan](MembershipPlan, db, tenant.workspace_id)
    return repo.create(**data.model_dump())


@router.get("/", response_model=List[MembershipResponse])
def list_memberships(
    member_id: Optional[str] = None,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    query = db.query(Membership).filter(Membership.workspace_id == tenant.workspace_id)
    if member_id:
        query = query.filter(Membership.member_id == member_id)
    return query.order_by(Membership.end_date.desc()).limit(100).all()


@router.post("/", response_model=MembershipResponse, status_code=status.HTTP_201_CREATED)
def create_membership(
    data: MembershipCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    if tenant.role not in ["OWNER", "ADMIN", "STAFF"]:
        raise HTTPException(status_code=403, detail="Forbidden. Only staff/owners can assign memberships.")

    plan = db.query(MembershipPlan).filter(
        MembershipPlan.workspace_id == tenant.workspace_id,
        MembershipPlan.id == data.plan_id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Membership plan not found")

    member = db.query(Member).filter(
        Member.workspace_id == tenant.workspace_id,
        Member.id == data.member_id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    # Calculate end date based on duration_months
    days_duration = max(1, plan.duration_months) * 30
    end_date = data.start_date + timedelta(days=days_duration)

    repo = BaseTenantRepository[Membership](Membership, db, tenant.workspace_id)
    membership = repo.create(
        member_id=data.member_id,
        plan_id=data.plan_id,
        start_date=data.start_date,
        end_date=end_date,
        status=MemberStatus.ACTIVE,
        price_paid=data.price_paid,
        auto_renew=data.auto_renew
    )

    # Ensure member status is active
    if member.status != MemberStatus.ACTIVE:
        member.status = MemberStatus.ACTIVE
        db.commit()

    return membership


@router.get("/expiring", response_model=List[ExpiringMembershipItem])
def get_expiring_memberships(
    days: int = Query(7, ge=1, le=90),
    include_expired: bool = Query(True),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """
    Finds memberships expiring within `days` or already expired.
    """
    today = date.today()
    max_expiry = today + timedelta(days=days)

    query = (
        db.query(Membership, Member, MembershipPlan)
        .join(Member, Membership.member_id == Member.id)
        .join(MembershipPlan, Membership.plan_id == MembershipPlan.id)
        .filter(Membership.workspace_id == tenant.workspace_id)
    )

    if include_expired:
        query = query.filter(
            (Membership.end_date <= max_expiry) |
            (Membership.status == MemberStatus.EXPIRED)
        )
    else:
        query = query.filter(
            Membership.end_date >= today,
            Membership.end_date <= max_expiry,
            Membership.status == MemberStatus.ACTIVE
        )

    results = query.order_by(Membership.end_date.asc()).limit(100).all()

    items = []
    for mem, member, plan in results:
        days_remaining = (mem.end_date - today).days
        items.append(
            ExpiringMembershipItem(
                membership_id=mem.id,
                member_id=member.id,
                member_name=f"{member.first_name} {member.last_name}".strip(),
                phone=member.phone,
                email=member.email,
                plan_name=plan.name,
                start_date=mem.start_date,
                end_date=mem.end_date,
                days_remaining=days_remaining,
                status=mem.status,
                price_paid=mem.price_paid,
            )
        )
    return items


@router.post("/check-expiries")
def check_and_update_expiries(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """
    Audit and update all memberships where end_date < today to EXPIRED status.
    """
    if tenant.role not in ["OWNER", "ADMIN", "STAFF"]:
        raise HTTPException(status_code=403, detail="Forbidden.")

    today = date.today()
    overdue_memberships = (
        db.query(Membership)
        .filter(
            Membership.workspace_id == tenant.workspace_id,
            Membership.end_date < today,
            Membership.status == MemberStatus.ACTIVE
        )
        .all()
    )

    expired_count = len(overdue_memberships)
    for mem in overdue_memberships:
        mem.status = MemberStatus.EXPIRED
        # Also check if member has any other active membership
        other_active = (
            db.query(Membership)
            .filter(
                Membership.workspace_id == tenant.workspace_id,
                Membership.member_id == mem.member_id,
                Membership.id != mem.id,
                Membership.end_date >= today,
                Membership.status == MemberStatus.ACTIVE
            )
            .first()
        )
        if not other_active:
            m = db.query(Member).filter(Member.id == mem.member_id).first()
            if m:
                m.status = MemberStatus.EXPIRED

    db.commit()

    # Expiring soon (next 7 days)
    expiring_soon_count = (
        db.query(Membership)
        .filter(
            Membership.workspace_id == tenant.workspace_id,
            Membership.end_date >= today,
            Membership.end_date <= today + timedelta(days=7),
            Membership.status == MemberStatus.ACTIVE
        )
        .count()
    )

    return {
        "status": "success",
        "expired_updated": expired_count,
        "expiring_soon_7d": expiring_soon_count,
        "audit_date": today.isoformat()
    }


@router.get("/renewal-reminders", response_model=List[RenewalReminderItem])
def get_renewal_reminders(
    days: int = Query(7, ge=1, le=90),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """
    Pre-generates custom WhatsApp reminder links and SMS message templates for upcoming renewals.
    """
    today = date.today()
    max_date = today + timedelta(days=days)

    ws = db.query(Workspace).filter(Workspace.id == tenant.workspace_id).first()
    gym_name = ws.name if ws else "the gym"

    records = (
        db.query(Membership, Member, MembershipPlan)
        .join(Member, Membership.member_id == Member.id)
        .join(MembershipPlan, Membership.plan_id == MembershipPlan.id)
        .filter(
            Membership.workspace_id == tenant.workspace_id,
            Membership.end_date <= max_date,
        )
        .order_by(Membership.end_date.asc())
        .limit(50)
        .all()
    )

    reminders = []
    for mem, member, plan in records:
        days_left = (mem.end_date - today).days
        if days_left < 0:
            urgency = f"expired on {mem.end_date.strftime('%d %b')}"
        elif days_left == 0:
            urgency = "expires TODAY"
        elif days_left == 1:
            urgency = "expires tomorrow"
        else:
            urgency = f"expires in {days_left} days ({mem.end_date.strftime('%d %b')})"

        msg = (
            f"Hi {member.first_name}! Your {plan.name} membership at {gym_name} {urgency}. "
            f"Renew today to avoid break in access and keep your workout progress on track: "
            f"https://repsi.app/{ws.slug if ws else 'pay'}/renew?member={member.id}"
        )

        # Format clean international or Indian phone for WhatsApp (e.g. 919876543210)
        clean_phone = "".join(c for c in member.phone if c.isdigit())
        if len(clean_phone) == 10:
            clean_phone = "91" + clean_phone

        wa_url = f"https://wa.me/{clean_phone}?text={quote(msg)}"

        reminders.append(
            RenewalReminderItem(
                member_id=member.id,
                member_name=f"{member.first_name} {member.last_name}".strip(),
                phone=member.phone,
                email=member.email,
                plan_name=plan.name,
                expiry_date=mem.end_date,
                days_remaining=days_left,
                amount_due=plan.price,
                message_template=msg,
                whatsapp_url=wa_url,
            )
        )
    return reminders
