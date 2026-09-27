"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import { repsiApi } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEmailBlur = async () => {
    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Work email is required *" }));
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
      return;
    }
    setCheckingEmail(true);
    try {
      const check = await repsiApi.checkAvailability({ email: email.trim() });
      if (check.email_exists) {
        setErrors((prev) => ({ ...prev, email: check.email_message || "This email is already registered." }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.email;
          return next;
        });
      }
    } catch {
      // Ignore network failures
    } finally {
      setCheckingEmail(false);
    }
  };

  const handlePhoneBlur = async () => {
    if (!phone.trim() || phone.length < 8) return;
    setCheckingPhone(true);
    try {
      const check = await repsiApi.checkAvailability({ phone: phone.trim() });
      if (check.phone_exists) {
        setErrors((prev) => ({ ...prev, phone: check.phone_message || "This phone number is already registered." }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.phone;
          return next;
        });
      }
    } catch {
      // Ignore network failures
    } finally {
      setCheckingPhone(false);
    }
  };

  function validate() {
    const e: Record<string, string> = { ...errors };
    if (!name.trim()) e.name = "Full name is required";
    if (!email.trim()) e.email = "Work email is required *";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Please enter a valid email";
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://repsi.fastapicloud.dev/api/v1";
      await fetch(`${apiBase}/auth/register/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          email: email.trim().toLowerCase(),
          password,
          gym_name: "My Fitness Business",
          gym_phone: phone.trim() || "+91 98000 00000",
          gym_city: "India",
        }),
      });
    } catch {
      // Graceful fallback if backend unavailable
    }

    localStorage.setItem("repsi_pending_email", email.trim().toLowerCase());
    localStorage.setItem("repsi_pending_name", name.trim());
    localStorage.setItem("repsi_pending_password", password);
    if (phone.trim()) localStorage.setItem("repsi_pending_phone", phone.trim());

    setLoading(false);
    // Launch directly into Step 2 (Email OTP Verification) of Onboarding Wizard!
    router.push(`/onboarding/wizard?step=2&email=${encodeURIComponent(email.trim().toLowerCase())}&name=${encodeURIComponent(name.trim())}`);
  }

  return (
    <div className="w-full max-w-[420px] sm:max-w-[440px] mx-auto space-y-6">
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-[#64748B]">
          Start your 14-day free trial. No credit card required.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8E5] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#111827] mb-1.5">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Arjun Nair"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`flex h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-[#111827] placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors ${
                errors.name ? "border-rose-500" : "border-[#E2E8E5]"
              }`}
              autoFocus
              required
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-[#111827]">
                Work email <span className="text-red-500">*</span>
              </label>
              {checkingEmail && (
                <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Checking DB...
                </span>
              )}
            </div>
            <input
              id="email"
              type="email"
              placeholder="you@gym.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              onBlur={handleEmailBlur}
              className={`flex h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-[#111827] placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors ${
                errors.email ? "border-rose-500" : "border-[#E2E8E5]"
              }`}
              required
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-[#111827]">
                Mobile number <span className="text-[#64748B] font-normal">(Optional)</span>
              </label>
              {checkingPhone && (
                <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Checking DB...
                </span>
              )}
            </div>
            <PhoneInput
              value={phone}
              onChange={(val) => {
                setPhone(val);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
              }}
              onBlur={handlePhoneBlur}
              placeholder="98450 12345"
              error={!!errors.phone}
            />
            {errors.phone && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`flex h-11 w-full rounded-lg border bg-white px-3.5 pr-10 text-sm text-[#111827] placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors ${
                  errors.password ? "border-rose-500" : "border-[#E2E8E5]"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#111827] transition-colors cursor-pointer"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || checkingEmail || checkingPhone}
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Continue to setup</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-[#64748B]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#111827] hover:text-[#16A34A] transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
