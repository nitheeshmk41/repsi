"use client";

import { useEffect, useState } from "react";
import { Bell, AlertTriangle, CheckCircle2, Info, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Link from "next/link";

interface NotificationItem {
  id: string;
  workspace_id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string | null;
  created_at: string;
}

export default function WorkspaceNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications(1, 50);
      setNotifications(res.items || []);
      setUnreadCount(res.unread_count || 0);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Notification Center</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[var(--primary)] text-white">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Real-time alerts, payment updates, and member lifecycle reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadNotifications}
            className="gap-1.5"
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={actionLoading}
              className="gap-1.5"
            >
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] animate-pulse h-20" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isUnread = !n.is_read;
            const isWarning = n.title.toLowerCase().includes("expir") || n.title.toLowerCase().includes("failed") || n.title.toLowerCase().includes("risk");
            const isSuccess = n.title.toLowerCase().includes("renew") || n.title.toLowerCase().includes("paid") || n.title.toLowerCase().includes("welcome");

            return (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isUnread
                    ? "border-[var(--primary)]/40 bg-[var(--surface)] shadow-[var(--shadow-sm)]"
                    : "border-[var(--border)] bg-[var(--background)] opacity-85"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isWarning ? (
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Info className="h-5 w-5 text-blue-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-semibold text-sm ${isUnread ? "text-[var(--text)] font-bold" : "text-[var(--text-secondary)]"}`}>
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[var(--text-muted)] whitespace-nowrap">
                        {formatRelativeTime(n.created_at)}
                      </span>
                      {isUnread && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          title="Mark as read"
                          className="text-[11px] font-medium text-[var(--primary)] hover:underline ml-1"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  {n.action_url && (
                    <div className="mt-2">
                      <Link
                        href={n.action_url}
                        className="text-xs font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                      >
                        View Details →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
