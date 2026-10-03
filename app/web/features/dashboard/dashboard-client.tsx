"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Database, RefreshCw, Sparkles, CheckCircle2, Circle, ArrowRight, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/features/dashboard/stat-card";
import { RevenueChart } from "@/features/dashboard/revenue-chart";
import { AttendanceChart } from "@/features/dashboard/attendance-chart";
import { RecentActivity } from "@/features/dashboard/recent-activity";
import { QuickActions } from "@/features/dashboard/quick-actions";
import { RepsiMascot } from "@/components/ui/repsi-mascot";
import { GettingStartedDialog } from "@/components/layout/getting-started-dialog";
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

// ─── Client-Side In-Memory Cache (30s Stale Time for 0ms Navigation) ──────────────
const dashboardMetricsCache: Record<string, { data: DashboardMetrics; timestamp: number }> = {};
const CACHE_STALE_MS = 30_000;

export function DashboardClient({ workspace }: { workspace: string }) {
  const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;

  // Initialize from cache if fresh
  const cachedEntry = dashboardMetricsCache[workspace];
  const isCacheFresh = cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_STALE_MS;

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(cachedEntry ? cachedEntry.data : null);
  const [loading, setLoading] = useState<boolean>(!isCacheFresh);
  const [revalidating, setRevalidating] = useState<boolean>(false);
  const [seeding, setSeeding] = useState(false);
  const [dismissChecklist, setDismissChecklist] = useState(false);
  const [showGettingStartedModal, setShowGettingStartedModal] = useState(false);

  const fetchMetrics = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setRevalidating(true);

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
        dashboardMetricsCache[workspace] = { data, timestamp: Date.now() };
      } else {
        const defaultData: DashboardMetrics = {
          active_members: 0,
          monthly_revenue: 0,
          today_attendance: 0,
          expiring_memberships: 0,
          revenue_growth_pct: 0,
          attendance_peak_hour: "—",
          recent_checkins_count: 0,
          revenue_chart: [],
          attendance_chart: [],
        };
        setMetrics(defaultData);
        dashboardMetricsCache[workspace] = { data: defaultData, timestamp: Date.now() };
      }
    } catch (err) {
      console.warn("Could not fetch dashboard metrics", err);
    } finally {
      setLoading(false);
      setRevalidating(false);
    }
  }, [workspace]);

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

    if (isCacheFresh) {
      // Background revalidate without blocking UI
      fetchMetrics(true);
    } else {
      fetchMetrics(false);
    }
  }, [workspace, isCacheFresh, fetchMetrics, router]);

  const handleSeedDemoData = async () => {
    if (!confirm("Are you sure you want to load sample records for your gym? This will only seed data for your account.")) {
      return;
    }
    setSeeding(true);
    try {
      await repsiApi.seedDemoData();
      delete dashboardMetricsCache[workspace];
      await fetchMetrics(false);
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

  const hasData = (metrics?.active_members ?? 0) > 0 || (metrics?.monthly_revenue ?? 0) > 0;
  const isSetupMode = !hasData && !dismissChecklist && !loading;

  const checklistSteps = [
    { title: "Gym profile", completed: true, href: `/${workspace}/settings` },
    { title: "Add membership plans", completed: false, href: `/${workspace}/memberships` },
    { title: "Add trainers", completed: false, href: `/${workspace}/trainers` },
    { title: "Add members", completed: (metrics?.active_members ?? 0) > 0, href: `/${workspace}/members` },
    { title: "Set up attendance", completed: false, href: `/${workspace}/attendance` },
    { title: "Public gym website", completed: false, href: `/${workspace}/website` },
  ];

  const completedStepsCount = checklistSteps.filter((s) => s.completed).length;
  const setupPercent = Math.round((completedStepsCount / checklistSteps.length) * 100);

  return (
    <div className="space-y-8">
      {/* ─────────────────────────────────────────────────────────────────────────────
          IMMEDIATE DASHBOARD SHELL HEADER (Renders instantly without blocking)
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-[#ECFDF3] dark:bg-emerald-950/60 text-[#15803D] dark:text-emerald-400 border border-[#B7E4C7] dark:border-emerald-800/40 inline-flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full bg-[#16A34A] ${revalidating ? "animate-ping" : "animate-pulse"}`} />
              WORKSPACE: /{workspace}
            </span>
            {revalidating && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Live sync
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] dark:text-white tracking-tight">
            {greeting}, Owner
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-zinc-400 mt-1">
            {isSetupMode ? "Let's finish setting up your gym." : "Today's overview — " + today}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGettingStartedModal(true)}
            className="border-[#D1D5DB] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-[#F8FAF9] dark:hover:bg-zinc-800 text-[#16A34A] rounded-xl font-bold shadow-2xs"
          >
            <Sparkles className="h-4 w-4 mr-1.5 text-[#16A34A]" />
            Getting Started
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedDemoData}
            disabled={seeding}
            title="Load sample demo records specifically for testing your gym"
            className="border-[#D1D5DB] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-[#F8FAF9] dark:hover:bg-zinc-800 text-[#64748B] dark:text-zinc-300 rounded-xl font-semibold shadow-2xs"
          >
            <Database className="h-3.5 w-3.5 mr-1.5" />
            {seeding ? "Seeding..." : "Load Demo Records"}
          </Button>

          <Link href={`/${workspace}/members/new`}>
            <Button size="sm" className="flex-shrink-0 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl font-bold shadow-sm transition-all active:scale-[0.99] cursor-pointer">
              <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      {/* Adaptive Setup Checklist Banner (when in setup phase) */}
      {isSetupMode ? (
        <div className="rounded-2xl border-2 border-[#16A34A]/30 bg-gradient-to-r from-[#F0FDF4] via-white to-[#F0FDF4] dark:from-[#081b10] dark:via-[#05110a] dark:to-[#081b10] p-6 sm:p-7 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-left w-full md:w-auto">
              <RepsiMascot pose="onboarding" size="md" animate={false} />
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-0.5 rounded">
                  SETUP PROGRESS: {setupPercent}%
                </span>
                <h3 className="text-xl font-black text-[#111714] dark:text-white tracking-tight">
                  Welcome to Repsi! Let's get your gym ready.
                </h3>
                <p className="text-xs sm:text-sm text-[#4A5D52] dark:text-[#A1B3A9] max-w-xl">
                  {completedStepsCount} of {checklistSteps.length} steps completed. Add your membership packages, staff coaches, and members to launch.
                </p>

                {/* Progress Bar */}
                <div className="w-full max-w-md h-2.5 rounded-full bg-[#E2EBE5] dark:bg-[#1b2b21] overflow-hidden mt-3">
                  <div
                    className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                    style={{ width: `${setupPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
              <Button
                onClick={() => setShowGettingStartedModal(true)}
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-sm"
              >
                <span>Continue setup →</span>
              </Button>
              <button
                type="button"
                onClick={() => setDismissChecklist(true)}
                className="text-xs text-[#64748B] hover:text-[#111714] dark:hover:text-white font-semibold py-1 transition-colors"
              >
                I'll do this later
              </button>
            </div>
          </div>

          {/* Checklist steps summary row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-5 mt-5 border-t border-[#16A34A]/20 text-xs">
            {checklistSteps.map((step, idx) => (
              <Link
                key={idx}
                href={step.href}
                className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                  step.completed
                    ? "bg-white/80 dark:bg-[#122419] border-[#16A34A]/30 text-[#16A34A]"
                    : "bg-white/40 dark:bg-[#0c1811] border-[#E5EAE6] dark:border-[#1c2e23] text-[#64748B] hover:border-[#16A34A]/40"
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#94A3B8] shrink-0" />
                )}
                <span className="truncate font-semibold">{step.title}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* Quick Actions (Instant Render) */}
      <QuickActions workspace={workspace} />

      {/* ─────────────────────────────────────────────────────────────────────────────
          PROGRESSIVE METRIC CARDS (Skeletons during initial load, instant cached render)
      ───────────────────────────────────────────────────────────────────────────── */}
      {loading && !metrics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse space-y-3">
              <div className="h-3.5 w-24 bg-slate-200 dark:bg-zinc-800 rounded-md" />
              <div className="h-8 w-32 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
              <div className="h-3 w-20 bg-slate-200 dark:bg-zinc-800 rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Active Members"
            sublabel={metrics?.active_members ? "Total enrolled" : "No members yet"}
            value={metrics ? metrics.active_members : 0}
            change={metrics ? metrics.revenue_growth_pct : 0}
            changeType="increase"
            iconName="users"
          />
          <StatCard
            label="Monthly Revenue"
            sublabel={metrics?.monthly_revenue ? "Current month" : "No payment data yet"}
            value={metrics ? metrics.monthly_revenue : 0}
            change={0}
            changeType="increase"
            isCurrency
            iconName="trending-up"
          />
          <StatCard
            label="Today's Attendance"
            sublabel={metrics?.today_attendance ? "Check-ins today" : "Attendance will appear after check-in"}
            value={metrics ? metrics.today_attendance : 0}
            change={0}
            changeType="increase"
            iconName="calendar-check"
          />
          <StatCard
            label="Expiring Soon"
            sublabel={metrics?.expiring_memberships ? "Within 7 days" : "No expiring plans"}
            value={metrics ? metrics.expiring_memberships : 0}
            change={0}
            changeType="decrease"
            iconName="alert-triangle"
          />
        </div>
      )}

      {/* Progressive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4">
          <RevenueChart data={metrics?.revenue_chart} />
        </div>
        <div className="lg:col-span-3">
          <AttendanceChart data={metrics?.attendance_chart} />
        </div>
      </div>

      {/* Activity Row */}
      <div className="grid grid-cols-1 gap-6">
        <RecentActivity />
      </div>

      {/* Permanent Getting Started Dialog */}
      <GettingStartedDialog
        workspace={workspace}
        isOpen={showGettingStartedModal}
        onClose={() => setShowGettingStartedModal(false)}
        completedSteps={{
          profile: true,
          memberships: false,
          trainers: false,
          members: (metrics?.active_members ?? 0) > 0,
          attendance: false,
          website: false,
        }}
      />
    </div>
  );
}
