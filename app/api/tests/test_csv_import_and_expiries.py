import pytest
import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_csv_import_expiries_and_security():
    # 1. Register a test gym owner
    reg = client.post("/api/v1/auth/register", json={
        "full_name": "Test Gym Owner",
        "email": "pilot.owner@gympilot.com",
        "password": "Password123!",
        "gym_name": "Pilot Fitness Arena",
        "gym_phone": "+91 98765 43210",
        "gym_city": "Chennai",
    })
    assert reg.status_code == 201, reg.text
    token = reg.json()["access_token"]
    ws_id = reg.json()["workspace_id"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Test CSV Import
    csv_content = (
        "Name,Phone,Email,Gender,Plan\n"
        "Rajesh Kumar,9876543211,rajesh@test.com,Male,Monthly\n"
        "Priya Sharma,9876543212,priya@test.com,Female,Quarterly\n"
        "Amit Patel,9876543213,,Male,Monthly\n"
    )
    files = {"file": ("members.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    res_import = client.post("/api/v1/members/import-csv", headers=headers, files=files)
    assert res_import.status_code == 200, res_import.text
    import_data = res_import.json()
    assert import_data["imported"] == 3
    assert import_data["duplicates"] == 0

    # Test Duplicate detection on second import
    files_dup = {"file": ("members.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    res_dup = client.post("/api/v1/members/import-csv", headers=headers, files=files_dup)
    assert res_dup.status_code == 200
    assert res_dup.json()["duplicates"] == 3
    assert res_dup.json()["imported"] == 0

    # 3. Test CSV Export
    res_export = client.get("/api/v1/members/export-csv", headers=headers)
    assert res_export.status_code == 200
    assert "text/csv" in res_export.headers.get("content-type", "")
    assert "Rajesh" in res_export.text
    assert "Priya" in res_export.text

    # 4. Test Membership Expiry & Renewal Reminders
    res_expiring = client.get("/api/v1/memberships/expiring?days=35", headers=headers)
    assert res_expiring.status_code == 200
    expiring_list = res_expiring.json()
    assert len(expiring_list) >= 2

    # Test WhatsApp Reminders generator
    res_reminders = client.get("/api/v1/memberships/renewal-reminders?days=35", headers=headers)
    assert res_reminders.status_code == 200
    reminders = res_reminders.json()
    assert len(reminders) >= 2
    assert "wa.me" in reminders[0]["whatsapp_url"]
    assert "expires" in reminders[0]["message_template"]

    # Test Expiry Audit worker
    res_audit = client.post("/api/v1/memberships/check-expiries", headers=headers)
    assert res_audit.status_code == 200
    assert res_audit.json()["status"] == "success"

    # 5. Test Biometric Security: Missing token should return 401
    bio_payload = {
        "device_id": "TURNSTILE_01",
        "workspace_id": ws_id,
        "biometric_hash": "9876543211"
    }
    res_bio_unauth = client.post("/api/v1/attendance/biometric-ingest/", json=bio_payload)
    assert res_bio_unauth.status_code == 401, f"Expected 401 without device token, got {res_bio_unauth.status_code}"

    # Authorized biometric request with token
    res_bio_auth = client.post(
        "/api/v1/attendance/biometric-ingest/",
        json=bio_payload,
        headers={"X-Device-Token": "SECURE_PILOT_KEY_12345"}
    )
    assert res_bio_auth.status_code == 200, res_bio_auth.text
    assert res_bio_auth.json()["action"] == "ACCESS_GRANTED"

    # 6. Test Payment and Auto-Generated Invoice
    members_list = client.get("/api/v1/members/", headers=headers).json()["items"]
    test_member_id = members_list[0]["id"]

    res_pay = client.post("/api/v1/payments/", headers=headers, json={
        "member_id": test_member_id,
        "amount": 1499.0,
        "currency": "INR",
        "method": "upi",
        "transaction_ref": "UPI12345678"
    })
    assert res_pay.status_code == 201, res_pay.text

    # Verify Invoice was created
    res_invoices = client.get("/api/v1/payments/invoices", headers=headers)
    assert res_invoices.status_code == 200
    invoices = res_invoices.json()
    assert len(invoices) >= 1
    assert invoices[0]["total_amount"] == 1499.0
    assert invoices[0]["invoice_number"].startswith("INV-")
