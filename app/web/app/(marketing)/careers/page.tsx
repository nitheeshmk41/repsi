"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Heart,
  Zap,
  Shield,
  Coffee,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { FadeIn } from "@/components/ui/fade-in";
import { getStoredJobs, JobPosting } from "@/lib/content-growth-store";

const DEPARTMENTS = ["All Roles", "Engineering", "Product", "Marketing", "Customer Success", "Sales & Growth"];

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedDept, setSelectedDept] = useState("All Roles");

  useEffect(() => {
    const list = getStoredJobs().filter((j) => j.status === "published");
    setJobs(list);
  }, []);

  const filteredJobs = useMemo(() => {
    if (selectedDept === "All Roles") return jobs;
    return jobs.filter((j) => j.department.toLowerCase() === selectedDept.toLowerCase());
  }, [jobs, selectedDept]);

  return (
    <div className="min-h-screen bg-[#070D09] text-zinc-100 font-sans antialiased flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-5">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>We're Hiring</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Build the Operating System for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">Fitness Industry</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto pt-2">
              Join a high-conviction team modernizing thousands of gyms, swimming pools, yoga centers, and fitness clubs across India and beyond.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Culture & Perks Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Join Repsi?</h2>
          <p className="text-sm text-zinc-400">We care about autonomy, craftsmanship, speed, and real-world impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">High Ownership</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No endless bureaucracy. Ship meaningful product features directly to gym owners and trainers every week.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Health & Wellness</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Full gym & fitness membership reimbursements at any partner club plus top-tier medical coverage.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Competitive ESOPs</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We reward early contributors with generous equity packages so you grow alongside Repsi’s valuation.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Modern Tech Stack</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              FastAPI, Next.js 15, PostgreSQL, Redis, and high-frequency WebSocket sync engines for seamless operations.
            </p>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8 flex-1" id="openings">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <span>Open Roles ({filteredJobs.length})</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Explore current opportunities across engineering, marketing, and success.</p>
          </div>

          {/* Department Filter */}
          <div className="flex items-center flex-wrap gap-2">
            {DEPARTMENTS.map((dept) => {
              const active = selectedDept.toLowerCase() === dept.toLowerCase();
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 p-8">
            <p className="text-zinc-400 text-sm">No open positions currently listed in this department.</p>
            <p className="text-xs text-zinc-500 mt-1">Send your resume to <span className="text-emerald-400">careers@repsi.app</span> for general consideration.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/careers/${job.slug}`}
                className="group p-6 sm:p-7 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-900 hover:border-emerald-500/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase">
                      {job.department}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {job.employmentType}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center flex-wrap gap-4 pt-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {job.experience}
                    </span>
                    {job.salaryRange && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">{job.salaryRange}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-zinc-800">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 text-white text-xs font-bold transition-all">
                    <span>View Role</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] text-zinc-500">Posted {job.publishDate}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <MarketingFooter />
    </div>
  );
}
