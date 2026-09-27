import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import User, Workspace, WorkspaceMember, UserRole
from app.models.member import Member, MembershipPlan, Membership, MemberStatus
from app.models.attendance import Attendance, AttendanceMethod
from app.models.finance import Payment, Expense, PaymentMethod, PaymentStatus
from app.models.trainer import Trainer, GymClass


def seed_database(db: Session = None, seed_dummy_records: bool = False):
    close_db = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    try:
        # 1. Base Workspace
        workspace = db.query(Workspace).filter(Workspace.slug == "apex-fitness").first()
        if not workspace:
            workspace = Workspace(
                id="ws_apex_fitness_001",
                name="Apex Fitness Club",
                slug="apex-fitness",
                phone="+91 98450 11223",
                email="contact@apexfitness.in",
                address="100 Feet Road, Indiranagar",
                city="Bangalore",
                country="India",
                gym_type="Commercial Fitness",
                is_active=True,
            )
            db.add(workspace)
            db.flush()

        # 2. Seed Real Admin (admin@repsi.app / nitheesh@repsi.app)
        user_admin = db.query(User).filter(User.email == "admin@repsi.app").first()
        if not user_admin:
            user_admin = User(
                id="usr_admin_001",
                email="admin@repsi.app",
                full_name="Super Admin",
                hashed_password=get_password_hash("admin567"),
                phone="+91 99999 00000",
                is_superadmin=True,
                is_active=True,
            )
            db.add(user_admin)
            db.flush()
            db.add(WorkspaceMember(
                workspace_id=workspace.id,
                user_id=user_admin.id,
                role=UserRole.OWNER,
                is_active=True,
            ))

        user_nitheesh = db.query(User).filter(User.email == "nitheesh@repsi.app").first()
        if not user_nitheesh:
            user_nitheesh = User(
                id="usr_nitheesh_001",
                email="nitheesh@repsi.app",
                full_name="Nitheesh",
                hashed_password=get_password_hash("PlatformGodMode2026!"),
                phone="+91 99999 88888",
                is_superadmin=True,
                is_active=True,
            )
            db.add(user_nitheesh)
            db.flush()
            db.add(WorkspaceMember(
                workspace_id=workspace.id,
                user_id=user_nitheesh.id,
                role=UserRole.OWNER,
                is_active=True,
            ))

        # 3. Seed Real Owner (owner@repsi.app & owner@apexfitness.in)
        user_owner = db.query(User).filter(User.email == "owner@repsi.app").first()
        if not user_owner:
            user_owner = User(
                id="usr_owner_001",
                email="owner@repsi.app",
                full_name="Apex Owner",
                hashed_password=get_password_hash("12345678"),
                phone="+91 98450 11223",
                is_superadmin=False,
                is_active=True,
            )
            db.add(user_owner)
            db.flush()
            db.add(WorkspaceMember(
                workspace_id=workspace.id,
                user_id=user_owner.id,
                role=UserRole.OWNER,
                is_active=True,
            ))

        user_apex_owner = db.query(User).filter(User.email == "owner@apexfitness.in").first()
        if not user_apex_owner:
            user_apex_owner = User(
                id="usr_rajesh_001",
                email="owner@apexfitness.in",
                full_name="Rajesh Kumar",
                hashed_password=get_password_hash("ApexFitness2026!"),
                phone="+91 98450 11223",
                is_superadmin=False,
                is_active=True,
            )
            db.add(user_apex_owner)
            db.flush()
            db.add(WorkspaceMember(
                workspace_id=workspace.id,
                user_id=user_apex_owner.id,
                role=UserRole.OWNER,
                is_active=True,
            ))

        # 4. Seed Real Trainer Account (trainer@repsi.app)
        user_trainer = db.query(User).filter(User.email == "trainer@repsi.app").first()
        if not user_trainer:
            user_trainer = User(
                id="usr_trainer_001",
                email="trainer@repsi.app",
                full_name="REPSI Trainer",
                hashed_password=get_password_hash("12345678"),
                phone="+91 99999 66666",
                is_superadmin=False,
                is_active=True,
            )
            db.add(user_trainer)
            db.flush()
            db.add(WorkspaceMember(
                workspace_id=workspace.id,
                user_id=user_trainer.id,
                role=UserRole.TRAINER,
                is_active=True,
            ))

            # Add Trainer Profile in trainers table
            db.add(Trainer(
                id="tr_repsi_001",
                workspace_id=workspace.id,
                user_id=user_trainer.id,
                name="REPSI Trainer",
                email="trainer@repsi.app",
                phone="+91 99999 66666",
                specialization="Fitness & Conditioning",
                hourly_rate=800.0,
                is_active=True,
            ))

        # 5. Seed Real User / Member Account (user@repsi.app)
        user_user = db.query(User).filter(User.email == "user@repsi.app").first()
        if not user_user:
            user_user = User(
                id="usr_user_001",
                email="user@repsi.app",
                full_name="REPSI Member User",
                hashed_password=get_password_hash("12345678"),
                phone="+91 99999 55555",
                is_superadmin=False,
                is_active=True,
            )
            db.add(user_user)
            db.flush()
            db.add(WorkspaceMember(
                workspace_id=workspace.id,
                user_id=user_user.id,
                role=UserRole.STAFF,
                is_active=True,
            ))

            # Add Member Profile in members table
            db.add(Member(
                id="mem_user_001",
                workspace_id=workspace.id,
                user_id=user_user.id,
                first_name="REPSI",
                last_name="Member",
                email="user@repsi.app",
                phone="+91 99999 55555",
                status=MemberStatus.ACTIVE,
                joined_date=datetime.date.today(),
            ))

        # 6. Seed Default Membership Plans
        plans_data = [
            {"id": "plan_monthly", "name": "Monthly", "duration": 1, "price": 1000.0},
            {"id": "plan_quarterly", "name": "Quarterly", "duration": 3, "price": 2700.0},
            {"id": "plan_half_yearly", "name": "Half-Yearly", "duration": 6, "price": 5000.0},
            {"id": "plan_yearly", "name": "Yearly", "duration": 12, "price": 9000.0},
        ]
        for p in plans_data:
            plan = db.query(MembershipPlan).filter(
                MembershipPlan.workspace_id == workspace.id,
                MembershipPlan.name == p["name"]
            ).first()
            if not plan:
                db.add(MembershipPlan(
                    id=p["id"],
                    workspace_id=workspace.id,
                    name=p["name"],
                    duration_months=p["duration"],
                    price=p["price"],
                    description=f"{p['name']} membership plan with full gym access",
                    is_active=True,
                ))

        if seed_dummy_records:
            # Optional sample records for demo mode
            pass

        db.commit()
        print("✓ REPSI database successfully initialized with clean real accounts (Admin, Owner, Trainer, User).")
    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_database()
