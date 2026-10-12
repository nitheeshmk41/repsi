from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.attendance import Attendance, AttendanceMethod
from app.models.member import Member, MemberStatus
from app.models.biometric import BiometricDevice, BiometricDeviceStatus
from app.middleware.tenant import get_current_tenant, TenantContext
from app.services.biometric_adapter import BiometricService

router = APIRouter(prefix="/attendance/biometric", tags=["Biometric Hardware"])


class BiometricIngestPayload(BaseModel):
    device_id: str
    workspace_id: str
    member_id: Optional[str] = None
    biometric_hash: Optional[str] = None
    pass_code: Optional[str] = None


class RegisterDeviceRequest(BaseModel):
    device_name: str
    device_model: str = "ZKTeco K40 Network Terminal"
    device_serial: str
    ip_address: Optional[str] = None
    port: int = 4370
    location_name: str = "Main Reception Entrance"


class SyncEventsRequest(BaseModel):
    device_id: str
    events: List[Dict[str, Any]]


# ─── DEVICE MANAGEMENT ENDPOINTS ──────────────────────────────────────

@router.get("/devices")
def list_biometric_devices(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    List registered fingerprint / biometric attendance terminals for active workspace.
    """
    devices = BiometricService.get_workspace_devices(db, tenant.workspace_id)
    return [
        {
            "id": d.id,
            "device_name": d.device_name,
            "device_model": d.device_model,
            "device_serial": d.device_serial,
            "ip_address": d.ip_address,
            "port": d.port,
            "device_token": d.device_token[:8] + "...",
            "location_name": d.location_name,
            "status": d.status,
            "last_seen_at": d.last_seen_at.isoformat() if d.last_seen_at else None,
            "last_sync_at": d.last_sync_at.isoformat() if d.last_sync_at else None,
            "last_event_at": d.last_event_at.isoformat() if d.last_event_at else None,
            "sync_failure_count": d.sync_failure_count,
            "last_error_message": d.last_error_message,
            "is_active": d.is_active,
            "created_at": d.created_at.isoformat() if d.created_at else None,
        }
        for d in devices
    ]


@router.post("/devices", status_code=status.HTTP_201_CREATED)
def register_biometric_device(
    req: RegisterDeviceRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Registers a new physical attendance fingerprint scanner or terminal.
    Initially marked as DISCONNECTED until live hardware ping / handshake is verified.
    """
    if tenant.role not in ["OWNER", "ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Only gym owners or administrators can register biometric terminals.")

    device = BiometricService.register_device(
        db=db,
        workspace_id=tenant.workspace_id,
        name=req.device_name,
        model=req.device_model,
        serial=req.device_serial,
        ip_address=req.ip_address,
        port=req.port,
        location_name=req.location_name,
    )

    return {
        "status": "success",
        "message": f"Biometric device '{device.device_name}' registered. Hardware status is unconfigured until gateway connectivity is established.",
        "device": {
            "id": device.id,
            "device_name": device.device_name,
            "device_model": device.device_model,
            "device_serial": device.device_serial,
            "ip_address": device.ip_address,
            "port": device.port,
            "device_token": device.device_token,
            "location_name": device.location_name,
            "status": device.status,
        },
    }


@router.post("/devices/{device_id}/test")
def test_device_connection(
    device_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Tests live socket / HTTP connectivity to the biometric terminal.
    Explicitly reports hardware status without faking live connections.
    """
    return BiometricService.test_device_connection(db, tenant.workspace_id, device_id)


@router.delete("/devices/{device_id}")
def delete_device(
    device_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Revokes and disables biometric terminal credentials.
    """
    if tenant.role not in ["OWNER", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Only gym owners can revoke hardware terminals.")

    dev = db.query(BiometricDevice).filter(
        BiometricDevice.id == device_id,
        BiometricDevice.workspace_id == tenant.workspace_id,
    ).first()
    if not dev:
        raise HTTPException(status_code=404, detail="Biometric device not found.")

    dev.is_active = False
    dev.status = BiometricDeviceStatus.DISCONNECTED.value
    db.commit()

    return {"status": "success", "message": f"Device '{dev.device_name}' revoked successfully."}


@router.post("/sync-events")
def sync_attendance_events(
    req: SyncEventsRequest,
    x_device_token: Optional[str] = Header(None),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Batch ingestion of fingerprint scans from physical terminal.
    Processes check-in/out and deduplicates events.
    """
    results = []
    for ev in req.events:
        user_id = str(ev.get("user_id") or ev.get("identifier") or ev.get("pin") or "")
        if user_id:
            res = BiometricService.process_biometric_event(
                db=db,
                workspace_id=tenant.workspace_id,
                device_id=req.device_id,
                identifier=user_id,
                event_time=ev.get("timestamp"),
            )
            results.append(res)
    return {
        "status": "success",
        "processed_count": len(results),
        "results": results,
    }


# ─── BACKWARD-COMPATIBLE INGEST ENDPOINT ──────────────────────────────

@router.post("/", status_code=status.HTTP_200_OK)
@router.post("-ingest/", status_code=status.HTTP_200_OK)
def ingest_biometric_hardware_event(
    payload: BiometricIngestPayload,
    x_device_token: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    """
    Biometric Integration Layer Endpoint.
    Receives check-in requests directly from IoT hardware (turnstiles, fingerprint scanners).
    Validates membership status and logs attendance automatically.
    """
    # 1. Hardware device verification & authentication
    if not payload.device_id or not payload.workspace_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid hardware payload. Device ID and Workspace ID required.",
        )

    if not x_device_token or len(x_device_token.strip()) < 8:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized hardware device. Valid X-Device-Token header required.",
        )

    # 2. Member lookup
    member = None
    if payload.member_id:
        member = (
            db.query(Member)
            .filter(
                Member.workspace_id == payload.workspace_id,
                Member.id == payload.member_id,
            )
            .first()
        )
    elif payload.biometric_hash:
        member = (
            db.query(Member)
            .filter(
                Member.workspace_id == payload.workspace_id,
                Member.phone == payload.biometric_hash,
            )
            .first()
        )

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Biometric match failed. Member record not found.",
        )

    # 3. Membership status validation
    if member.status in [MemberStatus.EXPIRED, MemberStatus.CANCELLED]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. Membership is {member.status.value.upper()}.",
        )

    # 4. Record attendance log
    now = datetime.now(timezone.utc)
    attendance = Attendance(
        workspace_id=payload.workspace_id,
        member_id=member.id,
        check_in_time=now,
        method=AttendanceMethod.BIOMETRIC,
    )
    db.add(attendance)
    db.commit()

    return {
        "status": "success",
        "action": "ACCESS_GRANTED",
        "member_name": f"{member.first_name} {member.last_name or ''}".strip(),
        "timestamp": now.isoformat(),
        "device_id": payload.device_id,
    }
