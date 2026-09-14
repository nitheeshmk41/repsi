import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_db, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

client = TestClient(app)

def test_full_e2e_multi_tenancy_isolation():
    # 1. Register Owner A (Gym Alpha)
    res_a = client.post("/api/v1/auth/register", json={
        "full_name": "Owner Alpha",
        "email": "owner.alpha@test.com",
        "password": "Password123!",
        "gym_name": "Alpha Fitness Club",
        "gym_phone": "+91 99999 11111",
        "gym_city": "Bangalore",
    })
    assert res_a.status_code == 201, f"Register A failed: {res_a.text}"
    token_a = res_a.json()["access_token"]
    ws_a = res_a.json()["workspace_id"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 2. Register Owner B (Gym Beta)
    res_b = client.post("/api/v1/auth/register", json={
        "full_name": "Owner Beta",
        "email": "owner.beta@test.com",
        "password": "Password123!",
        "gym_name": "Beta Power Gym",
        "gym_phone": "+91 88888 22222",
        "gym_city": "Mumbai",
    })
    assert res_b.status_code == 201, f"Register B failed: {res_b.text}"
    token_b = res_b.json()["access_token"]
    ws_b = res_b.json()["workspace_id"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    assert ws_a != ws_b, "Workspaces must be distinct"

    # 3. Create Records for Owner A
    member_a = client.post("/api/v1/members/", headers=headers_a, json={
        "first_name": "Member", "last_name": "Alpha", "email": "mem.alpha@test.com", "phone": "+91 91000 00001"
    }).json()
    trainer_a = client.post("/api/v1/trainers/", headers=headers_a, json={
        "name": "Trainer Alpha", "phone": "+91 91000 00002"
    }).json()
    machine_a = client.post("/api/v1/machines/", headers=headers_a, json={
        "name": "Treadmill Alpha", "category": "Cardio"
    }).json()
    workout_a = client.post("/api/v1/workouts/", headers=headers_a, json={
        "title": "Hypertrophy Alpha", "difficulty": "Advanced"
    }).json()
    class_a = client.post("/api/v1/classes/", headers=headers_a, json={
        "name": "CrossFit Alpha", "schedule": "Mon 08:00 AM"
    }).json()
    payment_a = client.post("/api/v1/payments/", headers=headers_a, json={
        "member_id": member_a["id"], "amount": 5000.0, "method": "upi"
    }).json()

    # 4. Create Records for Owner B
    member_b = client.post("/api/v1/members/", headers=headers_b, json={
        "first_name": "Member", "last_name": "Beta", "email": "mem.beta@test.com", "phone": "+91 92000 00001"
    }).json()
    trainer_b = client.post("/api/v1/trainers/", headers=headers_b, json={
        "name": "Trainer Beta", "phone": "+91 92000 00002"
    }).json()
    machine_b = client.post("/api/v1/machines/", headers=headers_b, json={
        "name": "Leg Press Beta", "category": "Strength"
    }).json()
    workout_b = client.post("/api/v1/workouts/", headers=headers_b, json={
        "title": "Circuit Beta", "difficulty": "Beginner"
    }).json()
    class_b = client.post("/api/v1/classes/", headers=headers_b, json={
        "name": "Yoga Beta", "schedule": "Tue 07:00 AM"
    }).json()
    payment_b = client.post("/api/v1/payments/", headers=headers_b, json={
        "member_id": member_b["id"], "amount": 8000.0, "method": "card"
    }).json()

    # 5. Verify Owner A sees ONLY Gym A records
    members_a_list = client.get("/api/v1/members/", headers=headers_a).json()["items"]
    assert len(members_a_list) == 1
    assert members_a_list[0]["id"] == member_a["id"]

    trainers_a_list = client.get("/api/v1/trainers/", headers=headers_a).json()
    assert len(trainers_a_list) == 1
    assert trainers_a_list[0]["id"] == trainer_a["id"]

    machines_a_list = client.get("/api/v1/machines/", headers=headers_a).json()
    assert len(machines_a_list) == 1
    assert machines_a_list[0]["id"] == machine_a["id"]

    workouts_a_list = client.get("/api/v1/workouts/", headers=headers_a).json()
    assert len(workouts_a_list) == 1
    assert workouts_a_list[0]["id"] == workout_a["id"]

    classes_a_list = client.get("/api/v1/classes/", headers=headers_a).json()
    assert len(classes_a_list) == 1
    assert classes_a_list[0]["id"] == class_a["id"]

    payments_a_list = client.get("/api/v1/payments/", headers=headers_a).json()
    assert len(payments_a_list) == 1
    assert payments_a_list[0]["id"] == payment_a["id"]

    # 6. Verify Owner B sees ONLY Gym B records
    members_b_list = client.get("/api/v1/members/", headers=headers_b).json()["items"]
    assert len(members_b_list) == 1
    assert members_b_list[0]["id"] == member_b["id"]

    machines_b_list = client.get("/api/v1/machines/", headers=headers_b).json()
    assert len(machines_b_list) == 1
    assert machines_b_list[0]["id"] == machine_b["id"]

    # 7. Direct API Authorization Attack Verification (Owner A attempting to access Owner B resources)
    res_get_mem_b = client.get(f"/api/v1/members/{member_b['id']}", headers=headers_a)
    assert res_get_mem_b.status_code == 404, "Cross-tenant member get must be 404"

    res_get_mac_b = client.get(f"/api/v1/machines/{machine_b['id']}", headers=headers_a)
    assert res_get_mac_b.status_code == 404, "Cross-tenant machine get must be 404"

    res_del_mac_b = client.delete(f"/api/v1/machines/{machine_b['id']}", headers=headers_a)
    assert res_del_mac_b.status_code == 404, "Cross-tenant machine delete must be 404"

    res_ws_b = client.get(f"/api/v1/workspaces/{ws_b}", headers=headers_a)
    assert res_ws_b.status_code == 404, "Cross-tenant workspace get must be 404"

    # 8. Member Login & Scoping Isolation
    login_mem_a = client.post("/api/v1/auth/login", json={
        "email": "mem.alpha@test.com", "password": "+91 91000 00001"
    }).json()
    token_mem_a = login_mem_a["access_token"]
    headers_mem_a = {"Authorization": f"Bearer {token_mem_a}"}

    mem_a_payments = client.get("/api/v1/payments/", headers=headers_mem_a).json()
    assert len(mem_a_payments) == 1
    assert mem_a_payments[0]["id"] == payment_a["id"]
