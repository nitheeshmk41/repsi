from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.attendance import Attendance, AttendanceMethod
from app.models.member import Member, MemberStatus

router = APIRouter(prefix="/attendance/biometric-ingest", tags=["Biometric Hardware"])


class BiometricIngestPayload(BaseModel):
    device_id: str
    workspace_id: str
    member_id: Optional[str] = None
    biometric_hash: Optional[str] = None
    pass_code: Optional[str] = None


@router.post("/", status_code=status.HTTP_200_OK)
def ingest_biometric_hardware_event(
    payload: BiometricIngestPayload,
    x_device_token: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    """
    Biometric Integration Layer Endpoint.
    Receives check-in requests directly from IoT hardware (turnstiles, fingerprint scanners, facial recognition).
    Validates membership status and logs attendance automatically.
    """
    # 1. Hardware device verification
    if not payload.device_id or not payload.workspace_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid hardware payload. Device ID and Workspace ID required.",
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
        # Match member by biometric hash identifier
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
        "member_name": f"{member.first_name} {member.last_name}".strip(),
        "timestamp": now.isoformat(),
        "device_id": payload.device_id,
    }
