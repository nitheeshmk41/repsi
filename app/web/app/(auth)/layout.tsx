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
    <div className="min-h-screen bg-[#F7F9F8] text-[#111714] flex flex-col justify-between selection:bg-[#16A34A]/20 selection:text-[#16A34A]">
      {/* Top Header - Small REPSI logo only */}
      <header className="p-6 sm:p-8">
        <Link href="/" className="inline-block transition-opacity hover:opacity-80">
          <Image
            src="/logos/primary_logo.png"
            alt="REPSI"
            width={120}
            height={40}
            className="h-5 sm:h-6 w-auto object-contain"
            priority
          />
        </Link>
      </header>

      {/* Center - Centered around 45–48% of viewport height */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 -mt-10 pb-8">
        {children}
      </main>

      {/* Footer - Tiny at bottom */}
      <footer className="py-6 text-center text-xs text-[#8A9690]">
        <p>
          © 2026 REPSI ·{" "}
          <Link href="/about" className="hover:text-[#111714] transition-colors">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/about" className="hover:text-[#111714] transition-colors">
            Terms
          </Link>
        </p>
      </footer>
    </div>
  );
}
