from typing import Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.member import Member, MemberStatus
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
