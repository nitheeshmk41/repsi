import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base, get_db
from app.main import app
from app.models.user import User, Workspace, WorkspaceMember, UserRole
from app.models.member import Member, MemberStatus
from app.models.biometric import BiometricDevice, BiometricDeviceStatus
from app.core.security import create_access_token
from app.services.workspace_moderation import WorkspaceModerationService

# Use in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="module")
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session(setup_db):
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    from tests.conftest import override_get_db as conftest_override_get_db
    app.dependency_overrides[get_db] = conftest_override_get_db


@pytest.fixture
def test_workspace_and_owner(db_session):
    user = User(
        id="owner_usr_001",
        email="owner@testgym.com",
        full_name="Gym Owner",
        hashed_password="hashed_test_pass",
        is_active=True,
    )
    db_session.add(user)

    ws = Workspace(
        id="ws_test_001",
        name="Apex Fitness",
        slug="apex-fitness-test",
        is_active=True,
        phone="+91 99999 88888",
        email="contact@apexfit.com",
    )
    db_session.add(ws)

    member_rel = WorkspaceMember(
        id="wm_test_001",
        workspace_id=ws.id,
        user_id=user.id,
        role=UserRole.OWNER,
        is_active=True,
    )
    db_session.add(member_rel)
    db_session.commit()

    token = create_access_token(subject=user.id, workspace_id=ws.id, role="OWNER")
    return {"user": user, "workspace": ws, "token": token}


# ─── 1. MODERATION SERVICE TESTS ─────────────────────────────────────

def test_moderation_name_normalization():
    assert WorkspaceModerationService.normalize_name("   Iron   Forge   Gym   ") == "Iron Forge Gym"
    assert WorkspaceModerationService.normalize_name("\t\nFit  Club\n") == "Fit Club"


def test_moderation_acceptable_names():
    acceptable = [
        "Titan Fitness",
        "Assisi Yoga Center",
        "Scunthorpe Gym",
        "Spitfire Crossfit",
        "Classic Iron Studio",
        "Baseline Athletics",
    ]
    for name in acceptable:
        is_valid, err = WorkspaceModerationService.moderate_name(name)
        assert is_valid is True, f"Expected '{name}' to be permitted, got error: {err}"


def test_moderation_rejects_reserved_and_inappropriate():
    blocked = [
        "Repsi Official",
        "Admin Gym",
        "Repsi Support Club",
        "Superadmin Fitness",
        "Fuck Gym",
        "Bitch Fitness",
    ]
    for name in blocked:
        is_valid, err = WorkspaceModerationService.moderate_name(name)
        assert is_valid is False, f"Expected '{name}' to be rejected"
        assert err == "This business name cannot be used. Please choose another name."


# ─── 2. RENAME & COOLDOWN INTEGRATION TESTS ──────────────────────────

