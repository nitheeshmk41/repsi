"use client";

import { useState } from "react";
import { Mail, User, Phone, Briefcase, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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
  const [role, setRole] = useState<"member" | "trainer">(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("General Fitness");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill in both Name and Email.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await repsiApi.sendInvitation({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        role,
        specialization: role === "trainer" ? specialization.trim() : undefined,
      });

      setSuccessMsg(res.message);
      setName("");
      setEmail("");
      setPhone("");

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        setSuccessMsg(null);
        onOpenChange(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to send invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Invite {role === "trainer" ? "Trainer" : "Member"}
          </DialogTitle>
          <DialogDescription>
            Send an email invitation link. The recipient will set their password upon accepting.
          </DialogDescription>
        </DialogHeader>

        {successMsg ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
            <h4 className="font-semibold text-lg text-[var(--text)]">Invitation Sent!</h4>
            <p className="text-sm text-[var(--text-muted)]">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {error && (
              <div className="p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Role selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[var(--text-muted)]">Invited Role</Label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setRole("member")}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                    role === "member"
                      ? "bg-[var(--primary)] text-white shadow-sm font-semibold"
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
                      ? "bg-[var(--primary)] text-white shadow-sm font-semibold"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  Trainer
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="inv-name" className="text-xs font-semibold text-[var(--text)]">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  id="inv-name"
                  placeholder={role === "trainer" ? "e.g. Vikram Rathore" : "e.g. Arun Kumar"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="inv-email" className="text-xs font-semibold text-[var(--text)]">
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
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {/* Phone (Optional) */}
            <div className="space-y-1.5">
              <Label htmlFor="inv-phone" className="text-xs font-semibold text-[var(--text)]">
                Phone Number <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  id="inv-phone"
                  placeholder="+91 98450 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Trainer Specialization (if trainer) */}
            {role === "trainer" && (
              <div className="space-y-1.5">
                <Label htmlFor="inv-spec" className="text-xs font-semibold text-[var(--text)]">
                  Specialization / Track
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                  <Input
                    id="inv-spec"
                    placeholder="e.g. Strength & Conditioning, Yoga, CrossFit"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="pl-9"
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
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
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
