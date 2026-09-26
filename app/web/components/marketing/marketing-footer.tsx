import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="relative bg-[#07100B] text-[#8A9690] border-t border-white/10 overflow-hidden">
      {/* Subtle top ambient aura glow (fades smoothly from dark CTA) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#16A34A]/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-16 sm:py-20 relative z-10 space-y-16">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & CTA Column (Left 4 cols) */}
          <div className="md:col-span-4 space-y-5">
            <Link href="/" className="inline-block group">
              <Image
                src="/new logos/dark_logo_trans.png"
                alt="REPSI"
                width={200}
                height={60}
                className="h-9 sm:h-10 w-auto object-contain"
                priority
              />
            </Link>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white leading-snug">
                Everything you need to run a modern fitness business.
              </h3>
              <p className="text-xs text-[#8A9690] leading-relaxed max-w-sm">
                Members, trainers, attendance, memberships, payments, and analytics — connected in one platform.
              </p>
            </div>

            {/* Repsi Green Footer CTA Button */}
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shadow-md shadow-[#16A34A]/20 active:scale-[0.98]"
              >
                <span>Start with Repsi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Social Minimal Icons */}
            <div className="flex items-center gap-3.5 pt-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8A9690] hover:text-[#22C55E] hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter X"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8A9690] hover:text-[#22C55E] hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8A9690] hover:text-[#22C55E] hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8A9690] hover:text-[#22C55E] hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right 4 Navigation Columns (Right 8 cols) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* PRODUCT */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#F5F7F5]">
                PRODUCT
              </h4>
              <ul className="space-y-2.5 text-sm font-medium">
                <li>
                  <Link href="/#showcase" className="hover:text-[#22C55E] transition-colors duration-150">
                    Platform
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-[#22C55E] transition-colors duration-150">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-[#22C55E] transition-colors duration-150">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-[#22C55E] transition-colors duration-150">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="hover:text-[#22C55E] transition-colors duration-150">
                    What's New
                  </Link>
                </li>
              </ul>
            </div>

            {/* SOLUTIONS */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#F5F7F5]">
                SOLUTIONS
              </h4>
              <ul className="space-y-2.5 text-sm font-medium">
                <li>
                  <Link href="/solutions/gyms" className="hover:text-[#22C55E] transition-colors duration-150">
                    For Gyms
                  </Link>
                </li>
                <li>
                  <Link href="/solutions/studios" className="hover:text-[#22C55E] transition-colors duration-150">
                    For Studios
                  </Link>
                </li>
                <li>
                  <Link href="/solutions/yoga" className="hover:text-[#22C55E] transition-colors duration-150">
                    For Yoga
                  </Link>
                </li>
                <li>
                  <Link href="/solutions/pools" className="hover:text-[#22C55E] transition-colors duration-150">
                    For Pools
                  </Link>
                </li>
                <li>
                  <Link href="/solutions/personal-trainers" className="hover:text-[#22C55E] transition-colors duration-150">
                    For Trainers
                  </Link>
                </li>
              </ul>
            </div>

            {/* RESOURCES */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#F5F7F5]">
                RESOURCES
              </h4>
              <ul className="space-y-2.5 text-sm font-medium">
                <li>
                  <Link href="/blog" className="hover:text-[#22C55E] transition-colors duration-150">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="hover:text-[#22C55E] transition-colors duration-150">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-[#22C55E] transition-colors duration-150">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-[#22C55E] transition-colors duration-150">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-[#22C55E] transition-colors duration-150">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#F5F7F5]">
                COMPANY
              </h4>
              <ul className="space-y-2.5 text-sm font-medium">
                <li>
                  <Link href="/about" className="hover:text-[#22C55E] transition-colors duration-150">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#22C55E] transition-colors duration-150">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-[#22C55E] transition-colors duration-150">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#22C55E] transition-colors duration-150">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#22C55E] transition-colors duration-150">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#8A9690]">
          <p>© {new Date().getFullYear()} Repsi Technologies Pvt. Ltd. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/about" className="hover:text-[#22C55E] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/about" className="hover:text-[#22C55E] transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/about" className="hover:text-[#22C55E] transition-colors">
              Cookie Policy
            </Link>
            <span className="text-white/20">•</span>
            <span className="inline-flex items-center gap-1.5 text-[#22C55E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
