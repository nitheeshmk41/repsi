import pytest
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from app.main import app
from tests.conftest import TestingSessionLocal
from app.models.user import User, Workspace, WorkspaceMember, UserRole
from app.models.member import Member, MemberStatus
from app.core.security import get_password_hash

client = TestClient(app)


def test_superadmin_global_management_and_cascading_deletion():
    db = TestingSessionLocal()
    try:
        db.query(User).filter(User.email == "superadmin.test@repsi.com").delete()
        db.commit()
        admin = User(
            email="superadmin.test@repsi.com",
            full_name="Platform Super Admin",
            hashed_password=get_password_hash("SuperAdmin2026!"),
            is_superadmin=True,
            is_active=True
        )
        db.add(admin)
        db.commit()
    finally:
        db.close()

    # Login as Super Admin
    login_res = client.post("/api/v1/auth/login", json={
        "email": "superadmin.test@repsi.com",
        "password": "SuperAdmin2026!"
    })
    assert login_res.status_code == 200, login_res.text
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Super Admin Overview
    ov_res = client.get("/api/v1/superadmin/overview", headers=headers)
    assert ov_res.status_code == 200, ov_res.text
    ov_data = ov_res.json()
    assert "total_gyms" in ov_data
    assert "total_members" in ov_data
    assert "monthly_revenue" in ov_data
    assert "system_health" in ov_data

    # 3. Create a New Gym Tenant via Super Admin
    create_gym_res = client.post("/api/v1/superadmin/workspaces", headers=headers, json={
        "name": "Cascade Test Fitness",
        "slug": "cascade-test-gym",
        "owner_name": "Test Owner",
        "owner_email": "owner.cascade@test.com",
        "owner_password": "OwnerPass2026!",
        "phone": "+91 91122 33445",
        "city": "Bengaluru"
    })
    assert create_gym_res.status_code == 201, create_gym_res.text
    gym_data = create_gym_res.json()
    gym_id = gym_data["id"]

    # 4. Add a Member into this gym
    db = TestingSessionLocal()
    try:
        member = Member(
            workspace_id=gym_id,
            first_name="Global",
            last_name="MemberTest",
            email="global.member@test.com",
            phone="+91 98877 66554",
            status=MemberStatus.ACTIVE,
            joined_date=datetime.now(timezone.utc).date()
        )
        db.add(member)
        db.commit()
        db.refresh(member)
        member_id = member.id
    finally:
        db.close()

    # 5. Global Member Search via Super Admin
    members_res = client.get("/api/v1/superadmin/members?q=MemberTest", headers=headers)
    assert members_res.status_code == 200
    m_list = members_res.json()
    assert len(m_list) >= 1
    found_m = next((m for m in m_list if m["id"] == member_id), None)
    assert found_m is not None
    assert found_m["gym_slug"] == "cascade-test-gym"

    # 6. Global Search Omnibox
    search_res = client.get("/api/v1/superadmin/search?q=cascade", headers=headers)
    assert search_res.status_code == 200
    assert len(search_res.json()) >= 1

    # 7. Member Deletion with Re-Auth & Confirmation
    # Invalid password attempt
    bad_del = client.post(f"/api/v1/superadmin/members/{member_id}/delete-permanently", headers=headers, json={
        "confirmation_name": "Global MemberTest",
        "admin_password": "WrongPassword!",
        "reason": "Test deletion"
    })
    assert bad_del.status_code == 401

    # Name mismatch attempt
    bad_name = client.post(f"/api/v1/superadmin/members/{member_id}/delete-permanently", headers=headers, json={
        "confirmation_name": "Wrong Name",
        "admin_password": "SuperAdmin2026!",
        "reason": "Test deletion"
    })
    assert bad_name.status_code == 400

    # Successful member deletion
    good_m_del = client.post(f"/api/v1/superadmin/members/{member_id}/delete-permanently", headers=headers, json={
        "confirmation_name": "Global MemberTest",
        "admin_password": "SuperAdmin2026!",
        "reason": "Owner requested removal"
    })
    assert good_m_del.status_code == 200

    # Verify member is gone
    db = TestingSessionLocal()
    try:
        deleted_m = db.query(Member).filter(Member.id == member_id).first()
        assert deleted_m is None
    finally:
        db.close()

    # 8. Permanent Cascading Gym Deletion
    # Invalid slug attempt
    bad_slug = client.post(f"/api/v1/superadmin/workspaces/{gym_id}/delete-permanently", headers=headers, json={
        "confirmation_slug": "wrong-slug",
        "admin_password": "SuperAdmin2026!",
        "reason": "Testing deletion"
    })
    assert bad_slug.status_code == 400

    # Successful cascading gym deletion
    good_gym_del = client.post(f"/api/v1/superadmin/workspaces/{gym_id}/delete-permanently", headers=headers, json={
        "confirmation_slug": "cascade-test-gym",
        "admin_password": "SuperAdmin2026!",
        "reason": "Tenant offboarding closure"
    })
    assert good_gym_del.status_code == 200

    # Verify workspace and workspace members are completely cleaned up
    db = TestingSessionLocal()
    try:
        ws_check = db.query(Workspace).filter(Workspace.id == gym_id).first()
        assert ws_check is None
        wm_check = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == gym_id).all()
        assert len(wm_check) == 0
    finally:
        db.close()

    # 9. Verify Audit Trail captured the events
    audit_res = client.get("/api/v1/superadmin/audit-logs", headers=headers)
    assert audit_res.status_code == 200
    logs = audit_res.json()
    assert any("PERMANENT_DELETE_WORKSPACE" in l["action"] for l in logs)
    assert any("PERMANENT_DELETE_MEMBER" in l["action"] for l in logs)
