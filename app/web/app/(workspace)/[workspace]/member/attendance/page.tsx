"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle2, Clock, Calendar as CalendarIcon } from "lucide-react";

export default function MemberAttendancePage({ params }: { params: { workspace: string } }) {
  const attendanceLogs = [
    { date: "14 Sep 2026", checkIn: "07:15 AM", checkOut: "08:30 AM", method: "QR Code" },
    { date: "12 Sep 2026", checkIn: "06:45 AM", checkOut: "08:00 AM", method: "QR Code" },
    { date: "11 Sep 2026", checkIn: "07:00 AM", checkOut: "08:15 AM", method: "Biometric" },
    { date: "09 Sep 2026", checkIn: "07:10 AM", checkOut: "08:25 AM", method: "QR Code" },
    { date: "07 Sep 2026", checkIn: "06:50 AM", checkOut: "08:05 AM", method: "QR Code" },
  ];

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
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">This Month</span>
          <p className="text-2xl font-extrabold text-[var(--text)] mt-1">18 Days</p>
        </div>
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Consistency Score</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">82%</p>
        </div>
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Avg Session</span>
          <p className="text-2xl font-extrabold text-[var(--text)] mt-1">75 Mins</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" />
          <span>Recent Check-ins</span>
        </h2>

        <div className="divide-y divide-[var(--border)]">
          {attendanceLogs.map((log, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text)]">{log.date}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{log.method}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-medium text-[var(--text)]">{log.checkIn} - {log.checkOut}</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
