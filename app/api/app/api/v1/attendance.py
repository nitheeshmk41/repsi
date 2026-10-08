from datetime import datetime, date, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.middleware.tenant import get_current_tenant, TenantContext
from app.models.user import User
from app.models.member import Member
from app.schemas.attendance import (
    CheckInRequest,
    CheckOutRequest,
    AttendanceResponse,
    AttendanceSummary,
    CurrentlyInsideMember,
    AttendanceQRResponse,
    AttendanceQRGenerateRequest,
    AttendanceQRToggleRequest,
    AttendanceSettingsSchema,
    AttendanceSettingsUpdate,
    AttendanceAnalyticsResponse,
    MemberPersonalAttendanceResponse,
    GymLocationSchema,
)
from app.services.attendance import AttendanceService

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/check-in", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def check_in(
    req: CheckInRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Mark member or trainer check-in with server-side validation.
    Validates membership status, QR token validity, location, and duplicate check-in.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    return svc.check_in(
        user_id=tenant.user_id if tenant.role in ["USER", "MEMBER"] else None,
        member_id=req.member_id,
        trainer_id=req.trainer_id,
        identifier=req.identifier,
        qr_token=req.qr_token,
        gym_location_id=req.gym_location_id,
        method=req.method,
        terminal_id=req.terminal_id,
    )


