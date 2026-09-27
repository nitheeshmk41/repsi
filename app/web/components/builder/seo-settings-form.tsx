"use client";

import { useState } from "react";
import { Globe, Search, CheckCircle2, Link as LinkIcon, Sparkles } from "lucide-react";

export interface GymSeoFormData {
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  socialImage: string;
  allowSearchEngines: boolean;
  googleBusinessProfileUrl: string;
  enableAutoSchema: boolean;
}

export function GymSeoSettingsForm({
  initialData,
  subdomain = "fitzone",
}: {
  initialData?: Partial<GymSeoFormData>;
  subdomain?: string;
}) {
  const [formData, setFormData] = useState<GymSeoFormData>({
    pageTitle: initialData?.pageTitle || `${subdomain.toUpperCase()} Gym | Best Gym in Coimbatore`,
    metaDescription:
      initialData?.metaDescription ||
      `Join ${subdomain.toUpperCase()} Gym in Coimbatore. Premium cardio, strength training, personal trainers, and affordable memberships.`,
    keywords: initialData?.keywords || "gym in coimbatore, fitness center, personal training",
    socialImage: initialData?.socialImage || "",
    allowSearchEngines: initialData?.allowSearchEngines ?? true,
    googleBusinessProfileUrl: initialData?.googleBusinessProfileUrl || "",
    enableAutoSchema: initialData?.enableAutoSchema ?? true,
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const canonicalUrl = `https://${subdomain}.repsi.app`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            SEO & Google Visibility Settings
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Configure how your gym website appears on Google Search and social media sharing.
          </p>
        </div>
        {saved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved
          </div>
        )}
      </div>

      {/* Page Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Page Title <span className="text-muted-foreground font-normal">(Recommended 50–60 characters)</span>
        </label>
        <input
          type="text"
          value={formData.pageTitle}
          onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
          placeholder="FitZone Gym | Gym in Coimbatore"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
        />
        <p className="text-[11px] text-muted-foreground">
          Current length: {formData.pageTitle.length} characters
        </p>
      </div>

      {/* Meta Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Meta Description <span className="text-muted-foreground font-normal">(Recommended 140–160 characters)</span>
        </label>
        <textarea
          rows={3}
          value={formData.metaDescription}
          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          placeholder="Join FitZone Gym in Coimbatore. Modern equipment, personal trainers..."
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
        />
        <p className="text-[11px] text-muted-foreground">
          Current length: {formData.metaDescription.length} characters
        </p>
      </div>

      {/* Keywords */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Keywords <span className="text-muted-foreground font-normal">(Comma separated)</span>
        </label>
        <input
          type="text"
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          placeholder="gym in coimbatore, fitness center, weight loss"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
        />
      </div>

      {/* Automatic Systems */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1">
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-primary" /> Canonical URL
          </div>
          <p className="text-xs font-mono text-muted-foreground truncate">{canonicalUrl}</p>
          <p className="text-[10px] text-emerald-500 font-medium">✓ Handled Automatically</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-1">
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-primary" /> Sitemap & Robots.txt
          </div>
          <p className="text-xs font-mono text-muted-foreground">{canonicalUrl}/sitemap.xml</p>
          <p className="text-[10px] text-emerald-500 font-medium">✓ Enabled Automatically</p>
        </div>
      </div>

      {/* Google Business Profile */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Google Business Profile URL
        </label>
        <input
          type="url"
          value={formData.googleBusinessProfileUrl}
          onChange={(e) => setFormData({ ...formData, googleBusinessProfileUrl: e.target.value })}
          placeholder="https://maps.google.com/?cid=..."
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
        />
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-2">
        <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background cursor-pointer">
          <span className="text-xs font-medium text-foreground">Allow Google & Search Engines to Index</span>
          <input
            type="checkbox"
            checked={formData.allowSearchEngines}
            onChange={(e) => setFormData({ ...formData, allowSearchEngines: e.target.checked })}
            className="w-4 h-4 rounded-md accent-primary"
          />
        </label>

        <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background cursor-pointer">
          <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Automatic LocalBusiness Structured Data (JSON-LD)
          </span>
          <input
            type="checkbox"
            checked={formData.enableAutoSchema}
            onChange={(e) => setFormData({ ...formData, enableAutoSchema: e.target.checked })}
            className="w-4 h-4 rounded-md accent-primary"
          />
        </label>
      </div>

      {/* Search Snippet Preview */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Google Search Snippet Preview</span>
        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
          {formData.pageTitle}
        </div>
        <div className="text-xs text-emerald-600 dark:text-emerald-400 truncate">
          {canonicalUrl}
        </div>
        <div className="text-xs text-muted-foreground line-clamp-2">
          {formData.metaDescription}
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all shadow-xs"
      >
        Save SEO Settings
      </button>
    </form>
  );
}
