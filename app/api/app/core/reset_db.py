"""
Database Reset Script for REPSI
Drops all existing tables and data, recreates all tables, and seeds fresh initial baseline accounts.
"""
import sys
import os
from sqlalchemy.orm import Session

# Add app to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.core.database import engine, Base, SessionLocal
from app.core.seed import seed_database

def reset_and_seed():
    print("⚠️  Resetting database: Dropping all tables...")
    try:
        Base.metadata.drop_all(bind=engine)
        print("✓ All tables dropped successfully.")
    except Exception as e:
        print(f"Error dropping tables: {e}")

    print("🛠️  Creating fresh database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Fresh schema created successfully.")

    print("🌱 Seeding fresh initial baseline records...")
    seed_database()
    print("✨ Database reset and re-seeded cleanly!")

if __name__ == "__main__":
    reset_and_seed()
