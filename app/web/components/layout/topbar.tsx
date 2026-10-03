"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Monitor, Bell, Search, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GettingStartedDialog } from "@/components/layout/getting-started-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { logoutSession, getAuthUser } from "@/lib/auth";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-[8px] bg-[var(--border)] animate-pulse" />;
  }

  const isDark = theme === "dark";

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <Moon className="h-4 w-4 text-emerald-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
    </Button>
  );
}

// ─── User Menu ────────────────────────────────────────────────────────────────

function UserMenu({ workspace }: { workspace?: string }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);

  useEffect(() => {
    const authUser = getAuthUser();
    if (authUser) {
      setUser(authUser);
    }
  }, []);

  const currentWorkspace =
    workspace ||
    (typeof window !== "undefined" ? localStorage.getItem("repsi_workspace_slug") : null) ||
    "apex-fitness";

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutSession();
    } catch (err) {
      console.error("Sign out error:", err);
      // Fallback redirect
      window.location.href = "/login";
    }
  };

  const displayName = user?.name || "Nitheesh Kumar";
  const displayEmail = user?.email || "owner@apexfitness.in";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center gap-2 rounded-[8px] p-1 pr-2 hover:bg-[var(--nav-hover-bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] cursor-pointer"
          aria-label="Open user menu"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-[10px] bg-[var(--primary-soft)] text-[var(--primary-dark)] dark:text-[var(--primary-hover)] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-[var(--text)] hidden sm:block">
            {displayName}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal py-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-[var(--text)]">{displayName}</span>
            <span className="text-xs text-[var(--text-muted)] truncate">{displayEmail}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/${currentWorkspace}/settings`} className="w-full">
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/${currentWorkspace}/settings`} className="w-full">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/help" className="w-full">
            Help Center
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          disabled={loggingOut}
          className="text-rose-500 hover:text-rose-600 focus:text-rose-500 focus:bg-rose-500/10 cursor-pointer flex items-center justify-between"
        >
          <span>{loggingOut ? "Signing out..." : "Sign out"}</span>
          <span className="text-xs font-mono opacity-60">⌘Q</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { GlobalSearch } from "@/components/layout/global-search";

// ─── Topbar ───────────────────────────────────────────────────────────────────

interface TopbarProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  mobileMenuButton?: React.ReactNode;
}

export function Topbar({ title, breadcrumbs, mobileMenuButton }: TopbarProps) {
  const params = useParams();
  const workspace = params?.workspace as string | undefined;
  const [unreadCount, setUnreadCount] = useState(0);
  const [showGettingStarted, setShowGettingStarted] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchUnread = async () => {
      try {
        const res = await api.getNotifications(1, 1);
        if (active) setUnreadCount(res.unread_count || 0);
      } catch {
        // silent fallback if offline/unauthenticated
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="flex h-14 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6">
      {/* Mobile menu trigger */}
      {mobileMenuButton}
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-1.5 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
            {breadcrumbs.map((crumb, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)] flex-shrink-0" />
                )}
                <span
                  className={cn(
                    "text-sm truncate",
                    i === breadcrumbs.length - 1
                      ? "font-medium text-[var(--text)]"
                      : "text-[var(--text-muted)]"
                  )}
                >
                  {crumb.label}
                </span>
              </div>
            ))}
          </nav>
        ) : title ? (
          <h1 className="text-sm font-semibold text-[var(--text)]">{title}</h1>
        ) : null}
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-xs hidden md:flex">
        <GlobalSearch />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Getting Started Guide */}
        {workspace && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGettingStarted(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] border-[#16A34A]/30 bg-[#16A34A]/5 hover:bg-[#16A34A]/15 rounded-xl px-2.5 h-8 mr-1 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Getting Started</span>
          </Button>
        )}

        {/* Mobile search */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Link href={workspace ? `/${workspace}/notifications` : "/notifications"}>
          <div className="relative">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            {/* Unread indicator */}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[8px] h-2 px-0.5 rounded-full bg-[var(--primary)] text-[9px] font-bold text-white flex items-center justify-center animate-pulse" />
            )}
          </div>
        </Link>

        {/* Theme */}
        <ThemeToggle />

        {/* Divider */}
        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        {/* User */}
        <UserMenu workspace={workspace} />
      </div>

      {workspace && (
        <GettingStartedDialog
          workspace={workspace}
          isOpen={showGettingStarted}
          onClose={() => setShowGettingStarted(false)}
        />
      )}
    </header>
  );
}
