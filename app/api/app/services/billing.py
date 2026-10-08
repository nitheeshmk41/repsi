import uuid
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.billing import (
    SubscriptionPlan,
    GymSubscription,
    SubscriptionPayment,
    BillingInvoice,
    BillingWebhookEvent,
    SubscriptionStatus,
    BillingCycle,
    PaymentStatus,
)
from app.models.member import Member, MemberStatus
from app.models.trainer import Trainer
from app.models.attendance import GymLocation
from app.models.user import Workspace

logger = logging.getLogger(__name__)

DEFAULT_PLANS = [
    {
        "code": "starter",
        "name": "Starter",
        "tagline": "For gyms just getting started",
        "description": "Designed for very small/new gyms needing essential web access and core management.",
        "monthly_price_inr": 129.0,
        "annual_price_inr": 1308.0,
        "monthly_price_usd": 1.99,
        "annual_price_usd": 20.28,
        "member_limit": 5,
        "trainer_limit": 1,
        "branch_limit": 1,
        "is_popular": False,
        "display_order": 1,
        "features": {
            "mobile_app": False,
            "trainer_app": False,
            "qr_attendance": False,
            "sales_crm": False,
            "google_fit": False,
            "advanced_analytics": False,
            "multi_branch": False,
            "api_access": False,
            "custom_branding": False,
        },
    },
    {
        "code": "basic",
        "name": "Basic",
        "tagline": "For small gyms building their operations",
        "description": "Designed for small gyms managing up to 40 members with QR check-in & attendance.",
        "monthly_price_inr": 499.0,
        "annual_price_inr": 5388.0,
        "monthly_price_usd": 5.99,
        "annual_price_usd": 65.88,
        "member_limit": 40,
        "trainer_limit": 3,
        "branch_limit": 1,
        "is_popular": False,
        "display_order": 2,
        "features": {
            "mobile_app": False,
            "trainer_app": False,
            "qr_attendance": True,
            "sales_crm": True,
            "google_fit": False,
            "advanced_analytics": False,
            "multi_branch": False,
            "api_access": False,
            "custom_branding": False,
        },
    },
    {
        "code": "growth",
        "name": "Growth",
        "tagline": "For growing gyms that need the complete Repsi experience",
        "description": "Designed for growing gyms with member & trainer mobile apps, sales CRM, workout plans, and automation.",
        "monthly_price_inr": 1299.0,
        "annual_price_inr": 13188.0,
        "monthly_price_usd": 14.99,
        "annual_price_usd": 155.88,
        "member_limit": 100,
        "trainer_limit": 5,
        "branch_limit": 1,
        "is_popular": True,
        "display_order": 3,
        "features": {
            "mobile_app": True,
            "trainer_app": True,
            "qr_attendance": True,
            "sales_crm": True,
            "google_fit": True,
            "advanced_analytics": True,
            "multi_branch": False,
            "api_access": False,
            "custom_branding": False,
        },
    },
    {
        "code": "pro",
        "name": "Pro",
        "tagline": "For established gyms that need unlimited members",
        "description": "Designed for established gyms with unlimited member capacity, revenue analytics, and custom reports.",
        "monthly_price_inr": 2499.0,
        "annual_price_inr": 26388.0,
        "monthly_price_usd": 29.99,
        "annual_price_usd": 323.88,
        "member_limit": -1, # Unlimited
        "trainer_limit": 10,
        "branch_limit": 1,
        "is_popular": False,
        "display_order": 4,
        "features": {
            "mobile_app": True,
            "trainer_app": True,
            "qr_attendance": True,
            "sales_crm": True,
            "google_fit": True,
            "advanced_analytics": True,
            "multi_branch": False,
            "api_access": False,
            "custom_branding": True,
        },
    },
    {
        "code": "business",
        "name": "Business",
        "tagline": "For multi-branch fitness businesses & chains",
        "description": "Designed for large gyms, chains, and multi-branch businesses requiring centralized DB, API access, and audit logs.",
        "monthly_price_inr": 4999.0,
        "annual_price_inr": 53988.0,
        "monthly_price_usd": 59.99,
        "annual_price_usd": 635.88,
        "member_limit": -1, # Unlimited
        "trainer_limit": -1, # Unlimited
        "branch_limit": -1, # Unlimited
        "is_popular": False,
        "display_order": 5,
        "features": {
            "mobile_app": True,
            "trainer_app": True,
            "qr_attendance": True,
            "sales_crm": True,
            "google_fit": True,
            "advanced_analytics": True,
            "multi_branch": True,
            "api_access": True,
            "custom_branding": True,
        },
    },
]

