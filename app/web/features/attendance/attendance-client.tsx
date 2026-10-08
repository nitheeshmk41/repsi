"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  UserCheck,
  Users,
  Clock,
  TrendingUp,
  Search,
  Plus,
  CheckCircle2,
  LogOut,
  QrCode,
  Scan,
  Sparkles,
  Dumbbell,
  ShieldCheck,
  RefreshCw,
  X,
  ArrowRight,
  ExternalLink,
  Settings,
  History,
  BarChart3,
  Flame,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  repsiApi,
  ApiAttendance,
  ApiAttendanceSummary,
  ApiCurrentlyInside,
  ApiAttendanceQR,
  ApiAttendanceSettings,
  ApiAttendanceAnalytics,
  ApiMember,
  ApiTrainer,
} from "@/lib/api";
import { getWorkspaceFromPath, slugToGymName } from "@/lib/workspace";

// Sub-components
import { QrManagementCard } from "./components/qr-management-card";
import { CurrentlyInsideTable } from "./components/currently-inside-table";
import { AttendanceHistoryTable } from "./components/attendance-history-table";
import { AttendanceAnalyticsView } from "./components/attendance-analytics-view";
import { AttendanceSettingsCard } from "./components/attendance-settings-card";

type TabKey = "overview" | "qr_manager" | "history" | "analytics" | "settings";

