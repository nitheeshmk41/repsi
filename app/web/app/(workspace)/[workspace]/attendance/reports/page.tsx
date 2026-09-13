"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3, TrendingUp, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceChart } from "@/features/dashboard/attendance-chart";

export default function AttendanceReportsPage() {
  const params = useParams();
  const workspace = (params.workspace as string) || "apex-fitness";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/${workspace}/attendance`}
          className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-[var(--text-muted)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
            Attendance Reports & Analytics
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Footfall patterns, peak training hours, and facility utilization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-xs text-[var(--text-muted)]">Average Daily Footfall</p>
          <p className="text-2xl font-bold text-[var(--text)] mt-1">186 Visits</p>
          <span className="text-xs text-emerald-500 font-medium">↑ 14% vs last week</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-xs text-[var(--text-muted)]">Peak Hour</p>
          <p className="text-2xl font-bold text-[var(--text)] mt-1">6:00 PM – 8:00 PM</p>
          <span className="text-xs text-amber-500 font-medium">85% gym floor capacity</span>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-xs text-[var(--text-muted)]">Morning Peak</p>
          <p className="text-2xl font-bold text-[var(--text)] mt-1">6:30 AM – 8:30 AM</p>
          <span className="text-xs text-[var(--text-secondary)]">72% gym floor capacity</span>
        </div>
      </div>

      <div className="max-w-3xl">
        <AttendanceChart />
      </div>
    </div>
  );
}
