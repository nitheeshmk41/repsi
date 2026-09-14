"use client";

import { useState, useEffect } from "react";
import { 
  BellRing, 
  Send, 
  Copy, 
  Check, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { repsiApi } from "@/lib/api";

export function RenewalAlertsCard() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await repsiApi.getRenewalReminders(14);
      setReminders(data || []);
    } catch (err) {
      console.warn("Failed to load reminders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleAudit = async () => {
    try {
      setAuditing(true);
      await repsiApi.checkMembershipExpiries();
      await fetchReminders();
    } catch (err) {
      console.warn("Failed audit check", err);
    } finally {
      setAuditing(false);
    }
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!loading && reminders.length === 0) {
    return null; // Don't show card if no memberships are expiring soon
  }

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[var(--text)] tracking-tight">
                Automated Renewal & Dunning Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                {reminders.length} Due for Renewal
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Members expiring within 14 days or overdue. Send 1-click WhatsApp reminders to protect revenue.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAudit}
            disabled={auditing}
            title="Scan database and update expired memberships"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:text-[var(--primary)] transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${auditing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sync Status</span>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable List */}
      {expanded && (
        <div className="space-y-2 pt-1">
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {reminders.map((r, i) => {
              const isOverdue = r.days_remaining < 0;
              const isToday = r.days_remaining === 0;

              return (
                <div
                  key={r.member_id || i}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]/80 gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isOverdue 
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" 
                        : isToday 
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {isOverdue ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-[var(--text)] truncate">{r.member_name}</p>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">({r.phone})</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        <span className="font-semibold text-[var(--text)]">{r.plan_name}</span> · ₹{r.amount_due} · {" "}
                        <span className={isOverdue ? "text-rose-500 font-bold" : isToday ? "text-amber-500 font-bold" : "text-[var(--text-muted)]"}>
                          {isOverdue 
                            ? `Overdue (${Math.abs(r.days_remaining)}d ago)` 
                            : isToday 
                            ? "Expires TODAY" 
                            : `Expires in ${r.days_remaining}d`}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(r.message_template, r.member_id)}
                      className="p-2 rounded-lg bg-[var(--background)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                      title="Copy WhatsApp text"
                    >
                      {copiedId === r.member_id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <a
                      href={r.whatsapp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