export function AttendanceClient() {
  const pathname = usePathname();
  const workspace = getWorkspaceFromPath(pathname);
  const gymName = slugToGymName(workspace);

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [checkIns, setCheckIns] = useState<ApiAttendance[]>([]);
  const [currentlyInside, setCurrentlyInside] = useState<ApiCurrentlyInside[]>([]);
  const [summary, setSummary] = useState<ApiAttendanceSummary>({
    today_total: 0,
    currently_inside: 0,
    total_checked_out: 0,
    peak_hour: "06:00 – 08:30 AM",
    average_dwell_minutes: 60,
    abnormal_sessions_count: 0,
    auto_checkouts_count: 0,
  });
  const [activeQr, setActiveQr] = useState<ApiAttendanceQR | null>(null);
  const [settings, setSettings] = useState<ApiAttendanceSettings | null>(null);
  const [analytics, setAnalytics] = useState<ApiAttendanceAnalytics | null>(null);
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [trainers, setTrainers] = useState<ApiTrainer[]>([]);

  // Manual Check-In Modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualSearch, setManualSearch] = useState("");
  const [manualTab, setManualTab] = useState<"member" | "trainer">("member");

  // Scanner Simulator Modal
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [scanInput, setScanInput] = useState("");
  const [scanStatus, setScanStatus] = useState<{
    type: "success" | "error";
    message: string;
    details?: string;
  } | null>(null);
  const [scanning, setScanning] = useState(false);

  const loadData = async () => {
    try {
      const [att, inside, sum, qr, sett, ana, mems, trs] = await Promise.all([
        repsiApi.getAttendance(),
        repsiApi.getCurrentlyInside(),
        repsiApi.getAttendanceSummary(),
        repsiApi.getActiveQr().catch(() => null),
        repsiApi.getAttendanceSettings().catch(() => null),
        repsiApi.getAttendanceAnalytics().catch(() => null),
        repsiApi.getMembers().catch(() => []),
        repsiApi.getTrainers().catch(() => []),
      ]);

      setCheckIns(att);
      setCurrentlyInside(inside);
      setSummary(sum);
      if (qr) setActiveQr(qr);
      if (sett) setSettings(sett);
      if (ana) setAnalytics(ana);
      setMembers(mems);
      setTrainers(trs);
    } catch (err) {
      console.error("Failed to load attendance dashboard data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-refresh live data every 20 seconds
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, [workspace]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const handleManualCheckInMember = async (m: ApiMember) => {
    try {
      await repsiApi.checkInMember(m.id, m.name);
      await loadData();
      setManualModalOpen(false);
      setManualSearch("");
    } catch (e: any) {
      alert(e.message || "Failed to check in member");
    }
  };

  const handleManualCheckInTrainer = async (t: ApiTrainer) => {
    try {
      await repsiApi.checkInTrainer(t.id, t.name);
      await loadData();
      setManualModalOpen(false);
      setManualSearch("");
    } catch (e: any) {
      alert(e.message || "Failed to check in trainer");
    }
  };

  const handleSimulateScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    setScanning(true);
    setScanStatus(null);
    try {
      const res = await repsiApi.scanQr(scanInput.trim());
      setScanStatus({
        type: "success",
        message: res.message,
        details: `Session status: ${res.action === "check_in" ? "CHECKED_IN" : "CHECKED_OUT"}`,
      });
      await loadData();
      setScanInput("");
    } catch (err: any) {
      setScanStatus({
        type: "error",
        message: err.message || "Access scan failed",
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
              Attendance Command Hub
            </h1>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs font-semibold">
              Live Access
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Real-time gym attendance, secure revocable QR passes, smart auto-checkout, and analytics.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-xs gap-1.5 h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setScannerModalOpen(true)}
            className="text-xs gap-1.5 h-9"
          >
            <Scan className="w-3.5 h-3.5 text-blue-500" />
            <span>Fast Pass Scan</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setManualModalOpen(true)}
            className="text-xs gap-1.5 h-9 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] shadow-sm font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Entry</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--border)] overflow-x-auto pb-1">
        {[
          { key: "overview", label: "Today's Overview & Live Inside", icon: Users },
          { key: "qr_manager", label: "Attendance QR Station", icon: QrCode },
          { key: "history", label: "Attendance History Log", icon: History },
          { key: "analytics", label: "Attendance Analytics", icon: BarChart3 },
          { key: "settings", label: "Attendance Policies & Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & CURRENTLY INSIDE */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Today's Check-Ins
              </span>
              <p className="text-2xl font-extrabold text-[var(--text)]">{summary.today_total}</p>
              <span className="text-[10px] text-emerald-600 font-medium">Scans recorded today</span>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Currently Inside
              </span>
              <p className="text-2xl font-extrabold text-emerald-600 flex items-center gap-1.5">
                <span>{summary.currently_inside}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              </p>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">Active workout sessions</span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Checked Out
              </span>
              <p className="text-2xl font-extrabold text-[var(--text)]">{summary.total_checked_out}</p>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">Completed sessions</span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Average Session
              </span>
              <p className="text-2xl font-extrabold text-[var(--text)]">
                {Math.floor(summary.average_dwell_minutes / 60)}h {summary.average_dwell_minutes % 60}m
              </p>
              <span className="text-[10px] text-blue-600 font-medium">Daily dwell time</span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Peak Time
              </span>
              <p className="text-xs font-bold text-[var(--text)] truncate font-mono mt-1">
                {summary.peak_hour}
              </p>
              <span className="text-[10px] text-amber-600 font-medium">Busiest window</span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Auto Check-Outs
              </span>
              <p className="text-2xl font-extrabold text-amber-600">{summary.auto_checkouts_count}</p>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">Smart closing rule</span>
            </div>
          </div>

          {/* Live Currently Inside Table */}
          <CurrentlyInsideTable members={currentlyInside} onRefresh={loadData} />
        </div>
      )}

      {/* TAB 2: ATTENDANCE QR STATION */}
      {activeTab === "qr_manager" && (
        <div className="space-y-6">
          <QrManagementCard
            workspace={workspace}
            gymName={gymName}
            activeQr={activeQr}
            onRefresh={loadData}
          />
        </div>
      )}

      {/* TAB 3: ATTENDANCE HISTORY LOG */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <AttendanceHistoryTable records={checkIns} gymName={gymName} />
        </div>
      )}

      {/* TAB 4: ATTENDANCE ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <AttendanceAnalyticsView
            analytics={analytics}
            averageDwellMinutes={summary.average_dwell_minutes}
          />
        </div>
      )}

      {/* TAB 5: SETTINGS & POLICIES */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <AttendanceSettingsCard settings={settings} onRefresh={loadData} />
        </div>
      )}

      {/* Fast Pass Scanner Simulator Modal */}
      {scannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-[var(--text)]">Fast Pass Turnstile Simulator</h3>
              </div>
              <button
                onClick={() => setScannerModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              Simulate member camera scanner or turnstile gate optical read. If member is already inside, this automatically checks them out; otherwise checks them in.
            </p>

            <form onSubmit={handleSimulateScan} className="space-y-3">
              <input
                type="text"
                autoFocus
                placeholder="Scan pass payload, member email, or phone..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />

              <Button
                type="submit"
                disabled={scanning || !scanInput.trim()}
                className="w-full text-xs font-semibold h-10 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {scanning ? "Processing..." : "Process Entrance Scan"}
              </Button>
            </form>

            {scanStatus && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  scanStatus.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {scanStatus.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{scanStatus.message}</span>
                </div>
                {scanStatus.details && <p className="text-[11px] opacity-80">{scanStatus.details}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Check-In Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text)]">Reception Manual Check-In</h3>
              <button
                onClick={() => setManualModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 text-xs">
              <button
                type="button"
                onClick={() => setManualTab("member")}
                className={`pb-1 font-semibold ${manualTab === "member" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-[var(--text-muted)]"}`}
              >
                Members ({members.length})
              </button>
              <button
                type="button"
                onClick={() => setManualTab("trainer")}
                className={`pb-1 font-semibold ${manualTab === "trainer" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-[var(--text-muted)]"}`}
              >
                Trainers ({trainers.length})
              </button>
            </div>

            <input
              type="text"
              placeholder="Search by name, phone or email..."
              value={manualSearch}
              onChange={(e) => setManualSearch(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none"
            />

            <div className="max-h-60 overflow-y-auto divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl">
              {manualTab === "member" ? (
                members
                  .filter((m) =>
                    m.name.toLowerCase().includes(manualSearch.toLowerCase()) ||
                    m.phone.includes(manualSearch)
                  )
                  .map((m) => (
                    <div
                      key={m.id}
                      className="p-3 flex items-center justify-between hover:bg-[var(--surface-hover)] text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[var(--text)]">{m.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{m.phone || m.email}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleManualCheckInMember(m)}
                        className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Check In
                      </Button>
                    </div>
                  ))
              ) : (
                trainers
                  .filter((t) =>
                    t.name.toLowerCase().includes(manualSearch.toLowerCase()) ||
                    t.phone.includes(manualSearch)
                  )
                  .map((t) => (
                    <div
                      key={t.id}
                      className="p-3 flex items-center justify-between hover:bg-[var(--surface-hover)] text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[var(--text)]">{t.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{t.phone}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleManualCheckInTrainer(t)}
                        className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Check In
                      </Button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
