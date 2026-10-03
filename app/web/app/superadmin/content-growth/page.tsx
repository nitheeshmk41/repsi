"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Copy,
  ExternalLink,
  ShieldCheck,
  Globe,
  Settings,
  Sparkles,
  Tag,
  Clock,
  Send,
  UserCheck,
  UserX,
  RefreshCw,
  Sliders,
  Award,
  BookOpen
} from "lucide-react";
import {
  getStoredBlogs,
  saveStoredBlogs,
  getStoredJobs,
  saveStoredJobs,
  getStoredApplications,
  saveStoredApplications,
  getStoredPartners,
  saveStoredPartners,
  getStoredReferrals,
  saveStoredReferrals,
  getStoredSettings,
  saveStoredSettings,
  BlogPost,
  JobPosting,
  JobApplication,
  PartnerAccount,
  ReferralRecord,
  CommissionSettings
} from "@/lib/content-growth-store";

export default function ContentAndGrowthAdminPage() {
  const [activeTab, setActiveTab] = useState<"blogs" | "careers" | "partners" | "seo">("blogs");

  // State
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [partners, setPartners] = useState<PartnerAccount[]>([]);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [settings, setSettings] = useState<CommissionSettings>(getStoredSettings());

  // Search & Filter State
  const [blogSearch, setBlogSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("all");
  const [partnerStatusFilter, setPartnerStatusFilter] = useState("all");

  // Blog Editor Modal
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "Gym Growth",
    tags: ["Gym Marketing"],
    featuredImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Repsi Editorial Team",
      role: "Fitness Operations Specialist",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    },
    status: "published",
    readTime: "5 min read",
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    views: 0
  });
  const [blogPreviewOpen, setBlogPreviewOpen] = useState(false);

  // Job Editor Modal
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [jobForm, setJobForm] = useState<Partial<JobPosting>>({
    title: "",
    slug: "",
    department: "Engineering",
    location: "Bangalore, India (Hybrid)",
    employmentType: "Full-Time",
    experience: "3-5 years",
    salaryRange: "₹18,00,000 – ₹28,00,000",
    status: "published",
    description: "",
    responsibilities: ["Develop robust microservices."],
    requirements: ["3+ years experience with Next.js/FastAPI."],
    benefits: ["Health insurance", "Gym membership", "ESOPs"]
  });

  // Settings Feedback
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    setBlogs(getStoredBlogs());
    setJobs(getStoredJobs());
    setApplications(getStoredApplications());
    setPartners(getStoredPartners());
    setReferrals(getStoredReferrals());
    setSettings(getStoredSettings());
  }, []);

  // -------------------------------------------------------------
  // Blog Handlers
  // -------------------------------------------------------------
  const handleOpenNewBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      id: `blog-${Date.now()}`,
      title: "",
      slug: "",
      summary: "",
      content: "## Overview\n\nEnter detailed topic cluster insights here.",
      category: "Gym Growth",
      tags: ["Gym Marketing"],
      featuredImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
      author: {
        name: "Repsi Editorial Team",
        role: "Fitness Operations Specialist",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      },
      status: "published",
      publishDate: new Date().toISOString().split("T")[0],
      readTime: "5 min read",
      seoTitle: "",
      seoDescription: "",
      canonicalUrl: "",
      views: 0
    });
    setBlogModalOpen(true);
  };

  const handleEditBlog = (post: BlogPost) => {
    setEditingBlog(post);
    setBlogForm({ ...post });
    setBlogModalOpen(true);
  };

  const handleDeleteBlog = (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const updated = blogs.filter((b) => b.id !== id);
    setBlogs(updated);
    saveStoredBlogs(updated);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug) return;

    const slug = (blogForm.slug || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const postToSave: BlogPost = {
      id: editingBlog ? editingBlog.id : `blog-${Date.now()}`,
      title: blogForm.title || "",
      slug,
      summary: blogForm.summary || "",
      content: blogForm.content || "",
      category: blogForm.category || "Gym Growth",
      tags: Array.isArray(blogForm.tags) ? blogForm.tags : (blogForm.tags as any || "").split(",").map((t: string) => t.trim()),
      featuredImage: blogForm.featuredImage || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
      author: blogForm.author || {
        name: "Repsi Editorial Team",
        role: "Content Specialist",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
      },
      status: blogForm.status || "published",
      publishDate: blogForm.publishDate || new Date().toISOString().split("T")[0],
      readTime: blogForm.readTime || "5 min read",
      seoTitle: blogForm.seoTitle || `${blogForm.title} | Repsi`,
      seoDescription: blogForm.seoDescription || blogForm.summary || "",
      canonicalUrl: blogForm.canonicalUrl || `https://repsi.app/blog/${slug}`,
      views: blogForm.views || 0,
      faqs: blogForm.faqs || []
    };

    let updatedList: BlogPost[];
    if (editingBlog) {
      updatedList = blogs.map((b) => (b.id === editingBlog.id ? postToSave : b));
    } else {
      updatedList = [postToSave, ...blogs];
    }

    setBlogs(updatedList);
    saveStoredBlogs(updatedList);
    setBlogModalOpen(false);
  };

  // -------------------------------------------------------------
  // Career Handlers
  // -------------------------------------------------------------
  const handleOpenNewJob = () => {
    setEditingJob(null);
    setJobForm({
      id: `job-${Date.now()}`,
      title: "",
      slug: "",
      department: "Engineering",
      location: "Bangalore, India (Hybrid)",
      employmentType: "Full-Time",
      experience: "3-5 years",
      salaryRange: "₹20,00,000 – ₹30,00,000",
      status: "published",
      publishDate: new Date().toISOString().split("T")[0],
      description: "",
      responsibilities: ["Drive system reliability and performance."],
      requirements: ["Strong proficiency in TypeScript and Python."],
      benefits: ["Gym membership reimbursement", "Health coverage", "ESOP equity"]
    });
    setJobModalOpen(true);
  };

  const handleEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setJobForm({ ...job });
    setJobModalOpen(true);
  };

  const handleToggleJobStatus = (id: string, current: JobPosting["status"]) => {
    const nextStatus: JobPosting["status"] = current === "published" ? "closed" : "published";
    const updated = jobs.map((j) => (j.id === id ? { ...j, status: nextStatus } : j));
    setJobs(updated);
    saveStoredJobs(updated);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title) return;
    const slug = (jobForm.slug || jobForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    const jobToSave: JobPosting = {
      id: editingJob ? editingJob.id : `job-${Date.now()}`,
      title: jobForm.title || "",
      slug,
      department: jobForm.department || "Engineering",
      location: jobForm.location || "Remote, India",
      employmentType: jobForm.employmentType || "Full-Time",
      experience: jobForm.experience || "2+ years",
      salaryRange: jobForm.salaryRange || "",
      status: jobForm.status || "published",
      publishDate: jobForm.publishDate || new Date().toISOString().split("T")[0],
      description: jobForm.description || "",
      responsibilities: Array.isArray(jobForm.responsibilities) ? jobForm.responsibilities : [String(jobForm.responsibilities)],
      requirements: Array.isArray(jobForm.requirements) ? jobForm.requirements : [String(jobForm.requirements)],
      benefits: Array.isArray(jobForm.benefits) ? jobForm.benefits : [String(jobForm.benefits)]
    };

    let updated: JobPosting[];
    if (editingJob) {
      updated = jobs.map((j) => (j.id === editingJob.id ? jobToSave : j));
    } else {
      updated = [jobToSave, ...jobs];
    }
    setJobs(updated);
    saveStoredJobs(updated);
    setJobModalOpen(false);
  };

  const handleUpdateApplicationStatus = (appId: string, status: JobApplication["status"]) => {
    const updated = applications.map((a) => (a.id === appId ? { ...a, status } : a));
    setApplications(updated);
    saveStoredApplications(updated);
  };

  // -------------------------------------------------------------
  // Partner & Referral Handlers
  // -------------------------------------------------------------
  const handleApprovePartner = (partnerId: string) => {
    const updated = partners.map((p) => {
      if (p.id === partnerId) {
        return {
          ...p,
          status: "active" as const,
          referralCode: p.referralCode || `${p.name.slice(0, 4).toUpperCase()}50`,
          referralUrl: p.referralUrl || `https://repsi.app/?ref=${p.referralCode || p.name.slice(0, 4).toUpperCase() + "50"}`
        };
      }
      return p;
    });
    setPartners(updated);
    saveStoredPartners(updated);
  };

  const handleTogglePartnerSuspension = (partnerId: string, currentStatus: PartnerAccount["status"]) => {
    const nextStatus: PartnerAccount["status"] = currentStatus === "suspended" ? "active" : "suspended";
    const updated = partners.map((p) => (p.id === partnerId ? { ...p, status: nextStatus } : p));
    setPartners(updated);
    saveStoredPartners(updated);
  };

  const handleUpdateReferralStatus = (refId: string, status: ReferralRecord["status"]) => {
    const updated = referrals.map((r) => (r.id === refId ? { ...r, status } : r));
    setReferrals(updated);
    saveStoredReferrals(updated);
  };

  const handleSaveCommissionSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Filtered lists
  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
      b.category.toLowerCase().includes(blogSearch.toLowerCase())
  );

  const filteredApplications = applications.filter((a) => {
    if (appStatusFilter === "all") return true;
    return a.status === appStatusFilter;
  });

  const filteredPartners = partners.filter((p) => {
    if (partnerStatusFilter === "all") return true;
    return p.status === partnerStatusFilter;
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-[#070A0F] min-h-screen text-zinc-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Growth & Content System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Content & Growth Engine
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage Blog CMS articles, Careers recruitment pipeline, Partner affiliate program, and SEO schemas.
          </p>
        </div>

        {/* View Public Live Sites Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            target="_blank"
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <span>Live Blog</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </Link>
          <Link
            href="/careers"
            target="_blank"
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <span>Live Careers</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </Link>
          <Link
            href="/partners"
            target="_blank"
            className="px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <span>Live Partners</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("blogs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "blogs"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Blog CMS ({blogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("careers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "careers"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Careers & Recruitment ({jobs.length} / {applications.length} Apps)</span>
        </button>

        <button
          onClick={() => setActiveTab("partners")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "partners"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Partners & Affiliates ({partners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("seo")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "seo"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>SEO & Sitemaps</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BLOG CMS */}
      {/* ========================================================================= */}
      {activeTab === "blogs" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={blogSearch}
                onChange={(e) => setBlogSearch(e.target.value)}
                placeholder="Filter blogs by title or category..."
                className="w-full h-9 pl-9 pr-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={handleOpenNewBlog}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Blog Post</span>
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="p-3.5 pl-5">Article</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Publish Date</th>
                  <th className="p-3.5">Views</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                {filteredBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3.5 pl-5 max-w-md">
                      <div className="font-bold text-white text-sm hover:text-emerald-400 transition-colors">
                        {b.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        repsi.app/blog/{b.slug}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium text-[11px]">
                        {b.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === "published"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-zinc-400 font-mono text-[11px]">
                      {b.publishDate}
                    </td>
                    <td className="p-3.5 text-zinc-300 font-mono">
                      {b.views.toLocaleString()}
                    </td>
                    <td className="p-3.5 pr-5 text-right space-x-2">
                      <Link
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        className="inline-block p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                        title="View Public Post"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleEditBlog(b)}
                        className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(b.id)}
                        className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CAREERS & RECRUITMENT */}
      {/* ========================================================================= */}
      {activeTab === "careers" && (
        <div className="space-y-8">
          {/* Section A: Job Postings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span>Active Job Postings ({jobs.length})</span>
                </h2>
                <p className="text-xs text-zinc-400">Manage indexable positions on repsi.app/careers</p>
              </div>
              <button
                onClick={handleOpenNewJob}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post New Job</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                        {job.department}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          job.status === "published"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{job.title}</h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{job.description}</p>
                    <div className="text-[11px] text-zinc-500 font-mono pt-1">
                      {job.location} • {job.experience}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleJobStatus(job.id, job.status)}
                      className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer"
                    >
                      {job.status === "published" ? "Close Position" : "Republish"}
                    </button>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/careers/${job.slug}`}
                        target="_blank"
                        className="p-1 rounded bg-zinc-800 text-zinc-300 hover:text-white"
                      >
                        <Eye className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => handleEditJob(job)}
                        className="p-1 rounded bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Applications Recruitment Board */}
          <div className="space-y-4 pt-6 border-t border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Applicant Recruitment Pipeline ({applications.length})</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Track candidate progression: New → Screening → Interview → Selected / Rejected
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                {["all", "new", "screening", "interview", "selected", "rejected"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setAppStatusFilter(s)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${
                      appStatusFilter === s
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider font-semibold text-[10px]">
                  <tr>
                    <th className="p-3.5 pl-5">Candidate</th>
                    <th className="p-3.5">Applied Role</th>
                    <th className="p-3.5">Experience</th>
                    <th className="p-3.5">Resume / Links</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 pr-5">Hiring Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-zinc-500">
                        No candidate applications matching this status.
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="p-3.5 pl-5 font-semibold text-white">
                          <div>{app.applicantName}</div>
                          <div className="text-[11px] text-zinc-400">{app.email}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{app.phone}</div>
                        </td>
                        <td className="p-3.5 text-zinc-300 font-medium">
                          {app.jobTitle}
                        </td>
                        <td className="p-3.5 text-zinc-400">
                          {app.experienceYears}
                        </td>
                        <td className="p-3.5 space-y-1">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                            📄 {app.resumeFileName}
                          </span>
                          {app.portfolioUrl && (
                            <div>
                              <a
                                href={app.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-zinc-400 hover:text-emerald-400 underline"
                              >
                                Portfolio Link ↗
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-zinc-400 font-mono text-[11px]">
                          {app.appliedAt}
                        </td>
                        <td className="p-3.5 pr-5">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value as any)}
                            className="bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                          >
                            <option value="new">New</option>
                            <option value="screening">Screening</option>
                            <option value="interview">Interview</option>
                            <option value="selected">Selected</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PARTNERS & AFFILIATES */}
      {/* ========================================================================= */}
      {activeTab === "partners" && (
        <div className="space-y-8">
          {/* Section A: Partner Accounts Directory */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Partner Accounts & Applications ({partners.length})</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Approve partners, generate referral links & promo codes, and manage commissions.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                {["all", "pending", "active", "suspended"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPartnerStatusFilter(s)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${
                      partnerStatusFilter === s
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider font-semibold text-[10px]">
                  <tr>
                    <th className="p-3.5 pl-5">Partner Profile</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Referral Code & URL</th>
                    <th className="p-3.5">Referrals / Paid</th>
                    <th className="p-3.5">Revenue / Commission</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                  {filteredPartners.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-white">{p.company}</div>
                        <div className="text-[11px] text-zinc-400">{p.name} ({p.email})</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{p.phone}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium text-[11px]">
                          {p.partnerType}
                        </span>
                      </td>
                      <td className="p-3.5 space-y-0.5">
                        <div className="font-mono font-bold text-emerald-400">{p.referralCode}</div>
                        <div className="text-[10px] text-zinc-500 font-mono truncate max-w-[180px]">
                          {p.referralUrl}
                        </div>
                      </td>
                      <td className="p-3.5 font-mono">
                        <div>{p.signups} signups ({p.clicks} clicks)</div>
                        <div className="text-emerald-400 font-bold">{p.paidCustomers} paid gyms</div>
                      </td>
                      <td className="p-3.5 font-mono">
                        <div>₹{p.revenueGenerated.toLocaleString()} rev</div>
                        <div className="text-emerald-300 font-semibold">
                          ₹{p.commissionEarned.toLocaleString()} comm ({p.commissionRate}%)
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === "active"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : p.status === "pending"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-rose-500/20 text-rose-300"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 pr-5 text-right space-x-2">
                        {p.status === "pending" && (
                          <button
                            onClick={() => handleApprovePartner(p.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
                          >
                            Approve & Activate
                          </button>
                        )}
                        {p.status !== "pending" && (
                          <button
                            onClick={() => handleTogglePartnerSuspension(p.id, p.status)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                              p.status === "suspended"
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                                : "bg-zinc-800 text-zinc-400 hover:text-rose-400"
                            }`}
                          >
                            {p.status === "suspended" ? "Unsuspend" : "Suspend Code"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: All Referral Transactions & Commission States */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Referral Attribution Orders & Commission States</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Lifecycle state machine: Pending → Confirmed → Payable → Paid (or Cancelled on refund)
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider font-semibold text-[10px]">
                  <tr>
                    <th className="p-3.5 pl-5">Customer Gym</th>
                    <th className="p-3.5">Partner Attributed</th>
                    <th className="p-3.5">Plan / Order</th>
                    <th className="p-3.5">Commission</th>
                    <th className="p-3.5">Purchase Date</th>
                    <th className="p-3.5 pr-5">Commission Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-white">{ref.gymName}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{ref.customerEmail}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-zinc-200">{ref.partnerName}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">Code: {ref.partnerCode}</div>
                      </td>
                      <td className="p-3.5 font-mono">
                        <div>{ref.planName} (₹{ref.planAmount.toLocaleString()})</div>
                        <div className="text-[10px] text-zinc-500">{ref.orderId}</div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-400">
                        ₹{ref.commissionAmount.toFixed(2)}
                      </td>
                      <td className="p-3.5 text-zinc-400 font-mono text-[11px]">
                        {ref.purchaseDate}
                      </td>
                      <td className="p-3.5 pr-5">
                        <select
                          value={ref.status}
                          onChange={(e) => handleUpdateReferralStatus(ref.id, e.target.value as any)}
                          className="bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                        >
                          <option value="pending">Pending (14d hold)</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="payable">Payable</option>
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled (Refund)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section C: Commission Settings Configuration */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Partner Commission Rules & Fraud Protection Settings</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Configure default commission percentage, hold durations, and fraud prevention locks.
                </p>
              </div>

              {settingsSaved && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Settings Saved!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveCommissionSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Starter Plan Commission (%)</label>
                  <input
                    type="number"
                    value={settings.starterRate}
                    onChange={(e) => setSettings({ ...settings, starterRate: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Pro Plan Commission (%)</label>
                  <input
                    type="number"
                    value={settings.proRate}
                    onChange={(e) => setSettings({ ...settings, proRate: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Business Plan Commission (%)</label>
                  <input
                    type="number"
                    value={settings.businessRate}
                    onChange={(e) => setSettings({ ...settings, businessRate: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Commission Duration</label>
                  <select
                    value={settings.commissionDuration}
                    onChange={(e) => setSettings({ ...settings, commissionDuration: e.target.value as any })}
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="first_payment">First Payment Only</option>
                    <option value="12_months">12 Months (Recurring)</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Minimum Payout Threshold (₹)</label>
                  <input
                    type="number"
                    value={settings.minPayoutThreshold}
                    onChange={(e) => setSettings({ ...settings, minPayoutThreshold: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Refund Clearance Hold (Days)</label>
                  <input
                    type="number"
                    value={settings.refundHoldDays}
                    onChange={(e) => setSettings({ ...settings, refundHoldDays: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Fraud rules info box */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-2.5 text-xs text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Anti-Abuse Engine Active: Prevents partner self-referral, locks first attribution immutably upon first paid checkout, and disables commission triggers on refunded invoices.
                </span>
              </div>

              <div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Commission Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SEO & SITEMAPS */}
      {/* ========================================================================= */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>SEO Infrastructure & Topic Cluster Indexing</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All blog posts and career openings are dynamically included in sitemaps and formatted with structured JSON-LD schemas (`Article`, `FAQPage`, `JobPosting`, `SoftwareApplication`).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Blog Topic Clusters</span>
                <div className="text-xl font-black text-emerald-400 font-mono">{blogs.length} Articles</div>
                <div className="text-[11px] text-zinc-400">JSON-LD FAQ Schema Enabled</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Open Job Listings</span>
                <div className="text-xl font-black text-emerald-400 font-mono">{jobs.length} Positions</div>
                <div className="text-[11px] text-zinc-400">JobPosting Schema Enabled</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Partner Attribution Links</span>
                <div className="text-xl font-black text-emerald-400 font-mono">{partners.length} Active</div>
                <div className="text-[11px] text-zinc-400">Dual Query (?ref=) + Promo Codes</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Blog Post Creator / Editor */}
      {/* ========================================================================= */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingBlog ? "Edit Blog Article" : "Create New Blog Article"}
              </h3>
              <button
                onClick={() => setBlogModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Article Title *</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setBlogForm({ ...blogForm, title, slug: blogForm.slug || slug });
                  }}
                  placeholder="e.g. 10 Ways to Increase Gym Membership"
                  className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">URL Slug * (repsi.app/blog/...)</label>
                  <input
                    type="text"
                    required
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    placeholder="how-to-increase-gym-membership"
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Gym Growth">Gym Growth</option>
                    <option value="Gym Management Software">Gym Management Software</option>
                    <option value="WhatsApp Automation">WhatsApp Automation</option>
                    <option value="Software & Tech">Software & Tech</option>
                    <option value="Member Retention">Member Retention</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Featured Image URL</label>
                  <input
                    type="url"
                    value={blogForm.featuredImage}
                    onChange={(e) => setBlogForm({ ...blogForm, featuredImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Status</label>
                  <select
                    value={blogForm.status}
                    onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value as any })}
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Summary / SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  placeholder="Concise overview for Google search snippets..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Markdown Content</label>
                <textarea
                  rows={8}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="## Section Title&#10;&#10;Write article content here..."
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save & Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Job Creator / Editor */}
      {/* ========================================================================= */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingJob ? "Edit Job Posting" : "Create New Job Opening"}
              </h3>
              <button
                onClick={() => setJobModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Job Title *</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Department</label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value as any })}
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Customer Success">Customer Success</option>
                    <option value="Sales & Growth">Sales & Growth</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="Bangalore / Remote"
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Experience</label>
                  <input
                    type="text"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    placeholder="3-5 years"
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Salary Range (Optional)</label>
                  <input
                    type="text"
                    value={jobForm.salaryRange}
                    onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                    placeholder="₹18L - ₹28L + ESOPs"
                    className="w-full h-9 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Role Description</label>
                <textarea
                  rows={4}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Describe the mission and key objectives..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Job Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
