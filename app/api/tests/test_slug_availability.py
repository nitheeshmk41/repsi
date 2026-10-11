import pytest
from fastapi.testclient import TestClient
from app.main import app
from tests.conftest import TestingSessionLocal
from app.models.user import Workspace
import uuid

client = TestClient(app)

def test_slug_availability():
    # 1. Reserved slug should report as taken
    res = client.get("/api/v1/auth/check-availability?slug=superadmin")
    assert res.status_code == 200
    data = res.json()
    assert data["slug_exists"] is True
    assert "Workspace URL is already taken" in (data.get("slug_message") or "")

    # 2. Random free slug should report as free
    unique_free_slug = f"free-gym-{uuid.uuid4().hex[:8]}"
    res_free = client.get(f"/api/v1/auth/check-availability?slug={unique_free_slug}")
    assert res_free.status_code == 200
    assert res_free.json()["slug_exists"] is False

    # 3. Create a workspace with this slug in TestingSessionLocal, then re-check
    db = TestingSessionLocal()
    try:
        ws = Workspace(
            id=str(uuid.uuid4()),
            name="Test Unique Gym",
            slug=unique_free_slug,
            is_active=True,
        )
        db.add(ws)
        db.commit()

        res_taken = client.get(f"/api/v1/auth/check-availability?slug={unique_free_slug}")
        assert res_taken.status_code == 200
        assert res_taken.json()["slug_exists"] is True

        db.delete(ws)
        db.commit()
    finally:
        db.close()
