"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { RepsiMascot } from "@/components/ui/repsi-mascot";

export type BillingCycle = "monthly" | "annual";
export type Currency = "INR" | "USD";

export default function FullPricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");
  const [currency, setCurrency] = useState<Currency>("INR");

  const plans = [
    {
      id: "free_trial",
      name: "Free Trial",
      description: "For testing Repsi features before committing",
      badge: "14 DAYS FREE",
      highlight: false,
      ctaText: "Start Free Trial",
      memberLimit: "5 Members",
      trainerLimit: "1 Trainer",
      branchLimit: "1 Branch",
      pricing: {
        INR: {
          monthly: { displayPrice: "₹0", period: "/ 14 days", billedText: "14-day full access", savings: null },
          annual: { displayPrice: "₹0", period: "/ 14 days", billedText: "14-day full access", savings: null },
        },
        USD: {
          monthly: { displayPrice: "$0", period: "/ 14 days", billedText: "14-day full access", savings: null },
          annual: { displayPrice: "$0", period: "/ 14 days", billedText: "14-day full access", savings: null },
        },
      },
      keyFeatures: [
        "14-day complete platform trial",
        "No credit card required to start",
        "Member management setup",
        "Web dashboard access",
        "Preserve data when upgrading",
      ],
    },
    {
      id: "starter",
      name: "Starter",
      description: "For gyms just getting started with basic ops",
      badge: null,
      highlight: false,
      ctaText: "Start with Starter",
      memberLimit: "5 Active Members",
      trainerLimit: "1 Trainer",
      branchLimit: "1 Branch",
      pricing: {
        INR: {
          monthly: { displayPrice: "₹129", period: "/month", billedText: "Billed monthly", savings: null },
          annual: { displayPrice: "₹109", period: "/month", billedText: "Billed ₹1,308/year", savings: "Save ₹240/year" },
        },
        USD: {
          monthly: { displayPrice: "$1.99", period: "/month", billedText: "Billed monthly", savings: null },
          annual: { displayPrice: "$1.69", period: "/month", billedText: "Billed $20.28/year", savings: "Save $3.60/year" },
        },
      },
      keyFeatures: [
        "Up to 5 active members",
        "1 trainer account",
        "1 gym location / branch",
        "Web access & dashboard",
        "Basic gym management",
        "Membership plans & tracking",
      ],
    },
    {
      id: "basic",
      name: "Basic",
      description: "For small gyms building their core operations",
      badge: null,
      highlight: false,
      ctaText: "Choose Basic",
      memberLimit: "40 Active Members",
      trainerLimit: "3 Trainers",
      branchLimit: "1 Branch",
      pricing: {
        INR: {
          monthly: { displayPrice: "₹499", period: "/month", billedText: "Billed monthly", savings: null },
          annual: { displayPrice: "₹449", period: "/month", billedText: "Billed ₹5,388/year", savings: "Save ₹600/year" },
        },
        USD: {
          monthly: { displayPrice: "$5.99", period: "/month", billedText: "Billed monthly", savings: null },
          annual: { displayPrice: "$5.49", period: "/month", billedText: "Billed $65.88/year", savings: "Save $6.00/year" },
        },
      },
      keyFeatures: [
        "Up to 40 active members",
        "3 trainer accounts",
        "Attendance & QR check-in",
        "Payment tracking & receipts",
        "Membership expiry tracking",
        "Basic reports & dashboard",
        "Lead management & alerts",
      ],
    },
    {
      id: "growth",
      name: "Growth",
      description: "For growing gyms scaling sales & engagement",
      badge: "MOST POPULAR",
      highlight: true,
      ctaText: "Choose Growth",
      memberLimit: "100 Active Members",
      trainerLimit: "5 Trainers",
      branchLimit: "1 Branch",
      pricing: {
        INR: {
          monthly: { displayPrice: "₹1,299", period: "/month", billedText: "Billed monthly", savings: null },
          annual: { displayPrice: "₹1,099", period: "/month", billedText: "Billed ₹13,188/year", savings: "Save ₹2,400/year" },
        },
        USD: {
          monthly: { displayPrice: "$14.99", period: "/month", billedText: "Billed monthly", savings: null },
          annual: { displayPrice: "$12.99", period: "/month", billedText: "Billed $155.88/year", savings: "Save $24/year" },
        },
      },
      keyFeatures: [
        "Up to 100 active members",
        "5 trainer accounts",
        "Member Mobile App (iOS & Android)",
        "Trainer Mobile App",
        "Push notifications & alerts",
        "Workout plans & progress tracking",
        "Sales CRM & lead pipeline",
        "Google Fit integration",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      description: "For established gyms needing unlimited members",
      badge: "UNLIMITED MEMBERS",
      highlight: false,
      ctaText: "Choose Pro",
      memberLimit: "Unlimited Members",
      trainerLimit: "10 Trainers",
      branchLimit: "1 Branch",
      pricing: {
        INR: {
          monthly: { displayPrice: "₹2,499", period: "/month", billedText: "Billed monthly", savings: null },
          annual: { displayPrice: "₹2,199", period: "/month", billedText: "Billed ₹26,388/year", savings: "Save ₹3,600/year" },
        },
        USD: {
          monthly: { displayPrice: "$29.99", period: "/month", billedText: "Billed monthly", savings: null },
          annual: { displayPrice: "$26.99", period: "/month", billedText: "Billed $323.88/year", savings: "Save $36/year" },
        },
      },
      keyFeatures: [
        "Unlimited active members",
        "10 trainer accounts",
        "Advanced revenue & retention analytics",
        "Trainer performance metrics",
        "Automated campaigns & workflows",
        "Custom reports & CSV data export",
        "Granular staff permissions",
        "Priority 24/7 dedicated support",
      ],
    },
    {
      id: "business",
      name: "Business",
      description: "For multi-branch fitness businesses & chains",
      badge: "MULTI-BRANCH",
      highlight: false,
      ctaText: "Choose Business",
      memberLimit: "Unlimited Members",
      trainerLimit: "Unlimited Trainers",
      branchLimit: "Multiple Branches",
      pricing: {
        INR: {
          monthly: { displayPrice: "₹4,999", period: "/month", billedText: "Billed monthly", savings: null },
          annual: { displayPrice: "₹4,499", period: "/month", billedText: "Billed ₹53,988/year", savings: "Save ₹6,000/year" },
        },
        USD: {
          monthly: { displayPrice: "$59.99", period: "/month", billedText: "Billed monthly", savings: null },
          annual: { displayPrice: "$52.99", period: "/month", billedText: "Billed $635.88/year", savings: "Save $84/year" },
        },
      },
      keyFeatures: [
        "Unlimited members & trainers",
        "Multi-branch management & switch",
        "Branch-wise revenue & staff reports",
        "Centralized member database",
        "Franchise view & owner hierarchy",
        "REST API access & webhooks",
        "Custom branding & white-label",
        "Dedicated onboarding & audit logs",
      ],
    },
  ];

  const row1Plans = plans.slice(0, 4); // Free Trial, Starter, Basic, Growth
  const row2Plans = plans.slice(4, 6); // Pro, Business

  const comparisonCategories = [
    {
      name: "CATEGORY 1 — CORE MANAGEMENT",
      rows: [
        { name: "Member management & profiles", starter: "✓", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Trainer management", starter: "1 Trainer", basic: "3 Trainers", growth: "5 Trainers", pro: "10 Trainers", business: "Unlimited" },
        { name: "Staff management", starter: "Basic", basic: "✓", growth: "✓", pro: "Advanced", business: "Advanced" },
        { name: "Gym profile & location setup", starter: "✓", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Membership plans & pricing", starter: "✓", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Membership expiry tracking", starter: "✓", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Search & multi-filter", starter: "✓", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Member notes & history", starter: "Basic", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
      ],
    },
    {
      name: "CATEGORY 2 — ATTENDANCE",
      rows: [
        { name: "Manual attendance check-in", starter: "✓", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "QR code mobile attendance", starter: "—", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Attendance history logs", starter: "7 days", basic: "90 days", growth: "1 Year", pro: "Unlimited", business: "Unlimited" },
        { name: "Auto checkout at gym closing", starter: "—", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Attendance reports & export", starter: "Basic", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Attendance peak hour analytics", starter: "—", basic: "—", growth: "✓", pro: "✓", business: "✓" },
      ],
    },
    {
      name: "CATEGORY 3 — PAYMENTS & BILLING",
      rows: [
        { name: "Payment tracking & logging", starter: "✓", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "GST Invoice & receipt generation", starter: "✓", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Automated payment reminders", starter: "—", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Revenue dashboard", starter: "Basic", basic: "✓", growth: "Advanced", pro: "Advanced", business: "Multi-branch" },
        { name: "Cashfree / Online payment gateway", starter: "—", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
      ],
    },
    {
      name: "CATEGORY 4 — TRAINER MODULE",
      rows: [
        { name: "Trainer profiles & schedules", starter: "1 Trainer", basic: "3 Trainers", growth: "5 Trainers", pro: "10 Trainers", business: "Unlimited" },
        { name: "Trainer → Client assignment", starter: "—", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Workout plan builder", starter: "—", basic: "—", growth: "✓", pro: "✓", business: "✓" },
        { name: "Client progress tracking", starter: "—", basic: "—", growth: "✓", pro: "✓", business: "✓" },
        { name: "Trainer performance analytics", starter: "—", basic: "—", growth: "Basic", pro: "Advanced", business: "Advanced" },
      ],
    },
    {
      name: "CATEGORY 5 — MOBILE APPS",
      rows: [
        { name: "Member Mobile App (iOS & Android)", starter: "—", basic: "—", growth: "✓ Included", pro: "✓ Included", business: "✓ Included" },
        { name: "Trainer Mobile App", starter: "—", basic: "—", growth: "✓ Included", pro: "✓ Included", business: "✓ Included" },
        { name: "Push notifications to members", starter: "—", basic: "—", growth: "✓ Included", pro: "✓ Included", business: "✓ Included" },
        { name: "Mobile attendance check-in", starter: "—", basic: "—", growth: "✓ Included", pro: "✓ Included", business: "✓ Included" },
      ],
    },
    {
      name: "CATEGORY 6 — SALES CRM & LEADS",
      rows: [
        { name: "Lead capture & inquiry list", starter: "—", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Sales Kanban Pipeline", starter: "—", basic: "—", growth: "✓", pro: "✓", business: "✓" },
        { name: "Follow-up schedule & call logs", starter: "—", basic: "—", growth: "✓", pro: "✓", business: "✓" },
        { name: "Lead conversion analytics", starter: "—", basic: "—", growth: "✓", pro: "✓", business: "✓" },
      ],
    },
    {
      name: "CATEGORY 7 — AUTOMATION & MESSAGING",
      rows: [
        { name: "Expiry & renewal alerts", starter: "Basic", basic: "✓", growth: "Automated", pro: "Automated", business: "Automated" },
        { name: "WhatsApp & SMS notification triggers", starter: "—", basic: "—", growth: "✓", pro: "✓", business: "✓" },
        { name: "Automated drip campaigns", starter: "—", basic: "—", growth: "—", pro: "✓", business: "✓" },
      ],
    },
    {
      name: "CATEGORY 8 — ANALYTICS & REPORTS",
      rows: [
        { name: "Basic business dashboard", starter: "✓", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "Member retention radar", starter: "—", basic: "—", growth: "✓", pro: "✓", business: "✓" },
        { name: "Revenue forecasting & trends", starter: "—", basic: "—", growth: "Basic", pro: "Advanced", business: "Advanced" },
        { name: "CSV & Excel Data Export", starter: "—", basic: "—", growth: "✓", pro: "✓", business: "✓" },
      ],
    },
    {
      name: "CATEGORY 9 — BUSINESS & MULTI-BRANCH",
      rows: [
        { name: "Multiple branch locations", starter: "1 Location", basic: "1 Location", growth: "1 Location", pro: "1 Location", business: "Unlimited" },
        { name: "Branch-wise revenue dashboards", starter: "—", basic: "—", growth: "—", pro: "—", business: "✓" },
        { name: "Centralized member database", starter: "—", basic: "—", growth: "—", pro: "—", business: "✓" },
        { name: "Franchise view & owner hierarchy", starter: "—", basic: "—", growth: "—", pro: "—", business: "✓" },
        { name: "Audit log history", starter: "—", basic: "—", growth: "—", pro: "—", business: "✓" },
      ],
    },
    {
      name: "CATEGORY 10 — INTEGRATIONS & API",
      rows: [
        { name: "Google Fit integration", starter: "—", basic: "—", growth: "✓", pro: "✓", business: "✓" },
        { name: "Cashfree payment integration", starter: "—", basic: "✓", growth: "✓", pro: "✓", business: "✓" },
        { name: "REST API & Webhook access", starter: "—", basic: "—", growth: "—", pro: "—", business: "✓" },
        { name: "Custom domain (yourgym.com)", starter: "—", basic: "—", growth: "—", pro: "✓", business: "✓" },
      ],
    },
    {
      name: "CATEGORY 11 — SUPPORT & ONBOARDING",
      rows: [
        { name: "Support level", starter: "Standard", basic: "Standard", growth: "Priority", pro: "Priority 24/7", business: "Dedicated Concierge" },
        { name: "Data migration assistance", starter: "Self-serve", basic: "Assisted", growth: "Full Migration", pro: "Full Migration", business: "White-glove Concierge" },
      ],
    },
  ];

  const faqs = [
    {
      q: "What happens after the 14-day free trial?",
      a: "Your trial gives you complete 14-day access to Repsi. At the end of the trial, you can select the Starter, Basic, Growth, Pro, or Business plan that best fits your gym. Your data is preserved safely.",
    },
    {
      q: "Can I change plans or upgrade later?",
      a: "Yes! You can upgrade or switch plans anytime directly from your Gym Owner Billing dashboard. Upgrades take effect immediately with prorated billing.",
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes. Repsi operates on a monthly or annual commitment with zero cancellation penalties. You can cancel from settings at any time.",
    },
    {
      q: "What happens when I reach my member limit?",
      a: "When your gym reaches 80% of your plan's member limit, we send a helpful notification. At 100%, you can easily upgrade to the next tier with one click to continue adding members without interrupting operations.",
    },
    {
      q: "What counts as an active member?",
      a: "An active member is any individual registered with a current active or valid gym membership in your workspace. Expired or archived members do not count towards active limits.",
    },
    {
      q: "Can I upgrade from monthly to yearly billing?",
      a: "Yes! Switching to annual billing saves up to ~20% across all tiers. You can toggle between monthly and annual anytime.",
    },
    {
      q: "What happens to my data if I downgrade?",
      a: "Repsi never deletes your member records, attendance history, or financial data automatically upon downgrade. If your active members exceed the lower plan's limit, you will be prompted to manage active statuses before switching.",
    },
    {
      q: "Does every plan include the mobile apps?",
      a: "Member and Trainer mobile apps (iOS & Android) are included starting from the Growth plan ($14.99/mo / ₹1,299/mo) and above.",
    },
    {
      q: "Do you support multiple branches or franchises?",
      a: "Yes. The Business plan provides full multi-branch management, branch-wise dashboards, owner hierarchy, and centralized database control.",
    },
    {
      q: "Are taxes included in the displayed pricing?",
      a: "Displayed pricing excludes local taxes/GST where applicable. Exact tax breakdowns are detailed on your official tax invoice during Cashfree checkout.",
    },
    {
      q: "How does payment processing work?",
      a: "Payments are processed securely via Cashfree Subscriptions with 256-bit SSL encryption. We support Credit/Debit Cards, UPI AutoPay, NetBanking, and Wallet mandates.",
    },
    {
      q: "Is my gym data secure and exportable?",
      a: "Yes! All gym data is encrypted in transit and at rest. You can export complete member, attendance, and revenue data as CSV or Excel at any time.",
    },
  ];

  const renderPricingCard = (p: typeof plans[0]) => {
    const pricingInfo = p.pricing[currency][billingCycle];
    const isGrowth = p.id === "growth";
    const isPro = p.id === "pro";
    const isBusiness = p.id === "business";

    const cardStyle = isGrowth
      ? "bg-[var(--surface)] border-2 border-[#16A34A] shadow-lg ring-4 ring-[#16A34A]/10 bg-gradient-to-b from-[#16A34A]/5 via-transparent to-transparent z-10"
      : isPro
      ? "bg-[var(--surface)] border border-indigo-500/30 hover:border-indigo-500/60 shadow-xs hover:shadow-md"
      : isBusiness
      ? "bg-[var(--surface)] border border-slate-700/60 hover:border-slate-500 shadow-xs hover:shadow-md"
      : "bg-[var(--surface)] border border-[var(--border)] shadow-xs hover:shadow-md opacity-95 hover:opacity-100";

    return (
      <div
        key={p.id}
        className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all duration-200 h-full hover:-translate-y-1 ${cardStyle}`}
      >
        <div>
          {/* 1. Reserved Badge Slot - Keeps ALL 6 Cards 100% Aligned Vertically */}
          <div className="h-7 mb-2 flex items-center justify-center">
            {p.badge ? (
              <span
                className={`px-3 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase shadow-2xs ${
                  isGrowth
                    ? "bg-[#16A34A] text-white shadow-[#16A34A]/20"
                    : isPro
                    ? "bg-indigo-600 text-white"
                    : isBusiness
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {p.badge}
              </span>
            ) : (
              <div className="h-7" />
            )}
          </div>

          {/* 2. Plan Name & 3. Short Description */}
          <div className="space-y-1 mb-4">
            <h3 className="text-xl font-black text-[var(--text)] tracking-tight">{p.name}</h3>
            <p className="text-xs font-medium text-[var(--text-muted)] line-clamp-2 min-h-[36px]">
              {p.description}
            </p>
          </div>

          {/* 4. Price & 5. Billing Text & 6. Savings Indicator */}
          <div className="py-4 border-y border-[var(--border)] my-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
                {pricingInfo.displayPrice}
              </span>
              <span className="text-xs font-semibold text-[var(--text-muted)]">{pricingInfo.period}</span>
            </div>

            <div className="mt-2 space-y-0.5">
              <p className="text-[11px] font-semibold text-[var(--text-muted)] min-h-[16px]">
                {pricingInfo.billedText}
              </p>
              {/* Savings text ONLY shown when annual billing is active */}
              <p className="text-[11px] font-bold text-[#16A34A] min-h-[16px]">
                {billingCycle === "annual" && pricingInfo.savings ? pricingInfo.savings : ""}
              </p>
            </div>
          </div>

          {/* 7. Usage Limits Box */}
          <div className="p-3 rounded-xl bg-[var(--surface-secondary)]/50 border border-[var(--border)]/60 text-xs space-y-1.5 font-sans mb-6">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[var(--text-muted)]">Members</span>
              <span className="font-mono font-bold text-[var(--text)]">{p.memberLimit}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[var(--text-muted)]">Trainers</span>
              <span className="font-mono font-bold text-[var(--text)]">{p.trainerLimit}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[var(--text-muted)]">Branches</span>
              <span className="font-mono font-bold text-[var(--text)]">{p.branchLimit}</span>
            </div>
          </div>

          {/* 8. Feature List */}
          <div className="space-y-2.5 mb-6 text-xs text-[var(--text-secondary)]">
            {p.keyFeatures.map((feat, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span className={i === 0 ? "font-bold text-[var(--text)]" : ""}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 9. CTA Button */}
        <div className="pt-4 mt-auto">
          <Link
            href={`/signup?plan=${p.id}&billing=${billingCycle}`}
            className={`w-full h-11 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
              isGrowth
                ? "bg-[#16A34A] hover:bg-[#15803D] text-white shadow-md shadow-[#16A34A]/20"
                : "bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)]"
            }`}
          >
            <span>{p.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] selection:bg-[#16A34A] selection:text-white flex flex-col font-sans">
      <MarketingNav />

      <main className="flex-1 pb-24">
        {/* HERO SECTION */}
        <section className="pt-24 pb-12 px-4 md:px-8 text-center max-w-5xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 text-[#16A34A] text-xs font-bold uppercase tracking-wider">
            Repsi Enterprise SaaS Pricing
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[var(--text)]">
            Simple pricing that grows <br className="hidden sm:block" />
            with your gym.
          </h1>

          <p className="text-base text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Start free for 14 days. Choose the plan that fits your gym today and upgrade as your member base expands. No complicated setup.
          </p>

          {/* Guarantee Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs font-semibold text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              14-Day Free Trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              Upgrade Anytime
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              Cancel Anytime
            </span>
          </div>

          {/* Premium Billing Toggle & Currency Switcher */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            {/* Premium Segmented Billing Cycle Toggle */}
            <div className="inline-flex p-1 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[var(--surface)] text-[var(--text)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/25"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <span>Yearly</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                    billingCycle === "annual" ? "bg-white/20 text-white" : "bg-[#16A34A]/10 text-[#16A34A]"
                  }`}
                >
                  SAVE UP TO 20%
                </span>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="inline-flex p-1 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-xs">
              <button
                type="button"
                onClick={() => setCurrency("INR")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currency === "INR" ? "bg-[#16A34A] text-white" : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currency === "USD" ? "bg-[#16A34A] text-white" : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                $ USD
              </button>
            </div>
          </div>
        </section>

        {/* 4 × 2 PRICING CARDS GRID (CONTAINER MAX 1280px) */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-8 mb-20">
          {/* Row 1: Free Trial → Starter → Basic → Growth (4 columns on Desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
            {row1Plans.map((p) => renderPricingCard(p))}
          </div>

          {/* Row 2: Pro → Business (Centered Row on Desktop, exact same card width ~290-300px) */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 lg:gap-6 mt-6 sm:mt-8">
            {row2Plans.map((p) => (
              <div key={p.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] lg:max-w-[305px]">
                {renderPricingCard(p)}
              </div>
            ))}
          </div>
        </section>

        {/* 11-CATEGORY DETAILED FEATURE COMPARISON TABLE */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">Detailed Matrix</span>
            <h2 className="text-3xl font-black text-[var(--text)]">Compare Plan Entitlements</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Complete feature breakdown across Starter, Basic, Growth, Pro, and Business tiers.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)] text-xs">
                  <th className="p-4 font-bold text-[var(--text)] min-w-[220px]">Feature Category</th>
                  <th className="p-3 font-bold text-center text-[var(--text)]">STARTER</th>
                  <th className="p-3 font-bold text-center text-[var(--text)]">BASIC</th>
                  <th className="p-3 font-bold text-center text-[#16A34A] bg-[#16A34A]/10">GROWTH ★</th>
                  <th className="p-3 font-bold text-center text-[var(--text)]">PRO</th>
                  <th className="p-3 font-bold text-center text-[var(--text)]">BUSINESS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {comparisonCategories.map((cat) => (
                  <React.Fragment key={cat.name}>
                    <tr className="bg-[var(--background)]/80">
                      <td colSpan={6} className="p-3 font-extrabold text-[11px] text-[#16A34A] tracking-wider uppercase">
                        {cat.name}
                      </td>
                    </tr>
                    {cat.rows.map((r, rIdx) => (
                      <tr key={rIdx} className="hover:bg-[var(--surface-hover)]/50 transition">
                        <td className="p-3.5 font-medium text-[var(--text)]">{r.name}</td>
                        <td className="p-3 text-center text-[var(--text-muted)] font-mono">{r.starter}</td>
                        <td className="p-3 text-center text-[var(--text-muted)] font-mono">{r.basic}</td>
                        <td className="p-3 text-center font-mono font-bold text-[#16A34A] bg-[#16A34A]/5">
                          {r.growth}
                        </td>
                        <td className="p-3 text-center text-[var(--text)] font-mono font-semibold">{r.pro}</td>
                        <td className="p-3 text-center text-[var(--text)] font-mono font-bold">{r.business}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* MODULAR ADD-ONS */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 mb-24">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">Modular Growth</span>
            <h3 className="text-2xl font-bold text-[var(--text)] tracking-tight">Optional Add-ons</h3>
            <p className="text-xs text-[var(--text-muted)]">Extend Repsi capabilities as your gym business scales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[var(--text)]">Additional Gym Branch Location</h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  Connect secondary branch locations to your unified owner portal with centralized member database.
                </p>
              </div>
              <div className="text-xs font-mono font-extrabold text-[#16A34A] mt-4 pt-3 border-t border-[var(--border)]">
                + ₹499 / branch / month ($5.99/mo)
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[var(--text)]">Custom Root Domain</h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  Connect your custom root domain (e.g. yourgym.com) with SSL certificate and brand styling.
                </p>
              </div>
              <div className="text-xs font-mono font-extrabold text-[#16A34A] mt-4 pt-3 border-t border-[var(--border)]">
                + ₹999 / month ($11.99/mo)
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[var(--text)]">Dedicated Account Concierge</h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  Priority WhatsApp hotline, bi-weekly data audits, staff training sessions, and hardware setup.
                </p>
              </div>
              <div className="text-xs font-mono font-extrabold text-[#16A34A] mt-4 pt-3 border-t border-[var(--border)]">
                + ₹1,499 / month ($17.99/mo)
              </div>
            </div>
          </div>
        </section>

        {/* PRICING FAQS */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 mb-24">
          <div className="text-center mb-10 space-y-1">
            <h3 className="text-3xl font-black text-[var(--text)]">Frequently Asked Questions</h3>
            <p className="text-xs text-[var(--text-muted)]">Clear, transparent answers about Repsi billing & plans.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((f, i) => (
              <div key={i} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5">
                <h4 className="font-bold text-sm text-[var(--text)] flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{f.q}</span>
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-6">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MASCOT ASSISTANT BANNER */}
        <section className="mx-auto max-w-4xl px-4">
          <div className="bg-gradient-to-r from-[#16A34A]/10 via-[var(--surface)] to-[#16A34A]/5 border border-[#16A34A]/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
            <RepsiMascot pose="help" size="sm" />
            <div className="space-y-1 text-center sm:text-left flex-1">
              <h3 className="text-lg font-bold text-[var(--text)]">Unsure which plan fits your gym best?</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Our team helps gym owners migrate existing Excel records, set up attendance hardware, and launch within 48 hours.
              </p>
            </div>
            <a
              href="https://wa.me/918667783321?text=Hi%20Repsi%20team,%20I'd%20like%20guidance%20on%20choosing%20a%20plan%20for%20my%20gym"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shrink-0 shadow-xs flex items-center gap-2"
            >
              <span>Talk to an Advisor</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
