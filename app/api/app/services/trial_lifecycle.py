import uuid
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy import func, or_

from app.models.billing import (
    GymSubscription,
    SubscriptionStatus,
    SubscriptionAuditLog,
)
from app.models.user import Workspace, WorkspaceMember, UserRole
from app.models.system import Notification

logger = logging.getLogger(__name__)


class TrialLifecycleService:
    """
    Handles automatic 14-day trial reconciliation, milestone reminders,
    and cross-tenant Super Admin analytics.
    """

    @staticmethod
    def reconcile_all_trials(db: Session) -> Dict[str, Any]:
        """
        Idempotent batch reconciliation:
        Detects any trialing subscription whose UTC expiry timestamp has passed,
        transitions status to EXPIRED, records audit trail, and notifies the owner.
        """
        now = datetime.now(timezone.utc)
        active_trials = db.query(GymSubscription).filter(
            GymSubscription.status == SubscriptionStatus.TRIALING
        ).all()

        expired_count = 0
        for sub in active_trials:
            t_end = sub.trial_ends_at or sub.trial_end
            if not t_end:
                continue
            t_end_utc = t_end if t_end.tzinfo else t_end.replace(tzinfo=timezone.utc)

            if now > t_end_utc and not sub.is_complimentary:
                sub.status = SubscriptionStatus.EXPIRED
                expired_count += 1

                # Audit log
                audit = SubscriptionAuditLog(
                    id=str(uuid.uuid4()),
                    workspace_id=sub.workspace_id,
                    action="trial_expired_batch",
                    old_value="trialing",
                    new_value="expired",
                    reason="Automated 14-day trial expiration lifecycle reconciliation.",
                )
                db.add(audit)

                # Send in-app notification to workspace owner
                owner_member = (
                    db.query(WorkspaceMember)
                    .filter(
                        WorkspaceMember.workspace_id == sub.workspace_id,
                        WorkspaceMember.role == UserRole.OWNER,
                    )
                    .first()
                )
                if owner_member:
                    notif = Notification(
                        workspace_id=sub.workspace_id,
                        user_id=owner_member.user_id,
                        title="Your 14-Day Free Trial Has Ended",
                        message=(
                            "Your free trial has concluded. Your gym records are safe, "
                            "but paid features require a subscription. Upgrade to continue."
                        ),
                        action_url="/settings?tab=billing",
                        is_read=False,
                    )
                    db.add(notif)

        db.commit()
        return {
            "reconciled_at": now.isoformat(),
            "evaluated_trials": len(active_trials),
            "expired_count": expired_count,
        }

    @staticmethod
    def send_trial_reminders(db: Session) -> Dict[str, Any]:
        """
        Sends milestone notifications at 7 days, 3 days, and 1 day remaining.
        Uses idempotency flags in `reminder_sent_flags` to prevent duplicate alerts.
        """
        now = datetime.now(timezone.utc)
        active_trials = db.query(GymSubscription).filter(
            GymSubscription.status == SubscriptionStatus.TRIALING
        ).all()

        reminders_sent = 0
        for sub in active_trials:
            t_end = sub.trial_ends_at or sub.trial_end
            if not t_end:
                continue
            t_end_utc = t_end if t_end.tzinfo else t_end.replace(tzinfo=timezone.utc)
            delta = t_end_utc - now
            days_left = max(0, int(delta.total_seconds() // 86400))

            flags = dict(sub.reminder_sent_flags or {})
            should_update = False
            title = None
            msg = None

            owner_member = (
                db.query(WorkspaceMember)
                .filter(
                    WorkspaceMember.workspace_id == sub.workspace_id,
                    WorkspaceMember.role == UserRole.OWNER,
                )
                .first()
            )
            if not owner_member:
                continue

            if days_left <= 1 and not flags.get("1d"):
                title = "1 Day Left in Your Free Trial"
                msg = "Your 14-day Repsi trial expires tomorrow! Pick a plan now to avoid interruption."
                flags["1d"] = True
                flags["3d"] = True
                flags["7d"] = True
                should_update = True
            elif days_left <= 3 and not flags.get("3d"):
                title = "3 Days Remaining in Your Free Trial"
                msg = "Make the most of your trial: explore trainer management, attendance, and member roster."
                flags["3d"] = True
                flags["7d"] = True
                should_update = True
            elif days_left <= 7 and not flags.get("7d"):
                title = "7 Days Left in Your Free Trial"
                msg = "You are halfway through your 14-day trial! Test out automated QR check-ins and payments."
                flags["7d"] = True
                should_update = True

            if should_update and title and msg:
                sub.reminder_sent_flags = dict(flags)
                flag_modified(sub, "reminder_sent_flags")
                notif = Notification(
                    workspace_id=sub.workspace_id,
                    user_id=owner_member.user_id,
                    title=title,
                    message=msg,
                    action_url="/settings?tab=billing",
                    is_read=False,
                )
                db.add(notif)
                reminders_sent += 1

        db.commit()
        return {
            "processed_at": now.isoformat(),
            "reminders_sent": reminders_sent,
        }

    @staticmethod
    def get_superadmin_trial_analytics(db: Session) -> Dict[str, Any]:
        """
        Aggregates system-wide subscription and 14-day trial metrics for Super Admin.
        """
        now = datetime.now(timezone.utc)
        total_businesses = db.query(func.count(Workspace.id)).scalar() or 0

        # Subscriptions breakdown
        subs = db.query(GymSubscription).all()
        active_trials = 0
        expired_trials = 0
        active_paid = 0
        trials_expiring_today = 0
        trials_expiring_3d = 0
        trials_expiring_7d = 0
        trial_converted_count = 0

        timeline: List[Dict[str, Any]] = []

        for s in subs:
            status_val = s.status.value if hasattr(s.status, "value") else str(s.status)
            if s.trial_converted_at is not None:
                trial_converted_count += 1

            if status_val == "trialing":
                active_trials += 1
                t_end = s.trial_ends_at or s.trial_end
                if t_end:
                    t_end_utc = t_end if t_end.tzinfo else t_end.replace(tzinfo=timezone.utc)
                    diff_hours = (t_end_utc - now).total_seconds() / 3600
                    if 0 <= diff_hours <= 24:
                        trials_expiring_today += 1
                    if 0 <= diff_hours <= 72:
                        trials_expiring_3d += 1
                    if 0 <= diff_hours <= 168:
                        trials_expiring_7d += 1

                    # Add to upcoming timeline if within 7 days
                    if 0 <= diff_hours <= 168:
                        ws = db.query(Workspace).filter(Workspace.id == s.workspace_id).first()
                        timeline.append({
                            "workspace_id": s.workspace_id,
                            "gym_name": ws.name if ws else "Gym Workspace",
                            "trial_ends_at": t_end_utc.isoformat(),
                            "hours_remaining": max(0, int(diff_hours)),
                            "days_remaining": max(0, int(diff_hours // 24)),
                        })
            elif status_val == "active":
                active_paid += 1
            elif status_val == "expired":
                expired_trials += 1

        total_trial_cohort = active_trials + expired_trials + trial_converted_count
        conversion_rate_pct = (
            round((trial_converted_count / max(1, total_trial_cohort)) * 100.0, 1)
            if total_trial_cohort > 0
            else 0.0
        )

        timeline.sort(key=lambda x: x["hours_remaining"])

        return {
            "total_businesses": total_businesses,
            "active_trials": active_trials,
            "trials_expiring_today": trials_expiring_today,
            "trials_expiring_3_days": trials_expiring_3d,
            "trials_expiring_7_days": trials_expiring_7d,
            "expired_trials": expired_trials,
            "active_paid": active_paid,
            "trial_converted_count": trial_converted_count,
            "conversion_rate_pct": conversion_rate_pct,
            "expirations_timeline": timeline[:25],
            "server_time_utc": now.isoformat(),
        }
