"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles, Building2, Dumbbell, UserCheck, ShieldCheck } from "lucide-react";
import { StarBorder } from "@/components/ui/star-border";

export function PricingSection() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  const pricingData = {
    INR: {
      starter: {
        price: "699",
        refPrice: "1,299",
        unit: "/ month",
        symbol: "₹",
      },
      growth: {
        price: "1,499",
        refPrice: "2,499",
        unit: "/ month",
        symbol: "₹",
      },
      enterprise: {
        price: "Custom",
        unit: "",
        symbol: "",
      },
    },
    USD: {
      starter: {
        price: "9",
        refPrice: "19",
        unit: "/ month",
        symbol: "$",
      },
      growth: {
        price: "24",
        refPrice: "39",
        unit: "/ month",
        symbol: "$",
      },
      enterprise: {
        price: "Custom",
        unit: "",
        symbol: "",
      },
    },
  };

  const current = pricingData[currency];

  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E5EAE6]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#16A34A] bg-[#F1F5F2] px-3.5 py-1.5 rounded-full border border-[#E5EAE6] mb-4">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111714]">
            Simple plans. <span className="text-[#16A34A]">Start free.</span> Scale when you're ready.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#66706A]">
            Start with Repsi for free. Upgrade as your fitness business grows.
          </p>

          {/* Currency Switcher */}
          <div className="mt-8 flex flex-col items-center justify-center gap-2">
            <div className="inline-flex items-center p-1 rounded-xl bg-[#F1F5F2] border border-[#E5EAE6] text-xs font-bold shadow-2xs">
              <button
                onClick={() => setCurrency("INR")}
                className={`px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  currency === "INR"
                    ? "bg-white text-[#111714] shadow-xs border border-[#E5EAE6]"
                    : "text-[#66706A] hover:text-[#111714]"
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  currency === "USD"
                    ? "bg-white text-[#111714] shadow-xs border border-[#E5EAE6]"
                    : "text-[#66706A] hover:text-[#111714]"
                }`}
              >
                $ USD
              </button>
            </div>
            <span className="text-[11px] text-[#8A9690] font-medium">
              Prices shown exclude applicable taxes.
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mt-12">
          {/* STARTER CARD */}
          <div className="bg-white border border-[#E5EAE6] rounded-2xl p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#66706A]">
                  STARTER
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#EFF8F2] text-[#16A34A] px-2.5 py-1 rounded-md border border-[#16A34A]/20">
                  LAUNCH PRICE
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#111714]">Single Location</h3>
                <p className="text-xs text-[#66706A] mt-1.5 leading-relaxed">
                  Perfect for gyms and studios getting started with Repsi.
                </p>
              </div>

              {/* Price Hierarchy */}
              <div className="pt-2">
                <div className="text-xs text-[#8A9690] font-bold line-through">
                  {current.starter.symbol}{current.starter.refPrice}
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-4xl sm:text-5xl font-black text-[#111714] tracking-tight">
                    {current.starter.symbol}{current.starter.price}
                  </span>
                  <span className="text-xs text-[#66706A] font-semibold">{current.starter.unit}</span>
                </div>
              </div>

              {/* Feature List */}
              <ul className="space-y-3.5 text-xs font-semibold text-[#111714] border-t border-[#E5EAE6] pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Up to 300 active members</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>3 trainer profiles</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>QR mobile check-in</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Cashfree payment gateway</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Basic reports</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-4">
              <Link
                href="/signup"
                className="block w-full text-center py-3 rounded-xl bg-[#F1F5F2] hover:bg-[#E5EAE6] text-[#111714] text-xs font-bold transition-all border border-[#E5EAE6] active:scale-[0.99]"
              >
                Start Free
              </Link>
              <div className="text-[11px] text-center text-[#8A9690] font-semibold">
                No credit card required
              </div>
            </div>
          </div>

          {/* GROWTH CARD (HIGHLIGHTED WITH REPSI GREEN) */}
          <StarBorder color="#16A34A" speed="6s">
            <div className="h-full bg-white rounded-2xl p-8 shadow-xl flex flex-col justify-between space-y-8 relative border border-[#16A34A]/30">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase tracking-widest bg-[#16A34A] text-white px-3.5 py-1 rounded-full shadow-md">
                MOST POPULAR
              </span>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#16A34A]">
                    GROWTH
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#EFF8F2] text-[#16A34A] px-2.5 py-1 rounded-md border border-[#16A34A]/20">
                    RECOMMENDED
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#111714]">Growing Business</h3>
                  <p className="text-xs text-[#66706A] mt-1.5 leading-relaxed">
                    For growing gyms, studios, and fitness facilities.
                  </p>
                </div>

                {/* Price Hierarchy */}
                <div className="pt-2">
                  <div className="text-xs text-[#8A9690] font-bold line-through">
                    {current.growth.symbol}{current.growth.refPrice}
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-[#16A34A] tracking-tight">
                      {current.growth.symbol}{current.growth.price}
                    </span>
                    <span className="text-xs text-[#66706A] font-semibold">{current.growth.unit}</span>
                  </div>
                </div>

                {/* Feature List */}
                <ul className="space-y-3.5 text-xs font-semibold text-[#111714] border-t border-[#E5EAE6] pt-6">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Up to 1,500 active members</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>12 trainer & staff accounts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Automated WhatsApp reminders</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>RFID & turnstile integration</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Membership automation</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-4">
                <Link
                  href="/signup"
                  className="block w-full text-center py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shadow-md shadow-[#16A34A]/25 active:scale-[0.99]"
                >
                  Start Free
                </Link>
                <div className="text-[11px] text-center text-[#8A9690] font-semibold">
                  No credit card required
                </div>
              </div>
            </div>
          </StarBorder>

          {/* ENTERPRISE CARD */}
          <div className="bg-white border border-[#E5EAE6] rounded-2xl p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#66706A]">
                  ENTERPRISE
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#F1F5F2] text-[#66706A] px-2.5 py-1 rounded-md border border-[#E5EAE6]">
                  MULTI-HUB
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#111714]">Multi-Location</h3>
                <p className="text-xs text-[#66706A] mt-1.5 leading-relaxed">
                  For chains, franchises, and large fitness operations.
                </p>
              </div>

              {/* Price Hierarchy */}
              <div className="pt-2">
                <div className="text-xs text-transparent select-none font-bold">Custom</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-4xl sm:text-5xl font-black text-[#111714] tracking-tight">
                    Custom
                  </span>
                </div>
              </div>

              {/* Feature List */}
              <ul className="space-y-3.5 text-xs font-semibold text-[#111714] border-t border-[#E5EAE6] pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Unlimited members & locations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Dedicated SLA & 99.9% uptime</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Priority 24/7 phone support</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>White-label mobile app options</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-4">
              <Link
                href="/contact"
                className="block w-full text-center py-3 rounded-xl bg-[#111714] hover:bg-[#16A34A] text-white text-xs font-bold transition-all active:scale-[0.99]"
              >
                Book a Demo
              </Link>
              <div className="text-[11px] text-center text-[#8A9690] font-semibold">
                Personalized walkthrough for your team
              </div>
            </div>
          </div>
        </div>

        {/* Prominent Demo CTA Box Below Pricing Cards */}
        <div className="mt-14 bg-[#F7F9F7] border border-[#E5EAE6] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-[#111714]">
              Need help choosing a plan?
            </h4>
            <p className="text-xs sm:text-sm text-[#66706A]">
              See Repsi in action with a personalized demo tailored for your fitness business.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shadow-sm shadow-[#16A34A]/25 shrink-0 active:scale-[0.98]"
          >
            <span>Book a Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
