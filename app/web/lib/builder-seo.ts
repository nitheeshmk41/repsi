/**
 * Gym Website Builder SEO Utility
 * Generates automated SEO metadata, LocalBusiness schema, and HTML heads for customer gym websites (e.g. fitzone.repsi.app).
 */

export interface GymWebsiteSeoConfig {
  gymName: string;
  subdomain: string;
  customDomain?: string;
  pageTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  socialImage?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone?: string;
  openingHours?: string[];
  googleBusinessProfileUrl?: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
  allowIndexing?: boolean;
}

export function generateGymWebsiteMetadata(config: GymWebsiteSeoConfig) {
  const domain = config.customDomain
    ? `https://${config.customDomain}`
    : `https://${config.subdomain}.repsi.app`;

  const title = config.pageTitle || `${config.gymName} | Gym in ${config.address?.city || "Your City"}`;
  const description =
    config.metaDescription ||
    `Join ${config.gymName} in ${config.address?.city || "your area"}. Premier workouts, personal training, fitness classes, and modern amenities.`;

  return {
    title,
    description,
    canonicalUrl: domain,
    allowIndexing: config.allowIndexing ?? true,
    openGraph: {
      title,
      description,
      url: domain,
      siteName: config.gymName,
      images: config.socialImage ? [config.socialImage] : [],
    },
  };
}

/**
 * Generate Google LocalBusiness / HealthClub Schema markup
 */
export function generateLocalBusinessSchema(config: GymWebsiteSeoConfig) {
  const domain = config.customDomain
    ? `https://${config.customDomain}`
    : `https://${config.subdomain}.repsi.app`;

  return {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: config.gymName,
    url: domain,
    telephone: config.phone || "",
    image: config.socialImage || `${domain}/logo.png`,
    sameAs: config.googleBusinessProfileUrl ? [config.googleBusinessProfileUrl] : [],
    address: config.address
      ? {
          "@type": "PostalAddress",
          streetAddress: config.address.street,
          addressLocality: config.address.city,
          addressRegion: config.address.state,
          postalCode: config.address.postalCode,
          addressCountry: config.address.country || "IN",
        }
      : undefined,
    geo: config.geo
      ? {
          "@type": "GeoCoordinates",
          latitude: config.geo.latitude,
          longitude: config.geo.longitude,
        }
      : undefined,
    openingHours: config.openingHours || ["Mo-Sa 06:00-22:00"],
    priceRange: "₹₹",
  };
}
