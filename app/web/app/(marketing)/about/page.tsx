import Link from "next/link";
import { Shield, Target, Award, HeartHandshake, ArrowRight, Check } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export const metadata = {
  title: "About REPSI — Our Mission & Story",
  description: "Learn why we built REPSI: to empower fitness entrepreneurs and simplify gym management.",
};

const values = [
  {
    icon: Target,
    title: "Zero Operational Drag",
    description: "Software should get out of the way. Gym owners should spend their time coaching and building community, not wrestling clunky spreadsheets.",
  },
  {
    icon: Shield,
    title: "Airtight Data Integrity",
    description: "Your member lists, financial books, and trainer contracts belong strictly to your business. Multi-tenant isolation is baked into our core architecture.",
  },
  {
    icon: Award,
    title: "Relentless Engineering Quality",
    description: "From sub-second turnstile scans to instant invoice generation, we build software with the performance expected of modern high-scale technology companies.",
  },
  {
    icon: HeartHandshake,
    title: "Gym Owner Obsessed",
    description: "Every feature we ship comes from direct conversations with real owners, trainers, and front-desk staff on active gym floors.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)]">
      <MarketingNav />

      <main className="flex-1 pt-12 pb-20 px-4 sm:px-6">
        {/* Story Hero */}
        <div className="mx-auto max-w-4xl text-center mb-20">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/25 mb-4">
            Our Purpose
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Building the operating system for the{" "}
            <span className="text-[var(--accent)]">future of fitness</span>.
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
            REPSI was born out of frustration with legacy, slow desktop software and clunky apps that gyms were forced to use. We designed REPSI to bring world-class design, modern speed, and multi-tenant security to fitness businesses worldwide.
          </p>
        </div>

        {/* Numbers Bar */}
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] mb-24">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-[var(--accent)]">&lt; 0.8s</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1 font-medium">QR Check-in Speed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-[var(--accent)]">100%</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1 font-medium">Multi-Tenant Isolation</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-[var(--accent)]">99.9%</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1 font-medium">Uptime Reliability</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-[var(--accent)]">All-in-One</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1 font-medium">Unified Gym Operating System</div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mx-auto max-w-5xl mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Our Core Principles</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">How we build products and treat our customers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">{v.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-3xl text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold">Ready to modernize your gym business?</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
            Take the 2-minute setup tour and see why gyms are switching to REPSI.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-sm hover:bg-[var(--primary-hover)] transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
