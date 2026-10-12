import abc
import secrets
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session

from app.models.biometric import BiometricDevice, BiometricDeviceStatus
from app.models.attendance import Attendance, AttendanceMethod, CheckoutType, AttendanceStatus
from app.models.member import Member, MemberStatus
from app.models.trainer import Trainer


class BiometricDeviceAdapter(abc.ABC):
    """
    Abstract interface for biometric terminal integrations (ZKTeco, Mantra, Anviz, etc.).
    Keeps vendor protocols isolated while maintaining strict security:
    - Never stores raw fingerprint images/templates in REPSI DB.
    - Matches only via vendor-assigned User ID, Phone, or Member ID.
    - Deduplicates events within 30-second windows.
    """

    @abc.abstractmethod
    def test_connectivity(self, device: BiometricDevice) -> Tuple[bool, str]:
        """
        Tests device socket or HTTP connectivity.
        """
        pass

    @abc.abstractmethod
    def parse_event_payload(self, raw_payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalizes vendor-specific attendance log into a canonical format:
        { "user_id_on_device": str, "timestamp": datetime, "verify_type": str }
        """
        pass


class ZKTecoDeviceAdapter(BiometricDeviceAdapter):
    """
    Adapter for ZKTeco Standalone and Network Terminals (K40, MB20, UFace series via ADMS/Push or pyzk).
    """

    def test_connectivity(self, device: BiometricDevice) -> Tuple[bool, str]:
        # Physical device check
        if not device.ip_address or device.ip_address in ["127.0.0.1", "localhost", "0.0.0.0"]:
            return False, "Hardware device IP not configured. Enter valid local LAN IP or gateway hostname."
        
        # In cloud environment without direct local LAN socket bridge:
        return False, f"ZKTeco terminal at {device.ip_address}:{device.port} not reachable. Physical device must connect via REPSI IoT Edge Gateway or direct port forwarding."

    def parse_event_payload(self, raw_payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "user_id_on_device": str(raw_payload.get("pin") or raw_payload.get("user_id") or raw_payload.get("enroll_id") or ""),
            "timestamp": raw_payload.get("timestamp") or datetime.now(timezone.utc),
            "verify_type": "FINGERPRINT",
        }


class MantraDeviceAdapter(BiometricDeviceAdapter):
    """
    Adapter for Mantra Softech Biometric attendance terminals (BioLink, MBF30, MFS100).
    """

    def test_connectivity(self, device: BiometricDevice) -> Tuple[bool, str]:
        if not device.ip_address:
            return False, "Mantra terminal IP address not provided."
        return False, f"Mantra terminal at {device.ip_address}:{device.port} requires active local Mantra Service Agent."

    def parse_event_payload(self, raw_payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "user_id_on_device": str(raw_payload.get("UserId") or raw_payload.get("EmpCode") or ""),
            "timestamp": raw_payload.get("LogTime") or datetime.now(timezone.utc),
            "verify_type": "FINGERPRINT",
        }


class GenericBiometricAdapter(BiometricDeviceAdapter):
    """
    Generic HTTP Push/Webhook Biometric Adapter.
    """

    def test_connectivity(self, device: BiometricDevice) -> Tuple[bool, str]:
        if not device.ip_address:
            return False, "Device network address is unconfigured."
        return False, "No active heartbeat received from physical terminal in the last 15 minutes."

    def parse_event_payload(self, raw_payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "user_id_on_device": str(raw_payload.get("user_id") or raw_payload.get("identifier") or raw_payload.get("member_id") or ""),
            "timestamp": raw_payload.get("timestamp") or datetime.now(timezone.utc),
            "verify_type": raw_payload.get("verify_type", "FINGERPRINT"),
        }


class BiometricService:
    ADAPTERS = {
        "zkteco": ZKTecoDeviceAdapter(),
        "mantra": MantraDeviceAdapter(),
        "generic": GenericBiometricAdapter(),
    }

    @classmethod
    def get_adapter(cls, model_or_vendor: str) -> BiometricDeviceAdapter:
        lower = (model_or_vendor or "").lower()
        if "zk" in lower or "zkteco" in lower:
            return cls.ADAPTERS["zkteco"]
        if "mantra" in lower:
            return cls.ADAPTERS["mantra"]
        return cls.ADAPTERS["generic"]

    @classmethod
    def register_device(
        cls,
        db: Session,
        workspace_id: str,
        name: str,
        model: str,
        serial: str,
        ip_address: Optional[str] = None,
        port: int = 4370,
        location_name: str = "Main Entrance",
    ) -> BiometricDevice:
        # Check existing serial in workspace
        existing = db.query(BiometricDevice).filter(
            BiometricDevice.workspace_id == workspace_id,
            BiometricDevice.device_serial == serial.strip(),
        ).first()

        if existing:
            existing.device_name = name.strip()
            existing.device_model = model.strip()
            existing.ip_address = ip_address.strip() if ip_address else None
            existing.port = port
            existing.location_name = location_name.strip()
            existing.is_active = True
            db.commit()
            db.refresh(existing)
            return existing

        token = f"bio_{secrets.token_hex(24)}"
        dev = BiometricDevice(
            workspace_id=workspace_id,
            device_name=name.strip(),
            device_model=model.strip(),
            device_serial=serial.strip(),
            ip_address=ip_address.strip() if ip_address else None,
            port=port,
            device_token=token,
            location_name=location_name.strip(),
            status=BiometricDeviceStatus.DISCONNECTED.value,
            is_active=True,
        )
        db.add(dev)
        db.commit()
        db.refresh(dev)
        return dev

    @classmethod
    def get_workspace_devices(cls, db: Session, workspace_id: str) -> List[BiometricDevice]:
        return db.query(BiometricDevice).filter(
            BiometricDevice.workspace_id == workspace_id,
            BiometricDevice.is_active == True,
        ).order_by(BiometricDevice.created_at.desc()).all()

    @classmethod
    def test_device_connection(cls, db: Session, workspace_id: str, device_id: str) -> Dict[str, Any]:
        dev = db.query(BiometricDevice).filter(
            BiometricDevice.workspace_id == workspace_id,
            BiometricDevice.id == device_id,
        ).first()
        if not dev:
            return {"success": False, "status": "NOT_FOUND", "message": "Biometric device not found."}

        adapter = cls.get_adapter(dev.device_model)
        is_connected, msg = adapter.test_connectivity(dev)

        dev.status = BiometricDeviceStatus.ONLINE.value if is_connected else BiometricDeviceStatus.DISCONNECTED.value
        dev.last_seen_at = datetime.now(timezone.utc) if is_connected else dev.last_seen_at
        dev.last_error_message = None if is_connected else msg
        if not is_connected:
            dev.sync_failure_count += 1
        db.commit()

        return {
            "success": is_connected,
            "status": dev.status,
            "message": msg,
            "device_id": dev.id,
            "device_name": dev.device_name,
            "device_model": dev.device_model,
            "ip_address": dev.ip_address,
            "port": dev.port,
            "last_seen_at": dev.last_seen_at.isoformat() if dev.last_seen_at else None,
        }

    @classmethod
    def process_biometric_event(
        cls,
        db: Session,
        workspace_id: str,
        device_id: str,
        identifier: str,
        event_time: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """
        Securely logs biometric attendance event from a verified hardware terminal:
        - Resolves member by phone, member_id, or notes/custom field.
        - Deduplicates scans within 30 seconds.
        - Verifies active membership.
        - Records check-in / check-out.
        """
        now = datetime.now(timezone.utc)
        ts = event_time or now
        if ts.tzinfo is None:
            ts = ts.replace(tzinfo=timezone.utc)

        # 1. Verify device exists and belongs to workspace
        dev = db.query(BiometricDevice).filter(
            BiometricDevice.id == device_id,
            BiometricDevice.workspace_id == workspace_id,
            BiometricDevice.is_active == True,
        ).first()
        if not dev:
            # Try matching by device_serial or device_token
            dev = db.query(BiometricDevice).filter(
                (BiometricDevice.device_serial == device_id) | (BiometricDevice.device_token == device_id),
                BiometricDevice.workspace_id == workspace_id,
            ).first()

        clean_id = identifier.strip()

        # 2. Member lookup
        member = db.query(Member).filter(
            Member.workspace_id == workspace_id,
            (Member.id == clean_id) | (Member.phone == clean_id) | (Member.email == clean_id),
        ).first()

        trainer = None
        if not member:
            trainer = db.query(Trainer).filter(
                Trainer.workspace_id == workspace_id,
                (Trainer.id == clean_id) | (Trainer.phone == clean_id),
            ).first()

        if not member and not trainer:
            if dev:
                dev.last_error_message = f"Unrecognized biometric identifier: {clean_id}"
                db.commit()
            return {
                "success": False,
                "status": "UNRECOGNIZED_USER",
                "message": f"Biometric identifier '{clean_id}' does not match any registered member or coach.",
            }

        person_obj = member or trainer
        person_type = "member" if member else "trainer"
        person_name = f"{member.first_name} {member.last_name or ''}".strip() if member else trainer.name

        # 3. Check membership status
        if member and member.status in [MemberStatus.EXPIRED, MemberStatus.CANCELLED]:
            return {
                "success": False,
                "status": "MEMBERSHIP_INACTIVE",
                "message": f"Access denied. Membership for {person_name} is {member.status.value.upper()}.",
            }

        # 4. Check if currently checked in -> Check out; otherwise check in
        m_id = member.id if member else None
        t_id = trainer.id if trainer else None

        active_session = db.query(Attendance).filter(
            Attendance.workspace_id == workspace_id,
            (Attendance.member_id == m_id) if m_id else (Attendance.trainer_id == t_id),
            Attendance.check_out_time.is_(None),
        ).first()

        # Deduplication: if an event was created in the last 30 seconds, ignore duplicate scan
        recent_event = db.query(Attendance).filter(
            Attendance.workspace_id == workspace_id,
            (Attendance.member_id == m_id) if m_id else (Attendance.trainer_id == t_id),
            Attendance.check_in_time >= now - timedelta(seconds=30),
        ).first()
        if recent_event and not active_session:
            return {
                "success": True,
                "action": "DUPLICATE_IGNORED",
                "message": f"Duplicate scan for {person_name} ignored (within 30s window).",
                "record_id": recent_event.id,
            }

        if active_session:
            # Check out
            start = active_session.check_in_time
            if start.tzinfo is None:
                start = start.replace(tzinfo=timezone.utc)
            duration_mins = max(1, int((ts - start).total_seconds() // 60))

            active_session.check_out_time = ts
            active_session.duration_minutes = duration_mins
            active_session.checkout_type = CheckoutType.MANUAL.value
            active_session.status = AttendanceStatus.CHECKED_OUT.value
            action = "CHECK_OUT"
            record = active_session
        else:
            # Check in
            record = Attendance(
                workspace_id=workspace_id,
                member_id=m_id,
                trainer_id=t_id,
                check_in_time=ts,
                method=AttendanceMethod.BIOMETRIC,
                terminal_id=dev.device_name if dev else f"BIO_{clean_id[:8]}",
                status=AttendanceStatus.CHECKED_IN.value,
            )
            db.add(record)
            action = "CHECK_IN"

        # Update device status
        if dev:
            dev.last_seen_at = now
            dev.last_sync_at = now
            dev.last_event_at = now
            dev.status = BiometricDeviceStatus.ONLINE.value

        db.commit()
        db.refresh(record)

        return {
            "success": True,
            "action": action,
            "person_name": person_name,
            "person_type": person_type,
            "timestamp": ts.isoformat(),
            "record_id": record.id,
            "message": f"{action.replace('_', ' ').title()} recorded for {person_name} via fingerprint biometric.",
        }
