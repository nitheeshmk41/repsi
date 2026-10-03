from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    workspace_id: str
    user_id: str
    title: str
    message: str
    is_read: bool
    action_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class NotificationCreate(BaseModel):
    user_id: Optional[str] = None
    title: str
    message: str
    action_url: Optional[str] = None


class NotificationListResponse(BaseModel):
    items: List[NotificationResponse]
    total: int
    unread_count: int
