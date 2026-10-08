from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Header, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.billing import SubscriptionPlan
from app.services.billing import BillingService
from app.schemas.billing import (
    SubscriptionPlanSchema,
    SubscriptionBillingOverviewSchema,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    PaymentVerifyRequest,
    PaymentVerifyResponse,
    ChangePlanRequest,
    ChangePlanResponse,
    AdminTrialExtensionRequest,
    AdminManualOverrideRequest,
)

router = APIRouter(prefix="/billing", tags=["Billing & Subscription"])

@router.get("/plans", response_model=List[SubscriptionPlanSchema])
def get_subscription_plans(db: Session = Depends(get_db)):
    """Returns all active Repsi subscription plans (Starter, Basic, Growth, Pro, Business)."""
    plans = BillingService.ensure_default_plans(db)
    return [
        SubscriptionPlanSchema(
            id=p.id,
            code=p.code,
            name=p.name,
            tagline=p.tagline,
            description=p.description,
            monthly_price_inr=p.monthly_price_inr,
            annual_price_inr=p.annual_price_inr,
            monthly_price_usd=p.monthly_price_usd,
            annual_price_usd=p.annual_price_usd,
            member_limit=p.member_limit,
            trainer_limit=p.trainer_limit,
            branch_limit=p.branch_limit,
            is_popular=p.is_popular,
            display_order=p.display_order,
            features=p.features or {},
        )
        for p in plans
    ]

@router.get("/subscription", response_model=SubscriptionBillingOverviewSchema)
def get_current_subscription(
    x_workspace_id: Optional[str] = Header("apex-fitness", alias="X-Workspace-Id"),
    db: Session = Depends(get_db),
):
    """Retrieves current workspace subscription, trial days remaining, usage meters, and feature flags."""
    workspace_id = x_workspace_id or "apex-fitness"
    sub = BillingService.get_or_create_workspace_subscription(db, workspace_id)
    usage = BillingService.get_workspace_usage(db, workspace_id)
    p = sub.plan

    now = datetime.now(timezone.utc)
    trial_days_left = None
    if sub.status == "trialing" and sub.trial_end:
        end_dt = sub.trial_end if sub.trial_end.tzinfo else sub.trial_end.replace(tzinfo=timezone.utc)
        delta = end_dt - now
        trial_days_left = max(0, delta.days)

    sub_schema = {
        "id": sub.id,
        "workspace_id": sub.workspace_id,
        "plan": {
            "id": p.id,
            "code": p.code,
            "name": p.name,
            "tagline": p.tagline,
            "description": p.description,
            "monthly_price_inr": p.monthly_price_inr,
            "annual_price_inr": p.annual_price_inr,
            "monthly_price_usd": p.monthly_price_usd,
            "annual_price_usd": p.annual_price_usd,
            "member_limit": p.member_limit,
            "trainer_limit": p.trainer_limit,
            "branch_limit": p.branch_limit,
            "is_popular": p.is_popular,
            "display_order": p.display_order,
            "features": p.features or {},
        },
        "status": sub.status.value if hasattr(sub.status, "value") else str(sub.status),
        "billing_cycle": sub.billing_cycle.value if hasattr(sub.billing_cycle, "value") else str(sub.billing_cycle),
        "currency": sub.currency,
        "trial_start": sub.trial_start,
        "trial_end": sub.trial_end,
        "trial_days_left": trial_days_left,
        "current_period_start": sub.current_period_start,
        "current_period_end": sub.current_period_end,
        "cancel_at_period_end": sub.cancel_at_period_end,
    }

    return {
        "subscription": sub_schema,
        "usage": usage,
        "features": p.features or {},
    }

@router.post("/create-checkout-session", response_model=CheckoutSessionResponse)
def create_checkout_session(
    payload: CheckoutSessionRequest,
    x_workspace_id: Optional[str] = Header("apex-fitness", alias="X-Workspace-Id"),
    db: Session = Depends(get_db),
):
    """Creates a Cashfree payment session for plan checkout."""
    workspace_id = x_workspace_id or "apex-fitness"
    try:
        data = BillingService.create_cashfree_checkout_session(
            db=db,
            workspace_id=workspace_id,
            plan_code=payload.plan_code,
            billing_cycle=payload.billing_cycle,
            currency=payload.currency,
        )
        return data
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/verify-payment", response_model=PaymentVerifyResponse)
def verify_payment(
    payload: PaymentVerifyRequest,
    x_workspace_id: Optional[str] = Header("apex-fitness", alias="X-Workspace-Id"),
    db: Session = Depends(get_db),
):
    """Verifies Cashfree payment status and updates workspace subscription to Active."""
    workspace_id = x_workspace_id or "apex-fitness"
    res = BillingService.verify_and_activate_payment(
        db=db,
        workspace_id=workspace_id,
        plan_code="growth",
        cashfree_order_id=payload.cashfree_order_id,
        cashfree_payment_id=payload.cashfree_payment_id,
        amount=payload.amount,
    )
    return res

@router.post("/change-plan", response_model=ChangePlanResponse)
def change_plan(
    payload: ChangePlanRequest,
    x_workspace_id: Optional[str] = Header("apex-fitness", alias="X-Workspace-Id"),
    db: Session = Depends(get_db),
):
    """Upgrades or downgrades plan with strict usage verification."""
    workspace_id = x_workspace_id or "apex-fitness"
    valid, is_downgrade, msg, excess = BillingService.validate_plan_change(
        db=db, workspace_id=workspace_id, target_plan_code=payload.target_plan_code
    )

    if not valid:
        return ChangePlanResponse(
            success=False,
            is_downgrade=is_downgrade,
            limit_blocked=True,
            message=msg,
            excess_members=excess.get("excess_members", 0),
            excess_trainers=excess.get("excess_trainers", 0),
            excess_branches=excess.get("excess_branches", 0),
        )

    # Perform plan switch
    sub = BillingService.get_or_create_workspace_subscription(db, workspace_id)
    target_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.code == payload.target_plan_code).first()
    sub.plan_id = target_plan.id
    sub.billing_cycle = payload.billing_cycle
    db.commit()

    return ChangePlanResponse(
        success=True,
        is_downgrade=is_downgrade,
        limit_blocked=False,
        message=f"Plan changed successfully to {target_plan.name}.",
    )

@router.get("/entitlements/{feature_key}")
def check_feature(
    feature_key: str,
    x_workspace_id: Optional[str] = Header("apex-fitness", alias="X-Workspace-Id"),
    db: Session = Depends(get_db),
):
    """Server-side check if feature flag is active for workspace."""
    workspace_id = x_workspace_id or "apex-fitness"
    has_access = BillingService.check_feature_entitlement(db, workspace_id, feature_key)
    return {"workspace_id": workspace_id, "feature_key": feature_key, "has_access": has_access}

@router.post("/webhook")
def cashfree_webhook(
    payload: Dict[str, Any],
    x_webhook_signature: Optional[str] = Header(None, alias="X-Webhook-Signature"),
    db: Session = Depends(get_db),
):
    """Cashfree Webhook Endpoint for payment & renewal events."""
    event_id = payload.get("event_id", f"evt_{datetime.now().timestamp()}")
    event_type = payload.get("type", "PAYMENT_SUCCESS")
    BillingService.process_webhook_event(db=db, event_id=event_id, event_type=event_type, payload=payload)
    return {"status": "received", "event_id": event_id}
