"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  isHome?: boolean;
}

export function ThemeToggle({ className = "", isHome = false }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 rounded-xl border border-white/10 bg-white/5 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
        isHome
          ? isDark
            ? "border-emerald-500/30 bg-[#0d1a12]/80 text-emerald-400 hover:border-emerald-500/60 hover:bg-[#12241a] hover:text-emerald-300 shadow-sm shadow-emerald-500/10"
            : "border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30"
          : isDark
          ? "border-[#22332a] bg-[#101b16] text-emerald-400 hover:border-emerald-500/40 hover:bg-[#16261f]"
          : "border-[#E5EAE6] bg-white text-[#172033] hover:bg-[#F1F5F2] hover:border-[#16A34A]/30"
      } ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
