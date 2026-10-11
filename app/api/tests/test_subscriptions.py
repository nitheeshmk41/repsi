import pytest
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.billing import SubscriptionPlan, GymSubscription, SubscriptionStatus, SubscriptionAuditLog
from app.models.user import Workspace, WorkspaceMember, UserRole
from app.models.member import Member, MemberStatus
from app.models.user import User
from app.services.billing import BillingService
from app.middleware.entitlements import check_member_capacity, require_feature
from app.middleware.tenant import TenantContext


@pytest.fixture
def db_session():
    from tests.conftest import TestingSessionLocal
    db = TestingSessionLocal()
    try:
        # Seed default catalog
        BillingService.ensure_default_plans(db)
        yield db
    finally:
        db.close()


def create_test_workspace(db: Session, slug: str, name: str = "Test Gym") -> Workspace:
    ws = Workspace(
        id=f"ws_{slug}",
        name=name,
        slug=slug,
        is_active=True,
    )
    db.add(ws)
    db.commit()
    db.refresh(ws)
    return ws


def test_catalog_plans_initialization(db_session: Session):
    plans = db_session.query(SubscriptionPlan).all()
    plan_codes = {p.code for p in plans}
    expected_codes = {"basic", "growth", "premium", "pro", "pro_plus", "enterprise"}
    assert expected_codes.issubset(plan_codes), f"Missing catalog plans: {expected_codes - plan_codes}"

    basic_plan = db_session.query(SubscriptionPlan).filter(SubscriptionPlan.code == "basic").first()
    assert basic_plan.member_limit == 10
    assert basic_plan.monthly_price_inr == 149.0
    assert basic_plan.annual_price_inr == 129.0

    growth_plan = db_session.query(SubscriptionPlan).filter(SubscriptionPlan.code == "growth").first()
    assert growth_plan.member_limit == 35
    assert growth_plan.monthly_price_inr == 499.0
    assert growth_plan.annual_price_inr == 469.0

    pro_plus = db_session.query(SubscriptionPlan).filter(SubscriptionPlan.code == "pro_plus").first()
    assert pro_plus.member_limit == -1  # Unlimited


from datetime import date

def test_14_day_free_trial_creation(db_session: Session):
    ws = create_test_workspace(db_session, "trial_gym_1", "Trial Gym 1")
    sub = BillingService.get_or_create_workspace_subscription(db_session, ws.id)

    assert sub.status == SubscriptionStatus.TRIALING
    assert sub.plan.code == "growth"
    assert sub.trial_end is not None
    # Verify trial is approximately 14 days in future
    now = datetime.now(timezone.utc)
    t_end = sub.trial_end if sub.trial_end.tzinfo else sub.trial_end.replace(tzinfo=timezone.utc)
    remaining_days = (t_end - now).days
    assert remaining_days in (13, 14)

    # Verify effective limits on Growth trial
    limits = BillingService.get_effective_limits(db_session, ws.id)
    assert limits["max_members"] == 35
    assert limits["max_trainers"] == 5

    # Verify Growth features are unlocked
    features = BillingService.get_effective_features(db_session, ws.id)
    assert features.get("trainer_management") is True
    assert features.get("attendance_reports") is True
    # Advanced Pro feature is false
    assert features.get("data_export") is False


def test_member_capacity_enforcement(db_session: Session):
    ws = create_test_workspace(db_session, "capacity_gym", "Capacity Gym")
    sub = BillingService.get_or_create_workspace_subscription(db_session, ws.id)
    # Change to basic plan with 10 members limit
    BillingService.change_gym_plan(db_session, ws.id, "basic", "monthly", "test limit")

    today = date.today()
    # Add 10 active members
    for i in range(10):
        m = Member(
            id=f"m_{ws.id}_{i}",
            workspace_id=ws.id,
            first_name="Member",
            last_name=str(i),
            email=f"member_{ws.id}_{i}@test.com",
            phone=f"+91 99000{i:05d}",
            joined_date=today,
            status=MemberStatus.ACTIVE,
        )
        db_session.add(m)
    db_session.commit()

    # Verify usage is 10/10
    usage = BillingService.get_workspace_usage(db_session, ws.id)
    assert usage["members"]["current"] == 10
    assert usage["members"]["limit"] == 10

    # 11th member attempt must be blocked with 409 PLAN_LIMIT_REACHED
    tenant = TenantContext(user_id="user_owner", role="OWNER", workspace_id=ws.id)
    with pytest.raises(HTTPException) as exc_info:
        check_member_capacity(tenant=tenant, db=db_session)
    assert exc_info.value.status_code == 409
    assert exc_info.value.detail.get("error_code") == "PLAN_LIMIT_REACHED"
    assert exc_info.value.detail.get("current") == 10
    assert exc_info.value.detail.get("limit") == 10


