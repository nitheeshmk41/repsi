"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Dumbbell,
  Users,
  Waves,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";

interface OptionData {
  id: string;
  name: string;
  icon: any;
  headline: string;
  subtext: string;
  features: string[];
  metricLabel: string;
  metricValue: string;
  previewCardTitle: string;
  previewCardDetail: string;
}

const options: OptionData[] = [
  {
    id: "owner",
    name: "Owner",
    icon: Building2,
    headline: "Multi-branch leadership & real-time P&L insights",
    subtext: "Track membership growth, staff performance, and automated daily payouts from a single executive view.",
    features: ["Multi-location branch management", "Automated daily bank settlements", "Staff payroll & attendance logs"],
    metricLabel: "Average ROI Boost",
    metricValue: "+32%",
    previewCardTitle: "Executive P&L Dashboard",
    previewCardDetail: "Live updates across all 3 locations • Net profit up 24% this quarter",
  },
  {
    id: "trainer",
    name: "Trainer",
    icon: Dumbbell,
    headline: "Personalized coaching, schedules & client progress",
    subtext: "Empower fitness trainers with client tracking, workout logging, PT package balances, and session reminders.",
    features: ["Digital workout plan builder", "Session check-ins & logs", "Client attendance history"],
    metricLabel: "Session Retention",
    metricValue: "96.4%",
    previewCardTitle: "Trainer Schedule & Client Roster",
    previewCardDetail: "14 PT sessions completed today • 0 no-shows recorded",
  },
  {
    id: "member",
    name: "Member",
    icon: Users,
    headline: "Seamless mobile pass, class booking & renewal alerts",
    subtext: "Delight your members with a frictionless mobile app experience, instant QR entry, and auto-renewals.",
    features: ["Contactless QR code pass", "Class & slot reservations", "Instant payment receipts"],
    metricLabel: "Member CSAT Score",
    metricValue: "4.9 / 5",
    previewCardTitle: "Member Mobile Experience",
    previewCardDetail: "Active Annual VIP Pass • 18 gym visits logged this month",
  },
  {
    id: "gym",
    name: "Gym",
    icon: Building2,
    headline: "High-volume fitness facility management built for scale",
    subtext: "Handle thousands of member check-ins, automated turnstile access, and bulk membership renewals effortlessly.",
    features: ["High-speed gate turnstile sync", "Automated WhatsApp dues recovery", "Locker & equipment management"],
    metricLabel: "Turnstile Speed",
    metricValue: "< 0.4s",
    previewCardTitle: "High-Volume Gym Operations",
    previewCardDetail: "482 daily check-ins today • Peak hours: 06:00 AM - 09:00 AM",
  },
  {
    id: "studio",
    name: "Studio",
    icon: Sparkles,
    headline: "Boutique studio class scheduling & pack management",
    subtext: "Manage class capacities, session packs, instructor payouts, and waitlists for your Pilates or HIIT studio.",
    features: ["Class capacity & waitlists", "Class pack credit tracking", "Instructor commission reports"],
    metricLabel: "Class Occupancy",
    metricValue: "91%",
    previewCardTitle: "Studio Class Management",
    previewCardDetail: "Spinning & Pilates classes fully booked • 12 on waitlist",
  },
  {
    id: "pool",
    name: "Pool",
    icon: Waves,
    headline: "Aquatics center lane booking & swim coaching",
    subtext: "Manage pool lane schedules, swimming academy enrollments, instructor assignments, and safety logs.",
    features: ["Lane allocation & booking", "Swim academy batch management", "Temperature & maintenance logs"],
    metricLabel: "Batch Capacity",
    metricValue: "100%",
    previewCardTitle: "Aquatics & Swim Academy",
    previewCardDetail: "Morning batch 100% filled • 4 trainers active pool side",
  },
  {
    id: "yoga",
    name: "Yoga",
    icon: Sparkles,
    headline: "Mindful workshop registrations & recurring passes",
    subtext: "Streamline yoga shala memberships, weekend workshop tickets, retreat bookings, and online class links.",
    features: ["Workshop ticketing & passes", "Private 1-on-1 slot booking", "Hybrid online class integration"],
    metricLabel: "Workshop Sales",
    metricValue: "+45%",
    previewCardTitle: "Yoga Shala & Workshop Hub",
    previewCardDetail: "Weekend Pranayama Masterclass • 40 seats filled",
  },
];

