"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { repsiApi } from "@/lib/api";
import {
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Save,
  Copy,
  ChevronLeft,
  ArrowRight,
  Dumbbell,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Palette,
  Layout,
  Settings as SettingsIcon,
  Search,
  MessageCircle,
  HelpCircle,
  Plus,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  Share2,
} from "lucide-react";

interface TemplateDef {
  id: string;
  name: string;
  tagline: string;
  accent: string;
}

const TEMPLATES: TemplateDef[] = [
  { id: "modern-fitness", name: "Modern Fitness", tagline: "Dark • High-Energy • Bold", accent: "#16A34A" },
  { id: "premium-gym", name: "Premium Gym", tagline: "Luxury • Gold • Boutique", accent: "#EAB308" },
  { id: "crossfit", name: "CrossFit Box", tagline: "Conditioning • Industrial", accent: "#F97316" },
  { id: "personal-training", name: "Personal Coaching", tagline: "1-on-1 • Minimalist", accent: "#8B5CF6" },
];

export default function WebsiteBuilderPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";

  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Layout Viewport
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [canvasTheme, setCanvasTheme] = useState<"dark" | "light">("dark");

  // Right Inspector Tab: Content | Design | SEO | Settings
  const [inspectorTab, setInspectorTab] = useState<"content" | "design" | "seo" | "settings">("content");
  // Active focused section inside Content tab
  const [activeSection, setActiveSection] = useState<"hero" | "about" | "plans" | "trainers" | "contact">("hero");

  // Active page on left
  const [activePage, setActivePage] = useState<string>("home");

  // Slug Customization State
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [slugInput, setSlugInput] = useState("");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [slugMessage, setSlugMessage] = useState("");
  const [savingSlug, setSavingSlug] = useState(false);

  // Live Repsi DB data for preview
  const [plans, setPlans] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);

  // Section Refs for scroll-into-view
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);
  const trainersRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Load website & synced DB entities
  useEffect(() => {
    async function loadData() {
      try {
        const [siteData, plansData, trainersData] = await Promise.all([
          repsiApi.getMyWebsite().catch(() => null),
          repsiApi.getMembershipPlans().catch(() => []),
          repsiApi.getTrainers().catch(() => []),
        ]);

        if (siteData) {
          setSite(siteData);
          setSlugInput(siteData.subdomain || workspace);
        } else {
          // Fallback defaults
          const defaultSite = {
            subdomain: workspace,
            title: "Apex Fitness Studio",
            tagline: "Transform your body. Elevate your life.",
            primary_color: "#16A34A",
            template_id: "modern-fitness",
            is_published: true,
            about_text:
              "Welcome to our premium fitness studio. We combine state-of-the-art conditioning equipment, certified expert trainers, and an inspiring community to help you crush your fitness goals.",
            opening_hours: "Mon - Sat: 6:00 AM - 10:00 PM | Sun: 7:00 AM - 1:00 PM",
            phone: "+91 98765 43210",
            email: "contact@fitzone.in",
            address: "Main Street Fitness Hub, Coimbatore, Tamil Nadu",
            seo_title: "Apex Fitness | Best Gym & Training Center in Coimbatore",
            seo_description: "Join Apex Fitness for certified personal trainers, premium strength gear, and affordable monthly plans.",
            assistant_enabled: true,
            assistant_name: "Gym Assistant",
            assistant_welcome: "Hi! I'm your gym assistant. How can I help you today?",
            assistant_whatsapp: "+919876543210",
            assistant_character: "welcome",
          };
          setSite(defaultSite);
          setSlugInput(workspace);
        }

        setPlans(
          Array.isArray(plansData) && plansData.length > 0
            ? plansData
            : [
                { id: "1", name: "Starter Monthly", price: 1499, duration_months: 1, description: "Full gym floor access & locker" },
                { id: "2", name: "Pro 3 Months", price: 3999, duration_months: 3, description: "All-access + 2 personal trainer sessions" },
                { id: "3", name: "Annual Elite", price: 11999, duration_months: 12, description: "Unlimited gym, group classes & diet chart" },
              ]
        );

        setTrainers(
          Array.isArray(trainersData) && trainersData.length > 0
            ? trainersData
            : [
                { id: "1", full_name: "Kavya Menon", specialty: "HIIT & Fat Loss", bio: "Certified ACE coach with 6+ years experience" },
                { id: "2", full_name: "Vikram Rathore", specialty: "Strength & Powerlifting", bio: "National powerlifting medalist & coach" },
              ]
        );
      } catch (err) {
        console.error("Failed to load website configuration", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [workspace]);

  // Live Slug Availability Check
  useEffect(() => {
    if (!isEditingSlug || !slugInput.trim()) {
      setSlugStatus("idle");
      setSlugMessage("");
      return;
    }

    const clean = slugInput.trim().toLowerCase();
    if (clean === site?.subdomain?.toLowerCase()) {
      setSlugStatus("available");
      setSlugMessage("Current active address");
      return;
    }

    const timer = setTimeout(async () => {
      setSlugStatus("checking");
      try {
        const res = await repsiApi.checkSlugAvailability(clean);
        if (res.available) {
          setSlugStatus("available");
          setSlugMessage("✓ Available");
        } else {
          setSlugStatus("unavailable");
          setSlugMessage(res.reason || "Address taken");
        }
      } catch {
        setSlugStatus("idle");
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [slugInput, isEditingSlug, site?.subdomain]);

  // Save changes to backend
  const handleSave = async () => {
    if (!site) return;
    setSaving(true);
    try {
      const updated = await repsiApi.updateMyWebsite(site);
      setSite(updated);
      alert("✅ Website updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to save website changes");
    } finally {
      setSaving(false);
    }
  };

  // Toggle publish status
  const handleTogglePublish = async () => {
    if (!site) return;
    setSaving(true);
    try {
      if (site.is_published) {
        const res = await repsiApi.unpublishMyWebsite();
        setSite(res);
      } else {
        const res = await repsiApi.publishMyWebsite();
        setSite(res);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update publish state");
    } finally {
      setSaving(false);
    }
  };

  // Save custom slug
  const handleSaveSlug = async () => {
    if (!slugInput.trim() || slugStatus === "unavailable") return;
    setSavingSlug(true);
    try {
      const updated = await repsiApi.updateMyWebsite({
        ...site,
        subdomain: slugInput.trim().toLowerCase(),
      });
      setSite(updated);
      setIsEditingSlug(false);
      alert(`Website address updated to repsi.app/${updated.subdomain}`);
    } catch (err: any) {
      alert(err.message || "Failed to update address");
    } finally {
      setSavingSlug(false);
    }
  };

  const currentSlug = site?.subdomain || workspace;
  const publicUrl = `https://repsi.app/${currentSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Scroll to section on canvas
  const scrollToSection = (sec: "hero" | "about" | "plans" | "trainers" | "contact") => {
    setActiveSection(sec);
    setInspectorTab("content");
    const map = {
      hero: heroRef,
      about: aboutRef,
      plans: plansRef,
      trainers: trainersRef,
      contact: contactRef,
    };
    map[sec]?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
          <span>Loading Website Builder...</span>
        </div>
      </div>
    );
  }

  const primaryColor = site?.primary_color || "#16A34A";

  return (
    <div className="h-[calc(100vh-6.5rem)] rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col font-sans overflow-hidden shadow-2xl selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. TOP BAR: Clean Studio Header (Light/Dark Theme Adaptive)
      ───────────────────────────────────────────────────────────────────────────── */}
      <header className="h-16 border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur sticky top-0 z-40 px-4 flex items-center justify-between gap-4">
        {/* Left: Back & Gym Brand + Public URL pill */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/${workspace}/dashboard`}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-4 w-[1px] bg-slate-300 dark:bg-zinc-700 hidden sm:block" />

          {/* Prominent Human URL & Status Badge */}
          {!isEditingSlug ? (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-full px-3 py-1 shadow-inner shrink-0">
              <span className="text-slate-500 dark:text-zinc-400 text-xs hidden md:inline">Website:</span>
              <a
                href={`/site/${currentSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 whitespace-nowrap"
              >
                <span>repsi.app/{currentSlug}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
              </a>

              {/* Status Indicator */}
              <span className="flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap pl-1 border-l border-slate-200 dark:border-zinc-800">
                {site?.is_published ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Published
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Draft
                  </span>
                )}
              </span>

              <button
                onClick={handleCopyLink}
                className="p-1 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 rounded transition"
                title="Copy public URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  setSlugInput(currentSlug);
                  setIsEditingSlug(true);
                }}
                className="text-[11px] text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium px-1 border-l border-slate-200 dark:border-zinc-800 transition whitespace-nowrap"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-950 border border-emerald-500/50 rounded-full px-3 py-1 shadow-lg shrink-0">
              <span className="font-mono text-xs text-slate-500 dark:text-zinc-400 whitespace-nowrap">repsi.app/</span>
              <input
                type="text"
                autoFocus
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="fitzone"
                className="bg-transparent font-mono text-xs text-slate-900 dark:text-white font-bold w-28 focus:outline-none"
              />

              {/* Slug Validation Pill */}
              {slugStatus === "checking" && (
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                </span>
              )}
              {slugStatus === "available" && (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 whitespace-nowrap">
                  ✓ Available
                </span>
              )}
              {slugStatus === "unavailable" && (
                <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1 whitespace-nowrap">
                  ✕ {slugMessage}
                </span>
              )}

              <button
                onClick={handleSaveSlug}
                disabled={slugStatus !== "available" || savingSlug}
                className="px-2.5 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition disabled:opacity-40"
              >
                {savingSlug ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditingSlug(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Center: Viewport switch & Canvas Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setViewport("desktop")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewport === "desktop"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewport === "tablet"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                viewport === "mobile"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Website Canvas Theme Mode Toggle */}
          <button
            onClick={() => setCanvasTheme(canvasTheme === "dark" ? "light" : "dark")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition"
            title="Toggle Canvas Preview Light/Dark Theme"
          >
            {canvasTheme === "dark" ? (
              <>
                <span className="text-amber-400">🌙</span>
                <span className="hidden md:inline text-[11px]">Dark Site</span>
              </>
            ) : (
              <>
                <span className="text-amber-500">☀️</span>
                <span className="hidden md:inline text-[11px]">Light Site</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`/site/${currentSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </a>

          <button
            onClick={handleTogglePublish}
            disabled={saving}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              site?.is_published
                ? "bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30"
            }`}
          >
            <span>{site?.is_published ? "Unpublish" : "Publish"}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Draft"}</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. MAIN 3-PANE LAYOUT: Pages (Left) | Canvas (Center) | Edit Inspector (Right)
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ────────────── LEFT PANE: PAGES & SECTION NAVIGATOR ────────────── */}
        <aside className="w-64 border-r border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-6">
            {/* Pages Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Pages</span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">1 Active</span>
              </div>
              <div className="space-y-1">
                {[
                  { id: "home", label: "Home", isMain: true },
                  { id: "about", label: "About", isMain: false },
                  { id: "memberships", label: "Memberships", isMain: false },
                  { id: "trainers", label: "Trainers", isMain: false },
                  { id: "gallery", label: "Gallery", isMain: false },
                  { id: "contact", label: "Contact", isMain: false },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePage(p.id);
                      if (p.id === "home") scrollToSection("hero");
                      else if (p.id === "about") scrollToSection("about");
                      else if (p.id === "memberships") scrollToSection("plans");
                      else if (p.id === "trainers") scrollToSection("trainers");
                      else if (p.id === "contact") scrollToSection("contact");
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      activePage === p.id
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <span>{p.label}</span>
                    {p.isMain && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                        Default
                      </span>
                    )}
                  </button>
                ))}

                <button
                  onClick={() => alert("Multi-page routing will be enabled in upcoming release. Currently all sections seamlessly scroll on the Home page.")}
                  className="w-full flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-zinc-800/40 border border-dashed border-slate-300 dark:border-zinc-800 mt-2 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Page</span>
                </button>
              </div>
            </div>

            {/* Section Quick Jump */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-2">
                Sections on Page
              </span>
              <div className="space-y-1">
                {[
                  { id: "hero", label: "Hero Banner" },
                  { id: "about", label: "About Facility" },
                  { id: "plans", label: "Membership Plans" },
                  { id: "trainers", label: "Trainers & Coaches" },
                  { id: "contact", label: "Hours & Contact" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id as any)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition ${
                      activeSection === s.id && inspectorTab === "content"
                        ? "bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">Edit →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 text-xs space-y-1.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Synced DB</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
              Plans & trainers update automatically whenever you modify them in Repsi.
            </p>
          </div>
        </aside>

        {/* ────────────── CENTER PANE: LIVE WEBSITE CANVAS ────────────── */}
        <main className="flex-1 bg-zinc-950 overflow-y-auto p-4 md:p-6 flex flex-col items-center">
          <div
            className={`w-full transition-all duration-300 ${
              viewport === "mobile"
                ? "max-w-[390px] border-4 border-zinc-800 rounded-[38px] shadow-2xl p-1 bg-zinc-950 overflow-hidden"
                : viewport === "tablet"
                ? "max-w-[768px] border-2 border-zinc-800 rounded-3xl shadow-xl overflow-hidden"
                : "max-w-5xl rounded-2xl border border-zinc-800/80 overflow-hidden shadow-2xl"
            }`}
          >
            {/* Live Interactive Gym Website Render */}
            <div className="bg-[#09090b] text-zinc-100 min-h-screen relative flex flex-col">
              {/* Canvas Navbar */}
              <nav
                onClick={() => {
                  setInspectorTab("content");
                  setActiveSection("hero");
                }}
                className="cursor-pointer border-b border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between bg-zinc-950/80 backdrop-blur sticky top-0 z-20 hover:ring-2 hover:ring-emerald-500/40 transition gap-3"
                title="Click to edit Gym Branding"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-base shadow shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white text-sm md:text-base tracking-tight truncate max-w-[150px] sm:max-w-[200px]">
                    {site?.title || "FITZONE"}
                  </span>
                </div>

                {/* Only render nav links when not in mobile preview */}
                {viewport !== "mobile" ? (
                  <div className="hidden md:flex items-center gap-5 text-xs text-zinc-400 font-medium shrink-0">
                    <span className="hover:text-white transition">Home</span>
                    <span className="hover:text-white transition">Memberships</span>
                    <span className="hover:text-white transition">Trainers</span>
                    <span className="hover:text-white transition">Contact</span>
                  </div>
                ) : null}

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-md transition whitespace-nowrap"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Join Now
                  </button>
                </div>
              </nav>

              {/* 1. Hero Section */}
              <section
                ref={heroRef}
                onClick={() => {
                  setInspectorTab("content");
                  setActiveSection("hero");
                }}
                className={`relative py-12 md:py-20 px-4 md:px-8 text-center cursor-pointer transition group hover:ring-2 hover:ring-emerald-500/50 ${
                  activeSection === "hero" && inspectorTab === "content" ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-zinc-800/90 border border-zinc-700 text-[10px] text-zinc-300 font-medium opacity-70 group-hover:opacity-100 transition shadow">
                  ✏️ Edit Hero
                </div>

                <div className="max-w-2xl mx-auto space-y-3.5">
                  <div>
                    <span
                      className="inline-block text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                      style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                    >
                      {site?.title || "Welcome to Fitzone"}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight px-2">
                    {site?.tagline || "Transform your body. Elevate your life."}
                  </h1>

                  <p className="text-xs md:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed px-2">
                    Premium cardio & strength equipment, certified coaches, and high-energy workout programs.
                  </p>

                  <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                    <button
                      className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-white shadow-lg transition"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Book Free Trial
                    </button>
                    <button className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition">
                      View Plans
                    </button>
                  </div>
                </div>
              </section>

              {/* 2. About Section */}
              <section
                ref={aboutRef}
                onClick={() => {
                  setInspectorTab("content");
                  setActiveSection("about");
                }}
                className={`py-12 px-4 md:px-8 border-t border-zinc-800/80 cursor-pointer transition hover:ring-2 hover:ring-emerald-500/50 ${
                  activeSection === "about" && inspectorTab === "content" ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">About Our Gym</span>
                    <h2 className="text-2xl font-bold text-white">Built for Athletes & Everyday Lifters</h2>
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                      {site?.about_text ||
                        "Welcome to our modern fitness studio featuring certified coaches, state-of-the-art strength gear, and supportive trainers."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                      <div className="text-2xl font-black text-emerald-400">100%</div>
                      <div className="text-[11px] text-zinc-400 mt-1">AC Facility</div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                      <div className="text-2xl font-black text-emerald-400">50+</div>
                      <div className="text-[11px] text-zinc-400 mt-1">Machines</div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                      <div className="text-2xl font-black text-emerald-400">ACE</div>
                      <div className="text-[11px] text-zinc-400 mt-1">Certified Coaches</div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                      <div className="text-2xl font-black text-emerald-400">7 Days</div>
                      <div className="text-[11px] text-zinc-400 mt-1">Open All Week</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Memberships Section */}
              <section
                ref={plansRef}
                onClick={() => {
                  setInspectorTab("content");
                  setActiveSection("plans");
                }}
                className={`py-12 px-4 md:px-8 border-t border-zinc-800/80 cursor-pointer transition hover:ring-2 hover:ring-emerald-500/50 ${
                  activeSection === "plans" && inspectorTab === "content" ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Membership Plans</span>
                    <h2 className="text-2xl font-bold text-white">Transparent & Affordable</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((p, idx) => (
                      <div
                        key={p.id || idx}
                        className={`p-5 rounded-2xl bg-zinc-900/90 border flex flex-col justify-between space-y-4 ${
                          idx === 1 ? "border-emerald-500/50 ring-1 ring-emerald-500/30" : "border-zinc-800"
                        }`}
                      >
                        <div className="space-y-2">
                          <span className="font-bold text-sm text-white">{p.name}</span>
                          <div className="text-2xl font-black text-emerald-400">
                            ₹{p.price?.toLocaleString()}
                            <span className="text-xs font-normal text-zinc-400"> / {p.duration_months} mo</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-snug">{p.description || "All access gym pass"}</p>
                        </div>
                        <button
                          className="w-full py-2 rounded-xl text-xs font-bold text-white transition"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Join This Plan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 4. Trainers Section */}
              <section
                ref={trainersRef}
                onClick={() => {
                  setInspectorTab("content");
                  setActiveSection("trainers");
                }}
                className={`py-12 px-4 md:px-8 border-t border-zinc-800/80 cursor-pointer transition hover:ring-2 hover:ring-emerald-500/50 ${
                  activeSection === "trainers" && inspectorTab === "content" ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Expert Coaches</span>
                    <h2 className="text-2xl font-bold text-white">Train With The Best</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trainers.map((t, idx) => (
                      <div key={t.id || idx} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base shrink-0">
                          {t.full_name?.[0] || t.name?.[0] || "T"}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">{t.full_name || t.name}</div>
                          <div className="text-xs text-emerald-400">{t.specialty || "Fitness Coach"}</div>
                          <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{t.bio || "Certified coach"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 5. Contact / Footer */}
              <section
                ref={contactRef}
                onClick={() => {
                  setInspectorTab("content");
                  setActiveSection("contact");
                }}
                className={`py-12 px-4 md:px-8 border-t border-zinc-800 bg-zinc-950 text-xs text-zinc-400 cursor-pointer transition hover:ring-2 hover:ring-emerald-500/50 ${
                  activeSection === "contact" && inspectorTab === "content" ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-bold text-white text-sm mb-2">{site?.title || "Gym"}</h4>
                    <p className="text-zinc-500">Powered by Repsi.app</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-2">Visiting Hours</h4>
                    <p className="text-zinc-300">{site?.opening_hours || "Mon - Sat: 6:00 AM - 10:00 PM"}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-2">Contact & Address</h4>
                    <p className="text-zinc-300">{site?.address || "Coimbatore, Tamil Nadu"}</p>
                    <p className="text-emerald-400 font-semibold mt-1">{site?.phone || "+91 98765 43210"}</p>
                  </div>
                </div>
              </section>

              {/* Live Assistant Widget Badge preview */}
              {site?.assistant_enabled !== false && (
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-zinc-900 border border-zinc-700 p-2 rounded-full shadow-2xl">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Image
                      src={
                        site?.assistant_character === "fitness"
                          ? "/mascot/fitness.png"
                          : site?.assistant_character === "membership"
                          ? "/mascot/membership.png"
                          : site?.assistant_character === "help"
                          ? "/mascot/help.png"
                          : "/mascot/welcome.png"
                      }
                      alt="Assistant Mascot"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div className="pr-2 hidden sm:block">
                    <span className="text-[10px] font-bold text-white block leading-none">
                      {site?.assistant_name || "Gym Assistant"}
                    </span>
                    <span className="text-[9px] text-emerald-400">Floating Widget</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ────────────── RIGHT PANE: FOCUSED INSPECTOR / EDIT PANEL ────────────── */}
        <aside className="w-80 md:w-96 border-l border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 flex flex-col shrink-0 overflow-y-auto">
          {/* Inspector Top Tabs: Content | Design | SEO | Settings */}
          <div className="p-3 border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 sticky top-0 z-10 grid grid-cols-4 gap-1">
            <button
              onClick={() => setInspectorTab("content")}
              className={`py-1.5 rounded-lg text-xs font-semibold text-center transition ${
                inspectorTab === "content" ? "bg-emerald-600 text-white font-bold" : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setInspectorTab("design")}
              className={`py-1.5 rounded-lg text-xs font-semibold text-center transition ${
                inspectorTab === "design" ? "bg-emerald-600 text-white font-bold" : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Design
            </button>
            <button
              onClick={() => setInspectorTab("seo")}
              className={`py-1.5 rounded-lg text-xs font-semibold text-center transition ${
                inspectorTab === "seo" ? "bg-emerald-600 text-white font-bold" : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              SEO
            </button>
            <button
              onClick={() => setInspectorTab("settings")}
              className={`py-1.5 rounded-lg text-xs font-semibold text-center transition ${
                inspectorTab === "settings" ? "bg-emerald-600 text-white font-bold" : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Settings
            </button>
          </div>

          <div className="p-4 space-y-5 text-xs">
            {/* 1. CONTENT TAB */}
            {inspectorTab === "content" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-zinc-800">
                  <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    Editing: {activeSection.toUpperCase()}
                  </span>
                  <div className="flex gap-1 text-[11px]">
                    {(["hero", "about", "plans", "trainers", "contact"] as const).map((sec) => (
                      <button
                        key={sec}
                        onClick={() => scrollToSection(sec)}
                        className={`px-1.5 py-0.5 rounded capitalize ${
                          activeSection === sec ? "bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white font-bold" : "text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
                        }`}
                      >
                        {sec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hero Form */}
                {activeSection === "hero" && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Gym Name</label>
                      <input
                        type="text"
                        value={site?.title || ""}
                        onChange={(e) => setSite({ ...site, title: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Headline / Tagline</label>
                      <input
                        type="text"
                        value={site?.tagline || ""}
                        onChange={(e) => setSite({ ...site, tagline: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* About Form */}
                {activeSection === "about" && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-300 block mb-1">About Your Facility</label>
                      <textarea
                        rows={5}
                        value={site?.about_text || ""}
                        onChange={(e) => setSite({ ...site, about_text: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Tell visitors about your gym equipment, trainers, and culture..."
                      />
                    </div>
                  </div>
                )}

                {/* Plans Info */}
                {activeSection === "plans" && (
                  <div className="space-y-3">
                    <p className="text-zinc-400">
                      Membership plans are synchronized directly from your Repsi database.
                    </p>
                    <Link
                      href={`/${workspace}/memberships`}
                      className="block w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-center text-xs font-semibold text-zinc-200 transition"
                    >
                      Manage Membership Plans in Repsi →
                    </Link>
                  </div>
                )}

                {/* Trainers Info */}
                {activeSection === "trainers" && (
                  <div className="space-y-3">
                    <p className="text-zinc-400">
                      Coaches and trainer bios are synchronized directly from your Repsi trainer roster.
                    </p>
                    <Link
                      href={`/${workspace}/trainers`}
                      className="block w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-center text-xs font-semibold text-zinc-200 transition"
                    >
                      Manage Trainers in Repsi →
                    </Link>
                  </div>
                )}

                {/* Contact & Hours Form */}
                {activeSection === "contact" && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Opening Hours</label>
                      <input
                        type="text"
                        value={site?.opening_hours || ""}
                        onChange={(e) => setSite({ ...site, opening_hours: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Front Desk Phone</label>
                      <input
                        type="text"
                        value={site?.phone || ""}
                        onChange={(e) => setSite({ ...site, phone: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Address</label>
                      <textarea
                        rows={2}
                        value={site?.address || ""}
                        onChange={(e) => setSite({ ...site, address: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. DESIGN TAB */}
            {inspectorTab === "design" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                    Theme Preset
                  </label>
                  <div className="space-y-2">
                    {TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => setSite({ ...site, template_id: tmpl.id, primary_color: tmpl.accent })}
                        className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                          site?.template_id === tmpl.id
                            ? "bg-zinc-800 border-emerald-500 ring-1 ring-emerald-500"
                            : "bg-zinc-950 border-zinc-800 hover:bg-zinc-800/60"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white text-xs">{tmpl.name}</div>
                          <div className="text-[10px] text-zinc-400">{tmpl.tagline}</div>
                        </div>
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: tmpl.accent }} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    {["#16A34A", "#EAB308", "#F97316", "#8B5CF6", "#06B6D4", "#E11D48"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setSite({ ...site, primary_color: c })}
                        className={`w-8 h-8 rounded-full border-2 transition ${
                          site?.primary_color === c ? "scale-110 border-white" : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. SEO TAB */}
            {inspectorTab === "seo" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Google Page Title</label>
                  <input
                    type="text"
                    value={site?.seo_title || ""}
                    onChange={(e) => setSite({ ...site, seo_title: e.target.value })}
                    placeholder="e.g. Apex Fitness | Best Gym in Coimbatore"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={site?.seo_description || ""}
                    onChange={(e) => setSite({ ...site, seo_description: e.target.value })}
                    placeholder="Brief description shown in Google search results..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Search Engine Card Preview */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-500 font-mono">Google Preview</span>
                  <div className="text-xs font-semibold text-blue-400 hover:underline">
                    {site?.seo_title || `${site?.title || "Gym"} | Best Gym`}
                  </div>
                  <div className="text-[10px] text-emerald-500 font-mono">https://repsi.app/{currentSlug}</div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">
                    {site?.seo_description || "Join our premium gym with expert certified coaches and modern equipment."}
                  </p>
                </div>
              </div>
            )}

            {/* 4. SETTINGS & ASSISTANT TAB */}
            {inspectorTab === "settings" && (
              <div className="space-y-5">
                {/* Website Address Settings */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                    Website Address
                  </span>
                  <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 font-mono text-xs">
                    <span className="text-zinc-500">repsi.app/</span>
                    <input
                      type="text"
                      value={slugInput}
                      onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="bg-transparent font-bold text-emerald-400 w-full focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={slugStatus === "available" ? "text-emerald-400 font-semibold" : "text-zinc-400"}>
                      {slugStatus === "checking" ? "Checking availability..." : slugMessage || "Live URL"}
                    </span>
                    <button
                      onClick={handleSaveSlug}
                      disabled={slugStatus !== "available" || savingSlug}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition disabled:opacity-40"
                    >
                      {savingSlug ? "Updating..." : "Update Address"}
                    </button>
                  </div>
                </div>

                {/* Floating Gym Assistant Config */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                        Gym Assistant Widget
                      </span>
                      <p className="text-[11px] text-zinc-400">Interactive floating assistant on your site</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={site?.assistant_enabled !== false}
                      onChange={(e) => setSite({ ...site, assistant_enabled: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {site?.assistant_enabled !== false && (
                    <div className="space-y-3 pt-1 border-t border-zinc-850">
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Assistant Name</label>
                        <input
                          type="text"
                          value={site?.assistant_name || "Gym Assistant"}
                          onChange={(e) => setSite({ ...site, assistant_name: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Welcome Message</label>
                        <textarea
                          rows={2}
                          value={site?.assistant_welcome || "Hi! I'm your gym assistant. How can I help you today?"}
                          onChange={(e) => setSite({ ...site, assistant_welcome: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-zinc-300 block mb-1">WhatsApp Phone Number</label>
                        <input
                          type="text"
                          placeholder="+91 98765 43210"
                          value={site?.assistant_whatsapp || site?.phone || ""}
                          onChange={(e) => setSite({ ...site, assistant_whatsapp: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Character Mascot Selection */}
                      <div>
                        <label className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
                          Mascot Character
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { id: "welcome", label: "Welcome", img: "/mascot/welcome.png" },
                            { id: "fitness", label: "Weights", img: "/mascot/fitness.png" },
                            { id: "membership", label: "Pass", img: "/mascot/membership.png" },
                            { id: "help", label: "Calendar", img: "/mascot/help.png" },
                          ].map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setSite({ ...site, assistant_character: c.id })}
                              className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                                (site?.assistant_character || "welcome") === c.id
                                  ? "bg-zinc-800 border-emerald-500 ring-1 ring-emerald-500"
                                  : "bg-zinc-900 border-zinc-800 hover:bg-zinc-850"
                              }`}
                            >
                              <div className="w-8 h-8 relative flex items-center justify-center">
                                <Image src={c.img} alt={c.label} width={32} height={32} className="object-contain" />
                              </div>
                              <span className="text-[10px] text-zinc-300 font-medium">{c.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Domain Section */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                    Custom Domain
                  </span>
                  <p className="text-[11px] text-zinc-400">
                    Connect your own domain (e.g. fitzonegym.com). Your Repsi URL (repsi.app/{currentSlug}) will always continue working as a fallback.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. mygym.com"
                      value={site?.custom_domain || ""}
                      onChange={(e) => setSite({ ...site, custom_domain: e.target.value })}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => alert("Custom domain setup instructions sent! Point your domain's CNAME record to sites.repsi.app.")}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
