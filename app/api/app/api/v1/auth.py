from app.core.database import get_db
from app.middleware.tenant import TenantContext, get_current_tenant
from app.models.user import User, WorkspaceMember, Workspace
from app.schemas.auth import (
    LoginRequest,
    GoogleLoginRequest,
    MemberRegisterRequest,
    PasswordResetRequest,
    RegisterOtpRequest,
    RegisterRequest,
    ResendRegisterOtpRequest,
    Token,
    UserResponse,
    VerifyRegisterOtpRequest,
)
from app.services.auth import AuthService
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user, workspace, token = auth_service.register(req)
    return Token(
        access_token=token,
        workspace_id=workspace.id,
        workspace_slug=workspace.slug,
        gym_name=workspace.name,
        role="OWNER"
    )


@router.post("/register/request-otp")
def request_registration_otp(req: RegisterOtpRequest, db: Session = Depends(get_db)):
    AuthService(db).request_registration_otp(req)
    return {"message": "A verification code has been sent to your email."}


@router.post("/register/resend-otp")
def resend_registration_otp(
    req: ResendRegisterOtpRequest, db: Session = Depends(get_db)
):
    AuthService(db).resend_registration_otp(str(req.email))
    return {"message": "A new verification code has been sent to your email."}


@router.post("/register/verify-otp", response_model=Token)
def verify_registration_otp(
    req: VerifyRegisterOtpRequest, db: Session = Depends(get_db)
):
    _, workspace, token = AuthService(db).verify_registration_otp(req)
    return Token(
        access_token=token,
        workspace_id=workspace.id,
        workspace_slug=workspace.slug,
        gym_name=workspace.name,
        role="OWNER"
    )


@router.post("/login", response_model=Token)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user, workspace, token = auth_service.authenticate(req)
    membership_query = db.query(WorkspaceMember).filter(
        WorkspaceMember.user_id == user.id,
        WorkspaceMember.is_active == True,
    )
    if workspace:
        membership_query = membership_query.filter(
            WorkspaceMember.workspace_id == workspace.id
        )
    membership = membership_query.first()
    return Token(
        access_token=token,
        workspace_id=workspace.id if workspace else None,
        workspace_slug=workspace.slug if workspace else None,
        gym_name=workspace.name if workspace else None,
        role="SUPER_ADMIN" if user.is_superadmin else (membership.role.value if membership else "STAFF"),
    )


