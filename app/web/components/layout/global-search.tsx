"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Search,
  User,
  Users,
  CalendarCheck,
  CreditCard,
  BarChart3,
  Receipt,
  Target,
  Globe,
  Settings,
  Dumbbell,
  MessageSquare,
  CheckSquare,
  Clock,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { repsiApi } from "@/lib/api";

const RECENT_SEARCHES_KEY = "repsi_recent_searches_v2";

interface SearchMember {
  id: string;
  name: string;
  code: string;
  status: string;
  email: string;
  phone: string;
  plan: string;
  subtitle: string;
  meta?: string;
  href: string;
}

interface SearchTrainer {
  id: string;
  name: string;
  code: string;
  specialization: string;
  phone: string;
  subtitle: string;
  meta?: string;
  href: string;
}

interface SearchFeature {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
  keywords?: string[];
}

const STATIC_QUICK_FEATURES: SearchFeature[] = [
  {
    id: "members",
    title: "Members",
    description: "Manage member profiles and memberships",
    category: "Directory",
    href: "/members",
    keywords: ["members", "member", "user", "users", "clients", "directory", "people"],
  },
  {
    id: "trainers",
    title: "Trainers",
    description: "Fitness coaches, schedules, and payouts",
    category: "Directory",
    href: "/trainers",
    keywords: ["trainers", "trainer", "coaches", "staff"],
  },
  {
    id: "attendance",
    title: "Attendance",
    description: "Check-in records and daily attendance",
    category: "Operations",
    href: "/attendance",
    keywords: ["attendance", "check-in", "checkin", "logs"],
  },
  {
    id: "payments",
    title: "Payments",
    description: "Membership payments and receipts",
    category: "Finance",
    href: "/payments",
    keywords: ["payments", "payment", "billing", "invoices", "revenue"],
  },
  {
    id: "memberships",
    title: "Memberships",
    description: "Subscription plans and pricing packages",
    category: "Plans",
    href: "/memberships",
    keywords: ["memberships", "membership", "plans", "pricing"],
  },
  {
    id: "reports",
    title: "Reports",
    description: "Analytics, revenue & retention metrics",
    category: "Analytics",
    href: "/reports",
    keywords: ["reports", "report", "analytics", "insights"],
  },
  {
    id: "expenses",
    title: "Expenses",
    description: "Track operational expenses and equipment",
    category: "Finance",
    href: "/expenses",
    keywords: ["expenses", "expense", "costs", "spending"],
  },
  {
    id: "crm",
    title: "Leads & CRM",
    description: "Sales pipeline and prospect conversion",
    category: "Growth",
    href: "/crm",
    keywords: ["leads", "lead", "crm", "sales", "prospects"],
  },
  {
    id: "website",
    title: "Website Builder",
    description: "Customize public gym landing page",
    category: "Growth",
    href: "/website",
    keywords: ["website", "site", "builder", "landing"],
  },
  {
    id: "settings",
    title: "Settings",
    description: "Workspace config, roles, and profile",
    category: "System",
    href: "/settings",
    keywords: ["settings", "setting", "config", "profile"],
  },
];

const FEATURE_ICONS: Record<string, React.ElementType> = {
  attendance: CalendarCheck,
  members: User,
  trainers: Users,
  payments: CreditCard,
  memberships: Target,
  reports: BarChart3,
  expenses: Receipt,
  crm: Target,
  website: Globe,
  settings: Settings,
  "my-clients": User,
  workouts: Dumbbell,
  progress: BarChart3,
  schedule: CalendarCheck,
  messages: MessageSquare,
  tasks: CheckSquare,
};

