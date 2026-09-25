import hashlib
import secrets
from datetime import datetime, timedelta, timezone, date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, ConfigDict
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.config import settings
from app.core.database import get_db
from app.core.email import send_gym_invitation, send_direct_credentials_email
from app.core.security import get_password_hash, create_access_token
from app.middleware.tenant import get_current_tenant, TenantContext
from app.models.invitation import GymInvitation, InvitationRole, InvitationStatus
from app.models.user import User, Workspace, WorkspaceMember, UserRole
from app.models.member import Member, MemberStatus
from app.models.trainer import Trainer

router = APIRouter(prefix="/invitations", tags=["Invitations"])


class InvitationCreateRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: InvitationRole
    specialization: Optional[str] = None


class InvitationResponse(BaseModel):
    id: str
    workspace_id: str
    email: str
    name: str
    phone: Optional[str] = None
    role: InvitationRole
    specialization: Optional[str] = None
    status: InvitationStatus
    expires_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InvitationVerifyResponse(BaseModel):
    id: str
    email: str
    name: str
    role: InvitationRole
    gym_name: str
    gym_slug: str
    invited_by_name: Optional[str] = None
    status: InvitationStatus


class InvitationAcceptRequest(BaseModel):
    token: str
    password: str


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


@router.post("/", response_model=InvitationResponse, status_code=status.HTTP_201_CREATED)
def create_invitation(
    data: InvitationCreateRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    normalized_email = data.email.strip().lower()

    # Get Workspace info
    workspace = db.query(Workspace).filter(Workspace.id == tenant.workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    # Check if user is already an active member of this workspace
    existing_user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    if existing_user:
        existing_ws_member = db.query(WorkspaceMember).filter(
            WorkspaceMember.workspace_id == tenant.workspace_id,
            WorkspaceMember.user_id == existing_user.id,
            WorkspaceMember.is_active == True
        ).first()
        if existing_ws_member:
            raise HTTPException(
                status_code=400,
                detail="User with this email is already a member of this gym."
            )

    # Revoke previous pending invitations for this email in this workspace
    previous_invites = db.query(GymInvitation).filter(
        GymInvitation.workspace_id == tenant.workspace_id,
        func.lower(GymInvitation.email) == normalized_email,
        GymInvitation.status == InvitationStatus.PENDING
    ).all()
    for invite in previous_invites:
        invite.status = InvitationStatus.REVOKED

    # Generate single-use token (32 bytes urlsafe)
    raw_token = secrets.token_urlsafe(32)
    token_hash = _hash_token(raw_token)
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)

    invitation = GymInvitation(
        workspace_id=tenant.workspace_id,
        email=normalized_email,
        name=data.name.strip(),
        phone=data.phone.strip() if data.phone else None,
        role=data.role,
        specialization=data.specialization.strip() if data.specialization else None,
        token_hash=token_hash,
        expires_at=expires_at,
        invited_by_id=tenant.user_id,
        status=InvitationStatus.PENDING
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)

    # Dispatch email
    frontend_url = settings.FRONTEND_URL.rstrip("/")
    invite_url = f"{frontend_url}/invite/accept?token={raw_token}"
    
    send_gym_invitation(
        email=normalized_email,
        name=invitation.name,
        role=invitation.role.value,
        gym_name=workspace.name,
        invite_url=invite_url
    )

    return invitation


@router.get("/verify", response_model=InvitationVerifyResponse)
def verify_invitation(token: str, db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=400, detail="Token is required")

    token_hash = _hash_token(token.strip())
    invitation = db.query(GymInvitation).filter(GymInvitation.token_hash == token_hash).first()

    if not invitation:
        raise HTTPException(status_code=404, detail="Invalid or expired invitation token.")

    now = datetime.now(timezone.utc)
    exp = invitation.expires_at
    if exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)

    if invitation.status != InvitationStatus.PENDING or now > exp:
        if invitation.status == InvitationStatus.PENDING:
            invitation.status = InvitationStatus.EXPIRED
            db.commit()
        raise HTTPException(
            status_code=400,
            detail="This invitation link has expired or has already been used."
        )

    workspace = db.query(Workspace).filter(Workspace.id == invitation.workspace_id).first()
    invited_by_user = db.query(User).filter(User.id == invitation.invited_by_id).first() if invitation.invited_by_id else None

    return InvitationVerifyResponse(
        id=invitation.id,
        email=invitation.email,
        name=invitation.name,
        role=invitation.role,
        gym_name=workspace.name if workspace else "Gym Workspace",
        gym_slug=workspace.slug if workspace else "default",
        invited_by_name=invited_by_user.full_name if invited_by_user else None,
        status=invitation.status
    )


