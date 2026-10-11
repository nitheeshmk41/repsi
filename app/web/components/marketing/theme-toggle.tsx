"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  className?: string;
  isHome?: boolean;
  compact?: boolean;
}

export function ThemeToggle({
  className = "",
  isHome = false,
  compact = false,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`h-9 w-[68px] rounded-full border border-white/10 bg-white/5 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";

  // If compact (e.g. mobile bar), render a sleek single-icon glowing button
  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden group ${
          isDark
            ? "border-emerald-500/30 bg-[#0c1611]/90 text-emerald-400 hover:border-emerald-500/60 shadow-[0_0_16px_rgba(37,217,121,0.18)]"
            : "border-slate-200/80 bg-white text-amber-500 hover:bg-slate-50 shadow-xs"
        } ${className}`}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      >
        <motion.div
          key={isDark ? "dark-icon" : "light-icon"}
          initial={{ rotate: -45, scale: 0.7, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 45, scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Moon className="h-4 w-4 fill-emerald-400/20 text-emerald-400" />
          ) : (
            <Sun className="h-4 w-4 fill-amber-400/20 text-amber-500" />
          )}
        </motion.div>
      </button>
    );
  }

  // Full Dual-Icon Segmented Glass Pill Toggle
  return (
    <div
      role="radiogroup"
      aria-label="Color theme selection"
      className={`relative inline-flex h-9 p-0.5 rounded-full border transition-all duration-300 select-none items-center ${
        isHome
          ? isDark
            ? "border-emerald-500/25 bg-[#08120c]/85 shadow-[0_0_20px_rgba(37,217,121,0.12)] backdrop-blur-md"
            : "border-white/20 bg-black/25 shadow-inner backdrop-blur-md"
          : isDark
          ? "border-[#22332a] bg-[#0c1611]/90 backdrop-blur-md shadow-xs"
          : "border-slate-200 bg-slate-100/80 backdrop-blur-md shadow-inner"
      } ${className}`}
    >
      {/* Sliding background thumb */}
      <motion.div
        className={`absolute top-0.5 bottom-0.5 w-[31px] rounded-full transition-colors ${
          isDark
            ? "bg-gradient-to-r from-emerald-500 to-[#25d979] shadow-[0_0_12px_rgba(37,217,121,0.45)]"
            : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
        }`}
        animate={{
          left: isDark ? "35px" : "2px",
        }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 30,
        }}
      />

      {/* Light Option Button */}
      <button
        type="button"
        role="radio"
        aria-checked={!isDark}
        onClick={() => setTheme("light")}
        className={`relative z-10 flex h-8 w-[31px] items-center justify-center rounded-full transition-colors cursor-pointer ${
          !isDark
            ? "text-amber-500"
            : isHome
            ? "text-zinc-400 hover:text-white"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
        title="Light Mode"
        aria-label="Light Mode"
      >
        <Sun className="h-3.5 w-3.5 transition-transform duration-200" />
      </button>

      {/* Dark Option Button */}
      <button
        type="button"
        role="radio"
        aria-checked={isDark}
        onClick={() => setTheme("dark")}
        className={`relative z-10 flex h-8 w-[31px] items-center justify-center rounded-full transition-colors cursor-pointer ${
          isDark
            ? "text-[#08110d]"
            : isHome
            ? "text-zinc-400 hover:text-white"
            : "text-zinc-400 hover:text-zinc-700"
        }`}
        title="Dark Mode"
        aria-label="Dark Mode"
      >
        <Moon className="h-3.5 w-3.5 transition-transform duration-200" />
      </button>
    </div>
  );
}
