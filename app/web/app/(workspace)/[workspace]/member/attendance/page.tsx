"use client";

import { useState, useEffect, use } from "react";
import { CalendarCheck, CheckCircle2, Clock, Calendar as CalendarIcon } from "lucide-react";
import { repsiApi } from "@/lib/api";

export default function MemberAttendancePage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await repsiApi.getAttendance();
      setAttendanceLogs(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">My Attendance History</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Track your check-in logs and workout consistency.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Check-ins Recorded</span>
          <p className="text-2xl font-extrabold text-[var(--text)] mt-1">{attendanceLogs.length} Days</p>
        </div>
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Active Status</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">Verified</p>
        </div>
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Session Method</span>
          <p className="text-2xl font-extrabold text-[var(--text)] mt-1">QR / Biometric</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" />
          <span>Recent Check-ins</span>
        </h2>

        {attendanceLogs.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {attendanceLogs.map((log, idx) => (
              <div key={log.id || idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text)]">{log.name || "Check-in Session"}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">Method: {(log.method || "QR").toUpperCase()}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-medium text-[var(--text)]">{log.checkInTime} {log.checkOutTime ? `- ${log.checkOutTime}` : ""}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">{log.status === "out" ? "Checked Out" : "Active Check-in"}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="p-8 text-center space-y-2">
              <CalendarCheck className="h-6 w-6 text-[var(--text-muted)] mx-auto" />
              <p className="text-xs font-semibold text-[var(--text)]">No attendance logs found</p>
              <p className="text-[11px] text-[var(--text-muted)]">Scan your QR code at the gym desk to log your daily check-in.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
