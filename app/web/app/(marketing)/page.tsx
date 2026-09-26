"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  Play,
  RotateCcw,
  Sparkle
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { DemoLogos } from "@/components/marketing/demo-logos";
import { GradientWaves } from "@/components/ui/gradient-waves";
import { FadeIn } from "@/components/ui/fade-in";
import { ScrollExpand } from "@/components/ui/scroll-expand";

function CountUp({ 
  end, 
  prefix = "", 
  suffix = "", 
  formatter 
}: { 
  end: number; 
  prefix?: string; 
  suffix?: string; 
  formatter?: (val: number) => string; 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1100;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end]);

  const displayVal = formatter ? formatter(count) : count.toLocaleString();
  return <>{prefix}{displayVal}{suffix}</>;
}

export default function HomePage() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<"members" | "progress" | "time" | "business" | null>(null);
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    if (!demoActive) return;
    const interval = setInterval(() => {
      setDemoStep((prev) => {
        if (prev >= 3) {
          setDemoActive(false);
          return 0;
        }
        return prev + 1;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [demoActive]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const startDemo = () => {
    setDemoStep(0);
    setDemoActive(true);
  };

  const demoTitles = ["Members Directory", "Attendance Engine", "Payments & Revenue", "Business Analytics"];
  const highlightKey = demoActive
    ? (["members", "progress", "business", "business"][demoStep] as "members" | "progress" | "time" | "business")
    : hoveredFeature;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] font-sans antialiased overflow-x-hidden relative">
      {/* ── 1. Navbar (Sticky with glassmorphism backdrop) ───────────────── */}
      <MarketingNav />

      {/* ── 2. Hero Section (Centered Copy + Dead-Center Scroll Expand Dashboard) ── */}
      <section 
        onMouseMove={handleMouseMove}
        className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-start pt-8 pb-16 overflow-hidden bg-gradient-to-b from-[#f2faf4] via-[#fafdfb] to-white text-zinc-900"
      >
        {/* Ambient Waves & Cursor Radial Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* Dynamic Subtle Cursor Glow */}
          <div 
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34, 197, 94, 0.09), transparent 80%)`,
            }}
          />

          {/* 3 Huge Blurred Green Floating Blobs */}
          <motion.div
            animate={{ x: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-br from-emerald-300/35 via-emerald-400/20 to-emerald-200/10 rounded-full blur-[115px] pointer-events-none z-0"
          />
          <motion.div
            animate={{ x: [0, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200/30 via-teal-300/15 to-transparent rounded-full blur-[110px] pointer-events-none z-0"
          />
          <motion.div
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-gradient-to-tl from-emerald-400/30 via-emerald-300/15 to-transparent rounded-full blur-[115px] pointer-events-none z-0"
          />

          {/* Wave SVG Overlay */}
          <svg className="absolute bottom-0 right-0 w-full h-[450px] text-emerald-50/40" viewBox="0 0 1440 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 320 C 300 150, 700 450, 1500 200 L 1500 600 L -100 600 Z" fill="currentColor" />
          </svg>

          {/* ReactBits Ambient Wave Canvas */}
          <div className="absolute inset-0 opacity-60 pointer-events-none z-0">
            <GradientWaves
              horizonColor="#16A34A"
              waveColor="#22C55E"
              crestColor="#84CC16"
              speed={0.4}
              amplitude={2.2}
              waveScale={1.0}
              waveRatio={0.9}
              swell={22}
              turbulence={18}
              tilt={1.11}
              zoom={1}
              height={5.8}
              fogDepth={14}
              detail="high"
              brightness={1.15}
              opacity={0.8}
              mouseInteraction
              parallaxStrength={0.3}
              grain
              grainIntensity={0.03}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Centered Hero Header Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center pt-6 pb-10">
          
          {/* Main Headline */}
          <FadeIn delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 leading-[1.05] max-w-4xl">
              Run your studio.
              <span className="block text-[#16A34A] mt-1">
                Grow your business.
              </span>
            </h1>
          </FadeIn>

          {/* Subtext Description */}
          <FadeIn delay={0.25}>
            <p className="mt-5 text-lg sm:text-xl text-zinc-600 max-w-2xl font-normal leading-relaxed">
              Members, trainers, attendance, payments, and analytics — all connected in one powerful platform.
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.35}>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#18B968] hover:bg-[#15A85E] text-white font-bold text-base shadow-lg shadow-[#18B968]/25 hover:shadow-xl hover:shadow-[#18B968]/35 transition-all active:scale-[0.98]"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              {/* Watch Demo Button */}
              <button
                onClick={startDemo}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-base transition-all shadow-md hover:shadow-lg border border-zinc-200/90 active:scale-[0.98] group cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${demoActive ? 'bg-[#16A34A] text-white animate-pulse' : 'bg-emerald-100 text-[#18B968] group-hover:bg-[#18B968] group-hover:text-white'}`}>
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>{demoActive ? "Playing Interactive Demo..." : "Watch Demo"}</span>
              </button>

              {/* Google Play link button */}
              <a
                href="https://play.google.com/store/apps/details?id=app.repsi.mobile"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg active:scale-[0.98] border border-zinc-800 group"
              >
                <svg className="w-4 h-4 fill-current text-white group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.37 2.37 0 0 1-.61-1.614V3.428c0-.623.23-1.205.609-1.614zM15.206 13.414l2.766 2.766-12.89 7.42 10.124-10.186zm0-2.828L5.082.4l12.89 7.42-2.766 2.766zm1.996 1.414l3.77-2.17a1.69 1.69 0 0 0 0-2.86l-3.77-2.17-2.12 2.12 2.12 3.08z" />
                </svg>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-400 font-medium">Get it on</span>
                  <span className="text-xs font-bold text-white tracking-tight mt-0.5">Google Play</span>
                </div>
              </a>
            </div>
          </FadeIn>

          {/* Trust Checkmarks */}
          <FadeIn delay={0.45}>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-zinc-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#18B968]" />
                <span>14-day access</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#18B968]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#18B968]" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </FadeIn>

          {/* 4 Interactive Feature Badges */}
          <FadeIn delay={0.55}>
            <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl w-full">
              <div 
                onMouseEnter={() => setHoveredFeature("members")}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${hoveredFeature === "members" || (demoActive && demoStep === 0) ? 'bg-emerald-50 border-[#16A34A] ring-2 ring-emerald-500/40 shadow-sm scale-[1.03]' : 'bg-white/80 border-zinc-200/90 hover:bg-zinc-50'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${hoveredFeature === "members" || (demoActive && demoStep === 0) ? 'bg-[#16A34A] text-white scale-110' : 'bg-emerald-50 text-[#16A34A]'}`}>
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-zinc-900 leading-tight">Manage Members</h4>
                  <p className="text-[10px] text-zinc-500">with ease</p>
                </div>
              </div>

              <div 
                onMouseEnter={() => setHoveredFeature("progress")}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${hoveredFeature === "progress" || (demoActive && demoStep === 1) ? 'bg-emerald-50 border-[#16A34A] ring-2 ring-emerald-500/40 shadow-sm scale-[1.03]' : 'bg-white/80 border-zinc-200/90 hover:bg-zinc-50'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${hoveredFeature === "progress" || (demoActive && demoStep === 1) ? 'bg-[#16A34A] text-white scale-110' : 'bg-emerald-50 text-[#16A34A]'}`}>
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-zinc-900 leading-tight">Track Progress</h4>
                  <p className="text-[10px] text-zinc-500">in real time</p>
                </div>
              </div>

              <div 
                onMouseEnter={() => setHoveredFeature("time")}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${hoveredFeature === "time" ? 'bg-emerald-50 border-[#16A34A] ring-2 ring-emerald-500/40 shadow-sm scale-[1.03]' : 'bg-white/80 border-zinc-200/90 hover:bg-zinc-50'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${hoveredFeature === "time" ? 'bg-[#16A34A] text-white scale-110' : 'bg-emerald-50 text-[#16A34A]'}`}>
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-zinc-900 leading-tight">Save Time</h4>
                  <p className="text-[10px] text-zinc-500">on daily tasks</p>
                </div>
              </div>

              <div 
                onMouseEnter={() => setHoveredFeature("business")}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${hoveredFeature === "business" || (demoActive && (demoStep === 2 || demoStep === 3)) ? 'bg-emerald-50 border-[#16A34A] ring-2 ring-emerald-500/40 shadow-sm scale-[1.03]' : 'bg-white/80 border-zinc-200/90 hover:bg-zinc-50'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${hoveredFeature === "business" || (demoActive && (demoStep === 2 || demoStep === 3)) ? 'bg-[#16A34A] text-white scale-110' : 'bg-emerald-50 text-[#16A34A]'}`}>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-zinc-900 leading-tight">Grow Business</h4>
                  <p className="text-[10px] text-zinc-500">with insights</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Scroll Down Indicator */}
          <FadeIn delay={0.65}>
            <div className="mt-7 flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 animate-bounce">
              <ChevronDown className="w-4 h-4 text-[#16A34A]" />
              <span>Scroll to expand dashboard</span>
              <ChevronDown className="w-4 h-4 text-[#16A34A]" />
            </div>
          </FadeIn>
        </div>

        {/* ── Dead-Center React Bits Scroll Expand Dashboard Component ── */}
        <div className="relative pt-4 pb-12 z-20 w-full flex flex-col items-center">
          
          {/* Demo Mode Step Banner Bar (if active) */}
          {demoActive && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 z-40 bg-zinc-900/95 backdrop-blur-md text-white px-5 py-2 rounded-full border border-emerald-500/40 shadow-xl flex items-center gap-4 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono font-bold text-emerald-400">Interactive Tour:</span>
                <span className="font-bold text-white">{demoTitles[demoStep]}</span>
              </div>
              <button 
                onClick={() => setDemoActive(false)}
                className="text-[10px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono cursor-pointer"
              >
                Stop Demo
              </button>
            </motion.div>
          )}

          {/* React Bits Scroll Expand Component */}
          <ScrollExpand>
            <div className="relative w-full">
              {/* Concentrated Green Radial Glow behind Dashboard */}
              <div className="absolute -inset-6 bg-gradient-to-r from-emerald-300/60 via-emerald-400/40 to-emerald-300/50 rounded-[40px] blur-3xl opacity-80 -z-10 pointer-events-none" />

              {/* Main Framed Clean Dashboard Card (No browser chrome) */}
              <div 
                id="dashboard-preview" 
                className={`rounded-2xl border transition-all duration-300 bg-white shadow-2xl shadow-emerald-950/20 overflow-hidden ring-1 ring-zinc-950/5 ${demoActive ? 'ring-2 ring-emerald-500 shadow-emerald-500/25' : 'border-zinc-200/90'}`}
              >
                {/* Dashboard Inner Layout */}
                <div className="flex h-auto bg-[#f8fafc]">
                  
                  {/* Sidebar */}
                  <div className="hidden sm:flex w-44 border-r border-zinc-200/80 bg-white p-3 flex-col justify-between shrink-0 text-xs">
                    <div className="space-y-3">
                      {/* Workspace Info */}
                      <div className="flex items-center gap-2.5 px-2 py-1.5 mb-2 border-b border-zinc-200/90 pb-2.5">
                        <Image src="/logos/logo_trans.png" alt="REPSI" width={26} height={26} className="object-contain" />
                        <div className="flex flex-col">
                          <span className="font-extrabold text-xs text-zinc-900 tracking-tight leading-none">Repsi</span>
                          <span className="text-[9px] font-semibold text-emerald-600 leading-none mt-1">Apex Fitness</span>
                        </div>
                      </div>

                      {/* Sidebar Nav Items */}
                      <nav className="space-y-2.5">
                        <div>
                          <p className="px-2 text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1">Main</p>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-[#16A34A] font-bold text-xs shadow-2xs border-l-2 border-[#16A34A]">
                              <LayoutDashboard className="w-3.5 h-3.5 text-[#16A34A]" />
                              <span>Dashboard</span>
                            </div>
                            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all text-xs ${highlightKey === 'members' ? 'bg-emerald-100 text-[#16A34A] font-bold ring-2 ring-emerald-500/50 scale-[1.02]' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80'}`}>
                              <Users className="w-3.5 h-3.5" />
                              <span>Members</span>
                            </div>
                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-500 font-medium hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors text-xs">
                              <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Memberships</span>
                            </div>
                            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all text-xs ${highlightKey === 'progress' ? 'bg-emerald-100 text-[#16A34A] font-bold ring-2 ring-emerald-500/50 scale-[1.02]' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80'}`}>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Attendance</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="px-2 text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1">Management</p>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-500 font-medium hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors text-xs">
                              <Dumbbell className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Trainers</span>
                            </div>
                            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-all text-xs ${highlightKey === 'business' ? 'bg-emerald-100 text-[#16A34A] font-bold ring-2 ring-emerald-500/50 scale-[1.02]' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80'}`}>
                              <IndianRupee className="w-3.5 h-3.5" />
                              <span>Payments</span>
                            </div>
                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-500 font-medium hover:bg-zinc-100/80 transition-colors text-xs">
                              <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Analytics</span>
                            </div>
                          </div>
                        </div>
                      </nav>
                    </div>
                  </div>

                  {/* Main Dashboard Panel */}
                  <div className="flex-1 p-4 sm:p-5 space-y-4 overflow-x-hidden">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-1.5">
                          <span>Welcome back, Alex! 👋</span>
                        </h3>
                        <p className="text-xs text-zinc-500">
                          Here&apos;s what&apos;s happening at Apex Fitness today.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 shadow-2xs hover:bg-zinc-50">
                          <Bell className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 text-xs shadow-2xs">
                          <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">AF</div>
                          <div className="hidden md:block text-left">
                            <p className="font-bold leading-none text-zinc-900 text-xs">Apex Fitness</p>
                            <p className="text-[10px] text-zinc-500 leading-none mt-0.5">Gym Owner</p>
                          </div>
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                      </div>
                    </div>

                    {/* 4 Stat Cards with Count-Up Animations */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      
                      {/* Active Members */}
                      <div className={`p-3 rounded-xl border transition-all ${highlightKey === 'members' ? 'border-[#16A34A] bg-emerald-50/70 shadow-md ring-2 ring-emerald-400 scale-[1.02]' : 'border-zinc-200/90 bg-white shadow-2xs'}`}>
                        <div className="flex items-center justify-between text-zinc-400 mb-1">
                          <span className="text-xs font-medium text-zinc-500">Active Members</span>
                          <div className="w-5 h-5 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                            <Users className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <p className="text-lg font-bold text-zinc-900">
                          <CountUp end={1284} />
                        </p>
                        <span className="text-[10px] text-emerald-600 font-semibold">↑ 12% vs last month</span>
                      </div>

                      {/* Monthly Revenue */}
                      <div className={`p-3 rounded-xl border transition-all ${highlightKey === 'business' ? 'border-[#16A34A] bg-emerald-50/70 shadow-md ring-2 ring-emerald-400 scale-[1.02]' : 'border-zinc-200/90 bg-white shadow-2xs'}`}>
                        <div className="flex items-center justify-between text-zinc-400 mb-1">
                          <span className="text-xs font-medium text-zinc-500">Monthly Revenue</span>
                          <div className="w-5 h-5 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                            <IndianRupee className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <p className="text-lg font-bold text-zinc-900">
                          <CountUp end={482500} formatter={(val) => "₹" + val.toLocaleString("en-IN")} />
                        </p>
                        <span className="text-[10px] text-emerald-600 font-semibold">↑ 16% vs last month</span>
                      </div>

                      {/* Today's Attendance */}
                      <div className={`p-3 rounded-xl border transition-all ${highlightKey === 'progress' ? 'border-[#16A34A] bg-emerald-50/70 shadow-md ring-2 ring-emerald-400 scale-[1.02]' : 'border-zinc-200/90 bg-white shadow-2xs'}`}>
                        <div className="flex items-center justify-between text-zinc-400 mb-1">
                          <span className="text-xs font-medium text-zinc-500">Today&apos;s Attendance</span>
                          <div className="w-5 h-5 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                            <UserCheck className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <p className="text-lg font-bold text-zinc-900">
                          <CountUp end={186} />
                        </p>
                        <span className="text-[10px] text-emerald-600 font-semibold">↑ 6% vs yesterday</span>
                      </div>

                      {/* Expiring Soon */}
                      <div className="p-3 rounded-xl border border-zinc-200/90 bg-white shadow-2xs">
                        <div className="flex items-center justify-between text-zinc-400 mb-1">
                          <span className="text-xs font-medium text-zinc-500">Expiring Soon</span>
                          <div className="w-5 h-5 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <p className="text-lg font-bold text-zinc-900">
                          <CountUp end={24} />
                        </p>
                        <span className="text-[10px] text-zinc-400">Memberships</span>
                      </div>
                    </div>

                    {/* Revenue Bar Chart & Attendance Donut */}
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                      
                      {/* Revenue Bar Chart Animation */}
                      <div className={`md:col-span-4 p-3.5 rounded-xl border transition-all ${highlightKey === 'business' ? 'border-[#16A34A] bg-emerald-50/50 ring-2 ring-emerald-400 shadow-md' : 'border-zinc-200/90 bg-white'}`}>
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-zinc-900">Revenue Growth</span>
                            <span className="text-[10px] text-emerald-600 font-semibold ml-2">₹4.82L Jul</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 border border-zinc-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            7 Months <ChevronDown className="w-2.5 h-2.5" />
                          </span>
                        </div>
                        
                        {/* Bar Chart Area */}
                        <div className="relative h-32 flex items-end pt-4">
                          <div className="absolute inset-x-0 top-3 bottom-5 flex flex-col justify-between pointer-events-none">
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-mono text-zinc-400">₹5L</span>
                              <div className="w-[calc(100%-28px)] border-b border-dashed border-zinc-200" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-mono text-zinc-400">₹3.5L</span>
                              <div className="w-[calc(100%-28px)] border-b border-dashed border-zinc-200" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-mono text-zinc-400">₹2L</span>
                              <div className="w-[calc(100%-28px)] border-b border-dashed border-zinc-200" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-mono text-zinc-400">₹0</span>
                              <div className="w-[calc(100%-28px)] border-b border-zinc-200" />
                            </div>
                          </div>

                          {/* Bars Growing from Bottom */}
                          <div className="w-full pl-7 flex items-end justify-between gap-2 h-full pb-5 z-10">
                            {[
                              { label: 'Jan', val: 40, amt: '₹1.9L' },
                              { label: 'Feb', val: 55, amt: '₹2.6L' },
                              { label: 'Mar', val: 65, amt: '₹3.1L' },
                              { label: 'Apr', val: 78, amt: '₹3.7L' },
                              { label: 'May', val: 90, amt: '₹4.3L' },
                              { label: 'Jun', val: 82, amt: '₹3.9L' },
                              { label: 'Jul', val: 100, amt: '₹4.8L', current: true },
                            ].map((bar, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group/bar relative">
                                {/* Active Month Tooltip & Glow */}
                                {bar.current ? (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.3 }}
                                    className="absolute -top-4 flex items-center gap-1 px-1.5 py-0.5 bg-zinc-900 text-white text-[8px] font-mono font-bold rounded shadow-md z-20 whitespace-nowrap"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>{bar.amt} · Jul</span>
                                  </motion.div>
                                ) : (
                                  <span className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-3.5 px-1 py-0.2 bg-zinc-800 text-white text-[8px] font-mono font-bold rounded pointer-events-none">
                                    {bar.amt}
                                  </span>
                                )}

                                {/* Growing Bar Element */}
                                <motion.div
                                  initial={{ height: "0%" }}
                                  animate={{ height: `${bar.val}%` }}
                                  transition={{ duration: 0.6, delay: 0.2 + i * 0.07, ease: "easeOut" }}
                                  className={`w-full rounded-t transition-all ${
                                    bar.current 
                                      ? 'bg-gradient-to-t from-[#16A34A] to-[#22C55E] shadow-md shadow-emerald-500/40 ring-2 ring-emerald-400' 
                                      : 'bg-emerald-200/90 hover:bg-emerald-300/90'
                                  }`}
                                />
                                <span className={`text-[8px] font-mono absolute -bottom-4 ${bar.current ? 'font-bold text-[#16A34A]' : 'text-zinc-400'}`}>
                                  {bar.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Attendance Donut SVG Animation */}
                      <div className={`md:col-span-3 p-3.5 rounded-xl border transition-all flex flex-col justify-between ${highlightKey === 'progress' ? 'border-[#16A34A] bg-emerald-50/50 ring-2 ring-emerald-400 shadow-md' : 'border-zinc-200/90 bg-white'}`}>
                        <span className="text-xs font-bold text-zinc-900">Attendance Today</span>
                        <div className="flex items-center justify-around py-1">
                          
                          {/* SVG Donut Ring */}
                          <div className="relative w-20 h-20 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-zinc-100"
                                strokeWidth="4"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <motion.path
                                className="text-[#16A34A]"
                                strokeWidth="4"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                initial={{ strokeDasharray: "0, 100" }}
                                animate={{ strokeDasharray: "85, 100" }}
                                transition={{ duration: 1.1, delay: 0.5, ease: "easeOut" }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                              <span className="text-sm font-black text-zinc-900 leading-none">
                                <CountUp end={186} />
                              </span>
                              <span className="text-[8px] text-zinc-400 leading-none mt-0.5">Check-ins</span>
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="text-xs space-y-1.5 font-medium">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                              <span className="text-zinc-600">Present</span>
                              <span className="font-bold text-zinc-900 ml-auto">
                                <CountUp end={186} />
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                              <span className="text-zinc-600">Absent</span>
                              <span className="font-bold text-zinc-900 ml-auto">32</span>
                            </div>
                            <div className="border-t border-zinc-200 pt-1 flex justify-between gap-3 text-zinc-500 text-[10px]">
                              <span>Total</span>
                              <span className="font-bold text-zinc-900">218</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Members & Activity & Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-0.5">
                      
                      {/* Recent Members */}
                      <div className={`p-3 rounded-xl border transition-all ${highlightKey === 'members' ? 'border-[#16A34A] bg-emerald-50/50 ring-2 ring-emerald-400 shadow-xs' : 'border-zinc-200/90 bg-white'}`}>
                        <span className="text-xs font-bold text-zinc-900">Recent Members</span>
                        <div className="space-y-1.5 text-[10px] mt-1.5">
                          {[
                            { name: 'Priya Sharma', time: 'Joined 2 days ago' },
                            { name: 'Rahul Verma', time: 'Joined 4 days ago' },
                            { name: 'Sneha Iyer', time: 'Joined 1 week ago' },
                          ].map((m, i) => (
                            <div key={i} className="flex items-center justify-between py-0.5 border-b border-zinc-100 last:border-none">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#16A34A] text-[9px] font-bold flex items-center justify-center">
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
                      <div className="p-3 rounded-xl border border-zinc-200/90 bg-white space-y-1.5">
                        <span className="text-xs font-bold text-zinc-900">Recent Activity</span>
                        <div className="space-y-1.5 text-[9px] mt-1.5">
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
                        </div>
                      </div>

                      {/* Quick Actions Panel */}
                      <div className={`p-3 rounded-xl border transition-all ${highlightKey === 'time' ? 'border-[#16A34A] bg-emerald-50/50 ring-2 ring-emerald-400 shadow-xs' : 'border-zinc-200/90 bg-white'}`}>
                        <span className="text-xs font-bold text-zinc-900">Quick Actions</span>
                        <div className="grid grid-cols-2 gap-1.5 text-[9px] mt-1.5">
                          <button className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-100 hover:bg-[#16A34A] hover:text-white text-zinc-800 font-semibold transition-all">
                            <span className="truncate">Add Member</span>
                            <Plus className="w-3 h-3 shrink-0 ml-0.5" />
                          </button>
                          <button className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-100 hover:bg-[#16A34A] hover:text-white text-zinc-800 font-semibold transition-all">
                            <span className="truncate">Attendance</span>
                            <CalendarCheck className="w-3 h-3 shrink-0 ml-0.5" />
                          </button>
                          <button className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-100 hover:bg-[#16A34A] hover:text-white text-zinc-800 font-semibold transition-all">
                            <span className="truncate">Membership</span>
                            <FileText className="w-3 h-3 shrink-0 ml-0.5" />
                          </button>
                          <button className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-100 hover:bg-[#16A34A] hover:text-white text-zinc-800 font-semibold transition-all">
                            <span className="truncate">Message</span>
                            <Send className="w-3 h-3 shrink-0 ml-0.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </ScrollExpand>
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
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">
            Region-Based Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            Simple gym management. One platform. Every device.
          </h2>
          <p className="text-base text-[var(--text-secondary)]">
            Transparent plans for gyms in India ($ / ₹) and worldwide.
          </p>
        </div>

        {/* Founding 5 Gyms Banner */}
        <div className="max-w-4xl mx-auto mb-10 p-6 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-[var(--surface)] to-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-extrabold uppercase tracking-wider">Founding 5 Worldwide</span>
            <h3 className="text-lg font-bold text-[var(--text)] mt-1">First 5 Gyms — 3 Months Completely Free</h3>
            <p className="text-xs text-[var(--text-muted)]">Full Growth plan • No setup fee • No credit card required • $20/mo or ₹1,049/mo lifetime price afterward.</p>
          </div>
          <Link href="/pricing" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs tracking-wider uppercase whitespace-nowrap hover:bg-emerald-400 transition-colors">
            Claim Offer
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {/* Starter */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">For small gyms</span>
              <h3 className="font-bold text-base text-[var(--text)]">Starter</h3>
              <p className="text-2xl font-extrabold text-[var(--text)] mt-3">$15 <span className="text-xs font-normal text-[var(--text-muted)]">/mo (₹999)</span></p>
              <ul className="mt-4 space-y-2 text-xs text-[var(--text-secondary)]">
                <li>• Up to 250 active members</li>
                <li>• QR attendance check-in</li>
                <li>• WhatsApp renewal alerts</li>
                <li>• Standard email support</li>
              </ul>
            </div>
            <Link href="/pricing" className="mt-6 block text-center py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold hover:bg-[var(--surface-hover)] transition-colors">
              View Plan
            </Link>
          </div>

          {/* Growth */}
          <div className="p-5 rounded-2xl border-2 border-[var(--primary)] bg-[var(--surface)] shadow-lg flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-[9px] font-bold uppercase tracking-wider">
              Most Popular
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase text-[var(--primary)]">For growing gyms</span>
              <h3 className="font-bold text-base text-[var(--text)]">Growth</h3>
              <p className="text-2xl font-extrabold text-[var(--text)] mt-3">$29 <span className="text-xs font-normal text-[var(--text-muted)]">/mo (₹2,499)</span></p>
              <ul className="mt-4 space-y-2 text-xs text-[var(--text-secondary)]">
                <li>• Up to 1,500 active members</li>
                <li>• Automated renewal engine</li>
                <li>• Class & trainer scheduling</li>
                <li>• GST invoicing & receipts</li>
              </ul>
            </div>
            <Link href="/pricing" className="mt-6 block text-center py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-colors">
              Claim 3 Months Free
            </Link>
          </div>

          {/* Pro */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Serious businesses</span>
              <h3 className="font-bold text-base text-[var(--text)]">Pro</h3>
              <p className="text-2xl font-extrabold text-[var(--text)] mt-3">$49 <span className="text-xs font-normal text-[var(--text-muted)]">/mo (₹4,999)</span></p>
              <ul className="mt-4 space-y-2 text-xs text-[var(--text-secondary)]">
                <li>• Unlimited active members</li>
                <li>• Churn prediction radar</li>
                <li>• Trainer commission system</li>
                <li>• Dedicated onboarding</li>
              </ul>
            </div>
            <Link href="/pricing" className="mt-6 block text-center py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold hover:bg-[var(--surface-hover)] transition-colors">
              View Plan
            </Link>
          </div>

          {/* Business */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Multi-location</span>
              <h3 className="font-bold text-base text-[var(--text)]">Business</h3>
              <p className="text-2xl font-extrabold text-[var(--text)] mt-3">$99+ <span className="text-xs font-normal text-[var(--text-muted)]">/mo (₹9,999+)</span></p>
              <ul className="mt-4 space-y-2 text-xs text-[var(--text-secondary)]">
                <li>• Multi-gym franchise view</li>
                <li>• White-label member app</li>
                <li>• Cross-branch attendance</li>
                <li>• Custom 99.99% SLA</li>
              </ul>
            </div>
            <Link href="/contact" className="mt-6 block text-center py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold hover:bg-[var(--surface-hover)] transition-colors">
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
                src="https://www.youtube-nocookie.com/embed/0zgAjPJAfmE?autoplay=1&rel=0&modestbranding=1"
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
