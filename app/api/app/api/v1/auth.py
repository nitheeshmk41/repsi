from app.core.database import get_db
from app.middleware.tenant import TenantContext, get_current_tenant
from app.models.user import User, WorkspaceMember
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
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user, workspace, token = auth_service.register(req)
    return Token(access_token=token, workspace_id=workspace.id, role="OWNER")


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
    return Token(access_token=token, workspace_id=workspace.id, role="OWNER")


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
        role="SUPER_ADMIN" if user.is_superadmin else (membership.role.value if membership else "STAFF"),
    )


@router.post(
    "/register/member", response_model=Token, status_code=status.HTTP_201_CREATED
)
def register_member(req: MemberRegisterRequest, db: Session = Depends(get_db)):
    _, workspace, token = AuthService(db).register_member(req)
    return Token(access_token=token, workspace_id=workspace.id, role="USER")


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
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        is_superadmin=user.is_superadmin,
        is_active=user.is_active,
        role="SUPER_ADMIN" if user.is_superadmin else (membership.role.value if membership else "STAFF"),
        workspace_id=membership.workspace_id if membership else None,
    )


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
    db: Session = Depends(get_db)
):
    from app.models.member import Member
    from app.models.trainer import Trainer

    email_exists = False
    phone_exists = False

    if email and email.strip():
        clean_email = email.strip().lower()
        if (
            db.query(User).filter(User.email == clean_email).first()
            or db.query(Member).filter(Member.email == clean_email).first()
            or db.query(Trainer).filter(Trainer.email == clean_email).first()
        ):
            email_exists = True

    if phone and phone.strip():
        clean_phone = phone.strip()
        # strip common spaces or dashes
        digits_phone = "".join(filter(str.isdigit, clean_phone))
        if len(digits_phone) >= 7:
            user_match = db.query(User).filter(User.phone.like(f"%{digits_phone[-10:]}%")).first()
            member_match = db.query(Member).filter(Member.phone.like(f"%{digits_phone[-10:]}%")).first()
            trainer_match = db.query(Trainer).filter(Trainer.phone.like(f"%{digits_phone[-10:]}%")).first()
            if user_match or member_match or trainer_match:
                phone_exists = True

    return {
        "email_exists": email_exists,
        "phone_exists": phone_exists,
        "email_message": "Email is already registered in database" if email_exists else None,
        "phone_message": "Mobile number is already registered in database" if phone_exists else None,
    }
