import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Core Pages
  const coreRoutes = [
    "",
    "/pricing",
    "/about",
    "/contact",
    "/demo",
    "/blog",
    "/gym-management-software-india",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dedicated Feature Pages
  const featureRoutes = [
    "gym-management",
    "member-management",
    "gym-crm",
    "gym-billing",
    "gym-attendance",
    "trainer-management",
    "workout-management",
    "diet-management",
    "gym-website-builder",
    "gym-analytics",
    "gym-payment-management",
    "gym-staff-management",
  ].map((feature) => ({
    url: `${SITE_URL}/features/${feature}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // Dedicated Solution Pages
  const solutionRoutes = [
    "gyms",
    "fitness-studios",
    "yoga-studios",
    "swimming-pools",
    "crossfit",
    "personal-trainers",
    "multi-branch-gyms",
  ].map((solution) => ({
    url: `${SITE_URL}/solutions/${solution}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Dedicated Comparison Pages
  const comparisonRoutes = [
    "repsi-vs-gymforce",
    "repsi-vs-fitnessforce",
    "repsi-vs-mindbody",
    "repsi-vs-gymmaster",
  ].map((comp) => ({
    url: `${SITE_URL}/compare/${comp}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // City Pages
  const cityRoutes = [
    "gym-management-software-coimbatore",
    "gym-management-software-chennai",
    "gym-management-software-bangalore",
    "gym-management-software-mumbai",
    "gym-management-software-hyderabad",
    "gym-management-software-delhi",
  ].map((city) => ({
    url: `${SITE_URL}/cities/${city}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    ...coreRoutes,
    ...featureRoutes,
    ...solutionRoutes,
    ...comparisonRoutes,
    ...cityRoutes,
  ];
}
