"use client";

import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PricingSection } from "@/components/ui/pricing-section";
import { RepsiMascot } from "@/components/ui/repsi-mascot";

export default function PricingPage() {
  const addOns = [
    {
      name: "Additional Branch Location",
      desc: "Connect secondary gyms to your unified owner portal with centralized revenue.",
      price: "+ ₹499 / branch / month",
    },
    {
      name: "White-Label Member Portal",
      desc: "Custom domain (members.yourgym.com) with bespoke color scheme and custom app icon.",
      price: "+ ₹999 / month",
    },
    {
      name: "Dedicated Account Concierge",
      desc: "Priority WhatsApp hotline, bi-weekly data audits, and staff training sessions.",
      price: "+ ₹1,499 / month",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] selection:bg-[#16A34A] selection:text-white flex flex-col font-sans">
      <MarketingNav />

      <main className="flex-1 pb-24">
        {/* Core Pricing Section (Monthly Visual Anchor + Calculator + Cards + Comparison Matrix + FAQ) */}
        <PricingSection />

        {/* Optional Add-Ons Section */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 mb-20">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">Modular Growth</span>
            <h3 className="text-2xl font-bold text-[var(--text)] tracking-tight">Optional Add-ons</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Extend Repsi capabilities as your fitness business scales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {addOns.map((add, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-[var(--text)]">{add.name}</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1.5 leading-relaxed">{add.desc}</p>
                </div>
                <div className="text-xs font-mono font-extrabold text-[#16A34A] mt-4 pt-3 border-t border-[var(--border)]">
                  {add.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mascot Assistant Banner */}
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-gradient-to-r from-[#16A34A]/10 via-[var(--surface)] to-[#16A34A]/5 border border-[#16A34A]/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <RepsiMascot pose="help" size="sm" />
            <div className="space-y-1 text-center sm:text-left flex-1">
              <h3 className="text-lg font-bold text-[var(--text)]">
                Unsure which plan fits your gym best?
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Our team helps gym owners migrate existing Excel records, set up attendance hardware, and launch within 48 hours.
              </p>
            </div>
            <a
              href="https://wa.me/919876543210?text=Hi%20Repsi%20team,%20I'd%20like%20guidance%20on%20choosing%20a%20plan%20for%20my%20gym"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shrink-0 shadow-sm"
            >
              Talk to an Advisor →
            </a>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
