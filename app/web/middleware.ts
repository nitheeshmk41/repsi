import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Reserved top-level system paths that belong to Repsi platform
const RESERVED_SLUGS = new Set([
  "dashboard",
  "members",
  "trainers",
  "memberships",
  "settings",
  "api",
  "login",
  "signup",
  "onboarding",
  "superadmin",
  "pricing",
  "features",
  "solutions",
  "site",
  "tour",
  "about",
  "contact",
  "blog",
  "compare",
  "guides",
  "help",
  "how-it-works",
  "integrations",
  "partners",
  "use-cases",
  "careers",
  "changelog",
  "cities",
  "docs",
  "downloads",
  "verify-email",
  "reset-password",
  "forgot-password",
  "invite",
  "admin",
  "crm",
  "activity",
  "analytics",
  "attendance",
  "chat",
  "classes",
  "expenses",
  "machines",
  "member",
  "notifications",
  "payments",
  "reports",
  "trainer",
  "workouts",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static assets, Next internals, api, and mascot files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/mascot") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Handle /website/{slug} alias -> rewrite to /site/{slug}
  if (pathname.startsWith("/website/")) {
    const slug = pathname.replace("/website/", "").split("/")[0];
    if (slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/site/${slug}`;
      return NextResponse.rewrite(url);
    }
  }

  // Split path into segments
  const segments = pathname.split("/").filter(Boolean);

  // If it's a single segment (e.g. /fitzone, /ironhouse, /peakfitness)
  if (segments.length === 1) {
    const slug = segments[0].toLowerCase();

    // If it's not a reserved system route, rewrite to /site/{slug}
    if (!RESERVED_SLUGS.has(slug)) {
      const url = request.nextUrl.clone();
      url.pathname = `/site/${slug}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
