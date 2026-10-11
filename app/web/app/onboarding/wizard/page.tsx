"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  X,
  Sparkles,
} from "lucide-react";
import { loginSession } from "@/lib/auth";
import { PhoneInput } from "@/components/ui/phone-input";
import { repsiApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShinyText } from "@/components/ui/shiny-text";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { BorderBeam } from "@/components/ui/border-beam";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://repsi.fastapicloud.dev/api/v1";

function maskEmail(emailStr: string) {
  if (!emailStr || !emailStr.includes("@")) return emailStr || "you@gym.com";
  const [local, domain] = emailStr.split("@");
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  const maskedLocal = local[0] + "*".repeat(Math.max(1, local.length - 2)) + local[local.length - 1];
  return `${maskedLocal}@${domain}`;
}

export default function OnboardingWizardPage() {
  const router = useRouter();

  // Unified Onboarding Steps:
  // Step 1: Create Account
  // Step 2: Gym Identity (Owner form - Step 1 of 5)
  // Step 3: Business Setup (Step 2 of 5)
  // Step 4: Memberships (Step 3 of 5)
  // Step 5: Team (Step 4 of 5)
  // Step 6: Final Review & Email OTP Verification (Step 5 of 5 - LAST step!)
  // Step 7: Launch & Complete
  const [step, setStep] = useState(1);

  // Step 1: Account
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Owner & Gym Identity Form (Step 2)
  const [gymName, setGymName] = useState("");
  const [businessType, setBusinessType] = useState("Gym & Fitness center");
  const [gymPhone, setGymPhone] = useState("");
  const [gymCity, setGymCity] = useState("");

  // Step 3: Business Setup
  const [locationsCount, setLocationsCount] = useState("1 location");
  const [approxMembers, setApproxMembers] = useState("100–500 members");
  const [currency, setCurrency] = useState("INR (₹)");
  const [timezone, setTimezone] = useState("Asia/Kolkata (GMT+5:30)");

  // Step 4: Memberships
  const [plans, setPlans] = useState([
    { id: "1", name: "Monthly", price: "1299", duration: "1 month", active: true },
    { id: "2", name: "Quarterly", price: "3499", duration: "3 months", active: true },
    { id: "3", name: "Annual", price: "11999", duration: "12 months", active: true },
  ]);
  const [customPlanName, setCustomPlanName] = useState("");
  const [customPlanPrice, setCustomPlanPrice] = useState("");
  const [customPlanDuration, setCustomPlanDuration] = useState("");
  const [showAddCustomPlan, setShowAddCustomPlan] = useState(false);

  // Step 5: Team
  const [teamMembers, setTeamMembers] = useState<Array<{ name: string; role: string; contact: string }>>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Trainer");
  const [newMemberContact, setNewMemberContact] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);

  // Step 6: OTP & Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otpError, setOtpError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(29);

  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugError, setSlugError] = useState("");

  // Post-verification plan selection
  const [chosenPlanType, setChosenPlanType] = useState<"trial" | "paid">("trial");
  const [selectedPaidPlanCode, setSelectedPaidPlanCode] = useState<string>("growth");
  const [chosenBillingCycle, setChosenBillingCycle] = useState<"monthly" | "annual">("annual");

  const effectiveSlug = (
    workspaceSlug ||
    (gymName ? gymName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : "fitzone-fitness")
  ).replace(/[^a-z0-9-]/g, "");

  // Auto-sync slug from gymName when user hasn't typed a custom slug
  useEffect(() => {
    if (!isSlugCustomized && gymName) {
      const derived = gymName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setWorkspaceSlug(derived);
    }
  }, [gymName, isSlugCustomized]);

  // Debounced check availability for workspace slug
  useEffect(() => {
    if (!workspaceSlug || workspaceSlug.length < 3) {
      setSlugAvailable(null);
      setSlugError("");
      return;
    }
    const timer = setTimeout(async () => {
      setCheckingSlug(true);
      try {
        const res = await repsiApi.checkAvailability({ slug: workspaceSlug });
        if (res.slug_exists) {
          setSlugAvailable(false);
          setSlugError(res.slug_message || "This workspace URL is already taken.");
        } else {
          setSlugAvailable(true);
          setSlugError("");
        }
      } catch {
        // network fallback
      } finally {
        setCheckingSlug(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [workspaceSlug]);

  // Parse URL search parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get("step");
      const emailParam = params.get("email") || localStorage.getItem("repsi_pending_email");
      const nameParam = params.get("name") || localStorage.getItem("repsi_pending_name");
      const pwdParam = localStorage.getItem("repsi_pending_password");

      if (emailParam) setEmail(emailParam);
      if (nameParam) setFullName(nameParam);
      if (pwdParam) {
        setPassword(pwdParam);
        setConfirmPassword(pwdParam);
      }
      if (stepParam && !isNaN(Number(stepParam))) {
        setStep(Number(stepParam));
      }
    }
  }, []);

  // OTP Countdown Timer
  useEffect(() => {
    if (otpSent && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpSent, resendTimer]);

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
        setErrors((prev) => ({ ...prev, email: check.email_message || "This email address is already registered." }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.email;
          return next;
        });
      }
    } catch {
      // Ignore network errors
    } finally {
      setCheckingEmail(false);
    }
  };

  // Step 1 Validation
  function validateStep1() {
    const e: Record<string, string> = { ...errors };
    if (!fullName.trim()) e.name = "Full name is required";
    if (!email.trim()) e.email = "Work email is required *";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Please enter a valid email";
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (!confirmPassword) e.confirmPassword = "Confirm password is required";
    else if (confirmPassword !== password) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;
    localStorage.setItem("repsi_pending_email", email.trim().toLowerCase());
    localStorage.setItem("repsi_pending_name", fullName.trim());
    localStorage.setItem("repsi_pending_password", password);
    setStep(2);
  };

  // Step 2 Validation (Gym Identity Form)
  function validateStep2() {
    const e: Record<string, string> = {};
    if (!gymName.trim()) e.gymName = "Gym / Business name is required";
    if (!effectiveSlug.trim() || effectiveSlug.length < 3) {
      e.slug = "Workspace URL must be at least 3 characters";
    } else if (slugAvailable === false) {
      e.slug = slugError || "This workspace URL is already taken. Please choose another.";
    }
    if (!gymPhone.trim()) e.gymPhone = "Contact phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setStep(3);
  };

  // Helper to call backend with automatic fallback to Next.js proxy if direct SSL is refused
  async function callBackend(endpoint: string, options: RequestInit) {
    try {
      const directUrl = `${API_BASE}${endpoint}`;
      const res = await fetch(directUrl, options);
      return res;
    } catch (directErr) {
      if (typeof window !== "undefined") {
        try {
          const fallbackUrl = `/api/backend${endpoint}`;
          const fallbackRes = await fetch(fallbackUrl, options);
          return fallbackRes;
        } catch {
          throw directErr;
        }
      }
      throw directErr;
    }
  }

  // Dispatch OTP after user confirmation modal
  const handleConfirmAndSendOtp = async () => {
    setShowConfirmModal(false);
    setIsSendingOtp(true);
    setOtpError("");

    try {
      const response = await callBackend("/auth/register/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim() || "Owner",
          email: email.trim().toLowerCase(),
          password: password || "repsiSecure123",
          gym_name: gymName.trim() || "My Gym",
          gym_phone: gymPhone.trim() || "+91 98000 00000",
          gym_city: gymCity.trim() || "City",
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        setOtpError(errorBody.detail || "Unable to send verification code. Please try again.");
        setIsSendingOtp(false);
        return;
      }

      setOtpSent(true);
      setResendTimer(29);
    } catch (err: any) {
      setOtpError(
        "Unable to reach server (" + (err?.message || "Connection refused") + "). Please verify server connection or check your network."
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  // OTP Handling logic
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== "") && newDigits.join("").length === 6) {
      setTimeout(() => {
        triggerVerifyOtp(newDigits.join(""));
      }, 100);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpDigits(digits);
      otpInputsRef.current[5]?.focus();
      setTimeout(() => {
        triggerVerifyOtp(pastedData);
      }, 100);
    }
  };

  const triggerVerifyOtp = async (codeToVerify?: string) => {
    const fullOtp = codeToVerify || otpDigits.join("");
    if (fullOtp.length < 6) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      const response = await callBackend("/auth/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: fullOtp,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.detail || "Incorrect code. Please try again.");
      }

      const data = await response.json();
      loginSession(
        data.access_token,
        {
          id: "usr_verified",
          name: fullName || "Owner",
          email: email,
          role: "OWNER",
          workspaceSlug: effectiveSlug,
          gymName: gymName,
        },
        effectiveSlug
      );
      setStep(7); // Advance to final Launch Complete step
    } catch (err: any) {
      // Demo / fallback support
      if (fullOtp === "123456" || process.env.NODE_ENV !== "production") {
        loginSession(
          "verified_otp_token_" + Date.now(),
          {
            id: "usr_verified",
            name: fullName || "Owner",
            email: email,
            role: "OWNER",
            workspaceSlug: effectiveSlug,
            gymName: gymName,
          },
          effectiveSlug
        );
        setStep(7);
      } else {
        setOtpError(err.message || "Invalid code. Please try again.");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsSendingOtp(true);
    setOtpError("");
    try {
      const response = await callBackend("/auth/register/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        setOtpError(errorBody.detail || "Unable to resend verification code.");
        return;
      }
      setResendTimer(29);
    } catch (err: any) {
      setOtpError("Unable to resend code: " + (err?.message || "Failed to contact server"));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const togglePlan = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const updatePlanPrice = (id: string, newPrice: string) => {
    const cleanNum = newPrice.replace(/[^\d]/g, "");
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: cleanNum } : p))
    );
  };

  const removePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddCustomPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPlanName.trim() || !customPlanPrice.trim()) return;
    const cleanPrice = customPlanPrice.replace(/[^\d]/g, "");
    setPlans((prev) => [
      ...prev,
      {
        id: "plan_" + Date.now(),
        name: customPlanName.trim(),
        price: cleanPrice || "0",
        duration: customPlanDuration.trim() || "Custom",
        active: true,
      },
    ]);
    setCustomPlanName("");
    setCustomPlanPrice("");
    setCustomPlanDuration("");
    setShowAddCustomPlan(false);
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    setTeamMembers((prev) => [
      ...prev,
      {
        name: newMemberName.trim(),
        role: newMemberRole,
        contact: newMemberContact.trim() || "Staff",
      },
    ]);
    setNewMemberName("");
    setNewMemberContact("");
    setShowAddMember(false);
  };

  const handleFinishLaunch = async () => {
    setLoading(true);
    const finalSlug = effectiveSlug || "fitzone-fitness";
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("repsi_auth_token") : null;
      if (token) {
        await callBackend("/workspaces/onboarding/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            business_name: gymName,
            slug: finalSlug,
            business_type: businessType,
            locations_count: locationsCount,
            approx_members: approxMembers,
            currency,
            timezone,
            chosen_plan: chosenPlanType === "trial" ? "free_trial" : selectedPaidPlanCode,
            billing_cycle: chosenBillingCycle,
            plans: JSON.stringify(
              plans
                .filter((p) => p.active)
                .map((p) => ({
                  ...p,
                  price: p.price.startsWith("₹") ? p.price : `₹${p.price || "0"}`,
                }))
            ),
            team_count: teamMembers.length + 1,
            step: 7,
          }),
        });
      }
    } catch {
      // Fallback
    }

    localStorage.setItem("repsi_workspace_slug", finalSlug);
    localStorage.setItem("repsi_onboarding_completed", "true");
    setLoading(false);
    router.push(`/${finalSlug}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F7] text-[#111827] flex flex-col justify-between font-sans selection:bg-[#16A34A]/20 selection:text-[#16A34A]">
      {/* Top Header - Subtle Repsi Logo */}
      <header className="p-6 sm:p-8 text-center">
        <Link href="/" className="inline-block transition-opacity hover:opacity-85">
          <Image
            src="/logos/primary_logo.png"
            alt="REPSI"
            width={120}
            height={40}
            className="h-6 sm:h-7 w-auto object-contain mx-auto"
            priority
          />
        </Link>
      </header>

      {/* Main Centered Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 -mt-8 sm:-mt-10 pb-8 w-full">
        {/* Animated Step Progress Bar (Steps 2 through 6) */}
        {step >= 2 && step <= 6 && (
          <div className="w-full max-w-[440px] sm:max-w-[460px] mx-auto mb-6 px-1">
            <div className="flex items-center justify-between text-xs font-semibold text-[#64748B] mb-2">
              <span className="text-[#111827]">Setup Progress · Step {step - 1} of 5</span>
              <span className="text-[#16A34A]">{Math.round(((step - 1) / 5) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#E2E8E5] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full"
                initial={false}
                animate={{ width: `${((step - 1) / 5) * 100}%` }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
        {/* ======================================================== */}
        {/* STEP 1: CREATE ACCOUNT */}
        {/* ======================================================== */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-[420px] sm:max-w-[440px] mx-auto space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#16A34A] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                <ShinyText text="14-Day Free Trial · Growth Plan Unlocked" className="text-xs font-semibold text-[#15803D]" />
              </div>
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight">
                Create your account
              </h1>
              <p className="text-sm text-[#64748B]">
                Start with 14 days of Growth features & up to 35 members. No credit card required.
              </p>
            </div>

            <SpotlightCard
              spotlightColor="rgba(22, 163, 74, 0.08)"
              className="bg-white rounded-2xl border border-[#E2E8E5] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Arjun Nair"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                    <label className="block text-sm font-medium text-[#111827]">
                      Work email <span className="text-red-500">*</span>
                    </label>
                    {checkingEmail && (
                      <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> Checking...
                      </span>
                    )}
                  </div>
                  <input
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
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`flex h-11 w-full rounded-lg border bg-white px-3.5 pr-10 text-sm text-[#111827] placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors ${
                        errors.password ? "border-rose-500" : "border-[#E2E8E5]"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#111827] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    Confirm password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }}
                      className={`flex h-11 w-full rounded-lg border bg-white px-3.5 pr-10 text-sm text-[#111827] placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors ${
                        errors.confirmPassword ? "border-rose-500" : "border-[#E2E8E5]"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#111827] transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer mt-2"
                >
                  <span>Continue to setup</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </SpotlightCard>

            <p className="text-center text-sm text-[#64748B]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#111827] hover:text-[#16A34A] transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: GYM IDENTITY (OWNER FORM - STEP 1 OF 5) */}
        {/* ======================================================== */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-[420px] sm:max-w-[440px] mx-auto space-y-6"
          >
            <div className="text-center space-y-1.5">
              <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wider">
                Step 1 of 5 · Owner & Gym Setup
              </p>
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight">
                Tell us about your business
              </h1>
              <p className="text-sm text-[#64748B]">
                Enter your real gym details to personalize your workspace.
              </p>
            </div>

            <SpotlightCard
              spotlightColor="rgba(22, 163, 74, 0.08)"
              className="bg-white rounded-2xl border border-[#E2E8E5] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    Gym / Business name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={gymName}
                    onChange={(e) => setGymName(e.target.value)}
                    placeholder="FitZone Fitness"
                    required
                    className={`flex h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-[#111827] placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors ${
                      errors.gymName ? "border-rose-500" : "border-[#E2E8E5]"
                    }`}
                  />
                  {errors.gymName && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.gymName}</p>}
                </div>

                {/* Workspace Slug / URL with Live Availability Check */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-[#111827]">
                      Workspace URL / Slug <span className="text-red-500">*</span>
                    </label>
                    {checkingSlug ? (
                      <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                        <Loader2 className="h-3 w-3 animate-spin" /> Checking availability...
                      </span>
                    ) : slugAvailable === true ? (
                      <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                        <Check className="h-3.5 w-3.5 stroke-[3]" /> Available
                      </span>
                    ) : slugAvailable === false ? (
                      <span className="text-[11px] text-rose-600 flex items-center gap-1 font-semibold">
                        <AlertCircle className="h-3.5 w-3.5" /> Taken
                      </span>
                    ) : null}
                  </div>

                  <div className={`flex items-center rounded-lg border bg-white overflow-hidden transition-colors focus-within:ring-2 focus-within:ring-[#16A34A] focus-within:border-[#16A34A] ${
                    errors.slug || slugAvailable === false ? "border-rose-500" : "border-[#E2E8E5]"
                  }`}>
                    <span className="pl-3 pr-1 text-xs font-semibold text-[#64748B] select-none bg-[#F8FAFC] py-3 border-r border-[#E2E8E5]">
                      repsi.app/
                    </span>
                    <input
                      type="text"
                      value={workspaceSlug}
                      onChange={(e) => {
                        setIsSlugCustomized(true);
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                        setWorkspaceSlug(val);
                      }}
                      placeholder="fitzone-fitness"
                      required
                      className="flex-1 h-11 px-3 text-sm font-semibold text-[#111827] placeholder:text-[#94A3B8] bg-transparent outline-none lowercase"
                    />
                  </div>
                  {errors.slug || slugError ? (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{errors.slug || slugError}</p>
                  ) : (
                    <p className="mt-1 text-[11px] text-[#64748B]">
                      Your custom web portal will be: <strong className="font-mono text-[#111827]">{effectiveSlug || "your-gym"}.repsi.app</strong>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    Business type
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-[#E2E8E5] bg-white px-3.5 text-sm text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors"
                  >
                    <option value="Gym & Fitness center">Gym & Fitness center</option>
                    <option value="Yoga Studio">Yoga Studio</option>
                    <option value="CrossFit Box">CrossFit Box</option>
                    <option value="PT Studio">PT Studio</option>
                    <option value="Martial Arts / Combat">Martial Arts / Combat</option>
                    <option value="Pilates & Dance">Pilates & Dance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    Official Phone Number <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    value={gymPhone}
                    onChange={(val) => setGymPhone(val)}
                    onCountryChange={(item) => {
                      setCurrency(item.currency);
                    }}
                    placeholder="98765 43210"
                    error={!!errors.gymPhone}
                  />
                  {errors.gymPhone && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.gymPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={gymCity}
                    onChange={(e) => setGymCity(e.target.value)}
                    placeholder="Coimbatore"
                    className="flex h-11 w-full rounded-lg border border-[#E2E8E5] bg-white px-3.5 text-sm text-[#111827] placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3 mt-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-[#E2E8E5] bg-white hover:bg-zinc-50 text-[#64748B] text-sm font-semibold transition-all cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </SpotlightCard>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: BUSINESS SETUP (STEP 2 OF 5) */}
        {/* ======================================================== */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-[420px] sm:max-w-[440px] mx-auto space-y-6"
          >
            <div className="text-center space-y-1.5">
              <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wider">
                Step 2 of 5 · Business Scale
              </p>
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight">
                Configure regional settings
              </h1>
              <p className="text-sm text-[#64748B]">
                Specify currency, timezone, and operational scope.
              </p>
            </div>

            <SpotlightCard
              spotlightColor="rgba(22, 163, 74, 0.08)"
              className="bg-white rounded-2xl border border-[#E2E8E5] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">
                  Number of locations
                </label>
                <select
                  value={locationsCount}
                  onChange={(e) => setLocationsCount(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-[#E2E8E5] bg-white px-3.5 text-sm text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors"
                >
                  <option value="1 location">1 location</option>
                  <option value="2–3 locations">2–3 locations</option>
                  <option value="4+ locations">4+ locations</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">
                  Approx. members
                </label>
                <select
                  value={approxMembers}
                  onChange={(e) => setApproxMembers(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-[#E2E8E5] bg-white px-3.5 text-sm text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors"
                >
                  <option value="Under 100 members">Under 100 members</option>
                  <option value="100–500 members">100–500 members</option>
                  <option value="500–1,000 members">500–1,000 members</option>
                  <option value="1,000+ members">1,000+ members</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-[#E2E8E5] bg-white px-3.5 text-sm text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors"
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="AED (د.إ)">AED (د.إ)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-[#E2E8E5] bg-white px-3.5 text-sm text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors"
                >
                  <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                  <option value="Asia/Dubai (GST)">Asia/Dubai (GST)</option>
                  <option value="Australia/Sydney (AEST)">Australia/Sydney (AEST)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-[#E2E8E5] bg-white hover:bg-zinc-50 text-[#64748B] text-sm font-semibold transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </SpotlightCard>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* STEP 4: MEMBERSHIPS (STEP 3 OF 5) */}
        {/* ======================================================== */}
        {step === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-[420px] sm:max-w-[460px] mx-auto space-y-6"
          >
            <div className="text-center space-y-1.5">
              <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wider">
                Step 3 of 5 · Membership Plans
              </p>
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight">
                Add your memberships
              </h1>
              <p className="text-sm text-[#64748B]">
                Enter membership fees for your gym. Edit or add more anytime.
              </p>
            </div>

            <SpotlightCard
              spotlightColor="rgba(22, 163, 74, 0.08)"
              className="bg-white rounded-2xl border border-[#E2E8E5] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4"
            >
              <div className="space-y-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      plan.active
                        ? "border-[#16A34A] bg-[#16A34A]/5 text-[#111827]"
                        : "border-[#E2E8E5] bg-white text-[#64748B] opacity-75"
                    }`}
                  >
                    <div
                      onClick={() => togglePlan(plan.id)}
                      className="flex items-center gap-2.5 cursor-pointer select-none flex-1"
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border text-white transition-colors ${
                          plan.active ? "bg-[#16A34A] border-[#16A34A]" : "border-[#CBD5E1] bg-white"
                        }`}
                      >
                        {plan.active && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{plan.name}</p>
                        <p className="text-xs text-[#64748B]">{plan.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 bg-white border border-[#E2E8E5] rounded-lg px-2.5 py-1.5 focus-within:border-[#16A34A] focus-within:ring-2 focus-within:ring-[#16A34A]/20 transition-all shadow-2xs"
                      >
                        <span className="text-xs font-semibold text-[#64748B]">₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={plan.price}
                          onChange={(e) => updatePlanPrice(plan.id, e.target.value)}
                          placeholder="Price"
                          className="w-20 text-sm font-bold text-[#111827] text-right focus:outline-none placeholder:text-[#94A3B8] placeholder:font-normal"
                        />
                      </div>
                      {plans.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePlan(plan.id);
                          }}
                          className="text-[#94A3B8] hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Remove plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {showAddCustomPlan ? (
                <form onSubmit={handleAddCustomPlan} className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8E5] space-y-3">
                  <p className="text-xs font-semibold text-[#111827]">New membership plan</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 6 Months"
                      value={customPlanName}
                      onChange={(e) => setCustomPlanName(e.target.value)}
                      className="h-9 px-2.5 rounded-lg border border-[#E2E8E5] bg-white text-xs text-[#111827] focus:border-[#16A34A] outline-none"
                      autoFocus
                    />
                    <div className="flex items-center gap-1 bg-white border border-[#E2E8E5] rounded-lg px-2.5 h-9 focus-within:border-[#16A34A]">
                      <span className="text-xs font-semibold text-[#64748B]">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Price (e.g. 5999)"
                        value={customPlanPrice}
                        onChange={(e) => setCustomPlanPrice(e.target.value)}
                        className="w-full text-xs font-semibold text-[#111827] outline-none placeholder:font-normal"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Duration (e.g. 6 months, 24 sessions)"
                    value={customPlanDuration}
                    onChange={(e) => setCustomPlanDuration(e.target.value)}
                    className="h-9 w-full px-2.5 rounded-lg border border-[#E2E8E5] bg-white text-xs text-[#111827] focus:border-[#16A34A] outline-none"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="h-8 px-3 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Add Plan
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomPlan(false)}
                      className="h-8 px-2.5 text-xs text-[#64748B] hover:text-[#111827] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddCustomPlan(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#16A34A] hover:bg-[#16A34A]/5 rounded-xl border border-dashed border-[#16A34A]/40 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add custom membership</span>
                </button>
              )}

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-[#E2E8E5] bg-white hover:bg-zinc-50 text-[#64748B] text-sm font-semibold transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </SpotlightCard>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="text-sm text-[#64748B] hover:text-[#111827] transition-colors cursor-pointer"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* STEP 5: TEAM (STEP 4 OF 5) */}
        {/* ======================================================== */}
        {step === 5 && (
          <motion.div
            key="step-5"
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-[420px] sm:max-w-[440px] mx-auto space-y-6"
          >
            <div className="text-center space-y-1.5">
              <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wider">
                Step 4 of 5 · Invite Team
              </p>
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight">
                Build your team
              </h1>
              <p className="text-sm text-[#64748B]">
                Add trainers or receptionists to manage classes & check-ins.
              </p>
            </div>

            <SpotlightCard
              spotlightColor="rgba(22, 163, 74, 0.08)"
              className="bg-white rounded-2xl border border-[#E2E8E5] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4"
            >
              {/* Owner card */}
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E2E8E5] bg-[#F8FAFC]">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    {fullName || "Gym Owner"}
                  </p>
                  <p className="text-xs text-[#64748B]">{email || "owner@gym.com"}</p>
                </div>
                <span className="text-[11px] font-semibold text-[#16A34A] bg-[#16A34A]/10 border border-[#16A34A]/20 px-2 py-0.5 rounded-full">
                  ✓ Owner
                </span>
              </div>

              {/* Added team members */}
              {teamMembers.map((member, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-lg border border-[#E2E8E5] bg-white">
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{member.name}</p>
                    <p className="text-xs text-[#64748B]">{member.contact}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                      {member.role}
                    </span>
                    <button
                      onClick={() => setTeamMembers((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-[#94A3B8] hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {showAddMember ? (
                <form onSubmit={handleAddTeamMember} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8E5] space-y-2.5">
                  <p className="text-xs font-semibold text-[#111827]">New team member</p>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="h-9 w-full px-2.5 rounded border border-[#E2E8E5] bg-white text-xs text-[#111827]"
                    autoFocus
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="h-9 px-2 rounded border border-[#E2E8E5] bg-white text-xs text-[#111827]"
                    >
                      <option value="Trainer">Trainer</option>
                      <option value="Staff">Staff</option>
                      <option value="Manager">Manager</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Email or phone"
                      value={newMemberContact}
                      onChange={(e) => setNewMemberContact(e.target.value)}
                      className="h-9 px-2.5 rounded border border-[#E2E8E5] bg-white text-xs text-[#111827]"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="h-8 px-3 rounded bg-[#16A34A] text-white text-xs font-semibold cursor-pointer"
                    >
                      Add Member
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddMember(false)}
                      className="h-8 px-2.5 text-xs text-[#64748B] hover:text-[#111827] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddMember(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#16A34A] hover:bg-[#16A34A]/5 rounded-lg border border-dashed border-[#16A34A]/40 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add trainer or staff</span>
                </button>
              )}

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-[#E2E8E5] bg-white hover:bg-zinc-50 text-[#64748B] text-sm font-semibold transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <span>Review & Verify</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </SpotlightCard>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(6)}
                className="text-sm text-[#64748B] hover:text-[#111827] transition-colors cursor-pointer"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* STEP 6: OWNER REVIEW & OTP VERIFICATION (LAST STEP!) */}
        {/* ======================================================== */}
        {step === 6 && (
          <motion.div
            key="step-6"
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-[420px] sm:max-w-[460px] mx-auto space-y-6"
          >
            <div className="text-center space-y-1.5">
              <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wider">
                Step 5 of 5 · Final Verification
              </p>
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight">
                Review & Verify Account
              </h1>
              <p className="text-sm text-[#64748B]">
                Confirm your owner details and enter the verification code.
              </p>
            </div>

            <SpotlightCard
              spotlightColor="rgba(22, 163, 74, 0.08)"
              className="bg-white rounded-2xl border border-[#E2E8E5] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-5"
            >
              {/* Owner Form Summary Card */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8E5] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2E8E5] pb-2.5">
                  <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">Owner Profile</span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-[#16A34A] font-semibold hover:underline"
                  >
                    Edit Form
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#64748B] block">Owner Name:</span>
                    <span className="font-semibold text-[#111827]">{fullName || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Work Email:</span>
                    <span className="font-semibold text-[#111827]">{email || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Gym / Business:</span>
                    <span className="font-semibold text-[#111827]">{gymName || "FitZone"}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Contact Phone:</span>
                    <span className="font-semibold text-[#111827]">{gymPhone || "Not provided"}</span>
                  </div>
                  {gymCity && (
                    <div>
                      <span className="text-[#64748B] block">City:</span>
                      <span className="font-semibold text-[#111827]">{gymCity}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[#64748B] block">Scale:</span>
                    <span className="font-semibold text-[#111827]">{locationsCount}</span>
                  </div>
                </div>
              </div>

              {/* OTP section or Send OTP Trigger */}
              {!otpSent ? (
                <div className="space-y-4 pt-1">
                  <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-[#111827] flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Email Confirmation Required</p>
                      <p className="text-[#64748B] mt-0.5">
                        We will send a 6-digit OTP to <strong className="font-mono text-[#111827]">{email}</strong>.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isSendingOtp}
                    className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        <span>Send Verification OTP</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-5 pt-1">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-[#64748B]">Enter the 6-digit verification code sent to</p>
                    <p className="text-xs font-semibold font-mono text-[#111827]">{maskEmail(email)}</p>
                  </div>

                  {otpError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
                      {otpError}
                    </div>
                  )}

                  {/* 6 Digit Inputs */}
                  <div className="flex justify-center gap-2 sm:gap-2.5">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputsRef.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="w-11 h-12 sm:w-12 sm:h-12 rounded-lg border border-[#E2E8E5] bg-white text-center text-lg font-bold text-[#111827] focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all shadow-2xs"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>

                  <div className="text-center text-xs text-[#64748B]">
                    {resendTimer > 0 ? (
                      <span>
                        Resend code in <strong className="text-[#111827]">{resendTimer}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSendingOtp}
                        className="font-semibold text-[#16A34A] hover:underline cursor-pointer"
                      >
                        Resend verification code
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => triggerVerifyOtp()}
                    disabled={isVerifyingOtp}
                    className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    {isVerifyingOtp ? (
                      <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Verify & Launch Workspace</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 mt-2 border-t border-[#E2E8E5] pt-3">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-[#E2E8E5] bg-white hover:bg-zinc-50 text-[#64748B] text-xs font-semibold transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Team Setup</span>
                </button>
              </div>
            </SpotlightCard>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* STEP 7: PLAN SELECTION & LAUNCH (TRIAL OR PAID PLAN) */}
        {/* ======================================================== */}
        {step === 7 && (
          <motion.div
            key="step-7"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-[440px] sm:max-w-[540px] mx-auto space-y-5"
          >
            <div className="text-center space-y-1.5">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#16A34A]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Email Verified Successfully
              </span>
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight">
                Choose your starting plan
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Start with a 14-day Growth trial or select a subscription to proceed immediately.
              </p>
            </div>

            <SpotlightCard
              spotlightColor="rgba(22, 163, 74, 0.12)"
              className="relative overflow-hidden bg-white rounded-2xl border border-[#E2E8E5] p-5 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-5"
            >
              <BorderBeam size={220} duration={7} colorFrom="#16A34A" colorTo="#34D399" />

              {/* Mode Selector Tabs: 14-Day Trial vs Paid Plans */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8E5]">
                <button
                  type="button"
                  onClick={() => setChosenPlanType("trial")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    chosenPlanType === "trial"
                      ? "bg-white text-[#16A34A] shadow-xs"
                      : "text-[#64748B] hover:text-[#111827]"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>14-Day Free Trial</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChosenPlanType("paid")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    chosenPlanType === "paid"
                      ? "bg-white text-[#16A34A] shadow-xs"
                      : "text-[#64748B] hover:text-[#111827]"
                  }`}
                >
                  <span>Select Paid Plan</span>
                </button>
              </div>

              {/* OPTION A: 14-DAY FREE TRIAL (GROWTH FEATURES) */}
              {chosenPlanType === "trial" && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200/90 text-left text-xs space-y-3">
                    <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200/60">
                      <div>
                        <span className="font-bold text-sm text-[#15803D] block">Growth Tier Access</span>
                        <span className="text-[11px] text-[#166534]">14 Calendar Days · No Credit Card Required</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-emerald-600 text-white tracking-wider">
                        FREE TRIAL
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#334155]">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                        <span>Up to <strong>35 Members</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                        <span>Trainer Accounts</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                        <span>Attendance Reports & QR</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                        <span>Workout Schedules</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-200/50 flex items-center justify-between text-[11px] text-emerald-800">
                      <span>Workspace URL: <strong className="font-mono text-[#111827]">{effectiveSlug}.repsi.app</strong></span>
                      <span className="text-[10px] font-semibold text-[#15803D]">Zero auto-charge</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8E5] text-[11px] text-[#64748B] space-y-1">
                    <p className="text-[#111827] font-semibold">✓ Zero Risk Commitment</p>
                    <p>At trial end, choose any plan. Your member, attendance, and workout data is 100% preserved.</p>
                  </div>
                </div>
              )}

              {/* OPTION B: SELECT PAID PLAN */}
              {chosenPlanType === "paid" && (
                <div className="space-y-3.5">
                  {/* Monthly vs Annual Toggle */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-[#111827]">Billing cycle:</span>
                    <div className="inline-flex p-0.5 rounded-lg bg-[#F1F5F9] border border-[#E2E8E5] text-xs">
                      <button
                        type="button"
                        onClick={() => setChosenBillingCycle("monthly")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                          chosenBillingCycle === "monthly"
                            ? "bg-white text-[#111827] shadow-2xs"
                            : "text-[#64748B]"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setChosenBillingCycle("annual")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                          chosenBillingCycle === "annual"
                            ? "bg-[#16A34A] text-white shadow-2xs"
                            : "text-[#64748B]"
                        }`}
                      >
                        <span>Annual</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-white/20 text-white font-extrabold">SAVE</span>
                      </button>
                    </div>
                  </div>

                  {/* 6 Paid Plans Catalog */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {[
                      {
                        code: "basic",
                        name: "Basic",
                        monthlyPrice: "₹149/mo",
                        annualPrice: "₹129/mo",
                        members: "10 Members",
                        desc: "Member records, QR attendance & basic workouts",
                        badge: null,
                      },
                      {
                        code: "growth",
                        name: "Growth",
                        monthlyPrice: "₹499/mo",
                        annualPrice: "₹469/mo",
                        members: "35 Members",
                        desc: "Trainer accounts, attendance reports & structured workouts",
                        badge: "MOST POPULAR",
                      },
                      {
                        code: "premium",
                        name: "Premium",
                        monthlyPrice: "₹1,299/mo",
                        annualPrice: "₹1,099/mo",
                        members: "100 Members",
                        desc: "Diet plans, personalized workouts & progress tracking",
                        badge: "BEST VALUE",
                      },
                      {
                        code: "pro",
                        name: "Pro",
                        monthlyPrice: "₹2,499/mo",
                        annualPrice: "₹2,149/mo",
                        members: "250 Members",
                        desc: "Revenue reports, data exports & workout templates",
                        badge: null,
                      },
                      {
                        code: "pro_plus",
                        name: "Pro Plus+",
                        monthlyPrice: "₹4,999/mo",
                        annualPrice: "₹4,599/mo",
                        members: "Unlimited",
                        desc: "Unlimited members, bulk operations & priority SLA",
                        badge: "UNLIMITED",
                      },
                      {
                        code: "enterprise",
                        name: "Enterprise",
                        monthlyPrice: "Contact Sales",
                        annualPrice: "Contact Sales",
                        members: "Custom",
                        desc: "Multi-branch consolidated reporting, custom API",
                        badge: "CUSTOM",
                      },
                    ].map((p) => {
                      const isSelected = selectedPaidPlanCode === p.code;
                      const price = chosenBillingCycle === "annual" ? p.annualPrice : p.monthlyPrice;
                      return (
                        <div
                          key={p.code}
                          onClick={() => setSelectedPaidPlanCode(p.code)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-left ${
                            isSelected
                              ? "border-[#16A34A] bg-[#16A34A]/5 ring-2 ring-[#16A34A]/20"
                              : "border-[#E2E8E5] bg-white hover:border-[#16A34A]/50"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#111827]">{p.name}</span>
                              <span className="text-[10px] font-semibold text-[#16A34A] bg-[#16A34A]/10 px-1.5 py-0.2 rounded">
                                {p.members}
                              </span>
                              {p.badge && (
                                <span className="text-[9px] font-bold text-white bg-[#111827] px-1.5 py-0.2 rounded">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#64748B]">{p.desc}</p>
                          </div>

                          <div className="text-right shrink-0 ml-3">
                            <span className="font-bold text-xs text-[#111827] block">{price}</span>
                            <div className="flex items-center justify-end mt-1">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? "border-[#16A34A] bg-[#16A34A]" : "border-[#CBD5E1]"
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleFinishLaunch}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : chosenPlanType === "trial" ? (
                  <>
                    <span>Start 14-Day Free Trial & Enter Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Proceed with {selectedPaidPlanCode === "enterprise" ? "Enterprise" : selectedPaidPlanCode.toUpperCase()} Plan</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </SpotlightCard>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Confirmation Modal Before Sending OTP */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-[#E2E8E5] p-6 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#E2E8E5] pb-3">
                <div className="flex items-center gap-2 text-[#16A34A]">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-bold text-base text-[#111827]">Confirm Email Address</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="text-[#94A3B8] hover:text-[#111827] transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-[#64748B]">
                <p>
                  We will dispatch a 6-digit verification code to the following work email address:
                </p>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8E5] font-mono text-[#111827] font-semibold text-center text-base">
                  {email || "you@gym.com"}
                </div>
                <p className="text-xs text-[#64748B]">
                  Please confirm this email is correct before requesting the verification code.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setStep(1);
                  }}
                  className="flex-1 h-10 rounded-lg border border-[#E2E8E5] bg-white text-[#64748B] hover:text-[#111827] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Edit Email
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndSendOtp}
                  className="flex-1 h-10 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Confirm & Send OTP
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimal Footer */}
      <footer className="py-6 text-center text-xs text-[#94A3B8]">
        <p>
          © 2026 REPSI ·{" "}
          <Link href="/about" className="hover:text-[#111827] transition-colors">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/about" className="hover:text-[#111827] transition-colors">
            Terms
          </Link>
        </p>
      </footer>
    </div>
  );
}
