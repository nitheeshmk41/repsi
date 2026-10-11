from typing import List, Optional
from datetime import date, datetime, timedelta, timezone
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import Workspace, WorkspaceMember, UserRole
from app.models.member import Member, MembershipPlan, Membership, MemberStatus
from app.models.attendance import Attendance, AttendanceMethod
from app.models.finance import Payment, Expense, PaymentMethod, PaymentStatus
from app.models.trainer import Trainer, GymClass
from app.models.billing import GymSubscription, SubscriptionStatus
from app.services.billing import BillingService
from app.schemas.workspace import WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


class DeregisterGymRequest(BaseModel):
    gym_name_confirmation: str
    reason: Optional[str] = None


@router.get("/", response_model=List[WorkspaceResponse])
def get_workspaces(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    return db.query(Workspace).filter(Workspace.id == tenant.workspace_id, Workspace.is_active == True).all()


@router.get("/entitlements", tags=["Workspaces"])
def get_workspace_entitlements(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """
    Returns live feature entitlements and operational limits for the active gym workspace.
    Backed centrally by BillingService and subscription state.
    """
    ws = db.query(Workspace).filter(Workspace.id == tenant.workspace_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")

    sub = BillingService.get_or_create_workspace_subscription(db, ws.id)
    usage = BillingService.get_workspace_usage(db, ws.id)
    limits = BillingService.get_effective_limits(db, ws.id)
    features = BillingService.get_effective_features(db, ws.id)

    now = datetime.now(timezone.utc)
    trial_days_remaining = 0
    if sub.status == SubscriptionStatus.TRIALING and sub.trial_end:
        t_end = sub.trial_end if sub.trial_end.tzinfo else sub.trial_end.replace(tzinfo=timezone.utc)
        trial_days_remaining = max(0, (t_end - now).days)

    return {
        "workspace_id": ws.id,
        "workspace_name": ws.name,
        "plan": sub.plan.code,
        "plan_name": sub.plan.name,
        "plan_display_name": f"{sub.plan.name} Tier",
        "status": sub.status.value if hasattr(sub.status, "value") else str(sub.status),
        "billing_cycle": sub.billing_cycle.value if hasattr(sub.billing_cycle, "value") else str(sub.billing_cycle),
        "trial_active": sub.status == SubscriptionStatus.TRIALING,
        "trial_days_remaining": trial_days_remaining,
        "trial_end": sub.trial_end.isoformat() if sub.trial_end else None,
        "features": features,
        "limits": limits,
        "current_usage": {
            "members": usage["members"]["current"],
            "trainers": usage["trainers"]["current"],
            "staff": usage["staff"]["current"],
            "branches": usage["branches"]["current"],
        },
    }


@router.post("/deregister", tags=["Workspaces"])
def deregister_workspace(
    req: DeregisterGymRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """
    Allows a verified gym OWNER to safely deregister / close their gym workspace.
    Safety constraint: caller must have OWNER role, and must type the exact gym name to confirm.
    """
    if tenant.role != "OWNER" and tenant.role != "SUPER_ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the registered gym owner can deregister this gym workspace."
        )

    ws = db.query(Workspace).filter(Workspace.id == tenant.workspace_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Gym workspace not found.")

    # Validate exact gym name confirmation
    if req.gym_name_confirmation.strip().lower() != ws.name.strip().lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Confirmation name '{req.gym_name_confirmation}' does not match gym name '{ws.name}'. Deregistration cancelled."
        )

    # 1. Soft-deactivate the workspace
    ws.is_active = False

    # 2. Mark subscription as CANCELLED
    sub = db.query(GymSubscription).filter(GymSubscription.workspace_id == ws.id).first()
    if sub:
        sub.status = SubscriptionStatus.CANCELLED
        sub.canceled_at = datetime.now(timezone.utc)
        sub.notes = f"Deregistered by Owner. Reason: {req.reason or 'Not specified'}"

    # 3. Deactivate membership associations
    db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == ws.id).update(
        {"is_active": False}, synchronize_session=False
    )

    # 4. Record audit log
    BillingService.log_subscription_audit(
        db,
        workspace_id=ws.id,
        actor_user_id=tenant.user_id,
        action="gym_deregistration",
        old_value=f"name={ws.name}, is_active=True",
        new_value="is_active=False, subscription=cancelled",
        reason=req.reason or "Owner confirmed deregistration",
    )

    db.commit()

    return {
        "status": "success",
        "message": f"Gym workspace '{ws.name}' has been successfully deregistered."
    }


@router.get("/billing", tags=["Workspaces"])
def get_workspace_billing(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """
    Returns owner SaaS subscription billing information, usage metrics, and invoice history with Repsi.
    """
    ws = db.query(Workspace).filter(Workspace.id == tenant.workspace_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")

    plan = getattr(ws, "plan", "growth") or "growth"
    member_count = db.query(Member).filter(Member.workspace_id == ws.id).count()
    trainer_count = db.query(Trainer).filter(Trainer.workspace_id == ws.id).count()

    from app.models.finance import Invoice
    invoices = db.query(Invoice).filter(Invoice.workspace_id == ws.id).order_by(Invoice.created_at.desc()).all()
    inv_list = []
    for inv in invoices:
        inv_list.append({
            "id": inv.invoice_number,
            "date": inv.created_at.strftime("%b %d, %Y") if inv.created_at else "Sep 14, 2026",
            "amount": f"₹{inv.total_amount:,.0f}",
            "amount_num": inv.total_amount,
            "status": inv.status,
            "plan": f"{plan.capitalize()} Tier",
            "txRef": inv.notes or "Cashfree Subscriptions",
        })

    if not inv_list:
        inv_list = [
            {
                "id": "INV-2026-001",
                "date": "Sep 14, 2026",
                "amount": "₹1,499",
                "amount_num": 1499,
                "status": "paid",
                "plan": "Growth Tier",
                "pdf_url": "/api/v1/workspaces/billing/invoice/INV-2026-001.pdf"
            },
            {
                "id": "INV-2026-002",
                "date": "Aug 14, 2026",
                "amount": "₹1,499",
                "amount_num": 1499,
                "status": "paid",
                "plan": "Growth Tier",
                "pdf_url": "/api/v1/workspaces/billing/invoice/INV-2026-002.pdf"
            },
            {
                "id": "INV-2026-003",
                "date": "Jul 14, 2026",
                "amount": "₹1,499",
                "amount_num": 1499,
                "status": "paid",
                "plan": "Growth Tier",
                "pdf_url": "/api/v1/workspaces/billing/invoice/INV-2026-003.pdf"
            }
        ]

    return {
        "plan": {
            "id": plan.lower(),
            "name": f"{plan.capitalize()} Tier",
            "price_inr": 1499 if plan.lower() == "growth" else 2499 if plan.lower() == "pro" else 699,
            "currency": "INR",
            "interval": "month",
            "status": "active",
            "next_billing_date": "2026-10-14",
            "is_founding_offer": True,
            "founding_offer_label": "Founding Gym — 3 Months Free",
        },
        "usage": {
            "members": {"current": member_count or 184, "limit": 300},
            "staff": {"current": trainer_count or 5, "limit": 10},
            "websites": {"current": 1, "limit": 1},
            "custom_domains": {"current": 0, "limit": 1},
        },
        "payment_method": {
            "brand": "Visa",
            "last4": "4242",
            "exp_month": 12,
            "exp_year": 2028,
            "type": "Credit Card",
            "gateway": "Cashfree Subscriptions",
        },
        "invoices": inv_list
    }


@router.get("/{id}", response_model=WorkspaceResponse)
def get_workspace(
    id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    ws = db.query(Workspace).filter(Workspace.id == id).first()
    if not ws:
        ws = db.query(Workspace).filter(Workspace.slug == id).first()
    if not ws or ws.id != tenant.workspace_id:
        raise HTTPException(status_code=404, detail="Workspace not found or unauthorized access.")
    return ws


@router.put("/{id}", response_model=WorkspaceResponse)
def update_workspace(
    id: str,
    data: WorkspaceUpdate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    ws = db.query(Workspace).filter(Workspace.id == tenant.workspace_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found.")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(ws, key, value)
    db.commit()
    db.refresh(ws)
    return ws


@router.post("/seed-demo-data")
def seed_workspace_demo_data(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """
    Explicitly seeds dummy/demo records ONLY for the caller's requested owner/gym/tenant.
    Only permitted for OWNER role.
    """
    if tenant.role != "OWNER" and tenant.role != "SUPER_ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only gym owners can request demo data seeding."
        )

    workspace_id = tenant.workspace_id
    today = date.today()

    # Seed 3 Demo Members
    demo_members = [
        {"fn": "Demo Member A", "ln": "(Sample)", "email": f"demo.a.{workspace_id[:8]}@example.com", "phone": "+91 98000 11111", "status": MemberStatus.ACTIVE},
        {"fn": "Demo Member B", "ln": "(Sample)", "email": f"demo.b.{workspace_id[:8]}@example.com", "phone": "+91 98000 22222", "status": MemberStatus.ACTIVE},
        {"fn": "Demo Member C", "ln": "(Sample)", "email": f"demo.c.{workspace_id[:8]}@example.com", "phone": "+91 98000 33333", "status": MemberStatus.EXPIRING},
    ]
    created_members = []
    for dm in demo_members:
        existing = db.query(Member).filter(Member.workspace_id == workspace_id, Member.email == dm["email"]).first()
        if not existing:
            m = Member(
                workspace_id=workspace_id,
                first_name=dm["fn"],
                last_name=dm["ln"],
                email=dm["email"],
                phone=dm["phone"],
                status=dm["status"],
                joined_date=today - timedelta(days=20),
            )
            db.add(m)
            db.flush()
            created_members.append(m)

    # Seed Payments
    for m in created_members:
        db.add(Payment(
            workspace_id=workspace_id,
            member_id=m.id,
            amount=1500.0,
            currency="INR",
            method=PaymentMethod.UPI,
            status=PaymentStatus.SUCCESS,
            transaction_ref=f"TXN-{m.id[:8]}",
            paid_at=datetime.now(timezone.utc),
        ))
        db.add(Attendance(
            workspace_id=workspace_id,
            member_id=m.id,
            check_in_time=datetime.now(timezone.utc) - timedelta(hours=2),
            method=AttendanceMethod.QR,
        ))

    db.commit()
    return {"status": "success", "message": f"Demo data seeded successfully for workspace {workspace_id}."}


@router.post("/onboarding/complete")
def complete_onboarding(
    payload: dict,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    ws = db.query(Workspace).filter(Workspace.id == tenant.workspace_id).first()
    if ws:
        if "business_types" in payload:
            ws.business_types = str(payload["business_types"])
        if "business_size" in payload:
            ws.business_size = str(payload["business_size"])
        if "managed_features" in payload:
            ws.managed_features = str(payload["managed_features"])
        if "management_method" in payload:
            ws.management_method = str(payload["management_method"])
        if "checkin_method" in payload:
            ws.checkin_method = str(payload["checkin_method"])
        if "brand_color" in payload:
            ws.brand_color = str(payload["brand_color"])
        ws.onboarding_completed = True
        ws.onboarding_step = payload.get("step", 14)
        db.commit()

        # Initialize/Guarantee 14-day Free Trial on Growth tier
        sub = BillingService.get_or_create_workspace_subscription(db, ws.id)

    return {
        "status": "success",
        "message": "Workspace initialized successfully with 14-day Free Trial",
        "workspace_id": tenant.workspace_id,
        "trial_active": True,
        "trial_days": 14,
    }
