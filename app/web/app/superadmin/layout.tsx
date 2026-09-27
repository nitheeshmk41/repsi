"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Tag,
  DollarSign,
  HelpCircle,
  MessageSquare,
  Radio,
  Activity,
  ShieldCheck,
  Lock,
  FileText,
  Key,
  BookOpen,
  FileCode,
  Sparkles,
  Terminal,
  Webhook,
  ToggleLeft,
  Database,
  Settings,
  AlertTriangle,
  Flame,
  LogOut,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  User,
} from "lucide-react";
import { logoutSession } from "@/lib/auth";

interface NavGroup {
  label: string;
  items: { name: string; href: string; icon: any }[];
}

const navGroups: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [{ name: "Overview", href: "/superadmin/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "PLATFORM",
    items: [
      { name: "Gyms & Workspaces", href: "/superadmin/gyms", icon: Building2 },
      { name: "Users & Owners", href: "/superadmin/users", icon: Users },
      { name: "Subscriptions", href: "/superadmin/subscriptions", icon: CreditCard },
      { name: "Coupons & Discounts", href: "/superadmin/subscriptions?tab=coupons", icon: Tag },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { name: "Support Center", href: "/superadmin/dashboard?tab=support", icon: HelpCircle },
      { name: "Communications", href: "/superadmin/dashboard?tab=comms", icon: MessageSquare },
      { name: "Announcements", href: "/superadmin/dashboard?tab=announcements", icon: Radio },
      { name: "System Health", href: "/superadmin/dashboard?tab=health", icon: Activity },
    ],
  },
  {
    label: "SECURITY",
    items: [
      { name: "Security Center", href: "/superadmin/audit-logs?tab=security", icon: ShieldCheck },
      { name: "Audit Logs", href: "/superadmin/audit-logs", icon: FileText },
    ],
  },
  {
    label: "DEVELOPER & SYSTEM",
    items: [
      { name: "Feature Flags", href: "/superadmin/dashboard?tab=flags", icon: ToggleLeft },
      { name: "Danger Zone", href: "/superadmin/dashboard?tab=danger", icon: Flame },
    ],
  },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    OVERVIEW: true,
    PLATFORM: true,
    OPERATIONS: true,
    SECURITY: true,
    "DEVELOPER & SYSTEM": true,
  });

  const toggleGroup = (groupLabel: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupLabel]: !prev[groupLabel] }));
  };

  const handleLogout = () => {
    logoutSession();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-[#0B0F17] text-zinc-100 font-sans antialiased overflow-hidden">
      {/* ── Sidebar (Desktop) ────────────────────────────────────────────── */}
      <aside className="w-64 border-r border-zinc-800/80 bg-zinc-900/90 hidden md:flex flex-col shrink-0 select-none">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shadow-inner">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-xs tracking-tight text-white block">REPSI Control Center</span>
              <span className="text-[10px] text-purple-400 font-bold tracking-wider uppercase">Super Admin</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            PROD
          </span>
        </div>

        {/* Grouped Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4 text-xs scrollbar-thin scrollbar-thumb-zinc-800">
          {navGroups.map((group) => {
            const isOpen = openGroups[group.label];
            return (
              <div key={group.label} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold text-zinc-500 hover:text-zinc-300 tracking-wider uppercase transition-colors"
                >
                  <span>{group.label}</span>
                  {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                {isOpen && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || (item.href !== "/superadmin/dashboard" && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                            isActive
                              ? "bg-purple-600 text-white font-semibold shadow-md shadow-purple-900/30 border border-purple-500/30"
                              : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100"
                          }`}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-purple-950 text-purple-300 flex items-center justify-center font-bold text-xs border border-purple-800/50">
              N
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-xs text-white truncate">Nitheesh</p>
              <p className="text-[10px] text-zinc-400 truncate">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Sign out of Super Admin"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* ── Main Area ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>

        {/* ── Mobile Bottom Navigation Bar ──────────────────────────────── */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-zinc-900 border-t border-zinc-800 flex items-center justify-around z-40 px-2 text-[10px] font-semibold text-zinc-400">
          <Link
            href="/superadmin/dashboard"
            className={`flex flex-col items-center gap-1 ${pathname === "/superadmin/dashboard" ? "text-purple-400" : ""}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </Link>
          <Link
            href="/superadmin/gyms"
            className={`flex flex-col items-center gap-1 ${pathname.startsWith("/superadmin/gyms") ? "text-purple-400" : ""}`}
          >
            <Building2 className="w-4 h-4" />
            <span>Gyms</span>
          </Link>
          <Link
            href="/superadmin/users"
            className={`flex flex-col items-center gap-1 ${pathname.startsWith("/superadmin/users") ? "text-purple-400" : ""}`}
          >
            <Users className="w-4 h-4" />
            <span>Users</span>
          </Link>
          <Link
            href="/superadmin/subscriptions"
            className={`flex flex-col items-center gap-1 ${pathname.startsWith("/superadmin/subscriptions") ? "text-purple-400" : ""}`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Billing</span>
          </Link>
          <Link
            href="/superadmin/audit-logs"
            className={`flex flex-col items-center gap-1 ${pathname.startsWith("/superadmin/audit-logs") ? "text-purple-400" : ""}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
