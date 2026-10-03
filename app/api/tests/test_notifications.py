import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_notifications_lifecycle_and_tenant_isolation():
    # 1. Register Gym A Owner
    res_a = client.post("/api/v1/auth/register", json={
        "full_name": "Notif Owner A",
        "email": "notif.a@test.com",
        "password": "Password123!",
        "gym_name": "Notif Gym A",
        "gym_phone": "+91 99999 11111",
        "gym_city": "Mumbai",
    })
    assert res_a.status_code == 201, res_a.text
    token_a = res_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 2. Register Gym B Owner
    res_b = client.post("/api/v1/auth/register", json={
        "full_name": "Notif Owner B",
        "email": "notif.b@test.com",
        "password": "Password123!",
        "gym_name": "Notif Gym B",
        "gym_phone": "+91 99999 22222",
        "gym_city": "Delhi",
    })
    assert res_b.status_code == 201, res_b.text
    token_b = res_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 3. Create a notification for Gym A Owner
    create_res = client.post("/api/v1/notifications", headers=headers_a, json={
        "title": "Membership Renewal Due",
        "message": "John Doe membership expires in 3 days.",
        "action_url": "/members/123",
    })
    assert create_res.status_code == 201, create_res.text
    notif = create_res.json()
    assert notif["title"] == "Membership Renewal Due"
    assert notif["is_read"] is False
    notif_id = notif["id"]

    # 4. List notifications for Gym A
    list_res_a = client.get("/api/v1/notifications", headers=headers_a)
    assert list_res_a.status_code == 200
    data_a = list_res_a.json()
    assert data_a["total"] == 1
    assert data_a["unread_count"] == 1
    assert data_a["items"][0]["id"] == notif_id

    # 5. Multi-tenant isolation: Gym B Owner must NOT see Gym A's notification
    list_res_b = client.get("/api/v1/notifications", headers=headers_b)
    assert list_res_b.status_code == 200
    data_b = list_res_b.json()
    assert data_b["total"] == 0
    assert data_b["unread_count"] == 0

    # Gym B cannot mark Gym A's notification as read
    b_hack = client.patch(f"/api/v1/notifications/{notif_id}/read", headers=headers_b)
    assert b_hack.status_code == 404

    # 6. Gym A marks notification as read
    read_res = client.patch(f"/api/v1/notifications/{notif_id}/read", headers=headers_a)
    assert read_res.status_code == 200
    assert read_res.json()["is_read"] is True

    # Check unread count is now 0
    list_res_a2 = client.get("/api/v1/notifications", headers=headers_a)
    assert list_res_a2.json()["unread_count"] == 0

    # 7. Create another notification and test mark-all-read
    client.post("/api/v1/notifications", headers=headers_a, json={
        "title": "New Payment Received",
        "message": "Payment of 5000 INR received via UPI.",
    })
    list_res_a3 = client.get("/api/v1/notifications", headers=headers_a)
    assert list_res_a3.json()["unread_count"] == 1

    mark_all = client.post("/api/v1/notifications/mark-all-read", headers=headers_a)
    assert mark_all.status_code == 200
    list_res_a4 = client.get("/api/v1/notifications", headers=headers_a)
    assert list_res_a4.json()["unread_count"] == 0
