"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles, Globe, ShieldCheck, Flame, Gift, CheckCircle2 } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

interface PricingTier {
  name: string;
  target: string;
  tagline: string;
  badge?: string | null;
  highlight?: boolean;
  cta: string;
  price: {
    monthly: { usd: number; inr: number; suffix?: string };
    annual: { usd: number; inr: number; suffix?: string };
  };
  features: string[];
  missingFeatures: string[];
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    target: "For small gyms",
    tagline: "Essential management tools for boutique studios and new gyms.",
    badge: null,
    highlight: false,
    cta: "Start Free Trial",
    price: {
      monthly: { usd: 15, inr: 999 },
      annual: { usd: 150, inr: 9990 },
    },
    features: [
      "Up to 250 active members",
      "Member check-in & basic attendance",
      "Automated WhatsApp & SMS reminders",
      "Standard membership plans",
      "UPI & Card payment collection",
      "Single gym location",
      "Standard email support",
    ],
    missingFeatures: [
      "Turnstile & Hardware Sync (Add-on)",
      "Trainer commission tracking",
      "Multi-branch management",
      "Custom white-label app",
    ],
  },
  {
    name: "Growth",
    target: "For growing gyms",
    tagline: "The core engine for fast-scaling fitness clubs and studios.",
    badge: "Most Popular",
    highlight: true,
    cta: "Claim 3 Months Free",
    price: {
      monthly: { usd: 29, inr: 2499 },
      annual: { usd: 290, inr: 24990 },
    },
    features: [
      "Up to 1,500 active members",
      "Automated recurring renewals & reminders",
      "Class scheduling & trainer assignments",
      "Workout routine & diet planner",
      "WhatsApp automated renewal engine",
      "GST invoices & payment receipts",
      "Turnstile & Hardware Partner Setup",
      "24/7 priority support",
    ],
    missingFeatures: [
      "Multi-branch corporate dashboard",
      "Custom white-label member mobile app",
    ],
  },
  {
    name: "Pro",
    target: "For serious fitness businesses",
    tagline: "Advanced automation and analytics for established clubs.",
    badge: null,
    highlight: false,
    cta: "Start Free Trial",
    price: {
      monthly: { usd: 49, inr: 4999 },
      annual: { usd: 490, inr: 49990 },
    },
    features: [
      "Unlimited active members",
      "Advanced churn prediction radar",
      "Personal trainer commission tracking",
      "Multi-terminal reception check-in",
      "Custom branded email templates",
      "Detailed P&L statements & petty cash log",
      "Role-based staff permissions",
      "Dedicated onboarding specialist",
    ],
    missingFeatures: ["Multi-branch corporate dashboard"],
  },
  {
    name: "Business",
    target: "For multi-location businesses",
    tagline: "Enterprise infrastructure built for gym chains & franchises.",
    badge: "Chains & Enterprise",
    highlight: false,
    cta: "Talk to Franchise Team",
    price: {
      monthly: { usd: 99, inr: 9999, suffix: "+" },
      annual: { usd: 990, inr: 99990, suffix: "+" },
    },
    features: [
      "Unlimited members & gym locations",
      "Centralized multi-gym master dashboard",
      "Cross-branch attendance & memberships",
      "Custom white-label member mobile app (Add-on)",
      "ERP & Tally / QuickBooks sync",
      "Custom SLA (99.99% uptime guarantee)",
      "Dedicated account engineer & on-site setup",
    ],
    missingFeatures: [],
  },
];

const featureComparison = [
  {
    category: "Core Facility Operations",
    rows: [
      { feature: "Active Member Capacity", starter: "250", growth: "1,500", pro: "Unlimited", biz: "Unlimited" },
      { feature: "QR Code Check-in App", starter: true, growth: true, pro: true, biz: true },
      { feature: "Hardware Turnstile & Biometric Sync", starter: false, growth: true, pro: true, biz: true },
      { feature: "Automated Access Gate Blocking", starter: false, growth: true, pro: true, biz: true },
    ],
  },
  {
    category: "Financials & Payments",
    rows: [
      { feature: "UPI, Cards, NetBanking Gateway", starter: true, growth: true, pro: true, biz: true },
      { feature: "Automated Tax Invoices & Receipts", starter: true, growth: true, pro: true, biz: true },
      { feature: "Expense & Petty Cash Tracking", starter: false, growth: true, pro: true, biz: true },
      { feature: "Trainer Commission Ledger", starter: false, growth: false, pro: true, biz: true },
    ],
  },
  {
    category: "Multi-Location & Mobile App",
    rows: [
      { feature: "Multi-Gym Corporate Master View", starter: false, growth: false, pro: false, biz: true },
      { feature: "Cross-Branch Access Control", starter: false, growth: false, pro: false, biz: true },
      { feature: "Custom Branded White-label App", starter: false, growth: false, pro: false, biz: true },
    ],
  },
];

