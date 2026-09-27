"use client";

import { useState, useEffect, use } from "react";
import {
  QrCode,
  CheckCircle2,
  ShieldCheck,
  Scan,
  Clock,
  LogOut,
  LogIn,
  RefreshCw,
  Dumbbell,
  AlertCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { repsiApi, ApiAttendance } from "@/lib/api";
import { slugToGymName } from "@/lib/workspace";
import { QrCodeView } from "@/components/ui/qr-code-view";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TrainerAttendancePage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const gymName = slugToGymName(workspace);

  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<ApiAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadAttendance = async () => {
    try {
      const records = await repsiApi.getAttendance();
      setHistory(records);
    } catch (e) {
      console.warn("Failed to load trainer attendance", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getAuthUser());
    loadAttendance();
  }, []);

  const trainerId = user?.id || user?.sub || "trainer-default";
  const trainerName = user?.name || "Head Coach";
  const trainerEmail = user?.email || "trainer@repsi.app";

  // Trainer QR Payload
  const qrPayload = JSON.stringify({
    type: "repsi_trainer_pass",
    id: trainerId,
    name: trainerName,
    email: trainerEmail,
    workspace: workspace,
  });

  // Check if currently on duty
  const activeSession = history.find((h) => h.status === "in");

  const handleToggleAttendance = async () => {
    setActionLoading(true);
    setFeedback(null);

    try {
      if (activeSession) {
        // Clock Out
        await repsiApi.checkOut(activeSession.id);
        setFeedback({
          type: "success",
          message: "Clock-out logged successfully. Shift completed!",
        });
      } else {
        // Clock In
        await repsiApi.checkIn({
          trainerId: trainerId,
          identifier: trainerEmail,
          method: "qr",
        });
        setFeedback({
          type: "success",
          message: `Clocked in successfully at ${gymName}! Have a great coaching shift.`,
        });
      }
      await loadAttendance();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to update attendance status.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Trainer Attendance & Shift Pass</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Display your trainer access QR pass at staff turnstiles or clock in/out for duty hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSession ? (
            <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 gap-1.5 px-3 py-1 font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              On Floor Duty
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[var(--text-muted)] border-[var(--border)] px-3 py-1 text-xs">
              Off Duty
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trainer Digital Pass Card */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 via-[var(--surface)] to-[var(--surface)] p-6 space-y-5 shadow-sm text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white uppercase tracking-wider shadow-sm">
            <Dumbbell className="h-3.5 w-3.5" />
            <span>Staff Coach Pass</span>
          </div>

          <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-600 font-extrabold text-2xl flex items-center justify-center mx-auto border-2 border-indigo-500/30">
            {trainerName.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">{trainerName}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{trainerEmail}</p>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
              Personal Trainer & Coach • {gymName}
            </p>
          </div>

          {/* Real QR Code */}
          <div className="p-3 bg-white rounded-2xl border border-[var(--border)] max-w-[260px] mx-auto shadow-inner">
            <QrCodeView
              value={qrPayload}
              size={180}
              title={trainerName}
              subtitle="Trainer Staff Access Key"
              showDownload={true}
              showCopy={true}
              darkColor="#312e81"
            />
          </div>

          <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Turnstile & Staff Room Access Token</span>
          </div>
        </div>

        {/* Shift Clock In / Out & Turnstile Integration */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                <h2 className="text-base font-bold text-[var(--text)]">Duty Shift Controls</h2>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Log your gym presence for payroll, client session availability, and turnstile door records.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
                <span>Duty Status:</span>
                <span className={activeSession ? "text-indigo-600 font-bold" : "text-[var(--text-muted)]"}>
                  {activeSession ? `Active Shift (Since ${activeSession.checkInTime})` : "Not Clocked In"}
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)] flex items-center justify-between">
                <span>Facility Gate:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Synced with Gym Turnstiles
                </span>
              </div>
            </div>

            {/* Status Feedback */}
            {feedback && (
              <div
                className={`p-3.5 rounded-xl border text-center space-y-1 ${
                  feedback.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 mx-auto text-red-600" />
                )}
                <p className="text-xs font-bold">{feedback.message}</p>
              </div>
            )}

            <button
              onClick={handleToggleAttendance}
              disabled={actionLoading}
              type="button"
              className={`w-full flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-60 ${
                activeSession
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {actionLoading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : activeSession ? (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>Clock Out of Shift</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Clock In for Coaching Shift</span>
                </>
              )}
            </button>
          </div>

          {/* Shift Records */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
                My Shift History
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
                No past trainer shifts found for today. Clock in above to start your coaching hours!
              </p>
            ) : (
              <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl max-h-48 overflow-y-auto">
                {history.slice(0, 5).map((rec) => (
                  <div key={rec.id} className="p-3 flex items-center justify-between text-xs hover:bg-[var(--surface-hover)]">
                    <div>
                      <p className="font-semibold text-[var(--text)]">Coaching Floor Shift</p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        In: {rec.checkInTime} {rec.checkOutTime ? `· Out: ${rec.checkOutTime}` : "· Active Now"}
                      </p>
                    </div>
                    {rec.status === "in" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                        On Duty
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--surface-hover)] text-[var(--text-muted)] border border-[var(--border)]">
                        Shift Ended
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
