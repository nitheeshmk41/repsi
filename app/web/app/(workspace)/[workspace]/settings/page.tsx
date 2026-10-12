"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Building2, 
  Users, 
  Shield, 
  CreditCard, 
  Bell, 
  Lock, 
  Sliders, 
  CheckCircle2, 
  Save,
  AlertTriangle,
  AlertCircle,
  Trash2,
  X,
  Loader2,
  Calendar,
  Clock,
  Info,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { slugToGymName } from "@/lib/workspace";
import { repsiApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export default function WorkspaceSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const workspace = (params.workspace as string) || "apex-fitness";
  const defaultName = slugToGymName(workspace);

  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Deregistration states
  const [showDeregisterModal, setShowDeregisterModal] = useState(false);
  const [confirmGymName, setConfirmGymName] = useState("");
  const [deregisterReason, setDeregisterReason] = useState("");
  const [deregisterLoading, setDeregisterLoading] = useState(false);
  const [deregisterError, setDeregisterError] = useState("");

  // Gym profile & rename states
  const [initialName, setInitialName] = useState(defaultName);
  const [gymProfile, setGymProfile] = useState({
    name: defaultName,
    phone: "+91 98450 11223",
    email: `contact@${workspace}.in`,
    address: "100 Feet Road, Indiranagar",
    city: "Bangalore",
    currency: "INR (₹)",
    timezone: "Asia/Kolkata (IST)",
  });

  const [renameEligibility, setRenameEligibility] = useState<{
    can_rename: boolean;
    cooldown_days: number;
    last_name_changed_at: string | null;
    next_available_change_at: string | null;
    days_remaining: number;
    hours_remaining: number;
    message: string;
  }>({
    can_rename: true,
    cooldown_days: 30,
    last_name_changed_at: null,
    next_available_change_at: null,
    days_remaining: 0,
    hours_remaining: 0,
    message: "You can change your gym name once every 30 days.",
  });

  const [nameCheck, setNameCheck] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string | null;
    status: string | null;
  }>({
    checking: false,
    available: null,
    message: null,
    status: null,
  });

  const checkDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load real workspace and rename eligibility
  useEffect(() => {
    async function loadWorkspaceSettings() {
      try {
        const [wsData, elig] = await Promise.all([
          repsiApi.getWorkspace(workspace).catch(() => null),
          repsiApi.getRenameEligibility(workspace).catch(() => null),
        ]);

        if (wsData) {
          const wsName = wsData.name || defaultName;
          setInitialName(wsName);
          setGymProfile((prev) => ({
            ...prev,
            name: wsName,
            phone: wsData.phone || prev.phone,
            email: wsData.email || prev.email,
            address: wsData.address || prev.address,
            city: wsData.city || prev.city,
          }));
        }

        if (elig) {
          setRenameEligibility(elig);
        }
      } catch (err) {
        console.warn("Using default workspace settings", err);
      }
    }
    loadWorkspaceSettings();
  }, [workspace]);

  // Handle typing with debounced name check
  const handleNameChange = (val: string) => {
    setGymProfile((prev) => ({ ...prev, name: val }));
    setSaveError("");

    if (checkDebounceRef.current) {
      clearTimeout(checkDebounceRef.current);
    }

    const trimmed = val.trim();
    if (!trimmed || trimmed.toLowerCase() === initialName.trim().toLowerCase()) {
      setNameCheck({
        checking: false,
        available: true,
        message: trimmed ? "This is your current gym name." : null,
        status: "CURRENT",
      });
      return;
    }

    setNameCheck({ checking: true, available: null, message: "Checking availability...", status: "CHECKING" });

    checkDebounceRef.current = setTimeout(async () => {
      try {
        const res = await repsiApi.checkWorkspaceName(trimmed, workspace);
        setNameCheck({
          checking: false,
          available: res.available,
          message: res.message,
          status: res.status,
        });
      } catch (err: any) {
        setNameCheck({
          checking: false,
          available: false,
          message: err.message || "Failed to check name",
          status: "ERROR",
        });
      }
    }, 450);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    try {
      const nameChanged = gymProfile.name.trim().toLowerCase() !== initialName.trim().toLowerCase();

      // If name changed, rename workspace with 30-day cooldown & moderation
      if (nameChanged) {
        if (!renameEligibility.can_rename) {
          throw new Error(renameEligibility.message || "Gym name changes are on a 30-day cooldown.");
        }
        if (nameCheck.available === false) {
          throw new Error(nameCheck.message || "Gym name is not available or violates moderation policy.");
        }
        const renameRes = await repsiApi.renameWorkspace(gymProfile.name.trim(), workspace);
        setInitialName(renameRes.name);
        if (renameRes.eligibility) {
          setRenameEligibility(renameRes.eligibility);
        }
      }

      // Update remaining general fields (phone, email, address, city)
      await repsiApi.updateWorkspace(workspace, {
        phone: gymProfile.phone,
        email: gymProfile.email,
        address: gymProfile.address,
        city: gymProfile.city,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save settings. Please verify inputs.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeregisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeregisterError("");

    if (confirmGymName.trim().toLowerCase() !== gymProfile.name.trim().toLowerCase()) {
      setDeregisterError(`Please type "${gymProfile.name}" exactly to confirm deregistration.`);
      return;
    }

    setDeregisterLoading(true);
    try {
      await repsiApi.deregisterWorkspace(confirmGymName.trim(), deregisterReason.trim());
      // Clear auth tokens
      if (typeof window !== "undefined") {
        localStorage.removeItem("repsi_auth_token");
        localStorage.removeItem("repsi_user_role");
        localStorage.removeItem("repsi_workspace_slug");
        document.cookie = "repsi_session=; path=/; max-age=0;";
      }
      alert(`Gym workspace "${gymProfile.name}" has been successfully deregistered. All active access has been closed.`);
      window.location.href = "/";
    } catch (err: any) {
      setDeregisterError(err.message || "Failed to deregister workspace. Verify you are the owner.");
      setDeregisterLoading(false);
    }
  };

  const navItems = [
    { id: "general", label: "General & Branding", icon: Building2 },
    { id: "team", label: "Staff & Coaches", icon: Users },
    { id: "roles", label: "Role Permissions", icon: Shield },
    { id: "membership", label: "Plan Rules", icon: Sliders },
    { id: "billing", label: "Tax & Invoicing", icon: CreditCard },
    { id: "notifications", label: "SMS & WhatsApp", icon: Bell },
    { id: "security", label: "Security & 2FA", icon: Lock },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Gym Workspace Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Configure operations, staff access, automated reminders, and tax parameters for /{workspace}.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-60 flex-shrink-0 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            const isDanger = item.id === "danger";
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  active
                    ? isDanger
                      ? "text-rose-500 font-semibold"
                      : "text-[var(--primary-dark)] dark:text-[var(--primary-hover)] font-semibold"
                    : isDanger
                    ? "text-rose-400 hover:bg-rose-500/10"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="settingsNavActiveIndicator"
                    className={`absolute inset-0 rounded-lg ${
                      isDanger ? "bg-rose-500/15" : "bg-[var(--primary-soft)]"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4 flex-shrink-0" />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Panel */}
        <div className="flex-1 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              {activeTab === "general" && (
                <>
                  <Card className="border-[var(--border)] bg-[var(--surface)]">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">General Information</CardTitle>
                      <CardDescription>
                        Your gym's public name, workspace slug, and registered physical address.
                      </CardDescription>
                    </CardHeader>
                <CardContent>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Gym Brand Name with 30-Day Cooldown & Availability */}
                      <div className="space-y-2 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="gymName" className="font-semibold text-sm flex items-center gap-1.5">
                            Gym Brand Name
                            {!renameEligibility.can_rename && (
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                30-Day Cooldown Active
                              </span>
                            )}
                          </Label>
                          {renameEligibility.can_rename && (
                            <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-primary" />
                              Editable (Once every 30 days)
                            </span>
                          )}
                        </div>

                        <div className="relative">
                          <Input
                            id="gymName"
                            value={gymProfile.name}
                            disabled={!renameEligibility.can_rename || saving}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className={`pr-10 ${
                              !renameEligibility.can_rename
                                ? "opacity-75 bg-[var(--surface-elevated)] cursor-not-allowed"
                                : nameCheck.available === false
                                ? "border-rose-500/80 focus-visible:ring-rose-500"
                                : nameCheck.available === true && nameCheck.status !== "CURRENT"
                                ? "border-emerald-500/80 focus-visible:ring-emerald-500"
                                : ""
                            }`}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {nameCheck.checking && (
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            )}
                            {!nameCheck.checking && nameCheck.available === true && nameCheck.status !== "CURRENT" && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            )}
                            {!nameCheck.checking && nameCheck.available === false && (
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                            )}
                          </div>
                        </div>

                        {/* Cooldown Active Callout */}
                        {!renameEligibility.can_rename && (
                          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs space-y-2">
                            <div className="flex items-start gap-2.5 text-amber-600 dark:text-amber-400 font-medium">
                              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold">{renameEligibility.message}</p>
                                <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[var(--text-secondary)]">
                                  {renameEligibility.last_name_changed_at && (
                                    <div>
                                      Last changed:{" "}
                                      <strong className="text-[var(--text)]">
                                        {new Date(renameEligibility.last_name_changed_at).toLocaleDateString(undefined, {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </strong>
                                    </div>
                                  )}
                                  {renameEligibility.next_available_change_at && (
                                    <div>
                                      Next available change:{" "}
                                      <strong className="text-[var(--text)]">
                                        {new Date(renameEligibility.next_available_change_at).toLocaleDateString(undefined, {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </strong>{" "}
                                      ({renameEligibility.days_remaining}d remaining)
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-[11px] text-[var(--text-muted)] border-t border-amber-500/20 pt-1.5">
                              Phone number, email, and facility address below can still be modified at any time.
                            </p>
                          </div>
                        )}

                        {/* Availability and validation messages */}
                        {renameEligibility.can_rename && (
                          <div className="space-y-1">
                            {nameCheck.checking && (
                              <p className="text-xs text-primary flex items-center gap-1.5">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Checking brand name availability...
                              </p>
                            )}
                            {!nameCheck.checking && nameCheck.available === true && nameCheck.status !== "CURRENT" && (
                              <p className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {nameCheck.message || "Name available for your gym"}
                              </p>
                            )}
                            {!nameCheck.checking && nameCheck.available === false && (
                              <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1.5 font-medium">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {nameCheck.message || "This name is already taken or unavailable"}
                              </p>
                            )}
                            <p className="text-[11px] text-[var(--text-muted)]">
                              Business names can be updated once every 30 days. Changing the name preserves all membership and payment records.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="slug">Workspace URL Slug</Label>
                        <Input id="slug" value={workspace} disabled className="opacity-75 font-mono text-xs bg-[var(--surface-elevated)]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Official Phone</Label>
                        <Input
                          id="phone"
                          value={gymProfile.phone}
                          onChange={(e) => setGymProfile({ ...gymProfile, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="email">Official Email</Label>
                        <Input
                          id="email"
                          value={gymProfile.email}
                          onChange={(e) => setGymProfile({ ...gymProfile, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={gymProfile.address}
                          onChange={(e) => setGymProfile({ ...gymProfile, address: e.target.value })}
                        />
                      </div>
                    </div>

                    {saveError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>{saveError}</span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                      {saved ? (
                        <span className="text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                          <CheckCircle2 className="h-4 w-4" />
                          Settings saved successfully!
                        </span>
                      ) : <span />}
                      <Button
                        type="submit"
                        size="sm"
                        disabled={saving || (gymProfile.name.trim().toLowerCase() !== initialName.trim().toLowerCase() && nameCheck.available === false)}
                        className="gap-2"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <Save className="h-3.5 w-3.5" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Quick Danger Zone link under General */}
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-rose-500">Need to close or deregister this gym?</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Gym owners can safely close operations and cancel subscriptions at any time.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-rose-500/40 text-rose-500 hover:bg-rose-500/10 text-xs"
                  onClick={() => setActiveTab("danger")}
                >
                  Manage Deregistration
                </Button>
              </div>
            </>
          )}

          {activeTab === "team" && (
            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Team & Staff Access</CardTitle>
                <CardDescription>
                  Invite managers, reception staff, and trainers to your workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Nitheesh Kumar", email: "nitheesh@repsi.app", role: "OWNER" },
                  { name: "Rahul Verma", email: "rahul@ironcorefitness.in", role: "TRAINER" },
                  { name: "Pooja Sharma", email: "pooja@ironcorefitness.in", role: "STAFF" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs">
                    <div>
                      <p className="font-semibold text-sm text-[var(--text)]">{user.name}</p>
                      <p className="text-[var(--text-muted)]">{user.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
                      {user.role}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "danger" && (
            <Card className="border-rose-500/40 bg-rose-500/5">
              <CardHeader>
                <div className="flex items-center gap-2 text-rose-500">
                  <AlertTriangle className="h-5 w-5" />
                  <CardTitle className="text-base font-bold text-rose-500">Danger Zone — Deregister Gym</CardTitle>
                </div>
                <CardDescription className="text-zinc-400">
                  Permanently deregister your gym workspace from the REPSI platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-4 rounded-lg bg-zinc-900 border border-rose-500/30 text-xs space-y-2 text-zinc-300">
                  <p className="font-semibold text-rose-400">What happens when you deregister:</p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    <li>Your gym workspace (/{workspace}) is immediately deactivated and hidden from public access.</li>
                    <li>Active subscriptions will be marked as Cancelled without automated renewals or future charges.</li>
                    <li>Staff, trainers, and members will no longer be able to log in to this workspace.</li>
                    <li>All historical member records, financial ledgers, and attendance history remain securely archived and intact for legal records.</li>
                  </ul>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    variant="destructive"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs gap-2"
                    onClick={() => {
                      setConfirmGymName("");
                      setDeregisterReason("");
                      setDeregisterError("");
                      setShowDeregisterModal(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Deregister Gym Workspace
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab !== "general" && activeTab !== "team" && activeTab !== "danger" && (
            <Card className="border-[var(--border)] bg-[var(--surface)]">
              <CardHeader>
                <CardTitle className="text-base font-semibold capitalize">{activeTab} Settings</CardTitle>
                <CardDescription>
                  Configure and customize parameters for {activeTab}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-4 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text-muted)]">
                  All active parameters and automation triggers are synced with the REPSI platform backend.
                </div>
                <Button size="sm">Update {activeTab} rules</Button>
              </CardContent>
            </Card>
          )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Deregister Confirmation Modal */}
      <AnimatePresence>
        {showDeregisterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-950 rounded-2xl border border-rose-500/40 p-6 max-w-lg w-full shadow-2xl space-y-5 text-zinc-100"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-rose-500">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-bold text-base">Deregister &quot;{gymProfile.name}&quot;</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeregisterModal(false)}
                  className="text-zinc-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-zinc-300">
                <p className="text-rose-400 font-semibold">
                  This action will immediately close your gym operations and cancel your active subscription.
                </p>
                <p>
                  To confirm you are the authorized owner, please type your gym name{" "}
                  <span className="font-bold font-mono text-white bg-zinc-800 px-1.5 py-0.5 rounded">
                    {gymProfile.name}
                  </span>{" "}
                  in the box below:
                </p>
              </div>

              <form onSubmit={handleDeregisterSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="confirmNameInput" className="text-xs text-zinc-300">
                    Confirmation Gym Name
                  </Label>
                  <Input
                    id="confirmNameInput"
                    value={confirmGymName}
                    onChange={(e) => setConfirmGymName(e.target.value)}
                    placeholder={gymProfile.name}
                    className="bg-zinc-900 border-zinc-700 text-white font-mono text-sm focus:border-rose-500"
                    autoFocus
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reasonInput" className="text-xs text-zinc-300">
                    Reason for closure (optional)
                  </Label>
                  <Input
                    id="reasonInput"
                    value={deregisterReason}
                    onChange={(e) => setDeregisterReason(e.target.value)}
                    placeholder="e.g. Relocating, closing branch, moving software"
                    className="bg-zinc-900 border-zinc-700 text-white text-xs"
                  />
                </div>

                {deregisterError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs font-medium">
                    {deregisterError}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeregisterModal(false)}
                    disabled={deregisterLoading}
                    className="flex-1 bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={deregisterLoading || !confirmGymName.trim()}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold gap-1.5"
                  >
                    {deregisterLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Closing Gym...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        Confirm Deregistration
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
