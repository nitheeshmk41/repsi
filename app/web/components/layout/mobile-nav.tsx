"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  Banknote,
  BarChart3,
  Settings,
  X,
  Building2,
  Dumbbell,
  Calendar,
  Receipt,
  TrendingUp,
  Bell,
  Activity,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getWorkspaceFromPath, slugToGymName } from "@/lib/workspace";

interface NavItemDef {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroupDef {
  title: string;
  items: NavItemDef[];
}

const navGroups: NavGroupDef[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Management",
    items: [
      { label: "Members", path: "/members", icon: Users },
      { label: "Memberships", path: "/memberships", icon: CreditCard },
      { label: "Attendance", path: "/attendance", icon: CalendarCheck },
      { label: "Trainers", path: "/trainers", icon: Dumbbell },
      { label: "Classes", path: "/classes", icon: Calendar },
      { label: "Workouts", path: "/workouts", icon: Dumbbell },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Payments", path: "/payments", icon: Banknote },
      { label: "Expenses", path: "/expenses", icon: Receipt },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Reports", path: "/reports", icon: BarChart3 },
      { label: "Analytics", path: "/analytics", icon: TrendingUp },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Notifications", path: "/notifications", icon: Bell },
      { label: "Activity", path: "/activity", icon: Activity },
      { label: "Settings", path: "/settings", icon: Settings },
    ],
  },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const workspace = getWorkspaceFromPath(pathname);
  const gymName = slugToGymName(workspace);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-[var(--sidebar)] border-r border-[var(--border)] flex flex-col transition-transform duration-200 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border)]">
          <Link href={`/${workspace}/dashboard`} className="flex items-center gap-2.5">
            <Image
              src="/logos/repsi_logo_black.png"
              alt="REPSI"
              width={34}
              height={34}
              className="rounded-md object-contain"
            />
            <span className="font-bold text-[var(--text)] tracking-tight">REPSI</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-[var(--text-muted)] hover:bg-[var(--nav-hover-bg)] hover:text-[var(--text)] transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Gym info */}
        <div className="mx-4 my-3 p-2.5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-[6px] bg-[var(--primary-soft)] flex items-center justify-center flex-shrink-0">
            <Building2 className="h-3.5 w-3.5 text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-[var(--text)] truncate">
              {gymName}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] truncate">
              repsi.app/{workspace}
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {group.title}
                </span>
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const href = `/${workspace}${item.path}`;
                const isActive =
                  item.path === "/dashboard"
                    ? pathname === href || pathname === `/${workspace}`
                    : pathname.startsWith(href);

                return (
                  <Link
                    key={item.path}
                    href={href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--nav-hover-bg)] hover:text-[var(--text)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isActive ? "text-[var(--nav-active-text)]" : "text-[var(--text-muted)]"
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] bg-[var(--background)]">
            <div className="w-7 h-7 rounded-full bg-[var(--primary-soft)] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-[var(--primary-dark)] dark:text-[var(--primary-hover)]">NK</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--text)] truncate">Gym Owner</p>
              <p className="text-[10px] text-[var(--text-muted)] truncate">Owner</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-[8px] text-[var(--text-muted)] hover:bg-[var(--nav-hover-bg)] hover:text-[var(--text)] transition-colors"
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
