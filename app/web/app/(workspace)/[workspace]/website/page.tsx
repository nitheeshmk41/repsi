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
  Layout as LayoutIcon,
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
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Upload,
  Image as ImageIcon,
  Layers,
  Sliders,
  Type,
  Sun,
  Moon,
  Laptop,
  CheckSquare,
  Square,
  FileText,
  Star,
  Quote,
  ShieldAlert,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Preset Templates ──────────────────────────────────────────────────────────
export interface TemplateOption {
  id: string;
  name: string;
  category: string;
  tagline: string;
  accent: string;
  theme: "dark" | "light";
  description: string;
  previewBg: string;
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: "modern-fitness",
    name: "Modern Fitness",
    category: "Commercial Gym",
    tagline: "Dark • High-Energy • Bold Typography",
    accent: "#16A34A",
    theme: "dark",
    description: "Sleek dark layout designed for high-energy commercial gyms and strength hubs.",
    previewBg: "from-zinc-950 to-emerald-950"
  },
  {
    id: "clean-studio",
    name: "Clean Studio",
    category: "Boutique Studio",
    tagline: "Light • Minimalist • Airy & Spacious",
    accent: "#0EA5E9",
    theme: "light",
    description: "Pure white, minimalist aesthetic ideal for pilates, yoga, and wellness studios.",
    previewBg: "from-slate-100 to-sky-50"
  },
  {
    id: "premium-gym",
    name: "Premium Gym",
    category: "Luxury Fitness",
    tagline: "Black & Gold • Luxury • Exclusive",
    accent: "#EAB308",
    theme: "dark",
    description: "Deep obsidian theme with metallic gold accents for high-end boutique clubs.",
    previewBg: "from-black to-amber-950"
  },
  {
    id: "sports-club",
    name: "Sports Club",
    category: "Athletics & Performance",
    tagline: "Royal Navy • Energetic • Image Heavy",
    accent: "#2563EB",
    theme: "dark",
    description: "Vibrant athletic theme tailored for multi-sport centers and cross-training boxes.",
    previewBg: "from-slate-900 to-blue-950"
  },
  {
    id: "personal-trainer",
    name: "Personal Coaching",
    category: "Individual Trainer",
    tagline: "Profile-Focused • Violet Accent • Direct CTA",
    accent: "#8B5CF6",
    theme: "dark",
    description: "Coach-centric layout highlighting transformation stories and 1-on-1 booking.",
    previewBg: "from-zinc-900 to-purple-950"
  },
  {
    id: "womens-fitness",
    name: "Women's Fitness",
    category: "Wellness & Lifestyle",
    tagline: "Rose & Coral • Lifestyle • Warm",
    accent: "#EC4899",
    theme: "light",
    description: "Warm, welcoming lifestyle template crafted for female-focused wellness spaces.",
    previewBg: "from-rose-50 to-pink-100"
  }
];

// ─── Brand Color Palettes ──────────────────────────────────────────────────────
export const COLOR_PALETTES = [
  { name: "Emerald SaaS", primary: "#16A34A", secondary: "#111827", bg: "#090D14", text: "#F8FAFC" },
  { name: "Midnight Gold", primary: "#EAB308", secondary: "#1C1917", bg: "#0C0A09", text: "#FAFAF9" },
  { name: "Cobalt Tech", primary: "#2563EB", secondary: "#0F172A", bg: "#020617", text: "#F8FAFC" },
  { name: "Crimson Power", primary: "#DC2626", secondary: "#18181B", bg: "#09090B", text: "#FAFAFA" },
  { name: "Pure Light", primary: "#0EA5E9", secondary: "#F1F5F9", bg: "#FFFFFF", text: "#0F172A" },
  { name: "Rose Wellness", primary: "#EC4899", secondary: "#FFF1F2", bg: "#FFFFFF", text: "#18181B" }
];

// ─── Default Page Sections Definition ──────────────────────────────────────────
export interface PageSection {
  id: string;
  type: string;
  title: string;
  enabled: boolean;
  layout: string; // e.g. "layout-1" | "layout-2" | "layout-3" | "layout-4"
  bgType: "color" | "image" | "video";
  bgImage?: string;
  overlayOpacity: number; // 0 to 100
  content: Record<string, any>;
}

