"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  Calendar,
  Banknote,
  Receipt,
  BarChart3,
  TrendingUp,
  Settings,
  HelpCircle,
  Bell,
  Activity,
  ChevronLeft,
  ChevronRight,
  Building2,
  ChevronDown,
  Wrench,
  QrCode,
  Navigation,
  MessageSquare,
  RefreshCw,
  BookOpen,
  Target,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getWorkspaceFromPath, slugToGymName } from "@/lib/workspace";
import { getAuthUser, AuthUser } from "@/lib/auth";
import { useEffect } from "react";

// ─── Navigation Structure ─────────────────────────────────────────────────────

interface NavItemDef {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroupDef {
  title: string;
  items: NavItemDef[];
}

const ownerNavGroups: NavGroupDef[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "GROWTH & MARKETING",
    items: [
      { label: "CRM & Leads", path: "/crm", icon: Target },
      { label: "Website Builder", path: "/website", icon: Globe },
    ],
  },
  {
    title: "GYM MANAGEMENT",
    items: [
      { label: "Members", path: "/members", icon: Users },
      { label: "Memberships", path: "/memberships", icon: CreditCard },
      { label: "Attendance", path: "/attendance", icon: CalendarCheck },
      { label: "Trainers", path: "/trainers", icon: Dumbbell },
      { label: "Classes", path: "/classes", icon: Calendar },
      { label: "Workouts", path: "/workouts", icon: Dumbbell },
      { label: "Equipment", path: "/machines", icon: Wrench },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      { label: "Reports", path: "/reports", icon: BarChart3 },
      { label: "Notifications", path: "/notifications", icon: Bell },
      { label: "Activity", path: "/activity", icon: Activity },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "Gym Settings", path: "/settings", icon: Settings },
      { label: "Subscription & Billing", path: "/settings/billing", icon: CreditCard },
      { label: "Team & Roles", path: "/settings/team", icon: Users },
    ],
  },
];

const trainerNavGroups: NavGroupDef[] = [
  {
    title: "TRAINER PORTAL",
    items: [
      { label: "Dashboard", path: "/trainer/dashboard", icon: LayoutDashboard },
      { label: "Clients", path: "/trainer/clients", icon: Users },
      { label: "Workouts", path: "/trainer/workouts", icon: Dumbbell },
      { label: "Schedule", path: "/trainer/schedule", icon: Calendar },
      { label: "Classes", path: "/trainer/classes", icon: CalendarCheck },
      { label: "Messages", path: "/chat", icon: MessageSquare },
      { label: "Profile", path: "/trainer/profile", icon: Settings },
    ],
  },
];

const memberNavGroups: NavGroupDef[] = [
  {
    title: "FITNESS",
    items: [
      { label: "Dashboard", path: "/member/dashboard", icon: LayoutDashboard },
      { label: "Workout", path: "/member/workout", icon: Dumbbell },
      { label: "Exercise Library", path: "/member/exercises", icon: BookOpen },
      { label: "Progress", path: "/member/dashboard#progress", icon: TrendingUp },
      { label: "Activity / Running", path: "/member/running", icon: Navigation },
      { label: "Trainer", path: "/member/trainer", icon: Users },
      { label: "Trainer Chat", path: "/chat", icon: MessageSquare },
      { label: "Digital QR Pass", path: "/member/qr", icon: QrCode },
    ],
  },
  {
    title: "MEMBERSHIP",
    items: [
      { label: "My Membership", path: "/member/membership", icon: CreditCard },
      { label: "My Attendance", path: "/member/attendance", icon: CalendarCheck },
      { label: "My Payments", path: "/member/payments", icon: Banknote },
    ],
  },
];

const superAdminNavGroups: NavGroupDef[] = [
  {
    title: "Super Admin",
    items: [
      { label: "Platform Overview", path: "/superadmin/dashboard", icon: LayoutDashboard },
      { label: "Gym Management", path: "/superadmin/gyms", icon: Building2 },
      { label: "User Management", path: "/superadmin/users", icon: Users },
      { label: "Subscriptions", path: "/superadmin/subscriptions", icon: CreditCard },
      { label: "Audit Logs", path: "/superadmin/audit-logs", icon: Activity },
    ],
  },
];

// ─── REPSI Logo ───────────────────────────────────────────────────────────────

function RepsiLogo({ collapsed, workspace }: { collapsed: boolean; workspace: string }) {
  return (
    <Link 
      href={`/${workspace}/dashboard`} 
      className="flex items-center gap-2.5 px-3 h-14 border-b border-[var(--border)] transition-opacity hover:opacity-90"
    >
      {collapsed ? (
        /* Collapsed: app icon only */
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          <Image
            src="/logos/logo_trans.png"
            alt="REPSI"
            width={32}
            height={32}
            className="object-contain rounded-lg"
          />
        </div>
      ) : (
        /* Expanded: horizontal logo */
        <div className="flex items-center h-10 w-full">
          <Image
            src="/logos/primary_logo.png"
            alt="REPSI"
            width={150}
            height={48}
            className="h-9 w-auto object-contain object-left dark:hidden"
            priority
          />
          <Image
            src="/logos/white_logo.png"
            alt="REPSI"
            width={150}
            height={48}
            className="h-9 w-auto object-contain object-left hidden dark:block"
            priority
          />
        </div>
      )}
    </Link>
  );
}

