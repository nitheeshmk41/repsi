import hashlib
import re
import secrets
from datetime import datetime, timedelta, timezone

from app.core.config import settings
from app.core.email import send_registration_otp
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.auth import PendingRegistration
from app.models.member import Member
from app.models.user import User, UserRole, Workspace, WorkspaceMember
from app.schemas.auth import (
    LoginRequest,
    GoogleLoginRequest,
    MemberRegisterRequest,
    RegisterRequest,
    VerifyRegisterOtpRequest,
)
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, req: RegisterRequest) -> tuple[User, Workspace, str]:
        # Check existing user
        normalized_email = str(req.email).strip().lower()
        existing_user = (
            self.db.query(User)
            .filter(func.lower(User.email) == normalized_email)
            .first()
        )
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists.",
            )

        # Create User
        user = User(
            email=normalized_email,
            full_name=req.full_name,
            hashed_password=get_password_hash(req.password),
            phone=req.gym_phone,
            is_active=True,
        )
        self.db.add(user)
        self.db.flush()

        # Generate slug from gym name
        slug = re.sub(r"[^a-zA-Z0-9]+", "-", req.gym_name.lower()).strip("-")
        # Ensure unique slug
        base_slug = slug
        counter = 1
        while self.db.query(Workspace).filter(Workspace.slug == slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1

        # Create Workspace
        workspace = Workspace(
            name=req.gym_name,
            slug=slug,
            phone=req.gym_phone,
            email=req.email,
            city=req.gym_city,
            is_active=True,
        )
        self.db.add(workspace)
        self.db.flush()

        # Create WorkspaceMember as OWNER
        member_role = WorkspaceMember(
            workspace_id=workspace.id,
            user_id=user.id,
            role=UserRole.OWNER,
            is_active=True,
        )
        self.db.add(member_role)
        self.db.commit()
        self.db.refresh(user)
        self.db.refresh(workspace)

        token = create_access_token(
            subject=user.id, workspace_id=workspace.id, role=UserRole.OWNER.value
        )
        return user, workspace, token

    @staticmethod
    def _hash_otp(otp: str) -> str:
        return hashlib.sha256(otp.encode("utf-8")).hexdigest()

    def request_registration_otp(self, req: RegisterRequest) -> None:
        email = str(req.email).strip().lower()
        if self.db.query(User).filter(func.lower(User.email) == email).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email address already exists.",
            )

        now = datetime.now(timezone.utc)
        pending = (
            self.db.query(PendingRegistration)
            .filter(PendingRegistration.email == email)
            .first()
        )
        if pending and pending.last_sent_at:
            last_sent = pending.last_sent_at
            if last_sent.tzinfo is None:
                last_sent = last_sent.replace(tzinfo=timezone.utc)
            if (now - last_sent).total_seconds() < settings.OTP_RESEND_COOLDOWN_SECONDS:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Please wait before requesting another code.",
                )

        otp = f"{secrets.randbelow(1_000_000):06d}"
        if pending is None:
            pending = PendingRegistration(email=email)
            self.db.add(pending)
        pending.full_name = req.full_name.strip()
        pending.password_hash = get_password_hash(req.password)
        pending.gym_name = req.gym_name.strip()
        pending.gym_phone = req.gym_phone
        pending.gym_city = req.gym_city
        pending.otp_hash = self._hash_otp(otp)
        pending.otp_expires_at = now + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
        pending.last_sent_at = now
        pending.attempts = 0
        self.db.commit()
        try:
            send_registration_otp(email, otp)
        except Exception:
            self.db.delete(pending)
            self.db.commit()
            raise

    def verify_registration_otp(
        self, req: VerifyRegisterOtpRequest
    ) -> tuple[User, Workspace, str]:
        email = str(req.email).strip().lower()
        pending = (
            self.db.query(PendingRegistration)
            .filter(PendingRegistration.email == email)
            .first()
        )
        if pending is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No pending verification was found for this email.",
            )
        if self.db.query(User).filter(func.lower(User.email) == email).first():
            self.db.delete(pending)
            self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email address already exists.",
            )
        expires_at = pending.otp_expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > expires_at:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This verification code has expired.",
            )
        if pending.attempts >= 5:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many incorrect attempts. Request a new code.",
            )
        if not secrets.compare_digest(
            pending.otp_hash, self._hash_otp(req.otp.strip())
        ):
            pending.attempts += 1
            self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect verification code.",
            )

        registration = RegisterRequest(
            full_name=pending.full_name,
            email=email,
            password="temporary-password-not-used",
            gym_name=pending.gym_name,
            gym_phone=pending.gym_phone,
            gym_city=pending.gym_city,
        )
        user, workspace, _ = self._register_with_password_hash(
            registration, pending.password_hash
        )
        self.db.delete(pending)
        self.db.commit()
        token = create_access_token(
            subject=user.id, workspace_id=workspace.id, role=UserRole.OWNER.value
        )
        return user, workspace, token

    def resend_registration_otp(self, email: str) -> None:
        normalized_email = email.strip().lower()
        pending = (
            self.db.query(PendingRegistration)
            .filter(PendingRegistration.email == normalized_email)
            .first()
        )
        if pending is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No pending verification was found for this email.",
            )
        now = datetime.now(timezone.utc)
        last_sent = pending.last_sent_at
        if last_sent.tzinfo is None:
            last_sent = last_sent.replace(tzinfo=timezone.utc)
        if (now - last_sent).total_seconds() < settings.OTP_RESEND_COOLDOWN_SECONDS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Please wait before requesting another code.",
            )
        otp = f"{secrets.randbelow(1_000_000):06d}"
        pending.otp_hash = self._hash_otp(otp)
        pending.otp_expires_at = now + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
        pending.last_sent_at = now
        pending.attempts = 0
        self.db.commit()
        try:
            send_registration_otp(normalized_email, otp)
        except Exception:
            self.db.rollback()
            raise

    def _register_with_password_hash(
        self, req: RegisterRequest, password_hash: str
    ) -> tuple[User, Workspace, str]:
        user, workspace, _ = self.register(req)
        user.hashed_password = password_hash
        self.db.commit()
        return user, workspace, _

    def register_member(
        self, req: MemberRegisterRequest
    ) -> tuple[User, Workspace, str]:
        normalized_email = str(req.email).strip().lower()
        if (
            self.db.query(User)
            .filter(func.lower(User.email) == normalized_email)
            .first()
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists.",
            )
        workspace = (
            self.db.query(Workspace)
            .filter(Workspace.slug == req.workspace_slug)
            .first()
        )
        if not workspace or not workspace.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Gym workspace not found."
            )
        user = User(
            email=normalized_email,
            full_name=req.full_name,
            hashed_password=get_password_hash(req.password),
            phone=req.phone,
            is_active=True,
        )
        self.db.add(user)
        self.db.flush()
        self.db.add(
            WorkspaceMember(
                workspace_id=workspace.id,
                user_id=user.id,
                role=UserRole.USER,
                is_active=True,
            )
        )
        self.db.commit()
        self.db.refresh(user)
        token = create_access_token(
            subject=user.id, workspace_id=workspace.id, role=UserRole.USER.value
        )
        return user, workspace, token

    def authenticate(self, req: LoginRequest) -> tuple[User, Workspace | None, str]:
        identifier = str(req.email).strip()
        lower_id = identifier.lower()

        # 1. Search User table by email (case-insensitive) or phone
        user = self.db.query(User).filter(
            (func.lower(User.email) == lower_id) | (User.phone == identifier)
        ).first()

        if user:
            pw_valid = verify_password(req.password, user.hashed_password)
            if not pw_valid:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email, phone or password.",
                )
        else:
            # 2. Check Member table if owner added member/trainer by email or phone
            member = self.db.query(Member).filter(
                (func.lower(Member.email) == lower_id) | (Member.phone == identifier)
            ).first()

            if member:
                is_phone_pass = member.phone and (req.password == member.phone or req.password == member.phone.replace(" ", "").replace("+91", ""))
                if not is_phone_pass:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Incorrect email, phone or password.",
                    )

                # Provision User account for this Member
                user = User(
                    email=member.email.lower(),
                    full_name=f"{member.first_name} {member.last_name}".strip(),
                    hashed_password=get_password_hash(req.password),
                    phone=member.phone,
                    is_active=True,
                )
                self.db.add(user)
                self.db.flush()

                ws_member = WorkspaceMember(
                    workspace_id=member.workspace_id,
                    user_id=user.id,
                    role=UserRole.USER,
                    is_active=True,
                )
                self.db.add(ws_member)
                self.db.commit()
                self.db.refresh(user)
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email, phone or password.",
                )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User account is deactivated.",
            )

        # Find user's primary workspace
        ws_member = (
            self.db.query(WorkspaceMember)
            .filter(
                WorkspaceMember.user_id == user.id, WorkspaceMember.is_active == True
            )
            .first()
        )
        workspace = ws_member.workspace if ws_member else None
        role = (
            "SUPER_ADMIN" if user.is_superadmin
            else (ws_member.role.value if ws_member else "STAFF")
        )

        token = create_access_token(
            subject=user.id, workspace_id=workspace.id if workspace else None, role=role
        )
        return user, workspace, token

    def google_authenticate(self, req: GoogleLoginRequest) -> tuple[User, Workspace | None, str]:
        try:
            # We assume req.token is an access_token from the frontend Google OAuth flow
            import httpx
            user_info_resp = httpx.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {req.token}"}
            )
            if user_info_resp.status_code != 200:
                raise ValueError("Invalid Google access token")
            
            idinfo = user_info_resp.json()
            email = idinfo.get("email")
            full_name = idinfo.get("name")
            if not email:
                raise ValueError("No email found in Google profile")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Google token: {str(e)}",
            )

        normalized_email = email.lower().strip()
        user = self.db.query(User).filter(func.lower(User.email) == normalized_email).first()

        if not user:
            # Check if there is an invited member
            member = self.db.query(Member).filter(func.lower(Member.email) == normalized_email).first()
            if member:
                user = User(
                    email=member.email.lower(),
                    full_name=full_name or f"{member.first_name} {member.last_name}".strip(),
                    hashed_password=get_password_hash(secrets.token_urlsafe(32)),
                    phone=member.phone,
                    is_active=True,
                )
                self.db.add(user)
                self.db.flush()

                ws_member = WorkspaceMember(
                    workspace_id=member.workspace_id,
                    user_id=user.id,
                    role=UserRole.USER,
                    is_active=True,
                )
                self.db.add(ws_member)
                self.db.commit()
                self.db.refresh(user)
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Google Sign-In requires an active gym invitation. Please register first.",
                )
        else:
            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User account is deactivated.",
                )

        # Find user's primary workspace
        ws_member = (
            self.db.query(WorkspaceMember)
            .filter(WorkspaceMember.user_id == user.id, WorkspaceMember.is_active == True)
            .first()
        )
        workspace = ws_member.workspace if ws_member else None
        role = (
            "SUPER_ADMIN" if user.is_superadmin
            else (ws_member.role.value if ws_member else "STAFF")
        )

        token = create_access_token(
            subject=user.id, workspace_id=workspace.id if workspace else None, role=role
        )
        return user, workspace, token

