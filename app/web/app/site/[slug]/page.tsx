"use client";

import { useState, useEffect, use } from "react";
import { repsiApi } from "@/lib/api";
import {
  Dumbbell,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Star,
  Users,
  Flame,
  Send,
} from "lucide-react";

export default function PublicGymWebsitePage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const slug = params.slug;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lead Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    interested_plan: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadSite() {
      try {
        const res = await repsiApi.getPublicWebsite(slug);
        setData(res);
      } catch (err: any) {
        setError(err.message || "This gym website is not yet live.");
      } finally {
        setLoading(false);
      }
    }
    loadSite();
  }, [slug]);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await repsiApi.submitPublicLead(slug, form);
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-zinc-400">Loading website...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Website Coming Soon</h1>
          <p className="text-sm text-zinc-400 mb-6">
            {error || "This gym website hasn't been published yet by the gym owner."}
          </p>
        </div>
      </div>
    );
  }

  const { website, gym_name, plans, trainers, classes } = data;
  const primaryColor = website.primary_color || "#E11D48";
  const templateName = website.template_id || "Modern Fitness";

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-rose-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">{website.title || gym_name}</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
            <a href="#about" className="hover:text-white transition">
              About
            </a>
            <a href="#plans" className="hover:text-white transition">
              Memberships
            </a>
            <a href="#trainers" className="hover:text-white transition">
              Coaches
            </a>
            <a href="#classes" className="hover:text-white transition">
              Classes
            </a>
            <a href="#contact" className="hover:text-white transition">
              Location
            </a>
          </nav>

          <div>
            <a
              href="#lead-form"
              className="px-4 py-2 rounded-xl font-medium text-xs md:text-sm text-white transition shadow-lg inline-flex items-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              Book Free Trial
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 border-b border-zinc-800/60">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-[#09090b]" />
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] opacity-25 pointer-events-none"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Welcome to {website.title || gym_name}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            {website.tagline || website.headline || "Elevate Your Strength. Transform Your Life."}
          </h1>

          <p className="text-base md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience world-class coaching, modern equipment, and a welcoming community dedicated to reaching your
            highest potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#lead-form"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white shadow-xl transition flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              Start Your Free Trial <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#plans"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-sm transition"
            >
              View Membership Plans
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 grid grid-cols-3 max-w-xl mx-auto border-t border-zinc-800/80 pt-8 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
              <div className="text-xs text-zinc-500 mt-1">Active Athletes</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white">100%</div>
              <div className="text-xs text-zinc-500 mt-1">Certified Coaches</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white">4.9 ★</div>
              <div className="text-xs text-zinc-500 mt-1">Community Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {website.about_text && (
        <section id="about" className="py-20 border-b border-zinc-800/60 bg-zinc-950/40">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 block mb-2">Our Mission</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">About {website.title || gym_name}</h2>
            <p className="text-zinc-300 text-base leading-relaxed whitespace-pre-line">{website.about_text}</p>
          </div>
        </section>
      )}

      {/* Membership Plans Section */}
      <section id="plans" className="py-24 border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 block mb-2">Memberships</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Transparent Pricing for Every Goal</h2>
            <p className="text-sm text-zinc-400">
              No hidden fees. Full access to facilities, showers, lockers, and guided onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans && plans.length > 0 ? (
              plans.map((p: any, idx: number) => (
                <div
                  key={p.id || idx}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition ${
                    idx === 1
                      ? "border-rose-500/50 bg-zinc-900 shadow-2xl relative"
                      : "border-zinc-800 bg-zinc-900/50"
                  }`}
                >
                  {idx === 1 && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Most Popular
                    </span>
                  )}
                  <div>
                    <h3 className="font-bold text-xl text-white mb-1">{p.name}</h3>
                    <p className="text-xs text-zinc-400 mb-6">{p.description || "Comprehensive gym access plan"}</p>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-3xl md:text-4xl font-black text-white">₹{p.price}</span>
                      <span className="text-xs text-zinc-500">/ {p.duration_days} days</span>
                    </div>

                    <ul className="space-y-3 text-xs text-zinc-300 mb-8">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited Gym Access
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Fitness Assessment & Body Scan
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Locker & Shower Facilities
                      </li>
                    </ul>
                  </div>

                  <a
                    href="#lead-form"
                    onClick={() => setForm({ ...form, interested_plan: p.name })}
                    className="w-full py-3 rounded-xl font-medium text-xs text-center text-white transition block"
                    style={{ backgroundColor: idx === 1 ? primaryColor : "#27272a" }}
                  >
                    Select Plan
                  </a>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-zinc-500">
                Contact our gym team directly for membership options.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      {trainers && trainers.length > 0 && (
        <section id="trainers" className="py-20 border-b border-zinc-800/60 bg-zinc-950/40">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 block mb-2">Team</span>
              <h2 className="text-3xl font-black text-white mb-3">Meet Your Certified Coaches</h2>
              <p className="text-sm text-zinc-400">Expert guidance for strength, conditioning, and nutrition.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trainers.map((t: any, idx: number) => (
                <div key={t.id || idx} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                  <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">
                    {t.name ? t.name[0] : "C"}
                  </div>
                  <h3 className="font-bold text-lg text-white">{t.name}</h3>
                  <div className="text-xs text-rose-400 font-medium mb-3">{t.specialization || "Fitness Coach"}</div>
                  <p className="text-xs text-zinc-400">{t.bio || "Dedicated to helping athletes hit their goals."}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Direct Lead Capture Form */}
      <section id="lead-form" className="py-24 border-b border-zinc-800/60">
        <div className="max-w-xl mx-auto px-4">
          <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-8 shadow-2xl relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
              style={{ backgroundColor: primaryColor }}
            />

            <div className="text-center mb-8">
              <span className="text-xs uppercase font-mono text-emerald-400 block mb-1">Zero Obligation</span>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Claim Your Free Gym Trial</h2>
              <p className="text-xs text-zinc-400">
                Leave your contact details and our team will prepare a personalized guest pass.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg text-white mb-1">Inquiry Received!</h3>
                <p className="text-xs text-zinc-400">
                  Thank you! Our gym reception team has received your pass request and will contact you via phone / WhatsApp shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white outline-none focus:border-rose-500"
                    placeholder="e.g. Aditi Roy"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white outline-none focus:border-rose-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white outline-none focus:border-rose-500"
                      placeholder="aditi@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Interested Plan / Goal</label>
                  <input
                    type="text"
                    value={form.interested_plan}
                    onChange={(e) => setForm({ ...form, interested_plan: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white outline-none"
                    placeholder="e.g. Weight Loss, Hypertrophy, Free Trial"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Message / Preferred Time</label>
                  <textarea
                    rows={2}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white outline-none"
                    placeholder="Any questions or special requests?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-xl transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Sending..." : "Submit Pass Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer / Location */}
      <footer id="contact" className="py-16 bg-zinc-950 text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
              <Dumbbell className="w-5 h-5 text-rose-500" />
              <span>{website.title || gym_name}</span>
            </div>
            <p className="text-zinc-500 leading-relaxed">
              Powered by Repsi.app Gym Management System. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Visiting Hours</h4>
            <p className="leading-relaxed">{website.opening_hours || "Mon - Sat: 06:00 AM - 10:00 PM"}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Contact</h4>
            <div className="space-y-1.5">
              {website.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <a href={`tel:${website.phone}`} className="hover:text-white">
                    {website.phone}
                  </a>
                </div>
              )}
              {website.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <a href={`mailto:${website.email}`} className="hover:text-white">
                    {website.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Location</h4>
            <div className="flex items-start gap-1.5">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{website.address || "Main Street Fitness Plaza"}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
