import io
import pytest
from datetime import date, datetime, timedelta, timezone
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from tests.conftest import TestingSessionLocal
from app.core.security import create_access_token
from app.models.user import User, Workspace, WorkspaceMember, UserRole
from app.models.member import Member, Membership, MembershipPlan, MemberStatus
from app.models.finance import Invoice, Payment, PaymentStatus
from app.models.payment_settings import (
    BusinessPaymentSettings,
    ManualPaymentSubmission,
    SubmissionStatus,
)


@pytest.fixture
def db():
    session = TestingSessionLocal()
    yield session
    session.close()


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def setup_tenants(db: Session):
    # Clean up previous runs
    for ws_id in ["ws_manual_pay_1", "ws_manual_pay_2"]:
        db.query(ManualPaymentSubmission).filter(ManualPaymentSubmission.workspace_id == ws_id).delete()
        db.query(BusinessPaymentSettings).filter(BusinessPaymentSettings.workspace_id == ws_id).delete()
        db.query(Payment).filter(Payment.workspace_id == ws_id).delete()
        db.query(Invoice).filter(Invoice.workspace_id == ws_id).delete()
        db.query(Membership).filter(Membership.workspace_id == ws_id).delete()
        db.query(Member).filter(Member.workspace_id == ws_id).delete()
        db.query(MembershipPlan).filter(MembershipPlan.workspace_id == ws_id).delete()
        db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == ws_id).delete()
        db.query(Workspace).filter(Workspace.id == ws_id).delete()
    for u_id in ["u_owner_1", "u_trainer_1", "u_mem_1", "u_owner_2"]:
        db.query(User).filter(User.id == u_id).delete()
    db.commit()

    # Tenant 1 (Alpha Gym)
    ws1 = Workspace(
        id="ws_manual_pay_1",
        name="Alpha Fitness",
        slug="alpha-fitness-test",
    )
    # Tenant 2 (Beta Gym)
    ws2 = Workspace(
        id="ws_manual_pay_2",
        name="Beta Fitness",
        slug="beta-fitness-test",
    )
    db.add(ws1)
    db.add(ws2)

    # Owner 1
    owner1 = User(
        id="u_owner_1",
        email="owner1@alpha.test",
        full_name="Alpha Owner",
        hashed_password="hash",
        is_active=True,
    )
    db.add(owner1)
    db.add(
        WorkspaceMember(
            id="wm_owner_1",
            workspace_id=ws1.id,
            user_id=owner1.id,
            role=UserRole.OWNER,
            is_active=True,
        )
    )

    # Trainer 1
    trainer1 = User(
        id="u_trainer_1",
        email="trainer1@alpha.test",
        full_name="Alpha Trainer",
        hashed_password="hash",
        is_active=True,
    )
    db.add(trainer1)
    db.add(
        WorkspaceMember(
            id="wm_trainer_1",
            workspace_id=ws1.id,
            user_id=trainer1.id,
            role=UserRole.TRAINER,
            is_active=True,
        )
    )

    # Member 1 (User + Member in Alpha)
    user_mem1 = User(
        id="u_mem_1",
        email="member1@alpha.test",
        full_name="John Doe",
        hashed_password="hash",
        is_active=True,
    )
    db.add(user_mem1)
    db.add(
        WorkspaceMember(
            id="wm_mem_1",
            workspace_id=ws1.id,
            user_id=user_mem1.id,
            role=UserRole.USER,
            is_active=True,
        )
    )
    plan1 = MembershipPlan(
        id="plan_alpha_gold",
        workspace_id=ws1.id,
        name="Gold Plan",
        duration_months=1,
        price=1500.0,
        is_active=True,
    )
    db.add(plan1)

    mem1 = Member(
        id="m_john_1",
        workspace_id=ws1.id,
        user_id=user_mem1.id,
        first_name="John",
        last_name="Doe",
        email=user_mem1.email,
        phone="9876543210",
        status=MemberStatus.ACTIVE,
        joined_date=date.today(),
    )
    db.add(mem1)

    # Invoice for Member 1 in Alpha Gym (Unpaid / Pending)
    inv1 = Invoice(
        id="inv_alpha_101",
        workspace_id=ws1.id,
        invoice_number="INV-2026-00101",
        member_id=mem1.id,
        subtotal=1500.0,
        tax_amount=0.0,
        total_amount=1500.0,
        amount_paid=0.0,
        status="pending",
        due_date=date.today() - timedelta(days=2),  # Overdue
        notes="Monthly Gold Membership",
    )
    db.add(inv1)

    # Tenant 2 Owner
    owner2 = User(
        id="u_owner_2",
        email="owner2@beta.test",
        full_name="Beta Owner",
        hashed_password="hash",
        is_active=True,
    )
    db.add(owner2)
    db.add(
        WorkspaceMember(
            id="wm_owner_2",
            workspace_id=ws2.id,
            user_id=owner2.id,
            role=UserRole.OWNER,
            is_active=True,
        )
    )

    db.commit()

    return {
        "ws1": ws1,
        "ws2": ws2,
        "owner1": owner1,
        "trainer1": trainer1,
        "user_mem1": user_mem1,
        "mem1": mem1,
        "inv1": inv1,
        "owner2": owner2,
    }


