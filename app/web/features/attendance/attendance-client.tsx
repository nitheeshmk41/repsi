"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { repsiApi, ApiAttendance, ApiMember, ApiTrainer } from "@/lib/api";
import { getWorkspaceFromPath, slugToGymName } from "@/lib/workspace";
import { QrCodeView } from "@/components/ui/qr-code-view";

export function AttendanceClient() {
  const pathname = usePathname();
  const workspace = getWorkspaceFromPath(pathname);
  const gymName = slugToGymName(workspace);

  const [checkIns, setCheckIns] = useState<ApiAttendance[]>([]);
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [trainers, setTrainers] = useState<ApiTrainer[]>([]);
  const [summary, setSummary] = useState({
    today_total: 0,
    currently_inside: 0,
    peak_hour: "06:00 – 08:30 AM",
    average_dwell_minutes: 60,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "in" | "out" | "member" | "trainer">("all");
  const [searchTable, setSearchTable] = useState("");

  // Modals
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);

  // Manual Modal State
  const [manualTab, setManualTab] = useState<"member" | "trainer">("member");
  const [manualSearch, setManualSearch] = useState("");

  // Scanner Modal State
  const [scanInput, setScanInput] = useState("");
  const [scanStatus, setScanStatus] = useState<{
    type: "success" | "error";
    message: string;
    details?: string;
  } | null>(null);
  const [scanning, setScanning] = useState(false);

  // Load all data
  const loadData = async () => {
    try {
      const [att, mems, trs, sum] = await Promise.all([
        repsiApi.getAttendance(),
        repsiApi.getMembers(),
        repsiApi.getTrainers(),
        repsiApi.getAttendanceSummary(),
      ]);
      setCheckIns(att);
      setMembers(mems);
      setTrainers(trs);
      setSummary(sum);
    } catch (err) {
      console.error("Failed to load attendance data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener("repsi_storage_update", handleUpdate);
    return () => window.removeEventListener("repsi_storage_update", handleUpdate);
  }, [workspace]);

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

  const handleCheckOut = async (attendanceId: string) => {
    try {
      await repsiApi.checkOut(attendanceId);
      await loadData();
    } catch (e: any) {
      alert(e.message || "Failed to check out");
    }
  };

  const handleScanSubmit = async (customPayload?: string) => {
    const payload = (customPayload || scanInput).trim();
    if (!payload) return;

    setScanning(true);
    setScanStatus(null);
    try {
      const res = await repsiApi.scanQr(payload);
      setScanStatus({
        type: "success",
        message: res.message || `${res.person_name} marked ${res.action === "check_in" ? "IN" : "OUT"}!`,
        details: `${res.person_type.toUpperCase()} • Action: ${res.action === "check_in" ? "Check In" : "Check Out"}`,
      });
      setScanInput("");
      await loadData();
    } catch (e: any) {
      setScanStatus({
        type: "error",
        message: e.message || "Invalid or unrecognized QR pass",
        details: "Ensure the member or trainer belongs to this gym workspace.",
      });
    } finally {
      setScanning(false);
    }
  };

  // Helper to determine if a member or trainer is currently inside
  const isMemberInside = (memberId: string) => {
    return checkIns.find((c) => c.memberId === memberId && c.status === "in");
  };

  const isTrainerInside = (trainerId: string) => {
    return checkIns.find((c) => c.trainerId === trainerId && c.status === "in");
  };

  // Counts
  const currentlyInsideCount = checkIns.filter((c) => c.status === "in").length;
  const trainersInsideCount = checkIns.filter((c) => c.status === "in" && c.personType === "trainer").length;
  const membersInsideCount = checkIns.filter((c) => c.status === "in" && c.personType === "member").length;
  const todayTotalCount = checkIns.length;

  // Filtered rows for table
  const filteredCheckIns = checkIns.filter((item) => {
    if (filter === "in" && item.status !== "in") return false;
    if (filter === "out" && item.status !== "out") return false;
    if (filter === "member" && item.personType !== "member") return false;
    if (filter === "trainer" && item.personType !== "trainer") return false;

    if (searchTable) {
      const query = searchTable.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.personType.toLowerCase().includes(query) ||
        item.method.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Filtered lists for manual modal
  const filteredMembers = members.filter((m) => {
    if (!manualSearch) return true;
    const q = manualSearch.toLowerCase();
    return m.name.toLowerCase().includes(q) || (m.phone && m.phone.includes(q)) || (m.email && m.email.toLowerCase().includes(q));
  });

  const filteredTrainers = trainers.filter((t) => {
    if (!manualSearch) return true;
    const q = manualSearch.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      (t.phone && t.phone.includes(q)) ||
      (t.specialization && t.specialization.toLowerCase().includes(q))
    );
  });

  const gymEntranceQrPayload = `repsi://gym/${workspace}/entrance`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Turnstile Attendance</h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
              Live Synced
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Real-time biometric, QR, and manual check-ins for both members and trainers in {gymName}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setRefreshing(true);
              loadData();
            }}
            disabled={refreshing}
            className="gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setScanStatus(null);
              setScanInput("");
              setScannerModalOpen(true);
            }}
            className="gap-1.5 text-xs font-semibold border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
          >
            <Scan className="h-4 w-4 text-emerald-600" />
            Scan QR Pass
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setQrModalOpen(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <QrCode className="h-4 w-4 text-[var(--primary)]" />
            Gym Entrance QR
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setManualSearch("");
              setManualModalOpen(true);
            }}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] font-bold text-xs shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Manual Attendance
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-[var(--text-muted)]">Today&apos;s Check-ins</span>
            <div className="w-7 h-7 rounded-[6px] bg-[var(--background)] border border-[var(--border)] flex items-center justify-center">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums">{todayTotalCount}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Live entries today</p>
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-[var(--text-muted)]">Currently on Floor</span>
            <div className="w-7 h-7 rounded-[6px] bg-[var(--background)] border border-[var(--border)] flex items-center justify-center">
              <Users className="h-3.5 w-3.5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums">{currentlyInsideCount}</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {membersInsideCount} Members · {trainersInsideCount} Trainers
          </p>
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-[var(--text-muted)]">Trainers On Duty</span>
            <div className="w-7 h-7 rounded-[6px] bg-[var(--background)] border border-[var(--border)] flex items-center justify-center">
              <Dumbbell className="h-3.5 w-3.5 text-indigo-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums">{trainersInsideCount}</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Active floor coaches</p>
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-[var(--text-muted)]">Peak Turnstile Hour</span>
            <div className="w-7 h-7 rounded-[6px] bg-[var(--background)] border border-[var(--border)] flex items-center justify-center">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--text)] tabular-nums">{summary.peak_hour}</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">High volume window</p>
        </div>
      </div>

      {/* Live Stream Table */}
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[var(--text)]">Today&apos;s Live Turnstile Stream</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Verified entries and departures recorded for members and trainers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search name or type..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)] w-44"
              />
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-2.5" />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[var(--background)] p-1 rounded-lg border border-[var(--border)] text-xs">
              {[
                { key: "all", label: "All" },
                { key: "in", label: "Inside Now" },
                { key: "member", label: "Members" },
                { key: "trainer", label: "Trainers" },
                { key: "out", label: "Checked Out" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key as any)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    filter === t.key
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Entries List */}
        <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface)]">
          {filteredCheckIns.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <UserCheck className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
              <p className="text-sm font-semibold text-[var(--text)]">No attendance records found</p>
              <p className="text-xs text-[var(--text-muted)]">
                {checkIns.length === 0
                  ? "Mark attendance manually or scan member/trainer QR pass to get started."
                  : "No records match your current filter."}
              </p>
            </div>
          ) : (
            filteredCheckIns.map((item) => {
              const isTrainer = item.personType === "trainer";
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-[var(--surface-hover)]/60 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-[var(--border)]">
                      <AvatarFallback className={`text-xs font-bold ${isTrainer ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}`}>
                        {getInitials(item.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[var(--text)]">{item.name}</p>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 font-semibold uppercase tracking-wider ${
                            isTrainer
                              ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30"
                              : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30"
                          }`}
                        >
                          {isTrainer ? "Trainer" : "Member"}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-[var(--text-muted)] border-[var(--border)]">
                          {item.method.toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        In at <span className="font-semibold text-[var(--text)]">{item.checkInTime}</span>
                        {item.checkOutTime ? (
                          <> · Out at <span className="font-semibold text-[var(--text)]">{item.checkOutTime}</span></>
                        ) : (
                          <> · <span className="text-emerald-600 font-medium">Currently on floor</span></>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {item.status === "in" ? (
                      <>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Inside
                        </span>

                        <button
                          onClick={() => handleCheckOut(item.id)}
                          type="button"
                          className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Check Out</span>
                        </button>
                      </>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--surface-hover)] text-[var(--text-muted)] border border-[var(--border)]">
                        Checked Out
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Gym Entrance QR Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-2xl text-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base text-[var(--text)]">
                <QrCode className="w-5 h-5 text-[var(--primary)]" />
                <span>Gym Entrance Turnstile QR</span>
              </div>
              <button
                onClick={() => setQrModalOpen(false)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[var(--background)] rounded-2xl border border-[var(--border)] flex flex-col items-center justify-center">
              <QrCodeView
                value={gymEntranceQrPayload}
                size={220}
                title={`${gymName} Entrance`}
                subtitle="Scan via Repsi App to check in or out"
                showDownload={true}
                showCopy={true}
              />
            </div>

            <div className="text-left bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl space-y-1">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Supports Both Members & Trainers
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed">
                Print and display this QR code at your gym entrance or turnstile. Members and trainers can scan it using their phone to log attendance in real-time.
              </p>
            </div>

            <Button onClick={() => setQrModalOpen(false)} variant="outline" className="w-full text-xs font-semibold">
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Turnstile / Scanner Simulator Modal */}
      {scannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base text-[var(--text)]">
                <Scan className="w-5 h-5 text-emerald-600" />
                <span>Scan Member or Trainer Pass</span>
              </div>
              <button
                onClick={() => setScannerModalOpen(false)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              Simulate turnstile scanner hardware. Enter QR payload, phone number, member ID, or pick a test subject below.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleScanSubmit();
              }}
              className="space-y-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. repsi://member/123 or phone number"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
                <Button
                  type="submit"
                  disabled={scanning || !scanInput.trim()}
                  className="bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold"
                >
                  {scanning ? "Scanning..." : "Verify"}
                </Button>
              </div>
            </form>

            {/* Scan Status Banner */}
            {scanStatus && (
              <div
                className={`p-3.5 rounded-xl border text-center space-y-1 ${
                  scanStatus.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
                }`}
              >
                {scanStatus.type === "success" ? (
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
                ) : (
                  <X className="w-6 h-6 mx-auto text-red-600" />
                )}
                <p className="text-xs font-bold">{scanStatus.message}</p>
                {scanStatus.details && <p className="text-[11px] opacity-80">{scanStatus.details}</p>}
              </div>
            )}

            {/* Quick Test Picker */}
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <p className="text-xs font-bold text-[var(--text)]">Or quick test with active gym members & trainers:</p>
              <div className="max-h-44 overflow-y-auto divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl">
                {members.slice(0, 3).map((m) => (
                  <div key={m.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-[var(--surface-hover)]">
                    <div>
                      <span className="font-bold text-[var(--text)]">{m.name}</span>
                      <span className="text-[var(--text-muted)] ml-2">(Member)</span>
                    </div>
                    <button
                      onClick={() => handleScanSubmit(`repsi://member/${m.id}`)}
                      disabled={scanning}
                      className="px-2.5 py-1 rounded bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 font-semibold text-[11px] cursor-pointer"
                    >
                      Scan Pass
                    </button>
                  </div>
                ))}
                {trainers.slice(0, 3).map((t) => (
                  <div key={t.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-[var(--surface-hover)]">
                    <div>
                      <span className="font-bold text-[var(--text)]">{t.name}</span>
                      <span className="text-indigo-600 dark:text-indigo-400 ml-2 font-medium">(Trainer)</span>
                    </div>
                    <button
                      onClick={() => handleScanSubmit(`repsi://trainer/${t.id}`)}
                      disabled={scanning}
                      className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 font-semibold text-[11px] cursor-pointer"
                    >
                      Scan Pass
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => setScannerModalOpen(false)} variant="outline" className="w-full text-xs font-semibold">
              Close Scanner
            </Button>
          </div>
        </div>
      )}

      {/* Comprehensive Manual Attendance Modal (Both Members & Trainers) */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-lg text-[var(--text)]">
                <UserCheck className="w-5 h-5 text-[var(--primary)]" />
                <span>Manual Attendance Entry</span>
              </div>
              <button
                onClick={() => setManualModalOpen(false)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Tabs: Members vs Trainers */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--background)] rounded-xl border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setManualTab("member")}
                className={`py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  manualTab === "member"
                    ? "bg-[var(--surface)] text-[var(--text)] shadow-sm border border-[var(--border)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>Members ({members.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setManualTab("trainer")}
                className={`py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  manualTab === "trainer"
                    ? "bg-[var(--surface)] text-[var(--text)] shadow-sm border border-[var(--border)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5 text-indigo-500" />
                <span>Trainers ({trainers.length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={manualTab === "member" ? "Search member by name, phone, or email..." : "Search trainer by name or specialization..."}
                value={manualSearch}
                onChange={(e) => setManualSearch(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl bg-[var(--surface)]">
              {manualTab === "member" ? (
                filteredMembers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--text-muted)]">No members found</div>
                ) : (
                  filteredMembers.map((m) => {
                    const activeSession = isMemberInside(m.id);
                    return (
                      <div key={m.id} className="p-3.5 flex items-center justify-between hover:bg-[var(--surface-hover)] transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[var(--text)]">{m.name}</span>
                            {activeSession ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                Inside since {activeSession.checkInTime}
                              </span>
                            ) : null}
                          </div>
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">
                            {m.phone} · <span className="text-[var(--primary)] font-semibold">{m.plan || "Member"}</span>
                          </div>
                        </div>

                        {activeSession ? (
                          <button
                            onClick={() => handleCheckOut(activeSession.id)}
                            type="button"
                            className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-600 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Check Out
                          </button>
                        ) : (
                          <button
                            onClick={() => handleManualCheckInMember(m)}
                            type="button"
                            className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] text-xs font-bold transition-colors cursor-pointer"
                          >
                            Check In
                          </button>
                        )}
                      </div>
                    );
                  })
                )
              ) : (
                filteredTrainers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--text-muted)]">No trainers found</div>
                ) : (
                  filteredTrainers.map((t) => {
                    const activeSession = isTrainerInside(t.id);
                    return (
                      <div key={t.id} className="p-3.5 flex items-center justify-between hover:bg-[var(--surface-hover)] transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[var(--text)]">{t.name}</span>
                            {activeSession ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                                On Duty since {activeSession.checkInTime}
                              </span>
                            ) : null}
                          </div>
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">
                            {t.phone} · <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{t.specialization || "Fitness Coach"}</span>
                          </div>
                        </div>

                        {activeSession ? (
                          <button
                            onClick={() => handleCheckOut(activeSession.id)}
                            type="button"
                            className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-600 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Check Out
                          </button>
                        ) : (
                          <button
                            onClick={() => handleManualCheckInTrainer(t)}
                            type="button"
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Clock In
                          </button>
                        )}
                      </div>
                    );
                  })
                )
              )}
            </div>

            <Button onClick={() => setManualModalOpen(false)} variant="outline" className="w-full text-xs font-semibold">
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
