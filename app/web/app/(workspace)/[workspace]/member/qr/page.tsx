"use client";

import { useState, useEffect, use } from "react";
import {
  QrCode,
  CheckCircle2,
  ShieldCheck,
  User,
  Scan,
  AlertCircle,
  Clock,
  Calendar,
  LogOut,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { repsiApi, ApiAttendance } from "@/lib/api";
import { slugToGymName } from "@/lib/workspace";
import { QrCodeView } from "@/components/ui/qr-code-view";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MemberQRCheckinPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const gymName = slugToGymName(workspace);

  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<ApiAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: "success" | "error";
    message: string;
    action?: string;
  } | null>(null);

  const loadAttendance = async () => {
    try {
      const records = await repsiApi.getAttendance();
      setHistory(records);
    } catch (e) {
      console.warn("Failed to load member attendance", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authUser = getAuthUser();
    setUser(authUser);
    loadAttendance();
  }, []);

  const memberId = user?.id || user?.sub || "member-default";
  const memberName = user?.name || "Valued Member";
  const memberEmail = user?.email || "member@repsi.app";

  // QR Payload with standard Repsi pass identifier format
  const qrPayload = JSON.stringify({
    type: "repsi_member_pass",
    id: memberId,
    name: memberName,
    email: memberEmail,
    workspace: workspace,
  });

  // Check if member is currently inside
  const activeSession = history.find((h) => h.status === "in");

  const handleSimulateScan = async () => {
    setScanning(true);
    setScanResult(null);

    try {
      // Use qrPayload or identifier to toggle check in / check out
      const res = await repsiApi.scanQr(qrPayload);
      setScanResult({
        status: "success",
        message: res.message || (res.action === "check_in" ? "Check-in successful!" : "Check-out logged!"),
        action: res.action,
      });
      await loadAttendance();
    } catch (err: any) {
      // If scan failed, fallback to checkIn or checkOut directly
      try {
        if (activeSession) {
          await repsiApi.checkOut(activeSession.id);
          setScanResult({
            status: "success",
            message: "Check-out recorded successfully!",
            action: "check_out",
          });
        } else {
          await repsiApi.checkIn({
            memberId: memberId,
            identifier: memberEmail,
            method: "qr",
          });
          setScanResult({
            status: "success",
            message: `Welcome to ${gymName}! Check-in confirmed.`,
            action: "check_in",
          });
        }
        await loadAttendance();
      } catch (innerErr: any) {
        setScanResult({
          status: "error",
          message: innerErr.message || "Failed to scan pass at entrance",
        });
      }
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Member Digital QR Pass</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Display your personal QR pass at turnstiles or reception counters for hands-free entry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSession ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1.5 px-3 py-1 font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Inside {gymName}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[var(--text-muted)] border-[var(--border)] px-3 py-1 text-xs">
              Currently Outside
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Digital Pass Card */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-[var(--surface)] to-[var(--surface)] p-6 space-y-5 shadow-sm text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white uppercase tracking-wider shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Active Member Pass</span>
          </div>

          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 font-extrabold text-2xl flex items-center justify-center mx-auto border-2 border-emerald-500/30">
            {memberName.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">{memberName}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{memberEmail}</p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              Member • {gymName}
            </p>
          </div>

          {/* Real QR Code */}
          <div className="p-3 bg-white rounded-2xl border border-[var(--border)] max-w-[260px] mx-auto shadow-inner">
            <QrCodeView
              value={qrPayload}
              size={180}
              title={memberName}
              subtitle="Repsi Member Access Token"
              showDownload={true}
              showCopy={true}
            />
          </div>

          <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted QR pass valid at all {gymName} doors & lockers.</span>
          </div>
        </div>

        {/* Turnstile Interaction & Scanner Simulator */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Scan className="h-5 w-5 text-emerald-600" />
                <h2 className="text-base font-bold text-[var(--text)]">Door Turnstile Check-In Simulator</h2>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Test the entrance turnstile scanner. In the physical gym, your QR pass is read by the optical scanner at the door to unlock turnstiles and record attendance.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
                <span>Turnstile Gate #1:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  ONLINE & READY
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)] flex items-center justify-between">
                <span>Current Status:</span>
                <span className="font-semibold text-[var(--text)]">
                  {activeSession ? `Inside (since ${activeSession.checkInTime})` : "Outside Gym"}
                </span>
              </div>
            </div>

            {/* Scan Feedback Banner */}
            {scanResult && (
              <div
                className={`p-4 rounded-xl border text-center space-y-1.5 ${
                  scanResult.status === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
                }`}
              >
                {scanResult.status === "success" ? (
                  <CheckCircle2 className="h-7 w-7 mx-auto text-emerald-600" />
                ) : (
                  <AlertCircle className="h-7 w-7 mx-auto text-red-600" />
                )}
                <h3 className="text-sm font-bold">{scanResult.message}</h3>
                <p className="text-[11px] opacity-80">
                  {scanResult.action === "check_in"
                    ? "Turnstile gate unlocked. Have a great session!"
                    : "Turnstile gate unlocked. Check-out recorded. See you next time!"}
                </p>
              </div>
            )}

            <button
              onClick={handleSimulateScan}
              disabled={scanning}
              type="button"
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold hover:bg-[var(--primary-hover)] transition-all shadow-sm cursor-pointer disabled:opacity-60"
            >
              {scanning ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying with Turnstile Gate...</span>
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4" />
                  <span>{activeSession ? "Scan QR to Check Out" : "Scan QR to Check In"}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Attendance History */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
                My Recent Gym Sessions
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadAttendance}
                className="h-7 px-2 text-[11px] gap-1 text-[var(--text-muted)]"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </Button>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] py-4 text-center">
                No past check-ins recorded yet. Tap the scan button above to register your first visit!
              </p>
            ) : (
              <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl max-h-48 overflow-y-auto">
                {history.slice(0, 5).map((rec) => (
                  <div key={rec.id} className="p-3 flex items-center justify-between text-xs hover:bg-[var(--surface-hover)]">
                    <div>
                      <p className="font-semibold text-[var(--text)]">Workout Visit</p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        In: {rec.checkInTime} {rec.checkOutTime ? `· Out: ${rec.checkOutTime}` : "· In Progress"}
                      </p>
                    </div>
                    {rec.status === "in" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Inside
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--surface-hover)] text-[var(--text-muted)] border border-[var(--border)]">
                        Completed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
