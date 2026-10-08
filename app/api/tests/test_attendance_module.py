import uuid
from datetime import datetime, date, timedelta, timezone
from fastapi.testclient import TestClient
from app.main import app
from app.models.attendance import Attendance, CheckoutType, AttendanceStatus
from tests.conftest import TestingSessionLocal

client = TestClient(app)


def test_full_attendance_lifecycle():
    uid = uuid.uuid4().hex[:6]
    owner_email = f"attowner_{uid}@repsi.com"

    # 1. Register Owner and Gym Workspace
    reg_resp = client.post("/api/v1/auth/register", json={
        "full_name": "Attendance Owner",
        "email": owner_email,
        "password": "Password123!",
        "gym_name": f"Repsi Gym {uid}",
        "gym_phone": "+91 98888 77777",
        "gym_city": "Bengaluru",
    })
    assert reg_resp.status_code == 201
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Add an active member
    mem_resp = client.post("/api/v1/members", json={
        "first_name": "Nitheesh",
        "last_name": "Kumar",
        "phone": f"+91 98111 {uid[:5]}",
        "email": f"nitheesh_{uid}@repsi.com",
    }, headers=headers)
    assert mem_resp.status_code == 201
    member = mem_resp.json()
    member_id = member["id"]

    # 3. Add a suspended member
    susp_resp = client.post("/api/v1/members", json={
        "first_name": "Suspended",
        "last_name": "User",
        "phone": f"+91 98222 {uid[:5]}",
        "email": f"suspended_{uid}@repsi.com",
    }, headers=headers)
    assert susp_resp.status_code == 201
    suspended_id = susp_resp.json()["id"]

    # Manually mark as suspended in DB
    db = TestingSessionLocal()
    from app.models.member import Member, MemberStatus
    db.query(Member).filter(Member.id == suspended_id).update({"status": MemberStatus.SUSPENDED})
    db.commit()
    db.close()

    # 4. Generate & Rotate QR Code
    qr_res = client.get("/api/v1/attendance/qr", headers=headers)
    assert qr_res.status_code == 200
    qr1 = qr_res.json()
    assert qr1["is_active"] is True
    assert "token" in qr1
    active_token = qr1["token"]

    # Rotate QR
    rotate_res = client.post("/api/v1/attendance/qr/generate", headers=headers, json={"label": "Reception Main QR"})
    assert rotate_res.status_code == 200
    qr2 = rotate_res.json()
    assert qr2["is_active"] is True
    assert qr2["token"] != active_token
    new_token = qr2["token"]

    # 5. Check in with old rotated token -> Rejected 400
    old_qr_checkin = client.post("/api/v1/attendance/check-in", headers=headers, json={
        "member_id": member_id,
        "qr_token": active_token,
    })
    assert old_qr_checkin.status_code == 400
    assert "deactivated" in old_qr_checkin.json()["detail"].lower() or "invalid" in old_qr_checkin.json()["detail"].lower()

    # 6. Check in suspended member -> Blocked 403
    susp_checkin = client.post("/api/v1/attendance/check-in", headers=headers, json={
        "member_id": suspended_id,
        "qr_token": new_token,
    })
    assert susp_checkin.status_code == 403
    assert "suspended" in susp_checkin.json()["detail"].lower()

    # 7. Check in active member with valid new token -> Success 201
    checkin_res = client.post("/api/v1/attendance/check-in", headers=headers, json={
        "member_id": member_id,
        "qr_token": new_token,
    })
    assert checkin_res.status_code == 201
    att_record = checkin_res.json()
    assert att_record["member_id"] == member_id
    assert att_record["attendance_status"] == "in"
    att_id = att_record["id"]

    # 8. Duplicate check-in while already inside -> 400
    dup_res = client.post("/api/v1/attendance/check-in", headers=headers, json={
        "member_id": member_id,
        "qr_token": new_token,
    })
    assert dup_res.status_code == 400
    assert "already checked in" in dup_res.json()["detail"].lower()

    # 9. Verify Live "Currently Inside"
    inside_res = client.get("/api/v1/attendance/currently-inside", headers=headers)
    assert inside_res.status_code == 200
    inside_list = inside_res.json()
    assert any(m["member_id"] == member_id for m in inside_list)

    # 10. Manual Check-Out
    checkout_res = client.post("/api/v1/attendance/check-out", headers=headers, json={
        "attendance_id": att_id,
        "checkout_type": "MANUAL",
    })
    assert checkout_res.status_code == 200
    checked_out_record = checkout_res.json()
    assert checked_out_record["check_out_time"] is not None
    assert checked_out_record["attendance_status"] == "out"


def test_smart_auto_checkout_engine():
    uid = uuid.uuid4().hex[:6]
    owner_email = f"autoowner_{uid}@repsi.com"

    reg_resp = client.post("/api/v1/auth/register", json={
        "full_name": "Auto Owner",
        "email": owner_email,
        "password": "Password123!",
        "gym_name": f"Auto Gym {uid}",
        "gym_phone": "+91 98888 66666",
        "gym_city": "Chennai",
    })
    assert reg_resp.status_code == 201
    token = reg_resp.json()["access_token"]
    ws_id = reg_resp.json()["workspace_id"]
    headers = {"Authorization": f"Bearer {token}"}

    mem_resp = client.post("/api/v1/members", json={
        "first_name": "Praveen",
        "last_name": "Kumar",
        "phone": f"+91 97777 {uid[:5]}",
        "email": f"praveen_{uid}@repsi.com",
    }, headers=headers)
    assert mem_resp.status_code == 201
    member_id = mem_resp.json()["id"]

    # Create session from 5 hours ago in DB
    db = TestingSessionLocal()
    five_hours_ago = datetime.now(timezone.utc) - timedelta(hours=5)
    stale_session = Attendance(
        workspace_id=ws_id,
        member_id=member_id,
        check_in_time=five_hours_ago,
        status=AttendanceStatus.CHECKED_IN.value,
        checkout_type=CheckoutType.MANUAL.value,
    )
    db.add(stale_session)
    db.commit()
    stale_id = stale_session.id
    db.close()

    # Trigger auto checkout
    auto_res = client.post("/api/v1/attendance/auto-checkout", headers=headers)
    assert auto_res.status_code == 200
    assert auto_res.json()["auto_checked_out_sessions"] >= 1

    # Verify session is auto-checked-out
    db = TestingSessionLocal()
    rec = db.query(Attendance).filter(Attendance.id == stale_id).first()
    assert rec.check_out_time is not None
    assert rec.checkout_type == CheckoutType.AUTO.value
    assert rec.status == AttendanceStatus.AUTO_CHECKED_OUT.value
    assert rec.duration_minutes >= 240
    db.close()


