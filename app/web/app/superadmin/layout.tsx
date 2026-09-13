"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  ShieldAlert, 
  Building2, 
  Users, 
  CreditCard, 
  Activity, 
  ExternalLink,
  LayoutDashboard,
  ShieldCheck,
  FileText
} from "lucide-react";
import { AuthGuard } from "@/components/layout/auth-guard";

const navItems = [
  { label: "Dashboard", href: "/superadmin/dashboard", icon: LayoutDashboard },
  { label: "Gyms & Tenants", href: "/superadmin/gyms", icon: Building2 },
  { label: "Users & Roles", href: "/superadmin/users", icon: Users },
  { label: "Subscriptions", href: "/superadmin/subscriptions", icon: CreditCard },
  { label: "Audit Logs", href: "/superadmin/audit-logs", icon: FileText },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-between text-xs text-amber-400">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="font-semibold">SUPER ADMIN CONTROL PLANE</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-400 hidden sm:inline">Global multi-tenant platform scope (God Mode)</span>
        </div>
        <Link
          href="/apex-fitness/dashboard"
          className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
        >
          <span>Switch to Gym Workspace</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Main Bar */}
      <header className="h-16 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/superadmin/dashboard" className="flex items-center gap-2.5">
            <Image
              src="/logos/repsi_logo_black.png"
              alt="REPSI"
              width={160}
              height={50}
              className="h-9 w-auto object-contain"
              priority
            />
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
              PLATFORM OPS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/superadmin/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>DB Clusters Healthy</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-300">
            SA
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
        <AuthGuard>{children}</AuthGuard>
      </main>
    </div>
  );
}
