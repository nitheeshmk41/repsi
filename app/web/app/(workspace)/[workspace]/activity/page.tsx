import type { Metadata } from "next";
import { Activity, UserPlus, CreditCard, CheckCircle2, Dumbbell, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Activity Stream",
  description: "Live operational activity log across your gym facility.",
};

const activities = [
  { action: "Arun Kumar checked in at reception scanner", user: "Staff Arun", time: "3 minutes ago", icon: CheckCircle2, color: "text-emerald-400" },
  { action: "₹6,499 Quarterly Pro renewal recorded for Priya Venkat", user: "Admin", time: "18 minutes ago", icon: CreditCard, color: "text-blue-400" },
  { action: "New member Kavya Ramesh registered on Annual Plan", user: "Owner", time: "45 minutes ago", icon: UserPlus, color: "text-emerald-400" },
  { action: "Trainer Vikram assigned workout plan 'Strength 5x5' to Rohit", user: "Coach Vikram", time: "2 hours ago", icon: Dumbbell, color: "text-amber-400" },
  { action: "Staff member checked out at end of morning shift", user: "Staff Rahul", time: "3 hours ago", icon: ShieldCheck, color: "text-zinc-400" },
];

export default function WorkspaceActivityPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Facility Activity Stream</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Chronological log of check-ins, renewals, staff edits, and member actions.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
        <div className="space-y-6">
          {activities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-4 text-sm relative">
                {idx !== activities.length - 1 && (
                  <div className="absolute left-[15px] top-7 bottom-[-24px] w-px bg-[var(--border)]" />
                )}
                <div className={`w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 z-10`}>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="font-medium text-[var(--text)]">{item.action}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    by <strong>{item.user}</strong> · {item.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
