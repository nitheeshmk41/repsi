"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Database, RefreshCw, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/features/dashboard/stat-card";
import { RevenueChart } from "@/features/dashboard/revenue-chart";
import { AttendanceChart } from "@/features/dashboard/attendance-chart";
import { RecentActivity } from "@/features/dashboard/recent-activity";
import { QuickActions } from "@/features/dashboard/quick-actions";
import { repsiApi } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://repsi.fastapicloud.dev/api/v1";

interface DashboardMetrics {
  active_members: number;
  monthly_revenue: number;
  today_attendance: number;
  expiring_memberships: number;
  revenue_growth_pct: number;
  attendance_peak_hour: string;
  recent_checkins_count: number;
  revenue_chart: Array<{ label: string; value: number }>;
  attendance_chart: Array<{ label: string; value: number }>;
}

export function DashboardClient({ workspace }: { workspace: string }) {
  const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("repsi_auth_token") : null;
      const res = await fetch(`${API_BASE}/dashboard/metrics`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      } else {
        setError("Failed to load dashboard metrics");
      }
    } catch (err) {
      console.warn("Could not fetch dashboard metrics", err);
      setError("Unable to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { getAuthUser } = require("@/lib/auth");
    const user = getAuthUser();
    if (user?.role === "TRAINER") {
      router?.replace(`/${workspace}/trainer/dashboard`);
      return;
    } else if (user?.role === "USER" || user?.role === "MEMBER") {
      router?.replace(`/${workspace}/member/dashboard`);
      return;
    }
    fetchMetrics();
  }, [workspace]);

  const handleSeedDemoData = async () => {
    if (!confirm("Are you sure you want to load sample records for your gym? This will only seed data for your account.")) {
      return;
    }
    setSeeding(true);
    try {
      await repsiApi.seedDemoData();
      await fetchMetrics();
    } catch (err: any) {
      alert(err.message || "Failed to seed demo data");
    } finally {
      setSeeding(false);
    }
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-[#ECFDF3] dark:bg-emerald-950/60 text-[#15803D] dark:text-emerald-400 border border-[#B7E4C7] dark:border-emerald-800/40 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              WORKSPACE: /{workspace}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] dark:text-white tracking-tight">
            {greeting} 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-zinc-400 mt-1">
            {today}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedDemoData}
            disabled={seeding}
            title="Load sample demo records specifically for your gym"
            className="border-[#D1D5DB] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-[#F8FAF9] dark:hover:bg-zinc-800 text-[#334155] dark:text-zinc-200 rounded-xl font-semibold shadow-2xs"
          >
            <Database className="h-4 w-4 mr-1.5 text-[#64748B]" />
            {seeding ? "Seeding..." : "Load Sample Data"}
          </Button>

          <Link href={`/${workspace}/members/new`}>
            <Button size="sm" className="flex-shrink-0 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl font-bold shadow-sm transition-all active:scale-[0.99] cursor-pointer">
              <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      {/* Progressive Setup Completion Banner */}
      <div className="rounded-2xl border border-[#B7E4C7] dark:border-emerald-900/40 bg-[#E8F7EF] dark:bg-gradient-to-r dark:from-emerald-950 dark:via-[#07160e] dark:to-emerald-950 p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#ECFDF3] dark:bg-emerald-500/15 border border-[#B7E4C7] dark:border-emerald-400/30 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-base text-[#14532D] dark:text-white tracking-tight">Complete your workspace setup</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#16A34A] text-white dark:bg-emerald-500/20 dark:text-emerald-300 border border-[#16A34A] dark:border-emerald-500/30">
                  75% Ready
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#4B6354] dark:text-emerald-100/70 mt-1 max-w-2xl leading-relaxed">
                Your gym is active! Complete remaining options anytime: Add trainers, set up website, or configure payment gateways.
              </p>
            </div>
          </div>
          <Link href="/onboarding/wizard" className="shrink-0 w-full sm:w-auto">
            <Button size="sm" className="w-full sm:w-auto bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs transition-all active:scale-[0.99] cursor-pointer">
              Continue setup →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#B7E4C7]/60 dark:border-emerald-800/40 text-xs">
          <div className="text-[#16A34A] dark:text-emerald-400 flex items-center gap-2 font-semibold">✓ Business & Members</div>
          <div className="text-[#16A34A] dark:text-emerald-400 flex items-center gap-2 font-semibold">✓ Membership Plans</div>
          <div className="text-[#16A34A] dark:text-emerald-400 flex items-center gap-2 font-semibold">✓ QR Check-in</div>
          <div className="text-[#64748B] dark:text-emerald-100/40 flex items-center gap-2 font-medium">○ Website & Trainers</div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-[var(--error-soft)] bg-[var(--error-soft)]/20 p-4 text-xs text-[var(--error)] flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchMetrics}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
          </Button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Active Members"
          sublabel="Real DB count"
          value={metrics ? metrics.active_members : 0}
          change={metrics ? metrics.revenue_growth_pct : 0}
          changeType="increase"
          iconName="users"
        />
        <StatCard
          label="Monthly Revenue"
          sublabel="Current month payments"
          value={metrics ? metrics.monthly_revenue : 0}
          change={0}
          changeType="increase"
          isCurrency
          iconName="trending-up"
        />
        <StatCard
          label="Today's Attendance"
          sublabel="Check-ins recorded today"
          value={metrics ? metrics.today_attendance : 0}
          change={0}
          changeType="increase"
          iconName="calendar-check"
        />
        <StatCard
          label="Expiring Soon"
          sublabel="Within 7 days"
          value={metrics ? metrics.expiring_memberships : 0}
          change={0}
          changeType="decrease"
          iconName="alert-triangle"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4">
          <RevenueChart data={metrics?.revenue_chart} />
        </div>
        <div className="lg:col-span-3">
          <AttendanceChart data={metrics?.attendance_chart} />
        </div>
      </div>

      {/* Bottom Row */}
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
