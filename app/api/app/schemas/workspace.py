from typing import Optional
from pydantic import BaseModel, ConfigDict


class WorkspaceCreate(BaseModel):
    name: str
    slug: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: str = "India"
    gym_type: str = "Commercial Fitness"


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    gym_type: Optional[str] = None
    business_types: Optional[str] = None
    business_size: Optional[str] = None
    managed_features: Optional[str] = None
    management_method: Optional[str] = None
    checkin_method: Optional[str] = None
    brand_color: Optional[str] = None
    onboarding_completed: Optional[bool] = None
    onboarding_step: Optional[int] = None


class WorkspaceResponse(BaseModel):
    id: str
    name: str
    slug: str
    logo_url: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    city: Optional[str] = None
    country: str
    gym_type: str
    business_types: Optional[str] = None
    business_size: Optional[str] = None
    managed_features: Optional[str] = None
    management_method: Optional[str] = None
    checkin_method: Optional[str] = None
    brand_color: Optional[str] = None
    onboarding_completed: bool = False
    onboarding_step: int = 1
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
