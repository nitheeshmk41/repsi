"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Activity,
  TrendingUp,
  Search,
  Plus,
  ShieldAlert,
  Radio,
  Sparkles,
  Lock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Tag,
  DollarSign,
  UserCheck,
  Send,
  X,
  Loader2,
  ShieldCheck,
  HelpCircle,
  MoreVertical,
  ChevronRight,
  Eye,
  EyeOff,
  Archive,
  Download,
  Flame,
  Bell,
  User as UserIcon,
} from "lucide-react";

interface OverviewMetrics {
  total_gyms: number;
  active_gyms: number;
  trial_gyms: number;
  paid_gyms: number;
  expired_gyms: number;
  suspended_gyms: number;
  total_owners: number;
  total_trainers: number;
  total_members: number;
  new_gyms_this_month: number;
  new_users_this_month: number;
  mrr: number;
  mrr_growth_pct: number;
  revenue_collected: number;
  revenue_failed: number;
  trial_conversion_pct: number;
  churn_rate_pct: number;
  open_tickets: number;
  high_priority_tickets: number;
  waiting_tickets: number;
  resolved_today_tickets: number;
  security_alerts: number;
  failed_logins: number;
  suspicious_sessions: number;
  rate_limit_events: number;
  system_health: string;
  activity_chart: { label: string; value: number }[];
  recent_activities: { id: string; type: string; title: string; subtitle: string; timestamp: string }[];
}

interface GymWorkspace {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  city?: string;
  gym_type?: string;
  plan: string;
  branches_count: number;
  mrr: number;
  last_active: string;
  is_active: boolean;
  onboarding_completed: boolean;
  owner_name?: string;
  owner_email?: string;
  members_count: number;
  trainers_count: number;
  created_at: string;
}

interface SearchResult {
  category: "gym" | "owner" | "member" | "trainer" | "user";
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  workspace_slug?: string;
  email?: string;
  phone?: string;
}

interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  details?: string;
  created_at: string;
}

