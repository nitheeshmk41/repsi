"use client";

import { useState } from "react";
import { X } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { MembershipPlanName } from "@/types";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: AddMemberFormData) => void;
}

interface AddMemberFormData {
  name: string;
  email: string;
  phone: string;
  plan: MembershipPlanName;
  startDate: string;
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
      <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--text)]">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
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
    phone: "",
    plan: "Monthly",
    startDate: today,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AddMemberFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    onSubmit?.(form);
    onOpenChange(false);
    // Reset
    setForm({ name: "", email: "", phone: "", plan: "Monthly", startDate: today });
    setErrors({});
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Register a new member. They&apos;ll receive a welcome notification once added.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <FormField label="Full name" htmlFor="member-name" error={errors.name}>
            <Input
              id="member-name"
              placeholder="Arjun Nair"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={errors.name ? "border-[var(--error)]" : ""}
              autoFocus
            />
          </FormField>

          {/* Email */}
          <FormField label="Email address" htmlFor="member-email" error={errors.email}>
            <Input
              id="member-email"
              type="email"
              placeholder="arjun@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={errors.email ? "border-[var(--error)]" : ""}
            />
          </FormField>

          {/* Phone */}
          <FormField label="Phone number" htmlFor="member-phone" error={errors.phone}>
            <Input
              id="member-phone"
              type="tel"
              placeholder="+91 98400 12345"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className={errors.phone ? "border-[var(--error)]" : ""}
            />
          </FormField>

          {/* Plan */}
          <FormField label="Membership plan" htmlFor="member-plan">
            <div className="grid grid-cols-2 gap-2">
              {plans.map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, plan }))}
                  className={cn(
                    "flex flex-col items-start rounded-[8px] border p-3 text-left transition-all duration-150",
                    form.plan === plan
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      form.plan === plan
                        ? "text-[var(--primary-dark)] dark:text-[var(--primary-hover)]"
                        : "text-[var(--text)]"
                    )}
                  >
                    {plan}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] tabular-nums">
                    ₹{planPrices[plan].toLocaleString("en-IN")}
                  </span>
                </button>
              ))}
            </div>
          </FormField>

          {/* Start Date */}
          <FormField label="Start date" htmlFor="member-start-date">
            <Input
              id="member-start-date"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            />
          </FormField>

          <DialogFooter className="mt-2 pt-2 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
