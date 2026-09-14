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
  Activity as ActivityIcon,
} from "lucide-react";
import { formatRelativeTime, formatCurrency } from "@/lib/utils";

export type ActivityType =
  | "member_joined"
  | "membership_renewed"
  | "payment_received"
  | "trainer_assigned"
  | "membership_expired"
  | "class_created"
  | "check_in"
  | "membership_frozen";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  user: string;
  avatar?: string;
  timestamp: string;
  amount?: number;
}

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

function ActivityRow({ activity }: { activity: Activity }) {
  const config = activityConfig[activity.type] || activityConfig.check_in;
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 py-3 group">
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full ${config.iconBg} flex items-center justify-center mt-0.5`}
      >
        <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />
      </div>

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

export function RecentActivity({ activities = [] }: { activities?: Activity[] }) {
  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-[var(--text)]">Recent Activity</h2>
      </div>

      {activities.length > 0 ? (
        <div className="divide-y divide-[var(--border)]">
          {activities.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface-elevated)] text-[var(--text-muted)] mb-2">
            <ActivityIcon className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-[var(--text)]">No activity recorded yet</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Actions like member check-ins, payments, and registrations will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
