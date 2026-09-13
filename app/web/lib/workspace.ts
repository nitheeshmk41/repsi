export function slugToGymName(slug: string): string {
  if (!slug) return "Apex Fitness";
  if (slug === "apex-fitness") return "Apex Fitness";
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function getWorkspaceFromPath(pathname: string): string {
  if (!pathname) return "apex-fitness";
  const parts = pathname.split("/").filter(Boolean);
  const reserved = [
    "features", "pricing", "about", "contact",
    "login", "signup", "verify-email", "forgot-password", "reset-password",
    "onboarding", "superadmin"
  ];
  if (parts.length > 0 && !reserved.includes(parts[0])) {
    return parts[0];
  }
  return "apex-fitness";
}
