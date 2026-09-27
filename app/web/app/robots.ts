import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/owner/",
          "/trainer/",
          "/member/",
          "/checkout/",
          "/app/",
          "/settings/",
          "/superadmin/",
          "/login",
          "/register",
          "/onboarding",
          "/api/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/owner/",
          "/trainer/",
          "/member/",
          "/checkout/",
          "/app/",
          "/settings/",
          "/superadmin/",
          "/login",
          "/register",
          "/onboarding",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
