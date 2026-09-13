import Link from "next/link";
import Image from "next/image";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/logos/repsi_logo_black.png"
                alt="REPSI"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
              The modern operating system for modern gyms. Effortlessly orchestrate members, payments, turnstile attendance, trainers, and revenue growth.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)]">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/features" className="hover:text-[var(--text)] transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-[var(--text)] transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-[var(--text)] transition-colors">Live Preview</Link></li>
              <li><Link href="/superadmin" className="hover:text-[var(--text)] transition-colors">Platform Admin</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)]">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[var(--text)] transition-colors">About REPSI</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--text)] transition-colors">Contact Sales</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--text)] transition-colors">Book a Demo</Link></li>
              <li><span className="text-xs text-[var(--text-muted)]">Bangalore & Chennai</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)]">Security & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-pointer hover:text-[var(--text)] transition-colors">Privacy Policy</span></li>
              <li><span className="cursor-pointer hover:text-[var(--text)] transition-colors">Terms of Service</span></li>
              <li><span className="cursor-pointer hover:text-[var(--text)] transition-colors">Security Architecture</span></li>
              <li><span className="cursor-pointer hover:text-[var(--text)] transition-colors">GDPR / Data Privacy</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} REPSI Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[var(--text-secondary)]">
            <span>SOC2 Type II Certified</span>
            <span>256-bit TLS Encryption</span>
            <span>Multi-Tenant PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