export default function PricingPage() {
  const [currency, setCurrency] = useState<"usd" | "inr">("inr");
  const [annualBilling, setAnnualBilling] = useState(false);

  const isUsd = currency === "usd";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)] font-sans">
      <MarketingNav />

      <main className="flex-1 pt-10 pb-20 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple gym management. One platform. Every device.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Fair, region-based pricing for{" "}
            <span className="text-[var(--primary)]">every gym size</span>.
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Choose the plan tailored for your facility. Switch between monthly or annual plans with ~2 months free.
          </p>

          {/* Region & Billing Controls */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {/* Currency Selector */}
            <div className="inline-flex items-center p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
              <button
                onClick={() => setCurrency("usd")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                  isUsd
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>International ($ USD)</span>
              </button>

              <button
                onClick={() => setCurrency("inr")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                  !isUsd
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <span>India (₹ INR)</span>
              </button>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold ${!annualBilling ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                Monthly
              </span>
              <button
                onClick={() => setAnnualBilling(!annualBilling)}
                className="relative w-12 h-6 rounded-full bg-[var(--surface)] border border-[var(--border)] transition-colors p-0.5 focus:outline-none cursor-pointer"
                aria-label="Toggle billing frequency"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[var(--primary)] transition-transform ${
                    annualBilling ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-xs font-semibold flex items-center gap-1.5 ${annualBilling ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                <span>Annual</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  ~2 Months Free
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Founding 5 Gyms Worldwide Special Section */}
        <div className="mx-auto max-w-5xl mb-14">
          <div className="relative rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-[var(--surface)] to-emerald-950/20 p-6 sm:p-8 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-black text-[10px] font-extrabold uppercase tracking-widest rounded-bl-xl shadow-md">
              Founding 5 Worldwide Offer
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Flame className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-xl font-bold text-[var(--text)] tracking-tight">Founding 5 — First 5 Gyms Worldwide</h3>
                </div>
                <p className="text-sm font-semibold text-emerald-500">
                  Get 3 months of the full Growth plan completely free!
                </p>
                <p className="text-xs text-[var(--text-muted)] max-w-xl">
                  Zero setup fee • No credit card required • Founding-customer pricing afterward ({isUsd ? "$29/mo or $20/mo lifetime 30% discount forever" : "₹2,499/mo or ₹1,749/mo lifetime 30% discount forever"}).
                </p>
              </div>

              <Link
                href="/signup?offer=founding5"
                className="px-6 py-3 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg transition-all whitespace-nowrap cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                <span>Claim Founding Offer</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-20">
          {pricingTiers.map((tier) => {
            const priceData = annualBilling ? tier.price.annual : tier.price.monthly;
            const amount = isUsd ? priceData.usd : priceData.inr;
            const formattedPrice = isUsd ? `$${amount}` : `₹${amount.toLocaleString("en-IN")}`;
            const periodLabel = annualBilling ? "/year" : "/month";

            return (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl p-6 transition-all justify-between ${
                  tier.highlight
                    ? "border-2 border-[var(--primary)] bg-[var(--surface)] shadow-2xl scale-[1.02] z-10"
                    : "border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border)]/80"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs">
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">{tier.target}</span>
                    <h3 className="text-xl font-bold text-[var(--text)] mt-0.5">{tier.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1 min-h-[32px]">{tier.tagline}</p>
                  </div>

                  <div className="pt-2 border-t border-[var(--border)]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[var(--text)] tracking-tight">
                        {formattedPrice}{priceData.suffix || ""}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-medium">{periodLabel}</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">
                      {annualBilling ? "Billed annually" : "Billed monthly"}
                    </p>
                  </div>

                  <Link
                    href={tier.cta.includes("Talk") ? "/contact" : "/signup"}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      tier.highlight
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] shadow-md"
                        : "bg-[var(--background)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="space-y-2.5 pt-4 border-t border-[var(--border)] text-xs">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">What's Included:</p>
                    {tier.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-[var(--text)]">{feat}</span>
                      </div>
                    ))}
                    {tier.missingFeatures.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 opacity-40">
                        <span className="w-3.5 h-3.5 text-center text-[10px] text-[var(--text-muted)] shrink-0">—</span>
                        <span className="text-[11px] text-[var(--text-muted)] line-through">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mx-auto max-w-5xl mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">Complete Capability Matrix</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">Detailed feature comparison across all four subscription tiers.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-hover)] text-xs">
                  <th className="p-3.5 font-bold uppercase text-[var(--text-muted)]">Feature</th>
                  <th className="p-3.5 font-bold uppercase text-center w-24">Starter</th>
                  <th className="p-3.5 font-bold uppercase text-center w-28 text-[var(--primary)] bg-[var(--primary)]/10">Growth</th>
                  <th className="p-3.5 font-bold uppercase text-center w-24">Pro</th>
                  <th className="p-3.5 font-bold uppercase text-center w-28">Business</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((cat) => (
                  <Fragment key={cat.category}>
                    <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                      <td colSpan={5} className="p-3 text-[11px] font-bold tracking-wider uppercase text-[var(--text)]">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.rows.map((row) => (
                      <tr key={row.feature} className="border-b border-[var(--border)]/60 text-xs hover:bg-[var(--surface-hover)]/50">
                        <td className="p-3.5 text-[var(--text)] font-medium">{row.feature}</td>
                        <td className="p-3.5 text-center">
                          {typeof row.starter === "boolean" ? (
                            row.starter ? <Check className="w-3.5 h-3.5 text-emerald-500 mx-auto" /> : <span className="text-[var(--text-muted)]">—</span>
                          ) : (
                            <span className="text-[11px] font-semibold">{row.starter}</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center bg-[var(--primary)]/5 font-bold">
                          {typeof row.growth === "boolean" ? (
                            row.growth ? <Check className="w-3.5 h-3.5 text-[var(--primary)] mx-auto font-bold" /> : <span className="text-[var(--text-muted)]">—</span>
                          ) : (
                            <span className="text-[11px] text-[var(--primary)]">{row.growth}</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          {typeof row.pro === "boolean" ? (
                            row.pro ? <Check className="w-3.5 h-3.5 text-emerald-500 mx-auto" /> : <span className="text-[var(--text-muted)]">—</span>
                          ) : (
                            <span className="text-[11px] font-semibold">{row.pro}</span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          {typeof row.biz === "boolean" ? (
                            row.biz ? <Check className="w-3.5 h-3.5 text-emerald-500 mx-auto" /> : <span className="text-[var(--text-muted)]">—</span>
                          ) : (
                            <span className="text-[11px] font-semibold">{row.biz}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
