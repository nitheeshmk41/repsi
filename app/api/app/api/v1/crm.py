from typing import Optional, List
from datetime import datetime, date, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.core.database import get_db
from app.models.crm import Lead, LeadActivity, LeadFollowUp, LeadStatus, LeadPriority, FollowUpType, FollowUpStatus
from app.models.member import Member, MemberStatus, Membership, MembershipPlan
from app.models.user import User, WorkspaceMember, UserRole
from app.schemas.crm import (
    LeadCreate,
    LeadUpdate,
    LeadStatusUpdate,
    LeadConvertRequest,
    LeadResponse,
    LeadListResponse,
    LeadFollowUpCreate,
    LeadFollowUpUpdate,
    LeadFollowUpResponse,
    PipelineStageSummary,
    CrmDashboardMetrics,
    AtRiskMemberItem,
)
from app.repositories.crm import CrmRepository
from app.middleware.tenant import get_current_tenant, TenantContext
from app.core.security import get_password_hash

router = APIRouter(prefix="/crm", tags=["CRM"])


def require_crm_access(tenant: TenantContext = Depends(get_current_tenant)) -> TenantContext:
    allowed_roles = {UserRole.OWNER.value, UserRole.SUPER_ADMIN.value, UserRole.ADMIN.value, UserRole.MANAGER.value, UserRole.STAFF.value}
    role_str = tenant.role.value if hasattr(tenant.role, "value") else str(tenant.role)
    if role_str not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CRM access is restricted to gym owners, administrators, and staff."
        )
    return tenant


