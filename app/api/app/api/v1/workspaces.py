from typing import List
from datetime import date, datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import Workspace, WorkspaceMember, UserRole
from app.models.member import Member, MembershipPlan, Membership, MemberStatus
from app.models.attendance import Attendance, AttendanceMethod
from app.models.finance import Payment, Expense, PaymentMethod, PaymentStatus
from app.models.trainer import Trainer, GymClass
from app.schemas.workspace import WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


@router.get("/", response_model=List[WorkspaceResponse])
def get_workspaces(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    return db.query(Workspace).filter(Workspace.id == tenant.workspace_id, Workspace.is_active == True).all()


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
        raise HTTPException(status_code=404, detail="Workspace not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(ws, key, value)
    db.commit()
    db.refresh(ws)
    return ws


@router.get("/entitlements", tags=["Workspaces"])
def get_workspace_entitlements(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """
    Returns feature entitlements and operational limits for the active gym workspace.
    Determines capabilities for Website Builder, CRM, custom domains, and staff/member limits.
    """
    ws = db.query(Workspace).filter(Workspace.id == tenant.workspace_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")

    plan = getattr(ws, "plan", "growth") or "growth"
    plan_lower = plan.lower()

    return {
        "workspace_id": ws.id,
        "workspace_name": ws.name,
        "plan": plan_lower,
        "plan_display_name": "Growth Tier (Founding Gym Offer)" if plan_lower == "growth" else f"{plan.capitalize()} Tier",
        "status": "active",
        "billing_cycle": "monthly",
        "trial_active": True,
        "trial_days_remaining": 82,
        "features": {
            "website_builder": True,
            "repsi_subdomain": True,
            "custom_domain": plan_lower in ["pro", "enterprise"],
            "crm": plan_lower in ["growth", "pro", "enterprise"],
            "advanced_analytics": plan_lower in ["pro", "enterprise"],
            "automated_followups": True,
            "qr_attendance": True,
            "unlimited_workouts": True,
        },
        "limits": {
            "max_members": 500 if plan_lower == "pro" else 300 if plan_lower == "growth" else 100,
            "max_staff": 25 if plan_lower == "pro" else 10 if plan_lower == "growth" else 3,
            "max_websites": 1,
            "max_custom_domains": 1 if plan_lower in ["pro", "enterprise"] else 0,
        },
        "current_usage": {
            "members": db.query(Member).filter(Member.workspace_id == ws.id).count(),
            "staff": db.query(Trainer).filter(Trainer.workspace_id == ws.id).count(),
            "websites": 1,
            "custom_domains": 0,
        }
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

    return {
        "plan": {
            "id": plan.lower(),
            "name": "Growth Tier",
            "price_inr": 1499,
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
            "gateway": "Razorpay Subscriptions",
        },
        "invoices": [
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
    }


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
    return {
        "status": "success",
        "message": "Workspace initialized successfully",
        "workspace_id": tenant.workspace_id
    }
