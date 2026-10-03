"use client";

import { useState, useEffect } from "react";
import { UserCheck, Sparkles, CheckCircle2, Eye, EyeOff } from "lucide-react";
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
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import { repsiApi } from "@/lib/api";
import type { MembershipPlanName } from "@/types";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: AddMemberFormData) => void;
}

export interface AddMemberFormData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  plan: MembershipPlanName;
  startDate: string;
  useExistingUser?: boolean;
}

const plans: MembershipPlanName[] = ["Monthly", "Quarterly", "Annual", "Day Pass"];

const planPrices: Record<MembershipPlanName, number> = {
  Monthly: 2500,
  Quarterly: 6500,
  Annual: 18000,
  "Day Pass": 200,
};

function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
        {label}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mt-0.5">{error}</p>}
    </div>
  );
}

export function AddMemberDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddMemberDialogProps) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState<AddMemberFormData>({
    name: "",
    email: "",
    phone: "+91 ",
    password: "",
    plan: "Monthly",
    startDate: today,
    useExistingUser: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AddMemberFormData | "dbEmail" | "dbPhone", string>>>({});
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);

  // Check email onBlur
  const handleCheckEmail = async () => {
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return;
    setCheckingEmail(true);
    try {
      const res = await repsiApi.checkAvailability({ email: form.email.trim() });
      if (res.email_exists) {
        setErrors((prev) => ({ ...prev, email: "⚠️ Email address is already registered" }));
      } else {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.email;
          return updated;
        });
      }
    } catch {
      // Ignore
    } finally {
      setCheckingEmail(false);
    }
  };

  // Check phone onBlur
  const handleCheckPhone = async () => {
    if (!form.phone.trim()) return;
    setCheckingPhone(true);
    try {
      const res = await repsiApi.checkAvailability({ phone: form.phone.trim() });
      if (res.phone_exists) {
        setErrors((prev) => ({ ...prev, phone: "⚠️ Mobile number is already registered" }));
      } else {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.phone;
          return updated;
        });
      }
    } catch {
      // Ignore
    } finally {
      setCheckingPhone(false);
    }
  };

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email address is mandatory";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return !newErrors.name && !newErrors.email;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await onSubmit?.(form);
      setLoading(false);
      onOpenChange(false);
      setForm({ name: "", email: "", phone: "+91 ", password: "", plan: "Monthly", startDate: today, useExistingUser: false });
      setErrors({});
    } catch (err: any) {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        email: err?.message || "Failed to create member",
      }));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-extrabold text-slate-900 dark:text-white">Add New Member</DialogTitle>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Direct Active
            </span>
          </div>
          <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            This member will be added to your gym database and set to <strong>Active</strong> immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Full Name */}
          <FormField label="Full Name *" htmlFor="member-name" error={errors.name}>
            <Input
              id="member-name"
              placeholder="e.g. Rahul Kumar"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={cn("rounded-xl h-10 text-sm", errors.name ? "border-rose-500 focus:ring-rose-500" : "")}
              autoFocus
            />
          </FormField>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField label="Email Address *" htmlFor="member-email" error={errors.email}>
              <div className="relative">
                <Input
                  id="member-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onBlur={handleCheckEmail}
                  className={cn("rounded-xl h-10 text-sm", errors.email ? "border-rose-500 focus:ring-rose-500" : "")}
                />
                {checkingEmail && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 animate-pulse">Checking...</span>
                )}
              </div>
            </FormField>

            <FormField label="Mobile Number" htmlFor="member-phone" error={errors.phone}>
              <PhoneInput
                id="member-phone"
                value={form.phone}
                onChange={(val) => setForm((f) => ({ ...f, phone: val }))}
                onBlur={handleCheckPhone}
              />
              {checkingPhone && (
                <span className="text-[10px] text-slate-400 animate-pulse">Checking number...</span>
              )}
            </FormField>
          </div>

          {/* Login Password */}
          <FormField label="Login Password (Optional)" htmlFor="member-password">
            <div className="relative">
              <Input
                id="member-password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 chars (Auto-generated if blank)"
                value={form.password || ""}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="rounded-xl h-10 pr-10 text-sm border-[#D5DDD7] dark:border-zinc-800 focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          {/* Membership Plan */}
          <FormField label="Membership Plan" htmlFor="member-plan">
            <div className="grid grid-cols-2 gap-2.5">
              {plans.map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, plan }))}
                  className={cn(
                    "flex flex-col items-start rounded-xl border p-3 text-left transition-all duration-150 cursor-pointer",
                    form.plan === plan
                      ? "border-[#16A34A] bg-[#F0FDF4] dark:bg-emerald-950/60 shadow-2xs"
                      : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-bold",
                      form.plan === plan
                        ? "text-[#15803D] dark:text-emerald-400"
                        : "text-slate-800 dark:text-zinc-200"
                    )}
                  >
                    {plan}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 tabular-nums mt-0.5">
                    ₹{planPrices[plan].toLocaleString("en-IN")}
                  </span>
                </button>
              ))}
            </div>
          </FormField>

          {/* Start Date */}
          <FormField label="Start Date" htmlFor="member-start-date">
            <Input
              id="member-start-date"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              className="rounded-xl h-10 text-sm"
            />
          </FormField>

          <DialogFooter className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-xl text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl font-bold shadow-sm transition-all active:scale-[0.99] cursor-pointer">
              <UserCheck className="w-4 h-4" />
              {loading ? "Adding Member..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
