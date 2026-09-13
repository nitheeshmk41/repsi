import type { Metadata } from "next";
import { BarChart3, Download, TrendingUp, Users, CalendarCheck, Banknote, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevenueChart } from "@/features/dashboard/revenue-chart";
import { AttendanceChart } from "@/features/dashboard/attendance-chart";

export const metadata: Metadata = {
  title: "Reports",
  description: "Executive gym financial, attendance, and member retention reports.",
};

export default function WorkspaceReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Business Reports</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Auditable reports on net revenue, member lifecycles, and facility attendance.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Export All Reports (PDF/CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Banknote className="h-4 w-4 text-emerald-400" />
            <span>Net Monthly Collections</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text)] mt-2">₹4,82,500</p>
          <span className="text-xs text-emerald-400 font-medium">↑ 8.2% vs last month</span>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Receipt className="h-4 w-4 text-rose-400" />
            <span>Total Monthly Expenses</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text)] mt-2">₹1,84,000</p>
          <span className="text-xs text-zinc-400 font-medium">Operating margin: 61.8%</span>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Users className="h-4 w-4 text-blue-400" />
            <span>Total Active Members</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text)] mt-2">1,284</p>
          <span className="text-xs text-emerald-400 font-medium">+142 new this month</span>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <CalendarCheck className="h-4 w-4 text-amber-400" />
            <span>Avg Daily Attendance</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text)] mt-2">186</p>
          <span className="text-xs text-emerald-400 font-medium">Facility utilization: 74%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <AttendanceChart />
      </div>
    </div>
  );
}
