"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Send,
  Upload,
  Sparkles,
  Building2,
  FileText
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getStoredJobs,
  getStoredApplications,
  saveStoredApplications,
  JobPosting,
  JobApplication
} from "@/lib/content-growth-store";

export default function CareerJobPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [job, setJob] = useState<JobPosting | null>(null);
  const [allJobs, setAllJobs] = useState<JobPosting[]>([]);

  // Application form state
  const [applicantName, setApplicantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const list = getStoredJobs();
    setAllJobs(list);
    const found = list.find((j) => j.slug === slug);
    if (found) {
      setJob(found);
    }
  }, [slug]);

  if (!job && allJobs.length > 0) {
    const found = allJobs.find((j) => j.slug === slug);
    if (!found) {
      return (
        <div className="min-h-screen bg-[#070D09] text-zinc-100 flex flex-col justify-between">
          <MarketingNav />
          <div className="text-center py-40 px-4">
            <h1 className="text-3xl font-bold text-white mb-4">Position Not Found</h1>
            <p className="text-zinc-400 mb-6">This job posting may have been filled or unpublished.</p>
            <Link
              href="/careers"
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500"
            >
              ← Back to All Openings
            </Link>
          </div>
          <MarketingFooter />
        </div>
      );
    }
  }

  const currentJob = job || allJobs.find((j) => j.slug === slug) || getStoredJobs()[0];

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !email || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        jobId: currentJob.id,
        jobTitle: currentJob.title,
        applicantName,
        email,
        phone,
        experienceYears: experienceYears || "3+ years",
        portfolioUrl: portfolioUrl || undefined,
        resumeFileName: resumeFileName || `${applicantName.replace(/\s+/g, "_")}_Resume.pdf`,
        coverLetter: coverLetter || undefined,
        appliedAt: new Date().toISOString().split("T")[0],
        status: "new",
      };

      const existingApps = getStoredApplications();
      saveStoredApplications([newApp, ...existingApps]);

      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  // Structured JobPosting Schema
  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: currentJob.title,
    description: currentJob.description,
    identifier: {
      "@type": "PropertyValue",
      name: "Repsi",
      value: currentJob.id,
    },
    datePosted: currentJob.publishDate,
    employmentType: currentJob.employmentType === "Full-Time" ? "FULL_TIME" : "CONTRACTOR",
    hiringOrganization: {
      "@type": "Organization",
      name: "Repsi Technologies",
      sameAs: "https://repsi.app",
      logo: "https://repsi.app/icon.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        addressLocality: currentJob.location,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#070D09] text-zinc-100 font-sans antialiased flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      <JsonLd data={jobSchema} />
      <MarketingNav />

      {/* Header & Meta */}
      <section className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <Link href="/careers" className="hover:text-emerald-400 transition-colors">Careers</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-300 truncate">{currentJob.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase">
              {currentJob.department}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-semibold">
              {currentJob.employmentType}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {currentJob.title}
          </h1>

          <div className="flex items-center flex-wrap gap-5 pt-2 text-xs sm:text-sm text-zinc-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              {currentJob.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              {currentJob.experience}
            </span>
            {currentJob.salaryRange && (
              <>
                <span>•</span>
                <span className="text-emerald-300 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  {currentJob.salaryRange}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Body Grid */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12 flex-1">
        {/* Job Overview & Responsibilities */}
        <section className="space-y-6 text-zinc-300 leading-relaxed text-sm sm:text-base">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">About the Role</h2>
            <p className="text-zinc-300 leading-relaxed">{currentJob.description}</p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-white">What You'll Do</h3>
            <ul className="space-y-2">
              {currentJob.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span className="text-zinc-300 text-sm sm:text-base">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-white">What We Look For</h3>
            <ul className="space-y-2">
              {currentJob.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span className="text-zinc-300 text-sm sm:text-base">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-white">Benefits & Perks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {currentJob.benefits.map((b, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-200">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form Card */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl relative" id="apply">
          <div className="space-y-2 mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-400" />
              <span>Apply for this Role</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Submit your details below. Our hiring team reviews applications within 2 business days.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-10 space-y-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30 p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Application Received!</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Thanks for applying to Repsi, {applicantName}! Our recruitment team will review your experience and reach out via email.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Years of Experience</label>
                  <input
                    type="text"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 4 years"
                    className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Portfolio / GitHub / LinkedIn URL</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Resume / CV File Name</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={resumeFileName}
                    onChange={(e) => setResumeFileName(e.target.value)}
                    placeholder="Attach or enter resume link / file name"
                    className="flex-1 h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setResumeFileName(`${applicantName || "Candidate"}_Resume.pdf`)}
                    className="h-10 px-3 rounded-lg bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-700 hover:bg-zinc-700 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Attach PDF</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Note / Why Repsi?</label>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us briefly why you're interested in scaling Repsi..."
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
