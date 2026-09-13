import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import User, Workspace, WorkspaceMember, UserRole
from app.models.member import Member, MembershipPlan, Membership, MemberStatus
from app.models.attendance import Attendance, AttendanceMethod
from app.models.finance import Payment, Expense, PaymentMethod, PaymentStatus
from app.models.trainer import Trainer, GymClass


def seed_database(db: Session = None):
    close_db = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    try:
        # Check if workspace already exists
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

        # Seed Owner User
        user = db.query(User).filter(User.email == "owner@apexfitness.in").first()
        if not user:
            user = User(
                id="usr_rajesh_001",
                email="owner@apexfitness.in",
                full_name="Rajesh Kumar",
                hashed_password=get_password_hash("Password123!"),
                phone="+91 98450 11223",
                is_superadmin=False,
                is_active=True,
            )
            db.add(user)
            db.flush()

            # Assign Owner to Workspace
            ws_member = WorkspaceMember(
                workspace_id=workspace.id,
                user_id=user.id,
                role=UserRole.OWNER,
                is_active=True,
            )
            db.add(ws_member)

        # Seed Nitheesh Admin User
        user_nitheesh = db.query(User).filter(User.email == "nitheesh@repsi.app").first()
        if not user_nitheesh:
            user_nitheesh = User(
                id="usr_nitheesh_001",
                email="nitheesh@repsi.app",
                full_name="Nitheesh",
                hashed_password=get_password_hash("AdminPass123!"),
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

        # Seed Membership Plans
        plans_data = [
            {"id": "plan_monthly", "name": "Monthly", "duration": 1, "price": 1000.0},
            {"id": "plan_quarterly", "name": "Quarterly", "duration": 3, "price": 2700.0},
            {"id": "plan_half_yearly", "name": "Half-Yearly", "duration": 6, "price": 5000.0},
            {"id": "plan_yearly", "name": "Yearly", "duration": 12, "price": 9000.0},
        ]
        plans_map = {}
        for p in plans_data:
            plan = db.query(MembershipPlan).filter(
                MembershipPlan.workspace_id == workspace.id,
                MembershipPlan.name == p["name"]
            ).first()
            if not plan:
                plan = MembershipPlan(
                    id=p["id"],
                    workspace_id=workspace.id,
                    name=p["name"],
                    duration_months=p["duration"],
                    price=p["price"],
                    description=f"{p['name']} membership plan with full gym access",
                    is_active=True,
                )
                db.add(plan)
                db.flush()
            plans_map[p["name"]] = plan

        # Seed Members (matching Arun, Rahul, Karthik in spec)
        members_data = [
            {
                "id": "mem_arun_001",
                "first_name": "Arun",
                "last_name": "Kumar",
                "email": "arun@example.com",
                "phone": "+91 98450 11001",
                "status": MemberStatus.ACTIVE,
                "plan": "Monthly",
                "price": 1000.0,
            },
            {
                "id": "mem_rahul_002",
                "first_name": "Rahul",
                "last_name": "Verma",
                "email": "rahul@example.com",
                "phone": "+91 98450 22002",
                "status": MemberStatus.ACTIVE,
                "plan": "Yearly",
                "price": 9000.0,
            },
            {
                "id": "mem_karthik_003",
                "first_name": "Karthik",
                "last_name": "Raja",
                "email": "karthik@example.com",
                "phone": "+91 98450 33003",
                "status": MemberStatus.EXPIRING,
                "plan": "Monthly",
                "price": 1000.0,
            },
            {
                "id": "mem_priya_004",
                "first_name": "Priya",
                "last_name": "Venkat",
                "email": "priya@example.com",
                "phone": "+91 98450 44004",
                "status": MemberStatus.ACTIVE,
                "plan": "Quarterly",
                "price": 2700.0,
            },
            {
                "id": "mem_ananya_005",
                "first_name": "Ananya",
                "last_name": "Krishnan",
                "email": "ananya@example.com",
                "phone": "+91 98450 55005",
                "status": MemberStatus.ACTIVE,
                "plan": "Half-Yearly",
                "price": 5000.0,
            },
        ]

        members_map = {}
        today = datetime.date.today()
        for m in members_data:
            member = db.query(Member).filter(Member.workspace_id == workspace.id, Member.email == m["email"]).first()
            if not member:
                member = Member(
                    id=m["id"],
                    workspace_id=workspace.id,
                    first_name=m["first_name"],
                    last_name=m["last_name"],
                    email=m["email"],
                    phone=m["phone"],
                    status=m["status"],
                    joined_date=today - datetime.timedelta(days=30),
                )
                db.add(member)
                db.flush()

                # Add Membership
                plan_obj = plans_map.get(m["plan"])
                if plan_obj:
                    membership = Membership(
                        workspace_id=workspace.id,
                        member_id=member.id,
                        plan_id=plan_obj.id,
                        start_date=today - datetime.timedelta(days=15),
                        end_date=today + datetime.timedelta(days=15 if m["status"] == MemberStatus.EXPIRING else 300),
                        status=m["status"],
                        price_paid=m["price"],
                        auto_renew=True,
                    )
                    db.add(membership)

            members_map[m["first_name"]] = member

        # Seed Today's Attendance
        if members_map.get("Arun"):
            arun = members_map["Arun"]
            att_check = db.query(Attendance).filter(
                Attendance.workspace_id == workspace.id,
                Attendance.member_id == arun.id
            ).first()
            if not att_check:
                now_time = datetime.datetime.now(datetime.timezone.utc)
                db.add(Attendance(
                    workspace_id=workspace.id,
                    member_id=arun.id,
                    check_in_time=now_time - datetime.timedelta(hours=1, minutes=23),
                    check_out_time=now_time,
                    method=AttendanceMethod.QR,
                ))

        # Seed Payments
        if members_map.get("Arun"):
            arun = members_map["Arun"]
            pay_check = db.query(Payment).filter(
                Payment.workspace_id == workspace.id,
                Payment.member_id == arun.id
            ).first()
            if not pay_check:
                db.add(Payment(
                    workspace_id=workspace.id,
                    member_id=arun.id,
                    amount=1000.0,
                    currency="INR",
                    method=PaymentMethod.UPI,
                    status=PaymentStatus.SUCCESS,
                    transaction_ref="UPI/9845011001/HDFC",
                    paid_at=datetime.datetime.now(datetime.timezone.utc),
                ))

        # Seed Expenses (matching spec: Electricity ₹12,000, Equipment ₹35,000, Rent ₹50,000, Maintenance ₹8,000)
        expenses_data = [
            {"title": "Facility Rent", "category": "Rent", "amount": 50000.0, "vendor": "Indiranagar Realties"},
            {"title": "Commercial Equipment EMI", "category": "Equipment", "amount": 35000.0, "vendor": "Jerai Fitness"},
            {"title": "HVAC Electricity Bill", "category": "Electricity", "amount": 12000.0, "vendor": "BESCOM"},
            {"title": "Facility Maintenance & Hygiene", "category": "Maintenance", "amount": 8000.0, "vendor": "CleanPro"},
        ]
        for exp in expenses_data:
            exp_check = db.query(Expense).filter(
                Expense.workspace_id == workspace.id,
                Expense.title == exp["title"]
            ).first()
            if not exp_check:
                db.add(Expense(
                    workspace_id=workspace.id,
                    category=exp["category"],
                    title=exp["title"],
                    amount=exp["amount"],
                    vendor=exp["vendor"],
                    expense_date=today,
                ))

        # Seed Trainers: Anu (Yoga), Vikram (Strength)
        trainers_data = [
            {"name": "Anu", "specialization": "Yoga & Mobility", "phone": "+91 98450 77701"},
            {"name": "Vikram", "specialization": "Strength & Conditioning", "phone": "+91 98450 77702"},
        ]
        for tr in trainers_data:
            tr_check = db.query(Trainer).filter(
                Trainer.workspace_id == workspace.id,
                Trainer.name == tr["name"]
            ).first()
            if not tr_check:
                trainer_obj = Trainer(
                    workspace_id=workspace.id,
                    name=tr["name"],
                    phone=tr["phone"],
                    specialization=tr["specialization"],
                    hourly_rate=800.0,
                    is_active=True,
                )
                db.add(trainer_obj)
                db.flush()

                # If Anu, seed Yoga class
                if tr["name"] == "Anu":
                    db.add(GymClass(
                        workspace_id=workspace.id,
                        trainer_id=trainer_obj.id,
                        name="Yoga Flow",
                        schedule="06:00 AM",
                        duration_minutes=60,
                        capacity=20,
                        room="Studio 1",
                        is_active=True,
                    ))

        db.commit()
        print("✓ REPSI database successfully seeded with operational gym records.")
    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_database()
