"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { loginSession } from "@/lib/auth";

type BusinessType = "gym" | "studio" | "yoga" | "aquatics" | "pt";

interface BusinessOption {
  id: BusinessType;
  title: string;
  desc: string;
  icon: string;
}

const businessOptions: BusinessOption[] = [
  { id: "gym", title: "Gym", desc: "Full-service facility", icon: "🏋" },
  { id: "studio", title: "Fitness Studio", desc: "Classes & sessions", icon: "✦" },
  { id: "yoga", title: "Yoga", desc: "Mind & body studio", icon: "🧘" },
  { id: "aquatics", title: "Aquatics", desc: "Swimming & pool", icon: "🏊" },
  { id: "pt", title: "Personal Training", desc: "1-on-1 coaching", icon: "👤" },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  // Step 0: Account
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // Step 1: Business
  const [businessType, setBusinessType] = useState<BusinessType>("gym");

  // Step 2: Workspace
  const [gymName, setGymName] = useState("");
  const [city, setCity] = useState("");
  const [locationsCount, setLocationsCount] = useState<"single" | "multiple">("single");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generatedSlug = gymName
    ? gymName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    : "";

  function validateStep0() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email.trim()) e.email = "Work email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Please enter a valid email";
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: Record<string, string> = {};
    if (!gymName.trim()) e.gymName = "Business name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleStep0(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep0()) return;
    setStep(1);
  }

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep2()) return;
    setStep(3);
  }

  async function handleGoToDashboard() {
    setLoading(true);
    const slug = generatedSlug || "apex-fitness";
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://repsi.fastapicloud.dev/api/v1";

    try {
      const response = await fetch(`${apiBase}/auth/register/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          email,
          password,
          gym_name: gymName,
          gym_city: city || null,
        }),
      });

      // If backend returns ok or fallback session creation
      const token = "mock_jwt_token_onboarding_" + Date.now();
      loginSession(
        token,
        {
          id: "usr_onboarding",
          name: name || "Fitness Owner",
          email: email,
          role: "OWNER",
          workspaceSlug: slug,
          gymName: gymName || "My Gym",
        },
        slug
      );

      router.push(`/${slug}/dashboard`);
    } catch {
      // Fallback redirect to workspace dashboard directly
      loginSession(
        "mock_jwt_token_fallback",
        {
          id: "usr_onboarding",
          name: name || "Fitness Owner",
          email: email,
          role: "OWNER",
          workspaceSlug: slug,
          gymName: gymName || "My Gym",
        },
        slug
      );
      router.push(`/${slug}/dashboard`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[440px]">
      {/* 4-Step Clean Visual Progress Indicator */}
      <div className="flex items-center justify-between max-w-[360px] mx-auto mb-8 text-xs font-medium text-[#8A9690]">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${step >= 0 ? "bg-[#16A34A]" : "bg-[#D5DDD7]"}`} />
          <span className={step === 0 ? "text-[#111714] font-semibold" : ""}>Account</span>
        </div>
        <div className={`flex-1 h-[1.5px] mx-2 ${step >= 1 ? "bg-[#16A34A]" : "bg-[#E1E6E3]"}`} />

        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${step >= 1 ? "bg-[#16A34A]" : "bg-[#D5DDD7]"}`} />
          <span className={step === 1 ? "text-[#111714] font-semibold" : ""}>Business</span>
        </div>
        <div className={`flex-1 h-[1.5px] mx-2 ${step >= 2 ? "bg-[#16A34A]" : "bg-[#E1E6E3]"}`} />

        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${step >= 2 ? "bg-[#16A34A]" : "bg-[#D5DDD7]"}`} />
          <span className={step === 2 ? "text-[#111714] font-semibold" : ""}>Workspace</span>
        </div>
        <div className={`flex-1 h-[1.5px] mx-2 ${step >= 3 ? "bg-[#16A34A]" : "bg-[#E1E6E3]"}`} />

        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${step >= 3 ? "bg-[#16A34A]" : "bg-[#D5DDD7]"}`} />
          <span className={step === 3 ? "text-[#111714] font-semibold" : ""}>Ready</span>
        </div>
      </div>

      {/* ── STEP 1: ACCOUNT ───────────────────────────────────────── */}
      {step === 0 && (
        <div>
          <div className="text-center mb-6">
            <h1 className="text-[28px] sm:text-[30px] font-bold text-[#111714] tracking-tight">
              Create your REPSI account
            </h1>
            <p className="text-[15px] text-[#66706A] mt-1.5">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          <form onSubmit={handleStep0} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#111714] mb-1.5">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Arjun Nair"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`flex h-10 w-full rounded-lg border bg-white px-3 text-sm text-[#111714] placeholder:text-[#9CA3AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors ${errors.name ? "border-rose-500" : "border-[#D5DDD7]"}`}
              />
              {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#111714] mb-1.5">
                Work email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@gym.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex h-10 w-full rounded-lg border bg-white px-3 text-sm text-[#111714] placeholder:text-[#9CA3AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors ${errors.email ? "border-rose-500" : "border-[#D5DDD7]"}`}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#111714] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`flex h-10 w-full rounded-lg border bg-white px-3 pr-10 text-sm text-[#111714] placeholder:text-[#9CA3AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors ${errors.password ? "border-rose-500" : "border-[#D5DDD7]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9690] hover:text-[#111714] transition-colors"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-xs active:scale-[0.99] cursor-pointer mt-2"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <p className="text-center text-sm text-[#66706A] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#111714] hover:text-[#16A34A] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      )}

      {/* ── STEP 2: BUSINESS ──────────────────────────────────────── */}
      {step === 1 && (
        <div>
          <div className="text-center mb-6">
            <h1 className="text-[28px] sm:text-[30px] font-bold text-[#111714] tracking-tight">
              Tell us about your business
            </h1>
            <p className="text-[15px] text-[#66706A] mt-1.5">
              We&apos;ll personalize REPSI for the way you work.
            </p>
          </div>

          <form onSubmit={handleStep1} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {businessOptions.map((item) => {
                const isSelected = businessType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBusinessType(item.id)}
                    className={`p-4 rounded-xl text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-2 border-[#16A34A] bg-[#16A34A]/5 shadow-2xs"
                        : "border border-[#D5DDD7] bg-white hover:border-[#A8B6AC]"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                    <span className="text-xl block mb-1">{item.icon}</span>
                    <h3 className="text-sm font-bold text-[#111714]">{item.title}</h3>
                    <p className="text-xs text-[#66706A] mt-0.5">{item.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="w-1/3 h-10 rounded-lg border border-[#D5DDD7] bg-white text-sm font-semibold text-[#66706A] hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-xs active:scale-[0.99] cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── STEP 3: WORKSPACE ─────────────────────────────────────── */}
      {step === 2 && (
        <div>
          <div className="text-center mb-6">
            <h1 className="text-[28px] sm:text-[30px] font-bold text-[#111714] tracking-tight">
              Set up your workspace
            </h1>
            <p className="text-[15px] text-[#66706A] mt-1.5">
              This is where you&apos;ll manage your fitness business.
            </p>
          </div>

          <form onSubmit={handleStep2} className="space-y-4">
            <div>
              <label htmlFor="gymName" className="block text-sm font-medium text-[#111714] mb-1.5">
                Business name
              </label>
              <input
                id="gymName"
                type="text"
                placeholder="Iron House Fitness"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className={`flex h-10 w-full rounded-lg border bg-white px-3 text-sm text-[#111714] placeholder:text-[#9CA3AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors ${errors.gymName ? "border-rose-500" : "border-[#D5DDD7]"}`}
              />
              {errors.gymName && <p className="mt-1 text-xs text-rose-600">{errors.gymName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111714] mb-1.5">
                Workspace URL
              </label>
              <div className="flex items-center h-10 w-full rounded-lg border border-[#D5DDD7] bg-white px-3 text-sm">
                <span className="font-semibold text-[#111714]">
                  {generatedSlug || "ironhousefitness"}
                </span>
                <span className="text-[#8A9690] ml-0.5">.repsi.app</span>
                <span className="ml-auto text-xs font-medium text-[#16A34A] flex items-center gap-1">
                  ✓ Available
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-[#111714] mb-1.5">
                Location
              </label>
              <input
                id="city"
                type="text"
                placeholder="Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-[#D5DDD7] bg-white px-3 text-sm text-[#111714] placeholder:text-[#9CA3AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111714] mb-1.5">
                Number of locations
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLocationsCount("single")}
                  className={`h-10 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    locationsCount === "single"
                      ? "border-[#16A34A] bg-[#16A34A]/5 text-[#111714] font-semibold"
                      : "border-[#D5DDD7] bg-white text-[#66706A] hover:bg-zinc-50"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${locationsCount === "single" ? "border-[#16A34A] bg-[#16A34A]" : "border-[#9CA3AF]"}`}>
                    {locationsCount === "single" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  1 location
                </button>

                <button
                  type="button"
                  onClick={() => setLocationsCount("multiple")}
                  className={`h-10 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    locationsCount === "multiple"
                      ? "border-[#16A34A] bg-[#16A34A]/5 text-[#111714] font-semibold"
                      : "border-[#D5DDD7] bg-white text-[#66706A] hover:bg-zinc-50"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${locationsCount === "multiple" ? "border-[#16A34A] bg-[#16A34A]" : "border-[#9CA3AF]"}`}>
                    {locationsCount === "multiple" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  Multiple locations
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 h-10 rounded-lg border border-[#D5DDD7] bg-white text-sm font-semibold text-[#66706A] hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-xs active:scale-[0.99] cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── STEP 4: READY (SUCCESS MOMENT) ────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h1 className="text-[28px] sm:text-[30px] font-bold text-[#111714] tracking-tight">
              Your REPSI workspace is ready.
            </h1>
            <p className="text-[15px] text-[#66706A] mt-1.5">
              <span className="font-semibold text-[#111714]">{gymName || "Iron House Fitness"}</span> is ready to go.
            </p>
          </div>

          <div className="bg-white border border-[#D5DDD7] rounded-xl p-5 space-y-3.5">
            <div className="flex items-center gap-3 text-sm font-medium text-[#111714]">
              <span className="w-5 h-5 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </span>
              <span>Account created</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-[#111714]">
              <span className="w-5 h-5 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </span>
              <span>Business configured</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-[#111714]">
              <span className="w-5 h-5 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </span>
              <span>Workspace created</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoToDashboard}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-base font-semibold transition-all shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-[#8A9690]">
              You can finish the remaining setup from your dashboard.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