// ─── Gym Selector ─────────────────────────────────────────────────────────────

function GymSelector({ collapsed, workspace }: { collapsed: boolean; workspace: string }) {
  const gymName = slugToGymName(workspace);

  if (collapsed) {
    return (
      <div className="mx-3 my-2">
        <button className="w-full flex items-center justify-center h-8 rounded-[8px] hover:bg-[var(--nav-hover-bg)] transition-colors">
          <Building2 className="h-4 w-4 text-[var(--text-muted)]" />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-3 my-2">
      <div className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
        <div className="w-6 h-6 rounded-[6px] bg-[var(--primary-soft)] flex items-center justify-center flex-shrink-0">
          <Building2 className="h-3.5 w-3.5 text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-[var(--text)] truncate leading-tight">
            {gymName}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] truncate leading-tight">
            repsi.app/{workspace}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

function NavLink({
  item,
  collapsed,
  isActive,
  href,
}: {
  item: NavItemDef;
  collapsed: boolean;
  isActive: boolean;
  href: string;
}) {
  const Icon = item.icon;

  const linkContent = (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--nav-hover-bg)] hover:text-[var(--text)]",
        collapsed && "justify-center px-0"
      )}
    >
      {/* Active indicator bar */}
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[var(--nav-active-indicator)]" />
      )}
      <Icon
        className={cn(
          "flex-shrink-0 h-4 w-4",
          isActive
            ? "text-[var(--nav-active-text)]"
            : "text-[var(--text-muted)]"
        )}
      />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const workspace = getWorkspaceFromPath(pathname);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const role = user?.role || "OWNER";
  let activeNavGroups = ownerNavGroups;
  if (role === "SUPER_ADMIN") {
    activeNavGroups = superAdminNavGroups;
  } else if (role === "TRAINER") {
    activeNavGroups = trainerNavGroups;
  } else if (role === "USER" || role === "STAFF") {
    activeNavGroups = memberNavGroups;
  }

  const secondaryNav: NavItemDef[] = role === "SUPER_ADMIN"
    ? [
        { label: "Settings", path: "/superadmin/settings", icon: Settings },
      ]
    : role === "TRAINER"
    ? [
        { label: "Notifications", path: "/notifications", icon: Bell },
        { label: "My Profile", path: "/trainer/profile", icon: Settings },
      ]
    : role === "USER" || role === "STAFF"
    ? [
        { label: "Notifications", path: "/notifications", icon: Bell },
        { label: "My Profile", path: "/member/profile", icon: Settings },
      ]
    : role === "OWNER"
    ? []
    : [
        { label: "Notifications", path: "/notifications", icon: Bell },
        { label: "Activity", path: "/activity", icon: Activity },
        { label: "Settings", path: "/settings", icon: Settings },
      ];

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "relative flex flex-col border-r border-[var(--border)] bg-[var(--sidebar)] transition-all duration-200 ease-in-out",
          collapsed ? "w-[72px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <RepsiLogo collapsed={collapsed} workspace={workspace} />

        {/* Gym Selector */}
        <GymSelector collapsed={collapsed} workspace={workspace} />

        {/* Separator */}
        <div className="mx-3 my-1 h-px bg-[var(--border)]" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
          {activeNavGroups.map((group) => (
            <div key={group.title} className="mb-4">
              {!collapsed && (
                <div className="px-3 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    {group.title}
                  </span>
                </div>
              )}
              {group.items.map((item) => {
                const href = item.path.startsWith("/superadmin") ? item.path : `/${workspace}${item.path}`;
                const isActive =
                  item.path === "/dashboard"
                    ? pathname === href || pathname === `/${workspace}`
                    : pathname.startsWith(href);

                return (
                  <NavLink
                    key={item.path}
                    item={item}
                    collapsed={collapsed}
                    isActive={isActive}
                    href={href}
                  />
                );
              })}
            </div>
          ))}
        </nav>

        {/* Secondary Navigation */}
        {secondaryNav.length > 0 && (
          <>
            <div className="mx-3 my-1 h-px bg-[var(--border)]" />
            <div className="py-2 px-3 space-y-0.5">
              {secondaryNav.map((item) => {
                const href = item.path.startsWith("/superadmin") ? item.path : `/${workspace}${item.path}`;
                const isActive = pathname.startsWith(href);
                return (
                  <NavLink
                    key={item.path}
                    item={item}
                    collapsed={collapsed}
                    isActive={isActive}
                    href={href}
                  />
                );
              })}
            </div>
          </>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute -right-3 top-[72px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] shadow-[var(--shadow-sm)] hover:bg-[var(--nav-hover-bg)] hover:text-[var(--text)] transition-colors"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </aside>
    </TooltipProvider>
  );
}
