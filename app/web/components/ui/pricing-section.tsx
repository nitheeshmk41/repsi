"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles, Building2, Dumbbell, UserCheck, ShieldCheck, Zap, Minus, Plus, HelpCircle, ChevronDown } from "lucide-react";

export type BillingPeriod = "monthly" | "1year" | "2year";

export function PricingSection() {
  const [period, setPeriod] = useState<BillingPeriod>("1year");
  const [memberCalcCount, setMemberCalcCount] = useState<number>(120);

  // Pricing calculations
  const tiers = [
    {
      id: "starter",
      name: "STARTER",
      subtitle: "Manage your gym",
      target: "For small gyms getting started",
      badge: null,
      highlight: false,
      ctaText: "Choose Starter",
      memberLimit: 100,
      pricing: {
        monthly: {
          displayPrice: "499",
          period: "/ month",
          billedText: "Billed monthly",
          savings: null,
        },
        "1year": {
          displayPrice: "416",
          period: "/ month",
          billedText: "Billed ₹4,990 yearly",
          savings: "Save ₹998/year",
        },
        "2year": {
          displayPrice: "375",
          period: "/ month",
          billedText: "Billed ₹8,990 for 2 years",
          savings: "Save ₹2,986 overall",
        },
      },
      keyFeatures: [
        "Up to 100 members",
        "Member management & profiles",
        "Memberships & auto-renewals",
        "QR mobile attendance check-in",
        "Trainer management & schedules",
        "Gym website (repsi.app/gymname)",
        "Revenue & attendance reports",
      ],
      moreCount: 4,
    },
    {
      id: "growth",
      name: "GROWTH",
      subtitle: "Grow your gym",
      target: "For growing gyms building a sales pipeline",
      badge: "MOST POPULAR ★",
      highlight: true,
      ctaText: "Choose Growth",
      memberLimit: 500,
      pricing: {
        monthly: {
          displayPrice: "999",
          period: "/ month",
          billedText: "Billed monthly",
          savings: null,
        },
        "1year": {
          displayPrice: "833",
          period: "/ month",
          billedText: "Billed ₹9,990 yearly",
          savings: "Save ₹1,998 annually",
        },
        "2year": {
          displayPrice: "750",
          period: "/ month",
          billedText: "Billed ₹17,990 for 2 years",
          savings: "Save ₹5,986 overall",
        },
      },
      keyFeatures: [
        "Up to 500 members",
        "Everything in Starter, plus:",
        "CRM & lead pipeline management",
        "1-click Lead → Member conversion",
        "Trainer → Client assignment & workouts",
        "Gym Website + Floating AI Assistant",
        "Automated WhatsApp lead capture",
      ],
      moreCount: 6,
    },
    {
      id: "pro",
      name: "PRO",
      subtitle: "Run your gym with Repsi",
      target: "For established gyms and multi-staff operations",
      badge: null,
      highlight: false,
      ctaText: "Choose Pro",
      memberLimit: 1500,
      pricing: {
        monthly: {
          displayPrice: "1,799",
          period: "/ month",
          billedText: "Billed monthly",
          savings: null,
        },
        "1year": {
          displayPrice: "1,499",
          period: "/ month",
          billedText: "Billed ₹17,990 yearly",
          savings: "Save ₹3,598/year",
        },
        "2year": {
          displayPrice: "1,333",
          period: "/ month",
          billedText: "Billed ₹31,990 for 2 years",
          savings: "Save ₹11,186 overall",
        },
      },
      keyFeatures: [
        "Up to 1,500 members",
        "Everything in Growth, plus:",
        "Custom root domain (yourgym.com)",
        "Advanced CRM automation & triggers",
        "Multiple staff accounts & permissions",
        "Multi-branch & franchise view",
        "Priority 24/7 dedicated support",
      ],
      moreCount: 5,
    },
  ];

  // Recommended plan based on calculator
  const recommendedTier =
    memberCalcCount <= 100 ? "Starter" : memberCalcCount <= 500 ? "Growth" : "Pro";

  const scrollToComparison = () => {
    document.getElementById("compare-matrix")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-20 md:py-28 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* 1. Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text)] tracking-tight leading-tight">
            Everything you need to run <br className="hidden sm:block" />
            and grow your gym.
          </h2>
          <p className="text-base text-[var(--text-muted)] max-w-xl mx-auto">
            Choose the plan that fits your gym. Simple plans. No hidden fees.
          </p>

          {/* 2. Billing Period Selector */}
          <div className="pt-4 flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Billing period
            </span>
            <div className="inline-flex p-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
              <button
                type="button"
                onClick={() => setPeriod("monthly")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  period === "monthly"
                    ? "bg-[var(--background)] text-[var(--text)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setPeriod("1year")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  period === "1year"
                    ? "bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/25"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <span>1 Year</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${
                    period === "1year" ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  Save 17%
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPeriod("2year")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  period === "2year"
                    ? "bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/25"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <span>2 Years</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${
                    period === "2year" ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  Best Value
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Interactive Gym Size Calculator */}
        <div className="max-w-xl mx-auto mb-12 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-[var(--text)] flex items-center justify-center sm:justify-start gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-[#16A34A]" />
                How big is your gym?
              </span>
              <p className="text-[11px] text-[var(--text-muted)]">
                Based on <strong className="text-[var(--text)]">{memberCalcCount} members</strong>, {recommendedTier} supports your member count.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMemberCalcCount((prev) => Math.max(20, prev - 25))}
                className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-hover)] flex items-center justify-center font-bold text-[var(--text)] transition cursor-pointer"
                title="Decrease members"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="w-20 text-center font-mono font-bold text-sm text-[var(--text)] py-1 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                {memberCalcCount}
              </div>
              <button
                onClick={() => setMemberCalcCount((prev) => Math.min(2500, prev + 25))}
                className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-hover)] flex items-center justify-center font-bold text-[var(--text)] transition cursor-pointer"
                title="Increase members"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Pricing Cards Grid (Growth is Visually Dominant) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const p = tier.pricing[period];
            const isRec = tier.highlight;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-200 ${
                  isRec
                    ? "bg-[var(--surface)] border-2 border-[#16A34A] shadow-xl md:-translate-y-2 md:scale-102 ring-4 ring-[#16A34A]/10 z-10"
                    : "bg-[var(--surface)] border border-[var(--border)] opacity-95 hover:opacity-100"
                }`}
              >
                {/* Popular Pill */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3.5 py-1 rounded-full bg-[#16A34A] text-white text-[11px] font-black tracking-wide shadow-md uppercase">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Names & Targets */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-[var(--text)] tracking-tight">{tier.name}</h3>
                      {recommendedTier.toLowerCase() === tier.id && (
                        <span className="text-[10px] font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-full">
                          Fits Your Gym
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-[var(--text-muted)]">{tier.subtitle}</div>
                    <p className="text-[11px] text-[var(--text-muted)] italic">{tier.target}</p>
                  </div>

                  {/* Primary Visual Anchor: Monthly Price */}
                  <div className="py-4 border-y border-[var(--border)] my-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[var(--text)]">₹</span>
                      <span className="text-4xl sm:text-5xl font-black text-[var(--text)] tracking-tight">
                        {p.displayPrice}
                      </span>
                      <span className="text-xs font-bold text-[var(--text-muted)]">{p.period}</span>
                    </div>

                    {/* Secondary Billed Total & Savings (Transparent & Honest) */}
                    <div className="mt-2 space-y-0.5">
                      <p className="text-xs font-semibold text-[var(--text)]">{p.billedText}</p>
                      {p.savings && (
                        <p className="text-xs font-bold text-[#16A34A]">{p.savings}</p>
                      )}
                    </div>
                  </div>

                  {/* High-Impact Scannable Feature List */}
                  <div className="space-y-2.5 my-6 text-xs text-[var(--text)]">
                    {tier.keyFeatures.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                        <span className={i === 0 ? "font-bold text-[var(--text)]" : ""}>{feat}</span>
                      </div>
                    ))}

                    {/* View all features link */}
                    <div className="pt-2">
                      <button
                        onClick={scrollToComparison}
                        className="text-[11px] font-semibold text-[#16A34A] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ {tier.moreCount} more features</span>
                        <span className="text-[10px] text-[var(--text-muted)]">(View all features ↓)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Consistent CTA Button */}
                <div className="pt-4">
                  <Link
                    href={`/signup?plan=${tier.id}&billing=${period}`}
                    className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                      isRec
                        ? "bg-[#16A34A] hover:bg-[#15803D] text-white shadow-[#16A34A]/25"
                        : "bg-[var(--background)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)]"
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

        {/* 5. Prompt to Compare Plans */}
        <div className="text-center mt-10">
          <p className="text-xs text-[var(--text-muted)]">
            Not sure which plan you need?{" "}
            <button
              onClick={scrollToComparison}
              className="font-bold text-[#16A34A] hover:underline cursor-pointer"
            >
              Compare all features below ↓
            </button>
          </p>
        </div>

        {/* 6. Feature Comparison Matrix */}
        <div id="compare-matrix" className="mt-20 pt-10 border-t border-[var(--border)]">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
            <h3 className="text-2xl font-bold text-[var(--text)]">Compare All Features</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Detailed breakdown of features included across all 3 tiers.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                  <th className="p-4 font-bold text-[var(--text)] w-2/5">Feature</th>
                  <th className="p-4 font-bold text-[var(--text)] text-center w-1/5">STARTER</th>
                  <th className="p-4 font-bold text-[#16A34A] text-center w-1/5 bg-[#16A34A]/5">GROWTH ★</th>
                  <th className="p-4 font-bold text-[var(--text)] text-center w-1/5">PRO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="p-4 font-semibold text-[var(--text)]">Member Capacity</td>
                  <td className="p-4 text-center font-mono">Up to 100</td>
                  <td className="p-4 text-center font-mono font-bold text-[#16A34A] bg-[#16A34A]/5">Up to 500</td>
                  <td className="p-4 text-center font-mono font-bold">Up to 1,500</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">Memberships & Expiries</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                  <td className="p-4 text-center font-bold text-[#16A34A] bg-[#16A34A]/5">✓</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">Attendance & QR Check-in</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                  <td className="p-4 text-center font-bold text-[#16A34A] bg-[#16A34A]/5">✓</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">Trainer Profiles & Schedules</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                  <td className="p-4 text-center font-bold text-[#16A34A] bg-[#16A34A]/5">✓</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">Trainer → Client Assignment</td>
                  <td className="p-4 text-center text-[var(--text-muted)]">—</td>
                  <td className="p-4 text-center font-bold text-[#16A34A] bg-[#16A34A]/5">✓</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">CRM & Sales Leads Pipeline</td>
                  <td className="p-4 text-center text-[var(--text-muted)]">—</td>
                  <td className="p-4 text-center font-bold text-[#16A34A] bg-[#16A34A]/5">✓</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">1-Click Convert Lead to Member</td>
                  <td className="p-4 text-center text-[var(--text-muted)]">—</td>
                  <td className="p-4 text-center font-bold text-[#16A34A] bg-[#16A34A]/5">✓</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">Gym Website (repsi.app/{`{slug}`})</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                  <td className="p-4 text-center font-bold text-[#16A34A] bg-[#16A34A]/5">✓</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">Website Customization</td>
                  <td className="p-4 text-center text-[var(--text-muted)]">Basic</td>
                  <td className="p-4 text-center font-bold text-[#16A34A] bg-[#16A34A]/5">Advanced</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">Advanced</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">Floating Mascot Gym Assistant</td>
                  <td className="p-4 text-center text-[var(--text-muted)]">—</td>
                  <td className="p-4 text-center font-bold text-[#16A34A] bg-[#16A34A]/5">✓ Included</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓ Included</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">WhatsApp Integration & Alerts</td>
                  <td className="p-4 text-center text-[var(--text-muted)]">—</td>
                  <td className="p-4 text-center font-bold text-[#16A34A] bg-[#16A34A]/5">✓</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">Custom Domain (yourgym.com)</td>
                  <td className="p-4 text-center text-[var(--text-muted)]">—</td>
                  <td className="p-4 text-center text-[var(--text-muted)] bg-[#16A34A]/5">—</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">Multi-Branch Corporate Dashboard</td>
                  <td className="p-4 text-center text-[var(--text-muted)]">—</td>
                  <td className="p-4 text-center text-[var(--text-muted)] bg-[#16A34A]/5">—</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--text)]">Granular Staff Roles & Permissions</td>
                  <td className="p-4 text-center text-[var(--text-muted)]">Owner only</td>
                  <td className="p-4 text-center text-[var(--text-muted)] bg-[#16A34A]/5">Owner + Trainers</td>
                  <td className="p-4 text-center font-bold text-[#16A34A]">Full Granular RBAC</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. Concise FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-8 space-y-1">
            <h3 className="text-2xl font-bold text-[var(--text)]">Frequently Asked Questions</h3>
            <p className="text-xs text-[var(--text-muted)]">Clear answers to common questions about Repsi billing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <h4 className="font-bold text-sm text-[var(--text)]">Can I upgrade later?</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Yes. You can upgrade anytime as your gym member count and sales pipeline grow.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <h4 className="font-bold text-sm text-[var(--text)]">Can I use Repsi for multiple branches?</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Yes. Multi-branch management with unified reporting is available on the Pro plan.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <h4 className="font-bold text-sm text-[var(--text)]">Can I connect my own domain?</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Yes, custom domain setup (e.g. yourgym.com) is available on the Pro plan, while repsi.app/{`{slug}`} is included on all plans.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1">
              <h4 className="font-bold text-sm text-[var(--text)]">Do I have to pay annually?</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                No. Monthly billing is available on all tiers with zero long-term lock-in. Annual billing provides savings.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-1 sm:col-span-2">
              <h4 className="font-bold text-sm text-[var(--text)]">Is there an onboarding or setup fee?</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                No additional setup fee. We offer free data migration from Excel, Gymforce, or Fitnessforce to get you started smoothly.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-xs text-[var(--text-muted)]">
              Still have questions?{" "}
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-[#16A34A] font-bold hover:underline">
                Talk to the Repsi team on WhatsApp →
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
