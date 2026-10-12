import uuid
import pytest
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.billing import (
    SubscriptionPlan,
    GymSubscription,
    SubscriptionStatus,
    SubscriptionAuditLog,
)
from app.models.user import Workspace, WorkspaceMember, User, UserRole
from app.models.member import Member, MemberStatus
from app.models.system import Notification
from app.services.billing import BillingService
from app.services.trial_lifecycle import TrialLifecycleService
from app.middleware.entitlements import check_member_capacity, require_feature
from app.middleware.tenant import TenantContext


@pytest.fixture
def db_session():
    from tests.conftest import TestingSessionLocal
    db = TestingSessionLocal()
    try:
        BillingService.ensure_default_plans(db)
        yield db
    finally:
        db.close()


def create_test_workspace(db: Session, slug: str, name: str = "Trial Gym", phone: str = "9876543210") -> Workspace:
    ws = Workspace(
        id=f"ws_{slug}_{uuid.uuid4().hex[:6]}",
        name=name,
        slug=slug,
        phone=phone,
        is_active=True,
    )
    db.add(ws)

    # Owner user
    owner = User(
        id=f"user_{slug}_{uuid.uuid4().hex[:6]}",
        email=f"owner_{slug}@repsi.test",
        full_name="Gym Owner",
        hashed_password="hashed_pass",
        is_active=True,
    )
    db.add(owner)
    db.flush()

    member_role = WorkspaceMember(
        id=f"wm_{slug}_{uuid.uuid4().hex[:6]}",
        workspace_id=ws.id,
        user_id=owner.id,
        role=UserRole.OWNER,
        is_active=True,
    )
    db.add(member_role)
    db.commit()
    db.refresh(ws)
    return ws


def test_trial_initialization_14_days(db_session: Session):
    ws = create_test_workspace(db_session, "fit-init-test", phone="+919876543211")
    sub = BillingService.get_or_create_workspace_subscription(db_session, ws.id)

    assert sub.status == SubscriptionStatus.TRIALING
    assert sub.plan.code == "growth"
    assert sub.plan.member_limit == 35

    assert sub.trial_start is not None
    assert sub.trial_end is not None

    # Check that duration is exactly 14 days
    t_start = sub.trial_start if sub.trial_start.tzinfo else sub.trial_start.replace(tzinfo=timezone.utc)
    t_end = sub.trial_end if sub.trial_end.tzinfo else sub.trial_end.replace(tzinfo=timezone.utc)
    diff = t_end - t_start
    assert diff.days == 14


def test_trial_countdown_calculation(db_session: Session):
    ws = create_test_workspace(db_session, "fit-countdown-test", phone="+919876543212")
    status = BillingService.get_trial_status(db_session, ws.id)

    assert status["is_trial"] is True
    assert status["is_expired"] is False
    assert status["total_trial_days"] == 14
    assert status["days_remaining"] in [13, 14]
    assert status["plan_code"] == "growth"
    assert status["member_limit"] == 35
    assert status["trial_state"] in ["active", "reminder_7d"]


def test_trial_entitlements_growth_plan(db_session: Session):
    ws = create_test_workspace(db_session, "fit-entitlement-test", phone="+919876543213")
    tenant = TenantContext(workspace_id=ws.id, user_id="user_1", role=UserRole.OWNER)

    # Entitlement to QR attendance (included in Growth)
    has_qr = BillingService.check_feature_entitlement(db_session, ws.id, "qr_attendance")
    assert has_qr is True

    # Entitlement to trainer management (included in Growth)
    has_trainer = BillingService.check_feature_entitlement(db_session, ws.id, "trainer_management")
    assert has_trainer is True

    # Capacity check allows member addition within 35 limit
    can_add = check_member_capacity(tenant=tenant, db=db_session)
    assert can_add is True


def test_trial_automatic_expiration_on_server_utc(db_session: Session):
    ws = create_test_workspace(db_session, "fit-expiry-test", phone="+919876543214")
    sub = BillingService.get_or_create_workspace_subscription(db_session, ws.id)

    # Artificially set trial end date to 2 days in the past
    two_days_ago = datetime.now(timezone.utc) - timedelta(days=2)
    sub.trial_end = two_days_ago
    sub.trial_ends_at = two_days_ago
    db_session.commit()

    # Next evaluation lazily expires the trial
    refreshed_sub = BillingService.get_or_create_workspace_subscription(db_session, ws.id)
    assert refreshed_sub.status == SubscriptionStatus.EXPIRED

    trial_status = BillingService.get_trial_status(db_session, ws.id)
    assert trial_status["is_expired"] is True
    assert trial_status["trial_state"] == "expired"
    assert trial_status["days_remaining"] == 0


