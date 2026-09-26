"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  BarChart3,
  Settings,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface DockTab {
  id: string;
  label: string;
  icon: any;
  content: {
    title: string;
    metrics: { label: string; val: string; sub: string }[];
    recentItems: { name: string; info: string; tag: string }[];
  };
}

const tabs: DockTab[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    content: {
      title: "Real-time Executive Dashboard",
      metrics: [
        { label: "Today's Revenue", val: "₹42,800", sub: "+12.4% vs yesterday" },
        { label: "Active Check-ins", val: "168 Members", sub: "Peak capacity" },
        { label: "Renewals Pending", val: "14 Expiring", sub: "Auto-reminder sent" },
      ],
      recentItems: [
        { name: "Rahul Sharma", info: "Checked in via QR Gate 1", tag: "07:14 AM" },
        { name: "Annual Gold Pass", info: "Paid via Cashfree UPI (₹15,000)", tag: "Instant" },
        { name: "Suresh P.", info: "Booked PT Session with Coach Alex", tag: "09:00 AM" },
      ],
    },
  },
  {
    id: "members",
    label: "Members",
    icon: Users,
    content: {
      title: "Member Roster & Pass Management",
      metrics: [
        { label: "Total Members", val: "1,420 Active", sub: "94% Retention" },
        { label: "New Signups (30d)", val: "112 Members", sub: "+24% MoM" },
        { label: "Overdue Payments", val: "3 Members", sub: "WhatsApp Sent" },
      ],
      recentItems: [
        { name: "Priya Nair", info: "Plan: Quarterly Studio Pass", tag: "Active" },
        { name: "Vikram Mehta", info: "Plan: VIP Annual All-Access", tag: "Active" },
        { name: "Kavita Rao", info: "Plan: Monthly PT Basic", tag: "Renews in 5d" },
      ],
    },
  },
  {
    id: "trainers",
    label: "Trainers",
    icon: Dumbbell,
    content: {
      title: "Fitness Staff & PT Scheduling",
      metrics: [
        { label: "Active Trainers", val: "12 Coaches", sub: "Fully Certified" },
        { label: "PT Sessions/wk", val: "148 Completed", sub: "99% Attendance" },
        { label: "Trainer Payouts", val: "₹1,24,000", sub: "Calculated" },
      ],
      recentItems: [
        { name: "Coach Alex", info: "18 Active PT clients • 4.9 Rating", tag: "Top Rated" },
        { name: "Coach Sarah", info: "14 Active PT clients • 4.95 Rating", tag: "Top Rated" },
        { name: "Coach Marcus", info: "12 Active PT clients • 4.8 Rating", tag: "Active" },
      ],
    },
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    content: {
      title: "Cashfree Payment Gateway & Subscriptions",
      metrics: [
        { label: "Monthly Processing", val: "₹6,80,000", sub: "100% Cashfree" },
        { label: "UPI Success Rate", val: "99.6%", sub: "Instant Settlement" },
        { label: "GST Tax Collected", val: "₹1,03,800", sub: "Auto-invoiced" },
      ],
      recentItems: [
        { name: "INV-2026-892", info: "₹4,500 • Cashfree UPI Instant", tag: "Settled" },
        { name: "INV-[#2026-891]", info: "₹12,000 • Credit Card EMI", tag: "Settled" },
        { name: "INV-2026-890", info: "₹8,500 • Netbanking Auto-debit", tag: "Settled" },
      ],
    },
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    content: {
      title: "Business Intelligence & Cohort Growth",
      metrics: [
        { label: "Member LTV", val: "₹28,400", sub: "Avg 14 mo lifetime" },
        { label: "Churn Rate", val: "2.1%", sub: "Industry low" },
        { label: "Facility Utilization", val: "84%", sub: "Peak efficiency" },
      ],
      recentItems: [
        { name: "Morning Peak Cohort", info: "06:30 AM - 09:30 AM • 89% Capacity", tag: "Peak" },
        { name: "Evening Spin Class", info: "06:00 PM - 07:30 PM • 100% Booked", tag: "Full" },
        { name: "CrossFit Zone", info: "Average stay duration: 64 mins", tag: "Optimal" },
      ],
    },
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    content: {
      title: "System Config & WhatsApp Automation",
      metrics: [
        { label: "WhatsApp Gateway", val: "Connected", sub: "Official API" },
        { label: "Turnstile Gate", val: "Online", sub: "IP 192.168.1.10" },
        { label: "Role Permissions", val: "8 Roles", sub: "RBAC Enforced" },
      ],
      recentItems: [
        { name: "Auto Renewal Reminder", info: "Triggers 3 days before expiry", tag: "Enabled" },
        { name: "Cashfree Live Webhook", info: "URL: /api/v1/webhooks/cashfree", tag: "Active" },
        { name: "GST Tax Rules", info: "18% CGST/SGST auto split", tag: "Active" },
      ],
    },
  },
];

export function ProductDemoDock() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const current = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section className="relative bg-[#050B07] py-24 px-4 sm:px-6 lg:px-8 text-white overflow-hidden border-t border-b border-[#1a2f22]">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#16A34A]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#22C55E] bg-[#16A34A]/15 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30 mb-4">
            Interactive Product Demo
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7F5]">
            Your business, <span className="text-[#22C55E]">at a glance.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9CA3AF]">
            Use the interactive dock below to navigate through Repsi's core modules.
          </p>
        </div>

        {/* Dashboard Preview Window */}
        <div className="bg-[#0B120E] border border-[#1a2f22] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#1a2f22] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-[#9CA3AF] hidden sm:inline">
                repsi.io/app/{current.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs font-bold text-[#22C55E] bg-[#16A34A]/15 px-2.5 py-0.5 rounded-full border border-[#22C55E]/30">
                Live Environment
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-white">{current.content.title}</h3>

              {/* Metrics row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {current.content.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-[#050B07] border border-[#1a2f22] p-4 rounded-xl"
                  >
                    <div className="text-xs text-[#9CA3AF] font-medium">{m.label}</div>
                    <div className="text-2xl font-black text-white mt-1">{m.val}</div>
                    <div className="text-xs font-semibold text-[#22C55E] mt-1">{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Recent list */}
              <div className="bg-[#050B07] border border-[#1a2f22] rounded-2xl p-4 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-3">
                  Live Activity Feed
                </div>
                {current.content.recentItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#0B120E] border border-[#1a2f22] p-3 rounded-xl"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#F5F7F5]">{item.name}</div>
                      <div className="text-xs text-[#9CA3AF]">{item.info}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#22C55E] bg-[#16A34A]/15 px-2.5 py-1 rounded-md border border-[#22C55E]/20">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating MacOS Style Dock */}
        <div className="mt-8 flex justify-center">
          <div className="bg-[#0B120E]/90 backdrop-blur-2xl border border-[#1a2f22] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center gap-1 p-2.5 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#16A34A] text-white shadow-lg shadow-[#16A34A]/30 scale-105"
                      : "text-[#9CA3AF] hover:text-white hover:bg-[#1a2f22]/60"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] font-bold tracking-tight hidden sm:block">
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeDockDot"
                      className="w-1.5 h-1.5 rounded-full bg-white absolute -bottom-1"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
