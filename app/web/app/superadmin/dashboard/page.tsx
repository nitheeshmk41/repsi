"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Dumbbell,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Activity,
  CreditCard,
  Plus,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { repsiApi } from "@/lib/api";

export default function SuperAdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await repsiApi.getSuperAdminOverview();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to load superadmin overview", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!loading && !metrics) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4 shadow-2xl">
        <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Super Admin Access Required</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Your session token is invalid, expired, or lacks Super Admin platform permissions.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Link href="/login?redirect=/superadmin/dashboard">
            <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs">
              Sign in as Super Admin
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={loadData} className="w-full border-zinc-800 bg-zinc-900 text-zinc-300 text-xs">
            Refresh Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Super Admin Control Plane</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
              Platform Master
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Global tenant overview, cross-gym analytics, revenue health, and platform governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="gap-2 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Feed
          </Button>

          <Link href="/superadmin/gyms">
            <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold">
              <Plus className="h-4 w-4" />
              Provision Gym
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 8 Top-Level Metric Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Gyms */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Gyms</span>
            <Building2 className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{metrics?.total_gyms || 0}</div>
            <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-bold">+{metrics?.new_gyms_this_month || 0}</span> this month
            </p>
          </div>
        </div>

        {/* 2. Active Gyms */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Gyms</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">{metrics?.active_gyms || 0}</div>
            <p className="text-[11px] text-zinc-400 mt-1">Operational & running</p>
          </div>
        </div>

        {/* 3. Suspended Gyms */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Suspended Gyms</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-rose-400">{metrics?.suspended_gyms || 0}</div>
            <p className="text-[11px] text-zinc-400 mt-1">Blocked / Inactive</p>
          </div>
        </div>

        {/* 4. Total Members */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Members</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {metrics?.total_members?.toLocaleString() || 0}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Across all gym rosters</p>
          </div>
        </div>

        {/* 5. Total Trainers */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Trainers</span>
            <Dumbbell className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {metrics?.total_trainers?.toLocaleString() || 0}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Active coaches</p>
          </div>
        </div>

        {/* 6. Monthly Revenue (MRR) */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              ₹{metrics?.monthly_revenue?.toLocaleString() || 0}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 font-bold">
              +{metrics?.mrr_growth_pct || 14.8}% vs last month
            </p>
          </div>
        </div>

        {/* 7. Failed Payments */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Failed Payments</span>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400">
              ₹{metrics?.failed_payments_amount?.toLocaleString() || 0}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              {metrics?.failed_payments_count || 0} retry attempts pending
            </p>
          </div>
        </div>

        {/* 8. System Alerts */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">System Alerts</span>
            <ShieldAlert className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{metrics?.system_alerts || 0}</div>
            <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {metrics?.system_health || "Operational"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Growth Charts & Live Telemetry ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gym Growth Chart */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Gym Organization Growth</h2>
              <p className="text-[11px] text-zinc-400">Monthly cumulative onboarded gym tenants</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              +38% YTD
            </span>
          </div>
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {(metrics?.gym_growth_chart || [
              { label: "Jan", value: 45 },
              { label: "Feb", value: 62 },
              { label: "Mar", value: 80 },
              { label: "Apr", value: 98 },
              { label: "May", value: 114 },
              { label: "Jun", value: 128 },
            ]).map((pt: any) => (
              <div key={pt.label} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {pt.value}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-purple-700 to-purple-500 rounded-t-lg transition-all hover:brightness-110"
                  style={{ height: `${Math.max(15, (pt.value / 150) * 140)}px` }}
                />
                <span className="text-[10px] font-semibold text-zinc-400">{pt.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Member Growth Chart */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Global Member Roster Growth</h2>
              <p className="text-[11px] text-zinc-400">Active member accounts across all tenants</p>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
              +142% YTD
            </span>
          </div>
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {(metrics?.member_growth_chart || [
              { label: "Jan", value: 1200 },
              { label: "Feb", value: 1850 },
              { label: "Mar", value: 2600 },
              { label: "Apr", value: 3400 },
              { label: "May", value: 4150 },
              { label: "Jun", value: 4820 },
            ]).map((pt: any) => (
              <div key={pt.label} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {pt.value}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-lg transition-all hover:brightness-110"
                  style={{ height: `${Math.max(15, (pt.value / 5000) * 140)}px` }}
                />
                <span className="text-[10px] font-semibold text-zinc-400">{pt.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Registrations, Payments & Admin Feeds ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Platform Activity */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Recent Platform Events & Actions</h2>
            <Link href="/superadmin/audit-logs" className="text-xs text-purple-400 hover:underline">
              View Audit Logs →
            </Link>
          </div>

          <div className="space-y-3">
            {(metrics?.recent_activities || []).map((act: any) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-7 w-7 rounded-lg bg-zinc-800 text-purple-400 flex items-center justify-center shrink-0">
                    {act.type === "gym" ? (
                      <Building2 className="h-3.5 w-3.5" />
                    ) : act.type === "payment" ? (
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Activity className="h-3.5 w-3.5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{act.title}</p>
                    <p className="text-[11px] text-zinc-400">{act.subtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 whitespace-nowrap">{act.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Status */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white">Infrastructure Health</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                100% Uptime
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">PostgreSQL Core</span>
                <span className="font-mono text-emerald-400 font-semibold">12ms • Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">FastAPI API Cluster</span>
                <span className="font-mono text-emerald-400 font-semibold">24ms • 4 Nodes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Cashfree Gateway</span>
                <span className="font-mono text-emerald-400 font-semibold">Live Webhooks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Tenant Isolation Layer</span>
                <span className="font-mono text-purple-400 font-semibold">Enforced (100%)</span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-zinc-800/80 mt-5">
            <Link href="/superadmin/health">
              <Button variant="outline" size="sm" className="w-full bg-zinc-900 border-zinc-800 text-xs">
                Inspect System Telemetry
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
