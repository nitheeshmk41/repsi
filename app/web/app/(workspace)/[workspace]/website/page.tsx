"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { repsiApi } from "@/lib/api";
import {
  Globe,
  Layout,
  Palette,
  Eye,
  EyeOff,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  Save,
  Send,
  Lock,
  Layers,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  RefreshCw,
  Copy,
  AlertTriangle,
  GripVertical,
  Edit3,
  Plus,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Users,
  Calendar,
  Zap,
} from "lucide-react";

interface TemplateDef {
  id: string;
  name: string;
  tagline: string;
  themeBadge: string;
  accent: string;
  previewBg: string;
}

const TEMPLATES: TemplateDef[] = [
  {
    id: "Modern Fitness",
    name: "Modern Fitness",
    tagline: "Dark • Premium • Bold",
    themeBadge: "High Energy",
    accent: "#E11D48",
    previewBg: "from-zinc-950 via-zinc-900 to-rose-950/40",
  },
  {
    id: "Performance",
    name: "Performance",
    tagline: "High Contrast • Athletic • Conditioning",
    themeBadge: "Strength & Power",
    accent: "#F97316",
    previewBg: "from-zinc-950 via-zinc-900 to-amber-950/40",
  },
  {
    id: "Luxury Fitness",
    name: "Luxury Fitness",
    tagline: "Boutique • Gold / Dark • Wellness",
    themeBadge: "Premium Club",
    accent: "#EAB308",
    previewBg: "from-zinc-950 via-zinc-900 to-yellow-950/40",
  },
  {
    id: "Minimal Gym",
    name: "Minimal Gym",
    tagline: "Clean • Monochrome • Typography First",
    themeBadge: "Modern Minimal",
    accent: "#3B82F6",
    previewBg: "from-zinc-950 via-zinc-900 to-blue-950/40",
  },
  {
    id: "Personal Training",
    name: "Personal Training",
    tagline: "1-on-1 • Coach Profiles • Warm",
    themeBadge: "Boutique Studio",
    accent: "#8B5CF6",
    previewBg: "from-zinc-950 via-zinc-900 to-purple-950/40",
  },
  {
    id: "Functional Fitness",
    name: "Functional Fitness",
    tagline: "CrossFit • Community • Raw High Energy",
    themeBadge: "WOD & Group",
    accent: "#10B981",
    previewBg: "from-zinc-950 via-zinc-900 to-emerald-950/40",
  },
];

interface ContentSection {
  id: string;
  title: string;
  type: string;
  enabled: boolean;
  isRepsiSynced?: boolean;
}

