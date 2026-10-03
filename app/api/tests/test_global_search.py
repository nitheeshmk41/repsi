from fastapi.testclient import TestClient
from app.main import app


def test_global_search():
    with TestClient(app) as client:
        reg_payload = {
            "full_name": "Search Owner",
            "email": "search_owner@repsi.app",
            "password": "SecretPassword123!",
            "gym_name": "Search Fitness Gym",
            "gym_phone": "+91 99999 22222",
            "gym_city": "Mumbai"
        }
        resp = client.post("/api/v1/auth/register", json=reg_payload)
        assert resp.status_code == 201
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Create member
        client.post("/api/v1/members/", json={
            "first_name": "Nitesh",
            "last_name": "Kumar",
            "email": "nitesh.kumar@example.com",
            "phone": "+91 98765 11111"
        }, headers=headers)

        # Create trainer
        client.post("/api/v1/trainers/", json={
            "name": "Nitesh Trainer",
            "phone": "+91 98765 22222",
            "specialization": "Personal Trainer"
        }, headers=headers)

        # 1. Search for Nitesh
        res = client.get("/api/v1/search/global?q=Nitesh", headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert len(data["members"]) > 0
        assert data["members"][0]["name"] == "Nitesh Kumar"
        assert len(data["trainers"]) > 0
        assert data["trainers"][0]["name"] == "Nitesh Trainer"

        # 2. Search for Feature: Attendance
        res_feat = client.get("/api/v1/search/global?q=Attendance", headers=headers)
        assert res_feat.status_code == 200
        assert any(f["id"] == "attendance" for f in res_feat.json()["features"])

        # 3. Empty query returns default features
        res_empty = client.get("/api/v1/search/global?q=", headers=headers)
        assert res_empty.status_code == 200
        assert len(res_empty.json()["features"]) > 0
