"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  CreditCard,
  CalendarCheck,
  BarChart3,
  Dumbbell,
  Receipt,
  Zap,
  Building2,
  Waves,
  ShieldCheck,
  Sparkles,
  Bell,
  Check,
  Star,
  UserCheck,
  Activity,
  QrCode,
} from "lucide-react";
import dynamic from "next/dynamic";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { RotatingText } from "@/components/ui/rotating-text";
import { ClickSpark } from "@/components/ui/click-spark";
import { SpecularButton } from "@/components/ui/specular-button";
import { GlareHover } from "@/components/ui/glare-hover";
import { StarBorder } from "@/components/ui/star-border";
import { Stepper } from "@/components/ui/stepper";
import { FlowingMenu } from "@/components/ui/flowing-menu";
import { FadeIn } from "@/components/ui/fade-in";
import { CurvedLoop } from "@/components/ui/curved-loop";
import { HeroDashboardPreview } from "@/components/ui/hero-dashboard-preview";
import { PricingSection } from "@/components/ui/pricing-section";
import { BackToTop } from "@/components/ui/back-to-top";
import { ImageTrail } from "@/components/ui/image-trail";

// Dynamically import heavy WebGL and interactive components to optimize FCP and TTI
const GradientWaves = dynamic(
  () => import("@/components/ui/gradient-waves").then((mod) => mod.GradientWaves),
  { ssr: false }
);

const Antigravity = dynamic(
  () => import("@/components/ui/antigravity").then((mod) => mod.Antigravity),
  { ssr: false }
);

const AccordionGallery = dynamic(
  () => import("@/components/ui/accordion-gallery").then((mod) => mod.AccordionGallery),
  { ssr: false }
);

const OptionWheel = dynamic(
  () => import("@/components/ui/option-wheel").then((mod) => mod.OptionWheel),
  { ssr: false }
);

const LanyardSection = dynamic(
  () => import("@/components/ui/lanyard").then((mod) => mod.LanyardSection),
  { ssr: false }
);