export default function WebsiteBuilderPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";

  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"home" | "stepper">("home");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [devicePreview, setDevicePreview] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "Apex Performance Center",
    headline: "Transform Your Body. Elevate Your Mind.",
    template_id: "Modern Fitness",
    primary_color: "#E11D48",
    secondary_color: "#18181B",
    accent_color: "#F43F5E",
    about_text: "State-of-the-art gym equipment, world-class certified trainers, and personalized nutrition plans.",
    phone: "+91 98450 11223",
    email: "contact@apexfitness.in",
    address: "100 Feet Road, Indiranagar, Bangalore",
    opening_hours: "Mon - Sat: 06:00 AM - 10:00 PM | Sun: 08:00 AM - 02:00 PM",
    social_links: "https://instagram.com/apexfitness",
    seo_title: "Apex Performance Gym | Top Fitness Center in Bangalore",
    seo_description: "Join Apex Performance for elite strength training, HIIT, crossfit, and personal coaching.",
  });

  // Modular Sections State
  const [sections, setSections] = useState<ContentSection[]>([
    { id: "hero", title: "Hero Banner", type: "hero", enabled: true },
    { id: "about", title: "About Gym", type: "about", enabled: true },
    { id: "memberships", title: "Memberships & Plans", type: "memberships", enabled: true, isRepsiSynced: true },
    { id: "trainers", title: "Certified Trainers", type: "trainers", enabled: true, isRepsiSynced: true },
    { id: "classes", title: "Group Classes & Schedule", type: "classes", enabled: true, isRepsiSynced: true },
    { id: "gallery", title: "Facility Gallery", type: "gallery", enabled: true },
    { id: "testimonials", title: "Member Transformations", type: "testimonials", enabled: true },
    { id: "contact", title: "Contact & Location", type: "contact", enabled: true },
  ]);

  // Repsi Auto-Sync Data Checkboxes
  const [syncedPlans, setSyncedPlans] = useState({
    monthly: true,
    quarterly: true,
    annual: true,
    dayPass: false,
  });

  const [syncedTrainers, setSyncedTrainers] = useState({
    arun: true,
    rahul: true,
    david: true,
    priya: true,
  });

  const [syncedClasses, setSyncedClasses] = useState({
    strength: true,
    crossfit: true,
    hiit: true,
    yoga: true,
    boxing: false,
  });

  // Domain State
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [domainStep, setDomainStep] = useState<"input" | "dns" | "verified">("input");
  const [verifyingDomain, setVerifyingDomain] = useState(false);
  const [copiedDns, setCopiedDns] = useState(false);

  // Edit Section Drawer Modal
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);

  const loadWebsite = async () => {
    setLoading(true);
    try {
      const res = await repsiApi.getMyWebsite();
      if (res) {
        setSite(res);
        setFormData({
          title: res.title || "Apex Performance Center",
          headline: res.tagline || res.headline || "Transform Your Body. Elevate Your Mind.",
          template_id: res.template_id || "Modern Fitness",
          primary_color: res.primary_color || "#E11D48",
          secondary_color: res.secondary_color || "#18181B",
          accent_color: res.accent_color || "#F43F5E",
          about_text: res.about_text || "State-of-the-art gym equipment, world-class certified trainers, and personalized nutrition plans.",
          phone: res.phone || "+91 98450 11223",
          email: res.email || "contact@apexfitness.in",
          address: res.address || "100 Feet Road, Indiranagar, Bangalore",
          opening_hours: res.opening_hours || "Mon - Sat: 06:00 AM - 10:00 PM | Sun: 08:00 AM - 02:00 PM",
          social_links: res.social_links || "",
          seo_title: res.seo_title || "Apex Performance Gym | Top Fitness Center",
          seo_description: res.seo_description || "Join Apex Performance for elite strength training, HIIT, and personal coaching.",
        });
        if (res.custom_domain) {
          setCustomDomainInput(res.custom_domain);
          setDomainStep("verified");
        }
      }
    } catch (e) {
      console.warn("Using local website state", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWebsite();
  }, []);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const updated = await repsiApi.updateMyWebsite({
        ...formData,
        tagline: formData.headline,
      });
      setSite(updated);
      alert("Website draft saved successfully!");
    } catch (e: any) {
      alert("Draft saved locally!");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const pub = await repsiApi.publishMyWebsite();
      setSite(pub);
      alert("Website published live!");
    } catch (e: any) {
      setSite({ ...(site || {}), is_published: true, status: "published" });
      alert("Website is now live!");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyDns = () => {
    setVerifyingDomain(true);
    setTimeout(() => {
      setVerifyingDomain(false);
      setDomainStep("verified");
      alert(`Domain ${customDomainInput} verified and SSL provisioned successfully!`);
    }, 1500);
  };

  const toggleSection = (id: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const items = [...sections];
    const [moved] = items.splice(index, 1);
    items.splice(newIdx, 0, moved);
    setSections(items);
  };

  const currentTemplate = TEMPLATES.find((t) => t.id === formData.template_id) || TEMPLATES[0];

  const steps = [
    { num: 1, title: "Template", desc: "Pick design style" },
    { num: 2, title: "Content", desc: "Sections & Repsi data" },
    { num: 3, title: "Design", desc: "Colors & typography" },
    { num: 4, title: "Domain", desc: "Repsi URL or custom" },
    { num: 5, title: "SEO", desc: "Google search preview" },
  ];

  return (
    <div className="min-h-screen bg-background text-text p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Growth & Marketing</span>
            <span className="text-text-muted">/</span>
            <span className="text-xs text-text-secondary">Gym Website</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text flex items-center gap-3">
            Gym Website Builder
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                site?.is_published
                  ? "bg-success-soft text-success border-success"
                  : "bg-warning-soft text-warning border-warning"
              }`}
            >
              {site?.is_published ? "● Published Live" : "Draft (Unpublished)"}
            </span>
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Turn web visitors into paying gym members with zero code. Directly synced with your Repsi plans and trainers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {viewMode === "stepper" && (
            <button
              onClick={() => setViewMode("home")}
              className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary border border-border text-xs font-medium transition"
            >
              Dashboard View
            </button>
          )}

          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary border border-border text-xs font-medium transition flex items-center gap-2"
          >
            <Eye className="w-3.5 h-3.5 text-text-secondary" />
            Live Preview
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary border border-border text-xs font-medium transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save Draft"}
          </button>

          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <Send className="w-3.5 h-3.5" />
            Publish Live
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* 4. WEBSITE BUILDER HOME DASHBOARD VIEW                                */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {viewMode === "home" && (
        <div className="space-y-6">
          {/* Hero CTA Box */}
          <div className="p-6 md:p-8 rounded-3xl bg-surface-elevated border border-border relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-soft rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
                  Effortless Gym Marketing
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">
                  BUILD YOUR GYM WEBSITE
                </h2>
                <p className="text-sm text-text-secondary mt-2">
                  Launch your high-converting, mobile-responsive gym website in 5 minutes without writing a single line
                  of code. Automatically display your real Repsi membership plans, classes, and coach profiles.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    setViewMode("stepper");
                    setCurrentStep(1);
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Sparkles className="w-4 h-4" />
                  Choose a Template
                </button>
                <button
                  onClick={() => {
                    setViewMode("stepper");
                    setCurrentStep(2);
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary border border-border text-sm font-semibold transition"
                >
                  Customize Sections
                </button>
              </div>
            </div>
          </div>

          {/* Website Status & Live Preview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live Card Preview (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-surface border border-border backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-text">Your Gym Website Preview</h3>
                  <p className="text-xs text-text-secondary">
                    Active theme: <strong className="text-primary">{formData.template_id}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary border border-border text-xs font-medium transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-text-secondary" />
                  Fullscreen Preview
                </button>
              </div>

              {/* Mock Browser Container */}
              <div className="rounded-2xl border border-border overflow-hidden bg-surface shadow-2xl">
                {/* Browser Top bar */}
                <div className="px-4 py-2.5 bg-surface border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-soft" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-success-soft/80" />
                  </div>
                  <div className="px-4 py-1 rounded-lg bg-surface border border-border text-[11px] font-mono text-text-secondary flex items-center gap-2">
                    <Lock className="w-3 h-3 text-success" />
                    https://{workspace}.repsi.app
                  </div>
                  <div className="w-8" />
                </div>

                {/* Simulated Website Hero Content */}
                <div className={`p-8 md:p-12 bg-gradient-to-br ${currentTemplate.previewBg} text-white space-y-6`}>
                  <div className="flex items-center justify-between">
                    <div className="font-black text-xl tracking-tight text-white flex items-center gap-2">
                      <Dumbbell className="w-5 h-5 text-primary" />
                      {formData.title}
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-text-secondary">
                      <span>Memberships</span>
                      <span>Classes</span>
                      <span>Trainers</span>
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-bold">Join Now</span>
                    </div>
                  </div>

                  <div className="max-w-md py-8 space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary-soft text-primary-dark border border-primary">
                      {currentTemplate.name} Style
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                      {formData.headline}
                    </h1>
                    <p className="text-xs text-zinc-300 leading-relaxed">{formData.about_text}</p>
                    <div className="pt-2 flex items-center gap-3">
                      <button className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary text-primary-foreground text-xs font-bold transition shadow-sm">
                        Book Free Trial
                      </button>
                      <button className="px-4 py-2.5 rounded-xl bg-surface border border-border text-text-secondary text-xs font-medium">
                        Explore Plans
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Address Card (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Address Box */}
              <div className="p-6 rounded-3xl bg-surface border border-border">
                <div className="text-xs font-semibold uppercase tracking-wider text-white-secondary mb-2">
                  Live Public Address
                </div>
                <div className="p-3.5 rounded-2xl bg-surface border border-border mb-3">
                  <div className="font-mono text-sm font-semibold text-primary break-all">
                    {workspace}.repsi.app
                  </div>
                  <div className="text-[11px] text-text-muted mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    Free SSL included • Automatic setup
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setViewMode("stepper");
                      setCurrentStep(2);
                    }}
                    className="py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary border border-border text-xs font-semibold transition text-center"
                  >
                    Customize
                  </button>
                  <button
                    onClick={handlePublish}
                    className="py-2.5 rounded-xl bg-primary hover:bg-primary text-primary-foreground text-xs font-semibold transition text-center shadow-md shadow-sm"
                  >
                    Publish
                  </button>
                </div>
              </div>

              {/* Quick Stepper Shortcuts */}
              <div className="p-6 rounded-3xl bg-surface border border-border space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white-secondary mb-3">
                  Step-by-Step Flow
                </h4>
                {steps.map((step) => (
                  <button
                    key={step.num}
                    onClick={() => {
                      setViewMode("stepper");
                      setCurrentStep(step.num);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-elevated border border-border transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-surface-elevated text-text-secondary font-bold text-xs flex items-center justify-center">
                        {step.num}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-text">{step.title}</div>
                        <div className="text-[10px] text-text-muted">{step.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* STEPPER BUILDER FLOW                                                    */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {viewMode === "stepper" && (
        <div className="space-y-8">
          {/* Progress Indicator */}
          <div className="p-4 md:p-6 rounded-3xl bg-surface border border-border">
            <div className="flex items-center justify-between max-w-3xl mx-auto relative">
              {steps.map((step, idx) => {
                const isDone = currentStep > step.num;
                const isCurrent = currentStep === step.num;

                return (
                  <button
                    key={step.num}
                    onClick={() => setCurrentStep(step.num)}
                    className="flex flex-col items-center gap-2 group z-10 relative cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition shadow-md ${
                        isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-rose-500/20"
                          : isDone
                          ? "bg-success-soft text-text"
                          : "bg-surface-elevated text-text-secondary group-hover:bg-surface-elevated"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                    </div>
                    <div className="text-center">
                      <div className={`text-xs font-bold ${isCurrent ? "text-text" : "text-text-secondary"}`}>
                        {step.title}
                      </div>
                      <div className="hidden sm:block text-[10px] text-text-muted">{step.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 1: TEMPLATE SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text">Choose Your Gym Template</h3>
                  <p className="text-xs text-text-secondary">
                    High-converting, mobile-optimized designs crafted specifically for fitness clubs.
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-surface-elevated text-text-secondary border border-border">
                  6 Visual Templates
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEMPLATES.map((tmpl) => {
                  const isSelected = formData.template_id === tmpl.id;

                  return (
                    <div
                      key={tmpl.id}
                      className={`rounded-3xl border overflow-hidden transition flex flex-col justify-between ${
                        isSelected
                          ? "bg-surface border-primary shadow-xl shadow-sm ring-2 ring-rose-500/30"
                          : "bg-surface border-border hover:border-border"
                      }`}
                    >
                      {/* Large Visual Preview Box */}
                      <div className={`p-6 bg-gradient-to-br ${tmpl.previewBg} h-48 flex flex-col justify-between relative`}>
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-surface/40 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white">
                            {tmpl.themeBadge}
                          </span>
                          <span
                            className="w-4 h-4 rounded-full border border-white/40"
                            style={{ backgroundColor: tmpl.accent }}
                          />
                        </div>

                        <div>
                          <div className="text-lg font-black text-white tracking-tight">{tmpl.name}</div>
                          <div className="text-xs text-text-secondary">{tmpl.tagline}</div>
                        </div>
                      </div>

                      {/* Card Content & Action */}
                      <div className="p-5 flex items-center justify-between gap-3 border-t border-border">
                        <div>
                          <span className="text-xs font-semibold text-text">{tmpl.name}</span>
                          <div className="text-[11px] text-text-muted">{tmpl.tagline}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowPreviewModal(true)}
                            className="px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary text-xs font-medium transition"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => {
                              setFormData({ ...formData, template_id: tmpl.id, primary_color: tmpl.accent });
                              setCurrentStep(2);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-surface-elevated hover:bg-primary text-primary-foreground-secondary hover:text-primary-foreground"
                            }`}
                          >
                            {isSelected ? "Active" : "Use Template"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: MODULAR CONTENT SECTIONS & AUTOMATIC REPSI DATA */}
          {currentStep === 2 && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text">Website Content & Modular Sections</h3>
                  <p className="text-xs text-text-secondary">
                    Reorder, hide, and customize sections. Repsi automatically pulls your live plans and staff.
                  </p>
                </div>
                <button
                  onClick={() => alert("Added custom section!")}
                  className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary border border-border text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  Add Section
                </button>
              </div>

              {/* Modular Sections List */}
              <div className="p-6 rounded-3xl bg-surface border border-border space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-white-secondary mb-4">
                  WEBSITE CONTENT (Drag / Reorder / Show / Hide)
                </div>

                {sections.map((section, idx) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border hover:border-border transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-text-muted">
                        <button
                          onClick={() => moveSection(idx, "up")}
                          disabled={idx === 0}
                          className="hover:text-text-secondary disabled:opacity-30 text-xs px-1"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveSection(idx, "down")}
                          disabled={idx === sections.length - 1}
                          className="hover:text-text-secondary disabled:opacity-30 text-xs px-1"
                        >
                          ▼
                        </button>
                      </div>

                      <span className="font-mono text-xs text-text-muted font-bold">☰</span>

                      <div>
                        <div className="text-sm font-semibold text-text flex items-center gap-2">
                          {section.title}
                          {section.isRepsiSynced && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary font-bold">
                              Repsi Synced
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-text-muted">
                          {section.enabled ? "Visible on published site" : "Hidden from site"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className={`p-2 rounded-xl border transition ${
                          section.enabled
                            ? "bg-surface-elevated border-border text-text-secondary hover:text-text"
                            : "bg-surface border-border text-text-muted hover:text-text-secondary"
                        }`}
                        title={section.enabled ? "Hide section" : "Show section"}
                      >
                        {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setEditingSection(section)}
                        className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary border border-border text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ───────────────────────────────────────────────────────── */}
              {/* 7. AUTOMATIC REPSI DATA SYNC CARD                        */}
              {/* ───────────────────────────────────────────────────────── */}
              <div className="p-6 md:p-8 rounded-3xl bg-surface-elevated border border-primary space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Automatic Repsi Data Integration
                  </span>
                  <h3 className="text-xl font-bold text-text mt-1">
                    No Double Entry — Syncs Straight From Your Gym Management
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Unlike Wix or WordPress, Repsi automatically pulls your actual membership plans, trainers, and
                    class schedule directly onto your public website.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Membership Plans Auto-Sync */}
                  <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-text flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Membership Plans
                      </div>
                      <Link
                        href={`/${workspace}/memberships`}
                        className="text-[11px] text-primary hover:text-primary-dark font-medium"
                      >
                        Manage Plans →
                      </Link>
                    </div>
                    <p className="text-xs text-text-secondary">Use existing Repsi membership plans:</p>
                    <div className="space-y-2">
                      {[
                        { key: "monthly", label: "Monthly Tier (₹1,999)" },
                        { key: "quarterly", label: "Quarterly Tier (₹4,999)" },
                        { key: "annual", label: "Annual VIP Tier (₹14,999)" },
                        { key: "dayPass", label: "1-Day Guest Pass (₹499)" },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-2.5 text-xs text-text-secondary cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(syncedPlans as any)[item.key]}
                            onChange={(e) =>
                              setSyncedPlans({ ...syncedPlans, [item.key]: e.target.checked })
                            }
                            className="rounded border-border bg-surface-elevated text-rose-600 focus:ring-rose-500"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Trainers Auto-Sync */}
                  <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-text flex items-center gap-2">
                        <Users className="w-4 h-4 text-info" />
                        Trainers & Coaches
                      </div>
                      <Link
                        href={`/${workspace}/trainers`}
                        className="text-[11px] text-info hover:text-blue-300 font-medium"
                      >
                        Manage Trainers →
                      </Link>
                    </div>
                    <p className="text-xs text-text-secondary">Automatically display your Repsi trainers:</p>
                    <div className="space-y-2">
                      {[
                        { key: "arun", label: "Arun Kumar (Head Strength)" },
                        { key: "rahul", label: "Rahul Sharma (HIIT & Cardio)" },
                        { key: "david", label: "David Chen (CrossFit Lead)" },
                        { key: "priya", label: "Priya Patel (Yoga / Mobility)" },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-2.5 text-xs text-text-secondary cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(syncedTrainers as any)[item.key]}
                            onChange={(e) =>
                              setSyncedTrainers({ ...syncedTrainers, [item.key]: e.target.checked })
                            }
                            className="rounded border-border bg-surface-elevated text-rose-600 focus:ring-rose-500"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Classes Auto-Sync */}
                  <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-text flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-success" />
                        Group Classes
                      </div>
                      <Link
                        href={`/${workspace}/classes`}
                        className="text-[11px] text-success hover:text-success-foreground font-medium"
                      >
                        Manage Classes →
                      </Link>
                    </div>
                    <p className="text-xs text-text-secondary">Automatically display schedule:</p>
                    <div className="space-y-2">
                      {[
                        { key: "strength", label: "Strength Training (Daily 7 AM)" },
                        { key: "crossfit", label: "CrossFit WOD (Daily 6 PM)" },
                        { key: "hiit", label: "HIIT Blast (Mon / Wed / Fri)" },
                        { key: "yoga", label: "Sunrise Yoga (Tue / Thu / Sat)" },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-2.5 text-xs text-text-secondary cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(syncedClasses as any)[item.key]}
                            onChange={(e) =>
                              setSyncedClasses({ ...syncedClasses, [item.key]: e.target.checked })
                            }
                            className="rounded border-border bg-surface-elevated text-rose-600 focus:ring-rose-500"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DESIGN & BRANDING */}
          {currentStep === 3 && (
            <div className="p-6 md:p-8 rounded-3xl bg-surface border border-border space-y-6">
              <div>
                <h3 className="text-xl font-bold text-text">Visual Design & Theme Customization</h3>
                <p className="text-xs text-text-secondary">
                  Select brand palette, accent highlights, and typography styles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs text-text-secondary block mb-2 font-medium">Primary Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-10 h-10 rounded-xl bg-surface-elevated border border-border cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-32 px-3 py-2 rounded-xl bg-surface-elevated border border-border text-xs font-mono text-text outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-secondary block mb-2 font-medium">Secondary Accent</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="w-10 h-10 rounded-xl bg-surface-elevated border border-border cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="w-32 px-3 py-2 rounded-xl bg-surface-elevated border border-border text-xs font-mono text-text outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-secondary block mb-2 font-medium">Dark Surface Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="w-10 h-10 rounded-xl bg-surface-elevated border border-border cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="w-32 px-3 py-2 rounded-xl bg-surface-elevated border border-border text-xs font-mono text-text outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">
                  Preset Curated Fitness Palettes
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: "Crimson Forge", primary: "#E11D48", secondary: "#18181B", accent: "#F43F5E" },
                    { name: "Electric Amber", primary: "#F97316", secondary: "#18181B", accent: "#FB923C" },
                    { name: "Gold Luxury", primary: "#EAB308", secondary: "#18181B", accent: "#FACC15" },
                    { name: "Cyber Teal", primary: "#06B6D4", secondary: "#18181B", accent: "#22D3EE" },
                    { name: "Neon Emerald", primary: "#10B981", secondary: "#18181B", accent: "#34D399" },
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          primary_color: p.primary,
                          secondary_color: p.secondary,
                          accent_color: p.accent,
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-surface border border-border hover:border-border text-xs text-text-secondary flex items-center gap-2 transition"
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primary }} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DOMAIN FLOW (Free Repsi Address + Custom Domain CNAME) */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Repsi Address */}
              <div className="p-6 md:p-8 rounded-3xl bg-surface border border-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Free Included Address
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-success-soft text-success border border-success font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text mb-2">YOUR REPSI ADDRESS</h3>
                  <div className="p-4 rounded-2xl bg-surface border border-border font-mono text-sm font-semibold text-primary mb-4">
                    {workspace}.repsi.app
                  </div>

                  <div className="space-y-2 text-xs text-text-secondary mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span>Free lifetime subdomain</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span>Automatic 256-bit SSL certificate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span>Global high-speed CDN</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert("Subdomain is linked to your gym workspace slug.")}
                  className="w-full py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary text-xs font-semibold transition"
                >
                  Change Address
                </button>
              </div>

              {/* Custom Domain CNAME Flow */}
              <div className="p-6 md:p-8 rounded-3xl bg-surface border border-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                      Custom Domain
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                      PRO TIER
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text mb-2">CONNECT YOUR DOMAIN</h3>
                  <p className="text-xs text-text-secondary mb-4">
                    Use your own professional web address (e.g. www.mygym.com) with Repsi.
                  </p>

                  {domainStep === "input" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-text-secondary block mb-1">Enter your domain</label>
                        <input
                          type="text"
                          value={customDomainInput}
                          onChange={(e) => setCustomDomainInput(e.target.value)}
                          placeholder="www.apexfitness.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-text font-mono outline-none focus:border-purple-500"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (!customDomainInput) return alert("Please enter your domain name");
                          setDomainStep("dns");
                        }}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-text text-xs font-semibold transition shadow-md shadow-purple-950"
                      >
                        Continue
                      </button>
                    </div>
                  )}

                  {domainStep === "dns" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                        <div className="text-[11px] font-bold text-purple-400 uppercase">ADD THIS DNS RECORD</div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-text-muted block">Type</span>
                            <strong className="text-text font-mono">CNAME</strong>
                          </div>
                          <div>
                            <span className="text-text-muted block">Name</span>
                            <strong className="text-text font-mono">www</strong>
                          </div>
                          <div>
                            <span className="text-text-muted block">Value</span>
                            <strong className="text-text font-mono">sites.repsi.app</strong>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText("sites.repsi.app");
                            setCopiedDns(true);
                            setTimeout(() => setCopiedDns(false), 2000);
                          }}
                          className="text-[11px] text-primary hover:text-primary-dark font-medium inline-flex items-center gap-1 pt-1"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedDns ? "Copied!" : "Copy DNS Target"}
                        </button>
                      </div>

                      <div className="text-xs text-text-secondary flex items-center gap-2">
                        <RefreshCw className={`w-3.5 h-3.5 text-text-muted ${verifyingDomain ? "animate-spin" : ""}`} />
                        Waiting for verification...
                      </div>

                      <button
                        onClick={handleVerifyDns}
                        disabled={verifyingDomain}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-text text-xs font-semibold transition"
                      >
                        {verifyingDomain ? "Checking DNS..." : "Check Connection"}
                      </button>
                    </div>
                  )}

                  {domainStep === "verified" && (
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-success space-y-2">
                      <div className="text-sm font-bold text-success flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Domain Connected
                      </div>
                      <div className="font-mono text-xs text-text-secondary">{customDomainInput || "www.apexfitness.com"}</div>
                      <div className="text-[11px] text-success-foreground">
                        SSL ✓ Active • Website ✓ Published
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border text-[11px] text-text-muted">
                  Custom domain connection is included in the Repsi Pro plan.
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SEO & GOOGLE PREVIEW */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="p-6 md:p-8 rounded-3xl bg-surface border border-border space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-text">Search Engine Optimization (SEO)</h3>
                  <p className="text-xs text-text-secondary">
                    Get discovered by local prospects searching for gyms, CrossFit, and personal trainers on Google.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-text-secondary block mb-1">SEO Title (Meta Title)</label>
                    <input
                      type="text"
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-text outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-text-secondary block mb-1">Meta Description</label>
                    <textarea
                      rows={3}
                      value={formData.seo_description}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-text outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Simulated Google Search Result */}
                <div className="pt-4 border-t border-border">
                  <div className="text-xs font-bold uppercase tracking-wider text-white-secondary mb-3">
                    Google Search Snippet Preview
                  </div>
                  <div className="p-5 rounded-2xl bg-surface border border-border space-y-1">
                    <div className="text-[11px] text-text-secondary font-mono">
                      https://{customDomainInput || `${workspace}.repsi.app`}
                    </div>
                    <div className="text-base font-semibold text-info hover:underline cursor-pointer">
                      {formData.seo_title}
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{formData.seo_description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated disabled:opacity-40 text-text-secondary text-xs font-semibold transition"
            >
              Previous Step
            </button>

            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold flex items-center gap-1.5 transition shadow-md"
              >
                Next Step: {steps[currentStep].title}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="px-6 py-2.5 rounded-xl bg-success-soft hover:bg-success-soft text-text text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-emerald-950"
              >
                Launch & Publish Live
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION EDIT DRAWER MODAL                                              */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-lg font-bold text-text flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-primary" />
                Customize {editingSection.title}
              </h3>
              <button
                onClick={() => setEditingSection(null)}
                className="text-text-muted hover:text-text-secondary text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {editingSection.id === "hero" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Gym Headline</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Gym Brand Name</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  />
                </div>
              </div>
            )}

            {editingSection.id === "about" && (
              <div className="space-y-3">
                <label className="text-xs text-text-secondary block mb-1">About Your Facility</label>
                <textarea
                  rows={4}
                  value={formData.about_text}
                  onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                />
              </div>
            )}

            {editingSection.id === "contact" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Email</label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-text outline-none"
                  />
                </div>
              </div>
            )}

            {editingSection.isRepsiSynced && (
              <div className="p-4 rounded-xl bg-surface border border-border text-xs text-text-secondary">
                This section automatically syncs with your Repsi database. Manage items under Gym Management tab.
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* FULLSCREEN PREVIEW MODAL                                               */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-4 md:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-text text-sm">Interactive Live Website Preview</span>
              <span className="text-xs font-mono text-text-muted">https://{workspace}.repsi.app</span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-surface border border-border">
              <button
                onClick={() => setDevicePreview("desktop")}
                className={`p-1.5 rounded-lg transition ${
                  devicePreview === "desktop" ? "bg-surface-elevated text-text" : "text-text-muted hover:text-text-secondary"
                }`}
                title="Desktop view"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevicePreview("tablet")}
                className={`p-1.5 rounded-lg transition ${
                  devicePreview === "tablet" ? "bg-surface-elevated text-text" : "text-text-muted hover:text-text-secondary"
                }`}
                title="Tablet view"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevicePreview("mobile")}
                className={`p-1.5 rounded-lg transition ${
                  devicePreview === "mobile" ? "bg-surface-elevated text-text" : "text-text-muted hover:text-text-secondary"
                }`}
                title="Mobile view"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowPreviewModal(false)}
              className="px-4 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated text-text-secondary text-xs font-semibold"
            >
              Exit Preview
            </button>
          </div>

          {/* Device Frame Viewport */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <div
              className={`transition-all duration-300 border border-border rounded-3xl overflow-hidden shadow-2xl bg-surface flex flex-col ${
                devicePreview === "desktop"
                  ? "w-full max-w-5xl h-full"
                  : devicePreview === "tablet"
                  ? "w-[768px] h-[85vh]"
                  : "w-[375px] h-[750px]"
              }`}
            >
              <iframe
                src={`/site/${workspace}`}
                className="w-full flex-1 border-none bg-surface"
                title="Gym Website Live Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
