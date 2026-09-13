import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/features/dashboard/stat-card";
import { RevenueChart } from "@/features/dashboard/revenue-chart";
import { AttendanceChart } from "@/features/dashboard/attendance-chart";
import { RecentActivity } from "@/features/dashboard/recent-activity";
import { QuickActions } from "@/features/dashboard/quick-actions";
import { dashboardMetrics } from "@/lib/mock-data";
import { slugToGymName } from "@/lib/workspace";

export const metadata: Metadata = {
  title: "Dashboard",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function WorkspaceDashboardPage({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace } = await params;
  const gymName = slugToGymName(workspace);
  const greeting = getGreeting();
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)] font-bold">
              WORKSPACE: /{workspace}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
            {greeting} 👋
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {today} · {gymName}
          </p>
        </div>
        <Link href={`/${workspace}/members/new`}>
          <Button className="flex-shrink-0">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </Link>
      </div>

      {/* ── Metric Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label={dashboardMetrics.activeMembers.label}
          sublabel={dashboardMetrics.activeMembers.sublabel}
          value={dashboardMetrics.activeMembers.value}
          change={dashboardMetrics.activeMembers.change}
          changeType={dashboardMetrics.activeMembers.changeType}
          iconName="users"
        />
        <StatCard
          label={dashboardMetrics.monthlyRevenue.label}
          sublabel={dashboardMetrics.monthlyRevenue.sublabel}
          value={dashboardMetrics.monthlyRevenue.value}
          change={dashboardMetrics.monthlyRevenue.change}
          changeType={dashboardMetrics.monthlyRevenue.changeType}
          isCurrency
          iconName="trending-up"
        />
        <StatCard
          label={dashboardMetrics.todayAttendance.label}
          sublabel={dashboardMetrics.todayAttendance.sublabel}
          value={dashboardMetrics.todayAttendance.value}
          change={dashboardMetrics.todayAttendance.change}
          changeType={dashboardMetrics.todayAttendance.changeType}
          iconName="calendar-check"
        />
        <StatCard
          label={dashboardMetrics.expiringSoon.label}
          sublabel={dashboardMetrics.expiringSoon.sublabel}
          value={dashboardMetrics.expiringSoon.value}
          change={dashboardMetrics.expiringSoon.change}
          changeType={dashboardMetrics.expiringSoon.changeType}
          iconName="alert-triangle"
        />
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4">
          <RevenueChart />
        </div>
        <div className="lg:col-span-3">
          <AttendanceChart />
        </div>
      </div>

      {/* ── Bottom Row: Quick Actions & Recent Activity ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-3">
          <QuickActions />
        </div>
        <div className="lg:col-span-4">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
