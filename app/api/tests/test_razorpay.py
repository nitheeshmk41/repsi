import uuid
import traceback
from fastapi.testclient import TestClient
from app.main import app


def test_razorpay_order_creation_and_verification():
    with TestClient(app) as client:
        try:
            # Register owner
            unique_email = f"rzp_owner_{uuid.uuid4().hex[:6]}@repsi.app"
            reg_payload = {
                "full_name": "Razorpay Gym Owner",
                "email": unique_email,
                "password": "SecretPassword123!",
                "gym_name": "Razorpay Power Gym",
                "gym_phone": "+91 98888 77777",
                "gym_city": "Mumbai"
            }
            resp = client.post("/api/v1/auth/register", json=reg_payload)
            print("REG RESP CODE:", resp.status_code)
            print("REG RESP BODY:", resp.json())
            assert resp.status_code == 201
            token = resp.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            # 1. Test create-order endpoint
            order_payload = {
                "amount": 1499.0,
                "currency": "INR",
                "notes": {
                    "plan_id": "growth",
                    "plan_name": "Growth Tier",
                    "billing_cycle": "monthly"
                }
            }
            order_resp = client.post("/api/v1/payments/razorpay/create-order", json=order_payload, headers=headers)
            print("ORDER RESP CODE:", order_resp.status_code)
            print("ORDER RESP BODY:", order_resp.json())
            assert order_resp.status_code == 200
            order_data = order_resp.json()
            assert "order_id" in order_data
            assert order_data["amount"] == 1499.0
            assert order_data["amount_paisa"] == 149900
            assert "key_id" in order_data

            # 2. Test alias /razorpay/order endpoint
            alias_resp = client.post("/api/v1/payments/razorpay/order", json=order_payload, headers=headers)
            print("ALIAS RESP CODE:", alias_resp.status_code)
            print("ALIAS RESP BODY:", alias_resp.json())
            assert alias_resp.status_code == 200
            assert "order_id" in alias_resp.json()

            # 3. Test verification endpoint
            verify_payload = {
                "razorpay_order_id": order_data["order_id"],
                "razorpay_payment_id": "pay_test_rzp_123456",
                "razorpay_signature": "MOCK_VERIFIED_SIGNATURE",
                "amount": 1499.0,
            }
            verify_resp = client.post("/api/v1/payments/razorpay/verify", json=verify_payload, headers=headers)
            print("VERIFY RESP CODE:", verify_resp.status_code)
            print("VERIFY RESP BODY:", verify_resp.json())
            assert verify_resp.status_code == 200
            ver_data = verify_resp.json()
            assert ver_data["verified"] is True
            assert ver_data["status"] == "success"
            assert ver_data["invoice_number"].startswith("INV-")

            # 4. Check workspace billing endpoint reflects invoices
            billing_resp = client.get("/api/v1/workspaces/billing", headers=headers)
            print("BILLING RESP CODE:", billing_resp.status_code)
            print("BILLING RESP BODY:", billing_resp.json())
            assert billing_resp.status_code == 200
            billing_data = billing_resp.json()
            assert "plan" in billing_data
            assert "usage" in billing_data
            assert "invoices" in billing_data
        except Exception as e:
            traceback.print_exc()
            raise e
