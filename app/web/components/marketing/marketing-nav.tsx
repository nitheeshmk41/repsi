"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";

export function MarketingNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      title: "Product",
      links: [
        { label: "Platform Overview", href: "/#dashboard-showcase" },
        { label: "Members", href: "/features" },
        { label: "Trainers", href: "/features" },
        { label: "Attendance", href: "/features" },
        { label: "Payments", href: "/features" },
        { label: "Analytics", href: "/features" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Gyms", href: "/solutions/gyms" },
        { label: "Fitness Studios", href: "/solutions/studios" },
        { label: "Yoga", href: "/solutions/yoga" },
        { label: "Swimming Pools", href: "/solutions/pools" },
        { label: "Trainers", href: "/solutions/personal-trainers" },
      ],
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Help Center", href: "/help" },
        { label: "Blog", href: "/blog" },
        { label: "Changelog", href: "/changelog" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
      ],
    },
  ];

  // Colors & styling: Home top is transparent dark hero overlay, on scroll or on inner pages dark/light theme
  const headerClass = isHome
    ? isScrolled
      ? "fixed top-0 z-50 w-full bg-[#050B07]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30 transition-all duration-300"
      : "fixed top-0 z-50 w-full bg-transparent border-b border-transparent transition-all duration-300"
    : "relative z-50 w-full bg-white border-b border-[#E5EAE6] text-[#111714]";

  const logoSrc = isHome
    ? "/new logos/dark_logo_trans.png"
    : "/logos/primary_logo.png";

  const linkTextClass = isHome
    ? "text-[#F5F7F5]/80 hover:text-white"
    : "text-[#111714] hover:text-[#16A34A]";

  const dropdownBg = isHome
    ? "bg-[#0B120E]/95 backdrop-blur-xl border-white/10 shadow-2xl"
    : "bg-white/98 backdrop-blur-xl border-[#E5EAE6] shadow-xl";

  const dropdownItemText = isHome
    ? "text-[#9CA3AF] hover:text-[#22C55E] hover:bg-white/5"
    : "text-[#111714] hover:text-[#16A34A] hover:bg-[#F1F5F2]";

  return (
    <header className={headerClass}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 flex h-[68px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src={logoSrc}
            alt="REPSI"
            width={200}
            height={60}
            className="h-9 sm:h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {navItems.map((item) =>
            item.href ? (
              <Link
                key={item.title}
                href={item.href}
                className={`text-sm font-medium transition-colors py-2 ${linkTextClass}`}
              >
                {item.title}
              </Link>
            ) : (
              <div key={item.title} className="relative group">
                <button className={`flex items-center gap-1 text-sm font-medium transition-colors py-2 cursor-pointer ${linkTextClass}`}>
                  <span>{item.title}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all duration-200" />
                </button>

                {/* Dropdown */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
                  <div className={`rounded-xl border p-2 min-w-[210px] ${dropdownBg}`}>
                    {item.links?.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={`block px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${dropdownItemText}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </nav>

        {/* Auth & CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/login"
            className={`text-sm font-medium py-2 transition-colors ${linkTextClass}`}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-1.5 h-9 px-4.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold transition-all shadow-md shadow-[#16A34A]/20 active:scale-[0.98]"
          >
            <span>Start with Repsi</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            isHome ? "text-white hover:bg-white/10" : "text-[#111714] hover:bg-[#F1F5F2]"
          }`}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className={`md:hidden border-b px-6 pt-3 pb-6 space-y-6 shadow-2xl h-[calc(100vh-4.5rem)] overflow-y-auto ${
            isHome
              ? "bg-[#050B07]/98 border-white/10 text-white"
              : "bg-white/98 border-[#E5EAE6] text-[#111714]"
          }`}
        >
          <div className="space-y-6">
            {navItems.map((item) => (
              <div key={item.title} className="space-y-3">
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-base font-bold"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <>
                    <h4 className="text-xs font-bold uppercase tracking-wider opacity-50">
                      {item.title}
                    </h4>
                    <div className="flex flex-col gap-2">
                      {item.links?.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block py-1 text-sm font-medium ${
                            isHome ? "text-[#9CA3AF] hover:text-[#22C55E]" : "text-[#66706A] hover:text-[#16A34A]"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold border rounded-lg"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold bg-[#16A34A] text-white rounded-lg hover:bg-[#15803D]"
            >
              Start with Repsi →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
