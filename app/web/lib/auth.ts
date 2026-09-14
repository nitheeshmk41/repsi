/**
 * REPSI Client Authentication & Session Management
 *
 * Manages user sessions, auth cookies, tokens, and sign-out logic.
 * Integrated with Next.js middleware and FastAPI backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "TRAINER" | "STAFF" | "SUPER_ADMIN" | "USER" | "MEMBER";
  workspaceSlug?: string;
  gymName?: string;
}

export function setAuthCookie(token: string, days = 30): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `repsi_session=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = "repsi_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
}

export function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )repsi_session=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function loginSession(token: string, user: AuthUser, workspaceSlug = "apex-fitness"): void {
  if (typeof window === "undefined") return;
  setAuthCookie(token);
  localStorage.setItem("repsi_auth_token", token);
  localStorage.setItem("repsi_user", JSON.stringify(user));
  localStorage.setItem("repsi_workspace_slug", workspaceSlug);
}

export async function logoutSession(): Promise<void> {
  // 1. Attempt backend invalidation
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("repsi_auth_token") : null;
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (err) {
    console.warn("Backend logout endpoint unavailable, proceeding with client purge", err);
  }

  // 2. Clear all local authentication credentials
  clearAuthCookie();
  if (typeof window !== "undefined") {
    localStorage.removeItem("repsi_auth_token");
    localStorage.removeItem("repsi_user");
    // Clear session storage as well
    sessionStorage.clear();
  }

  // 3. Hard redirect to /login to ensure all memory states and client trees flush completely
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export function hasAuthSession(): boolean {
  if (typeof window === "undefined") return false;
  const cookie = getAuthCookie();
  const token = localStorage.getItem("repsi_auth_token");
  return Boolean(cookie || token);
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem("repsi_user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}
