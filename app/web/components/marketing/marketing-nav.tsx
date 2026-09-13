"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

export function MarketingNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Features", href: "/features" },
    { label: "Solutions", href: "/features#solutions" },
    { label: "Pricing", href: "/pricing" },
    { label: "Resources", href: "/#faq" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className={
      isHome
        ? "relative z-50 w-full bg-transparent border-b border-zinc-200/50"
        : "relative z-50 w-full border-b border-zinc-200 bg-white"
    }>
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 flex h-16 items-center justify-between">
        {/* Logo (Black Logo Exclusively) */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logos/repsi_logo_black.png"
            alt="REPSI"
            width={200}
            height={65}
            className="h-10 sm:h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth & CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 py-2 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer (Light Theme & Fully Mobile Responsive) */}
      {mobileOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-6 pt-3 pb-6 space-y-3 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-base font-medium text-zinc-700 hover:text-zinc-900"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-zinc-200 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-sm font-medium text-zinc-800 border border-zinc-300 rounded-full hover:bg-zinc-50"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold bg-[#16A34A] text-white rounded-full hover:bg-[#15803D]"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