def test_super_admin_trial_extension(db_session: Session):
    ws = create_test_workspace(db_session, "extend_gym", "Extend Gym")
    sub = BillingService.get_or_create_workspace_subscription(db_session, ws.id)
    initial_expiry = sub.trial_end

    # Extend trial by 10 days
    updated_sub = BillingService.extend_trial(
        db_session,
        workspace_id=ws.id,
        actor_user_id="admin_123",
        days=10,
        reason="Owner requested onboarding help"
    )

    assert (updated_sub.trial_end - initial_expiry).days == 10
    assert updated_sub.status == SubscriptionStatus.TRIALING

    # Verify audit log was recorded
    audit = db_session.query(SubscriptionAuditLog).filter(
        SubscriptionAuditLog.workspace_id == ws.id,
        SubscriptionAuditLog.action == "trial_extension"
    ).first()
    assert audit is not None
    assert audit.actor_user_id == "admin_123"
    assert audit.reason == "Owner requested onboarding help"
    assert audit.new_value is not None


def test_complimentary_access_grant(db_session: Session):
    ws = create_test_workspace(db_session, "comp_gym", "Comp Gym")
    sub = BillingService.get_or_create_workspace_subscription(db_session, ws.id)

    # Grant 30 days complimentary access
    BillingService.grant_complimentary_access(
        db_session,
        workspace_id=ws.id,
        actor_user_id="admin_123",
        days=30,
        reason="Promotional VIP grant"
    )

    db_session.refresh(sub)
    assert sub.is_complimentary is True
    assert sub.complimentary_until is not None


def test_suspended_subscription_blocks_access(db_session: Session):
    ws = create_test_workspace(db_session, "suspend_gym", "Suspend Gym")
    BillingService.get_or_create_workspace_subscription(db_session, ws.id)

    # Suspend subscription
    BillingService.set_subscription_status(
        db_session,
        workspace_id=ws.id,
        actor_user_id="admin_123",
        new_status="suspended",
        reason="Terms violation audit"
    )

    tenant = TenantContext(user_id="user_owner", role="OWNER", workspace_id=ws.id)

    # Capacity check blocked with 403 SUBSCRIPTION_SUSPENDED
    with pytest.raises(HTTPException) as exc_info:
        check_member_capacity(tenant=tenant, db=db_session)
    assert exc_info.value.status_code == 403
    assert exc_info.value.detail.get("error_code") == "SUBSCRIPTION_SUSPENDED"

    # Feature check blocked with 403 SUBSCRIPTION_SUSPENDED
    feature_checker = require_feature("trainer_management")
    with pytest.raises(HTTPException) as exc_info2:
        feature_checker(tenant=tenant, db=db_session)
    assert exc_info2.value.status_code == 403
    assert exc_info2.value.detail.get("error_code") == "SUBSCRIPTION_SUSPENDED"


def test_per_gym_custom_overrides(db_session: Session):
    ws = create_test_workspace(db_session, "override_gym", "Override Gym")
    BillingService.get_or_create_workspace_subscription(db_session, ws.id)
    # Switch to Basic (normally 10 members)
    BillingService.change_gym_plan(db_session, ws.id, "basic", "monthly", "test")

    # Set custom override to 50 members
    BillingService.set_gym_overrides(
        db_session,
        workspace_id=ws.id,
        actor_user_id="admin_123",
        custom_member_limit=50,
        custom_trainer_limit=10,
        reason="Special contract addendum"
    )

    limits = BillingService.get_effective_limits(db_session, ws.id)
    assert limits["max_members"] == 50
    assert limits["max_trainers"] == 10