function getFeatureIcon(id: string) {
  return FEATURE_ICONS[id] || Target;
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query || !query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-slate-200 dark:bg-slate-800 text-[var(--text)] font-semibold px-0.5 rounded-xs"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

interface RecentSearchItem {
  term: string;
  type: "member" | "trainer" | "feature";
  subtitle: string;
  href: string;
}

export function GlobalSearch() {
  const router = useRouter();
  const params = useParams();
  const workspace = (params?.workspace as string) || "apex-fitness";

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [members, setMembers] = useState<SearchMember[]>([]);
  const [trainers, setTrainers] = useState<SearchTrainer[]>([]);
  const [features, setFeatures] = useState<SearchFeature[]>([]);
  const [recentItems, setRecentItems] = useState<RecentSearchItem[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent search history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentItems(JSON.parse(stored).slice(0, 4));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const saveRecentItem = (item: RecentSearchItem) => {
    if (!item.term) return;
    try {
      const updated = [
        item,
        ...recentItems.filter((r) => r.term.toLowerCase() !== item.term.toLowerCase()),
      ].slice(0, 4);
      setRecentItems(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeRecentItem = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentItems.filter((r) => r.term !== term);
    setRecentItems(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Keyboard shortcut (⌘K / Ctrl+K)
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  // Execute global search API with client-side feature fallback
  useEffect(() => {
    if (!open) return;
    setLoading(true);

    const timer = setTimeout(async () => {
      const qLower = query.trim().toLowerCase();

      // Client-side feature filter
      const clientMatchedFeatures = qLower
        ? STATIC_QUICK_FEATURES.filter(
            (f) =>
              f.title.toLowerCase().includes(qLower) ||
              f.description.toLowerCase().includes(qLower) ||
              (f.keywords && f.keywords.some((kw) => kw.includes(qLower) || qLower.includes(kw)))
          )
        : STATIC_QUICK_FEATURES;

      try {
        const res = await repsiApi.globalSearch(query);
        setMembers(res.members || []);
        setTrainers(res.trainers || []);

        // Combine backend features with client matched features for 100% feature coverage
        const apiFeats = res.features || [];
        const mergedFeats = [...apiFeats];
        clientMatchedFeatures.forEach((cf) => {
          if (!mergedFeats.some((af) => af.id === cf.id)) {
            mergedFeats.push(cf);
          }
        });
        setFeatures(mergedFeats);
      } catch (err) {
        console.error("Global search API error:", err);
        setFeatures(clientMatchedFeatures);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, open]);

  // Reset keyboard selection index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [members, trainers, features, query]);

  // Flattened items for keyboard arrow navigation
  const allItems: Array<{
    type: "member" | "trainer" | "feature" | "recent" | "quick";
    data: any;
    href?: string;
  }> = [];

  if (!query) {
    recentItems.forEach((r) => {
      allItems.push({ type: "recent", data: r, href: r.href });
    });
    STATIC_QUICK_FEATURES.forEach((f) => {
      allItems.push({ type: "quick", data: f, href: `/${workspace}${f.href}` });
    });
  } else {
    members.forEach((m) => {
      allItems.push({
        type: "member",
        data: m,
        href: `/${workspace}${m.href.startsWith("/") ? m.href : "/" + m.href}`,
      });
    });
    trainers.forEach((t) => {
      allItems.push({
        type: "trainer",
        data: t,
        href: `/${workspace}${t.href.startsWith("/") ? t.href : "/" + t.href}`,
      });
    });
    features.forEach((f) => {
      allItems.push({
        type: "feature",
        data: f,
        href: `/${workspace}${f.href.startsWith("/") ? f.href : "/" + f.href}`,
      });
    });
  }

  const navigateTo = (href: string, itemToSave?: RecentSearchItem) => {
    if (itemToSave) {
      saveRecentItem(itemToSave);
    }
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (allItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = allItems[selectedIndex];
      if (current && current.href) {
        let saveItem: RecentSearchItem | undefined;
        if (current.type === "member") {
          saveItem = {
            term: current.data.name,
            type: "member",
            subtitle: `Member · ${current.data.code}`,
            href: current.href,
          };
        } else if (current.type === "trainer") {
          saveItem = {
            term: current.data.name,
            type: "trainer",
            subtitle: `Trainer · ${current.data.code}`,
            href: current.href,
          };
        } else if (current.type === "feature" || current.type === "quick") {
          saveItem = {
            term: current.data.title,
            type: "feature",
            subtitle: `Feature · ${current.data.description}`,
            href: current.href,
          };
        }
        navigateTo(current.href, saveItem);
      }
    }
  };

  return (
    <>
      {/* Topbar Search Button Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2.5 h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)] transition-all duration-150 w-full max-w-xs cursor-pointer shadow-2xs"
        )}
        aria-label="Open global search modal"
      >
        <Search className="h-4 w-4 text-[var(--text-muted)] flex-shrink-0" />
        <span className="flex-1 text-left text-xs font-medium truncate">
          Search members, trainers, features...
        </span>
        <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono font-medium text-[var(--text-muted)] bg-[var(--background)] border border-[var(--border)] rounded px-1.5 py-0.5">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Global Search Dialog Modal (700px width, Soft overlay) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="p-0 gap-0 w-full max-w-3xl overflow-hidden bg-[var(--surface)] border-[var(--border)] shadow-2xl rounded-xl"
          onKeyDown={handleModalKeyDown}
        >
          {/* Header Input Area (52px height, Custom focus treatment) */}
          <div className="p-3 border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="relative flex items-center h-12 w-full px-3.5 rounded-lg border border-[var(--border)] bg-[var(--background)] focus-within:border-[var(--border-strong)] focus-within:ring-1 focus-within:ring-[var(--border-strong)] transition-all">
              <Search className="h-4 w-4 text-[var(--text-muted)] flex-shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search members, trainers, features..."
                className="w-full bg-transparent text-sm font-medium text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none"
                autoFocus
              />
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-[var(--text-muted)] flex-shrink-0 ml-2" />
              ) : query ? (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] rounded transition-colors ml-2 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded ml-2">
                  Esc
                </kbd>
              )}
            </div>
          </div>

          {/* Modal Body Container */}
          <div className="max-h-[460px] overflow-y-auto p-3 space-y-4">
            {/* EMPTY QUERY STATE */}
            {!query && (
              <div className="space-y-4">
                {/* Recent Searches */}
                {recentItems.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-2">
                      Recent
                    </div>
                    <div className="space-y-1">
                      {recentItems.map((r, idx) => {
                        const isSelected = selectedIndex === idx;
                        return (
                          <div
                            key={r.term}
                            onClick={() => navigateTo(r.href)}
                            className={cn(
                              "group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors border border-transparent",
                              isSelected
                                ? "bg-[#10B981]/10 border-[#10B981]/30 text-[var(--text)] font-medium"
                                : "hover:bg-[var(--nav-hover-bg)]"
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Clock className="h-4 w-4 text-[var(--text-muted)] flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-[var(--text)] truncate">
                                  {r.term}
                                </div>
                                <div className="text-[11px] text-[var(--text-muted)] truncate">
                                  {r.subtitle}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={(e) => removeRecentItem(e, r.term)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-rose-500 rounded transition-opacity"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quick Access (2-column grid of destinations) */}
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-2">
                    Quick Access
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {STATIC_QUICK_FEATURES.map((f, idx) => {
                      const globalIdx = recentItems.length + idx;
                      const isSelected = selectedIndex === globalIdx;
                      const IconComp = getFeatureIcon(f.id);
                      return (
                        <div
                          key={f.id}
                          onClick={() => navigateTo(`/${workspace}${f.href}`)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] cursor-pointer transition-all",
                            isSelected
                              ? "bg-[var(--nav-hover-bg)] border-[var(--border-strong)]"
                              : "hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
                          )}
                        >
                          <div className="h-9 w-9 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] flex-shrink-0">
                            <IconComp className="h-4 w-4 text-[var(--text-secondary)]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-[var(--text)] truncate">
                              {f.title}
                            </div>
                            <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                              {f.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SEARCH RESULTS STATE */}
            {query && (
              <div className="space-y-4">
                {/* MEMBERS GROUP */}
                {members.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-2 mb-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Members
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {members.length} {members.length === 1 ? "result" : "results"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {members.map((m) => {
                        const globalIdx = allItems.findIndex(
                          (item) => item.data?.id === m.id && item.type === "member"
                        );
                        const isSelected = selectedIndex === globalIdx;
                        const href = `/${workspace}${m.href.startsWith("/") ? m.href : "/" + m.href}`;
                        return (
                          <div
                            key={m.id}
                            onClick={() =>
                              navigateTo(href, {
                                term: m.name,
                                type: "member",
                                subtitle: `Member · ${m.code}`,
                                href,
                              })
                            }
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl min-h-[64px] border border-transparent cursor-pointer transition-all",
                              isSelected
                                ? "bg-[var(--nav-hover-bg)] border-[var(--border-strong)]"
                                : "hover:bg-[var(--nav-hover-bg)]"
                            )}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="h-10 w-10 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--text)] flex-shrink-0 shadow-2xs">
                                {m.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-[var(--text)] truncate">
                                  <HighlightText text={m.name} query={query} />
                                </div>
                                <div className="text-xs text-[var(--text-muted)] truncate flex items-center gap-2 mt-0.5">
                                  <span className="font-mono font-medium text-[var(--text)]">
                                    <HighlightText text={m.code} query={query} />
                                  </span>
                                  <span>·</span>
                                  <span className="text-[var(--text-secondary)] font-medium">
                                    {m.status} member
                                  </span>
                                </div>
                                {m.meta && (
                                  <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                                    <HighlightText text={m.meta} query={query} />
                                  </div>
                                )}
                              </div>
                            </div>
                            <ArrowRight
                              className={cn(
                                "h-4 w-4 text-[var(--text-muted)] transition-transform ml-3 flex-shrink-0",
                                isSelected && "translate-x-1 text-[var(--text)]"
                              )}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TRAINERS GROUP */}
                {trainers.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-2 mb-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Trainers
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {trainers.length} {trainers.length === 1 ? "result" : "results"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {trainers.map((tr) => {
                        const globalIdx = allItems.findIndex(
                          (item) => item.data?.id === tr.id && item.type === "trainer"
                        );
                        const isSelected = selectedIndex === globalIdx;
                        const href = `/${workspace}${tr.href.startsWith("/") ? tr.href : "/" + tr.href}`;
                        return (
                          <div
                            key={tr.id}
                            onClick={() =>
                              navigateTo(href, {
                                term: tr.name,
                                type: "trainer",
                                subtitle: `Trainer · ${tr.code}`,
                                href,
                              })
                            }
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl min-h-[64px] border border-transparent cursor-pointer transition-all",
                              isSelected
                                ? "bg-[var(--nav-hover-bg)] border-[var(--border-strong)]"
                                : "hover:bg-[var(--nav-hover-bg)]"
                            )}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="h-10 w-10 rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--text)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                                <Users className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-[var(--text)] truncate">
                                  <HighlightText text={tr.name} query={query} />
                                </div>
                                <div className="text-xs text-[var(--text-muted)] truncate flex items-center gap-2 mt-0.5">
                                  <span className="font-mono font-medium text-[var(--text)]">
                                    <HighlightText text={tr.code} query={query} />
                                  </span>
                                  <span>·</span>
                                  <span>{tr.specialization}</span>
                                </div>
                                {tr.meta && (
                                  <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                                    <HighlightText text={tr.meta} query={query} />
                                  </div>
                                )}
                              </div>
                            </div>
                            <ArrowRight
                              className={cn(
                                "h-4 w-4 text-[var(--text-muted)] transition-transform ml-3 flex-shrink-0",
                                isSelected && "translate-x-1 text-emerald-600 dark:text-emerald-400"
                              )}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* FEATURES GROUP */}
                {features.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-2 mb-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Features
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {features.length} {features.length === 1 ? "result" : "results"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {features.map((f) => {
                        const globalIdx = allItems.findIndex(
                          (item) => item.data?.id === f.id && item.type === "feature"
                        );
                        const isSelected = selectedIndex === globalIdx;
                        const href = `/${workspace}${f.href.startsWith("/") ? f.href : "/" + f.href}`;
                        const IconComp = getFeatureIcon(f.id);
                        return (
                          <div
                            key={f.id}
                            onClick={() =>
                              navigateTo(href, {
                                term: f.title,
                                type: "feature",
                                subtitle: `Feature · ${f.description}`,
                                href,
                              })
                            }
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl min-h-[64px] border border-transparent cursor-pointer transition-all",
                              isSelected
                                ? "bg-[var(--nav-hover-bg)] border-[var(--border-strong)]"
                                : "hover:bg-[var(--nav-hover-bg)]"
                            )}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="h-10 w-10 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] flex-shrink-0 shadow-2xs">
                                <IconComp className="h-5 w-5 text-[var(--text-secondary)]" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-[var(--text)] truncate">
                                  <HighlightText text={f.title} query={query} />
                                </div>
                                <div className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                                  <HighlightText text={f.description} query={query} />
                                </div>
                              </div>
                            </div>
                            <span className="text-[11px] font-medium text-[var(--text-muted)] bg-[var(--background)] border border-[var(--border)] px-2.5 py-1 rounded-md ml-3 flex-shrink-0">
                              {f.category}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* EMPTY RESULTS STATE */}
                {!loading &&
                  members.length === 0 &&
                  trainers.length === 0 &&
                  features.length === 0 && (
                    <div className="p-8 text-center">
                      <Search className="h-8 w-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-medium text-[var(--text)]">
                        No matching results for "{query}"
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">
                        Try searching member name, phone number, member code (RP-1024), or feature
                        name like Attendance or Payments.
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Footer Controls (Clean keyboard shortcuts only) */}
          <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--background)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="font-mono bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[10px]">
                  ↑
                </kbd>
                <kbd className="font-mono bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[10px]">
                  ↓
                </kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="font-mono bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[10px]">
                  Enter
                </kbd>
                <span>Open</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="font-mono bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[10px]">
                  Esc
                </kbd>
                <span>Close</span>
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
