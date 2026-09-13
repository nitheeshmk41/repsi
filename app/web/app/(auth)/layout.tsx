// Auth layout — centered, clean, no sidebar
// Shared by login, signup, forgot-password, etc.

import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Logo Header */}
      <header className="flex h-16 items-center px-6 border-b border-[var(--border)] bg-[var(--surface)]">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/repsi_logo_black.png"
            alt="REPSI"
            width={170}
            height={55}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="h-12 flex items-center justify-center px-6 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} REPSI · 
          <Link href="#" className="hover:text-[var(--text-secondary)] ml-1">Privacy</Link> · 
          <Link href="#" className="hover:text-[var(--text-secondary)] ml-1">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
