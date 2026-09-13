"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="w-full max-w-[400px]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Reset password</h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Enter your email address and we&apos;ll send you a password reset link
        </p>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text)]">Check your inbox</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            We sent a secure password reset link to <span className="font-semibold text-[var(--text)]">{email}</span>. Click the link within 15 minutes to reset your password.
          </p>
          <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-2">
            <Link
              href="/reset-password?token=demo-reset-token"
              className="text-xs font-semibold text-[var(--accent)] hover:underline"
            >
              Simulate clicking email link →
            </Link>
            <Link
              href="/login"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] pt-2"
            >
              Return to login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Registered Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@yourgym.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
              <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to log in</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
