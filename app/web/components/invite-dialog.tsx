"use client";

import { useState } from "react";
import {
  Mail,
  User,
  Phone,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Key,
  Sparkles,
  Eye,
  EyeOff,
  UserPlus,
  Send,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { repsiApi } from "@/lib/api";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: "member" | "trainer";
  onSuccess?: () => void;
}

export function InviteDialog({
  open,
  onOpenChange,
  defaultRole = "member",
  onSuccess,
}: InviteDialogProps) {
  const [mode, setMode] = useState<"invite" | "direct">("invite");
  const [role, setRole] = useState<"member" | "trainer">(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [specialization, setSpecialization] = useState("General Fitness");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    password?: string;
  } | null>(null);

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pwd = "R";
    for (let i = 0; i < 9; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill in both Name and Email.");
      return;
    }

    if (mode === "direct" && password.trim() && password.trim().length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setCreatedCredentials(null);

    try {
      if (mode === "invite") {
        const res = await repsiApi.sendInvitation({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          role,
          specialization: role === "trainer" ? specialization.trim() : undefined,
        });
        setSuccessMsg(res.message);
      } else {
        const res = await repsiApi.directAddUser({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          role,
          password: password.trim() || undefined,
          specialization: role === "trainer" ? specialization.trim() : undefined,
        });
        setSuccessMsg(res.message);
        setCreatedCredentials({
          email: res.email || email.trim(),
          password: res.password || password.trim(),
        });
      }

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        setSuccessMsg(null);
        setCreatedCredentials(null);
        onOpenChange(false);
      }, 3500);
    } catch (err: any) {
      setError(err.message || "Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] p-6 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-xl rounded-[20px]">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--primary-soft)] text-[var(--text)] flex items-center justify-center shrink-0 border border-[var(--border)]">
              {mode === "invite" ? (
                <Send className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <UserPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-[var(--text)]">
                {mode === "invite"
                  ? `Invite ${role === "trainer" ? "Trainer" : "Member"}`
                  : `Add ${role === "trainer" ? "Trainer" : "Member"} Directly`}
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--text-muted)] mt-0.5">
                {mode === "invite"
                  ? "Send an invitation link. Recipient will set their password upon joining."
                  : "Provision account instantly with password. Login credentials emailed automatically."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--background)] rounded-xl border border-[var(--border)] my-2">
          <button
            type="button"
            onClick={() => setMode("invite")}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === "invite"
                ? "bg-[var(--surface)] text-[var(--text)] shadow-sm border border-[var(--border)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <Mail className="h-3.5 w-3.5 text-slate-500" />
            Send Invite Link
          </button>
          <button
            type="button"
            onClick={() => setMode("direct")}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === "direct"
                ? "bg-[var(--surface)] text-[var(--text)] shadow-sm border border-[var(--border)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <Key className="h-3.5 w-3.5 text-slate-500" />
            Add with Password
          </button>
        </div>

        {successMsg ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 animate-bounce" />
            </div>
            <h4 className="font-bold text-base text-[var(--text)]">
              {mode === "direct" ? "Account Created!" : "Invitation Sent!"}
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">{successMsg}</p>
            {createdCredentials && (
              <div className="p-3 bg-[var(--background)] rounded-xl border border-[var(--border)] text-xs font-mono text-left w-full space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] font-sans">Login Email:</span>
                  <span className="text-[var(--text)] font-semibold">{createdCredentials.email}</span>
                </div>
                {createdCredentials.password && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)] font-sans">Password:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {createdCredentials.password}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Target Role Selector */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-[var(--text-secondary)]">Target Role</Label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setRole("member")}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                    role === "member"
                      ? "bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold border border-[var(--border)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  Member
                </button>
                <button
                  type="button"
                  onClick={() => setRole("trainer")}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                    role === "trainer"
                      ? "bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold border border-[var(--border)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  Trainer
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="inv-name" className="text-xs font-medium text-[var(--text)]">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  id="inv-name"
                  placeholder={role === "trainer" ? "e.g. Vikram Rathore" : "e.g. Arun Kumar"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-9 bg-[var(--surface)] border-[var(--border)] text-[var(--text)] text-xs placeholder:text-[var(--text-muted)] rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <Label htmlFor="inv-email" className="text-xs font-medium text-[var(--text)]">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  id="inv-email"
                  type="email"
                  placeholder="recipient@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-9 bg-[var(--surface)] border-[var(--border)] text-[var(--text)] text-xs placeholder:text-[var(--text-muted)] rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
                  required
                />
              </div>
            </div>

            {/* Direct Add Password Field */}
            {mode === "direct" && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="inv-pass" className="text-xs font-medium text-[var(--text)]">
                    Password <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                  </Label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    Auto-generate
                  </button>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <Input
                    id="inv-pass"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password or auto-generate..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 h-9 bg-[var(--surface)] border-[var(--border)] text-[var(--text)] text-xs placeholder:text-[var(--text-muted)] rounded-xl font-mono focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Phone Number (Optional) */}
            <div className="space-y-1">
              <Label htmlFor="inv-phone" className="text-xs font-medium text-[var(--text)]">
                Phone Number <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  id="inv-phone"
                  placeholder="+91 98450 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 h-9 bg-[var(--surface)] border-[var(--border)] text-[var(--text)] text-xs placeholder:text-[var(--text-muted)] rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
                />
              </div>
            </div>

            {/* Trainer Specialization (if trainer) */}
            {role === "trainer" && (
              <div className="space-y-1">
                <Label htmlFor="inv-spec" className="text-xs font-medium text-[var(--text)]">
                  Specialization / Track
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <Input
                    id="inv-spec"
                    placeholder="e.g. Strength & Conditioning, Yoga, CrossFit"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="pl-9 h-9 bg-[var(--surface)] border-[var(--border)] text-[var(--text)] text-xs placeholder:text-[var(--text-muted)] rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="h-9 px-4 rounded-xl border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--background)]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-9 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-xs font-semibold gap-2 shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {mode === "direct" ? "Provisioning..." : "Sending..."}
                  </>
                ) : mode === "direct" ? (
                  <>
                    <UserPlus className="h-3.5 w-3.5" />
                    Add & Send Credentials
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
