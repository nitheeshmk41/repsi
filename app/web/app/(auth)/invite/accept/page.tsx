"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell, CheckCircle2, Lock, AlertCircle, Loader2, UserCheck, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { repsiApi } from "@/lib/api";
import { loginSession } from "@/lib/auth";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<{
    id: string;
    email: string;
    name: string;
    role: "member" | "trainer";
    gym_name: string;
    gym_slug: string;
    invited_by_name?: string;
  } | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Form State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [acceptedSuccess, setAcceptedSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setVerifyError("No invitation token provided. Please check your invitation email link.");
      setLoading(false);
      return;
    }

    repsiApi
      .verifyInvitation(token)
      .then((data) => {
        setInvitation(data);
        setLoading(false);
      })
      .catch((err) => {
        setVerifyError(err.message || "Invalid or expired invitation token.");
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const res = await repsiApi.acceptInvitation({ token, password });

      // Save auth session
      if (res.access_token && res.user) {
        loginSession(
          res.access_token,
          {
            id: res.user.id,
            name: res.user.full_name,
            email: res.user.email,
            role: res.user.role,
            workspaceSlug: res.workspace_slug || invitation?.gym_slug || "apex-fitness",
            gymName: invitation?.gym_name || "Gym Workspace",
          },
          res.workspace_slug || invitation?.gym_slug || "apex-fitness"
        );
      }

      setAcceptedSuccess(true);
      setTimeout(() => {
        const destSlug = res.workspace_slug || invitation?.gym_slug || "apex-fitness";
        router.push(`/${destSlug}/dashboard`);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Failed to accept invitation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <Loader2 className="h-10 w-10 text-[var(--primary)] animate-spin" />
        <p className="text-sm font-medium text-[var(--text-muted)]">Verifying invitation token...</p>
      </div>
    );
  }

  if (verifyError || !invitation) {
    return (
      <div className="p-8 rounded-2xl border border-red-500/20 bg-red-500/5 max-w-md mx-auto text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text)]">Invitation Link Error</h2>
        <p className="text-sm text-[var(--text-muted)]">{verifyError}</p>
        <div className="pt-2">
          <Button asChild variant="outline">
            <Link href="/login">Return to Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (acceptedSuccess) {
    return (
      <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 max-w-md mx-auto text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 animate-bounce">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text)]">Account Activated!</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Welcome to <span className="font-semibold text-[var(--text)]">{invitation.gym_name}</span>. Redirecting you to your dashboard...
        </p>
        <div className="pt-2">
          <Loader2 className="h-5 w-5 text-emerald-500 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary-dark)] dark:text-[var(--primary-hover)] text-xs font-semibold">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Official Gym Invitation</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
          Join {invitation.gym_name}
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Set up your password to activate your {invitation.role} account.
        </p>
      </div>

      {/* Invitation Info Card */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border)]">
          <span className="text-[var(--text-muted)]">Gym Name</span>
          <span className="font-bold text-[var(--text)]">{invitation.gym_name}</span>
        </div>
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border)]">
          <span className="text-[var(--text-muted)]">Invited Role</span>
          <span className="font-semibold uppercase tracking-wider text-xs px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
            {invitation.role}
          </span>
        </div>
        {invitation.invited_by_name && (
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border)]">
            <span className="text-[var(--text-muted)]">Invited By</span>
            <span className="font-medium text-[var(--text)]">{invitation.invited_by_name}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">Account Email</span>
          <span className="font-medium text-[var(--text)]">{invitation.email}</span>
        </div>
      </div>

      {/* Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="inv-pass" className="text-xs font-semibold text-[var(--text)]">
            Create Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
            <Input
              id="inv-pass"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="inv-conf-pass" className="text-xs font-semibold text-[var(--text)]">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
            <Input
              id="inv-conf-pass"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-9"
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-full gap-2 h-11 text-sm font-semibold">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Activating Account...
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4" />
              Accept Invitation & Set Password
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 text-[var(--primary)] animate-spin" />
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
