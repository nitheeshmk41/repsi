"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building,
  Dumbbell,
  Share2,
  HelpCircle,
  ChevronRight,
  Send,
  Lock,
  Layers
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { FadeIn } from "@/components/ui/fade-in";
import { getStoredPartners, saveStoredPartners, PartnerAccount } from "@/lib/content-growth-store";

const PARTNER_CATEGORIES = [
  {
    title: "Gym Consultants",
    desc: "You help entrepreneurs set up and optimize gym operations. Bundle Repsi into your advisory packages.",
    icon: Building,
  },
  {
    title: "Fitness Equipment Dealers",
    desc: "You supply machines and free weights to new gyms. Pair hardware deliveries with software licenses.",
    icon: Dumbbell,
  },
  {
    title: "Personal Trainers & Coaches",
    desc: "You interact with gym owners daily. Introduce them to automated billing and client workout apps.",
    icon: Users,
  },
  {
    title: "Gym Setup Companies",
    desc: "You design gym interiors and turnkey facilities. Offer Repsi as their day-one management OS.",
    icon: Layers,
  },
  {
    title: "Fitness Influencers & Creators",
    desc: "You inspire gym owners and fitness communities. Monetize your industry reach transparently.",
    icon: Sparkles,
  },
  {
    title: "Digital Marketing Agencies",
    desc: "You run social ads and lead generation for gyms. Connect Repsi's CRM to show direct ROI.",
    icon: TrendingUp,
  },
];

const FAQS = [
  {
    q: "How does the Repsi Partner Program work?",
    a: "Once approved, you receive both a unique partner promo code and a dedicated referral link (repsi.app/?ref=YOURCODE). When a gym owner signs up through your link or uses your code at checkout, all their subscription payments earn you up to 25% recurring commission.",
  },
  {
    q: "How and when are commissions paid out?",
    a: "Commissions transition from Pending to Confirmed following our 14-day refund window, then become Payable. Payouts are transferred directly to your bank account or UPI ID monthly with a minimum payout threshold of ₹1,000.",
  },
  {
    q: "Can I refer multi-branch gym chains?",
    a: "Yes! Multi-branch gym chains on Pro or Business tiers generate significant subscription volume, allowing you to earn recurring payouts across every location they activate.",
  },
  {
    q: "What marketing materials do you provide?",
    a: "Partners receive a full marketing kit inside their Partner Dashboard, including co-branded pitch decks, feature breakdown PDFs, demo video links, and pre-written WhatsApp templates.",
  },
];

