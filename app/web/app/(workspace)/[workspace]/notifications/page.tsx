"use client";

import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkspaceNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Notification Center</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Real-time alerts, payment updates, and member lifecycle reminders.
          </p>
        </div>
        {notifications.length > 0 && (
          <Button variant="outline" size="sm">
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                n.unread
                  ? "border-[var(--primary)] bg-[var(--surface)] shadow-[var(--shadow-sm)]"
                  : "border-[var(--border)] bg-[var(--background)] opacity-80"
              }`}
            >
              <div className="mt-0.5">
                {n.type === "warning" ? (
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                ) : n.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Info className="h-5 w-5 text-blue-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm text-[var(--text)]">{n.title}</h3>
                  <span className="text-[11px] text-[var(--text-muted)] whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{n.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[16px] border border-dashed border-[var(--border)] p-12 text-center space-y-3 bg-[var(--surface)]/50">
          <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mx-auto flex items-center justify-center">
            <Bell className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--text)]">No notifications</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            System notices, payment alerts, and member check-in updates will appear here in real-time.
          </p>
        </div>
      )}
    </div>
  );
}
