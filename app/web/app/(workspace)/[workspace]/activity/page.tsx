"use client";

import { useState } from "react";
import { Activity, CheckCircle2, CreditCard, UserPlus, Dumbbell, ShieldCheck } from "lucide-react";

export default function WorkspaceActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Facility Activity Stream</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Chronological log of check-ins, renewals, staff edits, and member actions.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
        {activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 text-sm relative">
                {idx !== activities.length - 1 && (
                  <div className="absolute left-[15px] top-7 bottom-[-24px] w-px bg-[var(--border)]" />
                )}
                <div className="w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 z-10">
                  <Activity className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="font-medium text-[var(--text)]">{item.action}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    by <strong>{item.user}</strong> · {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center space-y-2">
            <Activity className="h-6 w-6 text-[var(--text-muted)] mx-auto" />
            <p className="text-xs font-semibold text-[var(--text)]">No facility activity recorded yet</p>
            <p className="text-[11px] text-[var(--text-muted)]">Live check-ins, member registrations, and staff updates will appear in this feed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
