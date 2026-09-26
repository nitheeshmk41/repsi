"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
  Dumbbell,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Clock,
  AlertCircle,
  Calendar,
  Check,
} from "lucide-react";

export function HeroDashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered 3D perspective unfold & tilt animation (high visibility scroll effect)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "start 20%"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [25, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 0.9, 1]);
  const translateY = useTransform(scrollYProgress, [0, 1], [85, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl lg:max-w-[1320px] mx-auto mt-8 sm:mt-12 px-2 sm:px-4 z-20"
      style={{ perspective: "1000px" }}
    >
      {/* One extremely subtle radial atmosphere glow centered behind the dashboard */}
      <motion.div
        style={{ opacity }}
        className="absolute -inset-16 sm:-inset-28 rounded-full bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.12)_0%,rgba(22,163,74,0.03)_50%,transparent_75%)] blur-3xl pointer-events-none z-0"
      />

      {/* Realistic Repsi Software Application Interface Container */}
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          y: translateY,
          transformStyle: "preserve-3d",
        }}
        className="relative bg-white border border-[#111714]/15 rounded-2xl p-3.5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.45)] text-[#111714] space-y-4 sm:space-y-6 overflow-hidden"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#E5EAE6] pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-[#111714] bg-[#F1F5F2] px-2.5 sm:px-3 py-1 rounded-md border border-[#E5EAE6]">
              REPSI / OVERVIEW
            </span>
            <span className="text-xs text-[#66706A] font-medium hidden sm:inline">
              Indiranagar Main Hub
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-[#16A34A] font-mono uppercase tracking-wider">
              Live Hub
            </span>
          </div>
        </div>

        {/* 4 Must-Have KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5">
          <div className="bg-[#F7F9F7] border border-[#E5EAE6] p-2.5 sm:p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-[#66706A] font-semibold uppercase tracking-wider truncate">
                Active Members
              </span>
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A] shrink-0" />
            </div>
            <div className="text-lg sm:text-3xl font-black text-[#111714] mt-1 sm:mt-1.5">1,248</div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#16A34A] mt-0.5 sm:mt-1 truncate">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>+42 this month</span>
            </div>
          </div>

          <div className="bg-[#F7F9F7] border border-[#E5EAE6] p-2.5 sm:p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-[#66706A] font-semibold uppercase tracking-wider truncate">
                Attendance
              </span>
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A] shrink-0" />
            </div>
            <div className="text-lg sm:text-3xl font-black text-[#111714] mt-1 sm:mt-1.5">86.4%</div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#16A34A] mt-0.5 sm:mt-1 truncate">
              <span>184 Check-ins</span>
            </div>
          </div>

          <div className="bg-[#F7F9F7] border border-[#E5EAE6] p-2.5 sm:p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-[#66706A] font-semibold uppercase tracking-wider truncate">
                Today Revenue
              </span>
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A] shrink-0" />
            </div>
            <div className="text-lg sm:text-3xl font-black text-[#111714] mt-1 sm:mt-1.5">₹84,200</div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#16A34A] mt-0.5 sm:mt-1 truncate">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>12.4% vs yday</span>
            </div>
          </div>

          <div className="bg-[#F7F9F7] border border-[#E5EAE6] p-2.5 sm:p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-[#66706A] font-semibold uppercase tracking-wider truncate">
                Memberships
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A] shrink-0" />
            </div>
            <div className="text-lg sm:text-3xl font-black text-[#111714] mt-1 sm:mt-1.5">1,104</div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#16A34A] mt-0.5 sm:mt-1 truncate">
              <span>92% renewal</span>
            </div>
          </div>
        </div>

        {/* Middle Row: Today's Occupancy Chart Visual + Live Check-ins Roster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Today's Occupancy Trend Chart */}
          <div className="lg:col-span-7 bg-[#F7F9F7] border border-[#E5EAE6] rounded-xl p-3 sm:p-5 space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5EAE6] pb-2 sm:pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#16A34A]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#111714]">Today's Occupancy</h4>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-[#16A34A]">Peak 92% · 6 PM</span>
            </div>

            {/* Hourly Capacity Visual Graph */}
            <div className="py-1 sm:py-2 space-y-2">
              <div className="flex items-end justify-between h-20 sm:h-24 pt-3 px-1 sm:px-2 border-b border-[#E5EAE6]">
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-5 sm:w-8 bg-[#16A34A]/20 rounded-t h-7 sm:h-8 group-hover:bg-[#16A34A] transition-colors" />
                  <span className="text-[9px] sm:text-[10px] text-[#66706A] font-semibold">6AM</span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-5 sm:w-8 bg-[#16A34A] rounded-t h-14 sm:h-16 group-hover:bg-[#15803D] transition-colors" />
                  <span className="text-[9px] sm:text-[10px] text-[#66706A] font-semibold">9AM</span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-5 sm:w-8 bg-[#16A34A]/40 rounded-t h-9 sm:h-10 group-hover:bg-[#16A34A] transition-colors" />
                  <span className="text-[9px] sm:text-[10px] text-[#66706A] font-semibold">12PM</span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-5 sm:w-8 bg-[#16A34A]/30 rounded-t h-7 sm:h-8 group-hover:bg-[#16A34A] transition-colors" />
                  <span className="text-[9px] sm:text-[10px] text-[#66706A] font-semibold">3PM</span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-5 sm:w-8 bg-[#16A34A] rounded-t h-16 sm:h-20 group-hover:bg-[#15803D] transition-colors" />
                  <span className="text-[9px] sm:text-[10px] text-[#66706A] font-semibold">6PM</span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-5 sm:w-8 bg-[#16A34A]/60 rounded-t h-10 sm:h-12 group-hover:bg-[#16A34A] transition-colors" />
                  <span className="text-[9px] sm:text-[10px] text-[#66706A] font-semibold">9PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Check-ins Feed */}
          <div className="lg:col-span-5 bg-[#F7F9F7] border border-[#E5EAE6] rounded-xl p-3 sm:p-5 space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5EAE6] pb-2 sm:pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#16A34A]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#111714]">Live Check-ins</h4>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#66706A]">184 Check-ins</span>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between bg-white border border-[#E5EAE6] p-2 sm:p-2.5 rounded-lg text-[11px] sm:text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#16A34A]" />
                  <span className="font-bold text-[#111714] truncate">Rahul Sharma</span>
                </div>
                <span className="text-[#66706A] text-[10px] sm:text-[11px] hidden sm:inline">VIP Annual</span>
                <span className="font-mono font-semibold text-[#16A34A] text-[10px] sm:text-[11px]">07:14</span>
              </div>

              <div className="flex items-center justify-between bg-white border border-[#E5EAE6] p-2 sm:p-2.5 rounded-lg text-[11px] sm:text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#16A34A]" />
                  <span className="font-bold text-[#111714] truncate">Ananya Roy</span>
                </div>
                <span className="text-[#66706A] text-[10px] sm:text-[11px] hidden sm:inline">Pilates</span>
                <span className="font-mono font-semibold text-[#16A34A] text-[10px] sm:text-[11px]">07:22</span>
              </div>

              <div className="flex items-center justify-between bg-white border border-[#E5EAE6] p-2 sm:p-2.5 rounded-lg text-[11px] sm:text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#16A34A]" />
                  <span className="font-bold text-[#111714] truncate">Suresh Malhotra</span>
                </div>
                <span className="text-[#66706A] text-[10px] sm:text-[11px] hidden sm:inline">PT Session</span>
                <span className="font-mono font-semibold text-[#16A34A] text-[10px] sm:text-[11px]">07:45</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Trainers & Membership Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Trainers Activity */}
          <div className="bg-[#F7F9F7] border border-[#E5EAE6] rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#E5EAE6] pb-2">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#16A34A]" />
                <h4 className="text-xs font-bold text-[#111714]">Trainers</h4>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-xs">
              <div className="bg-white border border-[#E5EAE6] p-2 sm:p-2.5 rounded-lg">
                <div className="font-bold text-[#111714] truncate">Coach Alex</div>
                <div className="text-[9px] sm:text-[10px] text-[#66706A] truncate">4 sessions</div>
              </div>
              <div className="bg-white border border-[#E5EAE6] p-2 sm:p-2.5 rounded-lg">
                <div className="font-bold text-[#111714] truncate">Coach Sarah</div>
                <div className="text-[9px] sm:text-[10px] text-[#16A34A] font-bold truncate">Booked</div>
              </div>
              <div className="bg-white border border-[#E5EAE6] p-2 sm:p-2.5 rounded-lg">
                <div className="font-bold text-[#111714] truncate">Coach David</div>
                <div className="text-[9px] sm:text-[10px] text-[#66706A] truncate">Available</div>
              </div>
            </div>
          </div>

          {/* Membership Activity */}
          <div className="bg-[#F7F9F7] border border-[#E5EAE6] rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#E5EAE6] pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#16A34A]" />
                <h4 className="text-xs font-bold text-[#111714]">Membership Activity</h4>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
              <div className="bg-white border border-[#E5EAE6] p-2 sm:p-2.5 rounded-lg">
                <div className="text-base sm:text-lg font-black text-[#111714]">23</div>
                <div className="text-[9px] sm:text-[10px] text-[#66706A] font-semibold truncate">Expiring</div>
              </div>
              <div className="bg-white border border-[#E5EAE6] p-2 sm:p-2.5 rounded-lg">
                <div className="text-base sm:text-lg font-black text-[#16A34A]">14</div>
                <div className="text-[9px] sm:text-[10px] text-[#66706A] font-semibold truncate">Renewals</div>
              </div>
              <div className="bg-white border border-[#E5EAE6] p-2 sm:p-2.5 rounded-lg">
                <div className="text-base sm:text-lg font-black text-amber-600">8</div>
                <div className="text-[9px] sm:text-[10px] text-[#66706A] font-semibold truncate">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
