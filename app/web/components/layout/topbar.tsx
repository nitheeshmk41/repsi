"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Monitor, Bell, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const icon =
    theme === "dark" ? (
      <Moon className="h-4 w-4" />
    ) : theme === "light" ? (
      <Sun className="h-4 w-4" />
    ) : (
      <Monitor className="h-4 w-4" />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle theme">
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── User Menu ────────────────────────────────────────────────────────────────

function UserMenu() {
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);

  useEffect(() => {
    const authUser = getAuthUser();
    if (authUser) {
      setUser(authUser);
    }
  }, []);

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
          className="flex items-center gap-2 rounded-[8px] p-1 pr-2 hover:bg-[var(--nav-hover-bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
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
        <DropdownMenuItem className="cursor-pointer">Account</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Help</DropdownMenuItem>
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

// ─── Global Search / Command Palette ─────────────────────────────────────────

function GlobalSearch() {
  const [open, setOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)] transition-all duration-150 w-full max-w-xs"
        )}
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-medium text-[var(--text-muted)] bg-[var(--background)] border border-[var(--border)] rounded px-1 py-0.5">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search members, payments, settings..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => setOpen(false)}>
              <Search className="mr-2 h-4 w-4" />
              Dashboard
              <ChevronRight className="ml-auto h-4 w-4 opacity-40" />
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Search className="mr-2 h-4 w-4" />
              Members
              <ChevronRight className="ml-auto h-4 w-4 opacity-40" />
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Search className="mr-2 h-4 w-4" />
              Payments
              <ChevronRight className="ml-auto h-4 w-4 opacity-40" />
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Search className="mr-2 h-4 w-4" />
              Attendance
              <ChevronRight className="ml-auto h-4 w-4 opacity-40" />
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Members">
            <CommandItem onSelect={() => setOpen(false)}>
              Arjun Nair
              <span className="ml-2 text-[var(--text-muted)] text-xs">Active · Monthly</span>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              Priya Venkat
              <span className="ml-2 text-[var(--text-muted)] text-xs">Active · Annual</span>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              Kavya Ramesh
              <span className="ml-2 text-[var(--text-muted)] text-xs">Active · Monthly</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => setOpen(false)}>
              Add new member
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              Record payment
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              Mark attendance
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

interface TopbarProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  mobileMenuButton?: React.ReactNode;
}

export function Topbar({ title, breadcrumbs, mobileMenuButton }: TopbarProps) {
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
        <div className="relative">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          {/* Unread indicator */}
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
        </div>

        {/* Theme */}
        <ThemeToggle />

        {/* Divider */}
        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        {/* User */}
        <UserMenu />
      </div>
    </header>
  );
}
