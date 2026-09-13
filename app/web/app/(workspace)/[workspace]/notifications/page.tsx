import type { Metadata } from "next";
import { Bell, AlertTriangle, CreditCard, UserPlus, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Alerts, membership renewals, and system notices.",
};

const notifications = [
  {
    id: "notif_1",
    title: "14 Memberships Expiring in 48 Hours",
    description: "Automated WhatsApp and SMS payment renewal links sent to Rahul Verma, Sneha Kapoor, and 12 others.",
    time: "10 minutes ago",
    type: "warning",
    unread: true,
  },
  {
    id: "notif_2",
    title: "Payment Received — ₹18,999",
    description: "Priya Venkat renewed Annual Transformation Plan via UPI (HDFC Gateway).",
    time: "42 minutes ago",
    type: "success",
    unread: true,
  },
  {
    id: "notif_3",
    title: "High Peak Gym Floor Capacity Reached",
    description: "Total members on floor exceeded 120 between 6:30 PM – 7:30 PM.",
    time: "Yesterday",
    type: "info",
    unread: false,
  },
  {
    id: "notif_4",
    title: "New Coach Profile Assigned",
    description: "Trainer Ananya Deshmukh added to Tuesday Morning MetCon HIIT roster.",
    time: "2 days ago",
    type: "info",
    unread: false,
  },
];

export default function WorkspaceNotificationsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Notification Center</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Real-time alerts, payment updates, and member lifecycle reminders.
          </p>
        </div>
        <Button variant="outline" size="sm">
          Mark All as Read
        </Button>
      </div>

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
    </div>
  );
}
