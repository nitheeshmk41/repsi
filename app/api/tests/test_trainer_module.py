from datetime import date
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token, get_password_hash
from app.models.user import User, Workspace, WorkspaceMember, UserRole
from app.models.trainer import Trainer, TrainerStatus, TrainerClient, TrainerClientStatus, TrainingSession, SessionStatus
from app.models.member import Member, MemberStatus
from app.models.workout import Workout, WorkoutStatus
from app.core.database import Base
from tests.conftest import TestingSessionLocal, test_engine

client = TestClient(app)


@pytest.fixture
def test_setup():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()

    # Workspace A & Owner A
    ws_a = Workspace(name="Gym Alpha", slug="gym-alpha", is_active=True)
    db.add(ws_a)
    db.flush()

    user_owner_a = User(
        email="owner_a@alpha.com",
        full_name="Owner Alpha",
        hashed_password=get_password_hash("pass123"),
        is_active=True
    )
    db.add(user_owner_a)
    db.flush()

    db.add(WorkspaceMember(workspace_id=ws_a.id, user_id=user_owner_a.id, role=UserRole.OWNER, is_active=True))

    # Trainer A
    user_trainer_a = User(
        email="trainer_a@alpha.com",
        full_name="Trainer Alex",
        hashed_password=get_password_hash("pass123"),
        phone="+91 99999 11111",
        is_active=True
    )
    db.add(user_trainer_a)
    db.flush()
    db.add(WorkspaceMember(workspace_id=ws_a.id, user_id=user_trainer_a.id, role=UserRole.TRAINER, is_active=True))

    trainer_a = Trainer(
        workspace_id=ws_a.id,
        user_id=user_trainer_a.id,
        name="Trainer Alex",
        email="trainer_a@alpha.com",
        phone="+91 99999 11111",
        specialization="Strength & HIIT",
        status=TrainerStatus.ACTIVE,
        is_active=True
    )
    db.add(trainer_a)
    db.flush()

    # Member A
    member_a = Member(
        workspace_id=ws_a.id,
        first_name="Rahul",
        last_name="Kumar",
        email="rahul@alpha.com",
        phone="+91 88888 22222",
        status=MemberStatus.ACTIVE,
        joined_date=date(2026, 1, 1)
    )
    db.add(member_a)

    # Workspace B & Trainer B & Member B
    ws_b = Workspace(name="Gym Beta", slug="gym-beta", is_active=True)
    db.add(ws_b)
    db.flush()

    user_trainer_b = User(
        email="trainer_b@beta.com",
        full_name="Trainer Bob",
        hashed_password=get_password_hash("pass123"),
        phone="+91 77777 33333",
        is_active=True
    )
    db.add(user_trainer_b)
    db.flush()
    db.add(WorkspaceMember(workspace_id=ws_b.id, user_id=user_trainer_b.id, role=UserRole.TRAINER, is_active=True))

    trainer_b = Trainer(
        workspace_id=ws_b.id,
        user_id=user_trainer_b.id,
        name="Trainer Bob",
        email="trainer_b@beta.com",
        phone="+91 77777 33333",
        specialization="Yoga",
        status=TrainerStatus.ACTIVE,
        is_active=True
    )
    db.add(trainer_b)
    db.flush()

    member_b = Member(
        workspace_id=ws_b.id,
        first_name="Priya",
        last_name="Sharma",
        email="priya@beta.com",
        phone="+91 66666 44444",
        status=MemberStatus.ACTIVE,
        joined_date=date(2026, 1, 1)
    )
    db.add(member_b)

    db.commit()


    token_owner_a = create_access_token(subject=user_owner_a.id, workspace_id=ws_a.id, role="OWNER")
    token_trainer_a = create_access_token(subject=user_trainer_a.id, workspace_id=ws_a.id, role="TRAINER")
    token_trainer_b = create_access_token(subject=user_trainer_b.id, workspace_id=ws_b.id, role="TRAINER")

    yield {
        "ws_a_id": ws_a.id,
        "ws_b_id": ws_b.id,
        "trainer_a_id": trainer_a.id,
        "trainer_b_id": trainer_b.id,
        "member_a_id": member_a.id,
        "member_b_id": member_b.id,
        "token_owner_a": token_owner_a,
        "token_trainer_a": token_trainer_a,
        "token_trainer_b": token_trainer_b,
    }
    db.close()


