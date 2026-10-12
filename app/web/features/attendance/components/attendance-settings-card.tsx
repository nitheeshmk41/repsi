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
  Fingerprint,
  Radio,
  Trash2,
  Plus,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Server,
  X,
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

  // Biometric Devices state
  const [biometricDevices, setBiometricDevices] = useState<any[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [testingDeviceId, setTestingDeviceId] = useState<string | null>(null);
  const [deviceTestResult, setDeviceTestResult] = useState<Record<string, any>>({});
  const [showRegisterDeviceModal, setShowRegisterDeviceModal] = useState(false);
  const [newDevice, setNewDevice] = useState({
    device_name: "Front Reception Turnstile",
    device_model: "ZKTeco K40 Fingerprint Terminal",
    device_serial: "",
    ip_address: "192.168.1.201",
    port: 4370,
    location_name: "Main Reception",
  });
  const [registeringDevice, setRegisteringDevice] = useState(false);
  const [deviceError, setDeviceError] = useState("");

  const loadBiometricDevices = async () => {
    setLoadingDevices(true);
    try {
      const devs = await repsiApi.getBiometricDevices();
      setBiometricDevices(devs);
    } catch (e) {
      console.warn("Could not load biometric devices", e);
    } finally {
      setLoadingDevices(false);
    }
  };

  useEffect(() => {
    loadBiometricDevices();
  }, []);

  const handleTestDevice = async (deviceId: string) => {
    setTestingDeviceId(deviceId);
    try {
      const res = await repsiApi.testBiometricDevice(deviceId);
      setDeviceTestResult((prev) => ({ ...prev, [deviceId]: res }));
      await loadBiometricDevices();
    } catch (err: any) {
      setDeviceTestResult((prev) => ({
        ...prev,
        [deviceId]: {
          success: false,
          status: "DISCONNECTED",
          message: err.message || "Device could not be reached on local network.",
        },
      }));
    } finally {
      setTestingDeviceId(null);
    }
  };

  const handleRegisterDeviceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.device_serial.trim()) {
      setDeviceError("Device Serial Number is required.");
      return;
    }
    setRegisteringDevice(true);
    setDeviceError("");
    try {
      await repsiApi.registerBiometricDevice({
        ...newDevice,
        port: Number(newDevice.port),
      });
      setShowRegisterDeviceModal(false);
      setNewDevice({
        device_name: "Front Reception Turnstile",
        device_model: "ZKTeco K40 Fingerprint Terminal",
        device_serial: "",
        ip_address: "192.168.1.201",
        port: 4370,
        location_name: "Main Reception",
      });
      await loadBiometricDevices();
    } catch (err: any) {
      setDeviceError(err.message || "Failed to register biometric device.");
    } finally {
      setRegisteringDevice(false);
    }
  };

  const handleDeleteDevice = async (deviceId: string, deviceName: string) => {
    if (!confirm(`Are you sure you want to remove biometric terminal '${deviceName}'?`)) return;
    try {
      await repsiApi.deleteBiometricDevice(deviceId);
      await loadBiometricDevices();
    } catch (err: any) {
      alert(err.message || "Failed to delete device.");
    }
  };

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
                <span className="text-xs font-semibold text-[var(--text)]">Staff Assisted Checkout</span>
                <p className="text-[11px] text-[var(--text-muted)]">Allow front desk staff to manually check members out.</p>
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

      {/* Biometric & Fingerprint Terminals */}
      <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
                  Biometric & Fingerprint Terminals
                </h3>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Manage hardware fingerprint terminals (ZKTeco, Mantra, IoT gates). Real hardware connectivity is strictly verified before marking online.
              </p>
            </div>
            <Button
              onClick={() => setShowRegisterDeviceModal(true)}
              size="sm"
              className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Biometric Device</span>
            </Button>
          </div>

          {loadingDevices ? (
            <div className="p-6 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Loading registered biometric terminals...</span>
            </div>
          ) : biometricDevices.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] text-center space-y-2">
              <Radio className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
              <p className="text-xs font-bold text-[var(--text)]">No physical biometric devices registered yet</p>
              <p className="text-[11px] text-[var(--text-muted)] max-w-md mx-auto">
                Connect your gym entrance turnstiles or ZKTeco / Mantra fingerprint terminals to sync attendance directly into REPSI.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {biometricDevices.map((dev) => {
                const isOnline = dev.status === "ONLINE";
                const isTesting = testingDeviceId === dev.id;
                const testRes = deviceTestResult[dev.id];

                return (
                  <div
                    key={dev.id}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[var(--text)]">{dev.device_name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)]">
                            {dev.device_model}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Location: <strong className="text-[var(--text)]">{dev.location_name}</strong> • S/N:{" "}
                          <span className="font-mono">{dev.device_serial}</span>
                          {dev.ip_address && ` • LAN: ${dev.ip_address}:${dev.port}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isOnline ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/25 text-[10px] gap-1 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Connected & Online
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/25 text-[10px] gap-1 font-bold">
                            <AlertTriangle className="w-3 h-3" />
                            Hardware Disconnected
                          </Badge>
                        )}

                        <Button
                          onClick={() => handleTestDevice(dev.id)}
                          disabled={isTesting}
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] gap-1 px-2.5"
                        >
                          {isTesting ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3 h-3" />
                              Test Connectivity
                            </>
                          )}
                        </Button>

                        <button
                          onClick={() => handleDeleteDevice(dev.id, dev.device_name)}
                          className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Revoke device"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Test result message if available */}
                    {testRes && (
                      <div
                        className={`p-2.5 rounded-lg text-[11px] flex items-start gap-2 ${
                          testRes.success
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="font-semibold">{testRes.message}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">
                            Status verified at {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[11px] text-[var(--text-muted)] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Biometric Privacy & Zero-Knowledge Architecture:</strong> REPSI does not store raw fingerprint templates or biometric images in cloud databases. Connected terminals perform biometric matching locally on-premises and transmit only authorized user IDs over TLS.
            </p>
          </div>
        </div>

      {/* Register Biometric Device Modal */}
      {showRegisterDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-[var(--text)]">Register Biometric Terminal</h3>
              </div>
              <button
                onClick={() => setShowRegisterDeviceModal(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg hover:bg-[var(--surface-hover)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterDeviceSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Device Friendly Name</label>
                <input
                  type="text"
                  required
                  value={newDevice.device_name}
                  onChange={(e) => setNewDevice({ ...newDevice, device_name: e.target.value })}
                  placeholder="e.g. Front Turnstile Scanner"
                  className="w-full h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs text-[var(--text)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Device Model / Manufacturer</label>
                <select
                  value={newDevice.device_model}
                  onChange={(e) => setNewDevice({ ...newDevice, device_model: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs text-[var(--text)] font-medium"
                >
                  <option value="ZKTeco K40 Fingerprint Terminal">ZKTeco K40 / MB20 Standalone Terminal</option>
                  <option value="ZKTeco IN01 / UFace Network Device">ZKTeco IN01 / UFace Network Device</option>
                  <option value="Mantra MBF30 Biometric Terminal">Mantra MBF30 Biometric Terminal</option>
                  <option value="Mantra MFS100 Optical Scanner">Mantra MFS100 Optical Scanner</option>
                  <option value="Generic Network Biometric Terminal">Generic Network Biometric Gateway</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Device Serial Number (S/N)</label>
                <input
                  type="text"
                  required
                  value={newDevice.device_serial}
                  onChange={(e) => setNewDevice({ ...newDevice, device_serial: e.target.value })}
                  placeholder="e.g. ZK9812498124"
                  className="w-full h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-mono text-[var(--text)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text)]">Local IP Address</label>
                  <input
                    type="text"
                    value={newDevice.ip_address}
                    onChange={(e) => setNewDevice({ ...newDevice, ip_address: e.target.value })}
                    placeholder="192.168.1.201"
                    className="w-full h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-mono text-[var(--text)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text)]">Port</label>
                  <input
                    type="number"
                    value={newDevice.port}
                    onChange={(e) => setNewDevice({ ...newDevice, port: Number(e.target.value) })}
                    placeholder="4370"
                    className="w-full h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-mono text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text)]">Installation Location</label>
                <input
                  type="text"
                  value={newDevice.location_name}
                  onChange={(e) => setNewDevice({ ...newDevice, location_name: e.target.value })}
                  placeholder="Main Entrance / Turnstile 1"
                  className="w-full h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs text-[var(--text)]"
                />
              </div>

              {deviceError && (
                <p className="text-xs text-rose-500 font-medium">{deviceError}</p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRegisterDeviceModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={registeringDevice}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {registeringDevice ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Registering...
                    </>
                  ) : (
                    "Register Device"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
