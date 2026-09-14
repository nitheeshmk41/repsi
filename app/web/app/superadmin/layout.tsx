"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Users,
  Settings,
  LayoutDashboard,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { clearSession } from "@/lib/auth";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleLogout = () => {
    clearSession();
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Overview", href: "/superadmin/dashboard", icon: LayoutDashboard },
    { name: "Workspaces", href: "/superadmin/workspaces", icon: Building2 },
    { name: "Users & Roles", href: "/superadmin/users", icon: Users },
    { name: "Platform Settings", href: "/superadmin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[var(--border)] gap-2">
          <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <span className="font-bold text-[var(--text)] tracking-tight">Super Admin</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] md:hidden flex items-center px-4">
          <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
          <span className="font-bold text-[var(--text)]">Super Admin</span>
        </header>

        <div className="flex-1 overflow-auto bg-[var(--background)]">
          {children}
        </div>
      </main>
    </div>
  );
}
