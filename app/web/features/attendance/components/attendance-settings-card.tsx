"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Clock,
  ShieldCheck,
  Zap,
  Save,
  CheckCircle2,
  AlertCircle,
  Moon,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApiAttendanceSettings, repsiApi } from "@/lib/api";

interface AttendanceSettingsCardProps {
  settings: ApiAttendanceSettings | null;
  onRefresh: () => Promise<void>;
}

export function AttendanceSettingsCard({ settings, onRefresh }: AttendanceSettingsCardProps) {
  const [maxMinutes, setMaxMinutes] = useState<number>(settings?.max_session_duration_minutes ?? 240);
  const [closingTime, setClosingTime] = useState<string>(settings?.gym_closing_time ?? "22:00");
  const [autoCheckout, setAutoCheckout] = useState<boolean>(settings?.auto_checkout_enabled ?? true);
  const [memberCheckout, setMemberCheckout] = useState<boolean>(settings?.allow_member_manual_checkout ?? true);
  const [staffCheckout, setStaffCheckout] = useState<boolean>(settings?.allow_staff_manual_checkout ?? true);
  const [qrRotation, setQrRotation] = useState<number>(settings?.qr_rotation_interval_minutes ?? 0);

  const [saving, setSaving] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setMaxMinutes(settings.max_session_duration_minutes ?? 240);
      setClosingTime(settings.gym_closing_time ?? "22:00");
      setAutoCheckout(settings.auto_checkout_enabled ?? true);
      setMemberCheckout(settings.allow_member_manual_checkout ?? true);
      setStaffCheckout(settings.allow_staff_manual_checkout ?? true);
      setQrRotation(settings.qr_rotation_interval_minutes ?? 0);
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await repsiApi.updateAttendanceSettings({
        max_session_duration_minutes: Number(maxMinutes),
        gym_closing_time: closingTime,
        auto_checkout_enabled: autoCheckout,
        allow_member_manual_checkout: memberCheckout,
        allow_staff_manual_checkout: staffCheckout,
        qr_rotation_interval_minutes: Number(qrRotation),
      });
      await onRefresh();
      setFeedback("Attendance policies updated successfully.");
      setTimeout(() => setFeedback(null), 3000);
    } catch (e: any) {
      alert(e.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerAutoCheckout = async () => {
    setTriggering(true);
    try {
      const res = await repsiApi.triggerAutoCheckout();
      alert(res.message);
      await onRefresh();
    } catch (e: any) {
      alert(e.message || "Failed to execute auto checkout");
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[var(--text)] tracking-tight">
            Attendance Policy & Auto-Checkout Configuration
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Configure automated checkout windows, gym closing rules, and access control permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleTriggerAutoCheckout}
            disabled={triggering}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 h-9 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
          >
            <Zap className={`w-3.5 h-3.5 ${triggering ? "animate-spin" : ""}`} />
            <span>Run Auto-Checkout Now</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="text-xs gap-1.5 h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Settings"}</span>
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maximum Session Duration Card */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
                Maximum Workout Session Duration
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Members exceeding this duration are automatically checked out.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: "2 Hours", val: 120 },
                { label: "3 Hours", val: 180 },
                { label: "4 Hours", val: 240 },
                { label: "5 Hours", val: 300 },
                { label: "6 Hours", val: 360 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setMaxMinutes(preset.val)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    maxMinutes === preset.val
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:border-emerald-500/40"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">Custom Duration:</span>
              <input
                type="number"
                min={30}
                max={720}
                value={maxMinutes}
                onChange={(e) => setMaxMinutes(Number(e.target.value))}
                className="w-24 h-8 px-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] font-mono font-semibold"
              />
              <span className="text-xs text-[var(--text-muted)]">minutes ({Math.floor(maxMinutes / 60)}h {maxMinutes % 60}m)</span>
            </div>
          </div>
        </div>

        {/* Smart Gym Closing Time Rule */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
                Gym Closing Time (Smart Rule)
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Auto-checkout sessions at closing time instead of leaving overnight sessions open.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-mono font-bold text-[var(--text)]"
              />
              <span className="text-xs text-[var(--text-muted)]">
                Default: 10:00 PM (22:00)
              </span>
            </div>

            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              <strong>Smart Auto Checkout Rule:</strong> Uses whichever limit comes earlier:
              gym closing time OR maximum session duration.
            </p>
          </div>
        </div>

        {/* Toggles: Auto Checkout & Permissions */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] space-y-4">
          <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
            Automated Checkout Engine
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[var(--text)]">Enable Smart Auto-Checkout</span>
                <p className="text-[11px] text-[var(--text-muted)]">Automatically closes sessions exceeding limits.</p>
              </div>
              <input
                type="checkbox"
                checked={autoCheckout}
                onChange={(e) => setAutoCheckout(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[var(--text)]">Allow Member Manual Check-Out</span>
                <p className="text-[11px] text-[var(--text-muted)]">Members can tap "Check Out" in the Repsi app.</p>
              </div>
              <input
                type="checkbox"
                checked={memberCheckout}
                onChange={(e) => setMemberCheckout(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* QR Security & Rotation Policy */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] space-y-4">
          <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
            QR Security Settings
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[var(--text)]">Staff Manual Check-Out</span>
                <p className="text-[11px] text-[var(--text-muted)]">Reception staff can manually check out members from dashboard.</p>
              </div>
              <input
                type="checkbox"
                checked={staffCheckout}
                onChange={(e) => setStaffCheckout(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text)]">Automatic QR Token Rotation</span>
                <select
                  value={qrRotation}
                  onChange={(e) => setQrRotation(Number(e.target.value))}
                  className="h-7 px-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] font-semibold"
                >
                  <option value={0}>Manual Only (Standard)</option>
                  <option value={15}>Every 15 Minutes</option>
                  <option value={30}>Every 30 Minutes</option>
                  <option value={60}>Every 1 Hour</option>
                </select>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Recommended: Manual rotation for printed posters, or 15m for dedicated TV kiosk screens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
