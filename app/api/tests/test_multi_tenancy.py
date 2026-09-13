from fastapi.testclient import TestClient
from app.main import app


def test_tenant_isolation_and_workspace_scoping():
    with TestClient(app) as client:
        # 1. Register Gym A
        reg_a = {
            "full_name": "Alice Owner",
            "email": "alice@gyma.com",
            "password": "Password123!",
            "gym_name": "Gym Alpha",
            "gym_phone": "+91 91111 22222",
            "gym_city": "Mumbai"
        }
        res_a = client.post("/api/v1/auth/register", json=reg_a)
        assert res_a.status_code == 201
        token_a = res_a.json()["access_token"]
        ws_a = res_a.json()["workspace_id"]

        # 2. Register Gym B
        reg_b = {
            "full_name": "Bob Owner",
            "email": "bob@gymb.com",
            "password": "Password123!",
            "gym_name": "Gym Beta",
            "gym_phone": "+91 93333 44444",
            "gym_city": "Delhi"
        }
        res_b = client.post("/api/v1/auth/register", json=reg_b)
        assert res_b.status_code == 201
        token_b = res_b.json()["access_token"]
        ws_b = res_b.json()["workspace_id"]

        # 3. Create member in Gym A
        headers_a = {"Authorization": f"Bearer {token_a}"}
        mem_a_res = client.post(
            "/api/v1/members/",
            json={"first_name": "MemberA", "last_name": "Alpha", "email": "a@example.com", "phone": "111"},
            headers=headers_a
        )
        assert mem_a_res.status_code == 201
        mem_a_id = mem_a_res.json()["id"]

        # 4. Create member in Gym B
        headers_b = {"Authorization": f"Bearer {token_b}"}
        mem_b_res = client.post(
            "/api/v1/members/",
            json={"first_name": "MemberB", "last_name": "Beta", "email": "b@example.com", "phone": "222"},
            headers=headers_b
        )
        assert mem_b_res.status_code == 201
        mem_b_id = mem_b_res.json()["id"]

        # 5. Verify Gym A cannot see Gym B member
        list_a = client.get("/api/v1/members/", headers=headers_a).json()
        item_ids_a = [item["id"] for item in list_a["items"]]
        assert mem_a_id in item_ids_a
        assert mem_b_id not in item_ids_a

        # 6. Verify Gym B cannot fetch Gym A member by ID
        get_cross = client.get(f"/api/v1/members/{mem_a_id}", headers=headers_b)
        assert get_cross.status_code == 404

        # 7. Check attendance recording for Gym A
        att_res = client.post(
            "/api/v1/attendance/check-in",
            json={"member_id": mem_a_id, "method": "qr"},
            headers=headers_a
        )
        assert att_res.status_code == 201
        att_id = att_res.json()["id"]

        # Check out
        checkout_res = client.post(
            "/api/v1/attendance/check-out",
            json={"attendance_id": att_id},
            headers=headers_a
        )
        assert checkout_res.status_code == 200
        assert checkout_res.json()["check_out_time"] is not None

        # 8. Record payment for Gym A
        pay_res = client.post(
            "/api/v1/payments/",
            json={"member_id": mem_a_id, "amount": 2499.0, "method": "upi"},
            headers=headers_a
        )
        assert pay_res.status_code == 201
        assert pay_res.json()["amount"] == 2499.0