@router.post("/google", response_model=Token)
def google_login(req: GoogleLoginRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user, workspace, token = auth_service.google_authenticate(req)
    membership_query = db.query(WorkspaceMember).filter(
        WorkspaceMember.user_id == user.id,
        WorkspaceMember.is_active == True,
    )
    if workspace:
        membership_query = membership_query.filter(
            WorkspaceMember.workspace_id == workspace.id
        )
    membership = membership_query.first()
    return Token(
        access_token=token,
        workspace_id=workspace.id if workspace else None,
        workspace_slug=workspace.slug if workspace else None,
        gym_name=workspace.name if workspace else None,
        role="SUPER_ADMIN" if user.is_superadmin else (membership.role.value if membership else "STAFF"),
    )


@router.post(
    "/register/member", response_model=Token, status_code=status.HTTP_201_CREATED
)
def register_member(req: MemberRegisterRequest, db: Session = Depends(get_db)):
    _, workspace, token = AuthService(db).register_member(req)
    return Token(
        access_token=token,
        workspace_id=workspace.id,
        workspace_slug=workspace.slug,
        gym_name=workspace.name,
        role="USER"
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    tenant: TenantContext = Depends(get_current_tenant), db: Session = Depends(get_db)
):
    if not tenant.user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    user = db.query(User).filter(User.id == tenant.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    membership = (
        db.query(WorkspaceMember)
        .filter(WorkspaceMember.user_id == user.id, WorkspaceMember.is_active == True)
        .first()
    )
    workspace = membership.workspace if membership else None
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        is_superadmin=user.is_superadmin,
        is_active=user.is_active,
        role="SUPER_ADMIN" if user.is_superadmin else (membership.role.value if membership else "STAFF"),
        workspace_id=membership.workspace_id if membership else None,
        workspace_slug=workspace.slug if workspace else None,
        gym_name=workspace.name if workspace else None,
        preferred_language=getattr(user, "preferred_language", "en") or "en",
    )


class LanguageUpdateRequest(BaseModel):
    language: str


@router.put("/me/language")
def update_user_language(
    req: LanguageUpdateRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    valid_languages = ["en", "ta", "ml", "kn", "te"]
    lang = req.language.lower().strip()
    if lang not in valid_languages:
        lang = "en"

    user = db.query(User).filter(User.id == tenant.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.preferred_language = lang
    db.commit()
    return {"status": "success", "language": lang}


@router.post("/forgot-password")
def forgot_password(req: PasswordResetRequest):
    return {"message": f"Password reset instructions have been sent to {req.email}"}


@router.post("/logout")
def logout():
    return {"status": "success", "message": "Successfully logged out"}


@router.get("/check-availability")
def check_availability(
    email: str = None,
    phone: str = None,
    slug: str = None,
    db: Session = Depends(get_db)
):
    from app.models.member import Member
    from app.models.trainer import Trainer

    email_exists = False
    phone_exists = False
    slug_exists = False

    if slug and slug.strip():
        clean_slug = slug.strip().lower()
        reserved_slugs = {
            "api", "superadmin", "auth", "onboarding", "admin", "dashboard",
            "billing", "settings", "login", "register", "pricing", "help",
            "docs", "site", "features", "solutions", "contact", "about"
        }
        if clean_slug in reserved_slugs:
            slug_exists = True
        else:
            w_match = db.query(Workspace).filter(func.lower(Workspace.slug) == clean_slug).first()
            if w_match:
                slug_exists = True

    if email and email.strip():
        clean_email = email.strip().lower()
        u = db.query(User).filter(func.lower(User.email) == clean_email).first()
        if u:
            if u.is_superadmin:
                email_exists = True
            else:
                has_workspaces = db.query(WorkspaceMember).filter(WorkspaceMember.user_id == u.id).count() > 0
                if has_workspaces:
                    email_exists = True
                else:
                    # Clean up orphaned user record whose gym was deleted
                    db.delete(u)
                    db.commit()

        if not email_exists and (
            db.query(Member).filter(func.lower(Member.email) == clean_email).first()
            or db.query(Trainer).filter(func.lower(Trainer.email) == clean_email).first()
        ):
            email_exists = True

    if phone and phone.strip():
        clean_phone = phone.strip()
        # strip common spaces or dashes
        digits_phone = "".join(filter(str.isdigit, clean_phone))
        if len(digits_phone) >= 7:
            user_match = db.query(User).filter(User.phone.like(f"%{digits_phone[-10:]}%")).first()
            if user_match:
                if user_match.is_superadmin or db.query(WorkspaceMember).filter(WorkspaceMember.user_id == user_match.id).count() > 0:
                    phone_exists = True
                else:
                    db.delete(user_match)
                    db.commit()
            if not phone_exists:
                member_match = db.query(Member).filter(Member.phone.like(f"%{digits_phone[-10:]}%")).first()
                trainer_match = db.query(Trainer).filter(Trainer.phone.like(f"%{digits_phone[-10:]}%")).first()
                if member_match or trainer_match:
                    phone_exists = True

    return {
        "email_exists": email_exists,
        "phone_exists": phone_exists,
        "slug_exists": slug_exists,
        "email_message": "Email is already registered" if email_exists else None,
        "phone_message": "Mobile number is already registered" if phone_exists else None,
        "slug_message": "Workspace URL is already taken" if slug_exists else None,
    }

