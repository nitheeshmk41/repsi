"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { Check, HelpCircle, ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

const pricingTiers = [
  {
    name: "Starter",
    tagline: "Essential tools for boutique studios & new gyms.",
    monthlyPrice: 2499,
    annualPrice: 1999,
    badge: null,
    highlight: false,
    cta: "Start 14-Day Free Trial",
    features: [
      "Up to 250 active members",
      "Member check-in & basic attendance",
      "Automated WhatsApp & SMS reminders",
      "Standard membership plans",
      "UPI & Card payment collection",
      "Single location",
      "1 Admin & 2 Trainers accounts",
      "Standard email support",
    ],
    missingFeatures: [
      "Turnstile & biometric hardware sync",
      "Trainer commission tracking",
      "Multi-branch management",
      "Custom branded mobile app",
    ],
  },
  {
    name: "Growth Pro",
    tagline: "The complete system for fast-growing fitness clubs.",
    monthlyPrice: 4999,
    annualPrice: 3999,
    badge: "Most Popular",
    highlight: true,
    cta: "Start 14-Day Free Trial",
    features: [
      "Up to 1,500 active members",
      "Biometric & RFID turnstile integration",
      "Automated recurring subscriptions & auto-debit",
      "Class scheduling & trainer assignments",
      "Diet & workout routine builder",
      "WhatsApp automated marketing engine",
      "Unlimited staff & trainer logins",
      "Financial reports, GST invoices & expense tracking",
      "Priority 24/7 WhatsApp support",
    ],
    missingFeatures: [
      "Multi-branch corporate dashboard",
      "Custom branded iOS/Android apps",
    ],
  },
  {
    name: "Enterprise & Chains",
    tagline: "Tailored infrastructure for gym chains and franchises.",
    monthlyPrice: 9999,
    annualPrice: 7999,
    badge: "Gym Chains",
    highlight: false,
    cta: "Contact Enterprise Sales",
    features: [
      "Unlimited members & branches",
      "Centralized multi-gym master dashboard",
      "Cross-branch attendance & memberships",
      "Custom white-label member mobile app",
      "ERP & tally/accounting integrations",
      "Dedicated account manager & on-site training",
      "Custom SLA (99.99% uptime guarantee)",
      "Role-based granular ACLs & audit logs",
    ],
    missingFeatures: [],
  },
];

const featureComparison = [
  {
    category: "Member Management",
    rows: [
      { feature: "Active Member Capacity", starter: "250", pro: "1,500", ent: "Unlimited" },
      { feature: "Digital Profile & Document KYC", starter: true, pro: true, ent: true },
      { feature: "Membership Freeze & Transfers", starter: false, pro: true, ent: true },
      { feature: "Automated Renewal Alerts", starter: true, pro: true, ent: true },
    ],
  },
  {
    category: "Hardware & Attendance",
    rows: [
      { feature: "App/Tablet QR Code Check-in", starter: true, pro: true, ent: true },
      { feature: "Fingerprint & Facial Recognition Turnstiles", starter: false, pro: true, ent: true },
      { feature: "Real-time Live Gym Occupancy", starter: false, pro: true, ent: true },
      { feature: "Late/Overdue Access Blocking", starter: false, pro: true, ent: true },
    ],
  },
  {
    category: "Billing & Revenue",
    rows: [
      { feature: "UPI, Cards, NetBanking Gateway", starter: true, pro: true, ent: true },
      { feature: "Automated GST Invoices & Receipts", starter: true, pro: true, ent: true },
      { feature: "Expense & Petty Cash Log", starter: false, pro: true, ent: true },
      { feature: "P&L Statements & Tax Reports", starter: false, pro: true, ent: true },
    ],
  },
];