export default function PartnersPage() {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partnerType, setPartnerType] = useState<any>("Gym Consultant");
  const [preferredCode, setPreferredCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setLoading(true);
    setTimeout(() => {
      const generatedCode = (preferredCode || name.slice(0, 4) + "50").toUpperCase().replace(/[^A-Z0-9]/g, "");
      const newPartner: PartnerAccount = {
        id: `partner-${Date.now()}`,
        name,
        company: company || `${name} Enterprises`,
        email,
        phone,
        partnerType,
        referralCode: generatedCode,
        referralUrl: `https://repsi.app/?ref=${generatedCode}`,
        status: "pending",
        tier: "Standard Partner",
        commissionRate: 20,
        clicks: 0,
        signups: 0,
        paidCustomers: 0,
        revenueGenerated: 0,
        commissionEarned: 0,
        pendingCommission: 0,
        paidCommission: 0,
        joinedAt: new Date().toISOString().split("T")[0],
      };

      const existing = getStoredPartners();
      saveStoredPartners([newPartner, ...existing]);

      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070D09] text-zinc-100 font-sans antialiased flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Official Repsi Partner Program</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Partner with Repsi. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">
                Earn 20% Recurring Commission
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
              Help gyms, studios, and fitness facilities upgrade to a modern operating system. Earn predictable, monthly commissions for every business you introduce.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setOpenModal(true)}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Apply as a Partner</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/partners/portal"
                className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-semibold text-sm transition-all flex items-center gap-2"
              >
                <span>Partner Portal Demo</span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5-Step How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How the Partner Program Works</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            A seamless, transparent attribution and payout engine built for growth leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: "01", title: "Apply Online", desc: "Submit your basic profile and partner type in under 2 minutes." },
            { step: "02", title: "Get Approved", desc: "Admin reviews & activates your partner dashboard within 24h." },
            { step: "03", title: "Share Link / Code", desc: "Give gyms your dual attribution link (repsi.app/?ref=CODE) or promo code." },
            { step: "04", title: "Gyms Subscribe", desc: "Gyms onboard and choose a Starter, Pro, or Business plan." },
            { step: "05", title: "Earn Payouts", desc: "Receive automated monthly commissions directly into your UPI or bank." },
          ].map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 relative overflow-hidden space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-emerald-500/40 font-mono block mb-1">
                  {item.step}
                </span>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
              <div className="w-full h-1 rounded-full bg-emerald-500/20 mt-3" />
            </div>
          ))}
        </div>
      </section>

      {/* Commission Structure Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-10 border-t border-zinc-800/80">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Revenue Share Structure
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Generous, Uncapped Commission Tiers
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Earn on every subscription tier with zero cap on total earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl border border-zinc-800 bg-zinc-900/70 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Starter Plan</h3>
              <span className="px-2.5 py-0.5 rounded bg-zinc-800 text-xs text-zinc-300">₹4,999/yr</span>
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">20%</div>
            <p className="text-xs text-zinc-400">
              Ideal for single studio setups, personal training studios, and boutique fitness centers.
            </p>
            <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-300 font-medium">
              You earn: <span className="text-emerald-400 font-bold">₹999.80 / gym</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 to-zinc-900/90 space-y-4 relative shadow-xl">
            <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-extrabold uppercase">
              Most Popular
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Pro Plan</h3>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold">₹9,999/yr</span>
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">20%</div>
            <p className="text-xs text-zinc-300">
              Full QR attendance, WhatsApp automated billing, trainer scheduling, and member portal.
            </p>
            <div className="pt-3 border-t border-emerald-500/30 text-xs text-zinc-200 font-medium">
              You earn: <span className="text-emerald-400 font-bold">₹1,999.80 / gym</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl border border-zinc-800 bg-zinc-900/70 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Business Plan</h3>
              <span className="px-2.5 py-0.5 rounded bg-zinc-800 text-xs text-zinc-300">₹19,999/yr</span>
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">20% – 25%</div>
            <p className="text-xs text-zinc-400">
              Multi-branch commercial gyms and high-volume health clubs with unlimited members.
            </p>
            <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-300 font-medium">
              You earn: <span className="text-emerald-400 font-bold">₹3,999.80+ / gym</span>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Become a Partner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Who is this Program For?</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            If you already have relationships with gym owners, Repsi turns your network into recurring income.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARTNER_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{cat.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dual Attribution Explainer */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wide">
              Zero Lost Referrals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Dual Attribution: Both a Link & a Custom Promo Code
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              We provide you with a unique referral URL (<code className="text-emerald-400 bg-zinc-950 px-1.5 py-0.5 rounded">repsi.app/?ref=YOURCODE</code>) with 30-day cookie persistence. If a client switches devices or visits later, your custom promo code ensures you still get 100% of the commission upon checkout.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Immutable first-touch attribution locks to your account.</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 font-mono text-xs space-y-4 shadow-xl">
            <div className="text-zinc-500 text-[11px] pb-2 border-b border-zinc-800 flex items-center justify-between">
              <span>ATTRIBUTION ENGINE</span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 text-[10px]">REFERRAL LINK</span>
              <div className="p-2.5 rounded-lg bg-zinc-900 text-emerald-300 text-xs truncate">
                https://repsi.app/?ref=FITNESS50
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 text-[10px]">FALLBACK PROMO CODE</span>
              <div className="p-2.5 rounded-lg bg-zinc-900 text-zinc-200 text-xs font-bold tracking-wider">
                FITNESS50
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-zinc-400">Everything you need to know about the Repsi Partner Program.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center space-y-6">
        <div className="p-10 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-zinc-950 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to become a Repsi Partner?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Join consultants and fitness professionals across India earning reliable monthly commissions.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => setOpenModal(true)}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Apply for Partner Program</h3>
              <button
                onClick={() => {
                  setOpenModal(false);
                  setSubmitted(false);
                }}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Application Received!</h4>
                <p className="text-xs text-zinc-400">
                  Thanks for applying, {name}! Our team will review your partner profile and email your activated referral link and partner portal access within 24 hours.
                </p>
                <div className="pt-3">
                  <Link
                    href="/partners/portal"
                    className="inline-block px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Preview Partner Portal Dashboard →
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Vikram Malhotra"
                      className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-300">Company / Brand Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="ABC Fitness Consulting"
                      className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vikram@example.com"
                      className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-300">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300">Primary Partner Category</label>
                  <select
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value as any)}
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Gym Consultant">Gym Consultant</option>
                    <option value="Fitness Equipment Dealer">Fitness Equipment Dealer</option>
                    <option value="Personal Trainer">Personal Trainer</option>
                    <option value="Gym Setup Company">Gym Setup Company</option>
                    <option value="Fitness Influencer">Fitness Influencer</option>
                    <option value="Digital Agency">Digital Agency</option>
                    <option value="Community / Association">Community / Association</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300">Preferred Referral Code (Optional)</label>
                  <input
                    type="text"
                    value={preferredCode}
                    onChange={(e) => setPreferredCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ABC50 or FITPRO"
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-zinc-500">Your referral link will be: repsi.app/?ref={preferredCode || "CODE"}</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? "Submitting Application..." : "Submit Partner Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <MarketingFooter />
    </div>
  );
}