@router.post("/check-out", response_model=AttendanceResponse)
def check_out(
    req: CheckOutRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Check out member or trainer.
    Calculates duration and stores server timestamp.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    return svc.check_out(
        attendance_id=req.attendance_id,
        member_id=req.member_id,
        user_id=tenant.user_id if tenant.role in ["USER", "MEMBER"] else None,
        checkout_type=req.checkout_type,
    )


@router.post("/scan-qr")
def scan_qr_toggle(
    req: CheckInRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Fast-pass camera scanner endpoint.
    If the member is currently inside, checks them out.
    If outside, checks them in.
    """
    svc = AttendanceService(db, tenant.workspace_id)

    # First check if person has an active inside session
    person = svc._resolve_person(
        identifier=req.identifier or req.qr_token,
        user_id=tenant.user_id if tenant.role in ["USER", "MEMBER"] else None,
        member_id=req.member_id,
        trainer_id=req.trainer_id,
    )

    if person:
        m_id = person["obj"].id if person["type"] == "member" else None
        t_id = person["obj"].id if person["type"] == "trainer" else None
        active = db.query(svc.db.models.Attendance if hasattr(svc.db, "models") else AttendanceService).first()
        from app.models.attendance import Attendance
        active = db.query(Attendance).filter(
            Attendance.workspace_id == tenant.workspace_id,
            (Attendance.member_id == m_id) if m_id else (Attendance.trainer_id == t_id),
            Attendance.check_out_time.is_(None),
        ).first()

        if active:
            # Check out
            rec = svc.check_out(attendance_id=active.id, checkout_type="MANUAL")
            name = person["obj"].first_name if person["type"] == "member" else person["obj"].name
            return {
                "status": "success",
                "action": "check_out",
                "person_name": name,
                "message": f"Goodbye, {name}! Total workout duration: {rec.duration_formatted}.",
                "record": {
                    "id": rec.id,
                    "check_in_time": rec.check_in_time.isoformat(),
                    "check_out_time": rec.check_out_time.isoformat() if rec.check_out_time else None,
                    "duration_formatted": rec.duration_formatted,
                },
            }

    # Not inside -> Perform check in
    rec = svc.check_in(
        user_id=tenant.user_id if tenant.role in ["USER", "MEMBER"] else None,
        member_id=req.member_id,
        trainer_id=req.trainer_id,
        identifier=req.identifier,
        qr_token=req.qr_token,
        gym_location_id=req.gym_location_id,
        method=req.method,
        terminal_id=req.terminal_id,
    )
    return {
        "status": "success",
        "action": "check_in",
        "person_name": rec.person_name,
        "message": f"Welcome, {rec.person_name}! Check-in successful at {rec.check_in_time.strftime('%I:%M %p')}.",
        "record": {
            "id": rec.id,
            "check_in_time": rec.check_in_time.isoformat(),
            "duration_formatted": rec.duration_formatted,
        },
    }


@router.post("/auto-checkout")
def trigger_auto_checkout(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Run the smart auto checkout engine. Checks sessions exceeding max duration or past closing time.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    count = svc.run_smart_auto_checkout()
    return {
        "status": "success",
        "auto_checked_out_sessions": count,
        "message": f"Processed auto-checkout for {count} sessions based on gym closing hours and maximum duration limit.",
    }


@router.get("/summary", response_model=AttendanceSummary)
def get_attendance_summary(
    gym_location_id: Optional[str] = Query(None),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Get live overview metrics for gym owner dashboard.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    return svc.get_owner_summary(gym_location_id=gym_location_id)


@router.get("/currently-inside", response_model=List[CurrentlyInsideMember])
def get_currently_inside(
    gym_location_id: Optional[str] = Query(None),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Get live list of members currently inside the facility.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    return svc.get_currently_inside(gym_location_id=gym_location_id)


@router.get("/history", response_model=List[AttendanceResponse])
def get_attendance_history(
    search: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    status: Optional[str] = Query(None),  # "all", "in", "out", "auto"
    checkout_type: Optional[str] = Query(None),
    gym_location_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Searchable, filterable attendance history logs.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    records = svc.get_attendance_history(
        search=search,
        date_from=date_from,
        date_to=date_to,
        status_filter=status,
        checkout_type=checkout_type,
        gym_location_id=gym_location_id,
        skip=skip,
        limit=limit,
    )
    return records


@router.get("/analytics", response_model=AttendanceAnalyticsResponse)
def get_attendance_analytics(
    days: int = Query(30, ge=7, le=90),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Attendance analytics including peak hours, day of week distribution, and retention risks.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    return svc.get_attendance_analytics(days=days)


# ─── QR CODE MANAGEMENT ───────────────────────────────────────────────

@router.get("/qr", response_model=AttendanceQRResponse)
def get_active_qr_code(
    gym_location_id: Optional[str] = Query(None),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Get the currently active QR code for gym check-in.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    return svc.get_active_qr(gym_location_id=gym_location_id)


@router.post("/qr/generate", response_model=AttendanceQRResponse)
def generate_or_rotate_qr_code(
    req: AttendanceQRGenerateRequest = AttendanceQRGenerateRequest(),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Generate or rotate a secure random QR code. Instantly invalidates previous active QR.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    return svc.generate_or_rotate_qr(
        user_id=tenant.user_id,
        gym_location_id=req.gym_location_id,
        label=req.label or "Main Entrance QR",
        expires_in_hours=req.expires_in_hours,
    )


@router.post("/qr/{qr_id}/toggle", response_model=AttendanceQRResponse)
def toggle_qr_code_status(
    qr_id: str,
    req: AttendanceQRToggleRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Activate or deactivate a specific QR code instantly.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    return svc.toggle_qr_status(qr_id, req.is_active)


# ─── OWNER SETTINGS ───────────────────────────────────────────────────

@router.get("/settings", response_model=AttendanceSettingsSchema)
def get_attendance_settings(
    gym_location_id: Optional[str] = Query(None),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Get gym attendance policy settings (max duration, closing time, auto-checkout).
    """
    svc = AttendanceService(db, tenant.workspace_id)
    return svc.get_or_create_settings(gym_location_id=gym_location_id)


@router.put("/settings", response_model=AttendanceSettingsSchema)
def update_attendance_settings(
    req: AttendanceSettingsUpdate,
    gym_location_id: Optional[str] = Query(None),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Update gym attendance settings.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    return svc.update_settings(req.model_dump(exclude_unset=True), gym_location_id=gym_location_id)


# ─── MEMBER PERSONAL ATTENDANCE ───────────────────────────────────────

@router.get("/member/me", response_model=MemberPersonalAttendanceResponse)
def get_my_personal_attendance(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Get personal attendance stats, streak, calendar visits, and current session for logged in member.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    person = svc._resolve_person(user_id=tenant.user_id)
    if not person or person["type"] != "member":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member profile not linked to your user account.",
        )
    return svc.get_member_personal_stats(person["obj"].id)


@router.get("/member/{member_id}", response_model=MemberPersonalAttendanceResponse)
def get_member_attendance_profile(
    member_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Get personal attendance profile for a specific member (owner or member view).
    """
    svc = AttendanceService(db, tenant.workspace_id)
    return svc.get_member_personal_stats(member_id)


# ─── LOCATIONS ────────────────────────────────────────────────────────

@router.get("/locations", response_model=List[GymLocationSchema])
def get_gym_locations(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Get available branches/locations for this gym.
    """
    svc = AttendanceService(db, tenant.workspace_id)
    return svc.get_locations()


# ─── BACKWARD COMPATIBLE BASE LIST ────────────────────────────────────

@router.get("", response_model=List[AttendanceResponse])
@router.get("/", response_model=List[AttendanceResponse], include_in_schema=False)
@router.get("/check-in", response_model=List[AttendanceResponse], include_in_schema=False)
def list_attendance(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    List attendance for current tenant role (owner sees today's stream, member sees own).
    """
    svc = AttendanceService(db, tenant.workspace_id)
    if tenant.role in ["USER", "MEMBER"]:
        person = svc._resolve_person(user_id=tenant.user_id)
        if person and person["type"] == "member":
            return svc.get_attendance_history(status_filter="all", limit=50)
        return []
    return svc.get_attendance_history(limit=50)
