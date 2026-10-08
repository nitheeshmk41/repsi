import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

from app.core.database import Base, get_db
from app.main import app
from app.services.billing import BillingService
from app.models.billing import SubscriptionPlan, GymSubscription, SubscriptionStatus

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    BillingService.ensure_default_plans(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

def test_get_subscription_plans():
    response = client.get("/api/v1/billing/plans")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
    codes = [p["code"] for p in data]
    assert "starter" in codes
    assert "basic" in codes
    assert "growth" in codes
    assert "pro" in codes
    assert "business" in codes

def test_get_workspace_subscription_default_trial():
    response = client.get("/api/v1/billing/subscription", headers={"X-Workspace-Id": "test-gym"})
    assert response.status_code == 200
    data = response.json()
    assert "subscription" in data
    assert "usage" in data
    assert data["subscription"]["plan"]["code"] == "growth"
    assert data["subscription"]["status"] == "trialing"
    assert data["subscription"]["trial_days_left"] in (13, 14)

def test_create_checkout_session():
    payload = {"plan_code": "growth", "billing_cycle": "annual", "currency": "INR"}
    response = client.post("/api/v1/billing/create-checkout-session", json=payload, headers={"X-Workspace-Id": "test-gym"})
    assert response.status_code == 200
    data = response.json()
    assert "payment_session_id" in data
    assert "order_id" in data
    assert data["amount"] == 13188.0
    assert data["currency"] == "INR"

def test_verify_and_activate_payment():
    payload = {
        "cashfree_order_id": "cf_ord_98124",
        "cashfree_payment_id": "cf_pay_12345",
        "amount": 1299.0
    }
    response = client.post("/api/v1/billing/verify-payment", json=payload, headers={"X-Workspace-Id": "test-gym"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["status"] == "active"

def test_check_feature_entitlement():
    # Growth plan has mobile_app = True
    response = client.get("/api/v1/billing/entitlements/mobile_app", headers={"X-Workspace-Id": "test-gym"})
    assert response.status_code == 200
    assert response.json()["has_access"] is True

    # Growth plan has multi_branch = False
    response = client.get("/api/v1/billing/entitlements/multi_branch", headers={"X-Workspace-Id": "test-gym"})
    assert response.status_code == 200
    assert response.json()["has_access"] is False

def test_change_plan_validation():
    # Downgrade attempt to Starter (limit 5 members)
    payload = {"target_plan_code": "starter", "billing_cycle": "monthly"}
    response = client.post("/api/v1/billing/change-plan", json=payload, headers={"X-Workspace-Id": "test-gym"})
    assert response.status_code == 200
    assert response.json()["success"] is True
