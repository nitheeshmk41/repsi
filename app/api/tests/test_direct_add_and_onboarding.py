import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_direct_add_member_no_invitation():
    uid = uuid.uuid4().hex[:6]
    owner_email = f"directowner_{uid}@testgym.com"
    member_email = f"rahul_{uid}@gmail.com"

    # 1. Register Owner
    reg_resp = client.post("/api/v1/auth/register", json={
        "full_name": "Direct Owner",
        "email": owner_email,
        "password": "Password123!",
        "gym_name": f"Direct Gym {uid}",
        "gym_phone": "+91 99999 88888",
        "gym_city": "Coimbatore"
    })
    assert reg_resp.status_code == 201
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Check contact before adding (should return exists=False)
    check_resp = client.post("/api/v1/members/check-contact", json={
        "email": member_email,
        "phone": f"+91 98765 {uid[:5]}"
    }, headers=headers)
    assert check_resp.status_code == 200
    assert check_resp.json()["exists"] == False

    # 3. Add Member directly (without user account creation or invitation requirement)
    add_resp = client.post("/api/v1/members", json={
        "first_name": "Rahul",
        "last_name": "Kumar",
        "phone": f"+91 98765 {uid[:5]}",
        "email": member_email
    }, headers=headers)
    assert add_resp.status_code == 201
    member_data = add_resp.json()
    assert member_data["first_name"] == "Rahul"
    assert member_data["status"] == "active"
    assert member_data["user_id"] is not None
    assert member_data["repsi_access"] == "Connected"

    # 4. Edit contact info (typo fix e.g. email update)
    member_id = member_data["id"]
    corrected_email = f"rahul_corr_{uid}@gmail.com"
    update_resp = client.put(f"/api/v1/members/{member_id}", json={
        "email": corrected_email
    }, headers=headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["email"] == corrected_email


def test_progressive_workspace_onboarding():
    uid = uuid.uuid4().hex[:6]
    owner_email = f"progowner_{uid}@fitzone.com"

    # 1. Register Owner
    reg_resp = client.post("/api/v1/auth/register", json={
        "full_name": "Progressive Owner",
        "email": owner_email,
        "password": "Password123!",
        "gym_name": f"FitZone Studio {uid}",
        "gym_phone": "+91 88888 77777",
        "gym_city": "Chennai"
    })
    token = reg_resp.json()["access_token"]
    ws_id = reg_resp.json()["workspace_id"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Complete progressive setup wizard steps
    onboarding_payload = {
        "business_types": "['Gym', 'PT Studio']",
        "business_size": "100–500",
        "managed_features": "['Members', 'Attendance', 'Payments', 'Trainers']",
        "management_method": "Excel / Google Sheets",
        "checkin_method": "QR Code",
        "brand_color": "#FF5722",
        "step": 14
    }
    complete_resp = client.post("/api/v1/workspaces/onboarding/complete", json=onboarding_payload, headers=headers)
    assert complete_resp.status_code == 200
    assert complete_resp.json()["status"] == "success"

    # 3. Retrieve Workspace to verify saved setup state
    ws_resp = client.get(f"/api/v1/workspaces/{ws_id}", headers=headers)
    assert ws_resp.status_code == 200
    ws_data = ws_resp.json()
    assert ws_data["onboarding_completed"] == True
    assert ws_data["business_size"] == "100–500"
    assert ws_data["checkin_method"] == "QR Code"