export default function MarketingLandingPage() {

  const stepsData = [
    {
      number: "01",
      title: "Create your business",
      description: "Set up your gym, studio, or pool profile in 2 minutes. Configure membership tiers, Cashfree gateway, and operating hours.",
    },
    {
      number: "02",
      title: "Configure your setup",
      description: "Define class schedules, QR gate access rules, and automated WhatsApp payment reminders.",
    },
    {
      number: "03",
      title: "Add your team",
      description: "Invite trainers, front desk staff, and managers with granular role-based permissions.",
    },
    {
      number: "04",
      title: "Invite members",
      description: "Bulk import your existing roster or allow members to register via your branded pass page.",
    },
    {
      number: "05",
      title: "Run your business",
      description: "Track contactless QR check-ins, automated WhatsApp fee collection, and live P&L analytics effortlessly.",
    },
  ];

  const flowingMenuItems = [
    {
      label: "GYMS",
      description: "High-throughput turnstile gates, locker management, and multi-tier memberships.",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      label: "FITNESS STUDIOS",
      description: "Boutique Pilates, HIIT & Spin slot bookings with waitlist automation.",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      label: "YOGA",
      description: "Mindful workshop registrations, drop-in passes, and hybrid online class links.",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      label: "SWIMMING POOLS",
      description: "Aquatics center lane reservations, batch capacity, and swimming academy coaching.",
      icon: <Waves className="w-5 h-5" />,
    },
    {
      label: "TRAINERS",
      description: "Client workout plans, PT session balance tracking, and automated commission calculations.",
      icon: <Dumbbell className="w-5 h-5" />,
    },
  ];

  const masonryItems = [
    { title: "Attendance", desc: "Automated turnstile & QR door check-in sync.", icon: UserCheck },
    { title: "Payments", desc: "Instant Cashfree UPI, Cards & Netbanking auto-debit.", icon: CreditCard },
    { title: "Members", desc: "Digital pass cards & subscription lifecycle control.", icon: Users },
    { title: "Trainers", desc: "PT session logs, client notes & commission split.", icon: Dumbbell },
    { title: "Scheduling", desc: "Interactive class timetable & slot capacity lock.", icon: CalendarCheck },
    { title: "Notifications", desc: "Automated WhatsApp fee reminders & receipt delivery.", icon: Bell },
    { title: "Reports", desc: "Export GST-compliant invoices & daily closing totals.", icon: Receipt },
    { title: "Subscriptions", desc: "Flexible recurring monthly, quarterly or annual plans.", icon: Zap },
    { title: "Analytics", desc: "Live P&L cohort retention & attendance heatmaps.", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111714] font-sans antialiased selection:bg-[#16A34A] selection:text-white">
      {/* 01. TRANSPARENT HERO NAVBAR */}
      <MarketingNav />

      {/* 02. DARK HERO SECTION WITH IMAGE TRAIL & EMERGING REALISTIC DASHBOARD */}
      <section className="relative bg-[#050B07] pt-32 sm:pt-36 pb-0 text-white overflow-hidden">
        <ImageTrail>
          {/* ReactBits WebGL Gradient Waves Animation (Full Viewport Edge-to-Edge & Down to Curve) */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-85 overflow-hidden">
            <GradientWaves
              horizonColor="#050B07"
              waveColor="#16A34A"
              crestColor="#4ADE80"
              speed={0.75}
              amplitude={3.8}
              waveScale={0.7}
              swell={35}
              turbulence={20}
              height={2.8}
              brightness={1.35}
              opacity={0.9}
              detail="medium"
            />
          </div>

          {/* Antigravity background particles */}
          <Antigravity count={12} />

          <div className="mx-auto max-w-5xl text-center relative z-10 space-y-6 px-4 sm:px-6 lg:px-8">
            {/* Huge Headline with Art Direction typography scale */}
            <FadeIn direction="up" delay={0.05}>
              <h1 className="text-3xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#F5F7F5] leading-[1.15] sm:leading-[1.08] px-2">
                Everything you need to <br className="hidden sm:block" />
                run your{" "}
                <span className="text-[#22C55E]">
                  <RotatingText words={["Gym", "Studio", "Pool", "Yoga"]} interval={2600} />
                </span>
              </h1>
            </FadeIn>

            {/* Restrained Body Copy */}
            <FadeIn direction="up" delay={0.15}>
              <p className="max-w-2xl mx-auto text-sm sm:text-lg text-[#9CA3AF] leading-relaxed font-normal px-4">
                Manage members, trainers, attendance, memberships, payments, and operations from one platform.
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn direction="up" delay={0.25}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 px-4 sm:px-0 max-w-xs sm:max-w-none mx-auto">
                <ClickSpark sparkColor="#22C55E" sparkCount={8}>
                  <SpecularButton href="/signup" variant="primary" size="md">
                    <span>Start with Repsi →</span>
                  </SpecularButton>
                </ClickSpark>

                <SpecularButton href="#showcase" variant="secondary" size="md">
                  <span>Explore Platform</span>
                </SpecularButton>
              </div>
            </FadeIn>
          </div>

          {/* Realistic Repsi Software Dashboard Emerging from Bottom of Hero */}
          <FadeIn direction="up" delay={0.35}>
            <HeroDashboardPreview />
          </FadeIn>

          {/* 03. CURVED LOOP TRANSITION AT BOTTOM OF HERO */}
          <div className="mt-8 sm:mt-12 relative z-20">
            <CurvedLoop />
          </div>
        </ImageTrail>
      </section>

      {/* 04. "YOUR BUSINESS, CONNECTED" (MAGIC BENTO SECTION) */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E5EAE6]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#16A34A] bg-[#F1F5F2] px-3.5 py-1.5 rounded-full border border-[#E5EAE6] mb-4">
              Comprehensive Operations
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111714]">
              Your entire fitness business, <span className="text-[#16A34A]">connected.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#66706A]">
              Everything you need to manage members, trainers, attendance, memberships, payments, and operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: MEMBERS */}
            <GlareHover glareColor="rgba(34, 197, 94, 0.08)">
              <div className="h-full bg-white border border-[#E5EAE6] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold mb-4">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#111714]">MEMBERS</h3>
                  <p className="text-xs text-[#66706A] mt-2 leading-relaxed">
                    Manage member profiles, membership passports, renewal alerts, and activity history.
                  </p>
                </div>
                {/* Mini Repsi UI Preview */}
                <div className="bg-[#F7F9F7] p-3 rounded-xl border border-[#E5EAE6] space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-[#111714]">
                    <span>Member Directory</span>
                    <span className="text-[#16A34A]">1,248 Active</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-[#E5EAE6]">
                    <span className="font-semibold text-[#111714]">Arjun S. • Annual VIP</span>
                    <span className="text-[#16A34A] font-bold">Active</span>
                  </div>
                </div>
              </div>
            </GlareHover>

            {/* Card 2: TRAINERS */}
            <GlareHover glareColor="rgba(34, 197, 94, 0.08)">
              <div className="h-full bg-white border border-[#E5EAE6] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold mb-4">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#111714]">TRAINERS</h3>
                  <p className="text-xs text-[#66706A] mt-2 leading-relaxed">
                    Manage fitness trainers, client assignments, PT workout schedules, and commissions.
                  </p>
                </div>
                {/* Mini Repsi UI Preview */}
                <div className="bg-[#F7F9F7] p-3 rounded-xl border border-[#E5EAE6] space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-[#111714]">
                    <span>PT Roster</span>
                    <span className="text-[#16A34A]">12 Coaches</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-[#E5EAE6]">
                    <span className="font-semibold text-[#111714]">Coach Alex • 18 Clients</span>
                    <span className="text-[#16A34A] font-bold">4.9 ★</span>
                  </div>
                </div>
              </div>
            </GlareHover>

            {/* Card 3: ATTENDANCE */}
            <GlareHover glareColor="rgba(34, 197, 94, 0.08)">
              <div className="h-full bg-white border border-[#E5EAE6] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold mb-4">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#111714]">ATTENDANCE</h3>
                  <p className="text-xs text-[#66706A] mt-2 leading-relaxed">
                    Track turnstile check-ins, QR gate access logs, and facility occupancy in real-time.
                  </p>
                </div>
                {/* Mini Repsi UI Preview */}
                <div className="bg-[#F7F9F7] p-3 rounded-xl border border-[#E5EAE6] space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-[#111714]">
                    <span>QR Turnstile Gate 1</span>
                    <span className="text-[#16A34A]">Sub-0.4s</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-[#E5EAE6]">
                    <span className="font-semibold text-[#111714]">Rahul V. Scanned</span>
                    <span className="text-[#16A34A] font-bold">Granted</span>
                  </div>
                </div>
              </div>
            </GlareHover>

            {/* Card 4: PAYMENTS */}
            <GlareHover glareColor="rgba(34, 197, 94, 0.08)">
              <div className="h-full bg-white border border-[#E5EAE6] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold mb-4">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#111714]">PAYMENTS</h3>
                  <p className="text-xs text-[#66706A] mt-2 leading-relaxed">
                    Manage memberships, Cashfree UPI settlements, billing records, and automated receipts.
                  </p>
                </div>
                {/* Mini Repsi UI Preview */}
                <div className="bg-[#F7F9F7] p-3 rounded-xl border border-[#E5EAE6] space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-[#111714]">
                    <span>Cashfree Gateway</span>
                    <span className="text-[#16A34A]">99.6% Success</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-[#E5EAE6]">
                    <span className="font-semibold text-[#111714]">₹84,200 Processed</span>
                    <span className="text-[#16A34A] font-bold">Settled</span>
                  </div>
                </div>
              </div>
            </GlareHover>

            {/* Card 5: MEMBERSHIPS */}
            <GlareHover glareColor="rgba(34, 197, 94, 0.08)">
              <div className="h-full bg-white border border-[#E5EAE6] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#111714]">MEMBERSHIPS</h3>
                  <p className="text-xs text-[#66706A] mt-2 leading-relaxed">
                    Create flexible monthly, annual, or class-pack memberships with automated auto-debits.
                  </p>
                </div>
                {/* Mini Repsi UI Preview */}
                <div className="bg-[#F7F9F7] p-3 rounded-xl border border-[#E5EAE6] space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-[#111714]">
                    <span>Active Plans</span>
                    <span className="text-[#16A34A]">1,104 Subscriptions</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-[#E5EAE6]">
                    <span className="font-semibold text-[#111714]">Auto Renewal Engine</span>
                    <span className="text-[#16A34A] font-bold">Active</span>
                  </div>
                </div>
              </div>
            </GlareHover>

            {/* Card 6: ANALYTICS */}
            <GlareHover glareColor="rgba(34, 197, 94, 0.08)">
              <div className="h-full bg-white border border-[#E5EAE6] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold mb-4">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#111714]">ANALYTICS</h3>
                  <p className="text-xs text-[#66706A] mt-2 leading-relaxed">
                    Understand attendance trends, monthly revenue cohort charts, and churn prevention alerts.
                  </p>
                </div>
                {/* Mini Repsi UI Preview */}
                <div className="bg-[#F7F9F7] p-3 rounded-xl border border-[#E5EAE6] space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-[#111714]">
                    <span>P&L & Cohort Growth</span>
                    <span className="text-[#16A34A]">94% Retention</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-[#E5EAE6]">
                    <span className="font-semibold text-[#111714]">Member LTV ₹28,400</span>
                    <span className="text-[#16A34A] font-bold">+18% YoY</span>
                  </div>
                </div>
              </div>
            </GlareHover>
          </div>
        </div>
      </section>

      {/* 05. DARK PRODUCT SHOWCASE (ROLE SHOWCASE ACCORDION GALLERY) */}
      <div id="showcase">
        <AccordionGallery />
      </div>

      {/* 07. LIGHT OPTION WHEEL SECTION */}
      <OptionWheel />

      {/* 08. LIGHT STEPPER SECTION */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E5EAE6]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#16A34A] bg-[#F1F5F2] px-3.5 py-1.5 rounded-full border border-[#E5EAE6] mb-4">
              Simple Onboarding
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111714]">
              Get up and <span className="text-[#16A34A]">running quickly.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#66706A]">
              From setup to active member check-ins in five seamless steps.
            </p>
          </div>

          <Stepper steps={stepsData} theme="light" />
        </div>
      </section>

      {/* 10. LIGHT GRAY FEATURE ECOSYSTEM (MASONRY SECTION) */}
      <section className="bg-[#F7F9F7] py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E5EAE6]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#16A34A] bg-white px-3.5 py-1.5 rounded-full border border-[#E5EAE6] mb-4">
              Connected Ecosystem
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111714]">
              Everything <span className="text-[#16A34A]">connected.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#66706A]">
              All fitness operations modules talk to each other seamlessly in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {masonryItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <GlareHover key={idx} glareColor="#16A34A">
                  <div className="h-full bg-white border border-[#E5EAE6] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#111714]">{item.title}</h3>
                        <p className="text-xs text-[#66706A] mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </GlareHover>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. LIGHT TESTIMONIALS SECTION */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E5EAE6]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#16A34A] bg-[#F1F5F2] px-3.5 py-1.5 rounded-full border border-[#E5EAE6] mb-4">
              Social Proof
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111714]">
              Loved by gym owners <span className="text-[#16A34A]">across India.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#66706A]">
              Here is what fitness business leaders say after switching to Repsi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F7F9F7] border border-[#E5EAE6] p-8 rounded-2xl space-y-4 shadow-xs">
              <div className="flex text-[#16A34A] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#111714] leading-relaxed font-medium italic">
                "Repsi cut our membership payment default rate by 80%. Automated WhatsApp payment reminders via Cashfree mean we get paid on time every single month."
              </p>
              <div className="pt-2 border-t border-[#E5EAE6]">
                <div className="text-xs font-bold text-[#111714]">Vikramaditya S.</div>
                <div className="text-[11px] text-[#66706A]">Owner, Iron Vault Gyms (Bangalore)</div>
              </div>
            </div>

            <div className="bg-[#F7F9F7] border border-[#E5EAE6] p-8 rounded-2xl space-y-4 shadow-xs">
              <div className="flex text-[#16A34A] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#111714] leading-relaxed font-medium italic">
                "The QR gate check-in speed is incredible. Members scan their phone and the turnstile opens in less than half a second. Zero queue at peak 7 AM hours."
              </p>
              <div className="pt-2 border-t border-[#E5EAE6]">
                <div className="text-xs font-bold text-[#111714]">Ananya Roy</div>
                <div className="text-[11px] text-[#66706A]">Founder, Flow Pilates Studio (Mumbai)</div>
              </div>
            </div>

            <div className="bg-[#F7F9F7] border border-[#E5EAE6] p-8 rounded-2xl space-y-4 shadow-xs">
              <div className="flex text-[#16A34A] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#111714] leading-relaxed font-medium italic">
                "Managing 14 fitness trainers used to be a spreadsheet nightmare. With Repsi's trainer portal, PT session tracking and commission payouts are instant."
              </p>
              <div className="pt-2 border-t border-[#E5EAE6]">
                <div className="text-xs font-bold text-[#111714]">Karan Malhotra</div>
                <div className="text-[11px] text-[#66706A]">Head Coach, Titan Athletics (Delhi)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. LIGHT PRICING SECTION */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* 14. LIGHT LANYARD / ABOUT SECTION */}
      <LanyardSection />

      {/* 15. DARK FINAL CTA SECTION */}
      <section className="relative bg-[#050B07] pt-24 pb-24 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#16A34A]/12 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-4xl text-center relative z-10 space-y-7">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#22C55E] bg-[#16A34A]/15 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30">
            Get Started Today
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7F5] leading-tight">
            Run your fitness business <br />
            with <span className="text-[#22C55E]">Repsi.</span>
          </h2>

          <p className="max-w-xl mx-auto text-base text-[#9CA3AF]">
            Members, trainers, attendance, memberships, payments, and analytics — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <ClickSpark sparkColor="#22C55E">
              <SpecularButton href="/signup" variant="primary" size="md">
                <span>Start with Repsi →</span>
              </SpecularButton>
            </ClickSpark>

            <SpecularButton href="/contact" variant="secondary" size="md">
              <span>Book a Demo</span>
            </SpecularButton>
          </div>
        </div>
      </section>

      {/* 16. DARK FOOTER */}
      <MarketingFooter />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
}
