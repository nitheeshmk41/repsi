from fastapi.testclient import TestClient
from app.main import app


def test_root():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "online"
        assert "REPSI" in data["name"]


def test_health():
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


def test_dashboard_metrics():
    with TestClient(app) as client:
        # Register a gym to get a valid token
        reg_payload = {
            "full_name": "Metrics Owner",
            "email": "metrics_owner@repsi.app",
            "password": "SecretPassword123!",
            "gym_name": "Metrics Gym",
            "gym_phone": "+91 99999 11111",
            "gym_city": "Chennai"
        }
        resp = client.post("/api/v1/auth/register", json=reg_payload)
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        response = client.get("/api/v1/dashboard/metrics", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "active_members" in data
        assert "monthly_revenue" in data
        assert "revenue_chart" in data
        assert len(data["revenue_chart"]) > 0


def test_auth_and_registration():
    with TestClient(app) as client:
        # Register new gym
        reg_payload = {
            "full_name": "Test Owner",
            "email": "testowner@repsi.app",
            "password": "SecretPassword123!",
            "gym_name": "Test Titans Gym",
            "gym_phone": "+91 99999 88888",
            "gym_city": "Bangalore"
        }
        resp = client.post("/api/v1/auth/register", json=reg_payload)
        assert resp.status_code == 201
        token_data = resp.json()
        assert "access_token" in token_data
        assert token_data["role"] == "OWNER"

        token = token_data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Check me
        me_resp = client.get("/api/v1/auth/me", headers=headers)
        assert me_resp.status_code == 200
        assert me_resp.json()["email"] == "testowner@repsi.app"

        # Create Member
        member_payload = {
            "first_name": "Karan",
            "last_name": "Singh",
            "email": "karan@example.com",
            "phone": "+91 98765 43210",
        }
        mem_resp = client.post("/api/v1/members/", json=member_payload, headers=headers)
        assert mem_resp.status_code == 201
        member_data = mem_resp.json()
        assert member_data["first_name"] == "Karan"

        # List members
        list_resp = client.get("/api/v1/members/", headers=headers)
        assert list_resp.status_code == 200
        assert list_resp.json()["total"] >= 1
