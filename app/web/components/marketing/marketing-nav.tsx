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
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "How it Works", href: "/how-it-works" },
        { label: "Integrations", href: "/integrations" },
        { label: "Product Tour", href: "/tour" },
        { label: "What's New", href: "/changelog" },
      ]
    },
    {
      title: "Solutions",
      links: [
        { label: "For Gyms", href: "/solutions/gyms" },
        { label: "For Personal Trainers", href: "/solutions/personal-trainers" },
        { label: "For Fitness Studios", href: "/solutions/studios" },
        { label: "For Gym Owners", href: "/solutions/owners" },
        { label: "Use Cases", href: "/use-cases" },
      ]
    },
    {
      title: "Pricing",
      href: "/pricing" // Direct link, no dropdown
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Guides", href: "/guides" },
        { label: "Help Center", href: "/help" },
        { label: "Documentation", href: "/docs" },
        { label: "FAQs", href: "/#faq" },
        { label: "Downloads", href: "/downloads" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
        { label: "Partners", href: "/partners" },
      ]
    }
  ];

  return (
    <header className={
      isScrolled
        ? "sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-zinc-200/80 shadow-xs transition-all duration-300"
        : isHome
        ? "sticky top-0 z-50 w-full bg-transparent border-b border-zinc-200/40 transition-all duration-300"
        : "sticky top-0 z-50 w-full border-b border-zinc-200 bg-white transition-all duration-300"
    }>
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logos/primary_logo.png"
            alt="REPSI"
            width={200}
            height={65}
            className="h-10 sm:h-12 w-auto object-contain dark:hidden"
            priority
          />
          <Image
            src="/logos/white_logo.png"
            alt="REPSI"
            width={200}
            height={65}
            className="h-10 sm:h-12 w-auto object-contain hidden dark:block"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {navItems.map((item) => (
            item.href ? (
              <Link
                key={item.title}
                href={item.href}
                className="text-sm font-medium text-zinc-600 hover:text-[#16A34A] transition-colors py-2"
              >
                {item.title}
              </Link>
            ) : (
              <div key={item.title} className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-[#16A34A] transition-colors py-2 cursor-pointer">
                  <span>{item.title}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#16A34A] group-hover:translate-y-0.5 transition-all duration-200" />
                </button>
                
                {/* Dropdown Menu (Opacity 0 -> 1, translateY -4px -> 0, ~180ms) */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
                  <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-zinc-200/90 p-2 min-w-[200px]">
                    {item.links?.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-sm text-zinc-600 hover:text-[#16A34A] hover:bg-emerald-50/80 rounded-lg transition-colors font-medium"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
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
            className="group inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-all shadow-sm shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/30 active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
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
        <div className="md:hidden border-b border-zinc-200 bg-white px-6 pt-3 pb-6 space-y-6 shadow-lg h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-6">
            {navItems.map((item) => (
              <div key={item.title} className="space-y-3">
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-base font-bold text-zinc-900"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">{item.title}</h4>
                    <div className="flex flex-col gap-2">
                      {item.links?.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-1 text-base font-medium text-zinc-700 hover:text-zinc-900"
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
          
          <div className="pt-6 border-t border-zinc-200 flex flex-col gap-3">
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
