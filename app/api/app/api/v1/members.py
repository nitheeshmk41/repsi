from typing import Optional, List, Dict, Any
from datetime import date, timedelta
import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Response, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.member import Member, MemberStatus, Membership, MembershipPlan
from app.models.user import User, WorkspaceMember, UserRole
from app.schemas.member import MemberCreate, MemberUpdate, MemberResponse, MemberListResponse
from app.repositories.member import MemberRepository
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/members", tags=["Members"])


@router.get("/", response_model=MemberListResponse)
def list_members(
    query: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = MemberRepository(db, tenant.workspace_id)
    skip = (page - 1) * page_size
    items = repo.search(query=query or "", status=status, skip=skip, limit=page_size)
    total = repo.count()
    return MemberListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/export-csv")
def export_members_csv(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = MemberRepository(db, tenant.workspace_id)
    members = repo.get_multi(limit=5000)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "First Name", "Last Name", "Email", "Phone", "Gender", "Status", "Joined Date", "Emergency Contact"])
    for m in members:
        writer.writerow([
            m.id,
            m.first_name,
            m.last_name,
            m.email,
            m.phone,
            m.gender or "",
            m.status.value,
            m.joined_date.isoformat() if m.joined_date else "",
            m.emergency_contact or ""
        ])

    today_str = date.today().isoformat()
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=repsi_members_{today_str}.csv"
        }
    )


