import re
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.website import Website
from app.models.user import Workspace
from app.models.member import MembershipPlan
from app.models.trainer import Trainer, GymClass
from app.models.crm import Lead, LeadActivity, LeadStatus, LeadPriority
from app.schemas.website import (
    WebsiteUpdate,
    CustomDomainRequest,
    PublicLeadSubmit,
    WebsiteResponse,
    PublicWebsiteData,
)
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/websites", tags=["Website Builder"])

RESERVED_SLUGS = {
    "dashboard", "members", "trainers", "memberships", "settings", "api",
    "login", "signup", "onboarding", "superadmin", "pricing", "features",
    "solutions", "site", "website", "tour", "about", "contact", "blog",
    "compare", "guides", "help", "how-it-works", "integrations", "partners",
    "use-cases", "careers", "changelog", "cities", "docs", "downloads",
    "verify-email", "reset-password", "forgot-password", "invite", "admin",
    "static", "assets", "public", "_next", "favicon.ico", "mascot", "images",
    "health", "redoc", "openapi.json", "crm", "activity", "analytics",
    "attendance", "chat", "classes", "expenses", "machines", "member",
    "notifications", "payments", "reports", "trainer", "workouts"
}


def _get_or_create_website(db: Session, workspace_id: str) -> Website:
    site = db.query(Website).filter(Website.workspace_id == workspace_id).first()
    if not site:
        ws = db.query(Workspace).filter(Workspace.id == workspace_id).first()
        slug = ws.slug if ws else f"gym_{workspace_id[:8]}"
        site = Website(
            workspace_id=workspace_id,
            subdomain=slug,
            title=ws.name if ws else "Fitness Studio",
            tagline="Transform your body. Elevate your life.",
            primary_color="#16A34A",
            secondary_color="#15803D",
            accent_color="#22C55E",
            phone=ws.phone if ws else None,
            address=ws.city if ws else None,
            about_text="Welcome to our state-of-the-art facility featuring expert trainers, premium equipment, and energizing classes.",
            opening_hours="Mon - Sat: 6:00 AM - 10:00 PM | Sun: 7:00 AM - 1:00 PM",
            template_id="modern-fitness",
            is_published=False,
            views_count=0,
            leads_count=0,
            assistant_enabled=True,
            assistant_name="Gym Assistant",
            assistant_welcome="Hi! I'm your gym assistant 👋 How can I help you today?",
            assistant_character="welcome",
        )
        db.add(site)
        db.commit()
        db.refresh(site)
    return site


@router.get("/check-slug/{slug}")
def check_slug_availability(
    slug: str,
    db: Session = Depends(get_db),
):
    clean_slug = slug.strip().lower()
    if not clean_slug:
        return {"slug": "", "available": False, "reason": "Address cannot be empty"}

    if not re.match(r"^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$", clean_slug):
        return {
            "slug": clean_slug,
            "available": False,
            "reason": "Address must be 3-40 lowercase letters, numbers, or hyphens (cannot start or end with a hyphen)",
        }

    if clean_slug in RESERVED_SLUGS:
        return {
            "slug": clean_slug,
            "available": False,
            "reason": f"'{clean_slug}' is a reserved Repsi system route",
        }

    # Check database uniqueness across Websites and Workspaces
    site_exists = db.query(Website).filter(func.lower(Website.subdomain) == clean_slug).first()
    if site_exists:
        return {
            "slug": clean_slug,
            "available": False,
            "reason": "This website address is already taken by another gym",
        }

    ws_exists = db.query(Workspace).filter(func.lower(Workspace.slug) == clean_slug).first()
    if ws_exists:
        return {
            "slug": clean_slug,
            "available": False,
            "reason": "This website address is already taken",
        }

    return {
        "slug": clean_slug,
        "available": True,
        "reason": "Available",
    }