@router.get("/dashboard", response_model=CrmDashboardMetrics)
def get_crm_dashboard(
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    repo = CrmRepository(db, tenant.workspace_id)
    return repo.get_dashboard_metrics()


@router.get("/pipeline", response_model=List[PipelineStageSummary])
def get_crm_pipeline(
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    repo = CrmRepository(db, tenant.workspace_id)
    pipeline_dict = repo.get_pipeline()

    stages_meta = [
        (LeadStatus.NEW, "New Leads"),
        (LeadStatus.CONTACTED, "Contacted"),
        (LeadStatus.VISIT_SCHEDULED, "Visit Scheduled"),
        (LeadStatus.TRIAL, "Trial Booked"),
        (LeadStatus.NEGOTIATION, "Negotiation"),
        (LeadStatus.CONVERTED, "Converted"),
        (LeadStatus.LOST, "Lost"),
    ]

    result = []
    for stage_enum, stage_title in stages_meta:
        stage_leads = pipeline_dict.get(stage_enum, [])
        total_val = sum(l.expected_value for l in stage_leads)
        result.append(
            PipelineStageSummary(
                stage=stage_enum,
                title=stage_title,
                count=len(stage_leads),
                total_value=total_val,
                leads=stage_leads,
            )
        )
    return result


@router.get("/leads", response_model=LeadListResponse)
def list_leads(
    query: Optional[str] = None,
    status: Optional[str] = None,
    source: Optional[str] = None,
    priority: Optional[str] = None,
    assigned_staff_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    repo = CrmRepository(db, tenant.workspace_id)
    skip = (page - 1) * page_size
    items = repo.search_leads(
        query=query,
        status=status,
        source=source,
        priority=priority,
        assigned_staff_id=assigned_staff_id,
        skip=skip,
        limit=page_size,
    )
    total = repo.count_leads(query=query, status=status, source=source)
    return LeadListResponse(items=items, total=total, page=page, page_size=page_size)


@router.post("/leads", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead(
    data: LeadCreate,
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    repo = CrmRepository(db, tenant.workspace_id)

    # Prevent duplicate lead creation with same phone or email in this gym
    clean_phone = "".join(c for c in (data.phone or "") if c.isdigit() or c == "+")
    clean_email = data.email.strip().lower() if data.email else None

    dup_filters = []
    if clean_phone:
        dup_filters.append(Lead.phone == clean_phone)
    if clean_email:
        dup_filters.append(func.lower(Lead.email) == clean_email)

    if dup_filters:
        existing = repo.scoped_query().filter(Lead.status != LeadStatus.CONVERTED).filter(or_(*dup_filters)).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"An active lead with this {'phone number' if existing.phone == clean_phone else 'email'} already exists in your gym records."
            )

    cols = {c.name for c in Lead.__table__.columns}
    lead_kwargs = {
        k: v for k, v in data.model_dump().items()
        if k in cols and k not in ("id", "workspace_id", "created_at", "updated_at")
    }
    lead = repo.create(**lead_kwargs)

    # Log initial creation activity
    repo.log_activity(
        lead_id=lead.id,
        activity_type="note",
        title="Lead Created",
        description=f"Lead added from source: {lead.source}",
        performed_by_id=tenant.user_id,
    )

    return lead


@router.get("/leads/{id}", response_model=LeadResponse)
def get_lead(
    id: str,
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    repo = CrmRepository(db, tenant.workspace_id)
    lead = repo.get(id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.patch("/leads/{id}", response_model=LeadResponse)
def update_lead(
    id: str,
    data: LeadUpdate,
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    repo = CrmRepository(db, tenant.workspace_id)
    lead = repo.get(id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    cols = {c.name for c in Lead.__table__.columns}
    update_kwargs = {
        k: v for k, v in data.model_dump(exclude_unset=True).items()
        if k in cols and k not in ("id", "workspace_id", "created_at", "updated_at")
    }
    updated = repo.update(lead, **update_kwargs)
    return updated


@router.delete("/leads/{id}")
def delete_lead(
    id: str,
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    repo = CrmRepository(db, tenant.workspace_id)
    lead = repo.get(id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    db.query(LeadFollowUp).filter(
        LeadFollowUp.lead_id == id,
        LeadFollowUp.workspace_id == tenant.workspace_id,
    ).delete(synchronize_session=False)

    db.query(LeadActivity).filter(
        LeadActivity.lead_id == id,
        LeadActivity.workspace_id == tenant.workspace_id,
    ).delete(synchronize_session=False)

    db.delete(lead)
    db.commit()
    return {"status": "success", "message": "Lead deleted successfully"}


@router.patch("/leads/{id}/status", response_model=LeadResponse)
def update_lead_status(
    id: str,
    data: LeadStatusUpdate,
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    repo = CrmRepository(db, tenant.workspace_id)
    lead = repo.get(id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    old_status = lead.status.value
    lead.status = data.status
    if data.lost_reason:
        lead.lost_reason = data.lost_reason
    if data.status == LeadStatus.CONVERTED:
        lead.converted_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(lead)

    # Activity log
    repo.log_activity(
        lead_id=lead.id,
        activity_type="status_change",
        title=f"Stage Changed: {old_status.upper()} → {data.status.value.upper()}",
        description=data.notes or (f"Lost Reason: {data.lost_reason}" if data.lost_reason else None),
        performed_by_id=tenant.user_id,
    )

    return lead


@router.post("/leads/{id}/convert")
def convert_lead_to_member(
    id: str,
    data: LeadConvertRequest,
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    """
    Converts lead to full gym member without creating duplicates.
    Prevents duplicate conversion if lead is already converted.
    If member with same phone or email exists, links the lead.
    Otherwise provisions Member, User account, and initial membership.
    """
    repo = CrmRepository(db, tenant.workspace_id)
    lead = repo.get(id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if lead.status == LeadStatus.CONVERTED or lead.converted_member_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This lead has already been converted to a member."
        )

    clean_phone = "".join(c for c in lead.phone if c.isdigit() or c == "+")
    clean_email = lead.email.strip().lower() if lead.email else f"{clean_phone}@repsi.internal"

    # 1. Duplicate check in this workspace
    existing_member = db.query(Member).filter(
        Member.workspace_id == tenant.workspace_id,
        (Member.phone == clean_phone) | (Member.email == clean_email),
    ).first()

    member_id = None
    was_existing = False

    if existing_member:
        member_id = existing_member.id
        was_existing = True
    else:
        # Create Member
        new_member = Member(
            workspace_id=tenant.workspace_id,
            first_name=lead.first_name,
            last_name=lead.last_name or "-",
            email=clean_email,
            phone=clean_phone,
            gender=lead.gender or "Not Specified",
            status=MemberStatus.ACTIVE,
            joined_date=date.today(),
            notes=f"Converted from CRM Lead #{lead.id}",
        )
        db.add(new_member)
        db.flush()
        member_id = new_member.id

        # Provision user account
        user = db.query(User).filter(
            (func.lower(User.email) == clean_email) | (User.phone == clean_phone)
        ).first()

        raw_password = data.password or lead.phone or "CrmPassword123!"

        if not user:
            user = User(
                email=clean_email or f"{clean_phone}@repsi.internal",
                full_name=f"{lead.first_name} {lead.last_name or ''}".strip(),
                hashed_password=get_password_hash(raw_password),
                phone=clean_phone,
                is_active=True,
            )
            db.add(user)
            db.flush()
        elif data.password:
            user.hashed_password = get_password_hash(data.password)

        new_member.user_id = user.id

        # Link to workspace if not present
        ws_mem = db.query(WorkspaceMember).filter(
            WorkspaceMember.workspace_id == tenant.workspace_id,
            WorkspaceMember.user_id == user.id
        ).first()
        if not ws_mem:
            db.add(WorkspaceMember(
                workspace_id=tenant.workspace_id,
                user_id=user.id,
                role=UserRole.USER,
                is_active=True,
            ))
            db.flush()

    # Link lead
    lead.converted_member_id = member_id
    lead.status = LeadStatus.CONVERTED
    lead.converted_at = datetime.now(timezone.utc)

    # Auto-complete or close any pending follow-ups for this lead
    db.query(LeadFollowUp).filter(
        LeadFollowUp.lead_id == lead.id,
        LeadFollowUp.workspace_id == tenant.workspace_id,
        LeadFollowUp.status == FollowUpStatus.PENDING,
    ).update(
        {LeadFollowUp.status: FollowUpStatus.COMPLETED, LeadFollowUp.completed_at: datetime.now(timezone.utc)},
        synchronize_session=False,
    )

    # Activity log
    repo.log_activity(
        lead_id=lead.id,
        activity_type="conversion",
        title="Converted to Member",
        description="Linked to existing member" if was_existing else "New Member account provisioned",
        performed_by_id=tenant.user_id,
    )

    db.commit()

    return {
        "status": "success",
        "lead_status": "converted",
        "message": "Lead successfully converted to member",
        "member_id": member_id,
        "converted_member_id": member_id,
        "was_existing_member": was_existing,
        "lead_id": lead.id,
    }


@router.get("/follow-ups", response_model=List[LeadFollowUpResponse])
def list_follow_ups(
    status_filter: Optional[str] = None,
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    q = (
        db.query(LeadFollowUp, Lead)
        .outerjoin(Lead, LeadFollowUp.lead_id == Lead.id)
        .filter(LeadFollowUp.workspace_id == tenant.workspace_id)
        .filter((Lead.status != LeadStatus.CONVERTED) | (Lead.id == None))
        .filter((Lead.converted_member_id == None) | (Lead.id == None))
    )

    if status_filter and status_filter != "all":
        q = q.filter(LeadFollowUp.status == status_filter)

    records = q.order_by(LeadFollowUp.scheduled_at.asc()).limit(100).all()

    items = []
    for fu, lead in records:
        items.append(
            LeadFollowUpResponse(
                id=fu.id,
                workspace_id=fu.workspace_id,
                lead_id=fu.lead_id,
                member_id=fu.member_id,
                lead_name=f"{lead.first_name} {lead.last_name}".strip() if lead else "Member",
                lead_phone=lead.phone if lead else None,
                follow_up_type=fu.follow_up_type,
                scheduled_at=fu.scheduled_at,
                status=fu.status,
                notes=fu.notes,
                assigned_to_id=fu.assigned_to_id,
                completed_at=fu.completed_at,
            )
        )
    return items


@router.post("/follow-ups", response_model=LeadFollowUpResponse, status_code=status.HTTP_201_CREATED)
def create_follow_up(
    data: LeadFollowUpCreate,
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    # Exclude converted leads from follow-up scheduling
    if data.lead_id:
        lead = db.query(Lead).filter(Lead.id == data.lead_id, Lead.workspace_id == tenant.workspace_id).first()
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        if lead.status == LeadStatus.CONVERTED or lead.converted_member_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot schedule follow-up for an already converted lead."
            )

    fu = LeadFollowUp(
        workspace_id=tenant.workspace_id,
        lead_id=data.lead_id,
        member_id=data.member_id,
        follow_up_type=data.follow_up_type,
        scheduled_at=data.scheduled_at,
        status=FollowUpStatus.PENDING,
        notes=data.notes,
        assigned_to_id=data.assigned_to_id,
    )
    db.add(fu)

    # Update next_follow_up_at on lead if applicable
    if data.lead_id:
        lead = db.query(Lead).filter(Lead.id == data.lead_id, Lead.workspace_id == tenant.workspace_id).first()
        if lead:
            lead.next_follow_up_at = data.scheduled_at
            # Log activity
            act = LeadActivity(
                workspace_id=tenant.workspace_id,
                lead_id=lead.id,
                activity_type="call" if data.follow_up_type == FollowUpType.CALL else "note",
                title=f"Follow-up Scheduled: {data.follow_up_type.value.upper()}",
                description=data.notes or f"Scheduled for {data.scheduled_at.strftime('%d %b %Y, %I:%M %p')}",
                performed_by_id=tenant.user_id,
            )
            db.add(act)

    db.commit()
    db.refresh(fu)

    return LeadFollowUpResponse(
        id=fu.id,
        workspace_id=fu.workspace_id,
        lead_id=fu.lead_id,
        member_id=fu.member_id,
        follow_up_type=fu.follow_up_type,
        scheduled_at=fu.scheduled_at,
        status=fu.status,
        notes=fu.notes,
        assigned_to_id=fu.assigned_to_id,
        completed_at=fu.completed_at,
    )


@router.patch("/follow-ups/{id}", response_model=LeadFollowUpResponse)
def update_follow_up(
    id: str,
    data: LeadFollowUpUpdate,
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    fu = db.query(LeadFollowUp).filter(
        LeadFollowUp.id == id,
        LeadFollowUp.workspace_id == tenant.workspace_id,
    ).first()
    if not fu:
        raise HTTPException(status_code=404, detail="Follow-up task not found")

    fu.status = data.status
    if data.notes:
        fu.notes = data.notes
    if data.status == FollowUpStatus.COMPLETED:
        fu.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(fu)

    return LeadFollowUpResponse(
        id=fu.id,
        workspace_id=fu.workspace_id,
        lead_id=fu.lead_id,
        member_id=fu.member_id,
        follow_up_type=fu.follow_up_type,
        scheduled_at=fu.scheduled_at,
        status=fu.status,
        notes=fu.notes,
        assigned_to_id=fu.assigned_to_id,
        completed_at=fu.completed_at,
    )


@router.get("/at-risk", response_model=List[AtRiskMemberItem])
def get_at_risk_members(
    tenant: TenantContext = Depends(require_crm_access),
    db: Session = Depends(get_db),
):
    repo = CrmRepository(db, tenant.workspace_id)
    return repo.get_at_risk_members()