export default function PricingPage() {
  const [annualBilling, setAnnualBilling] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)]">
      <MarketingNav />

      <main className="flex-1 pt-12 pb-20 px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/25 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent, simple pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Invest in software that pays for itself in{" "}
            <span className="text-[var(--accent)]">saved renewals</span>.
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            No hidden charges. No setup fees. Switch or cancel anytime. Get started with our 14-day free trial.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!annualBilling ? "text-[var(--text)]" : "text-[var(--text-secondary)]"}`}>
              Monthly billing
            </span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="relative w-12 h-6 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] transition-colors p-0.5 focus:outline-none"
              aria-label="Toggle billing period"
            >
              <div
                className={`w-5 h-5 rounded-full bg-[var(--primary)] transition-transform ${
                  annualBilling ? "translate-x-6 bg-[var(--accent)]" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${annualBilling ? "text-[var(--text)]" : "text-[var(--text-secondary)]"}`}>
              Annual billing
              <span className="ml-2 inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {pricingTiers.map((tier) => {
            const price = annualBilling ? tier.annualPrice : tier.monthlyPrice;
            return (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl p-6 sm:p-8 transition-all ${
                  tier.highlight
                    ? "border-2 border-[var(--accent)] bg-[var(--surface)] shadow-xl shadow-[var(--accent)]/5 scale-105 z-10"
                    : "border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-secondary)]/40"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--accent)] text-black shadow-sm">
                    {tier.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)] min-h-[32px]">{tier.tagline}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black">₹{price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-[var(--text-secondary)]">/ month</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">
                    {annualBilling ? "Billed annually (₹" + (price * 12).toLocaleString("en-IN") + "/yr)" : "Billed monthly"}
                  </p>
                </div>

                <Link
                  href={tier.cta.includes("Contact") ? "/contact" : "/signup"}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mb-8 transition-all ${
                    tier.highlight
                      ? "bg-[var(--accent)] text-black hover:brightness-110 shadow-md"
                      : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex-1 space-y-3 pt-4 border-t border-[var(--border)] text-sm">
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Included Features:
                  </p>
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-xs text-[var(--text)] leading-tight">{feature}</span>
                    </div>
                  ))}
                  {tier.missingFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 opacity-40">
                      <div className="w-4 h-4 rounded-full bg-[var(--border)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px]">—</span>
                      </div>
                      <span className="text-xs text-[var(--text-secondary)] leading-tight line-through">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mx-auto max-w-5xl mb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Compare all platform capabilities</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">Every feature you need to run an automated, profitable gym.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-hover)]">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Feature</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] text-center w-28">Starter</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[var(--accent)] text-center w-32">Growth Pro</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] text-center w-32">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((cat) => (
                  <Fragment key={cat.category}>
                    <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                      <td colSpan={4} className="p-3 text-xs font-bold tracking-wider uppercase text-[var(--text)]">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.rows.map((row) => (
                      <tr key={row.feature} className="border-b border-[var(--border)]/60 text-sm hover:bg-[var(--surface-hover)]/50">
                        <td className="p-4 text-xs text-[var(--text)] font-medium">{row.feature}</td>
                        <td className="p-4 text-center">
                          {typeof row.starter === "boolean" ? (
                            row.starter ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-[var(--text-muted)]">—</span>
                          ) : (
                            <span className="text-xs font-medium text-[var(--text-secondary)]">{row.starter}</span>
                          )}
                        </td>
                        <td className="p-4 text-center bg-[var(--accent)]/5">
                          {typeof row.pro === "boolean" ? (
                            row.pro ? <Check className="w-4 h-4 text-[var(--accent)] mx-auto font-bold" /> : <span className="text-[var(--text-muted)]">—</span>
                          ) : (
                            <span className="text-xs font-bold text-[var(--accent)]">{row.pro}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof row.ent === "boolean" ? (
                            row.ent ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-[var(--text-muted)]">—</span>
                          ) : (
                            <span className="text-xs font-medium text-[var(--text-secondary)]">{row.ent}</span>
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

        {/* Enterprise Banner */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--surface)] via-[var(--surface-hover)] to-[var(--surface)] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Have more than 5 gym branches?</h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-md">
              We offer bespoke white-label member apps, dedicated database instances, and custom turnstile hardware deployments.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] font-semibold text-sm whitespace-nowrap transition-colors"
          >
            Talk to Franchise Team
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
