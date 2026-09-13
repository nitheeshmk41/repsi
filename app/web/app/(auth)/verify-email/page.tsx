"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";
import { setAuthCookie } from "../../../lib/auth";

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const userEmail = typeof window !== "undefined" ? localStorage.getItem("repsi_pending_email") || "" : "";

  async function handleResend() {
    setResending(true);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/register/resend-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: userEmail }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.detail || "Unable to resend the code.");
      setResent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend the code.");
    } finally {
      setResending(false);
    }
  }

  const [isVerified, setIsVerified] = useState(false);

  async function handleVerification() {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setVerifying(true);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/register/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: userEmail, otp }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.detail || "Verification failed.");
      setAuthCookie(body.access_token);
      localStorage.setItem("repsi_auth_token", body.access_token);
      setIsVerified(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center space-y-6 shadow-sm">
        {!isVerified ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#16A34A] flex items-center justify-center mx-auto">
              <Mail className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Check your inbox</h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                We&apos;ve sent a 6-digit verification code to <strong className="font-semibold text-zinc-900">{userEmail}</strong>.
              </p>
            </div>

            {resent && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#16A34A] text-xs font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>A fresh verification link has been sent!</span>
              </div>
            )}
            {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}

            <div className="space-y-3 pt-2">
              <input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" maxLength={6} placeholder="000000" aria-label="6-digit verification code" className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] text-center text-xl tracking-[0.5em] text-[var(--text)]" />
              <button
                type="button"
                onClick={handleVerification}
                disabled={verifying}
                className="w-full py-3 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>{verifying ? "Verifying..." : "Verify email"}</span>
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="w-full py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] hover:bg-[var(--surface-hover)] font-medium text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                <span>Resend email</span>
              </button>
            </div>

            <div className="pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
              Wrong email address?{" "}
              <Link href="/signup" className="text-[#16A34A] hover:underline font-medium">
                Change email
              </Link>
            </div>
          </>
        ) : (
          <div className="space-y-5 py-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-zinc-900">Email Verified</h2>
              <p className="text-sm text-zinc-600">Your account is ready. Let&apos;s set up your gym workspace.</p>
            </div>
            <Link
              href="/onboarding/gym"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#16A34A] text-white font-bold text-sm hover:bg-[#15803D] transition-all shadow-md"
            >
              <span>Continue to Gym Setup</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
