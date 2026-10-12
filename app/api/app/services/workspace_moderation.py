import re
import unicodedata
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.user import Workspace

# Reserved platform and impersonation keywords
RESERVED_PLATFORM_NAMES = {
    "repsi",
    "repsi app",
    "repsi official",
    "repsi support",
    "repsi admin",
    "admin",
    "administrator",
    "superadmin",
    "root",
    "system",
    "official",
    "support",
    "helpdesk",
    "billing",
    "security",
    "api",
    "auth",
}

# Blocked profanities, slurs, and abusive terms (matched using whole-word boundaries)
BLOCKED_TERMS = {
    "nigger", "nigga", "faggot", "chink", "kike", "spic", "cunt",
    "bitch", "slut", "whore", "twat", "fuck", "fucker", "fucking",
    "shit", "asshole", "bastard", "dickhead", "pussy", "motherfucker",
    "porn", "porno", "xxx", "sex", "escort", "nazi", "hitler",
    "scam", "fraud", "phishing", "ponzi",
}

COOLDOWN_DAYS = 30


class WorkspaceModerationService:
    @staticmethod
    def normalize_name(name: str) -> str:
        """
        Normalizes Unicode, strips leading/trailing whitespace, and collapses repeated whitespace.
        """
        if not name:
            return ""
        # Normalize Unicode (NFKC)
        normalized = unicodedata.normalize("NFKC", name)
        # Collapse multiple spaces, tabs, and newlines
        normalized = re.sub(r"\s+", " ", normalized).strip()
        return normalized

    @classmethod
    def moderate_name(cls, name: str) -> Tuple[bool, Optional[str]]:
        """
        Validates business display name against moderation policies.
        Returns (is_acceptable, error_message).
        Neutral error message returned to avoid leaking internal policy or sensitive terms.
        """
        clean = cls.normalize_name(name)
        if not clean:
            return False, "Gym name is required."

        if len(clean) < 2:
            return False, "Gym name must be at least 2 characters long."

        if len(clean) > 100:
            return False, "Gym name cannot exceed 100 characters."

        lower_clean = clean.lower()

        # 1. Check exact or reserved platform impersonation
        if lower_clean in RESERVED_PLATFORM_NAMES:
            return False, "This business name cannot be used. Please choose another name."

        for reserved in RESERVED_PLATFORM_NAMES:
            pattern = rf"\b{re.escape(reserved)}\b"
            if re.search(pattern, lower_clean):
                return False, "This business name cannot be used. Please choose another name."

        # 2. Check blocked profanity/slurs using whole-word boundary
        # Also clean common leetspeak substitutions (0 -> o, 1 -> i, 3 -> e, 5 -> s, @ -> a, $ -> s)
        leetspeak_map = str.maketrans({"0": "o", "1": "i", "3": "e", "5": "s", "@": "a", "$": "s"})
        deobfuscated = lower_clean.translate(leetspeak_map)

        for term in BLOCKED_TERMS:
            # Check original lower with whole word boundary
            term_regex = rf"\b{re.escape(term)}\b"
            if re.search(term_regex, lower_clean):
                return False, "This business name cannot be used. Please choose another name."
            # Check deobfuscated with word boundary
            if re.search(term_regex, deobfuscated):
                return False, "This business name cannot be used. Please choose another name."

        return True, None

    @classmethod
    def check_availability(
        cls,
        db: Session,
        name: str,
        current_workspace_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Checks if the requested name is available and acceptable according to REPSI policy.
        """
        clean = cls.normalize_name(name)
        is_valid, mod_error = cls.moderate_name(clean)
        if not is_valid:
            return {
                "available": False,
                "status": "RESTRICTED",
                "message": mod_error,
                "normalized_name": clean,
                "is_current": False,
            }

        # Check existing workspace with same name (case-insensitive)
        query = db.query(Workspace).filter(Workspace.name.ilike(clean), Workspace.is_active == True)
        if current_workspace_id:
            # Exclude current workspace
            current_ws = db.query(Workspace).filter(Workspace.id == current_workspace_id).first()
            if current_ws and current_ws.name.strip().lower() == clean.lower():
                return {
                    "available": True,
                    "status": "AVAILABLE",
                    "message": "This is your current gym name.",
                    "normalized_name": clean,
                    "is_current": True,
                }
            query = query.filter(Workspace.id != current_workspace_id)

        existing = query.first()
        if existing:
            return {
                "available": False,
                "status": "TAKEN",
                "message": "This gym name is already registered by another workspace.",
                "normalized_name": clean,
                "is_current": False,
            }

        return {
            "available": True,
            "status": "AVAILABLE",
            "message": "Gym name is available.",
            "normalized_name": clean,
            "is_current": False,
        }

    @staticmethod
    def get_rename_eligibility(workspace: Workspace) -> Dict[str, Any]:
        """
        Calculates 30-day rename cooldown eligibility for a workspace.
        """
        now = datetime.now(timezone.utc)
        last_changed = workspace.last_name_changed_at

        if not last_changed:
            # First rename after registration is always permitted
            return {
                "can_rename": True,
                "cooldown_days": COOLDOWN_DAYS,
                "last_name_changed_at": None,
                "next_available_change_at": None,
                "days_remaining": 0,
                "hours_remaining": 0,
                "message": "You can change your gym name once every 30 days.",
            }

        # Ensure timezone awareness
        if last_changed.tzinfo is None:
            last_changed = last_changed.replace(tzinfo=timezone.utc)

        cooldown_delta = timedelta(days=COOLDOWN_DAYS)
        eligible_at = last_changed + cooldown_delta

        if now >= eligible_at:
            return {
                "can_rename": True,
                "cooldown_days": COOLDOWN_DAYS,
                "last_name_changed_at": last_changed.isoformat(),
                "next_available_change_at": None,
                "days_remaining": 0,
                "hours_remaining": 0,
                "message": "You are eligible to update your gym name.",
            }

        remaining_delta = eligible_at - now
        days_rem = remaining_delta.days
        hours_rem = int(remaining_delta.total_seconds() // 3600) % 24

        return {
            "can_rename": False,
            "cooldown_days": COOLDOWN_DAYS,
            "last_name_changed_at": last_changed.isoformat(),
            "next_available_change_at": eligible_at.isoformat(),
            "days_remaining": max(0, days_rem),
            "hours_remaining": max(0, hours_rem),
            "message": f"Gym names can be changed once every 30 days. Next change available on {eligible_at.strftime('%d %B %Y')}.",
        }
