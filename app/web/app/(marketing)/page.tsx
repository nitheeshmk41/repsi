"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  CalendarCheck, 
  BarChart3, 
  Dumbbell, 
  Receipt, 
  Smartphone, 
  Sparkles, 
  Clock, 
  Zap, 
  TrendingUp, 
  ChevronRight,
  QrCode,
  Building2,
  Search,
  Bell,
  ChevronDown,
  IndianRupee,
  LayoutDashboard,
  UserCheck,
  MessageSquare,
  Settings,
  Plus,
  FileText,
  Send,
  X,
  ArrowUp,
  Play
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { DemoLogos } from "@/components/marketing/demo-logos";
import { GradientWaves } from "@/components/ui/gradient-waves";
import { FadeIn } from "@/components/ui/fade-in";

export default function HomePage() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] font-sans antialiased overflow-x-hidden relative">
      {/* ── 1. Navbar (Transparent in Hero Section) ────────────────────────── */}
      <MarketingNav />

      {/* ── 2. Hero Section (Explicit Light Theme & Screen Height Fit) ── */}
      <section className="relative min-h-[calc(100vh-4rem)] lg:max-h-[920px] flex flex-col justify-center py-6 lg:py-8 overflow-hidden bg-gradient-to-b from-[#eaf8ee] via-[#f4fcf7] to-white text-zinc-900">
        {/* Organic Green Curve & Ambient Wave Backdrop */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* Organic light green background glow shape with reduced bottom border radius */}
          <div className="absolute -top-10 right-0 w-[60vw] h-[800px] bg-gradient-to-br from-emerald-200/60 via-emerald-100/40 to-transparent rounded-bl-[40px] blur-3xl opacity-90" />
          
          {/* Wave SVG Overlay */}
          <svg className="absolute bottom-0 right-0 w-full h-[500px] text-emerald-100/70" viewBox="0 0 1440 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 320 C 300 150, 700 450, 1500 200 L 1500 600 L -100 600 Z" fill="currentColor" />
          </svg>

          {/* ReactBits Gradient Waves Canvas — High Contrast & Extremely Visible */}
          <div className="absolute inset-0 opacity-100 pointer-events-none z-0">
            <GradientWaves
              horizonColor="#16A34A"
              waveColor="#22C55E"
              crestColor="#84CC16"
              speed={0.5}
              amplitude={3.0}
              waveScale={0.8}
              waveRatio={0.9}
              swell={38}
              turbulence={20}
              tilt={1.11}
              zoom={1}
              height={5.8}
              fogDepth={12}
              detail="high"
              brightness={1.35}
              opacity={1.0}
              mouseInteraction
              parallaxStrength={0.5}
              grain
              grainIntensity={0.04}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
            
            {/* Left Column: Text & CTAs & Feature Icons */}
            <div className="lg:col-span-5 flex flex-col justify-center text-left pt-2">
              {/* Headline */}
              <FadeIn delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 leading-[1.06]">
                  Run your studio.
                  <span className="block text-[#16A34A] mt-0.5">
                    Grow your business.
                  </span>
                </h1>
              </FadeIn>

              {/* Subtext */}
              <FadeIn delay={0.3}>
                <p className="mt-3.5 text-base sm:text-lg text-zinc-600 max-w-xl font-normal leading-relaxed">
                  Manage members, memberships, attendance, trainers, payments, and analytics — all in one place.
                </p>
              </FadeIn>

              {/* CTAs */}
              <FadeIn delay={0.4}>
                <div className="mt-6 flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm shadow-lg shadow-[#16A34A]/25 transition-all active:scale-[0.98]"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setVideoOpen(true)}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full border border-zinc-300 bg-white/90 backdrop-blur-sm text-zinc-900 font-semibold text-sm hover:bg-white transition-all shadow-sm group active:scale-[0.98]"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] pl-0.5 font-bold group-hover:scale-110 transition-transform">
                      ▶
                    </div>
                    <span>See how it works</span>
                  </button>
                </div>
              </FadeIn>

              {/* Trust Checkmarks */}
              <FadeIn delay={0.5}>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-semibold text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>14-day access</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </FadeIn>

              {/* 4 Feature Highlights */}
              <FadeIn delay={0.6}>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-zinc-200/90">
                  <div className="space-y-0.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mb-1.5">
                      <Users className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-900 leading-tight">Manage Members</h4>
                    <p className="text-[11px] text-zinc-500">with ease</p>
                  </div>
                  <div className="space-y-0.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mb-1.5">
                      <BarChart3 className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-900 leading-tight">Track Progress</h4>
                    <p className="text-[11px] text-zinc-500">in real time</p>
                  </div>
                  <div className="space-y-0.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mb-1.5">
                      <CalendarCheck className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-900 leading-tight">Save Time</h4>
                    <p className="text-[11px] text-zinc-500">on daily tasks</p>
                  </div>
                  <div className="space-y-0.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mb-1.5">
                      <TrendingUp className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-900 leading-tight">Grow Your Business</h4>
                    <p className="text-[11px] text-zinc-500">with insights</p>
                  </div>
                </div>
              </FadeIn>

              {/* Handwriting Script text bottom left */}
              <FadeIn delay={0.7}>
                <div className="mt-6 font-handwriting text-3xl text-zinc-400 -rotate-3 select-none flex flex-col items-start leading-none">
                  <span>Fitness Management</span>
                  <span className="relative">
                    Made Simple
                    <svg className="absolute -bottom-1 left-0 w-full h-2.5 text-[#16A34A]/50" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="4">
                      <path d="M5,15 Q50,2 95,15" />
                    </svg>
                  </span>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Light Dashboard Mockup + Bright Athlete Image */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              <FadeIn delay={0.4} direction="up" className="w-full relative">
                {/* Backdrop Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200/60 via-emerald-100/40 to-emerald-200/50 rounded-[32px] blur-2xl opacity-70 -z-10 pointer-events-none" />

                {/* Main Dashboard Window Container (Pure White Light Mode) */}
                <div id="dashboard-preview" className="rounded-2xl border border-zinc-200/90 bg-white shadow-2xl shadow-emerald-950/10 overflow-hidden">
                  
                  {/* Browser Mac OS Window Bar (Clean Mobile Responsive, No TENANT badge) */}
                  <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-zinc-200/80 bg-zinc-100/90 text-xs gap-2">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]" />
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]" />
                    </div>

                    {/* URL Bar */}
                    <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] text-zinc-600 bg-white px-3 py-1 rounded-md border border-zinc-200 shadow-2xs max-w-[240px] sm:max-w-md w-full justify-center">
                      <Search className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span className="truncate">repsi.app/apex-fitness/dashboard</span>
                    </div>

                    {/* Live Indicator Dot */}
                    <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-semibold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                      <span className="hidden sm:inline">LIVE</span>
                    </div>
                  </div>

                  {/* Dashboard Layout inside Mockup (Pure Crisp Light Palette) */}
                  <div className="flex h-auto bg-[#f8fafc]">
                    
                    {/* Mini Sidebar */}
                    <div className="hidden sm:flex w-44 border-r border-zinc-200/80 bg-white p-3 flex-col justify-between shrink-0 text-xs">
                      <div className="space-y-3.5">
                        {/* Logo */}
                        <div className="flex items-center gap-2 px-2 py-0.5">
                          <Image src="/logos/repsi_logo_black.png" alt="REPSI" width={28} height={28} className="object-contain" />
                          <span className="font-extrabold text-sm text-zinc-900 tracking-tight">Repsi</span>
                        </div>

                        {/* Nav Items */}
                        <nav className="space-y-1">
                          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#e6f7ec] text-[#16A34A] font-bold">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                          </div>
                          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-zinc-600 font-medium hover:bg-zinc-100">
                            <Users className="w-4 h-4" />
                            <span>Members</span>
                          </div>
                          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-zinc-600 font-medium hover:bg-zinc-100">
                            <CreditCard className="w-4 h-4" />
                            <span>Memberships</span>
                          </div>
                          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-zinc-600 font-medium hover:bg-zinc-100">
                            <UserCheck className="w-4 h-4" />
                            <span>Attendance</span>
                          </div>
                          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-zinc-600 font-medium hover:bg-zinc-100">
                            <Dumbbell className="w-4 h-4" />
                            <span>Trainers</span>
                          </div>
                          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-zinc-600 font-medium hover:bg-zinc-100">
                            <IndianRupee className="w-4 h-4" />
                            <span>Payments</span>
                          </div>
                          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-zinc-600 font-medium hover:bg-zinc-100">
                            <BarChart3 className="w-4 h-4" />
                            <span>Analytics</span>
                          </div>
                          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-zinc-600 font-medium hover:bg-zinc-100">
                            <MessageSquare className="w-4 h-4" />
                            <span>Messages</span>
                          </div>
                          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-zinc-600 font-medium hover:bg-zinc-100">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </div>
                        </nav>
                      </div>
                    </div>

                    {/* Main Dashboard Content */}
                    <div className="flex-1 p-3.5 sm:p-4 space-y-3 overflow-x-hidden">
                      
                      {/* Top Header inside Dashboard */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                            Welcome back, Alex! 👋
                          </h3>
                          <p className="text-[11px] text-zinc-500">
                            Here&apos;s what&apos;s happening at Apex Fitness today.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600">
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-zinc-200 text-[11px]">
                            <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[9px] font-bold">AF</div>
                            <div className="hidden md:block text-left">
                              <p className="font-bold leading-none text-zinc-900 text-[10px]">Apex Fitness</p>
                              <p className="text-[9px] text-zinc-500 leading-none mt-0.5">Gym Owner</p>
                            </div>
                            <ChevronDown className="w-3 h-3 text-zinc-400" />
                          </div>
                        </div>
                      </div>

                      {/* 4 Stat Cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        <div className="p-2.5 rounded-xl border border-zinc-200/90 bg-white shadow-2xs">
                          <div className="flex items-center justify-between text-zinc-400 mb-1">
                            <span className="text-[10px] font-medium text-zinc-500">Active Members</span>
                            <div className="w-4.5 h-4.5 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                              <Users className="w-3 h-3" />
                            </div>
                          </div>
                          <p className="text-base font-bold text-zinc-900">1,284</p>
                          <span className="text-[9px] text-emerald-600 font-semibold">↑ 12% vs last month</span>
                        </div>

                        <div className="p-2.5 rounded-xl border border-zinc-200/90 bg-white shadow-2xs">
                          <div className="flex items-center justify-between text-zinc-400 mb-1">
                            <span className="text-[10px] font-medium text-zinc-500">Monthly Revenue</span>
                            <div className="w-4.5 h-4.5 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                              <IndianRupee className="w-3 h-3" />
                            </div>
                          </div>
                          <p className="text-base font-bold text-zinc-900">₹4,82,500</p>
                          <span className="text-[9px] text-emerald-600 font-semibold">↑ 16% vs last month</span>
                        </div>

                        <div className="p-2.5 rounded-xl border border-zinc-200/90 bg-white shadow-2xs">
                          <div className="flex items-center justify-between text-zinc-400 mb-1">
                            <span className="text-[10px] font-medium text-zinc-500">Today&apos;s Attendance</span>
                            <div className="w-4.5 h-4.5 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                              <UserCheck className="w-3 h-3" />
                            </div>
                          </div>
                          <p className="text-base font-bold text-zinc-900">186</p>
                          <span className="text-[9px] text-emerald-600 font-semibold">↑ 6% vs yesterday</span>
                        </div>

                        <div className="p-2.5 rounded-xl border border-zinc-200/90 bg-white shadow-2xs">
                          <div className="flex items-center justify-between text-zinc-400 mb-1">
                            <span className="text-[10px] font-medium text-zinc-500">Expiring Soon</span>
                            <div className="w-4.5 h-4.5 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                              <Clock className="w-3 h-3" />
                            </div>
                          </div>
                          <p className="text-base font-bold text-zinc-900">24</p>
                          <span className="text-[9px] text-zinc-400">Memberships</span>
                        </div>
                      </div>

                      {/* Middle Row: Revenue Bar Chart & Attendance Donut */}
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5">
                        
                        {/* Revenue Bar Chart */}
                        <div className="md:col-span-4 p-3 rounded-xl border border-zinc-200/90 bg-white space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-zinc-900">Revenue Overview</span>
                            <span className="text-[10px] text-zinc-500 border border-zinc-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                              Last 7 months <ChevronDown className="w-2.5 h-2.5" />
                            </span>
                          </div>
                          <div className="h-24 flex items-end justify-between gap-2 pt-2">
                            {[
                              { label: 'Jan', val: 40 },
                              { label: 'Feb', val: 55 },
                              { label: 'Mar', val: 65 },
                              { label: 'Apr', val: 78 },
                              { label: 'May', val: 90 },
                              { label: 'Jun', val: 82 },
                              { label: 'Jul', val: 100 },
                            ].map((bar, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                                <div
                                  className="w-full rounded-t bg-gradient-to-t from-emerald-400 to-[#16A34A] opacity-90 hover:opacity-100 transition-all"
                                  style={{ height: `${bar.val}%` }}
                                />
                                <span className="text-[9px] font-mono text-zinc-400">{bar.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Attendance Donut Ring */}
                        <div className="md:col-span-3 p-3 rounded-xl border border-zinc-200/90 bg-white flex flex-col justify-between">
                          <span className="text-xs font-bold text-zinc-900">Attendance Today</span>
                          <div className="flex items-center justify-around py-0.5">
                            {/* Ring Mock SVG */}
                            <div className="relative w-16 h-16 flex items-center justify-center">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                  className="text-zinc-100"
                                  strokeWidth="4"
                                  stroke="currentColor"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                  className="text-[#16A34A]"
                                  strokeDasharray="85, 100"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                  stroke="currentColor"
                                  fill="none"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-xs font-black text-zinc-900 leading-none">186</span>
                                <span className="text-[7px] text-zinc-400 leading-none mt-0.5">Check-ins</span>
                              </div>
                            </div>

                            {/* Legend */}
                            <div className="text-[10px] space-y-1 font-medium">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                                <span className="text-zinc-600">Present</span>
                                <span className="font-bold text-zinc-900 ml-auto">186</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-zinc-300" />
                                <span className="text-zinc-600">Absent</span>
                                <span className="font-bold text-zinc-900 ml-auto">32</span>
                              </div>
                              <div className="border-t border-zinc-200 pt-0.5 flex justify-between gap-2 text-zinc-500 text-[9px]">
                                <span>Total</span>
                                <span className="font-bold text-zinc-900">218</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Grid: Recent Members, Activity, Quick Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-0.5">
                        
                        {/* Recent Members */}
                        <div className="p-2.5 rounded-xl border border-zinc-200/90 bg-white space-y-1.5">
                          <span className="text-xs font-bold text-zinc-900">Recent Members</span>
                          <div className="space-y-1.5 text-[10px]">
                            {[
                              { name: 'Priya Sharma', time: 'Joined 2 days ago' },
                              { name: 'Rahul Verma', time: 'Joined 4 days ago' },
                              { name: 'Sneha Iyer', time: 'Joined 1 week ago' },
                            ].map((m, i) => (
                              <div key={i} className="flex items-center justify-between py-0.5 border-b border-zinc-100 last:border-none">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-[#16A34A] text-[9px] font-bold flex items-center justify-center">
                                    {m.name[0]}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-zinc-900 leading-none">{m.name}</p>
                                    <p className="text-[8px] text-zinc-400 leading-none mt-0.5">{m.time}</p>
                                  </div>
                                </div>
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-[#16A34A] text-[8px] font-bold">
                                  Active
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="p-2.5 rounded-xl border border-zinc-200/90 bg-white space-y-1.5">
                          <span className="text-xs font-bold text-zinc-900">Recent Activity</span>
                          <div className="space-y-1.5 text-[9px]">
                            <div className="flex items-start gap-1.5">
                              <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mt-0.5 shrink-0">
                                <FileText className="w-2.5 h-2.5" />
                              </div>
                              <div>
                                <p className="font-semibold text-zinc-900 leading-tight">Membership renewed</p>
                                <p className="text-zinc-400">Rahul Verma · 2h ago</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5 shrink-0">
                                <Users className="w-2.5 h-2.5" />
                              </div>
                              <div>
                                <p className="font-semibold text-zinc-900 leading-tight">New member added</p>
                                <p className="text-zinc-400">Sneha Iyer · 5h ago</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mt-0.5 shrink-0">
                                <IndianRupee className="w-2.5 h-2.5" />
                              </div>
                              <div>
                                <p className="font-semibold text-zinc-900 leading-tight">Payment received</p>
                                <p className="text-zinc-400">₹12,000 · 1d ago</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="p-2.5 rounded-xl border border-zinc-200/90 bg-white space-y-1.5">
                          <span className="text-xs font-bold text-zinc-900">Quick Actions</span>
                          <div className="grid grid-cols-2 gap-1 text-[9px]">
                            <button className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold transition-colors">
                              <span>Add Member</span>
                              <Plus className="w-3 h-3 text-zinc-400" />
                            </button>
                            <button className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold transition-colors">
                              <span>Mark Attendance</span>
                              <CalendarCheck className="w-3 h-3 text-zinc-400" />
                            </button>
                            <button className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold transition-colors">
                              <span>Create Membership</span>
                              <FileText className="w-3 h-3 text-zinc-400" />
                            </button>
                            <button className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold transition-colors">
                              <span>Send Message</span>
                              <Send className="w-3 h-3 text-zinc-400" />
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Right Edge: Bright Fitness Athlete Image Card & Overlay */}
                <div className="hidden xl:block absolute -right-10 bottom-4 w-44 rounded-2xl overflow-hidden border-2 border-white shadow-2xl z-20 group transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="relative h-60 w-full">
                    <Image
                      src="/images/marketing/hero_athlete.jpg"
                      alt="REPSI Fitness"
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
                    
                    {/* Handwriting Text Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white font-handwriting text-2xl leading-none font-bold">
                      <p>Stronger Gyms</p>
                      <p className="text-emerald-400">Brighter Communities</p>
                      <svg className="w-full h-2 text-emerald-400 mt-1" viewBox="0 0 100 10" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5,5 Q50,1 95,5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. Trusted-By / Demo Logos Section ─────────────────────────────── */}
      <DemoLogos />

      {/* ── 5. Core Features Grid ──────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
            Everything in One Operating System
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight mt-2">
            Powerful tools engineered for gym owners.
          </h2>
          <p className="text-base text-[var(--text-secondary)] mt-4">
            Replace fragmented spreadsheets, paper registers, and clunky legacy software with one fast, unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Member Management",
              desc: "Complete member profiles, digital contract signing, medical tags, locker allocations, and status tracking.",
              icon: Users,
              badge: "Fast Onboarding",
            },
            {
              title: "Membership Lifecycle",
              desc: "Flexible tiers, automated UPI recurring payments, grace period renewals, plan freezes, and cancellation audits.",
              icon: CreditCard,
              badge: "Revenue Automation",
            },
            {
              title: "Reception & QR Check-in",
              desc: "Sub-second RFID, barcode, and mobile QR scanning with live peak-capacity monitoring and reception fast-lookup.",
              icon: CalendarCheck,
              badge: "Zero Queues",
            },
            {
              title: "Coaches & Schedule",
              desc: "Trainer certifications, group class timetables, PT commission calculations, and client personal workout programs.",
              icon: Dumbbell,
              badge: "Class Rosters",
            },
            {
              title: "Finance & Expenses",
              desc: "Cashbook ledger, automated GST invoices, vendor payouts, utility tracking, and operational net profit analytics.",
              icon: Receipt,
              badge: "GST Compliant",
            },
            {
              title: "Predictive Intelligence",
              desc: "Early churn risk warnings for inactive members, LTV calculations, retention cohort curves, and hourly occupancy heatmaps.",
              icon: BarChart3,
              badge: "AI Powered",
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--background)] text-[var(--text-muted)] border border-[var(--border)]">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">{feat.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 6. Product Workflow Section ────────────────────────────────────── */}
      <section className="py-20 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
              Effortless Setup
            </span>
            <h2 className="text-3xl font-extrabold text-[var(--text)] tracking-tight mt-2">
              From signup to live in 5 minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                title: "Provision your Workspace",
                desc: "Choose your unique gym slug (e.g. repsi.app/ironcore) and establish your branding, staff roles, and initial plans.",
              },
              {
                step: "02",
                title: "Register & Scan Members",
                desc: "Import existing members from Excel in 1 click or onboard walk-ins with instant digital QR passes on their phones.",
              },
              {
                step: "03",
                title: "Automate Growth & Revenue",
                desc: "Sit back as WhatsApp renewal reminders send automatically, attendance logs in real time, and revenue charts update.",
              },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)]">
                <span className="text-3xl font-mono font-black text-[var(--primary-dark)] dark:text-[var(--primary-hover)] opacity-70">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-[var(--text)] mt-3">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Deep-Dive: Member Management ─────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
              Members Directory
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight mt-2">
              Know every member. Build better relationships.
            </h2>
            <p className="text-base text-[var(--text-secondary)] mt-4 leading-relaxed">
              Every client gets a dedicated 360° profile. Track active membership plans, total lifetime visits, payment invoices, body measurements, and assigned workout plans in one single view.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Instant search by name, phone, or membership ID</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Automated WhatsApp renewal reminders 7 days prior to expiry</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Digital health notes, emergency contacts, and personal trainer assignments</span>
              </li>
            </ul>

            <div className="mt-8">
              <Link
                href="/features"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary-dark)] dark:text-[var(--primary-hover)] hover:underline"
              >
                <span>Explore member features</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl">
            <Image
              src="/images/trainer_coaching.jpg"
              alt="Personal trainer coaching member at gym"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
            {/* Overlay badge */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-white text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">Personal Coaching & Member Tracking</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">Assigned coach: Vikram Sethi · Strength 5x5 Program</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Deep-Dive: Attendance & Reception Scanner ─────────────────────── */}
      <section className="py-24 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl">
              <Image
                src="/images/reception_checkin.jpg"
                alt="Gym reception desk digital check-in terminal"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-white text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">Turnstile & Front Desk Check-in</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">Sub-second QR scan · 186 check-ins recorded today</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)] font-mono font-bold">
                  FAST PASS
                </span>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
                Reception Fast-Desk
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight mt-2">
                Know who&apos;s in your gym. Zero reception bottlenecks.
              </h2>
              <p className="text-base text-[var(--text-secondary)] mt-4 leading-relaxed">
                Empower your reception staff with a high-speed scanner screen. Search members by mobile number or let them scan their personal QR code for touchless, instant check-in.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                  <p className="text-[var(--text-muted)]">Live Floor Occupancy</p>
                  <p className="text-xl font-bold text-[var(--text)] mt-1">74.5%</p>
                  <span className="text-emerald-500 font-semibold">Optimal flow</span>
                </div>
                <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                  <p className="text-[var(--text-muted)]">Average Check-in Time</p>
                  <p className="text-xl font-bold text-[var(--text)] mt-1">&lt; 0.8s</p>
                  <span className="text-emerald-500 font-semibold">No queues</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Deep-Dive: Payments & Revenue ─────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
            Billing & Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight mt-2">
            Keep your gym&apos;s finances organized.
          </h2>
          <p className="text-base text-[var(--text-secondary)] mt-3">
            Real-time cashbook, automated UPI receipts, operational overhead expense tracking, and GST-ready invoices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Gross Monthly Revenue</span>
            <p className="text-3xl font-bold text-[var(--text)] mt-2">₹4,82,500</p>
            <p className="text-xs text-emerald-500 font-semibold mt-1">↑ 8.2% vs previous month</p>
            <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] space-y-1.5">
              <div className="flex justify-between"><span>UPI & Netbanking</span><span className="font-bold">78%</span></div>
              <div className="flex justify-between"><span>Credit / Debit Card</span><span className="font-bold">14%</span></div>
              <div className="flex justify-between"><span>Cash at Reception</span><span className="font-bold">8%</span></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Operating Outflow & Expenses</span>
            <p className="text-3xl font-bold text-rose-500 mt-2">₹1,84,000</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Operating margin: 61.8%</p>
            <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] space-y-1.5">
              <div className="flex justify-between"><span>Facility Rent</span><span className="font-bold">₹95,000</span></div>
              <div className="flex justify-between"><span>Electricity & Air-Con</span><span className="font-bold">₹38,500</span></div>
              <div className="flex justify-between"><span>Equipment Maintenance</span><span className="font-bold">₹22,000</span></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Renewal Success Rate</span>
            <p className="text-3xl font-bold text-emerald-500 mt-2">91.4%</p>
            <p className="text-xs text-emerald-500 font-semibold mt-1">Automated WhatsApp payment links</p>
            <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] space-y-1.5">
              <div className="flex justify-between"><span>Auto-Renew Active</span><span className="font-bold">642</span></div>
              <div className="flex justify-between"><span>Grace Period Payers</span><span className="font-bold">48</span></div>
              <div className="flex justify-between"><span>Average Days to Renew</span><span className="font-bold">1.8d</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Mobile Experience Section (Flutter App Preview) ─────────────── */}
      <section className="py-24 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)] text-xs font-bold font-mono mb-4">
                <Smartphone className="w-3.5 h-3.5" />
                <span>FLUTTER MOBILE SUITE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
                Your gym in your members&apos; pockets.
              </h2>
              <p className="text-base text-[var(--text-secondary)] mt-4 leading-relaxed">
                Give your members a branded mobile app experience. Seamless digital pass check-in, class seat reservation, workout logging, and one-tap membership renewal right from iOS and Android.
              </p>

              <div className="mt-6 space-y-3.5 text-sm text-[var(--text-secondary)]">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <QrCode className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[var(--text)]">Digital QR Pass</strong>
                    <p className="text-xs text-[var(--text-muted)]">Touchless check-in at turnstiles and front desk without physical plastic cards.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Dumbbell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[var(--text)]">Trainer Assigned Workouts</strong>
                    <p className="text-xs text-[var(--text-muted)]">Members log sets, reps, and weights programmed directly by their personal coach.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[var(--text)]">Class Reservation</strong>
                    <p className="text-xs text-[var(--text-muted)]">Book spots in HIIT, CrossFit, and Yoga classes with real-time waitlists.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Mockup Frame */}
            <div className="flex justify-center">
              <div className="w-[300px] sm:w-[320px] rounded-[44px] p-3.5 bg-zinc-950 border-4 border-zinc-800 shadow-2xl relative">
                {/* Dynamic Island Notch */}
                <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-3" />

                {/* Screen Content */}
                <div className="rounded-[32px] bg-zinc-900 border border-zinc-800 p-4 text-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-zinc-400 font-mono">APEX FITNESS MEMBER</p>
                      <p className="font-bold text-sm">Arun Kumar</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                      ACTIVE
                    </span>
                  </div>

                  {/* QR Pass Box */}
                  <div className="p-4 rounded-2xl bg-white text-zinc-950 text-center space-y-2">
                    <div className="w-28 h-28 mx-auto bg-zinc-100 rounded-xl flex items-center justify-center p-2 border border-zinc-200">
                      <QrCode className="w-24 h-24 text-zinc-900" />
                    </div>
                    <p className="text-[10px] font-mono font-bold tracking-wider text-zinc-600">MEM-ARUN-001</p>
                  </div>

                  {/* Today's Workout Card */}
                  <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-[11px]">Today&apos;s Workout</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Push Day</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">Bench Press · 4x8 @ 80kg</p>
                    <p className="text-[10px] text-zinc-400">Incline Dumbbell Press · 3x10</p>
                  </div>

                  {/* Class Countdown */}
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-emerald-400">MetCon HIIT (06:30 AM)</span>
                    <span className="text-[10px] text-zinc-300 font-mono">Spot #14</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. Pricing Overview CTA ────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
            Simple Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight mt-2">
            Plans built to scale with your facility.
          </h2>
          <p className="text-base text-[var(--text-secondary)] mt-3">
            Every plan includes member management, attendance scanner, and full analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-[var(--text)]">Starter</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">For boutique studios and single gym owners</p>
              <p className="text-3xl font-extrabold text-[var(--text)] mt-4">₹2,499<span className="text-xs font-normal text-[var(--text-muted)]">/month</span></p>
              <ul className="mt-6 space-y-2.5 text-xs text-[var(--text-secondary)]">
                <li>• Up to 250 active members</li>
                <li>• Front-desk QR check-in</li>
                <li>• WhatsApp renewal reminders</li>
                <li>• Basic revenue reports</li>
              </ul>
            </div>
            <Link href="/signup" className="mt-8 block text-center py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm font-semibold hover:bg-[var(--surface-hover)] transition-colors">
              Get Started
            </Link>
          </div>

          <div className="p-6 rounded-2xl border-2 border-[var(--primary)] bg-[var(--surface)] shadow-lg flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </span>
            <div>
              <h3 className="font-bold text-lg text-[var(--text)]">Growth Pro</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">For expanding fitness clubs and gyms</p>
              <p className="text-3xl font-extrabold text-[var(--text)] mt-4">₹4,999<span className="text-xs font-normal text-[var(--text-muted)]">/month</span></p>
              <ul className="mt-6 space-y-2.5 text-xs text-[var(--text-secondary)]">
                <li>• Up to 1,500 active members</li>
                <li>• Multi-turnstile attendance hardware</li>
                <li>• Trainer & class management</li>
                <li>• Advanced churn prediction radar</li>
                <li>• Automated GST invoicing</li>
              </ul>
            </div>
            <Link href="/signup" className="mt-8 block text-center py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors">
              Start 14-Day Free Trial
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-[var(--text)]">Enterprise</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">For multi-location gym chains & franchises</p>
              <p className="text-3xl font-extrabold text-[var(--text)] mt-4">₹9,999<span className="text-xs font-normal text-[var(--text-muted)]">/month</span></p>
              <ul className="mt-6 space-y-2.5 text-xs text-[var(--text-secondary)]">
                <li>• Unlimited members & locations</li>
                <li>• Multi-branch franchise dashboard</li>
                <li>• Custom branded member mobile app</li>
                <li>• Dedicated account engineer</li>
              </ul>
            </div>
            <Link href="/contact" className="mt-8 block text-center py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm font-semibold hover:bg-[var(--surface-hover)] transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ── 12. Interactive FAQ Section ────────────────────────────────────── */}
      <section className="py-20 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              Everything you need to know about getting started with REPSI.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Can I import existing members from Excel or Google Sheets?",
                a: "Yes. REPSI includes a 1-click CSV importer. You can map your existing member names, phone numbers, active plans, and start dates seamlessly in minutes.",
              },
              {
                q: "Do I need special hardware for attendance check-in?",
                a: "No special hardware required. You can run REPSI check-in on any tablet, iPad, phone, or laptop at your reception desk. We also support barcode scanners, RFID readers, and turnstiles.",
              },
              {
                q: "How does workspace-scoped routing work?",
                a: "Every gym receives its own dedicated URL (e.g. repsi.app/your-gym). This guarantees strict tenant data isolation, clean multi-location support, and custom branding.",
              },
              {
                q: "Can my personal trainers have their own logins?",
                a: "Yes. Role-based access control allows owners to assign Trainer or Staff roles, restricting financial revenue access while enabling class rosters and workout plan assignments.",
              },
            ].map((faq, i) => (
              <div key={i} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                <h3 className="font-semibold text-sm text-[var(--text)]">{faq.q}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. Final CTA Banner ───────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-[var(--surface)] border-2 border-[var(--primary)] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
              Ready to elevate your gym operations?
            </h2>
            <p className="text-base text-[var(--text-secondary)]">
              Join leading fitness clubs and studios running on REPSI. Get started in minutes.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-base hover:bg-[var(--primary-hover)] transition-all shadow-md active:scale-[0.98]"
              >
                <span>Create Gym Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] font-medium text-base hover:bg-[var(--surface-hover)] transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 14. Categorized Footer ─────────────────────────────────────────── */}
      <MarketingFooter />

      {/* ── 15. Scroll-to-Top Floating Button (Bottom Right) ──────────────── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-zinc-900 text-white shadow-2xl hover:bg-[#16A34A] transition-all hover:scale-110 active:scale-95 flex items-center justify-center group border border-zinc-700/50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* ── 16. YouTube Video Modal ("See how it works") ──────────────────── */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-all animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900/90 text-white">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold tracking-tight">REPSI Studio Operating System — Platform Overview</span>
              </div>
              <button
                onClick={() => setVideoOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive 16:9 Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/5qap5aO4i9A?autoplay=1&rel=0&modestbranding=1"
                title="REPSI Platform Overview Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <p>Experience the all-in-one studio management platform.</p>
              <Link
                href="/signup"
                onClick={() => setVideoOpen(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-bold transition-all"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