def auth_header(user_id: str, workspace_id: str, role: str):
    token = create_access_token(subject=user_id, workspace_id=workspace_id, role=role)
    return {"Authorization": f"Bearer {token}"}


# ─── 1. OWNER PAYMENT SETTINGS TESTS ──────────────────────────────────────────

def test_owner_payment_settings_crud(client: TestClient, setup_tenants: dict):
    env = setup_tenants
    headers = auth_header(env["owner1"].id, env["ws1"].id, "OWNER")

    # 1. Get settings (auto-creates defaults)
    res = client.get("/api/v1/payments/settings", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["workspace_id"] == env["ws1"].id
    assert data["upi_enabled"] is True

    # 2. Update settings (configure UPI, Phone, Bank)
    update_payload = {
        "upi_enabled": True,
        "upi_id": "alphafitness@okhdfcbank",
        "upi_name": "Alpha Fitness Private Limited",
        "upi_instructions": "Pay via GPay/PhonePe and enter reference code",
        "phone_enabled": True,
        "phone_number": "+91 9876543210",
        "phone_name": "Alpha Reception",
        "bank_enabled": True,
        "bank_account_name": "Alpha Fitness Pvt Ltd",
        "bank_name": "HDFC Bank",
        "bank_account_number": "50200012345678",
        "bank_ifsc": "HDFC0001234",
        "bank_branch": "Koramangala Bangalore",
    }
    res_up = client.put("/api/v1/payments/settings", json=update_payload, headers=headers)
    assert res_up.status_code == 200
    updated = res_up.json()
    assert updated["upi_id"] == "alphafitness@okhdfcbank"
    assert updated["bank_enabled"] is True
    assert updated["bank_account_number"] == "50200012345678"

    # 3. Validation: Disabling all payment methods must be REJECTED
    bad_payload = {
        "upi_enabled": False,
        "qr_enabled": False,
        "phone_enabled": False,
        "bank_enabled": False,
    }
    res_bad = client.put("/api/v1/payments/settings", json=bad_payload, headers=headers)
    assert res_bad.status_code == 400
    assert "At least one payment method" in res_bad.json()["detail"]


def test_merchant_qr_upload_and_validation(client: TestClient, setup_tenants: dict):
    env = setup_tenants
    headers = auth_header(env["owner1"].id, env["ws1"].id, "OWNER")

    # Valid PNG image bytes (magic bytes: \x89PNG\r\n\x1a\n)
    valid_png = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4"
    files = {"file": ("my_qr.png", valid_png, "image/png")}
    res = client.post("/api/v1/payments/settings/qr-code", files=files, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["qr_enabled"] is True
    assert data["qr_image_url"] is not None

    # Retrieve QR image
    res_img = client.get("/api/v1/payments/settings/qr-code", headers=headers)
    assert res_img.status_code == 200
    assert res_img.headers["content-type"] == "image/png"

    # Invalid fake file (e.g. text or script pretending to be image)
    fake_exe = b"MZ\x90\x00\x03\x00\x00\x00this is not an image"
    files_fake = {"file": ("malicious.png", fake_exe, "image/png")}
    res_fake = client.post("/api/v1/payments/settings/qr-code", files=files_fake, headers=headers)
    assert res_fake.status_code == 400
    assert "Invalid image format" in res_fake.json()["detail"]

    # Delete QR
    res_del = client.delete("/api/v1/payments/settings/qr-code", headers=headers)
    assert res_del.status_code == 200
    assert res_del.json()["qr_enabled"] is False


def test_cross_tenant_settings_isolation(client: TestClient, setup_tenants: dict):
    env = setup_tenants
    # Tenant 2 tries to access Tenant 1 settings with Tenant 2 token
    headers_t2 = auth_header(env["owner2"].id, env["ws2"].id, "OWNER")

    res = client.get("/api/v1/payments/settings", headers=headers_t2)
    assert res.status_code == 200
    data = res.json()
    # It must return Tenant 2's own settings, never Tenant 1
    assert data["workspace_id"] == env["ws2"].id


# ─── 2. MEMBER INSTRUCTIONS & SUBMISSION TESTS ───────────────────────────────

def test_member_fee_instructions(client: TestClient, setup_tenants: dict):
    env = setup_tenants
    headers_member = auth_header(env["user_mem1"].id, env["ws1"].id, "USER")

    # Member requests payment instructions for their invoice
    res = client.get(f"/api/v1/payments/invoices/{env['inv1'].id}/instructions", headers=headers_member)
    assert res.status_code == 200
    data = res.json()
    assert data["invoice_id"] == env["inv1"].id
    assert data["amount_due"] == 1500.0
    assert data["outstanding_balance"] == 1500.0
    assert "reference_code" in data
    assert data["reference_code"].startswith("PAY-")
    assert data["has_active_methods"] is True


def test_member_submit_receipt_and_restrictions(client: TestClient, setup_tenants: dict, db: Session):
    env = setup_tenants
    headers_member = auth_header(env["user_mem1"].id, env["ws1"].id, "USER")

    # 1. Before payment, check-in is blocked because invoice is overdue
    res_checkin = client.post(
        "/api/v1/attendance/check-in",
        json={"method": "manual"},
        headers=headers_member,
    )
    assert res_checkin.status_code == 403
    assert "Check-in blocked" in res_checkin.json()["detail"]

    # 2. Member submits payment receipt
    valid_receipt_jpeg = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb"
    res_sub = client.post(
        "/api/v1/payments/submissions",
        data={
            "invoice_id": env["inv1"].id,
            "amount": "1500.0",
            "payment_method": "upi",
            "transaction_ref": "UPI/UTR-9988776655",
            "notes": "Paid through PhonePe UPI",
        },
        files={"receipt_file": ("phonepe_receipt.jpg", valid_receipt_jpeg, "image/jpeg")},
        headers=headers_member,
    )
    assert res_sub.status_code == 201
    sub_data = res_sub.json()
    assert sub_data["status"] == "pending_review"
    assert sub_data["amount"] == 1500.0
    assert sub_data["transaction_ref"] == "UPI/UTR-9988776655"
    sub_id = sub_data["id"]

    # 3. Critical verification: Submitting a receipt must NOT unlock restricted member access!
    # Status is pending review -> check-in must still be blocked.
    res_checkin_pending = client.post(
        "/api/v1/attendance/check-in",
        json={"method": "manual"},
        headers=headers_member,
    )
    assert res_checkin_pending.status_code == 403
    assert "pending owner verification" in res_checkin_pending.json()["detail"]

    # 4. Duplicate submission against same invoice while pending must be REJECTED
    res_dup = client.post(
        "/api/v1/payments/submissions",
        data={
            "invoice_id": env["inv1"].id,
            "amount": "1500.0",
            "payment_method": "upi",
        },
        files={"receipt_file": ("dup.jpg", valid_receipt_jpeg, "image/jpeg")},
        headers=headers_member,
    )
    assert res_dup.status_code == 400
    assert "already submitted and pending review" in res_dup.json()["detail"]

    # 5. Unauthorized member cannot approve their own payment
    res_unauth_appr = client.post(
        f"/api/v1/payments/submissions/{sub_id}/approve",
        headers=headers_member,
    )
    assert res_unauth_appr.status_code == 403


# ─── 3. APPROVAL & ACCESS ACTIVATION WORKFLOW ─────────────────────────────────

def test_owner_approve_payment_activates_access(client: TestClient, setup_tenants: dict, db: Session):
    env = setup_tenants
    headers_member = auth_header(env["user_mem1"].id, env["ws1"].id, "USER")
    headers_owner = auth_header(env["owner1"].id, env["ws1"].id, "OWNER")

    # Member submits receipt
    valid_pdf = b"%PDF-1.4\n%test pdf content"
    res_sub = client.post(
        "/api/v1/payments/submissions",
        data={
            "invoice_id": env["inv1"].id,
            "amount": "1500.0",
            "payment_method": "bank_transfer",
            "transaction_ref": "IMPS8829910",
        },
        files={"receipt_file": ("bank_statement.pdf", valid_pdf, "application/pdf")},
        headers=headers_member,
    )
    assert res_sub.status_code == 201
    sub_id = res_sub.json()["id"]

    # Review queue displays submission for owner
    res_queue = client.get("/api/v1/payments/submissions?status=pending_review", headers=headers_owner)
    assert res_queue.status_code == 200
    items = res_queue.json()
    assert any(item["id"] == sub_id for item in items)

    # Owner approves payment
    res_appr = client.post(f"/api/v1/payments/submissions/{sub_id}/approve", headers=headers_owner)
    assert res_appr.status_code == 200
    approved_sub = res_appr.json()
    assert approved_sub["status"] == "approved"
    assert approved_sub["reviewer_name"] == env["owner1"].full_name

    # Verify Invoice is now PAID
    inv_check = client.get(f"/api/v1/payments/invoices/{env['inv1'].id}", headers=headers_owner)
    assert inv_check.status_code == 200
    assert inv_check.json()["status"] == "paid"
    assert inv_check.json()["outstanding_balance"] == 0.0

    # Verify Payment ledger record exists
    payments_list = client.get("/api/v1/payments/", headers=headers_owner)
    assert payments_list.status_code == 200
    assert any(p["amount"] == 1500.0 and p["invoice_id"] == env["inv1"].id for p in payments_list.json())

    # Idempotency check: Cannot approve again
    res_appr_again = client.post(f"/api/v1/payments/submissions/{sub_id}/approve", headers=headers_owner)
    assert res_appr_again.status_code == 400

    # Access is now restored: Check-in succeeds!
    res_checkin_restored = client.post(
        "/api/v1/attendance/check-in",
        json={"method": "manual"},
        headers=headers_member,
    )
    assert res_checkin_restored.status_code == 201


# ─── 4. REJECTION WORKFLOW ───────────────────────────────────────────────────

def test_owner_reject_payment_keeps_restrictions(client: TestClient, setup_tenants: dict, db: Session):
    env = setup_tenants
    headers_member = auth_header(env["user_mem1"].id, env["ws1"].id, "USER")
    headers_owner = auth_header(env["owner1"].id, env["ws1"].id, "OWNER")

    # Member submits receipt
    valid_png = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR"
    res_sub = client.post(
        "/api/v1/payments/submissions",
        data={
            "invoice_id": env["inv1"].id,
            "amount": "1500.0",
            "payment_method": "upi",
            "transaction_ref": "FAKE-123",
        },
        files={"receipt_file": ("blur_screen.png", valid_png, "image/png")},
        headers=headers_member,
    )
    assert res_sub.status_code == 201
    sub_id = res_sub.json()["id"]

    # Rejection without reason must be rejected
    res_rej_empty = client.post(
        f"/api/v1/payments/submissions/{sub_id}/reject",
        json={"decision": "reject", "rejection_reason": ""},
        headers=headers_owner,
    )
    assert res_rej_empty.status_code == 400

    # Reject with clear reason
    res_rej = client.post(
        f"/api/v1/payments/submissions/{sub_id}/reject",
        json={"decision": "reject", "rejection_reason": "Screenshot is blurry and transaction ID is missing."},
        headers=headers_owner,
    )
    assert res_rej.status_code == 200
    rej_data = res_rej.json()
    assert rej_data["status"] == "rejected"
    assert "blurry" in rej_data["rejection_reason"]

    # Invoice remains unpaid
    inv_check = client.get(f"/api/v1/payments/invoices/{env['inv1'].id}", headers=headers_owner)
    assert inv_check.json()["status"] == "pending"

    # Member check-in remains blocked
    res_checkin_blocked = client.post(
        "/api/v1/attendance/check-in",
        json={"method": "manual"},
        headers=headers_member,
    )
    assert res_checkin_blocked.status_code == 403


# ─── 5. USER LANGUAGE PREFERENCE API ──────────────────────────────────────────

def test_language_preference_api(client: TestClient, setup_tenants: dict):
    env = setup_tenants
    headers_member = auth_header(env["user_mem1"].id, env["ws1"].id, "USER")

    # Check default language is 'en'
    res_me = client.get("/api/v1/auth/me", headers=headers_member)
    assert res_me.status_code == 200
    assert res_me.json()["preferred_language"] == "en"

    # Switch language to Tamil ('ta')
    res_ta = client.put("/api/v1/auth/me/language", json={"language": "ta"}, headers=headers_member)
    assert res_ta.status_code == 200
    assert res_ta.json()["language"] == "ta"

    # Verify profile reflects 'ta'
    res_me_updated = client.get("/api/v1/auth/me", headers=headers_member)
    assert res_me_updated.json()["preferred_language"] == "ta"