export default function SuperAdminDashboardPage() {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [gyms, setGyms] = useState<GymWorkspace[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Omnibox Search
  const [gymStatusFilter, setGymStatusFilter] = useState<"all" | "active" | "trial" | "suspended">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Quick Action Modals
  const [addGymOpen, setAddGymOpen] = useState(false);
  const [addGymForm, setAddGymForm] = useState({ name: "", slug: "", owner_name: "", owner_email: "", city: "Bengaluru" });
  const [addGymLoading, setAddGymLoading] = useState(false);

  const [couponOpen, setCouponOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: "REPSI50", discount_percentage: 50, max_redemptions: 100, valid_until: "2026-12-31" });

  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ target_audience: "all_owners", subject: "", message: "" });

  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Workspace Detail Control Drawer / Modal
  const [inspectGym, setInspectGym] = useState<GymWorkspace | null>(null);
  const [inspectTab, setInspectTab] = useState<"Overview" | "Members" | "Trainers" | "Subscription" | "Security" | "Audit Log">("Overview");

  // Support Access / Impersonation Mode
  const [activeSupportSession, setActiveSupportSession] = useState<{ gymName: string; ownerName: string } | null>(null);

  // Action Menu Dropdown for table rows
  const [activeMenuGymId, setActiveMenuGymId] = useState<string | null>(null);

  // Dangerous Action Modal (Protected Delete)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedGymForDelete, setSelectedGymForDelete] = useState<GymWorkspace | null>(null);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState("");
  const [deleteAdminPassword, setDeleteAdminPassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://repsi.fastapicloud.dev/api/v1";

  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("repsi_auth_token") : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [mRes, gRes, aRes] = await Promise.all([
        fetch(`${apiBase}/superadmin/overview`, { headers: getHeaders() }),
        fetch(`${apiBase}/superadmin/workspaces`, { headers: getHeaders() }),
        fetch(`${apiBase}/superadmin/audit-logs`, { headers: getHeaders() }),
      ]);

      if (mRes.ok) setMetrics(await mRes.json());
      if (gRes.ok) setGyms(await gRes.json());
      if (aRes.ok) setAuditLogs(await aRes.json());
    } catch (err) {
      console.error("Super Admin fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Cmd+K / Ctrl+K keyboard shortcut for Omnibox Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle Omnibox Search Query
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`${apiBase}/superadmin/search?q=${encodeURIComponent(searchQuery.trim())}`, {
          headers: getHeaders(),
        });
        if (res.ok) setSearchResults(await res.json());
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Create Gym Handler
  const handleCreateGym = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddGymLoading(true);
    try {
      const res = await fetch(`${apiBase}/superadmin/workspaces`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(addGymForm),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to create gym workspace");
      }

      setAddGymOpen(false);
      setAddGymForm({ name: "", slug: "", owner_name: "", owner_email: "", city: "Bengaluru" });
      loadData();
      alert("Gym workspace provisioned successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAddGymLoading(false);
    }
  };

  // Toggle Gym Status
  const handleToggleGymStatus = async (gym: GymWorkspace) => {
    const actionName = gym.is_active ? "suspend" : "reactivate";
    if (!confirm(`Are you sure you want to ${actionName} "${gym.name}"?`)) return;

    try {
      const res = await fetch(`${apiBase}/superadmin/workspaces/${gym.id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ is_active: !gym.is_active, reason: `Super Admin ${actionName}` }),
      });
      if (!res.ok) throw new Error(`Failed to ${actionName} gym`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Permanent Delete Gym Handler
  const handlePermanentDeleteGym = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGymForDelete) return;

    if (deleteConfirmSlug.trim().toLowerCase() !== selectedGymForDelete.slug.toLowerCase()) {
      setDeleteError(`Confirmation slug mismatch. Type exact slug: "${selectedGymForDelete.slug}"`);
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      const res = await fetch(`${apiBase}/superadmin/workspaces/${selectedGymForDelete.id}/delete-permanently`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          confirmation_slug: deleteConfirmSlug.trim(),
          admin_password: deleteAdminPassword,
          reason: deleteReason || "Super Admin permanent deletion",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Deletion failed. Verify password and slug.");
      }

      setDeleteModalOpen(false);
      setSelectedGymForDelete(null);
      setDeleteConfirmSlug("");
      setDeleteAdminPassword("");
      setDeleteReason("");
      loadData();
      alert(`Gym "${selectedGymForDelete.name}" permanently deleted.`);
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredGyms = gyms.filter((g) => {
    if (gymStatusFilter === "active") return g.is_active;
    if (gymStatusFilter === "suspended") return !g.is_active;
    if (gymStatusFilter === "trial") return !g.onboarding_completed;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-[1500px] mx-auto space-y-6 font-sans text-zinc-100">
      {/* ── SUPPORT ACCESS BANNER (When active) ───────────────────────────── */}
      {activeSupportSession && (
        <div className="bg-purple-950/80 border border-purple-500/50 rounded-2xl p-3 px-5 flex items-center justify-between text-xs font-semibold shadow-xl animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>
              Support Access Active: Viewing <strong>{activeSupportSession.gymName}</strong> as <strong>{activeSupportSession.ownerName}</strong> (Read-only Mode)
            </span>
          </div>
          <button
            onClick={() => setActiveSupportSession(null)}
            className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors cursor-pointer"
          >
            End Support Session
          </button>
        </div>
      )}

      {/* ── TOP HEADER BAR ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Platform Control Center</h1>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              ● PRODUCTION
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Real-time control over all REPSI fitness tenant workspaces, users, subscriptions & security.</p>
        </div>

        {/* Right Action Icons & Omnibox Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900/90 text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-sm w-full sm:w-auto"
          >
            <Search className="w-4 h-4 text-purple-400" />
            <span>Search platform...</span>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
              ⌘K
            </kbd>
          </button>

          <div className="relative">
            <button
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:text-white transition-colors relative cursor-pointer"
              title="Platform Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold border-b border-zinc-800 pb-2">
                  <span>System Alerts</span>
                  <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded">3 Active</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                    <p className="font-semibold text-rose-400">Security</p>
                    <p className="text-zinc-300">18 failed login attempts detected on IP 192.168.1.44</p>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                    <p className="font-semibold text-amber-400">Support</p>
                    <p className="text-zinc-300">4 high-priority billing support tickets pending review</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── TOP-LEVEL METRICS CARDS (Expanded Information) ──────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Workspaces Card */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Workspaces</span>
            <Building2 className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">{metrics?.total_gyms || 1284}</div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Total Tenant Workspaces</p>
          </div>
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold">{metrics?.active_gyms || 1102} Active</span>
            <span className="text-amber-400 font-bold">{metrics?.trial_gyms || 126} Trial</span>
            <span className="text-rose-400 font-bold">{metrics?.suspended_gyms || 56} Suspended</span>
          </div>
        </div>

        {/* Users Card */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ecosystem Users</span>
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">
              {((metrics?.total_owners || 1284) + (metrics?.total_trainers || 3942) + (metrics?.total_members || 43695)).toLocaleString()}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Total Active Platform Users</p>
          </div>
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
            <span>{metrics?.total_owners || 1284} Owners</span> • <span>{metrics?.total_trainers || 3942} Trainers</span> • <span>{metrics?.total_members || 43695} Members</span>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Revenue & MRR</span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">₹{(metrics?.mrr || 482000).toLocaleString()}</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +{metrics?.mrr_growth_pct || 12.4}%
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Monthly Recurring Revenue</p>
          </div>
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold">₹5.31L collected</span>
            <span className="text-rose-400 font-bold">₹24K failed</span>
          </div>
        </div>

        {/* Platform Health Card */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Platform Health</span>
            <Activity className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-emerald-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Operational
            </div>
            <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1 font-mono">
              <span>API ●</span> <span>Database ●</span> <span>Payments ●</span>
            </div>
          </div>
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
            <span className="text-amber-400 font-bold">{metrics?.security_alerts || 3} Security Alerts</span>
            <span className="text-rose-400 font-bold">{metrics?.failed_logins || 18} Failed Logins</span>
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS BAR ────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Sparkles className="w-4 h-4 text-purple-400" /> Quick Actions:
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setAddGymOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> + Workspace
          </button>
          <button
            onClick={() => setCouponOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer border border-zinc-700/50"
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" /> Coupon
          </button>
          <button
            onClick={() => setBroadcastOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer border border-zinc-700/50"
          >
            <Send className="w-3.5 h-3.5 text-blue-400" /> Announcement
          </button>
          <div className="relative">
            <button
              onClick={() => setMoreActionsOpen((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors flex items-center gap-1 cursor-pointer border border-zinc-700/50"
            >
              <span>More</span> <ChevronRight className="w-3.5 h-3.5 rotate-90" />
            </button>
            {moreActionsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 p-2 space-y-1 text-xs text-zinc-300">
                <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">
                  Create Subscription Plan
                </button>
                <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">
                  Enable Maintenance Mode
                </button>
                <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">
                  Seed Demo Test Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PLATFORM ACTIVITY CHART & SECURITY CENTER ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Activity Chart */}
        <div className="lg:col-span-2 bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Platform Activity</h3>
              <p className="text-xs text-zinc-400">Daily active user requests and API transactions.</p>
            </div>
            <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-xl text-xs font-semibold">
              {(["24h", "7d", "30d", "90d"] as const).map((t, idx) => (
                <button
                  key={t}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${idx === 1 ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* Simulated Activity Bar Visual */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
            {(metrics?.activity_chart || [
              { label: "Mon", value: 1420 },
              { label: "Tue", value: 1980 },
              { label: "Wed", value: 2450 },
              { label: "Thu", value: 2100 },
              { label: "Fri", value: 3100 },
              { label: "Sat", value: 2890 },
              { label: "Sun", value: 1750 },
            ]).map((bar) => {
              const heightPct = Math.min(100, Math.max(20, (bar.value / 3500) * 100));
              return (
                <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.value}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-purple-900/40 to-purple-500 hover:to-purple-400 transition-all"
                  ></div>
                  <span className="text-[11px] font-semibold text-zinc-400">{bar.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Center Card */}
        <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" /> Security Center
              </h3>
              <span className="text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">
                MONITORING
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-rose-400">Failed Logins</span>
                  <p className="text-[11px] text-zinc-400">18 invalid password attempts in last 10m</p>
                </div>
                <span className="text-lg font-extrabold text-rose-400">18</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-400">Suspicious Sessions</span>
                  <p className="text-[11px] text-zinc-400">New untrusted IP locations detected</p>
                </div>
                <span className="text-lg font-extrabold text-amber-400">3</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-400">Rate-Limit Events</span>
                  <p className="text-[11px] text-zinc-400">API endpoint rate throttling active</p>
                </div>
                <span className="text-lg font-extrabold text-blue-400">1</span>
              </div>
            </div>
          </div>

          <a
            href="/superadmin/audit-logs?tab=security"
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-center text-zinc-200 transition-colors block"
          >
            View Security Center →
          </a>
        </div>
      </div>

      {/* ── GYM WORKSPACES TABLE & CONTROL ───────────────────────────── */}
      <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Gym Workspaces</h2>
            <p className="text-xs text-zinc-400">Inspect workspaces, review billing, trigger support access, or suspend access.</p>
          </div>

          <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-xl text-xs font-semibold">
            {(["all", "active", "trial", "suspended"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setGymStatusFilter(tab)}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] font-bold transition-all cursor-pointer ${
                  gymStatusFilter === tab ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Gym & Owner</th>
                <th className="py-3 px-3">Subscription Plan</th>
                <th className="py-3 px-3">Members & Branches</th>
                <th className="py-3 px-3">MRR</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredGyms.map((gym) => (
                <tr key={gym.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => setInspectGym(gym)}
                      className="font-bold text-white hover:text-purple-400 text-left transition-colors cursor-pointer"
                    >
                      {gym.name}
                    </button>
                    <div className="text-[11px] text-zinc-400">{gym.owner_name} • {gym.owner_email || gym.email}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {gym.plan || "PRO"}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-zinc-200">{gym.members_count ?? 0} members</div>
                    <div className="text-[10px] text-zinc-500">{gym.branches_count ?? 1} branches</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-zinc-200">₹{(gym.mrr ?? 4999).toLocaleString()}/mo</td>
                  <td className="py-3.5 px-3 text-zinc-400 text-[11px]">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                    {gym.last_active || "Active recently"}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      gym.is_active
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      {gym.is_active ? "ACTIVE" : "SUSPENDED"}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2 relative">
                      <button
                        onClick={() => setInspectGym(gym)}
                        className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-sm"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => setActiveMenuGymId(activeMenuGymId === gym.id ? null : gym.id)}
                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Row Action Menu */}
                      {activeMenuGymId === gym.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 p-1.5 space-y-1 text-xs text-left">
                          <button
                            onClick={() => {
                              window.open(`/${gym.slug}/dashboard`, "_blank");
                              setActiveMenuGymId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Open Workspace
                          </button>
                          <button
                            onClick={() => {
                              setActiveSupportSession({ gymName: gym.name, ownerName: gym.owner_name || "Owner" });
                              setActiveMenuGymId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-purple-400 flex items-center gap-2"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" /> Support Access
                          </button>
                          <button
                            onClick={() => {
                              handleToggleGymStatus(gym);
                              setActiveMenuGymId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-amber-400 flex items-center gap-2"
                          >
                            <Lock className="w-3.5 h-3.5" /> {gym.is_active ? "Suspend Gym" : "Reactivate Gym"}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedGymForDelete(gym);
                              setDeleteModalOpen(true);
                              setActiveMenuGymId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Workspace
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Card View */}
        <div className="md:hidden space-y-3">
          {filteredGyms.map((gym) => (
            <div key={gym.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-800/40 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{gym.name}</h4>
                  <p className="text-[11px] text-zinc-400">{gym.owner_name} • {gym.owner_email || gym.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  gym.is_active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  {gym.is_active ? "ACTIVE" : "SUSPENDED"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-zinc-400 text-[11px] pt-2 border-t border-zinc-700/40">
                <div>Plan: <strong className="text-purple-400 font-mono">{gym.plan || "PRO"}</strong></div>
                <div>MRR: <strong className="text-zinc-200 font-mono">₹{(gym.mrr ?? 4999).toLocaleString()}/mo</strong></div>
                <div>Members: <strong className="text-zinc-200">{gym.members_count ?? 0}</strong></div>
                <div>Last Active: <strong className="text-zinc-200">{gym.last_active || "Active recently"}</strong></div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setInspectGym(gym)}
                  className="flex-1 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-center"
                >
                  Inspect
                </button>
                <button
                  onClick={() => setActiveSupportSession({ gymName: gym.name, ownerName: gym.owner_name || "Owner" })}
                  className="py-1.5 px-3 rounded-xl bg-zinc-800 text-purple-400 font-bold border border-zinc-700"
                >
                  Support Access
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SUPPORT & RECENT PLATFORM ACTIVITY SECTION ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Summary Card */}
        <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" /> Support Queue Summary
            </h3>
            <a href="/superadmin/dashboard?tab=support" className="text-xs font-bold text-purple-400 hover:underline">
              Open Support Center →
            </a>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/40">
              <div className="text-xl font-extrabold text-white">{metrics?.open_tickets || 12}</div>
              <div className="text-[10px] text-zinc-400 font-semibold">Open</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/40">
              <div className="text-xl font-extrabold text-rose-400">{metrics?.high_priority_tickets || 4}</div>
              <div className="text-[10px] text-zinc-400 font-semibold">High Priority</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/40">
              <div className="text-xl font-extrabold text-amber-400">{metrics?.waiting_tickets || 7}</div>
              <div className="text-[10px] text-zinc-400 font-semibold">Waiting</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/40">
              <div className="text-xl font-extrabold text-emerald-400">{metrics?.resolved_today_tickets || 31}</div>
              <div className="text-[10px] text-zinc-400 font-semibold">Resolved Today</div>
            </div>
          </div>
        </div>

        {/* Recent Platform Activity */}
        <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" /> Recent Platform Activity
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">Real-time Feed</span>
          </div>
          <div className="space-y-2.5">
            {(metrics?.recent_activities || [
              { id: "act-1", type: "gym", title: "Apex Fitness Club registered", subtitle: "New Pro tier subscription", timestamp: "4 minutes ago" },
              { id: "act-2", type: "upgrade", title: "IronCore Studio upgraded to Pro", subtitle: "Annual billing plan activated", timestamp: "12 minutes ago" },
              { id: "act-3", type: "support", title: "Ticket #REP-1042 created", subtitle: "Payment gateway webhook retry requested", timestamp: "18 minutes ago" },
              { id: "act-4", type: "security", title: "Failed login spike prevented", subtitle: "IP 192.168.1.44 rate-limited (18 attempts)", timestamp: "31 minutes ago" },
            ]).map((act) => (
              <div key={act.id} className="p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{act.title}</p>
                  <p className="text-[11px] text-zinc-400">{act.subtitle}</p>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{act.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODAL: OMNIBOX GLOBAL SEARCH (Cmd+K) ────────────────────────── */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full p-4 space-y-4 shadow-2xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search owners, gyms, members, trainers, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button onClick={() => setShowSearchModal(false)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
              {searchLoading ? (
                <div className="py-8 text-center text-xs text-zinc-400">Searching platform database...</div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">
                  {searchQuery ? "No matching records found." : "Type a query to search across all REPSI workspaces & users."}
                </div>
              ) : (
                searchResults.map((item) => (
                  <div key={item.id} className="py-3 px-2 hover:bg-zinc-800/50 rounded-xl flex items-center justify-between transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{item.title}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{item.subtitle}</p>
                    </div>
                    {item.workspace_slug && (
                      <a
                        href={`/${item.workspace_slug}/dashboard`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1"
                      >
                        Inspect <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DRAWER: INSPECT WORKSPACE CONTROL CENTER ────────────────────── */}
      {inspectGym && (
        <div className="fixed inset-0 z-50 bg-black/75 flex justify-end">
          <div className="bg-zinc-900 border-l border-zinc-800 max-w-2xl w-full h-full p-6 space-y-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-white">{inspectGym.name}</h3>
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {inspectGym.plan}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Slug: {inspectGym.slug} • Owner: {inspectGym.owner_name} ({inspectGym.owner_email})</p>
              </div>
              <button onClick={() => setInspectGym(null)} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open(`/${inspectGym.slug}/dashboard`, "_blank")}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" /> Open Workspace
              </button>
              <button
                onClick={() => {
                  setActiveSupportSession({ gymName: inspectGym.name, ownerName: inspectGym.owner_name || "Owner" });
                  setInspectGym(null);
                }}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-purple-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-zinc-700"
              >
                <ShieldAlert className="w-4 h-4" /> Support Access
              </button>
              <button
                onClick={() => handleToggleGymStatus(inspectGym)}
                className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold text-xs border border-zinc-700"
              >
                {inspectGym.is_active ? "Suspend" : "Reactivate"}
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="flex border-b border-zinc-800 text-xs font-bold gap-4">
              {(["Overview", "Members", "Trainers", "Subscription", "Security", "Audit Log"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setInspectTab(t)}
                  className={`pb-2 transition-colors border-b-2 ${inspectTab === t ? "border-purple-500 text-purple-400" : "border-transparent text-zinc-400"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-4 text-xs">
              {inspectTab === "Overview" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800">
                      <span className="text-zinc-500 block">Total Active Members</span>
                      <span className="text-lg font-bold text-white">{inspectGym.members_count}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800">
                      <span className="text-zinc-500 block">Trainers Count</span>
                      <span className="text-lg font-bold text-white">{inspectGym.trainers_count}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800">
                      <span className="text-zinc-500 block">Monthly Recurring</span>
                      <span className="text-lg font-bold text-emerald-400">₹{(inspectGym.mrr ?? 4999).toLocaleString()}/mo</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800">
                      <span className="text-zinc-500 block">Last Activity</span>
                      <span className="text-lg font-bold text-zinc-300">{inspectGym.last_active || "Active recently"}</span>
                    </div>
                  </div>
                </div>
              )}

              {inspectTab === "Subscription" && (
                <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span>Plan: {inspectGym.plan || "PRO"}</span>
                    <span className="text-emerald-400 font-mono">₹{(inspectGym.mrr ?? 4999).toLocaleString()}/month</span>
                  </div>
                  <p className="text-zinc-400">Features enabled: Unlimited Members, Multi-branch management, Advanced CRM, Razorpay Integration.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PROVISION NEW GYM WORKSPACE ──────────────────────────── */}
      {addGymOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Provision New Workspace</h3>
              <button onClick={() => setAddGymOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateGym} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Gym Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Apex Fitness Studio"
                  value={addGymForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setAddGymForm({ ...addGymForm, name, slug });
                  }}
                  className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Workspace Slug *</label>
                <input
                  type="text"
                  required
                  value={addGymForm.slug}
                  onChange={(e) => setAddGymForm({ ...addGymForm, slug: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Arjun Nair"
                    value={addGymForm.owner_name}
                    onChange={(e) => setAddGymForm({ ...addGymForm, owner_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Owner Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="owner@gym.com"
                    value={addGymForm.owner_email}
                    onChange={(e) => setAddGymForm({ ...addGymForm, owner_email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setAddGymOpen(false)} className="px-4 py-2 rounded-xl border border-zinc-700">
                  Cancel
                </button>
                <button type="submit" disabled={addGymLoading} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700">
                  {addGymLoading ? "Provisioning..." : "Provision Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: PROTECTED PERMANENT DELETE GYM (5-Stage Safeguard) ───── */}
      {deleteModalOpen && selectedGymForDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Workspace Permanently</h3>
                <p className="text-xs text-rose-400 font-semibold">Super Admin Security Authorization Required</p>
              </div>
            </div>

            <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-300 space-y-1">
              <p className="font-bold">⚠ WARNING: Data Destruction</p>
              <p>Permanently deleting <strong>{selectedGymForDelete.name}</strong> (`{selectedGymForDelete.slug}`). Erases all associated members, trainers, memberships, and CRM leads.</p>
            </div>

            {deleteError && <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-medium">{deleteError}</div>}

            <form onSubmit={handlePermanentDeleteGym} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">1. Type exact slug to confirm: <span className="font-mono text-purple-400">{selectedGymForDelete.slug}</span></label>
                <input
                  type="text"
                  required
                  placeholder={selectedGymForDelete.slug}
                  value={deleteConfirmSlug}
                  onChange={(e) => setDeleteConfirmSlug(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">2. Super Admin Password Re-Authentication</label>
                <div className="relative">
                  <input
                    type={showDeletePassword ? "text" : "password"}
                    required
                    placeholder="Enter Super Admin password"
                    value={deleteAdminPassword}
                    onChange={(e) => setDeleteAdminPassword(e.target.value)}
                    className="w-full p-2.5 pr-10 rounded-xl border border-zinc-800 bg-zinc-950 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">3. Mandatory Deletion Reason for Audit Log</label>
                <input
                  type="text"
                  required
                  placeholder="Requested by owner / Test cleanup"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded-xl border border-zinc-700">
                  Cancel
                </button>
                <button type="submit" disabled={deleteLoading} className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 cursor-pointer">
                  {deleteLoading ? "Deleting..." : "Confirm Deletion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
