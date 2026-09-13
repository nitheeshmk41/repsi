"use client";

import {
  UserPlus,
  RefreshCcw,
  CheckCircle2,
  CreditCard,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickAction {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
}

const actions: QuickAction[] = [
  {
    label: "Add Member",
    description: "Register a new gym member",
    icon: UserPlus,
    primary: true,
  },
  {
    label: "Record Payment",
    description: "Log a membership payment",
    icon: CreditCard,
  },
  {
    label: "Mark Attendance",
    description: "Check in a member",
    icon: CheckCircle2,
  },
  {
    label: "Renew Membership",
    description: "Extend an existing plan",
    icon: RefreshCcw,
  },
  {
    label: "Create Class",
    description: "Schedule a new class",
    icon: Calendar,
  },
  {
    label: "Generate Report",
    description: "Export gym data",
    icon: BarChart3,
  },
];

export function QuickActions() {
  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
      <h2 className="text-base font-semibold text-[var(--text)] mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-all duration-150 border ${
                action.primary
                  ? "bg-[var(--primary-soft)] border-[var(--primary)]/30 hover:border-[var(--primary)]/50 hover:bg-[var(--primary-soft)]"
                  : "bg-[var(--background)] border-[var(--border)] hover:bg-[var(--nav-hover-bg)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div
                className={`flex-shrink-0 w-7 h-7 rounded-[6px] flex items-center justify-center ${
                  action.primary
                    ? "bg-[var(--primary)] "
                    : "bg-[var(--surface)] border border-[var(--border)]"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    action.primary
                      ? "text-[var(--primary-foreground)]"
                      : "text-[var(--text-muted)]"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <div
                  className={`text-xs font-medium truncate ${
                    action.primary
                      ? "text-[var(--primary-dark)] dark:text-[var(--primary-hover)]"
                      : "text-[var(--text)]"
                  }`}
                >
                  {action.label}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] truncate">
                  {action.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
