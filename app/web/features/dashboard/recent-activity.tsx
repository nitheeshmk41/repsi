"use client";

import {
  UserPlus,
  RefreshCcw,
  CreditCard,
  UserCheck,
  AlertCircle,
  CalendarPlus,
  LogIn,
  Snowflake,
} from "lucide-react";
import { recentActivity, type ActivityType, type Activity } from "@/lib/mock-data";
import { formatRelativeTime, formatCurrency, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// ─── Activity Icon Map ────────────────────────────────────────────────────────

const activityConfig: Record<
  ActivityType,
  {
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
    iconColor: string;
    badgeVariant: "active" | "lime" | "default" | "expiring" | "expired" | "frozen";
    badgeLabel: string;
  }
> = {
  member_joined: {
    icon: UserPlus,
    iconBg: "bg-[var(--success-soft)]",
    iconColor: "text-[var(--success)]",
    badgeVariant: "active",
    badgeLabel: "New Member",
  },
  membership_renewed: {
    icon: RefreshCcw,
    iconBg: "bg-[var(--primary-soft)]",
    iconColor: "text-[var(--primary-dark)] dark:text-[var(--primary-hover)]",
    badgeVariant: "lime",
    badgeLabel: "Renewal",
  },
  payment_received: {
    icon: CreditCard,
    iconBg: "bg-[var(--info-soft)]",
    iconColor: "text-[var(--info-foreground)]",
    badgeVariant: "lime",
    badgeLabel: "Payment",
  },
  trainer_assigned: {
    icon: UserCheck,
    iconBg: "bg-[var(--surface-elevated)]",
    iconColor: "text-[var(--text-secondary)]",
    badgeVariant: "default",
    badgeLabel: "Trainer",
  },
  membership_expired: {
    icon: AlertCircle,
    iconBg: "bg-[var(--error-soft)]",
    iconColor: "text-[var(--error)]",
    badgeVariant: "expired",
    badgeLabel: "Expired",
  },
  class_created: {
    icon: CalendarPlus,
    iconBg: "bg-[var(--surface-elevated)]",
    iconColor: "text-[var(--text-secondary)]",
    badgeVariant: "default",
    badgeLabel: "Class",
  },
  check_in: {
    icon: LogIn,
    iconBg: "bg-[var(--primary-soft)]",
    iconColor: "text-[var(--primary-dark)] dark:text-[var(--primary-hover)]",
    badgeVariant: "lime",
    badgeLabel: "Check-in",
  },
  membership_frozen: {
    icon: Snowflake,
    iconBg: "bg-[var(--info-soft)]",
    iconColor: "text-[var(--info-foreground)]",
    badgeVariant: "frozen",
    badgeLabel: "Frozen",
  },
};

// ─── Activity Row ─────────────────────────────────────────────────────────────

function ActivityRow({ activity }: { activity: Activity }) {
  const config = activityConfig[activity.type];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 py-3 group">
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full ${config.iconBg} flex items-center justify-center mt-0.5`}
      >
        <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--text)] truncate">
              {activity.title}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">
              {activity.description}
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            {activity.amount !== undefined && (
              <span className="text-xs font-semibold text-[var(--text)] tabular-nums">
                {formatCurrency(activity.amount)}
              </span>
            )}
            <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
              {formatRelativeTime(activity.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Recent Activity ──────────────────────────────────────────────────────────

export function RecentActivity() {
  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-[var(--text)]">Recent Activity</h2>
        <button className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
          View all
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-[var(--border)]">
        {recentActivity.map((activity) => (
          <ActivityRow key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
