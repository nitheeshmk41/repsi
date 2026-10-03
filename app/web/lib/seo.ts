import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://repsi.app";

export interface PageSeoOptions {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  ogType?: "website" | "article";
  image?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description,
  keywords = [],
  path = "",
  ogType = "website",
  image = "/images/og-image.png",
  noIndex = false,
}: PageSeoOptions): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`;
  const defaultKeywords = [
    "gym management software",
    "gym management software India",
    "gym management system",
    "gym software",
    "gym management app",
    "fitness management software",
    "gym CRM software",
    "gym billing software",
    "gym membership management software",
  ];

  const combinedKeywords = Array.from(new Set([...defaultKeywords, ...keywords]));

  return {
    title: {
      default: title,
      template: "%s | Repsi",
    },
    description,
    keywords: combinedKeywords,
    authors: [{ name: "Repsi", url: SITE_URL }],
    creator: "Repsi",
    publisher: "Repsi",
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Repsi",
      locale: "en_IN",
      type: ogType,
      images: [
        {
          url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.startsWith("http") ? image : `${SITE_URL}${image}`],
      creator: "@repsi_app",
    },
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon.png",
    },
    manifest: "/manifest.json",
  };
}

/**
 * Generate Organization JSON-LD Schema
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Repsi",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    sameAs: [
      "https://twitter.com/repsi_app",
      "https://linkedin.com/company/repsi",
      "https://instagram.com/repsi.app",
    ],
    description: "The modern operating system for gyms, studios, swimming pools, and fitness businesses.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
  };
}

/**
 * Generate SoftwareApplication JSON-LD Schema
 */
export function getSoftwareAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Repsi Fitness Management Software",
    operatingSystem: "Web, iOS, Android",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "348",
      bestRating: "5",
      worstRating: "1",
    },
    description: "All-in-one gym management software with QR attendance, UPI payments, WhatsApp billing, trainer management, and member portal.",
  };
}

/**
 * Generate FAQ JSON-LD Schema
 */
export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
