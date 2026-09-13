"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, ArrowRight } from "lucide-react";

const steps = ["Account", "Workspace", "Done"] as const;
type Step = (typeof steps)[number];

// Password strength
function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  if (pwd.length === 0) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = [
    "bg-[var(--error)]",
    "bg-[var(--warning)]",
    "bg-[var(--info)]",
    "bg-[var(--success)]",
  ];
  return { score, label: labels[score - 1] ?? "", color: colors[score - 1] ?? "" };
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2>(0);

  // Step 0
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // Step 1
  const [gymName, setGymName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pwdStrength = getPasswordStrength(password);

  function validateStep0() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Invalid email";
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!gymName.trim()) e.gymName = "Gym name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleStep0(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep0()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    setStep(1);
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep1()) return;
    setLoading(true);
    const slug = gymName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/register/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name, email, password, gym_name: gymName, gym_phone: phone || null, gym_city: city || null }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.detail || "Unable to send the verification code.");
      localStorage.setItem("repsi_pending_email", email.trim().toLowerCase());
      localStorage.setItem("repsi_workspace_slug", slug || "apex-fitness");
      router.push("/verify-email");
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : "Unable to send the verification code." });
    } finally {
      setLoading(false);
    }
  }

  const generatedSlug = gymName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  return (
    <div className="w-full max-w-[420px]">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
          {step === 0 ? "Create your REPSI account" : "Your gym workspace"}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
          {step === 0
            ? "Start your 14-day free trial. No credit card required."
            : "This is where you'll manage your gym, members, staff and business operations."}
        </p>
      </div>

      {/* 2-Step Indicator */}
      <div className="flex items-center justify-between max-w-[280px] mx-auto mb-6 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 0 ? "bg-[#16A34A] text-white" : "bg-zinc-200 text-zinc-500"}`}>
            {step > 0 ? "✓" : "1"}
          </span>
          <span className={step === 0 ? "text-zinc-900 font-bold" : "text-zinc-500"}>Account</span>
        </div>

        <div className={`flex-1 h-0.5 mx-3 transition-colors ${step > 0 ? "bg-[#16A34A]" : "bg-zinc-200"}`} />

        <div className="flex items-center gap-2">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? "bg-[#16A34A] text-white" : "bg-zinc-200 text-zinc-500"}`}>
            2
          </span>
          <span className={step === 1 ? "text-zinc-900 font-bold" : "text-zinc-500"}>Workspace</span>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
        {errors.submit && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errors.submit}</p>}
        {/* ── Step 0: Account ────────────────────────────────────── */}
        {step === 0 && (
          <form onSubmit={handleStep0} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-[var(--text)] mb-1.5">Full name</label>
              <input id="signup-name" type="text" autoComplete="name" placeholder="Arjun Nair" value={name}
                onChange={(e) => setName(e.target.value)}
                className={`flex h-10 w-full rounded-[8px] border bg-[var(--background)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--ring)] transition-colors ${errors.name ? "border-[var(--error)]" : "border-[var(--border)]"}`} />
              {errors.name && <p className="mt-1 text-xs text-[var(--error)]">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-[var(--text)] mb-1.5">Email address</label>
              <input id="signup-email" type="email" autoComplete="email" placeholder="you@gym.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex h-10 w-full rounded-[8px] border bg-[var(--background)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--ring)] transition-colors ${errors.email ? "border-[var(--error)]" : "border-[var(--border)]"}`} />
              {errors.email && <p className="mt-1 text-xs text-[var(--error)]">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-[var(--text)] mb-1.5">Password</label>
              <div className="relative">
                <input id="signup-password" type={showPwd ? "text" : "password"} autoComplete="new-password" placeholder="Min. 8 characters" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`flex h-10 w-full rounded-[8px] border bg-[var(--background)] px-3 pr-10 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--ring)] transition-colors ${errors.password ? "border-[var(--error)]" : "border-[var(--border)]"}`} />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password strength */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className={`h-1 flex-1 rounded-full transition-all ${n <= pwdStrength.score ? pwdStrength.color : "bg-[var(--border)]"}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${pwdStrength.score >= 3 ? "text-[var(--success)]" : "text-[var(--text-muted)]"}`}>{pwdStrength.label}</p>
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-[var(--error)]">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-[8px] bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors disabled:opacity-60">
              {loading ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Continue <ArrowRight className="h-3.5 w-3.5" /></>}
            </button>
          </form>
        )}

        {/* ── Step 1: Workspace ──────────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label htmlFor="gym-name" className="block text-sm font-medium text-[var(--text)] mb-1.5">Gym name</label>
              <input id="gym-name" type="text" placeholder="Apex Fitness" value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className={`flex h-10 w-full rounded-[8px] border bg-[var(--background)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--ring)] transition-colors ${errors.gymName ? "border-[var(--error)]" : "border-[var(--border)]"}`} />
              {errors.gymName && <p className="mt-1 text-xs text-[var(--error)]">{errors.gymName}</p>}
            </div>

            {/* Live Generated Workspace URL Card */}
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Workspace URL</span>
              <p className="font-mono text-xs font-semibold text-zinc-900 truncate">
                repsi.app/<span className="text-[#16A34A]">{generatedSlug || "your-gym"}</span>
              </p>
            </div>

            <div>
              <label htmlFor="gym-phone" className="block text-sm font-medium text-[var(--text)] mb-1.5">Phone <span className="text-[var(--text-muted)]">(optional)</span></label>
              <input id="gym-phone" type="tel" placeholder="+91 98400 00000" value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex h-10 w-full rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--ring)] transition-colors" />
            </div>

            <div>
              <label htmlFor="gym-city" className="block text-sm font-medium text-[var(--text)] mb-1.5">City <span className="text-[var(--text-muted)]">(optional)</span></label>
              <input id="gym-city" type="text" placeholder="Coimbatore" value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex h-10 w-full rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--ring)] transition-colors" />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setStep(0)}
                className="flex-1 h-10 rounded-[8px] border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--nav-hover-bg)] transition-colors">
                Back
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-[8px] bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-colors disabled:opacity-60">
                {loading ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Workspace →</>}
              </button>
            </div>
          </form>
        )}
      </div>

      {step === 0 && (
        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[var(--text)] hover:text-[#16A34A] transition-colors">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
