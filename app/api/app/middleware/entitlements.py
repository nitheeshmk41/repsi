from typing import Optional, Callable
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.middleware.tenant import get_current_tenant, TenantContext
from app.services.billing import BillingService
from app.models.billing import SubscriptionStatus

def require_feature(feature_key: str):
    """
    Reusable FastAPI route dependency.
    Validates that the authenticated workspace has the required feature entitlement.
    Enforces deterministic precedence:
    1. Super Admin bypass (Super Admins can test/inspect all features).
    2. Subscription suspension check -> 403 SUBSCRIPTION_SUSPENDED
    3. Subscription expiration check -> 403 SUBSCRIPTION_EXPIRED
    4. Plan & custom feature entitlement check -> 403 FEATURE_NOT_IN_PLAN
    """
    def dependency(
        tenant: TenantContext = Depends(get_current_tenant),
        db: Session = Depends(get_db)
    ):
        if tenant.role == "SUPER_ADMIN":
            return True

        if not tenant.workspace_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Workspace context required for entitlement verification."
            )

        sub = BillingService.get_or_create_workspace_subscription(db, tenant.workspace_id)

        # 1. Check suspension
        if sub.status == SubscriptionStatus.SUSPENDED:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error_code": "SUBSCRIPTION_SUSPENDED",
                    "workspace_id": tenant.workspace_id,
                    "reason": sub.suspension_reason or "Account suspended by Super Admin.",
                    "message": "Your gym workspace subscription is suspended. Please contact Repsi support."
                }
            )

        # 2. Check expiration (if not complimentary)
        if sub.status in [SubscriptionStatus.EXPIRED, SubscriptionStatus.CANCELLED, SubscriptionStatus.CANCELED] and not sub.is_complimentary:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error_code": "SUBSCRIPTION_EXPIRED",
                    "workspace_id": tenant.workspace_id,
                    "status": sub.status.value if hasattr(sub.status, "value") else str(sub.status),
                    "current_plan": sub.plan.code,
                    "message": "Your Repsi subscription or 14-day free trial has expired. Please renew or upgrade to continue."
                }
            )

        # 3. Check specific feature
        has_access = BillingService.check_feature_entitlement(db, tenant.workspace_id, feature_key)
        if not has_access:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error_code": "FEATURE_NOT_IN_PLAN",
                    "required_feature": feature_key,
                    "current_plan": sub.plan.code,
                    "plan_name": sub.plan.name,
                    "message": f"Feature '{feature_key}' is not included in your {sub.plan.name} plan. Upgrade to access."
                }
            )

        return True

    return dependency


def check_member_capacity(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """
    Enforces member capacity limit prior to creating or activating a gym member.
    """
    if tenant.role == "SUPER_ADMIN":
        return True

    sub = BillingService.get_or_create_workspace_subscription(db, tenant.workspace_id)
    if sub.status == SubscriptionStatus.SUSPENDED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error_code": "SUBSCRIPTION_SUSPENDED",
                "workspace_id": tenant.workspace_id,
                "reason": sub.suspension_reason or "Account suspended by Super Admin.",
                "message": "Your gym workspace subscription is suspended. Please contact Repsi support."
            }
        )

    if sub.status in [SubscriptionStatus.EXPIRED, SubscriptionStatus.CANCELLED, SubscriptionStatus.CANCELED] and not sub.is_complimentary:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error_code": "SUBSCRIPTION_EXPIRED",
                "workspace_id": tenant.workspace_id,
                "status": sub.status.value if hasattr(sub.status, "value") else str(sub.status),
                "current_plan": sub.plan.code,
                "message": "Your Repsi subscription or 14-day free trial has expired. Please renew or upgrade to continue."
            }
        )

    allowed, message, current, limit = BillingService.check_limit_before_action(
        db, tenant.workspace_id, "members", increment=1
    )
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "error_code": "PLAN_LIMIT_REACHED",
                "resource": "members",
                "current": current,
                "limit": limit,
                "current_plan": sub.plan.code,
                "plan_name": sub.plan.name,
                "message": message,
            }
        )
    return True


def check_trainer_capacity(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """
    Enforces trainer capacity limit prior to adding a trainer account.
    """
    if tenant.role == "SUPER_ADMIN":
        return True

    allowed, message, current, limit = BillingService.check_limit_before_action(
        db, tenant.workspace_id, "trainers", increment=1
    )
    if not allowed:
        sub = BillingService.get_or_create_workspace_subscription(db, tenant.workspace_id)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "error_code": "PLAN_LIMIT_REACHED",
                "resource": "trainers",
                "current": current,
                "limit": limit,
                "current_plan": sub.plan.code,
                "plan_name": sub.plan.name,
                "message": message,
            }
        )
    return True
