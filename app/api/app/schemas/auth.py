from pydantic import BaseModel, ConfigDict, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    workspace_id: str | None = None
    role: str | None = None


class TokenPayload(BaseModel):
    sub: str | None = None
    workspace_id: str | None = None
    role: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    workspace_slug: str | None = None


class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    gym_name: str
    gym_phone: str | None = None
    gym_city: str | None = None


class RegisterOtpRequest(RegisterRequest):
    pass


class VerifyRegisterOtpRequest(BaseModel):
    email: EmailStr
    otp: str


class ResendRegisterOtpRequest(BaseModel):
    email: EmailStr


class MemberRegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    workspace_slug: str
    phone: str | None = None


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str | None = None
    is_superadmin: bool
    is_active: bool
    role: str | None = None
    workspace_id: str | None = None

    model_config = ConfigDict(from_attributes=True)