def test_settings_analytics_and_personal_stats():
    uid = uuid.uuid4().hex[:6]
    owner_email = f"statowner_{uid}@repsi.com"

    reg_resp = client.post("/api/v1/auth/register", json={
        "full_name": "Stats Owner",
        "email": owner_email,
        "password": "Password123!",
        "gym_name": f"Stats Gym {uid}",
        "gym_phone": "+91 96666 55555",
        "gym_city": "Mumbai",
    })
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Settings: Get and update
    res_get_settings = client.get("/api/v1/attendance/settings", headers=headers)
    assert res_get_settings.status_code == 200
    assert res_get_settings.json()["max_session_duration_minutes"] == 240

    res_put_settings = client.put("/api/v1/attendance/settings", headers=headers, json={
        "max_session_duration_minutes": 180,
        "gym_closing_time": "21:30",
    })
    assert res_put_settings.status_code == 200
    assert res_put_settings.json()["max_session_duration_minutes"] == 180
    assert res_put_settings.json()["gym_closing_time"] == "21:30"

    # Analytics
    res_analytics = client.get("/api/v1/attendance/analytics?days=14", headers=headers)
    assert res_analytics.status_code == 200
    analytics = res_analytics.json()
    assert "daily_trends" in analytics
    assert "hourly_distribution" in analytics
    assert "day_of_week_distribution" in analytics
    assert "average_duration_minutes" in analytics

    # Summary
    res_summary = client.get("/api/v1/attendance/summary", headers=headers)
    assert res_summary.status_code == 200
    summary = res_summary.json()
    assert "today_total" in summary
    assert "currently_inside" in summary
    assert "peak_hour" in summary

    # Locations
    res_locs = client.get("/api/v1/attendance/locations", headers=headers)
    assert res_locs.status_code == 200
    locs = res_locs.json()
    assert len(locs) >= 1
    assert "name" in locs[0]


def test_gym_closing_time_smart_checkout():
    uid = uuid.uuid4().hex[:6]
    owner_email = f"closingowner_{uid}@repsi.com"

    reg_resp = client.post("/api/v1/auth/register", json={
        "full_name": "Closing Owner",
        "email": owner_email,
        "password": "Password123!",
        "gym_name": f"Closing Gym {uid}",
        "gym_phone": "+91 95555 44444",
        "gym_city": "Kochi",
    })
    token = reg_resp.json()["access_token"]
    ws_id = reg_resp.json()["workspace_id"]
    headers = {"Authorization": f"Bearer {token}"}

    # Set closing time to 22:00 (10 PM) and max duration to 4 hours (240 min)
    client.put("/api/v1/attendance/settings", headers=headers, json={
        "max_session_duration_minutes": 240,
        "gym_closing_time": "22:00",
    })

    mem_resp = client.post("/api/v1/members", json={
        "first_name": "Siva",
        "last_name": "P",
        "phone": f"+91 94444 {uid[:5]}",
        "email": f"siva_{uid}@repsi.com",
    }, headers=headers)
    member_id = mem_resp.json()["id"]

    # Member checked in at 20:00 (8 PM) on a past date.
    # Max duration 4 hours would be 24:00 (12 AM).
    # But closing time is 22:00 (10 PM), so member MUST be checked out at 22:00 (duration = 2 hours = 120 mins).
    past_date = date.today() - timedelta(days=1)
    checkin_time = datetime(past_date.year, past_date.month, past_date.day, 20, 0, 0, tzinfo=timezone.utc)

    db = TestingSessionLocal()
    session = Attendance(
        workspace_id=ws_id,
        member_id=member_id,
        check_in_time=checkin_time,
        status=AttendanceStatus.CHECKED_IN.value,
        checkout_type=CheckoutType.MANUAL.value,
    )
    db.add(session)
    db.commit()
    s_id = session.id
    db.close()

    # Trigger auto checkout
    client.post("/api/v1/attendance/auto-checkout", headers=headers)

    db = TestingSessionLocal()
    rec = db.query(Attendance).filter(Attendance.id == s_id).first()
    assert rec.check_out_time is not None
    assert rec.checkout_type == CheckoutType.AUTO.value
    assert rec.status == AttendanceStatus.AUTO_CHECKED_OUT.value
    # Verified: Checked out at 22:00 (10 PM) -> 120 minutes, NOT 240 minutes!
    assert rec.duration_minutes == 120
    assert rec.check_out_time.hour == 22
    db.close()

    # Personal member stats
    res_personal = client.get(f"/api/v1/attendance/member/{member_id}", headers=headers)
    assert res_personal.status_code == 200
    personal_data = res_personal.json()
    assert personal_data["total_visits"] >= 1
    assert "calendar_attendance_dates" in personal_data