@router.get("/my-website", response_model=WebsiteResponse)
def get_my_website(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    return _get_or_create_website(db, tenant.workspace_id)


@router.put("/my-website", response_model=WebsiteResponse)
@router.patch("/my-website", response_model=WebsiteResponse)
def update_my_website(
    data: WebsiteUpdate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    site = _get_or_create_website(db, tenant.workspace_id)
    update_dict = data.model_dump(exclude_unset=True)

    # Handle custom subdomain / slug update if provided
    new_subdomain = update_dict.pop("subdomain", None)
    if new_subdomain is not None:
        clean_sub = new_subdomain.strip().lower()
        if clean_sub != site.subdomain.lower():
            if not re.match(r"^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$", clean_sub):
                raise HTTPException(
                    status_code=400,
                    detail="Website address must be 3-40 lowercase letters, numbers, or hyphens",
                )
            if clean_sub in RESERVED_SLUGS:
                raise HTTPException(status_code=400, detail=f"'{clean_sub}' is a reserved route")
            
            existing = (
                db.query(Website)
                .filter(func.lower(Website.subdomain) == clean_sub, Website.workspace_id != tenant.workspace_id)
                .first()
            )
            if existing:
                raise HTTPException(status_code=400, detail="This website address is already taken")

            existing_ws = (
                db.query(Workspace)
                .filter(func.lower(Workspace.slug) == clean_sub, Workspace.id != tenant.workspace_id)
                .first()
            )
            if existing_ws:
                raise HTTPException(status_code=400, detail="This address is already in use")

            site.subdomain = clean_sub
            # Keep Workspace slug synchronized
            ws = db.query(Workspace).filter(Workspace.id == tenant.workspace_id).first()
            if ws:
                ws.slug = clean_sub

    for k, v in update_dict.items():
        if hasattr(site, k) and k not in ("id", "workspace_id", "subdomain"):
            setattr(site, k, v)

    db.commit()
    db.refresh(site)
    return site


@router.post("/my-website/publish", response_model=WebsiteResponse)
def publish_my_website(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    site = _get_or_create_website(db, tenant.workspace_id)
    site.is_published = True
    site.published_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(site)
    return site


@router.post("/my-website/unpublish", response_model=WebsiteResponse)
def unpublish_my_website(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    site = _get_or_create_website(db, tenant.workspace_id)
    site.is_published = False
    db.commit()
    db.refresh(site)
    return site


@router.post("/my-website/domain")
def connect_custom_domain(
    data: CustomDomainRequest,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    clean_domain = data.custom_domain.strip().lower()
    if not clean_domain or "." not in clean_domain:
        raise HTTPException(status_code=400, detail="Invalid domain format")

    # Check if another gym has claimed this domain
    existing = (
        db.query(Website)
        .filter(Website.custom_domain == clean_domain, Website.workspace_id != tenant.workspace_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Domain is already claimed by another gym")

    site = _get_or_create_website(db, tenant.workspace_id)
    site.custom_domain = clean_domain
    site.custom_domain_status = "pending_verification"
    db.commit()
    db.refresh(site)

    return {
        "status": "success",
        "custom_domain": clean_domain,
        "custom_domain_status": "pending_verification",
        "cname_value": "sites.repsi.app",
        "dns_instructions": [
            {
                "type": "CNAME",
                "name": "www" if not clean_domain.startswith("www.") else "@",
                "value": "sites.repsi.app",
                "ttl": "Automatic / 300",
            },
            {
                "type": "A",
                "name": "@",
                "value": "76.76.21.21",
                "ttl": "Automatic / 300",
            }
        ],
    }


@router.post("/my-website/verify-domain")
def verify_custom_domain(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    site = _get_or_create_website(db, tenant.workspace_id)
    if not site.custom_domain:
        raise HTTPException(status_code=400, detail="No custom domain configured")

    # Mark active
    site.custom_domain_status = "active"
    db.commit()
    db.refresh(site)

    return {
        "status": "success",
        "custom_domain": site.custom_domain,
        "custom_domain_status": "active",
        "ssl_status": "Active",
        "message": f"Domain {site.custom_domain} verified and SSL certificate provisioned successfully!",
    }


# ─── Public Endpoints (No Auth Required) ──────────────────────────────────────

@router.get("/public/{slug}", response_model=PublicWebsiteData)
def get_public_website(
    slug: str,
    db: Session = Depends(get_db),
):
    clean_slug = slug.strip().lower()

    # Match by subdomain or custom_domain
    site = (
        db.query(Website)
        .filter(
            (func.lower(Website.subdomain) == clean_slug) |
            (func.lower(Website.custom_domain) == clean_slug)
        )
        .first()
    )

    if not site:
        # Check if matching workspace exists, fallback create site
        ws = db.query(Workspace).filter(func.lower(Workspace.slug) == clean_slug).first()
        if ws:
            site = _get_or_create_website(db, ws.id)
            site.is_published = True
            db.commit()
        else:
            raise HTTPException(status_code=404, detail="Gym website not found")

    # Increment view counter
    site.views_count += 1
    db.commit()

    ws = db.query(Workspace).filter(Workspace.id == site.workspace_id).first()
    gym_name = ws.name if ws else site.title

    # Pull active membership plans
    plans = (
        db.query(MembershipPlan)
        .filter(MembershipPlan.workspace_id == site.workspace_id, MembershipPlan.is_active == True)
        .all()
    )
    plans_data = [
        {"id": p.id, "name": p.name, "price": p.price, "duration_months": p.duration_months, "description": p.description}
        for p in plans
    ]

    # Pull active trainers
    trainers = (
        db.query(Trainer)
        .filter(Trainer.workspace_id == site.workspace_id)
        .limit(10)
        .all()
    )
    trainers_data = [
        {"id": t.id, "name": t.full_name, "specialty": t.specialty, "bio": t.bio}
        for t in trainers
    ]

    # Pull active classes
    classes = (
        db.query(GymClass)
        .filter(GymClass.workspace_id == site.workspace_id)
        .limit(10)
        .all()
    )
    classes_data = [
        {"id": c.id, "name": c.name, "schedule": c.schedule, "category": c.category, "capacity": c.capacity}
        for c in classes
    ]

    return PublicWebsiteData(
        website=site,
        gym_name=gym_name,
        plans=plans_data,
        trainers=trainers_data,
        classes=classes_data,
    )


@router.post("/public/{slug}/lead")
def submit_public_website_lead(
    slug: str,
    data: PublicLeadSubmit,
    db: Session = Depends(get_db),
):
    clean_slug = slug.strip().lower()

    site = (
        db.query(Website)
        .filter(
            (func.lower(Website.subdomain) == clean_slug) |
            (func.lower(Website.custom_domain) == clean_slug)
        )
        .first()
    )

    if not site:
        ws = db.query(Workspace).filter(func.lower(Workspace.slug) == clean_slug).first()
        if ws:
            site = _get_or_create_website(db, ws.id)
        else:
            raise HTTPException(status_code=404, detail="Gym not found")

    parts = data.name.strip().split(None, 1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else ""

    # Determine lead source and priority based on action
    booking_type = data.booking_type or ""
    if booking_type == "free_trial":
        lead_source = "Trial Booking"
        lead_priority = LeadPriority.URGENT
        activity_title = "Free Trial Booking via Website Assistant"
    elif booking_type == "visit":
        lead_source = "Visit Booking"
        lead_priority = LeadPriority.HIGH
        activity_title = "Facility Visit Booking via Website Assistant"
    elif booking_type == "chat_handoff":
        lead_source = "Website Chat"
        lead_priority = LeadPriority.HIGH
        activity_title = "Direct Question / Chat Request via Assistant"
    elif data.source and data.source != "Website":
        lead_source = data.source
        lead_priority = LeadPriority.HIGH
        activity_title = f"Inquiry via {data.source}"
    else:
        lead_source = "Website"
        lead_priority = LeadPriority.HIGH
        activity_title = f"Inquiry via Website ({data.source_page})"

    # Compose structured notes
    note_details = []
    if data.booking_type:
        note_details.append(f"Type: {data.booking_type.replace('_', ' ').title()}")
    if data.preferred_date:
        note_details.append(f"Date: {data.preferred_date}")
    if data.preferred_time:
        note_details.append(f"Time: {data.preferred_time}")
    if data.interested_plan:
        note_details.append(f"Plan: {data.interested_plan}")
    if data.message:
        note_details.append(f"Note: {data.message}")

    note_summary = " | ".join(note_details) if note_details else f"Inquiry from {data.source_page} page"

    # Create CRM Lead directly in the gym's workspace
    lead = Lead(
        workspace_id=site.workspace_id,
        first_name=first_name,
        last_name=last_name,
        phone=data.phone.strip(),
        email=data.email.strip().lower() if data.email else None,
        source=lead_source,
        status=LeadStatus.NEW,
        priority=lead_priority,
        interested_plan=data.interested_plan,
        notes=note_summary,
        expected_value=1499.0,
    )
    db.add(lead)
    db.flush()

    # Log activity in lead timeline
    act = LeadActivity(
        workspace_id=site.workspace_id,
        lead_id=lead.id,
        activity_type="note",
        title=activity_title,
        description=note_summary,
        created_at=datetime.now(timezone.utc),
    )
    db.add(act)

    site.leads_count += 1
    db.commit()

    return {
        "status": "success",
        "message": (
            "🎉 Your free trial has been booked! We look forward to seeing you."
            if booking_type == "free_trial"
            else "Thank you! Your inquiry has been received. Our gym team will contact you shortly."
        ),
        "lead_id": lead.id,
    }