def test_trial_expired_restrictions_and_data_preservation(db_session: Session):
    ws = create_test_workspace(db_session, "fit-restrict-test", phone="+919876543215")
    sub = BillingService.get_or_create_workspace_subscription(db_session, ws.id)

    # Expire trial
    sub.status = SubscriptionStatus.EXPIRED
    sub.trial_end = datetime.now(timezone.utc) - timedelta(days=1)
    db_session.commit()

    tenant = TenantContext(workspace_id=ws.id, user_id="user_1", role=UserRole.OWNER)

    # Member creation must be blocked
    with pytest.raises(HTTPException) as exc_info:
        check_member_capacity(tenant=tenant, db=db_session)
    assert exc_info.value.status_code == 403
    assert exc_info.value.detail.get("error_code") == "SUBSCRIPTION_EXPIRED"

    # Paid feature access must be blocked
    with pytest.raises(HTTPException) as exc_info:
        dep = require_feature("trainer_management")
        dep(tenant=tenant, db=db_session)
    assert exc_info.value.status_code == 403
    assert exc_info.value.detail.get("error_code") == "SUBSCRIPTION_EXPIRED"

    # Basic dashboard read mode remains accessible
    features = BillingService.get_effective_features(db_session, ws.id)
    assert features.get("basic_dashboard") is True
    assert features.get("data_export") is True  # Owner can export historical data


def test_repeat_trial_prevention(db_session: Session):
    phone = "+919870001122"
    # Gym 1 registers with this phone number and gets a trial
    ws1 = create_test_workspace(db_session, "gym-original", phone=phone)
    sub1 = BillingService.get_or_create_workspace_subscription(db_session, ws1.id)
    assert sub1.status == SubscriptionStatus.TRIALING

    # Gym 2 attempts signup with the same phone number
    ws2 = create_test_workspace(db_session, "gym-repeat-attempt", phone=phone)
    sub2 = BillingService.get_or_create_workspace_subscription(db_session, ws2.id)

    # Repeat trial is blocked: initialized as expired
    assert sub2.status == SubscriptionStatus.EXPIRED
    assert sub2.is_repeat_trial_blocked is True


def test_trial_to_paid_activation(db_session: Session):
    ws = create_test_workspace(db_session, "fit-payment-test", phone="+919876543216")
    sub = BillingService.get_or_create_workspace_subscription(db_session, ws.id)
    assert sub.status == SubscriptionStatus.TRIALING

    # Verify payment
    res = BillingService.verify_and_activate_payment(
        db=db_session,
        workspace_id=ws.id,
        plan_code="growth",
        cashfree_order_id="cf_ord_12345",
        cashfree_payment_id="cf_pay_67890",
        amount=499.0,
        billing_cycle="monthly",
    )

    assert res["status"] == "active"
    db_session.refresh(sub)
    assert sub.status == SubscriptionStatus.ACTIVE
    assert sub.trial_converted_at is not None

    status_data = BillingService.get_trial_status(db_session, ws.id)
    assert status_data["is_paid"] is True
    assert status_data["trial_state"] == "paid"


def test_trial_lifecycle_reconciliation_and_reminders(db_session: Session):
    ws = create_test_workspace(db_session, "fit-lifecycle-test", phone="+919876543217")
    sub = BillingService.get_or_create_workspace_subscription(db_session, ws.id)

    # Set trial to 2 days remaining
    target_dt = datetime.now(timezone.utc) + timedelta(days=2)
    sub.trial_end = target_dt
    sub.trial_ends_at = target_dt
    db_session.commit()

    # Trigger reminder delivery
    res = TrialLifecycleService.send_trial_reminders(db_session)
    assert res["reminders_sent"] >= 1

    # Verify notification was created
    notif = db_session.query(Notification).filter(Notification.workspace_id == ws.id).first()
    assert notif is not None
    assert "Free Trial" in notif.title

    # Second run must be idempotent (no duplicate notifications)
    res2 = TrialLifecycleService.send_trial_reminders(db_session)
    assert res2["reminders_sent"] == 0


def test_superadmin_trial_analytics(db_session: Session):
    analytics = TrialLifecycleService.get_superadmin_trial_analytics(db_session)
    assert "total_businesses" in analytics
    assert "active_trials" in analytics
    assert "trials_expiring_today" in analytics
    assert "trials_expiring_3_days" in analytics
    assert "trials_expiring_7_days" in analytics
    assert "expired_trials" in analytics
    assert "active_paid" in analytics
    assert "conversion_rate_pct" in analytics
    assert isinstance(analytics["expirations_timeline"], list)
