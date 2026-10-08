"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Dumbbell, Minus, Plus } from "lucide-react";

export type BillingPeriod = "monthly" | "annual";
export type Currency = "INR" | "USD";

export function PricingSection() {
  const [period, setPeriod] = useState<BillingPeriod>("annual");
  const [currency, setCurrency] = useState<Currency>("INR");
  const [memberCalcCount, setMemberCalcCount] = useState<number>(45);

  const tiers = [
    {
      id: "starter",
      name: "Starter",
      description: "For very small or new gyms getting started",
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
      description: "For small gyms building core operations",
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
      badge: "MOST POPULAR ★",
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
  ];

  const recommendedTier =
    memberCalcCount <= 5 ? "Starter" : memberCalcCount <= 40 ? "Basic" : "Growth";

  return (
    <section id="pricing" className="py-20 md:py-28 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 text-[#16A34A] text-xs font-bold uppercase tracking-wider">
            Simple & Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text)] tracking-tight leading-tight">
            Simple pricing that grows <br className="hidden sm:block" />
            with your gym.
          </h2>
          <p className="text-base text-[var(--text-muted)] max-w-xl mx-auto">
            Start free for 14 days. Choose the plan that fits your gym today and upgrade anytime as you grow. No hidden setup fees.
          </p>

          {/* Billing Cycle & Currency Switchers */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            {/* Billing Cycle Toggle */}
            <div className="inline-flex p-1 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-xs">
              <button
                type="button"
                onClick={() => setPeriod("monthly")}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  period === "monthly"
                    ? "bg-[var(--surface)] text-[var(--text)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setPeriod("annual")}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  period === "annual"
                    ? "bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/25"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <span>Yearly</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase bg-white/20 text-white">
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
        </div>

        {/* Interactive Gym Size Calculator */}
        <div className="max-w-xl mx-auto mb-12 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-[var(--text)] flex items-center justify-center sm:justify-start gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-[#16A34A]" />
                How many active members in your gym?
              </span>
              <p className="text-[11px] text-[var(--text-muted)]">
                Based on <strong className="text-[var(--text)]">{memberCalcCount} members</strong>, the <strong className="text-[#16A34A]">{recommendedTier} Plan</strong> fits your gym.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMemberCalcCount((prev) => Math.max(1, prev - 5))}
                className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-hover)] flex items-center justify-center font-bold text-[var(--text)] transition cursor-pointer"
                title="Decrease members"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="w-20 text-center font-mono font-bold text-sm text-[var(--text)] py-1 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                {memberCalcCount}
              </div>
              <button
                onClick={() => setMemberCalcCount((prev) => Math.min(1000, prev + 5))}
                className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-hover)] flex items-center justify-center font-bold text-[var(--text)] transition cursor-pointer"
                title="Increase members"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Starter/Basic/Growth Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const pricingInfo = tier.pricing[currency][period];
            const isRec = tier.highlight;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 h-full ${
                  isRec
                    ? "bg-[var(--surface)] border-2 border-[#16A34A] shadow-lg ring-4 ring-[#16A34A]/10 bg-gradient-to-b from-[#16A34A]/5 via-transparent to-transparent z-10"
                    : "bg-[var(--surface)] border border-[var(--border)] opacity-95 hover:opacity-100"
                }`}
              >
                <div>
                  {/* Reserved Badge Slot */}
                  <div className="h-7 mb-2 flex items-center justify-center">
                    {tier.badge ? (
                      <span className="px-3 py-0.5 rounded-full bg-[#16A34A] text-white text-[10px] font-black tracking-wide uppercase shadow-2xs">
                        {tier.badge}
                      </span>
                    ) : (
                      <div className="h-7" />
                    )}
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-[var(--text)] tracking-tight">{tier.name}</h3>
                      {recommendedTier.toLowerCase() === tier.id && (
                        <span className="text-[10px] font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-full">
                          Fits Your Gym
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-[var(--text-muted)] line-clamp-2 min-h-[36px]">
                      {tier.description}
                    </p>
                  </div>

                  {/* Price Header */}
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
                      <p className="text-[11px] font-bold text-[#16A34A] min-h-[16px]">
                        {period === "annual" && pricingInfo.savings ? pricingInfo.savings : ""}
                      </p>
                    </div>
                  </div>

                  {/* Limits Box */}
                  <div className="p-3 rounded-xl bg-[var(--surface-secondary)]/50 border border-[var(--border)]/60 text-xs space-y-1.5 font-sans mb-6">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[var(--text-muted)]">Members</span>
                      <span className="font-mono font-bold text-[var(--text)]">{tier.memberLimit}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[var(--text-muted)]">Trainers</span>
                      <span className="font-mono font-bold text-[var(--text)]">{tier.trainerLimit}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[var(--text-muted)]">Branches</span>
                      <span className="font-mono font-bold text-[var(--text)]">{tier.branchLimit}</span>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-2.5 mb-6 text-xs text-[var(--text-secondary)]">
                    {tier.keyFeatures.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                        <span className={i === 0 ? "font-bold text-[var(--text)]" : ""}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <Link
                    href={`/pricing?selected=${tier.id}&period=${period}&currency=${currency}`}
                    className={`w-full h-11 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                      isRec
                        ? "bg-[#16A34A] hover:bg-[#15803D] text-white shadow-md shadow-[#16A34A]/20"
                        : "bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)]"
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Plans (Pro & Business) CTA Link */}
        <div className="mt-12 text-center bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-bold text-[var(--text)]">Need Unlimited Members or Multi-Branch Support?</h4>
            <p className="text-xs text-[var(--text-muted)]">
              Explore Pro (Unlimited Members) and Business (Multi-Branch Chains & Franchise Management) plans on our full pricing matrix.
            </p>
          </div>
          <Link
            href="/pricing"
            className="px-6 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shrink-0 flex items-center gap-2 shadow-xs"
          >
            <span>View All 6 Plans & Feature Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
