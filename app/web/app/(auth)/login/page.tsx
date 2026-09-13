"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ShieldAlert, Building2 } from "lucide-react";
import type { Metadata } from "next";

import { loginSession } from "@/lib/auth";

// ─── Login Form ───────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    // Super Admin check
    if (
      email.toLowerCase().includes("superadmin") ||
      email.toLowerCase().includes("platform") ||
      email.toLowerCase() === "nitheesh@repsi.app"
    ) {
      loginSession(
        "jwt_superadmin_token_demo",
        {
          id: "usr_superadmin",
          name: "Nitheesh Kumar",
          email: "nitheesh@repsi.app",
          role: "SUPER_ADMIN",
        },
        "apex-fitness"
      );
      setLoading(false);
      router.push("/superadmin/dashboard");
    } else {
      // Gym Workspace resolution
      const savedSlug = typeof window !== "undefined" ? localStorage.getItem("repsi_workspace_slug") : null;
      const workspace = savedSlug || "apex-fitness";
      loginSession(
        "jwt_owner_token_demo",
        {
          id: "usr_owner_demo",
          name: "Rajesh Kumar",
          email: email,
          role: "OWNER",
          workspaceSlug: workspace,
          gymName: "Apex Fitness",
        },
        workspace
      );
      setLoading(false);
      router.push(`/${workspace}/dashboard`);
    }
  }

  const fillOwnerDemo = () => {
    setEmail("owner@apexfitness.in");
    setPassword("ApexFitness2026!");
  };

  const fillSuperAdminDemo = () => {
    setEmail("nitheesh@repsi.app");
    setPassword("PlatformGodMode2026!");
  };

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));

    // Check if user has an existing account in localStorage or system
    const existingUser = typeof window !== "undefined" ? localStorage.getItem("repsi_user_registered") : null;

    if (!existingUser) {
      setError("No REPSI account found for this Google email. Please create your account first to get started.");
      setLoading(false);
      return;
    }

    const savedSlug = typeof window !== "undefined" ? localStorage.getItem("repsi_workspace_slug") : null;
    const workspace = savedSlug || "apex-fitness";
    loginSession(
      "jwt_google_user_token",
      {
        id: "usr_google_user",
        name: "Google Account User",
        email: "user@gmail.com",
        role: "OWNER",
        workspaceSlug: workspace,
        gymName: "Apex Fitness",
      },
      workspace
    );
    setLoading(false);
    router.push(`/${workspace}/dashboard`);
  }

  return (
    <div className="w-full max-w-[400px]">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Welcome back</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1.5">
          Sign in to your REPSI gym workspace or platform
        </p>
      </div>

      {/* Card */}
      <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] space-y-4">
        {/* Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 h-10 px-4 rounded-[8px] border border-[var(--border)] bg-[var(--background)] text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-hover)] transition-all shadow-2xs active:scale-[0.98] disabled:opacity-60"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-[11px]">
            <span className="bg-[var(--surface)] px-2 text-[var(--text-muted)] font-medium">
              or continue with email
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-[8px] border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-600 dark:text-rose-400 space-y-1">
            <p className="font-semibold">{error}</p>
            <Link href="/signup" className="underline font-bold text-rose-600 dark:text-rose-300 block">
              Create account →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text)] mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--ring)] transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[var(--text)]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[var(--text-muted)] hover:text-[var(--primary-dark)] dark:hover:text-[var(--primary-hover)] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 pr-10 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--ring)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)]"
            />
            <label htmlFor="remember" className="text-sm text-[var(--text-secondary)]">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Sign in <ArrowRight className="h-3.5 w-3.5" /></>
            )}
          </button>
        </form>

        {/* Demo Logins */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[var(--surface)] px-2 text-[var(--text-muted)]">
              Quick 1-Click Demo Accounts
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={fillOwnerDemo}
            className="p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] text-left transition-all"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
              <Building2 className="h-3.5 w-3.5 text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" />
              <span>Gym Owner</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate">/apex-fitness</p>
          </button>

          <button
            type="button"
            onClick={fillSuperAdminDemo}
            className="p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:border-amber-500 text-left transition-all"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Super Admin</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate">/superadmin</p>
          </button>
        </div>
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-[var(--text-muted)] mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-[var(--text)] hover:text-[var(--primary-dark)] dark:hover:text-[var(--primary-hover)] transition-colors">
          Create one free
        </Link>
      </p>
    </div>
  );
}