def test_owner_trainer_management(test_setup):
    headers = {"Authorization": f"Bearer {test_setup['token_owner_a']}"}

    # 1. Get trainers list
    res = client.get("/api/v1/trainers", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Trainer Alex"

    # 2. Add new trainer
    new_trainer_payload = {
        "name": "Sarah Connor",
        "email": "sarah@alpha.com",
        "phone": "+91 99999 55555",
        "specialization": "CrossFit"
    }
    res = client.post("/api/v1/trainers", json=new_trainer_payload, headers=headers)
    assert res.status_code == 201
    created = res.json()
    assert created["name"] == "Sarah Connor"


def test_client_assignment_flow(test_setup):
    headers_owner = {"Authorization": f"Bearer {test_setup['token_owner_a']}"}
    headers_trainer = {"Authorization": f"Bearer {test_setup['token_trainer_a']}"}

    # 1. Owner assigns Member A to Trainer A
    assign_payload = {
        "trainer_id": test_setup["trainer_a_id"],
        "client_id": test_setup["member_a_id"],
        "notes": "Goal: Weight Loss"
    }
    res = client.post("/api/v1/trainer-client/assign", json=assign_payload, headers=headers_owner)
    assert res.status_code == 200
    assigned = res.json()
    assert assigned["status"] == "ACTIVE"

    # 2. Trainer A fetches assigned clients
    res = client.get("/api/v1/trainers/me/clients", headers=headers_trainer)
    assert res.status_code == 200
    clients = res.json()
    assert len(clients) == 1
    assert clients[0]["name"] == "Rahul Kumar"

    # 3. Client checks assigned trainers
    res = client.get(f"/api/v1/clients/{test_setup['member_a_id']}/trainers", headers=headers_owner)
    assert res.status_code == 200
    trainers = res.json()
    assert len(trainers) == 1
    assert trainers[0]["name"] == "Trainer Alex"


def test_tenant_isolation(test_setup):
    headers_trainer_a = {"Authorization": f"Bearer {test_setup['token_trainer_a']}"}

    # Trainer A trying to access Gym B's Member B workouts -> should be forbidden / not found
    res = client.get(f"/api/v1/trainer/clients/{test_setup['member_b_id']}/workouts", headers=headers_trainer_a)
    assert res.status_code in [403, 404]

    # Trainer A trying to assign Gym B's Member B -> should be rejected
    res = client.post("/api/v1/trainer-client/assign", json={
        "trainer_id": test_setup["trainer_a_id"],
        "client_id": test_setup["member_b_id"]
    }, headers=headers_trainer_a)
    assert res.status_code in [403, 404]


def test_workout_management_flow(test_setup):
    headers_owner = {"Authorization": f"Bearer {test_setup['token_owner_a']}"}
    headers_trainer = {"Authorization": f"Bearer {test_setup['token_trainer_a']}"}

    # Assign client
    client.post("/api/v1/trainer-client/assign", json={
        "trainer_id": test_setup["trainer_a_id"],
        "client_id": test_setup["member_a_id"]
    }, headers=headers_owner)

    # 1. Trainer creates workout for Member A
    workout_payload = {
        "title": "Hypertrophy Push Day",
        "difficulty": "Intermediate",
        "target_muscle_groups": "Chest, Triceps",
        "description": "4 sets bench press, 3 sets incline dumbbell press",
        "exercises_json": '[{"name":"Bench Press","sets":4,"reps":10,"weight":60}]'
    }
    res = client.post(f"/api/v1/trainer/clients/{test_setup['member_a_id']}/workouts", json=workout_payload, headers=headers_trainer)
    assert res.status_code == 201
    workout = res.json()
    assert workout["title"] == "Hypertrophy Push Day"
    workout_id = workout["id"]

    # 2. Complete workout
    res = client.post(f"/api/v1/workouts/{workout_id}/complete?completion_percentage=95.0", headers=headers_trainer)
    assert res.status_code == 200
    completed = res.json()
    assert completed["status"] == "COMPLETED"
    assert completed["completion_percentage"] == 95.0

    # 3. Add trainer feedback
    res = client.patch(f"/api/v1/workouts/{workout_id}", json={"trainer_feedback": "Great effort! Increased weight next session."}, headers=headers_trainer)
    assert res.status_code == 200
    assert res.json()["trainer_feedback"] == "Great effort! Increased weight next session."


def test_sessions_and_notes(test_setup):
    headers_owner = {"Authorization": f"Bearer {test_setup['token_owner_a']}"}
    headers_trainer = {"Authorization": f"Bearer {test_setup['token_trainer_a']}"}

    # Assign client
    client.post("/api/v1/trainer-client/assign", json={
        "trainer_id": test_setup["trainer_a_id"],
        "client_id": test_setup["member_a_id"]
    }, headers=headers_owner)

    # 1. Schedule Session
    session_payload = {
        "title": "1-on-1 Personal Training",
        "client_id": test_setup["member_a_id"],
        "scheduled_at": "2026-09-30T10:00:00Z",
        "duration_minutes": 60,
        "notes": "Focus on squat form"
    }
    res = client.post("/api/v1/trainer/sessions", json=session_payload, headers=headers_trainer)
    assert res.status_code == 201
    session_data = res.json()
    assert session_data["title"] == "1-on-1 Personal Training"
    session_id = session_data["id"]

    # 2. Update Session status to COMPLETED
    res = client.patch(f"/api/v1/trainer/sessions/{session_id}", json={"status": "COMPLETED"}, headers=headers_trainer)
    assert res.status_code == 200
    assert res.json()["status"] == "COMPLETED"

    # 3. Add Private Note for Client
    note_payload = {"content": "Client reported minor wrist discomfort during bench press."}
    res = client.post(f"/api/v1/trainer/clients/{test_setup['member_a_id']}/notes", json=note_payload, headers=headers_trainer)
    assert res.status_code == 201
    assert res.json()["content"] == note_payload["content"]


def test_trainer_deactivation_security(test_setup):
    headers_owner = {"Authorization": f"Bearer {test_setup['token_owner_a']}"}
    headers_trainer = {"Authorization": f"Bearer {test_setup['token_trainer_a']}"}

    # 1. Soft-delete / deactivate Trainer A by Owner A
    res = client.delete(f"/api/v1/trainers/{test_setup['trainer_a_id']}", headers=headers_owner)
    assert res.status_code == 200

    # 2. Deactivated Trainer A attempting operations is denied
    res = client.get("/api/v1/trainers/me/clients", headers=headers_trainer)
    assert res.status_code == 403