@router.post("/accept")
def accept_invitation(data: InvitationAcceptRequest, db: Session = Depends(get_db)):
    if not data.token or not data.password:
        raise HTTPException(status_code=400, detail="Token and password are required.")

    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")

    token_hash = _hash_token(data.token.strip())
    invitation = db.query(GymInvitation).filter(GymInvitation.token_hash == token_hash).first()

    if not invitation:
        raise HTTPException(status_code=404, detail="Invalid invitation token.")

    now = datetime.now(timezone.utc)
    exp = invitation.expires_at
    if exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)

    if invitation.status != InvitationStatus.PENDING or now > exp:
        if invitation.status == InvitationStatus.PENDING:
            invitation.status = InvitationStatus.EXPIRED
            db.commit()
        raise HTTPException(
            status_code=400,
            detail="This invitation link has expired or has already been used."
        )

    # Fetch workspace
    workspace = db.query(Workspace).filter(Workspace.id == invitation.workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Gym workspace no longer exists.")

    normalized_email = invitation.email.lower().strip()

    # 1. Create or retrieve User
    user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    if not user:
        user = User(
            email=normalized_email,
            full_name=invitation.name,
            hashed_password=get_password_hash(data.password),
            phone=invitation.phone,
            is_active=True
        )
        db.add(user)
        db.flush()
    else:
        user.hashed_password = get_password_hash(data.password)
        if invitation.phone and not user.phone:
            user.phone = invitation.phone
        user.is_active = True

    # 2. Assign WorkspaceMember role
    assigned_role = UserRole.TRAINER if invitation.role == InvitationRole.TRAINER else UserRole.USER

    ws_member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace.id,
        WorkspaceMember.user_id == user.id
    ).first()

    if not ws_member:
        ws_member = WorkspaceMember(
            workspace_id=workspace.id,
            user_id=user.id,
            role=assigned_role,
            is_active=True
        )
        db.add(ws_member)
    else:
        ws_member.role = assigned_role
        ws_member.is_active = True

    # 3. Create specific Member or Trainer record
    if invitation.role == InvitationRole.MEMBER:
        # Check if member record exists
        existing_member = db.query(Member).filter(
            Member.workspace_id == workspace.id,
            func.lower(Member.email) == normalized_email
        ).first()
        if not existing_member:
            name_parts = invitation.name.split(" ", 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ""

            member = Member(
                workspace_id=workspace.id,
                first_name=first_name,
                last_name=last_name,
                email=normalized_email,
                phone=invitation.phone or "",
                status=MemberStatus.ACTIVE,
                joined_date=date.today()
            )
            db.add(member)

    elif invitation.role == InvitationRole.TRAINER:
        # Check if trainer record exists
        existing_trainer = db.query(Trainer).filter(
            Trainer.workspace_id == workspace.id,
            func.lower(Trainer.email) == normalized_email
        ).first()
        if not existing_trainer:
            trainer = Trainer(
                workspace_id=workspace.id,
                user_id=user.id,
                name=invitation.name,
                email=normalized_email,
                phone=invitation.phone or "",
                specialization=invitation.specialization or "General Fitness",
                is_active=True
            )
            db.add(trainer)
        else:
            existing_trainer.user_id = user.id
            if invitation.specialization:
                existing_trainer.specialization = invitation.specialization

    # 4. Mark invitation as ACCEPTED
    invitation.status = InvitationStatus.ACCEPTED
    invitation.accepted_at = now
    db.commit()

    # Generate JWT token
    access_token = create_access_token(
        subject=user.id,
        workspace_id=workspace.id,
        role=assigned_role.value
    )

    return {
        "status": "success",
        "message": "Invitation accepted successfully. Account activated.",
        "access_token": access_token,
        "token_type": "bearer",
        "workspace_slug": workspace.slug,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": assigned_role.value
        }
    }


class DirectAddRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: InvitationRole
    password: Optional[str] = None
    specialization: Optional[str] = None


@router.post("/direct-add", status_code=status.HTTP_201_CREATED)
def direct_add_user(
    data: DirectAddRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    if tenant.role not in ["OWNER", "SUPER_ADMIN", "ADMIN", "MANAGER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only gym owners and managers can provision user accounts directly."
        )

    workspace = db.query(Workspace).filter(Workspace.id == tenant.workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found.")

    normalized_email = data.email.strip().lower()
    raw_password = data.password.strip() if data.password and len(data.password.strip()) >= 6 else secrets.token_urlsafe(8)

    # 1. Create or update User account
    user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    if not user:
        user = User(
            email=normalized_email,
            full_name=data.name.strip(),
            hashed_password=get_password_hash(raw_password),
            phone=data.phone.strip() if data.phone else None,
            is_active=True
        )
        db.add(user)
        db.flush()
    else:
        user.hashed_password = get_password_hash(raw_password)
        if data.phone and not user.phone:
            user.phone = data.phone.strip()
        user.is_active = True

    # 2. WorkspaceMember role
    assigned_role = UserRole.TRAINER if data.role == InvitationRole.TRAINER else UserRole.USER
    ws_member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace.id,
        WorkspaceMember.user_id == user.id
    ).first()

    if not ws_member:
        ws_member = WorkspaceMember(
            workspace_id=workspace.id,
            user_id=user.id,
            role=assigned_role,
            is_active=True
        )
        db.add(ws_member)
    else:
        ws_member.role = assigned_role
        ws_member.is_active = True

    # 3. Create Member or Trainer entity
    if data.role == InvitationRole.MEMBER:
        existing_member = db.query(Member).filter(
            Member.workspace_id == workspace.id,
            func.lower(Member.email) == normalized_email
        ).first()
        if not existing_member:
            name_parts = data.name.strip().split(" ", 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ""

            member = Member(
                workspace_id=workspace.id,
                first_name=first_name,
                last_name=last_name,
                email=normalized_email,
                phone=data.phone or "",
                status=MemberStatus.ACTIVE,
                joined_date=date.today()
            )
            db.add(member)
        else:
            existing_member.status = MemberStatus.ACTIVE

    elif data.role == InvitationRole.TRAINER:
        existing_trainer = db.query(Trainer).filter(
            Trainer.workspace_id == workspace.id,
            func.lower(Trainer.email) == normalized_email
        ).first()
        if not existing_trainer:
            trainer = Trainer(
                workspace_id=workspace.id,
                user_id=user.id,
                name=data.name.strip(),
                email=normalized_email,
                phone=data.phone or "",
                specialization=data.specialization or "General Fitness",
                status="ACTIVE",
                is_active=True
            )
            db.add(trainer)
        else:
            existing_trainer.user_id = user.id
            existing_trainer.status = "ACTIVE"
            existing_trainer.is_active = True
            if data.specialization:
                existing_trainer.specialization = data.specialization

    db.commit()

    # 4. Dispatch Email with credentials
    frontend_url = settings.FRONTEND_URL.rstrip("/")
    login_url = f"{frontend_url}/login"

    send_direct_credentials_email(
        email=normalized_email,
        name=data.name.strip(),
        role=data.role.value,
        gym_name=workspace.name,
        password=raw_password,
        login_url=login_url
    )

    return {
        "status": "success",
        "message": f"Account for {data.name} created and credentials emailed to {normalized_email}.",
        "user_id": user.id,
        "email": normalized_email,
        "password": raw_password,
        "role": assigned_role.value
    }

