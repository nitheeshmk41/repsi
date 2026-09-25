from datetime import datetime, timezone, date
from typing import List, Optional, Tuple
from fastapi import HTTPException, status
from sqlalchemy import func, or_, and_
from sqlalchemy.orm import Session

from app.models.trainer import (
    Trainer,
    TrainerStatus,
    TrainerClient,
    TrainerClientStatus,
    TrainingSession,
    SessionStatus,
    ClientNote,
    GymClass,
)
from app.models.member import Member, MemberStatus
from app.models.workout import Workout, WorkoutStatus
from app.models.user import User, WorkspaceMember, UserRole
from app.models.invitation import GymInvitation, InvitationRole, InvitationStatus
from app.models.system import Notification
from app.middleware.tenant import TenantContext


class TrainerService:
    def __init__(self, db: Session, tenant: TenantContext):
        self.db = db
        self.tenant = tenant

    def get_trainer_for_user(self, user_id: str) -> Optional[Trainer]:
        """
        Retrieves the Trainer profile corresponding to user_id in the current workspace.
        """
        return (
            self.db.query(Trainer)
            .filter(
                Trainer.workspace_id == self.tenant.workspace_id,
                Trainer.user_id == user_id,
            )
            .first()
        )

    def get_or_create_trainer_profile_for_user(self, user_id: str) -> Trainer:
        """
        Retrieves or provisions a Trainer profile for a user with TRAINER role.
        """
        trainer = self.get_trainer_for_user(user_id)
        if trainer:
            return trainer

        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User account not found.")

        trainer = Trainer(
            workspace_id=self.tenant.workspace_id,
            user_id=user.id,
            name=user.full_name,
            email=user.email,
            phone=user.phone or "",
            specialization="Personal Trainer",
            status=TrainerStatus.ACTIVE,
            is_active=True,
        )
        self.db.add(trainer)
        self.db.commit()
        self.db.refresh(trainer)
        return trainer

    def verify_trainer_access(self, target_trainer_id: Optional[str] = None) -> Trainer:
        """
        Enforces role-based & relationship access:
        - OWNER / SUPER_ADMIN / ADMIN / MANAGER can perform actions on behalf of any trainer.
        - TRAINER role can only access their own trainer record.
        """
        user_role = self.tenant.role
        if user_role in ["OWNER", "SUPER_ADMIN", "ADMIN", "MANAGER"]:
            if target_trainer_id:
                trainer = (
                    self.db.query(Trainer)
                    .filter(
                        Trainer.workspace_id == self.tenant.workspace_id,
                        Trainer.id == target_trainer_id,
                    )
                    .first()
                )
                if not trainer:
                    raise HTTPException(status_code=404, detail="Trainer not found.")
                return trainer

        # Must be logged in trainer
        trainer = self.get_trainer_for_user(self.tenant.user_id)
        if not trainer:
            # Fallback if workspace member is TRAINER role but missing Trainer record
            ws_member = (
                self.db.query(WorkspaceMember)
                .filter(
                    WorkspaceMember.workspace_id == self.tenant.workspace_id,
                    WorkspaceMember.user_id == self.tenant.user_id,
                    WorkspaceMember.is_active == True,
                )
                .first()
            )
            if ws_member and ws_member.role == UserRole.TRAINER:
                trainer = self.get_or_create_trainer_profile_for_user(self.tenant.user_id)
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied. Trainer profile required.",
                )

        if target_trainer_id and trainer.id != target_trainer_id and user_role not in ["OWNER", "SUPER_ADMIN"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You can only manage your own trainer data.",
            )

        if trainer.status in [TrainerStatus.SUSPENDED, TrainerStatus.REMOVED, TrainerStatus.INACTIVE] or not trainer.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Trainer profile is currently {trainer.status.value.lower()}.",
            )

        return trainer


    def verify_client_access(self, client_id: str, target_trainer_id: Optional[str] = None) -> Member:
        """
        Verifies that:
        1. Member belongs to current workspace.
        2. If caller is TRAINER, they have an active relationship with client (or caller is OWNER).
        """
        member = (
            self.db.query(Member)
            .filter(
                Member.workspace_id == self.tenant.workspace_id,
                Member.id == client_id,
            )
            .first()
        )
        if not member:
            raise HTTPException(status_code=404, detail="Client / Member not found.")

        user_role = self.tenant.role
        if user_role in ["OWNER", "SUPER_ADMIN", "ADMIN", "MANAGER"]:
            return member

        # Caller is trainer
        trainer = self.verify_trainer_access(target_trainer_id)
        relationship = (
            self.db.query(TrainerClient)
            .filter(
                TrainerClient.workspace_id == self.tenant.workspace_id,
                TrainerClient.trainer_id == trainer.id,
                TrainerClient.client_id == client_id,
                TrainerClient.status == TrainerClientStatus.ACTIVE,
            )
            .first()
        )
        if not relationship:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Client is not assigned to you.",
            )

        return member

    # Owner Management Operations
    def list_trainers(self) -> List[dict]:
        """
        Lists trainers in workspace with assigned clients count and today's sessions count.
        """
        trainers = (
            self.db.query(Trainer)
            .filter(
                Trainer.workspace_id == self.tenant.workspace_id,
                Trainer.status != TrainerStatus.REMOVED,
            )
            .all()
        )

        today_start = datetime.now(timezone.utc).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        today_end = today_start.replace(hour=23, minute=59, second=59)

        res = []
        for t in trainers:
            clients_count = (
                self.db.query(TrainerClient)
                .filter(
                    TrainerClient.workspace_id == self.tenant.workspace_id,
                    TrainerClient.trainer_id == t.id,
                    TrainerClient.status == TrainerClientStatus.ACTIVE,
                )
                .count()
            )

            today_sessions_count = (
                self.db.query(TrainingSession)
                .filter(
                    TrainingSession.workspace_id == self.tenant.workspace_id,
                    TrainingSession.trainer_id == t.id,
                    TrainingSession.scheduled_at >= today_start,
                    TrainingSession.scheduled_at <= today_end,
                )
                .count()
            )

            t_dict = {
                "id": t.id,
                "workspace_id": t.workspace_id,
                "user_id": t.user_id,
                "name": t.name,
                "phone": t.phone,
                "email": t.email,
                "specialization": t.specialization,
                "bio": t.bio,
                "hourly_rate": t.hourly_rate,
                "commission_percentage": t.commission_percentage,
                "status": t.status,
                "is_active": t.is_active,
                "profile_photo": t.profile_photo,
                "experience": t.experience,
                "joining_date": t.joining_date,
                "certifications": t.certifications,
                "working_hours": t.working_hours,
                "emergency_contact": t.emergency_contact,
                "assigned_clients_count": clients_count,
                "today_sessions_count": today_sessions_count,
                "created_at": t.created_at,
            }
            res.append(t_dict)
        return res

    def assign_client_to_trainer(
        self, trainer_id: str, client_id: str, notes: Optional[str] = None
    ) -> TrainerClient:
        """
        Assigns client to trainer in current workspace.
        """
        trainer = (
            self.db.query(Trainer)
            .filter(
                Trainer.workspace_id == self.tenant.workspace_id,
                Trainer.id == trainer_id,
            )
            .first()
        )
        if not trainer:
            raise HTTPException(status_code=404, detail="Trainer not found.")

        member = (
            self.db.query(Member)
            .filter(
                Member.workspace_id == self.tenant.workspace_id,
                Member.id == client_id,
            )
            .first()
        )
        if not member:
            raise HTTPException(status_code=404, detail="Client / Member not found.")

        # Check existing relationship
        existing = (
            self.db.query(TrainerClient)
            .filter(
                TrainerClient.workspace_id == self.tenant.workspace_id,
                TrainerClient.trainer_id == trainer_id,
                TrainerClient.client_id == client_id,
            )
            .first()
        )

        now = datetime.now(timezone.utc)
        if existing:
            existing.status = TrainerClientStatus.ACTIVE
            existing.assigned_by = self.tenant.user_id
            existing.assigned_at = now
            existing.ended_at = None
            if notes:
                existing.notes = notes
            relationship = existing
        else:
            relationship = TrainerClient(
                workspace_id=self.tenant.workspace_id,
                trainer_id=trainer_id,
                client_id=client_id,
                status=TrainerClientStatus.ACTIVE,
                assigned_by=self.tenant.user_id,
                assigned_at=now,
                started_at=now,
                notes=notes,
            )
            self.db.add(relationship)

        # Update member.trainer_id for backward compatibility
        member.trainer_id = trainer_id

        # Send notification to trainer if user_id linked
        if trainer.user_id:
            notif = Notification(
                workspace_id=self.tenant.workspace_id,
                user_id=trainer.user_id,
                title="New Client Assigned",
                message=f"{member.first_name} {member.last_name} has been assigned to your training list.",
            )
            self.db.add(notif)

        self.db.commit()
        self.db.refresh(relationship)
        return relationship

    def unassign_client_from_trainer(self, trainer_id: str, client_id: str) -> None:
        relationship = (
            self.db.query(TrainerClient)
            .filter(
                TrainerClient.workspace_id == self.tenant.workspace_id,
                TrainerClient.trainer_id == trainer_id,
                TrainerClient.client_id == client_id,
            )
            .first()
        )
        if relationship:
            relationship.status = TrainerClientStatus.ENDED
            relationship.ended_at = datetime.now(timezone.utc)

            # Clear member.trainer_id if it matched
            member = self.db.query(Member).filter(Member.id == client_id).first()
            if member and member.trainer_id == trainer_id:
                member.trainer_id = None

            self.db.commit()

    def get_assigned_clients(
        self, trainer_id: str, search: Optional[str] = None, filter_status: Optional[str] = None
    ) -> List[dict]:
        """
        Retrieves list of clients assigned to a trainer with client overview details.
        """
        query = (
            self.db.query(TrainerClient, Member)
            .join(Member, TrainerClient.client_id == Member.id)
            .filter(
                TrainerClient.workspace_id == self.tenant.workspace_id,
                TrainerClient.trainer_id == trainer_id,
            )
        )

        if filter_status and filter_status != "all":
            if filter_status.upper() in TrainerClientStatus.__members__:
                query = query.filter(TrainerClient.status == TrainerClientStatus[filter_status.upper()])
        else:
            query = query.filter(TrainerClient.status == TrainerClientStatus.ACTIVE)

        results = query.all()

        client_list = []
        for tc, member in results:
            full_name = f"{member.first_name} {member.last_name}".strip()
            if search:
                s_lower = search.lower()
                if s_lower not in full_name.lower() and s_lower not in member.phone and s_lower not in member.email.lower():
                    continue

            # Fetch last workout
            last_workout = (
                self.db.query(Workout)
                .filter(
                    Workout.workspace_id == self.tenant.workspace_id,
                    Workout.member_id == member.id,
                )
                .order_by(Workout.created_at.desc())
                .first()
            )

            # Fetch next scheduled workout or session
            next_session = (
                self.db.query(TrainingSession)
                .filter(
                    TrainingSession.workspace_id == self.tenant.workspace_id,
                    TrainingSession.client_id == member.id,
                    TrainingSession.scheduled_at >= datetime.now(timezone.utc),
                    TrainingSession.status == SessionStatus.SCHEDULED,
                )
                .order_by(TrainingSession.scheduled_at.asc())
                .first()
            )

            client_list.append({
                "relationship_id": tc.id,
                "client_id": member.id,
                "name": full_name,
                "email": member.email,
                "phone": member.phone,
                "avatar_url": member.avatar_url,
                "gender": member.gender,
                "date_of_birth": member.date_of_birth,
                "membership_status": member.status.value,
                "relationship_status": tc.status.value,
                "assigned_at": tc.assigned_at,
                "last_workout": {
                    "title": last_workout.title,
                    "date": last_workout.scheduled_date or last_workout.created_at,
                    "status": last_workout.status.value,
                    "completion_percentage": last_workout.completion_percentage,
                } if last_workout else None,
                "next_session": {
                    "title": next_session.title,
                    "scheduled_at": next_session.scheduled_at,
                } if next_session else None,
            })

        return client_list