export function OptionWheel() {
  const [selectedId, setSelectedId] = useState<string>("owner");
  const activeOption = options.find((o) => o.id === selectedId) || options[0];

  return (
    <section className="relative bg-[#FFFFFF] py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E5EAE6] text-[#111714]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#16A34A] bg-[#F1F5F2] px-3.5 py-1.5 rounded-full border border-[#E5EAE6] mb-4">
            Adaptive Platform
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111714]">
            Repsi adapts to the <span className="text-[#16A34A]">way you work.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#66706A]">
            Select a role or business type below to explore customized features and workflows.
          </p>
        </div>

        {/* Horizontal Option Selector / Wheel Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 mb-12">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedId(opt.id)}
                className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#16A34A] text-white shadow-lg shadow-[#16A34A]/25 scale-105"
                    : "bg-[#F1F5F2] text-[#111714] hover:bg-[#E5EAE6] border border-[#E5EAE6]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-[#16A34A]"}`} />
                <span>{opt.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Panel */}
        <div className="bg-[#F7F9F7] border border-[#E5EAE6] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOption.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Details */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#16A34A] bg-[#16A34A]/10 px-3 py-1 rounded-full border border-[#16A34A]/20">
                  <activeOption.icon className="w-3.5 h-3.5" />
                  <span>{activeOption.name} Mode</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#111714] leading-tight">
                  {activeOption.headline}
                </h3>

                <p className="text-base text-[#66706A] leading-relaxed">
                  {activeOption.subtext}
                </p>

                <div className="space-y-3 pt-2">
                  {activeOption.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#16A34A]/15 flex items-center justify-center text-[#16A34A]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-[#111714]">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-6 border-t border-[#E5EAE6]">
                  <div>
                    <div className="text-xs text-[#66706A] font-medium">{activeOption.metricLabel}</div>
                    <div className="text-2xl font-black text-[#16A34A]">{activeOption.metricValue}</div>
                  </div>
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111714] text-white text-xs font-bold hover:bg-[#16A34A] transition-colors ml-auto">
                    <span>Explore {activeOption.name} Features</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Visual Card */}
              <div className="lg:col-span-6 bg-white border border-[#E5EAE6] rounded-2xl p-6 shadow-md space-y-5">
                <div className="flex items-center justify-between border-b border-[#E5EAE6] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
                      <activeOption.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#111714]">
                        {activeOption.previewCardTitle}
                      </h4>
                      <p className="text-xs text-[#66706A]">{activeOption.previewCardDetail}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-1 rounded-lg">
                    Active Profile
                  </span>
                </div>

                {/* Mock Data Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#F7F9F7] p-4 rounded-xl border border-[#E5EAE6]">
                    <span className="text-[11px] font-semibold text-[#66706A]">System Status</span>
                    <div className="text-sm font-bold text-[#111714] mt-1">100% Operational</div>
                  </div>
                  <div className="bg-[#F7F9F7] p-4 rounded-xl border border-[#E5EAE6]">
                    <span className="text-[11px] font-semibold text-[#66706A]">Auto Payment Sync</span>
                    <div className="text-sm font-bold text-[#16A34A] mt-1">Cashfree Gateway</div>
                  </div>
                </div>

                <div className="bg-[#F1F5F2] p-4 rounded-xl border border-[#E5EAE6] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-[#16A34A]" />
                    <span className="text-xs font-semibold text-[#111714]">
                      Configured for {activeOption.name} workflows
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#16A34A]">Ready</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
