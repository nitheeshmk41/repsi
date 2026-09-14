from app.core.database import get_db
from app.middleware.tenant import TenantContext, get_current_tenant
from app.models.user import User, WorkspaceMember
from app.schemas.auth import (
    LoginRequest,
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
        role=membership.role.value
        if membership
        else ("SUPER_ADMIN" if user.is_superadmin else "STAFF"),
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
        role=membership.role.value
        if membership
        else ("SUPER_ADMIN" if user.is_superadmin else "STAFF"),
        workspace_id=membership.workspace_id if membership else None,
    )


@router.post("/forgot-password")
def forgot_password(req: PasswordResetRequest):
    return {"message": f"Password reset instructions have been sent to {req.email}"}


@router.post("/logout")
def logout():
    return {"status": "success", "message": "Successfully logged out"}
