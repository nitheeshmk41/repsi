import json
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict, model_validator


class WebsiteUpdate(BaseModel):
    title: Optional[str] = None
    tagline: Optional[str] = None
    headline: Optional[str] = None
    template: Optional[str] = None
    template_id: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    logo_url: Optional[str] = None
    hero_image_url: Optional[str] = None
    about_text: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    opening_hours: Optional[str] = None
    social_links: Optional[str] = None
    sections_config: Optional[str] = None
    sections: Optional[Any] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_website_update(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "headline" in data and not data.get("tagline"):
                data["tagline"] = data["headline"]
            if "template" in data and not data.get("template_id"):
                data["template_id"] = data["template"]
            if "sections" in data and not data.get("sections_config"):
                sec = data["sections"]
                data["sections_config"] = json.dumps(sec) if not isinstance(sec, str) else sec
        return data


class CustomDomainRequest(BaseModel):
    custom_domain: str


class PublicLeadSubmit(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    message: Optional[str] = None
    interested_plan: Optional[str] = None
    source_page: Optional[str] = "Home"


class WebsiteResponse(BaseModel):
    id: str
    workspace_id: str
    subdomain: str
    custom_domain: Optional[str] = None
    custom_domain_status: str
    template_id: str
    template: Optional[str] = None
    is_published: bool
    published_at: Optional[datetime] = None

    title: str
    tagline: Optional[str] = None
    headline: Optional[str] = None
    primary_color: str
    secondary_color: str
    accent_color: str

    logo_url: Optional[str] = None
    hero_image_url: Optional[str] = None
    about_text: Optional[str] = None

    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    opening_hours: Optional[str] = None

    social_links: Optional[str] = None
    sections_config: Optional[str] = None

    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

    views_count: int
    leads_count: int

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def populate_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            data["template"] = data.get("template_id")
            data["headline"] = data.get("tagline")
        elif hasattr(data, "template_id"):
            setattr(data, "template", getattr(data, "template_id", "Modern Fitness"))
            setattr(data, "headline", getattr(data, "tagline", ""))
        return data


class PublicWebsiteData(BaseModel):
    website: WebsiteResponse
    gym_name: str
    template: Optional[str] = None
    headline: Optional[str] = None
    plans: List[dict]
    trainers: List[dict]
    classes: List[dict]

    @model_validator(mode="before")
    @classmethod
    def populate_top_level(cls, data: Any) -> Any:
        if isinstance(data, dict):
            ws = data.get("website")
            if ws:
                if hasattr(ws, "template_id"):
                    data["template"] = getattr(ws, "template_id")
                    data["headline"] = getattr(ws, "tagline")
                elif isinstance(ws, dict):
                    data["template"] = ws.get("template_id")
                    data["headline"] = ws.get("tagline")
        return data