def test_check_name_availability_endpoint(client, test_workspace_and_owner):
    headers = {"Authorization": f"Bearer {test_workspace_and_owner['token']}"}

    # Current name should be available for itself
    res = client.get("/api/v1/workspaces/check-name?name=Apex+Fitness", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["available"] is True
    assert data["is_current"] is True

    # Reserved platform name should be restricted
    res_res = client.get("/api/v1/workspaces/check-name?name=Repsi+Admin", headers=headers)
    assert res_res.status_code == 200
    data_res = res_res.json()
    assert data_res["available"] is False
    assert data_res["status"] == "RESTRICTED"


def test_rename_workspace_with_30_day_cooldown(client, test_workspace_and_owner, db_session):
    headers = {"Authorization": f"Bearer {test_workspace_and_owner['token']}"}
    ws = test_workspace_and_owner["workspace"]

    # 1. First rename after registration: eligible
    res_rename = client.patch(
        "/api/v1/workspaces/rename",
        json={"new_name": "Apex Iron Club"},
        headers=headers,
    )
    assert res_rename.status_code == 200
    data = res_rename.json()
    assert data["status"] == "success"
    assert data["name"] == "Apex Iron Club"

    db_session.refresh(ws)
    assert ws.name == "Apex Iron Club"
    assert ws.last_name_changed_at is not None
    assert ws.name_change_count == 1
    # Workspace slug and ID must remain unchanged
    assert ws.slug == "apex-fitness-test"
    assert ws.id == "ws_test_001"

    # 2. Second rename immediately after: blocked by 30-day cooldown (HTTP 409)
    res_blocked = client.patch(
        "/api/v1/workspaces/rename",
        json={"new_name": "Iron Forge"},
        headers=headers,
    )
    assert res_blocked.status_code == 409
    assert "30 days" in res_blocked.json()["detail"]

    # 3. Simulate passage of 31 days
    ws.last_name_changed_at = datetime.now(timezone.utc) - timedelta(days=31)
    db_session.commit()

    # 4. Now eligible again
    res_allowed = client.patch(
        "/api/v1/workspaces/rename",
        json={"new_name": "Iron Forge"},
        headers=headers,
    )
    assert res_allowed.status_code == 200
    assert res_allowed.json()["name"] == "Iron Forge"


def test_rename_preserves_other_settings(client, test_workspace_and_owner, db_session):
    headers = {"Authorization": f"Bearer {test_workspace_and_owner['token']}"}
    ws = test_workspace_and_owner["workspace"]

    # Set last_name_changed_at to now (in cooldown)
    ws.last_name_changed_at = datetime.now(timezone.utc)
    db_session.commit()

    # Updating phone and email via PUT must succeed even when name is on cooldown
    res_update = client.put(
        f"/api/v1/workspaces/{ws.id}",
        json={"phone": "+91 91234 56789", "city": "Mumbai"},
        headers=headers,
    )
    assert res_update.status_code == 200
    db_session.refresh(ws)
    assert ws.phone == "+91 91234 56789"
    assert ws.city == "Mumbai"


# ─── 3. BIOMETRIC HARDWARE TESTS ─────────────────────────────────────

def test_biometric_device_lifecycle(client, test_workspace_and_owner, db_session):
    headers = {"Authorization": f"Bearer {test_workspace_and_owner['token']}"}
    ws = test_workspace_and_owner["workspace"]

    # 1. Register a biometric terminal
    res_reg = client.post(
        "/api/v1/attendance/biometric/devices",
        json={
            "device_name": "Entrance Turnstile 1",
            "device_model": "ZKTeco K40 Fingerprint Terminal",
            "device_serial": "ZK_TEST_9912",
            "ip_address": "192.168.1.150",
            "port": 4370,
            "location_name": "East Gate",
        },
        headers=headers,
    )
    assert res_reg.status_code == 201
    dev_data = res_reg.json()["device"]
    dev_id = dev_data["id"]
    # Must start as DISCONNECTED (never fake live hardware)
    assert dev_data["status"] == "DISCONNECTED"

    # 2. Test connectivity (reports physical disconnection without hardware)
    res_test = client.post(
        f"/api/v1/attendance/biometric/devices/{dev_id}/test",
        headers=headers,
    )
    assert res_test.status_code == 200
    test_result = res_test.json()
    assert test_result["status"] == "DISCONNECTED"
    assert "not reachable" in test_result["message"] or "gateway" in test_result["message"].lower()

    # 3. Create active test member
    from datetime import date
    member = Member(
        workspace_id=ws.id,
        first_name="Rohan",
        last_name="Sharma",
        email="rohan.test@example.com",
        phone="+91 98111 22334",
        status=MemberStatus.ACTIVE,
        joined_date=date.today(),
    )
    db_session.add(member)
    db_session.commit()

    # 4. Sync a simulated fingerprint event
    res_sync = client.post(
        "/api/v1/attendance/biometric/sync-events",
        json={
            "device_id": dev_id,
            "events": [{"user_id": "+91 98111 22334"}],
        },
        headers=headers,
    )
    assert res_sync.status_code == 200
    assert res_sync.json()["processed_count"] == 1
    assert res_sync.json()["results"][0]["action"] == "CHECK_IN"

    # 5. Export CSV
    res_csv = client.get("/api/v1/attendance/export-csv", headers=headers)
    assert res_csv.status_code == 200
    assert "text/csv" in res_csv.headers["content-type"]
    assert "Rohan Sharma" in res_csv.text
