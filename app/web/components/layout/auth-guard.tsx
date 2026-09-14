"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { hasAuthSession, getAuthUser } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Check authentication session
    const isAuthed = hasAuthSession();
    if (!isAuthed) {
      setAuthorized(false);
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. Validate requested workspace slug against authorized user context
    const user = getAuthUser();
    const storedSlug = typeof window !== "undefined" ? localStorage.getItem("repsi_workspace_slug") : null;
    const authorizedSlug = user?.workspaceSlug || storedSlug;

    const parts = pathname.split("/");
    // Check if path format is /workspace/[slug]/...
    if (parts[1] === "workspace" && parts[2]) {
      const requestedSlug = parts[2];
      if (
        user?.role !== "SUPER_ADMIN" &&
        authorizedSlug &&
        requestedSlug !== authorizedSlug
      ) {
        console.warn(`Unauthorized workspace URL attempt: requested '${requestedSlug}', authorized '${authorizedSlug}'`);
        setAuthorized(false);
        router.replace(`/workspace/${authorizedSlug}/dashboard`);
        return;
      }
    }

    setAuthorized(true);
  }, [pathname, router]);

  // While checking or unauthorized, do not flash protected UI
  if (authorized !== true) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
          <span className="text-xs text-[var(--text-muted)] font-medium">Verifying workspace authorization...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