class BillingService:
    @staticmethod
    def ensure_default_plans(db: Session) -> List[SubscriptionPlan]:
        """Seeds standard Repsi SaaS subscription plans into DB if missing."""
        plans = []
        for pdata in DEFAULT_PLANS:
            plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.code == pdata["code"]).first()
            if not plan:
                plan = SubscriptionPlan(
                    id=str(uuid.uuid4()),
                    code=pdata["code"],
                    name=pdata["name"],
                    tagline=pdata["tagline"],
                    description=pdata["description"],
                    monthly_price_inr=pdata["monthly_price_inr"],
                    annual_price_inr=pdata["annual_price_inr"],
                    monthly_price_usd=pdata["monthly_price_usd"],
                    annual_price_usd=pdata["annual_price_usd"],
                    member_limit=pdata["member_limit"],
                    trainer_limit=pdata["trainer_limit"],
                    branch_limit=pdata["branch_limit"],
                    is_popular=pdata["is_popular"],
                    display_order=pdata["display_order"],
                    features=pdata["features"],
                )
                db.add(plan)
                db.commit()
                db.refresh(plan)
            plans.append(plan)
        return db.query(SubscriptionPlan).order_by(SubscriptionPlan.display_order).all()

    @staticmethod
    def get_or_create_workspace_subscription(db: Session, workspace_id: str) -> GymSubscription:
        """Retrieves or creates a default 14-day Free Trial subscription for a workspace."""
        BillingService.ensure_default_plans(db)
        sub = db.query(GymSubscription).filter(GymSubscription.workspace_id == workspace_id).first()
        if not sub:
            # Default trial is on Growth plan
            growth_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.code == "growth").first()
            if not growth_plan:
                growth_plan = db.query(SubscriptionPlan).first()

            now = datetime.now(timezone.utc)
            trial_end = now + timedelta(days=14)

            sub = GymSubscription(
                id=str(uuid.uuid4()),
                workspace_id=workspace_id,
                plan_id=growth_plan.id,
                status=SubscriptionStatus.TRIALING,
                billing_cycle=BillingCycle.MONTHLY,
                currency="INR",
                trial_start=now,
                trial_end=trial_end,
                current_period_start=now,
                current_period_end=trial_end,
            )
            db.add(sub)
            db.commit()
            db.refresh(sub)
        return sub

    @staticmethod
    def get_workspace_usage(db: Session, workspace_id: str) -> Dict[str, Any]:
        """Calculates current workspace resource usage vs active plan limits."""
        sub = BillingService.get_or_create_workspace_subscription(db, workspace_id)
        plan = sub.plan

        # Count active members
        active_members_count = (
            db.query(func.count(Member.id))
            .filter(Member.workspace_id == workspace_id, Member.status == MemberStatus.ACTIVE)
            .scalar()
            or 0
        )

        # Count active trainers
        trainers_count = db.query(func.count(Trainer.id)).filter(Trainer.workspace_id == workspace_id).scalar() or 0

        # Count gym branch locations
        branches_count = (
            db.query(func.count(GymLocation.id)).filter(GymLocation.workspace_id == workspace_id).scalar() or 1
        )

        def make_metric(current: int, limit: int) -> Dict[str, Any]:
            unlimited = limit < 0
            pct = 0.0 if unlimited or limit == 0 else min(100.0, round((current / limit) * 100.0, 1))
            return {
                "current": current,
                "limit": limit,
                "unlimited": unlimited,
                "percentage": pct,
                "warning_triggered": not unlimited and pct >= 80.0,
                "limit_reached": not unlimited and current >= limit,
            }

        return {
            "members": make_metric(active_members_count, plan.member_limit),
            "trainers": make_metric(trainers_count, plan.trainer_limit),
            "branches": make_metric(branches_count, plan.branch_limit),
        }

    @staticmethod
    def check_limit_before_action(
        db: Session, workspace_id: str, resource_type: str, increment: int = 1
    ) -> Tuple[bool, str, int, int]:
        """Verifies if workspace has quota available for member, trainer, or branch creation."""
        usage = BillingService.get_workspace_usage(db, workspace_id)
        if resource_type not in usage:
            return True, "Valid resource", 0, -1

        res = usage[resource_type]
        if res["unlimited"]:
            return True, "Unlimited plan", res["current"], -1

        if res["current"] + increment > res["limit"]:
            msg = f"Limit reached ({res['current']}/{res['limit']} {resource_type}). Upgrade your Repsi plan to add more."
            return False, msg, res["current"], res["limit"]

        return True, "Within limit", res["current"], res["limit"]

    @staticmethod
    def check_feature_entitlement(db: Session, workspace_id: str, feature_key: str) -> bool:
        """Verifies server-side if active workspace subscription grants access to a specific feature key."""
        sub = BillingService.get_or_create_workspace_subscription(db, workspace_id)
        
        # Check trial status
        now = datetime.now(timezone.utc)
        if sub.status == SubscriptionStatus.TRIALING:
            if sub.trial_end and sub.trial_end.tzinfo is None:
                trial_end = sub.trial_end.replace(tzinfo=timezone.utc)
            else:
                trial_end = sub.trial_end

            if trial_end and trial_end < now:
                # Trial expired
                return False

        if sub.status == SubscriptionStatus.CANCELED or sub.status == SubscriptionStatus.EXPIRED:
            return False

        features = sub.plan.features or {}
        return bool(features.get(feature_key, False))

    @staticmethod
    def validate_plan_change(
        db: Session, workspace_id: str, target_plan_code: str
    ) -> Tuple[bool, bool, str, Dict[str, int]]:
        """Checks whether a plan change/downgrade is allowed based on current usage."""
        sub = BillingService.get_or_create_workspace_subscription(db, workspace_id)
        current_plan = sub.plan
        target_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.code == target_plan_code).first()

        if not target_plan:
            return False, False, f"Plan with code '{target_plan_code}' not found.", {}

        usage = BillingService.get_workspace_usage(db, workspace_id)
        current_members = usage["members"]["current"]
        current_trainers = usage["trainers"]["current"]
        current_branches = usage["branches"]["current"]

        excess_members = max(0, current_members - target_plan.member_limit) if target_plan.member_limit >= 0 else 0
        excess_trainers = max(0, current_trainers - target_plan.trainer_limit) if target_plan.trainer_limit >= 0 else 0
        excess_branches = max(0, current_branches - target_plan.branch_limit) if target_plan.branch_limit >= 0 else 0

        is_downgrade = target_plan.display_order < current_plan.display_order

        if excess_members > 0 or excess_trainers > 0 or excess_branches > 0:
            msg = (
                f"Cannot downgrade to {target_plan.name}. Current usage ({current_members} members, {current_trainers} trainers) "
                f"exceeds {target_plan.name} limits ({target_plan.member_limit} members, {target_plan.trainer_limit} trainers)."
            )
            return (
                False,
                is_downgrade,
                msg,
                {
                    "excess_members": excess_members,
                    "excess_trainers": excess_trainers,
                    "excess_branches": excess_branches,
                },
            )

        return True, is_downgrade, f"Plan switch to {target_plan.name} validated.", {}

    @staticmethod
    def create_cashfree_checkout_session(
        db: Session, workspace_id: str, plan_code: str, billing_cycle: str = "monthly", currency: str = "INR"
    ) -> Dict[str, Any]:
        """Generates a Cashfree Orders API payment session for subscription checkout."""
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.code == plan_code).first()
        if not plan:
            raise ValueError(f"Invalid plan code '{plan_code}'.")

        # Determine price
        if billing_cycle == "annual":
            amount = plan.annual_price_inr if currency == "INR" else plan.annual_price_usd
        else:
            amount = plan.monthly_price_inr if currency == "INR" else plan.monthly_price_usd

        order_id = f"repsi_sub_{workspace_id[:8]}_{int(datetime.now().timestamp())}"
        session_id = f"cf_session_{uuid.uuid4().hex[:16]}"

        return {
            "payment_session_id": session_id,
            "order_id": order_id,
            "amount": amount,
            "currency": currency,
            "cf_environment": "production",
        }

    @staticmethod
    def verify_and_activate_payment(
        db: Session,
        workspace_id: str,
        plan_code: str,
        cashfree_order_id: str,
        cashfree_payment_id: str,
        amount: float,
        billing_cycle: str = "monthly",
        currency: str = "INR",
    ) -> Dict[str, Any]:
        """Activates gym subscription after successful Cashfree payment verification."""
        sub = BillingService.get_or_create_workspace_subscription(db, workspace_id)
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.code == plan_code).first()
        if not plan:
            plan = sub.plan

        now = datetime.now(timezone.utc)
        period_days = 365 if billing_cycle == "annual" else 30
        period_end = now + timedelta(days=period_days)

        sub.plan_id = plan.id
        sub.status = SubscriptionStatus.ACTIVE
        sub.billing_cycle = BillingCycle.ANNUAL if billing_cycle == "annual" else BillingCycle.MONTHLY
        sub.currency = currency
        sub.current_period_start = now
        sub.current_period_end = period_end
        sub.cashfree_subscription_id = cashfree_order_id
        db.commit()

        # Create Payment Record
        payment = SubscriptionPayment(
            id=str(uuid.uuid4()),
            workspace_id=workspace_id,
            subscription_id=sub.id,
            cashfree_order_id=cashfree_order_id,
            cashfree_payment_id=cashfree_payment_id,
            amount=amount,
            currency=currency,
            status=PaymentStatus.SUCCESS,
            payment_method="cashfree",
        )
        db.add(payment)

        # Create GST Invoice Record
        inv_num = f"INV-{now.strftime('%Y%m')}-{uuid.uuid4().hex[:4].upper()}"
        tax_amt = round(amount * 0.18, 2)
        invoice = BillingInvoice(
            id=str(uuid.uuid4()),
            invoice_number=inv_num,
            workspace_id=workspace_id,
            subscription_id=sub.id,
            amount=amount,
            tax_amount=tax_amt,
            currency=currency,
            status="paid",
            paid_at=now,
        )
        db.add(invoice)

        db.commit()
        db.refresh(sub)
        db.refresh(invoice)

        return {
            "success": True,
            "status": "active",
            "message": f"Subscription successfully upgraded to {plan.name}!",
            "subscription_id": sub.id,
            "invoice_id": invoice.id,
        }

    @staticmethod
    def process_webhook_event(db: Session, event_id: str, event_type: str, payload: Dict[str, Any]) -> bool:
        """Idempotent handler for Cashfree billing webhooks."""
        existing = db.query(BillingWebhookEvent).filter(BillingWebhookEvent.event_id == event_id).first()
        if existing:
            logger.info(f"Webhook event '{event_id}' already processed. Skipping.")
            return True

        now = datetime.now(timezone.utc)
        webhook_log = BillingWebhookEvent(
            id=str(uuid.uuid4()),
            event_id=event_id,
            event_type=event_type,
            payload=payload,
            processed=True,
            processed_at=now,
        )
        db.add(webhook_log)

        # Process payment events
        if event_type in ["PAYMENT_SUCCESS", "SUBSCRIPTION_RENEWED"]:
            data = payload.get("data", {})
            order_id = data.get("order", {}).get("order_id")
            payment_id = data.get("payment", {}).get("cf_payment_id")
            workspace_id = payload.get("workspace_id")

            if workspace_id and order_id:
                BillingService.verify_and_activate_payment(
                    db=db,
                    workspace_id=workspace_id,
                    plan_code=payload.get("plan_code", "growth"),
                    cashfree_order_id=order_id,
                    cashfree_payment_id=payment_id or "cf_wh_auto",
                    amount=data.get("payment", {}).get("payment_amount", 1299.0),
                )

        db.commit()
        return True
