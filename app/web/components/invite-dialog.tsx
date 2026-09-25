"use client";

import { useState } from "react";
import { Mail, User, Phone, Briefcase, CheckCircle2, AlertCircle, Loader2, Key, Sparkles, Eye, EyeOff, UserPlus, Send } from "lucide-react";
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
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password?: string } | null>(null);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {mode === "invite" ? (
              <>
                <Send className="h-5 w-5 text-indigo-500" />
                Invite {role === "trainer" ? "Trainer" : "Member"}
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 text-emerald-500" />
                Add {role === "trainer" ? "Trainer" : "Member"} Directly
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "invite"
              ? "Send an email invitation link. Recipient will set their password upon accepting."
              : "Directly create and activate account with password. Login credentials will be emailed to them."}
          </DialogDescription>
        </DialogHeader>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900/60 rounded-xl border border-slate-800 my-1">
          <button
            type="button"
            onClick={() => setMode("invite")}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === "invite"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            Send Invite Link
          </button>
          <button
            type="button"
            onClick={() => setMode("direct")}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === "direct"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            Add with Password
          </button>
        </div>

        {successMsg ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
            <h4 className="font-semibold text-lg text-slate-100">
              {mode === "direct" ? "Account Provisioned!" : "Invitation Sent!"}
            </h4>
            <p className="text-sm text-slate-400 max-w-sm">{successMsg}</p>
            {createdCredentials && (
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-left w-full space-y-1">
                <div><span className="text-slate-400">Login Email:</span> <span className="text-emerald-400 font-bold">{createdCredentials.email}</span></div>
                {createdCredentials.password && (
                  <div><span className="text-slate-400">Password:</span> <span className="text-emerald-400 font-bold">{createdCredentials.password}</span></div>
                )}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {error && (
              <div className="p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Role selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-400">Target Role</Label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setRole("member")}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                    role === "member"
                      ? "bg-slate-800 text-white font-semibold shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Member
                </button>
                <button
                  type="button"
                  onClick={() => setRole("trainer")}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                    role === "trainer"
                      ? "bg-slate-800 text-white font-semibold shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Trainer
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="inv-name" className="text-xs font-semibold text-slate-200">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="inv-name"
                  placeholder={role === "trainer" ? "e.g. Vikram Rathore" : "e.g. Arun Kumar"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 bg-slate-900/80 border-slate-800"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="inv-email" className="text-xs font-semibold text-slate-200">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="inv-email"
                  type="email"
                  placeholder="recipient@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-slate-900/80 border-slate-800"
                  required
                />
              </div>
            </div>

            {/* Direct Add Password Field */}
            {mode === "direct" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="inv-pass" className="text-xs font-semibold text-slate-200">
                    Password <span className="text-slate-400 font-normal">(Leave blank to auto-generate)</span>
                  </Label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    Auto-generate
                  </button>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="inv-pass"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password or generate..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 bg-slate-900/80 border-slate-800 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Phone (Optional) */}
            <div className="space-y-1.5">
              <Label htmlFor="inv-phone" className="text-xs font-semibold text-slate-200">
                Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="inv-phone"
                  placeholder="+91 98450 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 bg-slate-900/80 border-slate-800"
                />
              </div>
            </div>

            {/* Trainer Specialization (if trainer) */}
            {role === "trainer" && (
              <div className="space-y-1.5">
                <Label htmlFor="inv-spec" className="text-xs font-semibold text-slate-200">
                  Specialization / Track
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="inv-spec"
                    placeholder="e.g. Strength & Conditioning, Yoga, CrossFit"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="pl-9 bg-slate-900/80 border-slate-800"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={mode === "direct" ? "bg-emerald-600 hover:bg-emerald-500 gap-2" : "bg-indigo-600 hover:bg-indigo-500 gap-2"}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === "direct" ? "Provisioning..." : "Sending..."}
                  </>
                ) : mode === "direct" ? (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Add & Send Credentials
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
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