def test_expired_subscription_blocks_feature_access(db_session: Session):
    ws = create_test_workspace(db_session, "expired_gym", "Expired Gym")
    sub = BillingService.get_or_create_workspace_subscription(db_session, ws.id)

    # Set expiry to past
    sub.status = SubscriptionStatus.EXPIRED
    sub.current_period_end = datetime.now(timezone.utc) - timedelta(days=5)
    db_session.commit()

    tenant = TenantContext(user_id="user_owner", role="OWNER", workspace_id=ws.id)
    feature_checker = require_feature("trainer_management")
    with pytest.raises(HTTPException) as exc_info:
        feature_checker(tenant=tenant, db=db_session)
    assert exc_info.value.status_code == 403
    assert exc_info.value.detail.get("error_code") == "SUBSCRIPTION_EXPIRED"


def test_downgrade_preserves_records_and_blocks_further_additions(db_session: Session):
    ws = create_test_workspace(db_session, "downgrade_gym", "Downgrade Gym")
    # Start on Growth (35 limit)
    BillingService.get_or_create_workspace_subscription(db_session, ws.id)

    today = date.today()
    # Add 15 members
    for i in range(15):
        m = Member(
            id=f"m_down_{i}",
            workspace_id=ws.id,
            first_name="Member",
            last_name=str(i),
            email=f"member_down_{i}@test.com",
            phone=f"+91 98111{i:05d}",
            joined_date=today,
            status=MemberStatus.ACTIVE,
        )
        db_session.add(m)
    db_session.commit()

    # Downgrade to Basic (10 limit)
    sub = BillingService.change_gym_plan(db_session, ws.id, "basic", "monthly", "Gym downgraded")
    assert sub.plan.code == "basic"

    # All 15 member records MUST remain preserved and intact
    member_count = db_session.query(Member).filter(Member.workspace_id == ws.id).count()
    assert member_count == 15

    # Usage correctly shows over-capacity (15 / 10)
    usage = BillingService.get_workspace_usage(db_session, ws.id)
    assert usage["members"]["current"] == 15
    assert usage["members"]["limit"] == 10
    assert usage["members"]["limit_reached"] is True

    # New member addition blocked with 409 PLAN_LIMIT_REACHED
    tenant = TenantContext(user_id="user_owner", role="OWNER", workspace_id=ws.id)
    with pytest.raises(HTTPException) as exc_info:
        check_member_capacity(tenant=tenant, db=db_session)
    assert exc_info.value.status_code == 409
    assert exc_info.value.detail.get("error_code") == "PLAN_LIMIT_REACHED"


def test_owner_gym_deregistration(db_session: Session):
    from app.api.v1.workspaces import deregister_workspace, DeregisterGymRequest

    ws = create_test_workspace(db_session, "close_gym", "Iron Core Fitness")
    sub = BillingService.get_or_create_workspace_subscription(db_session, ws.id)

    # 1. Non-owner attempt blocked with 403
    trainer_tenant = TenantContext(user_id="user_trainer", role="TRAINER", workspace_id=ws.id)
    with pytest.raises(HTTPException) as exc_info:
        deregister_workspace(
            req=DeregisterGymRequest(gym_name_confirmation="Iron Core Fitness"),
            tenant=trainer_tenant,
            db=db_session
        )
    assert exc_info.value.status_code == 403

    # 2. Owner with mismatched name blocked with 400
    owner_tenant = TenantContext(user_id="user_owner", role="OWNER", workspace_id=ws.id)
    with pytest.raises(HTTPException) as exc_info2:
        deregister_workspace(
            req=DeregisterGymRequest(gym_name_confirmation="Wrong Name"),
            tenant=owner_tenant,
            db=db_session
        )
    assert exc_info2.value.status_code == 400

    # 3. Owner with exact confirmation succeeds
    res = deregister_workspace(
        req=DeregisterGymRequest(gym_name_confirmation="Iron Core Fitness", reason="Closing branch"),
        tenant=owner_tenant,
        db=db_session
    )
    assert res["status"] == "success"

    # Verify workspace is deactivated and subscription is cancelled
    db_session.refresh(ws)
    db_session.refresh(sub)
    assert ws.is_active is False
    assert sub.status == SubscriptionStatus.CANCELLED
    assert "Closing branch" in (sub.notes or "")