@router.get("/{id}", response_model=MemberResponse)
def get_member(
    id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = MemberRepository(db, tenant.workspace_id)
    member = repo.get(id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found in this workspace")
    return member


@router.post("/", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
def create_member(
    data: MemberCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = MemberRepository(db, tenant.workspace_id)
    member = repo.create(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        phone=data.phone,
        avatar_url=data.avatar_url,
        gender=data.gender,
        date_of_birth=data.date_of_birth,
        emergency_contact=data.emergency_contact,
        status=MemberStatus.ACTIVE,
        joined_date=date.today(),
        trainer_id=data.trainer_id,
        notes=data.notes
    )

    # Check if a User already exists with this email or phone
    clean_email = data.email.strip().lower()
    clean_phone = data.phone.strip()
    existing_user = db.query(User).filter(
        (func.lower(User.email) == clean_email) | (User.phone == clean_phone)
    ).first()

    if not existing_user:
        user = User(
            email=clean_email,
            full_name=f"{data.first_name} {data.last_name}".strip(),
            hashed_password=get_password_hash(clean_phone or "Password123!"),
            phone=clean_phone,
            is_active=True,
        )
        db.add(user)
        db.flush()
        db.add(WorkspaceMember(
            workspace_id=tenant.workspace_id,
            user_id=user.id,
            role=UserRole.USER,
            is_active=True
        ))
        db.commit()

    return member


@router.put("/{id}", response_model=MemberResponse)
def update_member(
    id: str,
    data: MemberUpdate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = MemberRepository(db, tenant.workspace_id)
    member = repo.get(id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    updated = repo.update(member, **data.model_dump(exclude_unset=True))
    return updated


@router.delete("/{id}")
def delete_member(
    id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = MemberRepository(db, tenant.workspace_id)
    member = repo.remove(id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return {"status": "success", "message": "Member archived successfully"}


def _process_imported_rows(rows: List[Dict[str, Any]], tenant: TenantContext, db: Session) -> Dict[str, Any]:
    imported = 0
    duplicates = 0
    errors = 0
    details = []

    repo = MemberRepository(db, tenant.workspace_id)

    for idx, row in enumerate(rows, start=1):
        # Normalize key names
        normalized = {k.strip().lower().replace(" ", "_"): str(v).strip() for k, v in row.items() if v is not None}
        
        raw_name = normalized.get("name") or normalized.get("full_name") or normalized.get("member_name") or ""
        first_name = normalized.get("first_name") or ""
        last_name = normalized.get("last_name") or ""

        if not first_name and raw_name:
            parts = raw_name.split(None, 1)
            first_name = parts[0]
            last_name = parts[1] if len(parts) > 1 else ""

        if not first_name:
            errors += 1
            details.append({"row": idx, "status": "error", "message": "Missing first name or full name"})
            continue

        raw_phone = normalized.get("phone") or normalized.get("mobile") or normalized.get("phone_number") or ""
        clean_phone = "".join(c for c in raw_phone if c.isdigit() or c == "+")
        if not clean_phone or len(clean_phone) < 7:
            errors += 1
            details.append({"row": idx, "status": "error", "name": f"{first_name} {last_name}", "message": "Invalid phone number"})
            continue

        raw_email = normalized.get("email") or normalized.get("email_address") or ""
        clean_email = raw_email.lower().strip() if raw_email else f"{clean_phone.replace('+', '')}@repsi.internal"

        # Check for existing member in this workspace
        existing = db.query(Member).filter(
            Member.workspace_id == tenant.workspace_id,
            (Member.phone == clean_phone) | (Member.email == clean_email)
        ).first()

        if existing:
            duplicates += 1
            details.append({"row": idx, "status": "skipped", "name": f"{first_name} {last_name}", "message": "Member already exists in this gym"})
            continue

        gender = normalized.get("gender") or "Not Specified"
        plan_name = normalized.get("plan") or normalized.get("membership_plan") or normalized.get("plan_name")
        emergency = normalized.get("emergency_contact") or normalized.get("emergency")

        # Create Member
        new_member = repo.create(
            first_name=first_name,
            last_name=last_name or "-",
            email=clean_email,
            phone=clean_phone,
            gender=gender,
            emergency_contact=emergency,
            status=MemberStatus.ACTIVE,
            joined_date=date.today(),
            notes="Imported via CSV/Bulk Onboarding"
        )

        # Ensure user account
        user = db.query(User).filter(
            (func.lower(User.email) == clean_email) | (User.phone == clean_phone)
        ).first()

        if not user:
            user = User(
                email=clean_email,
                full_name=f"{first_name} {last_name}".strip(),
                hashed_password=get_password_hash(clean_phone or "Password123!"),
                phone=clean_phone,
                is_active=True,
            )
            db.add(user)
            db.flush()

        # Link to workspace
        ws_link = db.query(WorkspaceMember).filter(
            WorkspaceMember.workspace_id == tenant.workspace_id,
            WorkspaceMember.user_id == user.id
        ).first()

        if not ws_link:
            db.add(WorkspaceMember(
                workspace_id=tenant.workspace_id,
                user_id=user.id,
                role=UserRole.USER,
                is_active=True
            ))

        # If a plan was specified, link/create membership
        if plan_name:
            plan = db.query(MembershipPlan).filter(
                MembershipPlan.workspace_id == tenant.workspace_id,
                func.lower(MembershipPlan.name) == plan_name.lower()
            ).first()
            if not plan:
                plan = MembershipPlan(
                    workspace_id=tenant.workspace_id,
                    name=plan_name.title(),
                    price=1499.0,
                    duration_months=1,
                    is_active=True
                )
                db.add(plan)
                db.flush()

            membership = Membership(
                workspace_id=tenant.workspace_id,
                member_id=new_member.id,
                plan_id=plan.id,
                start_date=date.today(),
                end_date=date.today() + timedelta(days=plan.duration_months * 30),
                status=MemberStatus.ACTIVE,
                price_paid=plan.price,
                auto_renew=False
            )
            db.add(membership)

        imported += 1
        details.append({"row": idx, "status": "imported", "name": f"{first_name} {last_name}", "member_id": new_member.id})

    db.commit()
    return {
        "status": "success",
        "total_rows": len(rows),
        "imported": imported,
        "duplicates": duplicates,
        "errors": errors,
        "details": details[:20]  # sample of details
    }


@router.post("/import-csv")
async def import_members_csv(
    file: UploadFile = File(...),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    if tenant.role not in ["OWNER", "ADMIN", "STAFF"]:
        raise HTTPException(status_code=403, detail="Forbidden. Only staff/owners can import members.")

    content = await file.read()
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        text = content.decode("latin1", errors="replace")

    reader = csv.DictReader(io.StringIO(text))
    rows = list(reader)
    if not rows:
        raise HTTPException(status_code=400, detail="CSV file is empty or missing headers.")

    return _process_imported_rows(rows, tenant, db)


@router.post("/import-batch")
def import_members_batch(
    payload: List[Dict[str, Any]],
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    if tenant.role not in ["OWNER", "ADMIN", "STAFF"]:
        raise HTTPException(status_code=403, detail="Forbidden. Only staff/owners can import members.")
    return _process_imported_rows(payload, tenant, db)



