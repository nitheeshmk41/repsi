"use client";

import Link from "next/link";
import {
  UserPlus,
  Users,
  CreditCard,
  CheckCircle2,
  UserCheck,
  Dumbbell,
  Sparkles,
} from "lucide-react";

interface QuickActionsProps {
  workspace?: string;
}

export function QuickActions({ workspace = "default" }: QuickActionsProps) {
  const actions = [
    {
      label: "+ Add Member",
      description: "Register gym member",
      href: `/${workspace}/members/new`,
      icon: UserPlus,
      primary: true,
    },
    {
      label: "+ Add Trainer",
      description: "Onboard trainer profile",
      href: `/${workspace}/trainers?new=true`,
      icon: UserCheck,
    },
    {
      label: "+ Create Membership",
      description: "Package & pricing plan",
      href: `/${workspace}/memberships?new=true`,
      icon: CreditCard,
    },
    {
      label: "✓ Check Attendance",
      description: "Live QR or manual scan",
      href: `/${workspace}/attendance`,
      icon: CheckCircle2,
    },
    {
      label: "+ Add Lead",
      description: "Capture inquiry in CRM",
      href: `/${workspace}/crm?new=true`,
      icon: Users,
    },
    {
      label: "+ Create Workout",
      description: "Protocol or routine template",
      href: `/${workspace}/workouts?new=true`,
      icon: Dumbbell,
    },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[var(--text)] tracking-tight">Quick Actions</h2>
        <span className="text-[11px] font-semibold text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-0.5 rounded-full">
          Shortcuts
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-150 border cursor-pointer ${
                action.primary
                  ? "bg-[#16A34A]/10 border-[#16A34A]/40 hover:bg-[#16A34A]/20 hover:border-[#16A34A]"
                  : "bg-[var(--background)] border-[var(--border)] hover:bg-[var(--surface-hover)] hover:border-[#16A34A]/30"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  action.primary
                    ? "bg-[#16A34A] text-white"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[#16A34A]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div
                  className={`text-xs font-bold truncate ${
                    action.primary
                      ? "text-[#16A34A]"
                      : "text-[var(--text)]"
                  }`}
                >
                  {action.label}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] truncate">
                  {action.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
