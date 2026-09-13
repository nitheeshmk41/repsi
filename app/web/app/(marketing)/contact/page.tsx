"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gymName: "",
    memberCount: "100-500",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)]">
      <MarketingNav />

      <main className="flex-1 pt-12 pb-20 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/25 mb-4">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Let&apos;s talk about your <span className="text-[var(--accent)]">fitness business</span>.
            </h1>
            <p className="text-base text-[var(--text-secondary)] max-w-xl mx-auto">
              Looking for a custom demonstration, turnstile hardware consultation, or multi-branch enterprise pricing? Our team responds within 2 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
            {/* Contact Details */}
            <div className="md:col-span-2 space-y-8">
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-6">
                <h3 className="text-lg font-bold">Direct Channels</h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-secondary)]">Email Sales & Support</div>
                      <div className="font-medium text-[var(--text)]">contact.repsi@gmail.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-secondary)]">Call / WhatsApp</div>
                      <div className="font-medium text-[var(--text)]">+91 866 778 3321</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-secondary)]">Support Availability</div>
                      <div className="font-medium text-[var(--text)]">Mon – Sat: 6:00 AM – 10:00 PM IST</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-secondary)]">Offices</div>
                      <div className="font-medium text-[var(--text)]">HSR Layout, Bangalore & Anna Nagar, Chennai</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fast Trial Card */}
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-hover)] space-y-3">
                <h4 className="text-sm font-bold">Want immediate access?</h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  You don&apos;t need to wait for a demo. You can start creating your gym workspace and testing features right now.
                </p>
                <Link
                  href="/signup"
                  className="inline-block text-xs font-semibold text-[var(--accent)] hover:underline pt-1"
                >
                  Create free account →
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Thank you for reaching out!</h3>
                  <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                    A fitness solutions specialist has received your inquiry and will connect via phone and WhatsApp within 2 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[var(--accent)] hover:underline mt-4 font-semibold"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold mb-4">Request a Consultation</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-secondary)]">Your Name *</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Vikram Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-secondary)]">Phone / WhatsApp *</label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 00000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-secondary)]">Work Email *</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="vikram@apexfitness.in"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-secondary)]">Gym / Business Name *</label>
                      <input
                        required
                        type="text"
                        value={formData.gymName}
                        onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                        placeholder="Apex Fitness Club"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Active Member Count</label>
                    <select
                      value={formData.memberCount}
                      onChange={(e) => setFormData({ ...formData, memberCount: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    >
                      <option value="under-100">Under 100 members</option>
                      <option value="100-500">100 – 500 members</option>
                      <option value="500-1500">500 – 1,500 members</option>
                      <option value="1500+">1,500+ members / Multiple branches</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">How can we help you?</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your current software, hardware requirements, or branch locations..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
