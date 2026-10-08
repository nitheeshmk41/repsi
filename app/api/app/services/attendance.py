import secrets
from datetime import datetime, date, time, timedelta, timezone
from typing import Optional, List, Dict, Any
from urllib.parse import urlparse, parse_qs
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func, desc
from app.models.attendance import (
    Attendance,
    AttendanceMethod,
    AttendanceQR,
    AttendanceSettings,
    GymLocation,
    CheckoutType,
    AttendanceStatus,
)
from app.models.member import Member, MemberStatus, Membership
from app.models.trainer import Trainer, TrainerStatus
from app.models.user import User, Workspace
from app.schemas.attendance import (
    AttendanceResponse,
    AttendanceSummary,
    CurrentlyInsideMember,
    AttendanceQRResponse,
    AttendanceSettingsSchema,
    AttendanceAnalyticsResponse,
    MemberPersonalAttendanceResponse,
    GymLocationSchema,
)


def _to_utc(dt: Optional[datetime]) -> Optional[datetime]:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


class AttendanceService:
    def __init__(self, db: Session, workspace_id: str):
        self.db = db
        self.workspace_id = workspace_id

    # ─── SETTINGS ─────────────────────────────────────────────────────────

    def get_or_create_settings(self, gym_location_id: Optional[str] = None) -> AttendanceSettings:
        query = self.db.query(AttendanceSettings).filter(
            AttendanceSettings.workspace_id == self.workspace_id
        )
        if gym_location_id:
            query = query.filter(AttendanceSettings.gym_location_id == gym_location_id)
        settings = query.first()

        if not settings:
            settings = AttendanceSettings(
                workspace_id=self.workspace_id,
                gym_location_id=gym_location_id,
                max_session_duration_minutes=240,  # 4 hours
                gym_closing_time="22:00",
                auto_checkout_enabled=True,
                qr_rotation_interval_minutes=0,
                allow_member_manual_checkout=True,
                allow_staff_manual_checkout=True,
            )
            self.db.add(settings)
            self.db.commit()
            self.db.refresh(settings)
        return settings

    def update_settings(self, data: dict, gym_location_id: Optional[str] = None) -> AttendanceSettings:
        settings = self.get_or_create_settings(gym_location_id)
        for key, val in data.items():
            if val is not None and hasattr(settings, key):
                setattr(settings, key, val)
        self.db.commit()
        self.db.refresh(settings)
        return settings

    # ─── QR MANAGEMENT ───────────────────────────────────────────────────

    def _format_qr_payload(self, qr: AttendanceQR) -> str:
        # Secure URL/URI format with gym_id, token, and optional location
        loc = qr.gym_location_id or "main"
        return f"repsi://gym/checkin?gym_id={self.workspace_id}&token={qr.token}&location_id={loc}"

    def get_active_qr(self, gym_location_id: Optional[str] = None) -> AttendanceQRResponse:
        query = self.db.query(AttendanceQR).filter(
            AttendanceQR.workspace_id == self.workspace_id,
            AttendanceQR.is_active == True,
        )
        if gym_location_id:
            query = query.filter(AttendanceQR.gym_location_id == gym_location_id)
        qr = query.order_by(AttendanceQR.created_at.desc()).first()

        if not qr:
            # Generate default QR if none exists
            qr = self.generate_or_rotate_qr(gym_location_id=gym_location_id, label="Main Reception QR")
            return qr

        return AttendanceQRResponse(
            id=qr.id,
            workspace_id=qr.workspace_id,
            gym_location_id=qr.gym_location_id,
            token=qr.token,
            payload=self._format_qr_payload(qr),
            label=qr.label,
            is_active=qr.is_active,
            expires_at=qr.expires_at,
            rotated_at=qr.rotated_at,
            created_at=qr.created_at,
            created_by=qr.created_by,
        )

    def generate_or_rotate_qr(
        self,
        user_id: Optional[str] = None,
        gym_location_id: Optional[str] = None,
        label: str = "Main Reception QR",
        expires_in_hours: Optional[int] = None,
    ) -> AttendanceQRResponse:
        now = datetime.now(timezone.utc)

        # Deactivate old active QR codes for this gym/location
        old_qrs = self.db.query(AttendanceQR).filter(
            AttendanceQR.workspace_id == self.workspace_id,
            AttendanceQR.is_active == True,
            (AttendanceQR.gym_location_id == gym_location_id) if gym_location_id else True,
        ).all()
        for old in old_qrs:
            old.is_active = False
            old.rotated_at = now

        # Generate secure random token
        raw_token = f"rep_{secrets.token_urlsafe(32)}"
        expires_at = now + timedelta(hours=expires_in_hours) if expires_in_hours else None

        new_qr = AttendanceQR(
            workspace_id=self.workspace_id,
            gym_location_id=gym_location_id,
            token=raw_token,
            label=label,
            is_active=True,
            expires_at=expires_at,
            created_by=user_id,
        )
        self.db.add(new_qr)
        self.db.commit()
        self.db.refresh(new_qr)

        return AttendanceQRResponse(
            id=new_qr.id,
            workspace_id=new_qr.workspace_id,
            gym_location_id=new_qr.gym_location_id,
            token=new_qr.token,
            payload=self._format_qr_payload(new_qr),
            label=new_qr.label,
            is_active=new_qr.is_active,
            expires_at=new_qr.expires_at,
            rotated_at=new_qr.rotated_at,
            created_at=new_qr.created_at,
            created_by=new_qr.created_by,
        )

    def toggle_qr_status(self, qr_id: str, is_active: bool) -> AttendanceQRResponse:
        qr = self.db.query(AttendanceQR).filter(
            AttendanceQR.id == qr_id,
            AttendanceQR.workspace_id == self.workspace_id,
        ).first()
        if not qr:
            raise HTTPException(status_code=404, detail="QR code not found")

        qr.is_active = is_active
        self.db.commit()
        self.db.refresh(qr)

        return AttendanceQRResponse(
            id=qr.id,
            workspace_id=qr.workspace_id,
            gym_location_id=qr.gym_location_id,
            token=qr.token,
            payload=self._format_qr_payload(qr),
            label=qr.label,
            is_active=qr.is_active,
            expires_at=qr.expires_at,
            rotated_at=qr.rotated_at,
            created_at=qr.created_at,
            created_by=qr.created_by,
        )

    def validate_qr_token(self, token_or_payload: str) -> AttendanceQR:
        clean = token_or_payload.strip()
        token = clean

        # Parse URI payload if formatted like repsi://gym/checkin?...
        if clean.startswith("repsi://gym/checkin") or "?" in clean:
            try:
                parsed = urlparse(clean)
                qs = parse_qs(parsed.query)
                if "token" in qs:
                    token = qs["token"][0]
                if "gym_id" in qs:
                    payload_ws = qs["gym_id"][0]
                    if payload_ws != self.workspace_id:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="QR code belongs to a different gym location or workspace.",
                        )
            except Exception:
                pass

        qr = self.db.query(AttendanceQR).filter(
            AttendanceQR.token == token,
            AttendanceQR.workspace_id == self.workspace_id,
        ).first()

        if not qr:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or unrecognized gym QR code.",
            )

        if not qr.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This QR code has been deactivated or replaced by the gym owner.",
            )

        now = datetime.now(timezone.utc)
        if qr.expires_at and qr.expires_at < now:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This QR code has expired. Please ask the front desk for an updated QR.",
            )

        return qr

    # ─── SMART AUTO-CHECKOUT ──────────────────────────────────────────────

    def run_smart_auto_checkout(self) -> int:
        """
        Smart Auto Checkout:
        1. Checks maximum session duration (e.g. 4 hours).
        2. Checks gym closing time (e.g. 10:00 PM).
        Applies earlier applicable limit: whichever comes first.
        Preserves attendance record with checkout_type = 'AUTO'.
        """
        now = datetime.now(timezone.utc)
        settings = self.get_or_create_settings()
        if not settings.auto_checkout_enabled:
            return 0

        max_minutes = settings.max_session_duration_minutes or 240
        closing_str = settings.gym_closing_time or "22:00"
        try:
            closing_hour, closing_minute = [int(p) for p in closing_str.split(":")]
        except Exception:
            closing_hour, closing_minute = 22, 0

        # Query all active sessions in this workspace
        active_sessions = self.db.query(Attendance).filter(
            Attendance.workspace_id == self.workspace_id,
            Attendance.check_out_time.is_(None),
        ).all()

        auto_closed_count = 0

        for session in active_sessions:
            check_in = session.check_in_time
            if not check_in:
                continue

            # Ensure check_in is timezone-aware
            if check_in.tzinfo is None:
                check_in = check_in.replace(tzinfo=timezone.utc)

            # Limit A: Check-in + max duration
            limit_max_duration = check_in + timedelta(minutes=max_minutes)

            # Limit B: Gym closing time on check-in day
            closing_dt = datetime(
                year=check_in.year,
                month=check_in.month,
                day=check_in.day,
                hour=closing_hour,
                minute=closing_minute,
                second=0,
                tzinfo=timezone.utc,
            )

            # If check-in happened after or at closing time, allow until closing next day or limit A
            if check_in >= closing_dt:
                closing_dt += timedelta(days=1)

            # Applicable limit is the earlier of the two
            applicable_limit = min(limit_max_duration, closing_dt)

            # If current time is past applicable limit, perform auto checkout
            if now >= applicable_limit:
                checkout_time = applicable_limit
                duration_mins = max(1, int((checkout_time - check_in).total_seconds() // 60))

                session.check_out_time = checkout_time
                session.duration_minutes = duration_mins
                session.checkout_type = CheckoutType.AUTO.value
                session.status = AttendanceStatus.AUTO_CHECKED_OUT.value
                session.notes = f"Smart auto-checkout (limit: {duration_mins}m)"
                auto_closed_count += 1

        if auto_closed_count > 0:
            self.db.commit()

        return auto_closed_count

    # ─── RESOLVE & VALIDATE PERSON ────────────────────────────────────────

    def _resolve_person(self, identifier: Optional[str] = None, user_id: Optional[str] = None, member_id: Optional[str] = None, trainer_id: Optional[str] = None) -> Optional[dict]:
        # 1. Direct member_id or trainer_id
        if member_id:
            m = self.db.query(Member).filter(Member.id == member_id, Member.workspace_id == self.workspace_id).first()
            if m:
                return {"type": "member", "obj": m}
        if trainer_id:
            t = self.db.query(Trainer).filter(Trainer.id == trainer_id, Trainer.workspace_id == self.workspace_id).first()
            if t:
                return {"type": "trainer", "obj": t}

        # 2. Authenticated user_id mapping
        if user_id:
            user = self.db.query(User).filter(User.id == user_id).first()
            if user:
                m = self.db.query(Member).filter(
                    Member.workspace_id == self.workspace_id,
                    or_(Member.user_id == user.id, Member.email == user.email, Member.phone == user.phone),
                ).first()
                if m:
                    return {"type": "member", "obj": m}
                t = self.db.query(Trainer).filter(
                    Trainer.workspace_id == self.workspace_id,
                    or_(Trainer.user_id == user.id, Trainer.email == user.email, Trainer.phone == user.phone),
                ).first()
                if t:
                    return {"type": "trainer", "obj": t}

        # 3. String identifier
        if identifier:
            clean = identifier.strip()
            # Clean prefixes
            for prefix in ["repsi://member/", "repsi://trainer/", "repsi://user/"]:
                if clean.startswith(prefix):
                    clean = clean.replace(prefix, "")

            # Member query
            member = self.db.query(Member).filter(
                Member.workspace_id == self.workspace_id,
                or_(
                    Member.id == clean,
                    func.lower(Member.email) == clean.lower(),
                    Member.phone == clean,
                    Member.phone.contains(clean.replace(" ", "")),
                ),
            ).first()
            if member:
                return {"type": "member", "obj": member}

            # Trainer query
            trainer = self.db.query(Trainer).filter(
                Trainer.workspace_id == self.workspace_id,
                or_(
                    Trainer.id == clean,
                    func.lower(Trainer.email) == clean.lower(),
                    Trainer.phone == clean,
                    Trainer.phone.contains(clean.replace(" ", "")),
                ),
            ).first()
            if trainer:
                return {"type": "trainer", "obj": trainer}

        return None

    def _validate_eligibility(self, person: dict):
        if person["type"] == "member":
            m: Member = person["obj"]
            if m.status in [MemberStatus.FROZEN, MemberStatus.CANCELLED, MemberStatus.EXPIRED, MemberStatus.SUSPENDED]:
                status_desc = "suspended" if m.status in [MemberStatus.FROZEN, MemberStatus.SUSPENDED] else m.status.value
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Check-in blocked: Member account is {status_desc.upper()}. Please settle dues or renew membership.",
                )
        elif person["type"] == "trainer":
            t: Trainer = person["obj"]
            if t.status in [TrainerStatus.SUSPENDED, TrainerStatus.INACTIVE]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Check-in blocked: Trainer account is suspended or inactive.",
                )

    # ─── CHECK-IN & CHECK-OUT ─────────────────────────────────────────────

    def check_in(
        self,
        user_id: Optional[str] = None,
        member_id: Optional[str] = None,
        trainer_id: Optional[str] = None,
        identifier: Optional[str] = None,
        qr_token: Optional[str] = None,
        gym_location_id: Optional[str] = None,
        method: AttendanceMethod = AttendanceMethod.QR,
        terminal_id: Optional[str] = None,
    ) -> Attendance:
        # Run auto checkout first so stale sessions are cleared
        self.run_smart_auto_checkout()

        # Validate QR token if provided
        qr_record = None
        if qr_token:
            qr_record = self.validate_qr_token(qr_token)
            if not gym_location_id and qr_record.gym_location_id:
                gym_location_id = qr_record.gym_location_id

        # Resolve person
        person = self._resolve_person(identifier=identifier, user_id=user_id, member_id=member_id, trainer_id=trainer_id)
        if not person:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No matching member or trainer found in this gym workspace.",
            )

        # Validate membership eligibility
        self._validate_eligibility(person)

        resolved_member_id = person["obj"].id if person["type"] == "member" else None
        resolved_trainer_id = person["obj"].id if person["type"] == "trainer" else None

        # Check for existing active check-in
        active = self.db.query(Attendance).filter(
            Attendance.workspace_id == self.workspace_id,
            (Attendance.member_id == resolved_member_id) if resolved_member_id else (Attendance.trainer_id == resolved_trainer_id),
            Attendance.check_out_time.is_(None),
        ).first()

        if active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"You're already checked in at {active.check_in_time.strftime('%I:%M %p')}. Duration: {active.duration_formatted}.",
            )

        # Anti-abuse: prevent rapid duplicate scan within 30 seconds
        recent = self.db.query(Attendance).filter(
            Attendance.workspace_id == self.workspace_id,
            (Attendance.member_id == resolved_member_id) if resolved_member_id else (Attendance.trainer_id == resolved_trainer_id),
            Attendance.check_out_time >= datetime.now(timezone.utc) - timedelta(seconds=30),
        ).first()
        if recent:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="A check-out was just recorded seconds ago. Please wait a moment before checking in again.",
            )

        record = Attendance(
            workspace_id=self.workspace_id,
            gym_location_id=gym_location_id,
            member_id=resolved_member_id,
            trainer_id=resolved_trainer_id,
            check_in_time=datetime.now(timezone.utc),
            method=method,
            checkout_type=CheckoutType.MANUAL.value,
            qr_token_id=qr_record.id if qr_record else None,
            terminal_id=terminal_id or ("QR_APP" if method == AttendanceMethod.QR else "MAIN_DESK"),
            status=AttendanceStatus.CHECKED_IN.value,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def check_out(
        self,
        attendance_id: Optional[str] = None,
        member_id: Optional[str] = None,
        user_id: Optional[str] = None,
        checkout_type: str = "MANUAL",
    ) -> Attendance:
        now = datetime.now(timezone.utc)
        record = None

        if attendance_id:
            record = self.db.query(Attendance).filter(
                Attendance.id == attendance_id,
                Attendance.workspace_id == self.workspace_id,
            ).first()
        else:
            person = self._resolve_person(user_id=user_id, member_id=member_id)
            if person:
                target_id = person["obj"].id
                query = self.db.query(Attendance).filter(
                    Attendance.workspace_id == self.workspace_id,
                    Attendance.check_out_time.is_(None),
                )
                if person["type"] == "member":
                    record = query.filter(Attendance.member_id == target_id).first()
                else:
                    record = query.filter(Attendance.trainer_id == target_id).first()

        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active check-in session found to check out.",
            )

        if record.check_out_time is not None:
            return record

        check_in = record.check_in_time
        if check_in and check_in.tzinfo is None:
            check_in = check_in.replace(tzinfo=timezone.utc)

        duration_mins = max(1, int((now - check_in).total_seconds() // 60))

        record.check_out_time = now
        record.duration_minutes = duration_mins
        record.checkout_type = checkout_type
        record.status = AttendanceStatus.CHECKED_OUT.value
        self.db.commit()
        self.db.refresh(record)
        return record

    # ─── OVERVIEW & DASHBOARD METRICS ─────────────────────────────────────

    def get_owner_summary(self, gym_location_id: Optional[str] = None) -> AttendanceSummary:
        # Run smart auto checkout to ensure real-time accuracy
        self.run_smart_auto_checkout()

        today_start = datetime.combine(date.today(), time.min).replace(tzinfo=timezone.utc)

        base_query = self.db.query(Attendance).filter(
            Attendance.workspace_id == self.workspace_id,
            Attendance.check_in_time >= today_start,
        )
        if gym_location_id:
            base_query = base_query.filter(Attendance.gym_location_id == gym_location_id)

        today_records = base_query.all()
        today_total = len(today_records)
        currently_inside = sum(1 for r in today_records if r.check_out_time is None)
        total_checked_out = sum(1 for r in today_records if r.check_out_time is not None)
        auto_checkouts = sum(1 for r in today_records if r.checkout_type == CheckoutType.AUTO.value)

        # Average dwell minutes
        durations = [r.duration_minutes for r in today_records if r.duration_minutes]
        avg_dwell = int(sum(durations) / len(durations)) if durations else (65 if today_total > 0 else 0)

        # Peak hours computation
        hour_counts: Dict[int, int] = {}
        for r in today_records:
            h = r.check_in_time.hour
            hour_counts[h] = hour_counts.get(h, 0) + 1

        if hour_counts:
            peak_h = max(hour_counts, key=hour_counts.get)
            start_str = f"{peak_h % 12 or 12:02d}:00 {'AM' if peak_h < 12 else 'PM'}"
            end_h = (peak_h + 2) % 24
            end_str = f"{end_h % 12 or 12:02d}:00 {'AM' if end_h < 12 else 'PM'}"
            peak_hour = f"{start_str} – {end_str}"
        else:
            peak_hour = "06:00 – 08:30 AM"

        # Abnormal sessions (>3.5 hours or overnight)
        abnormal = sum(1 for r in today_records if (r.duration_minutes or 0) > 210)

        return AttendanceSummary(
            today_total=today_total,
            currently_inside=currently_inside,
            total_checked_out=total_checked_out,
            peak_hour=peak_hour,
            average_dwell_minutes=avg_dwell,
            abnormal_sessions_count=abnormal,
            auto_checkouts_count=auto_checkouts,
        )

    def get_currently_inside(self, gym_location_id: Optional[str] = None) -> List[CurrentlyInsideMember]:
        self.run_smart_auto_checkout()
        now = datetime.now(timezone.utc)

        query = self.db.query(Attendance).filter(
            Attendance.workspace_id == self.workspace_id,
            Attendance.check_out_time.is_(None),
        )
        if gym_location_id:
            query = query.filter(Attendance.gym_location_id == gym_location_id)

        active_list = query.order_by(Attendance.check_in_time.asc()).all()
        results: List[CurrentlyInsideMember] = []

        for r in active_list:
            check_in = r.check_in_time
            if check_in.tzinfo is None:
                check_in = check_in.replace(tzinfo=timezone.utc)
            elapsed = max(0, int((now - check_in).total_seconds() // 60))
            hours = elapsed // 60
            mins = elapsed % 60
            dur_str = f"{hours}h {mins}m" if hours > 0 else f"{mins}m"

            avatar = None
            plan = "Standard"
            mem_status = "active"
            phone = None

            if r.member:
                avatar = r.member.avatar_url
                phone = r.member.phone
                plan = r.member.plan_name or "Standard"
                mem_status = r.member.status.value if hasattr(r.member.status, "value") else str(r.member.status)
            elif r.trainer:
                avatar = r.trainer.avatar_url
                phone = r.trainer.phone
                plan = "Personal Trainer"
                mem_status = "active"

            results.append(
                CurrentlyInsideMember(
                    attendance_id=r.id,
                    member_id=r.member_id,
                    trainer_id=r.trainer_id,
                    name=r.person_name,
                    person_type=r.person_type,
                    avatar_url=avatar,
                    phone=phone,
                    plan_name=plan,
                    membership_status=mem_status,
                    check_in_time=r.check_in_time,
                    elapsed_minutes=elapsed,
                    duration_formatted=dur_str,
                    terminal_id=r.terminal_id,
                    gym_location_id=r.gym_location_id,
                )
            )

        return results

    # ─── ATTENDANCE HISTORY ───────────────────────────────────────────────

    def get_attendance_history(
        self,
        search: Optional[str] = None,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        status_filter: Optional[str] = None,  # "all", "in", "out", "auto"
        checkout_type: Optional[str] = None,
        gym_location_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Attendance]:
        self.run_smart_auto_checkout()

        query = self.db.query(Attendance).filter(Attendance.workspace_id == self.workspace_id)

        if gym_location_id:
            query = query.filter(Attendance.gym_location_id == gym_location_id)

        if date_from:
            dt_from = datetime.combine(date_from, time.min).replace(tzinfo=timezone.utc)
            query = query.filter(Attendance.check_in_time >= dt_from)

        if date_to:
            dt_to = datetime.combine(date_to, time.max).replace(tzinfo=timezone.utc)
            query = query.filter(Attendance.check_in_time <= dt_to)

        if status_filter == "in":
            query = query.filter(Attendance.check_out_time.is_(None))
        elif status_filter == "out":
            query = query.filter(Attendance.check_out_time.is_not(None))
        elif status_filter == "auto":
            query = query.filter(Attendance.checkout_type == CheckoutType.AUTO.value)

        if checkout_type:
            query = query.filter(Attendance.checkout_type == checkout_type)

        if search:
            s = f"%{search.strip().lower()}%"
            query = query.join(Attendance.member, isouter=True).filter(
                or_(
                    func.lower(Member.first_name).like(s),
                    func.lower(Member.last_name).like(s),
                    Member.phone.like(s),
                    Member.email.like(s),
                    Attendance.terminal_id.like(s),
                )
            )

        return query.order_by(Attendance.check_in_time.desc()).offset(skip).limit(limit).all()

    # ─── MEMBER PERSONAL STATS ───────────────────────────────────────────

    def get_member_personal_stats(self, member_id: str) -> MemberPersonalAttendanceResponse:
        self.run_smart_auto_checkout()

        member = self.db.query(Member).filter(
            Member.id == member_id,
            Member.workspace_id == self.workspace_id,
        ).first()
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")

        records = self.db.query(Attendance).filter(
            Attendance.workspace_id == self.workspace_id,
            Attendance.member_id == member_id,
        ).order_by(Attendance.check_in_time.desc()).all()

        total_visits = len(records)
        now = datetime.now(timezone.utc)
        week_start = now - timedelta(days=now.weekday())
        month_start = datetime(now.year, now.month, 1, tzinfo=timezone.utc)

        this_week_visits = sum(1 for r in records if _to_utc(r.check_in_time) >= week_start)
        this_month_visits = sum(1 for r in records if _to_utc(r.check_in_time) >= month_start)

        # Average duration
        durations = [r.duration_minutes for r in records if r.duration_minutes]
        avg_duration = int(sum(durations) / len(durations)) if durations else 60

        # Calculate streak (consecutive calendar days)
        visit_dates = sorted(
            list({r.check_in_time.date() for r in records}),
            reverse=True,
        )
        streak = 0
        current_check = date.today()
        for v_date in visit_dates:
            if v_date == current_check or v_date == current_check - timedelta(days=1):
                streak += 1
                current_check = v_date
            else:
                break

        # Check if currently inside
        active_rec = next((r for r in records if r.check_out_time is None), None)

        # Calendar dates attended in current month
        calendar_dates = [
            r.check_in_time.strftime("%Y-%m-%d")
            for r in records
            if r.check_in_time.year == now.year and r.check_in_time.month == now.month
        ]

        active_resp = None
        if active_rec:
            active_resp = AttendanceResponse(
                id=active_rec.id,
                workspace_id=active_rec.workspace_id,
                gym_location_id=active_rec.gym_location_id,
                member_id=active_rec.member_id,
                trainer_id=active_rec.trainer_id,
                person_name=active_rec.person_name,
                person_type=active_rec.person_type,
                attendance_status=active_rec.attendance_status,
                check_in_time=active_rec.check_in_time,
                check_out_time=active_rec.check_out_time,
                duration_minutes=active_rec.duration_minutes,
                duration_formatted=active_rec.duration_formatted,
                method=active_rec.method,
                checkout_type=active_rec.checkout_type,
                qr_token_id=active_rec.qr_token_id,
                terminal_id=active_rec.terminal_id,
                status=active_rec.status,
                notes=active_rec.notes,
            )

        recent_resps = [
            AttendanceResponse(
                id=r.id,
                workspace_id=r.workspace_id,
                gym_location_id=r.gym_location_id,
                member_id=r.member_id,
                trainer_id=r.trainer_id,
                person_name=r.person_name,
                person_type=r.person_type,
                attendance_status=r.attendance_status,
                check_in_time=r.check_in_time,
                check_out_time=r.check_out_time,
                duration_minutes=r.duration_minutes,
                duration_formatted=r.duration_formatted,
                method=r.method,
                checkout_type=r.checkout_type,
                qr_token_id=r.qr_token_id,
                terminal_id=r.terminal_id,
                status=r.status,
                notes=r.notes,
            )
            for r in records[:15]
        ]

        return MemberPersonalAttendanceResponse(
            member_id=member.id,
            member_name=f"{member.first_name} {member.last_name or ''}".strip(),
            total_visits=total_visits,
            this_week_visits=this_week_visits,
            this_month_visits=this_month_visits,
            average_duration_minutes=avg_duration,
            current_streak_days=streak,
            last_visit_time=records[0].check_in_time if records else None,
            is_currently_inside=active_rec is not None,
            active_session=active_resp,
            calendar_attendance_dates=list(set(calendar_dates)),
            recent_sessions=recent_resps,
        )

    # ─── ATTENDANCE ANALYTICS ─────────────────────────────────────────────

    def get_attendance_analytics(self, days: int = 30) -> AttendanceAnalyticsResponse:
        self.run_smart_auto_checkout()
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(days=days)

        records = self.db.query(Attendance).filter(
            Attendance.workspace_id == self.workspace_id,
            Attendance.check_in_time >= cutoff,
        ).all()

        # Daily trends
        day_map: Dict[str, int] = {}
        for d in range(days):
            day_str = (now - timedelta(days=d)).strftime("%Y-%m-%d")
            day_map[day_str] = 0

        # Hourly distribution
        hour_map: Dict[int, int] = {h: 0 for h in range(6, 23)}

        # Day of week distribution
        dow_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        dow_map: Dict[str, int] = {d: 0 for d in dow_names}

        # Member visit frequencies
        member_counts: Dict[str, int] = {}

        durations: List[int] = []

        for r in records:
            day_key = r.check_in_time.strftime("%Y-%m-%d")
            if day_key in day_map:
                day_map[day_key] += 1

            h = r.check_in_time.hour
            if h in hour_map:
                hour_map[h] += 1

            dow_str = dow_names[r.check_in_time.weekday()]
            dow_map[dow_str] += 1

            if r.member_id:
                member_counts[r.member_id] = member_counts.get(r.member_id, 0) + 1

            if r.duration_minutes:
                durations.append(r.duration_minutes)

        daily_trends = [{"date": k, "check_ins": v} for k, v in sorted(day_map.items())]
        hourly_dist = [
            {"hour": f"{h:02d}:00", "count": hour_map[h]}
            for h in sorted(hour_map.keys())
        ]
        dow_dist = [{"day": d, "count": dow_map[d]} for d in dow_names]

        avg_duration = int(sum(durations) / len(durations)) if durations else 68

        # Top active members
        top_member_ids = sorted(member_counts, key=member_counts.get, reverse=True)[:10]
        most_active: List[dict] = []
        if top_member_ids:
            members = self.db.query(Member).filter(Member.id.in_(top_member_ids)).all()
            mem_dict = {m.id: m for m in members}
            for mid in top_member_ids:
                if mid in mem_dict:
                    m = mem_dict[mid]
                    most_active.append({
                        "id": m.id,
                        "name": f"{m.first_name} {m.last_name or ''}".strip(),
                        "visits": member_counts[mid],
                        "plan": m.plan_name or "Standard",
                        "status": m.status.value if hasattr(m.status, "value") else str(m.status),
                    })

        # Retention insight: Members who haven't visited in the last 14 days
        two_weeks_ago = now - timedelta(days=14)
        active_members = self.db.query(Member).filter(
            Member.workspace_id == self.workspace_id,
            Member.status == MemberStatus.ACTIVE,
        ).all()

        recent_member_ids = {
            r.member_id
            for r in self.db.query(Attendance.member_id).filter(
                Attendance.workspace_id == self.workspace_id,
                Attendance.check_in_time >= two_weeks_ago,
                Attendance.member_id.is_not(None),
            ).distinct().all()
        }

        inactive_members = []
        for m in active_members:
            if m.id not in recent_member_ids:
                inactive_members.append({
                    "id": m.id,
                    "name": f"{m.first_name} {m.last_name or ''}".strip(),
                    "phone": m.phone,
                    "plan": m.plan_name or "Standard",
                    "days_inactive": 14,
                })

        return AttendanceAnalyticsResponse(
            daily_trends=daily_trends,
            hourly_distribution=hourly_dist,
            day_of_week_distribution=dow_dist,
            average_duration_minutes=avg_duration,
            total_visits_period=len(records),
            unique_members_visited=len(member_counts),
            most_active_members=most_active,
            declining_members=[],
            inactive_members_count=len(inactive_members),
            inactive_members=inactive_members[:15],
        )

    # ─── MULTIPLE LOCATIONS ───────────────────────────────────────────────

    def get_locations(self) -> List[GymLocation]:
        locs = self.db.query(GymLocation).filter(
            GymLocation.workspace_id == self.workspace_id,
            GymLocation.is_active == True,
        ).all()
        if not locs:
            # Seed default location if empty
            default_loc = GymLocation(
                workspace_id=self.workspace_id,
                name="Main Headquarters",
                code="MAIN",
                address="Reception Desk",
                closing_time="22:00",
                is_active=True,
            )
            self.db.add(default_loc)
            self.db.commit()
            self.db.refresh(default_loc)
            return [default_loc]
        return locs
