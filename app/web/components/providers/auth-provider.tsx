"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_PREFIXES = [
  "/",
  "/features",
  "/pricing",
  "/about",
  "/contact",
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/onboarding",
  "/how-it-works",
  "/integrations",
  "/tour",
  "/changelog",
  "/solutions",
  "/use-cases",
  "/blog",
  "/guides",
  "/help",
  "/docs",
  "/downloads",
  "/careers",
  "/partners",
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const isPublic = PUBLIC_PREFIXES.some((prefix) => {
      if (prefix === "/") return pathname === "/";
      return pathname === prefix || pathname.startsWith(`${prefix}/`);
    });

    const hasToken = document.cookie.split("; ").some((row) => row.startsWith("repsi_session="));

    if (pathname === "/dashboard") {
      if (!hasToken) {
        router.replace("/login");
      } else {
        router.replace("/apex-fitness/dashboard");
      }
      return;
    }

    if (!isPublic && !hasToken) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  const isPublic = pathname
    ? PUBLIC_PREFIXES.some((prefix) => {
        if (prefix === "/") return pathname === "/";
        return pathname === prefix || pathname.startsWith(`${prefix}/`);
      })
    : true;

  // Show nothing while verifying auth on protected routes to prevent flash of content
  if (!isPublic && authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