const DEFAULT_SECTIONS: PageSection[] = [
  {
    id: "hero",
    type: "hero",
    title: "Hero Banner",
    enabled: true,
    layout: "layout-1",
    bgType: "image",
    bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400",
    overlayOpacity: 65,
    content: {
      headline: "Transform Your Body. Elevate Your Performance.",
      subheadline: "State-of-the-art strength equipment, certified personal coaches, and flexible monthly plans.",
      primaryBtnText: "Book Free Trial",
      primaryBtnUrl: "#contact",
      secondaryBtnText: "Explore Plans",
      secondaryBtnUrl: "#plans",
      imagePosition: "center"
    }
  },
  {
    id: "about",
    type: "about",
    title: "About Facility",
    enabled: true,
    layout: "layout-2",
    bgType: "color",
    bgImage: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200",
    overlayOpacity: 40,
    content: {
      title: "Why Fitness Enthusiasts Choose Us",
      description: "We provide over 10,000 sq. ft. of air-conditioned training floor featuring international Eleiko power racks, Hammer Strength machines, biometric access, and dedicated personal coaching zones.",
      bullet1: "Certified ACE & K11 Fitness Coaches",
      bullet2: "Biometric & QR Code Fast Check-In",
      bullet3: "Fully Sanitized & Climate Controlled"
    }
  },
  {
    id: "plans",
    type: "memberships",
    title: "Membership Plans",
    enabled: true,
    layout: "layout-1",
    bgType: "color",
    overlayOpacity: 0,
    content: {
      title: "Flexible Membership Packages",
      subtitle: "Transparent pricing with zero hidden admission fees."
    }
  },
  {
    id: "trainers",
    type: "trainers",
    title: "Trainers & Coaches",
    enabled: true,
    layout: "layout-1",
    bgType: "color",
    overlayOpacity: 0,
    content: {
      title: "Meet Our Elite Fitness Coaches",
      subtitle: "Dedicated experts committed to guiding your transformation journey."
    }
  },
  {
    id: "testimonials",
    type: "testimonials",
    title: "Member Transformations",
    enabled: true,
    layout: "layout-1",
    bgType: "color",
    overlayOpacity: 0,
    content: {
      title: "What Our Members Say",
      quote1: "Joining Apex Fitness was the best decision I made this year. I lost 12kg in 4 months with Coach Vikram!",
      author1: "Arjun Nair · Member since 2024",
      quote2: "The equipment quality is world-class and the atmosphere is super motivating every single morning.",
      author2: "Priya Sharma · Member since 2023"
    }
  },
  {
    id: "contact",
    type: "contact",
    title: "Location & Hours",
    enabled: true,
    layout: "layout-1",
    bgType: "color",
    overlayOpacity: 0,
    content: {
      title: "Visit Our Fitness Center",
      address: "Main Street Fitness Hub, Coimbatore, Tamil Nadu",
      phone: "+91 98765 43210",
      email: "contact@fitzone.in",
      hours: "Mon - Sat: 6:00 AM - 10:00 PM | Sun: 7:00 AM - 1:00 PM"
    }
  }
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

  // Sections List & Customization
  const [sections, setSections] = useState<PageSection[]>(DEFAULT_SECTIONS);

  // Modals State
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<{ sectionId?: string; fieldName: string } | null>(null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  // Selected Template inside switcher modal
  const [pendingTemplateId, setPendingTemplateId] = useState<string>("modern-fitness");

  // Right Inspector Tab: Content | Layout | Style | Design | SEO | Settings
  const [inspectorTab, setInspectorTab] = useState<"content" | "layout" | "style" | "design" | "seo" | "settings">("content");

  // Active focused section ID
  const [activeSectionId, setActiveSectionId] = useState<string>("hero");
  const activeSectionObj = sections.find((s) => s.id === activeSectionId) || sections[0];

  // Active Navigation Page
  const [activePage, setActivePage] = useState<string>("home");

  // Slug Customization State
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [slugInput, setSlugInput] = useState("");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [slugMessage, setSlugMessage] = useState("");
  const [savingSlug, setSavingSlug] = useState(false);

  // Live Repsi DB data for auto-synced preview
  const [plans, setPlans] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);

  // Sample Media Library Items
  const [mediaLibrary, setMediaLibrary] = useState<Array<{ id: string; url: string; title: string; category: string }>>([
    { id: "m1", url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400", title: "Gym Floor Strength", category: "Gym" },
    { id: "m2", url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200", title: "Eleiko Power Racks", category: "Gym" },
    { id: "m3", url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200", title: "Personal Training Session", category: "Trainers" },
    { id: "m4", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200", title: "Cardio & Treadmills Floor", category: "Gym" },
    { id: "m5", url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200", title: "HIIT Workout Zone", category: "Gallery" }
  ]);

  // Load website & live Repsi entities
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
          setPendingTemplateId(siteData.template_id || "modern-fitness");
          if (siteData.sections_config) {
            try {
              setSections(JSON.parse(siteData.sections_config));
            } catch {
              // fallback to default sections
            }
          }
        } else {
          // Default site initial state
          const defaultSite = {
            subdomain: workspace,
            title: "Apex Fitness Studio",
            tagline: "Transform your body. Elevate your life.",
            primary_color: "#16A34A",
            secondary_color: "#111827",
            template_id: "modern-fitness",
            theme_mode: "dark",
            logo_url: "",
            favicon_url: "",
            font_family: "Outfit",
            button_style: "rounded-xl",
            card_style: "border",
            is_published: true,
            phone: "+91 98765 43210",
            email: "contact@fitzone.in",
            address: "Main Street Fitness Hub, Coimbatore, Tamil Nadu",
            seo_title: "Apex Fitness | Best Gym & Training Center in Coimbatore",
            seo_description: "Join Apex Fitness for certified personal trainers, premium strength gear, and affordable monthly plans.",
            assistant_enabled: true,
            assistant_name: "Gym Assistant",
            assistant_welcome: "Hi! I'm your gym assistant. How can I help you today?",
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
      const payload = {
        ...site,
        sections_config: JSON.stringify(sections)
      };
      const updated = await repsiApi.updateMyWebsite(payload);
      setSite(updated);
      alert("Website changes saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to save website changes");
    } finally {
      setSaving(false);
    }
  };

  // Save slug update
  const handleSaveSlug = async () => {
    if (slugStatus !== "available" || !slugInput.trim()) return;
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

  // Apply Template with Content Preservation
  const handleApplyTemplate = (tmplId: string) => {
    const chosen = TEMPLATE_OPTIONS.find((t) => t.id === tmplId);
    if (!chosen) return;

    setSite({
      ...site,
      template_id: chosen.id,
      primary_color: chosen.accent,
      theme_mode: chosen.theme
    });
    setShowTemplateModal(false);
  };

  // Section Manipulation Handlers
  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const nextSections = [...sections];
    const [moved] = nextSections.splice(index, 1);
    nextSections.splice(targetIdx, 0, moved);
    setSections(nextSections);
  };

  const handleToggleSectionVisibility = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleDeleteSection = (id: string) => {
    if (sections.length <= 1) {
      alert("You must keep at least one section on your page.");
      return;
    }
    setSections(sections.filter((s) => s.id !== id));
    if (activeSectionId === id) {
      setActiveSectionId(sections[0].id);
    }
  };

  const handleAddSection = (type: string, title: string) => {
    const newId = `${type}_${Date.now()}`;
    const newSection: PageSection = {
      id: newId,
      type,
      title,
      enabled: true,
      layout: "layout-1",
      bgType: "color",
      overlayOpacity: 20,
      content: {
        title: `${title} Section`,
        description: "Add custom content and information for your members here."
      }
    };
    setSections([...sections, newSection]);
    setActiveSectionId(newId);
    setShowAddSectionModal(false);
  };

  const handleUpdateSectionContent = (field: string, value: any) => {
    setSections(
      sections.map((s) =>
        s.id === activeSectionId
          ? {
              ...s,
              content: { ...s.content, [field]: value }
            }
          : s
      )
    );
  };

  const openMediaPicker = (sectionId?: string, fieldName = "bgImage") => {
    setMediaTargetField({ sectionId, fieldName });
    setShowMediaModal(true);
  };

  const handleSelectMediaImage = (url: string) => {
    if (!mediaTargetField) return;
    if (mediaTargetField.fieldName === "logo_url") {
      setSite({ ...site, logo_url: url });
    } else if (mediaTargetField.fieldName === "favicon_url") {
      setSite({ ...site, favicon_url: url });
    } else if (mediaTargetField.sectionId) {
      setSections(
        sections.map((s) =>
          s.id === mediaTargetField.sectionId
            ? { ...s, [mediaTargetField.fieldName]: url }
            : s
        )
      );
    }
    setShowMediaModal(false);
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fakeUrl = URL.createObjectURL(file);
    if (fieldName === "logo_url") {
      setSite({ ...site, logo_url: fakeUrl });
    } else if (fieldName === "favicon_url") {
      setSite({ ...site, favicon_url: fakeUrl });
    }
    // Add to Media Library
    setMediaLibrary([
      { id: `custom_${Date.now()}`, url: fakeUrl, title: file.name, category: "Logos" },
      ...mediaLibrary
    ]);
  };

  const publicWebsiteUrl = `https://repsi.app/${site?.subdomain || workspace}`;

  const currentTemplate = TEMPLATE_OPTIONS.find((t) => t.id === site?.template_id) || TEMPLATE_OPTIONS[0];

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-zinc-400 gap-3">
        <RefreshCw className="h-5 w-5 animate-spin text-emerald-500" />
        <span className="text-sm font-medium">Loading Repsi Website Builder...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#090D14] text-white -m-4 sm:-m-6 overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────────────────────
          TOP HEADER CONTROLS (Publish, Save, Viewports, Slug)
      ───────────────────────────────────────────────────────────────────────────── */}
      <header className="flex h-14 items-center justify-between px-4 border-b border-zinc-800 bg-[#0D121F] shrink-0 z-30">
        {/* Left: Website Slug & Live Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
                  {site?.title || "My Gym Website"}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                repsi.app/{site?.subdomain || workspace}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewport === "desktop" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Desktop View (1200px)"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewport === "tablet" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewport === "mobile" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Right: Actions (Change Template, Save & Publish) */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplateModal(true)}
            className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white rounded-xl text-xs gap-1.5"
          >
            <Palette className="h-3.5 w-3.5 text-purple-400" />
            <span>Templates</span>
          </Button>

          <a
            href={publicWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 text-xs text-zinc-300 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Live</span>
          </a>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs gap-1.5 shadow-md"
          >
            {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>Save & Publish</span>
          </Button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────────────
          MAIN 3-COLUMN BUILDER WORKSPACE (Left Pages/Sections, Center Preview, Right Inspector)
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT PANEL: PAGES & SECTIONS MANAGER ──────────────────────────────── */}
        <aside className="w-64 border-r border-zinc-800 bg-[#0C1017] flex flex-col shrink-0">
          {/* Top Pages List */}
          <div className="p-3 border-b border-zinc-800/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 px-1">
              Pages
            </div>
            <div className="space-y-0.5">
              {[
                { id: "home", name: "Home Page" },
                { id: "about", name: "About Us" },
                { id: "memberships", name: "Memberships" },
                { id: "trainers", name: "Trainers" },
                { id: "contact", name: "Contact & Location" }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePage(p.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activePage === p.id
                      ? "bg-zinc-800 text-white border border-zinc-700"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <span>{p.name}</span>
                  {activePage === p.id && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sections Manager Header */}
          <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Page Sections ({sections.length})
            </div>
            <button
              onClick={() => setShowAddSectionModal(true)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>

          {/* Draggable/Reorderable Sections List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sections.map((sec, idx) => {
              const isActive = activeSectionId === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                    isActive
                      ? "bg-zinc-800 text-white border-zinc-700 shadow-sm"
                      : "bg-zinc-900/50 text-zinc-400 border-zinc-800/50 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Layers className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">{sec.title}</span>
                  </div>

                  {/* Section Tools: Move Up/Down, Visibility, Delete */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSection(idx, "up");
                      }}
                      disabled={idx === 0}
                      className="p-1 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <MoveUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSection(idx, "down");
                      }}
                      disabled={idx === sections.length - 1}
                      className="p-1 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <MoveDown className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSectionVisibility(sec.id);
                      }}
                      className="p-1 hover:text-white"
                      title={sec.enabled ? "Hide Section" : "Show Section"}
                    >
                      {sec.enabled ? <Eye className="h-3 w-3 text-emerald-400" /> : <EyeOff className="h-3 w-3 text-zinc-600" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Brand Kit Target */}
          <div className="p-3 border-t border-zinc-800 bg-[#090D14]">
            <button
              onClick={() => setInspectorTab("design")}
              className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-400" />
                <span>Brand Kit & Styling</span>
              </span>
              <ChevronLeft className="h-4 w-4 rotate-180 text-zinc-500" />
            </button>
          </div>
        </aside>

        {/* ── CENTER CANVAS: LIVE INTERACTIVE WEBSITE PREVIEW ──────────────────── */}
        <main className="flex-1 bg-[#05070B] overflow-y-auto p-4 flex flex-col items-center relative">
          {/* Canvas Viewport Frame */}
          <div
            className={`transition-all duration-300 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden my-auto ${
              site?.theme_mode === "light" ? "bg-white text-slate-900" : "bg-[#0B0F19] text-white"
            } ${
              viewport === "desktop"
                ? "w-full max-w-5xl min-h-[720px]"
                : viewport === "tablet"
                ? "w-[768px] min-h-[600px]"
                : "w-[375px] min-h-[640px]"
            }`}
          >
            {/* Live Website Header/Navbar */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {site?.logo_url ? (
                  <img src={site.logo_url} alt="Gym Logo" className="h-8 object-contain" />
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center font-black text-white"
                      style={{ backgroundColor: site?.primary_color || "#16A34A" }}
                    >
                      <Dumbbell className="h-4 w-4" />
                    </div>
                    <span className="font-extrabold text-base tracking-tight">{site?.title || "Apex Fitness"}</span>
                  </div>
                )}
              </div>

              <nav className="hidden sm:flex items-center gap-6 text-xs font-semibold opacity-80">
                <a href="#about" className="hover:opacity-100">About</a>
                <a href="#plans" className="hover:opacity-100">Plans</a>
                <a href="#trainers" className="hover:opacity-100">Trainers</a>
                <a href="#contact" className="hover:opacity-100">Contact</a>
              </nav>

              <button
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
                style={{ backgroundColor: site?.primary_color || "#16A34A" }}
              >
                Join Gym
              </button>
            </header>

            {/* Render Enabled Page Sections */}
            <div className="divide-y divide-white/5">
              {sections.filter((s) => s.enabled).map((sec) => {
                const isActiveSec = activeSectionId === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`relative group transition-all ${
                      isActiveSec ? "ring-2 ring-emerald-500/80 ring-offset-2 ring-offset-black" : ""
                    }`}
                  >
                    {/* Hover Overlay Controls */}
                    <div className="absolute inset-0 bg-emerald-500/5 border-2 border-emerald-500/40 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 flex items-start justify-end p-3">
                      <div className="pointer-events-auto flex items-center gap-1.5 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-xs font-bold text-white shadow-xl">
                        <span>Section: {sec.title}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSectionId(sec.id);
                            setInspectorTab("content");
                          }}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-[10px]"
                        >
                          Edit Content
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSection(sec.id);
                          }}
                          className="p-1 text-zinc-400 hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* SECTION: HERO */}
                    {sec.type === "hero" && (
                      <div className="relative py-20 px-6 sm:px-12 overflow-hidden flex flex-col items-center text-center">
                        {sec.bgImage && (
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${sec.bgImage})` }}
                          >
                            <div
                              className="absolute inset-0 bg-black"
                              style={{ opacity: (sec.overlayOpacity || 65) / 100 }}
                            />
                          </div>
                        )}
                        <div className="relative z-10 max-w-3xl space-y-4">
                          <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase text-white shadow-sm"
                            style={{ backgroundColor: site?.primary_color || "#16A34A" }}
                          >
                            Welcome to {site?.title || "Apex Fitness"}
                          </span>
                          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                            {sec.content?.headline || "Transform Your Body. Elevate Your Performance."}
                          </h1>
                          <p className="text-sm sm:text-base opacity-80 max-w-2xl mx-auto leading-relaxed">
                            {sec.content?.subheadline || "State-of-the-art strength equipment, certified personal coaches, and flexible monthly plans."}
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                            <button
                              className="px-6 py-3 rounded-xl font-bold text-white text-xs sm:text-sm shadow-lg transition-transform hover:scale-105"
                              style={{ backgroundColor: site?.primary_color || "#16A34A" }}
                            >
                              {sec.content?.primaryBtnText || "Book Free Trial"}
                            </button>
                            <button className="px-6 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm backdrop-blur-sm border border-white/20">
                              {sec.content?.secondaryBtnText || "Explore Plans"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION: ABOUT */}
                    {sec.type === "about" && (
                      <div className="py-16 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {sec.content?.title || "Why Fitness Enthusiasts Choose Us"}
                          </h2>
                          <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                            {sec.content?.description || "We provide over 10,000 sq. ft. of air-conditioned training floor featuring international equipment and certified coaching."}
                          </p>
                          <div className="space-y-2 pt-2 text-xs font-medium">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                              <span>{sec.content?.bullet1 || "Certified ACE & K11 Fitness Coaches"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                              <span>{sec.content?.bullet2 || "Biometric & QR Code Fast Check-In"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                              <span>{sec.content?.bullet3 || "Fully Sanitized & Climate Controlled"}</span>
                            </div>
                          </div>
                        </div>
                        {sec.bgImage && (
                          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl h-64 sm:h-80 relative">
                            <img src={sec.bgImage} alt="Facility" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION: MEMBERSHIPS (Live Synced from Repsi DB) */}
                    {sec.type === "memberships" && (
                      <div className="py-16 px-6 sm:px-12 text-center space-y-8">
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {sec.content?.title || "Membership Plans"}
                          </h2>
                          <p className="text-xs sm:text-sm opacity-70 mt-1">
                            {sec.content?.subtitle || "Live synced from your Repsi gym database."}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          {plans.map((p, pIdx) => (
                            <div
                              key={p.id || pIdx}
                              className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-left flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all"
                            >
                              <div>
                                <h3 className="text-base font-bold">{p.name}</h3>
                                <div className="text-2xl font-black mt-2">
                                  ₹{p.price}{" "}
                                  <span className="text-xs font-normal opacity-60">
                                    / {p.duration_months} mo
                                  </span>
                                </div>
                                <p className="text-xs opacity-70 mt-2 leading-relaxed">
                                  {p.description || "Full gym access with personal trainer support."}
                                </p>
                              </div>
                              <button
                                className="w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-md"
                                style={{ backgroundColor: site?.primary_color || "#16A34A" }}
                              >
                                Select Plan
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SECTION: TRAINERS (Live Synced from Repsi DB) */}
                    {sec.type === "trainers" && (
                      <div className="py-16 px-6 sm:px-12 text-center space-y-8">
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {sec.content?.title || "Our Expert Coaches"}
                          </h2>
                          <p className="text-xs sm:text-sm opacity-70 mt-1">
                            {sec.content?.subtitle || "Dedicated coaches to guide your workouts."}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                          {trainers.map((tr, trIdx) => (
                            <div
                              key={tr.id || trIdx}
                              className="p-6 rounded-2xl border border-white/10 bg-white/5 text-left flex items-start gap-4"
                            >
                              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-lg shrink-0">
                                {tr.full_name ? tr.full_name[0] : "T"}
                              </div>
                              <div>
                                <h3 className="text-base font-bold">{tr.full_name || tr.name}</h3>
                                <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                                  {tr.specialty || tr.specialization || "Fitness Coach"}
                                </span>
                                <p className="text-xs opacity-70 mt-1.5 leading-relaxed">
                                  {tr.bio || "Certified fitness instructor specializing in body transformations."}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SECTION: TESTIMONIALS */}
                    {sec.type === "testimonials" && (
                      <div className="py-16 px-6 sm:px-12 text-center space-y-8">
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                          {sec.content?.title || "What Our Members Say"}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                            <Quote className="h-6 w-6 text-emerald-400 opacity-60" />
                            <p className="text-xs sm:text-sm opacity-90 italic">
                              "{sec.content?.quote1}"
                            </p>
                            <span className="text-xs font-bold text-emerald-400 block">
                              — {sec.content?.author1}
                            </span>
                          </div>
                          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                            <Quote className="h-6 w-6 text-emerald-400 opacity-60" />
                            <p className="text-xs sm:text-sm opacity-90 italic">
                              "{sec.content?.quote2}"
                            </p>
                            <span className="text-xs font-bold text-emerald-400 block">
                              — {sec.content?.author2}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION: CONTACT */}
                    {sec.type === "contact" && (
                      <div className="py-16 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {sec.content?.title || "Visit Our Fitness Center"}
                          </h2>
                          <div className="space-y-3 text-xs opacity-90 pt-2">
                            <div className="flex items-center gap-3">
                              <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                              <span>{sec.content?.address || site?.address}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                              <span>{sec.content?.phone || site?.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                              <span>{sec.content?.email || site?.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                              <span>{sec.content?.hours || site?.opening_hours}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4 text-xs">
                          <h3 className="font-bold text-sm">Send an Inquiry</h3>
                          <Input placeholder="Your Name" className="bg-black/40 border-white/10 text-xs" readOnly />
                          <Input placeholder="Phone Number" className="bg-black/40 border-white/10 text-xs" readOnly />
                          <button
                            className="w-full py-2.5 rounded-xl font-bold text-white text-xs shadow-md"
                            style={{ backgroundColor: site?.primary_color || "#16A34A" }}
                          >
                            Submit Inquiry
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Live Website Footer */}
            <footer className="px-6 py-8 border-t border-white/10 text-xs opacity-60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                © {new Date().getFullYear()} {site?.title || "Apex Fitness"}. All rights reserved.
              </div>
              <div className="flex items-center gap-2">
                <span>Powered by</span>
                <span className="font-bold text-white">REPSI</span>
              </div>
            </footer>
          </div>
        </main>

        {/* ── RIGHT INSPECTOR PANEL: CONTENT | LAYOUT | STYLE | DESIGN | SEO | SETTINGS ──── */}
        <aside className="w-80 border-l border-zinc-800 bg-[#0C1017] flex flex-col shrink-0">
          {/* Inspector Tabs Bar */}
          <div className="flex items-center border-b border-zinc-800 bg-zinc-900/60 p-1 text-[11px] font-semibold">
            {[
              { id: "content", label: "Content" },
              { id: "layout", label: "Layout" },
              { id: "style", label: "Style" },
              { id: "design", label: "Design" },
              { id: "seo", label: "SEO" },
              { id: "settings", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setInspectorTab(tab.id as any)}
                className={`flex-1 py-1.5 text-center rounded-lg transition-colors ${
                  inspectorTab === tab.id
                    ? "bg-zinc-800 text-white font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Inspector Panel Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* ── TAB: CONTENT ──────────────────────────────────────────────────── */}
            {inspectorTab === "content" && (
              <div className="space-y-5 text-xs">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <span className="font-bold text-white">Editing: {activeSectionObj.title}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">ID: {activeSectionObj.id}</span>
                </div>

                {/* Section Specific Content Form Controls */}
                {activeSectionObj.type === "hero" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Headline</label>
                      <textarea
                        rows={2}
                        value={activeSectionObj.content?.headline || ""}
                        onChange={(e) => handleUpdateSectionContent("headline", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Subheadline</label>
                      <textarea
                        rows={3}
                        value={activeSectionObj.content?.subheadline || ""}
                        onChange={(e) => handleUpdateSectionContent("subheadline", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-zinc-400 font-semibold mb-1">Primary Button</label>
                        <Input
                          value={activeSectionObj.content?.primaryBtnText || ""}
                          onChange={(e) => handleUpdateSectionContent("primaryBtnText", e.target.value)}
                          className="bg-zinc-900 border-zinc-800 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-semibold mb-1">Secondary Button</label>
                        <Input
                          value={activeSectionObj.content?.secondaryBtnText || ""}
                          onChange={(e) => handleUpdateSectionContent("secondaryBtnText", e.target.value)}
                          className="bg-zinc-900 border-zinc-800 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSectionObj.type === "about" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Section Title</label>
                      <Input
                        value={activeSectionObj.content?.title || ""}
                        onChange={(e) => handleUpdateSectionContent("title", e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Facility Description</label>
                      <textarea
                        rows={4}
                        value={activeSectionObj.content?.description || ""}
                        onChange={(e) => handleUpdateSectionContent("description", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {(activeSectionObj.type === "memberships" || activeSectionObj.type === "trainers") && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Section Header Title</label>
                      <Input
                        value={activeSectionObj.content?.title || ""}
                        onChange={(e) => handleUpdateSectionContent("title", e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Subtitle</label>
                      <Input
                        value={activeSectionObj.content?.subtitle || ""}
                        onChange={(e) => handleUpdateSectionContent("subtitle", e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-xs text-white"
                      />
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" /> Live Repsi DB Synced
                      </p>
                      <p className="text-[11px] opacity-80 leading-relaxed">
                        Cards for this section automatically reflect your live membership plans and trainer profiles.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: LAYOUT ───────────────────────────────────────────────────── */}
            {inspectorTab === "layout" && (
              <div className="space-y-5 text-xs">
                <h3 className="font-bold text-white">Section Layout Variations</h3>
                <p className="text-[11px] text-zinc-400">
                  Select a layout structure for <strong>{activeSectionObj.title}</strong>.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "layout-1", name: "Centered Text", desc: "Text center + background image" },
                    { id: "layout-2", name: "Split Layout", desc: "Text left + image right" },
                    { id: "layout-3", name: "Minimalist", desc: "Clean text + dual CTA buttons" },
                    { id: "layout-4", name: "Fullscreen Video", desc: "Dark banner + high impact" }
                  ].map((lay) => (
                    <button
                      key={lay.id}
                      onClick={() =>
                        setSections(
                          sections.map((s) => (s.id === activeSectionId ? { ...s, layout: lay.id } : s))
                        )
                      }
                      className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                        activeSectionObj.layout === lay.id
                          ? "bg-purple-600/20 border-purple-500 ring-1 ring-purple-500 text-white"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="font-bold text-xs">{lay.name}</div>
                      <div className="text-[10px] opacity-70">{lay.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB: STYLE & MEDIA ─────────────────────────────────────────────── */}
            {inspectorTab === "style" && (
              <div className="space-y-5 text-xs">
                <h3 className="font-bold text-white">Section Background & Images</h3>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-2">Background Image</label>
                  {activeSectionObj.bgImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-800 h-32 group">
                      <img src={activeSectionObj.bgImage} alt="Section BG" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                        <button
                          onClick={() => openMediaPicker(activeSectionId, "bgImage")}
                          className="px-3 py-1.5 bg-purple-600 rounded-lg text-white font-bold text-[11px]"
                        >
                          Replace Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => openMediaPicker(activeSectionId, "bgImage")}
                      className="w-full h-24 rounded-xl border-2 border-dashed border-zinc-800 hover:border-zinc-700 flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-300 gap-1.5"
                    >
                      <ImageIcon className="h-5 w-5" />
                      <span>Choose Background Image</span>
                    </button>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-400 font-semibold">Overlay Opacity</label>
                    <span className="font-mono text-zinc-300">{activeSectionObj.overlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeSectionObj.overlayOpacity}
                    onChange={(e) =>
                      setSections(
                        sections.map((s) =>
                          s.id === activeSectionId ? { ...s, overlayOpacity: Number(e.target.value) } : s
                        )
                      )
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* ── TAB: GLOBAL DESIGN & BRAND KIT ─────────────────────────────────── */}
            {inspectorTab === "design" && (
              <div className="space-y-6 text-xs">
                {/* Gym Logo & Brand Kit */}
                <div>
                  <h3 className="font-bold text-white mb-2">Gym Logo & Brand Kit</h3>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    {site?.logo_url ? (
                      <div className="flex items-center justify-between">
                        <img src={site.logo_url} alt="Logo" className="h-8 object-contain max-w-[120px]" />
                        <button
                          onClick={() => setSite({ ...site, logo_url: "" })}
                          className="text-xs text-rose-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-zinc-800 rounded-xl p-4 text-center space-y-2">
                        <Upload className="h-6 w-6 text-zinc-500 mx-auto" />
                        <p className="text-[11px] text-zinc-400">Drag & drop gym logo (PNG / SVG / JPG)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCustomFileUpload(e, "logo_url")}
                          className="text-[10px] text-zinc-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-zinc-300"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Theme Mode */}
                <div>
                  <h3 className="font-bold text-white mb-2">Theme Mode</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "light", label: "Light", icon: Sun },
                    ].map((mode) => {
                      const IconComp = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setSite({ ...site, theme_mode: mode.id })}
                          className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                            site?.theme_mode === mode.id
                              ? "bg-emerald-600/20 border-emerald-500 text-white"
                              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <IconComp className="h-4 w-4" />
                          <span>{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Palettes */}
                <div>
                  <h3 className="font-bold text-white mb-2">Brand Color Palettes</h3>
                  <div className="space-y-2">
                    {COLOR_PALETTES.map((pal) => (
                      <button
                        key={pal.name}
                        onClick={() =>
                          setSite({
                            ...site,
                            primary_color: pal.primary,
                            secondary_color: pal.secondary,
                            bg_color: pal.bg,
                            text_color: pal.text,
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex items-center justify-between transition-colors"
                      >
                        <span className="font-semibold text-zinc-200">{pal.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: pal.primary }} />
                          <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: pal.secondary }} />
                          <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: pal.bg }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: SEO ──────────────────────────────────────────────────────── */}
            {inspectorTab === "seo" && (
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-white">Search Engine Optimization</h3>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">SEO Title Tag</label>
                  <Input
                    value={site?.seo_title || ""}
                    onChange={(e) => setSite({ ...site, seo_title: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Meta Description</label>
                  <textarea
                    rows={4}
                    value={site?.seo_description || ""}
                    onChange={(e) => setSite({ ...site, seo_description: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* ── TAB: SETTINGS ─────────────────────────────────────────────────── */}
            {inspectorTab === "settings" && (
              <div className="space-y-5 text-xs">
                <h3 className="font-bold text-white">Website Domain & Address</h3>

                {/* Slug Address Customizer */}
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <label className="block text-zinc-400 font-semibold">Public Gym Slug Address</label>

                  {isEditingSlug ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 bg-black border border-zinc-800 rounded-xl px-3 py-2">
                        <span className="text-zinc-500 font-mono">repsi.app/</span>
                        <input
                          type="text"
                          value={slugInput}
                          onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                          className="bg-transparent font-mono text-white text-xs focus:outline-none flex-1"
                          autoFocus
                        />
                      </div>

                      {slugMessage && (
                        <p className={`text-[11px] font-medium ${slugStatus === "available" ? "text-emerald-400" : "text-rose-400"}`}>
                          {slugMessage}
                        </p>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          onClick={handleSaveSlug}
                          disabled={slugStatus !== "available" || savingSlug}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                        >
                          Save Address
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsEditingSlug(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-emerald-400">repsi.app/{site?.subdomain || workspace}</span>
                      <button
                        onClick={() => setIsEditingSlug(true)}
                        className="text-xs text-purple-400 hover:underline font-bold"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          MODAL: CHANGE TEMPLATE (With Visual Previews & Content Preservation Warning)
      ───────────────────────────────────────────────────────────────────────────── */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#0E131C] border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Choose a Template</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select a visual structure for your website. <strong className="text-emerald-400">Your content, plans, and photos will remain unchanged.</strong>
                </p>
              </div>
              <button onClick={() => setShowTemplateModal(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Template Visual Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TEMPLATE_OPTIONS.map((tmpl) => {
                const isSelected = pendingTemplateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setPendingTemplateId(tmpl.id)}
                    className={`rounded-2xl border p-4 space-y-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-zinc-800/90 border-purple-500 ring-2 ring-purple-500/80 shadow-xl"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    {/* Visual Card Banner */}
                    <div className={`h-28 rounded-xl bg-gradient-to-br ${tmpl.previewBg} p-3 flex flex-col justify-between border border-white/10 relative overflow-hidden`}>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white w-fit">
                        {tmpl.category}
                      </span>
                      <div className="font-black text-sm text-white truncate">{tmpl.name}</div>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-white">{tmpl.name}</h3>
                      <p className="text-[11px] text-purple-400 font-medium">{tmpl.tagline}</p>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{tmpl.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
              <div className="text-xs text-zinc-400 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-emerald-400" />
                <span>Your site content, plans, trainers, and contact info will be preserved automatically.</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleApplyTemplate(pendingTemplateId)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Apply Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          MODAL: MEDIA LIBRARY (Image Upload & Selection)
      ───────────────────────────────────────────────────────────────────────────── */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#0E131C] border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">Media Library</h2>
              </div>
              <button onClick={() => setShowMediaModal(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-1">
              {mediaLibrary.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectMediaImage(item.url)}
                  className="group relative rounded-xl overflow-hidden border border-zinc-800 hover:border-emerald-500 cursor-pointer h-32"
                >
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-lg">
                      Select Image
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleSelectMediaImage(URL.createObjectURL(file));
                  }
                }}
                className="text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-zinc-800 file:text-white"
              />
              <Button variant="outline" size="sm" onClick={() => setShowMediaModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          MODAL: ADD SECTION
      ───────────────────────────────────────────────────────────────────────────── */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0E131C] border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white">Add Section to Page</h2>
              <button onClick={() => setShowAddSectionModal(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
              {[
                { type: "hero", title: "Hero Banner", desc: "Large headline & CTA" },
                { type: "about", title: "About Facility", desc: "Gym overview & highlights" },
                { type: "memberships", title: "Membership Plans", desc: "Live synced packages" },
                { type: "trainers", title: "Trainers & Coaches", desc: "Instructor profiles" },
                { type: "testimonials", title: "Testimonials", desc: "Member transformation quotes" },
                { type: "contact", title: "Location & Hours", desc: "Map, phone & hours" }
              ].map((s) => (
                <button
                  key={s.type}
                  onClick={() => handleAddSection(s.type, s.title)}
                  className="p-3 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-emerald-500 text-left space-y-1 transition-all"
                >
                  <div className="font-bold text-xs text-white">{s.title}</div>
                  <div className="text-[10px] text-zinc-400">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
