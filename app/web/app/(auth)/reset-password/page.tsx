"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, CheckCircle2, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password && password === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!minLength || !hasNumber) {
      setError("Password does not meet minimum security requirements.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSuccess(true);
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Set new password</h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Choose a strong password with at least 8 characters
        </p>
      </div>

      {success ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text)]">Password updated!</h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Your password has been successfully updated. You can now sign in with your new credentials.
          </p>
          <div className="pt-4 border-t border-[var(--border)]">
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] font-semibold text-sm flex items-center justify-center gap-2"
            >
              <span>Continue to Login</span>
              <ArrowRight className="w-4 h-4" />
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
            <label className="text-xs font-semibold text-[var(--text-secondary)]">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="space-y-1.5 pt-1 text-xs text-[var(--text-muted)]">
            <div className={`flex items-center gap-1.5 ${minLength ? "text-emerald-500 font-medium" : ""}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${minLength ? "bg-emerald-500" : "bg-[var(--border)]"}`} />
              <span>At least 8 characters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-500 font-medium" : ""}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${hasNumber ? "bg-emerald-500" : "bg-[var(--border)]"}`} />
              <span>Contains at least one number</span>
            </div>
            <div className={`flex items-center gap-1.5 ${passwordsMatch && confirmPassword ? "text-emerald-500 font-medium" : ""}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${passwordsMatch && confirmPassword ? "bg-emerald-500" : "bg-[var(--border)]"}`} />
              <span>Passwords match</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Save New Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
