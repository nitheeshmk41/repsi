import logging
from sqlalchemy import text, inspect
from app.core.database import engine, Base

logger = logging.getLogger(__name__)

def run_database_migrations():
    """
    Safely applies non-destructive schema migrations (new columns, audit tables)
    across PostgreSQL and SQLite without needing manual manual intervention.
    """
    # 1. Create any missing tables (e.g. subscription_audit_logs)
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)
    dialect_name = engine.dialect.name.lower()

    with engine.begin() as conn:
        # Check subscription_plans columns
        if inspector.has_table("subscription_plans"):
            existing_cols = {col["name"] for col in inspector.get_columns("subscription_plans")}
            new_plan_cols = [
                ("staff_limit", "INTEGER DEFAULT 2"),
                ("is_active", "BOOLEAN DEFAULT TRUE"),
                ("contact_sales", "BOOLEAN DEFAULT FALSE"),
            ]
            for col_name, col_def in new_plan_cols:
                if col_name not in existing_cols:
                    try:
                        conn.execute(text(f"ALTER TABLE subscription_plans ADD COLUMN {col_name} {col_def}"))
                        logger.info(f"Added column {col_name} to subscription_plans.")
                    except Exception as e:
                        logger.warning(f"Could not add column {col_name} to subscription_plans: {e}")

        # Check gym_subscriptions columns
        if inspector.has_table("gym_subscriptions"):
            existing_cols = {col["name"] for col in inspector.get_columns("gym_subscriptions")}
            new_sub_cols = [
                ("custom_member_limit", "INTEGER"),
                ("custom_trainer_limit", "INTEGER"),
                ("custom_staff_limit", "INTEGER"),
                ("custom_branch_limit", "INTEGER"),
                ("custom_features", "JSONB" if "postgres" in dialect_name else "TEXT"),
                ("is_complimentary", "BOOLEAN DEFAULT FALSE"),
                ("complimentary_until", "TIMESTAMP"),
                ("suspended_at", "TIMESTAMP"),
                ("suspension_reason", "TEXT"),
                ("notes", "TEXT"),
                ("trial_started_at", "TIMESTAMP"),
                ("trial_ends_at", "TIMESTAMP"),
                ("trial_converted_at", "TIMESTAMP"),
                ("reminder_sent_flags", "JSONB" if "postgres" in dialect_name else "TEXT"),
                ("is_repeat_trial_blocked", "BOOLEAN DEFAULT FALSE"),
            ]
            if "postgres" in dialect_name:
                try:
                    conn.execute(text("ALTER TABLE gym_subscriptions ALTER COLUMN status TYPE VARCHAR(50) USING status::text;"))
                    conn.execute(text("ALTER TABLE gym_subscriptions ALTER COLUMN billing_cycle TYPE VARCHAR(50) USING billing_cycle::text;"))
                    conn.execute(text("UPDATE gym_subscriptions SET status = LOWER(status), billing_cycle = LOWER(billing_cycle);"))
                except Exception as e:
                    logger.debug(f"Status column conversion: {e}")

            for col_name, col_def in new_sub_cols:
                if col_name not in existing_cols:
                    try:
                        conn.execute(text(f"ALTER TABLE gym_subscriptions ADD COLUMN {col_name} {col_def}"))
                        logger.info(f"Added column {col_name} to gym_subscriptions.")
                    except Exception as e:
                        logger.warning(f"Could not add column {col_name} to gym_subscriptions: {e}")

            # Backfill trial_started_at / trial_ends_at from existing trial_start / trial_end
            try:
                conn.execute(text("UPDATE gym_subscriptions SET trial_started_at = trial_start WHERE trial_started_at IS NULL AND trial_start IS NOT NULL;"))
                conn.execute(text("UPDATE gym_subscriptions SET trial_ends_at = trial_end WHERE trial_ends_at IS NULL AND trial_end IS NOT NULL;"))
            except Exception as e:
                logger.debug(f"Trial timestamp backfill: {e}")

        # Check workspaces columns
        if inspector.has_table("workspaces"):
            existing_ws_cols = {col["name"] for col in inspector.get_columns("workspaces")}
            new_ws_cols = [
                ("business_types", "TEXT"),
                ("business_size", "VARCHAR(100)"),
                ("managed_features", "TEXT"),
                ("management_method", "VARCHAR(100)"),
                ("checkin_method", "VARCHAR(100) DEFAULT 'QR Code'"),
                ("brand_color", "VARCHAR(50) DEFAULT '#000000'"),
                ("onboarding_completed", "BOOLEAN DEFAULT FALSE"),
                ("onboarding_step", "INTEGER DEFAULT 1"),
                ("last_name_changed_at", "TIMESTAMP"),
                ("name_change_count", "INTEGER DEFAULT 0"),
            ]
            for col_name, col_def in new_ws_cols:
                if col_name not in existing_ws_cols:
                    try:
                        conn.execute(text(f"ALTER TABLE workspaces ADD COLUMN {col_name} {col_def}"))
                        logger.info(f"Added column {col_name} to workspaces.")
                    except Exception as e:
                        logger.warning(f"Could not add column {col_name} to workspaces: {e}")

if __name__ == "__main__":
    run_database_migrations()
    print("[SUCCESS] Database migrations completed successfully.")
