"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  Dumbbell,
  User,
  CheckCircle2,
} from "lucide-react";

interface RoleData {
  id: "owner" | "trainer" | "member";
  role: string;
  badge: string;
  subtitle: string;
  icon: any;
  features: string[];
  metrics: { label: string; value: string; change: string }[];
  uiSnippet: {
    title: string;
    sub: string;
    list: { title: string; detail: string; status: string }[];
  };
}

const roles: RoleData[] = [
  {
    id: "owner",
    role: "Owner",
    badge: "OWNER DASHBOARD",
    subtitle: "Manage your entire fitness business from one place.",
    icon: UserCheck,
    features: ["Revenue Analytics", "Member Retention", "Branch Performance", "Staff Management"],
    metrics: [
      { label: "Monthly Revenue", value: "₹4,85,000", change: "+18.4% YoY" },
      { label: "Active Members", value: "1,248", change: "+42 this mo" },
      { label: "Retention Rate", value: "94.2%", change: "+2.1% cohort" },
      { label: "Branch Performance", value: "3 Hubs Live", change: "100% active" },
    ],
    uiSnippet: {
      title: "Owner Command Center",
      sub: "Live multi-branch revenue & daily settlement overview",
      list: [
        { title: "Indiranagar Main Hub", detail: "₹1,84,200 processed today • 184 Check-ins", status: "Active" },
        { title: "Koramangala Branch", detail: "₹2,10,500 processed today • 212 Check-ins", status: "Active" },
        { title: "HSR Layout Studio", detail: "₹1,33,800 processed today • 140 Check-ins", status: "Active" },
      ],
    },
  },
  {
    id: "trainer",
    role: "Trainer",
    badge: "TRAINER PORTAL",
    subtitle: "Manage clients, sessions, schedules, and progress.",
    icon: Dumbbell,
    features: ["Active Clients", "PT Session Schedules", "Workout Logs", "Client Progress"],
    metrics: [
      { label: "Today's Sessions", value: "6 Scheduled", change: "4 Completed" },
      { label: "Active Clients", value: "34 Members", change: "Full Roster" },
      { label: "Upcoming Session", value: "05:00 PM", change: "Strength PR" },
      { label: "Client Progress", value: "98.5%", change: "Target Met" },
    ],
    uiSnippet: {
      title: "Trainer Daily Schedule & PT Log",
      sub: "Personal training sessions & client workout notes",
      list: [
        { title: "Rahul Sharma (07:00 AM)", detail: "Hypertrophy Chest & Triceps • Session 8/12", status: "Completed" },
        { title: "Ananya Roy (09:30 AM)", detail: "Cardio & Core Strength Assessment", status: "Completed" },
        { title: "Suresh Malhotra (05:00 PM)", detail: "Barbell Squat Form & Heavy PR Check", status: "Upcoming" },
      ],
    },
  },
  {
    id: "member",
    role: "Member",
    badge: "MEMBER EXPERIENCE",
    subtitle: "Track memberships, attendance, sessions, and progress.",
    icon: User,
    features: ["Digital QR Check-in", "Attendance History", "Class Booking", "Membership Expiry"],
    metrics: [
      { label: "Current Membership", value: "Annual VIP", change: "Active Pass" },
      { label: "Attendance", value: "19 Check-ins", change: "Streak 4d" },
      { label: "Upcoming Session", value: "HIIT Spin 7PM", change: "Slot Booked" },
      { label: "Membership Expiry", value: "240 Days Left", change: "Auto-renew" },
    ],
    uiSnippet: {
      title: "Member Mobile Pass & Passport",
      sub: "Instant QR door access & active class bookings",
      list: [
        { title: "Turnstile Gate Entrance 1", detail: "Scanned at 06:45 AM • Gate Unlocked", status: "Verified" },
        { title: "Personal Training Pack", detail: "4 of 12 PT sessions remaining", status: "Active" },
        { title: "Digital Locker Reservation", detail: "Locker #42 assigned until 08:30 AM", status: "Occupied" },
      ],
    },
  },
];

export function AccordionGallery() {
  const [activeId, setActiveId] = useState<string>("owner");

  return (
    <section className="relative bg-[#050B07] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-white">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#16A34A]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#22C55E] bg-[#16A34A]/15 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30">
            One Platform • Every Role
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7F5]">
            One platform. <span className="text-[#22C55E]">Every role.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
            Owners, trainers, and members each get an experience designed around what they need.
          </p>
        </div>

        {/* Role Selection & Product Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Role List (3 Roles ONLY) */}
          <div className="lg:col-span-4 flex flex-col gap-3.5">
            {roles.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                    isActive
                      ? "bg-[#0B120E] border-[#22C55E] shadow-xl shadow-[#16A34A]/25 ring-1 ring-[#22C55E]/40"
                      : "bg-[#050B07]/80 border-[#1a2f22] hover:border-[#16A34A]/60 hover:bg-[#0B120E]/60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Human/Person Line Icon Container */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? "bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/30"
                          : "bg-[#0B120E] text-[#9CA3AF] group-hover:text-[#22C55E] border border-[#1a2f22]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">
                          {item.role}
                        </h3>
                        <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#16A34A]/20 text-[#22C55E] border border-[#22C55E]/30 uppercase">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#9CA3AF] leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Product Preview Panel */}
          <div className="lg:col-span-8 bg-[#0B120E] border border-[#1a2f22] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {roles.map(
                (item) =>
                  item.id === activeId && (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 relative z-10"
                    >
                      {/* Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a2f22] pb-4">
                        <div>
                          <span className="text-xs font-mono font-bold text-[#22C55E] uppercase tracking-wider">
                            {item.badge}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                            {item.role} Operating View
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.features.map((f, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F5F7F5] bg-[#050B07] border border-[#1a2f22] px-3 py-1 rounded-lg"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 4 Metric Cards Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {item.metrics.map((m, idx) => (
                          <div
                            key={idx}
                            className="bg-[#050B07] border border-[#1a2f22] p-3.5 rounded-xl space-y-1"
                          >
                            <div className="text-[11px] text-[#9CA3AF] font-semibold truncate">{m.label}</div>
                            <div className="text-lg sm:text-xl font-black text-white truncate">{m.value}</div>
                            <div className="text-[10px] font-bold text-[#22C55E] truncate">
                              {m.change}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Live Application UI Preview */}
                      <div className="bg-[#050B07] border border-[#1a2f22] rounded-2xl p-4 sm:p-5 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-[#1a2f22] pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                            <span className="text-xs font-mono text-[#9CA3AF] ml-2">
                              repsi://app/{item.id}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-[#22C55E] bg-[#16A34A]/15 px-2.5 py-0.5 rounded-full border border-[#22C55E]/30 uppercase">
                            Live Interface
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-extrabold text-white">{item.uiSnippet.title}</h4>
                          <p className="text-xs text-[#9CA3AF] mt-0.5">{item.uiSnippet.sub}</p>
                        </div>

                        <div className="space-y-2">
                          {item.uiSnippet.list.map((row, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-[#0B120E] border border-[#1a2f22] p-3 rounded-xl hover:border-[#16A34A]/40 transition-colors text-xs"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />
                                <div>
                                  <div className="font-bold text-white">
                                    {row.title}
                                  </div>
                                  <div className="text-[11px] text-[#9CA3AF] mt-0.5">{row.detail}</div>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-[#22C55E] bg-[#16A34A]/15 px-2.5 py-1 rounded-md border border-[#22C55E]/30 shrink-0">
                                {row.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
