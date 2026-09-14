"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Database, RefreshCw, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/features/dashboard/stat-card";
import { RevenueChart } from "@/features/dashboard/revenue-chart";
import { AttendanceChart } from "@/features/dashboard/attendance-chart";
import { RecentActivity } from "@/features/dashboard/recent-activity";
import { QuickActions } from "@/features/dashboard/quick-actions";
import { repsiApi } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            {today}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedDemoData}
            disabled={seeding}
            title="Load sample demo records specifically for your gym"
          >
            <Database className="h-4 w-4 mr-1.5" />
            {seeding ? "Seeding..." : "Load Sample Data"}
          </Button>

          <Link href={`/${workspace}/members/new`}>
            <Button size="sm" className="flex-shrink-0">
              <Plus className="h-4 w-4 mr-1" />
              Add Member
            </Button>
          </Link>
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
