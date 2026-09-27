export interface ComparisonDetail {
  slug: string;
  competitor: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  keywords: string[];
  summary: string;
  featuresMatrix: {
    feature: string;
    repsiHas: boolean | string;
    competitorHas: boolean | string;
    notes?: string;
  }[];
  keyDifferences: {
    title: string;
    description: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export const COMPARISON_DATA: Record<string, ComparisonDetail> = {
  "repsi-vs-gymforce": {
    slug: "repsi-vs-gymforce",
    competitor: "Gymforce",
    title: "Repsi vs Gymforce Comparison | Gym Management Software",
    metaDescription: "An objective feature-by-feature comparison of Repsi and Gymforce for gym management software in India, featuring QR attendance, UPI, and WhatsApp tools.",
    h1: "Repsi vs Gymforce Comparison",
    subtitle: "Compare features, pricing transparency, WhatsApp automated billing, and local support.",
    keywords: ["repsi vs gymforce", "gymforce alternative", "best gym software india"],
    summary: "While Gymforce offers traditional desktop and basic web software, Repsi is built from the ground up as a modern cloud platform with native WhatsApp billing, sub-second QR code attendance, and integrated website builder.",
    featuresMatrix: [
      { feature: "Member & Roster Management", repsiHas: true, competitorHas: true },
      { feature: "Contactless QR Code Attendance", repsiHas: true, competitorHas: false, notes: "Gymforce relies primarily on legacy hardware" },
      { feature: "Automated WhatsApp Payment Links", repsiHas: true, competitorHas: false },
      { feature: "UPI & Cashfree Indian Payment Gateway", repsiHas: true, competitorHas: "Limited" },
      { feature: "Integrated Gym Website Builder", repsiHas: true, competitorHas: false },
      { feature: "Multi-Branch Governance Dashboard", repsiHas: true, competitorHas: true },
      { feature: "Mobile Apps for Members & Trainers", repsiHas: true, competitorHas: true },
      { feature: "Transparent Subscription Pricing", repsiHas: true, competitorHas: false, notes: "Gymforce requires quote request" },
    ],
    keyDifferences: [
      {
        title: "Modern Mobile Experience",
        description: "Repsi provides fast, responsive iOS and Android apps for members, trainers, and gym owners.",
      },
      {
        title: "Automated WhatsApp Communication",
        description: "Repsi sends automated payment reminders, GST invoices, and renewal alerts directly on WhatsApp.",
      },
    ],
    faq: [
      {
        question: "Is Repsi easier to migrate to from Gymforce?",
        answer: "Yes! Repsi offers 1-click CSV roster import allowing you to migrate member records, active memberships, and balance ledgers seamlessly.",
      },
    ],
  },
  "repsi-vs-fitnessforce": {
    slug: "repsi-vs-fitnessforce",
    competitor: "Fitnessforce",
    title: "Repsi vs Fitnessforce Comparison | Gym Software",
    metaDescription: "Detailed comparison of Repsi vs Fitnessforce. Discover why gym owners prefer Repsi for WhatsApp billing, QR attendance, and transparent pricing.",
    h1: "Repsi vs Fitnessforce Comparison",
    subtitle: "Evaluate features, UI modernism, multi-branch control, and setup times.",
    keywords: ["repsi vs fitnessforce", "fitnessforce alternative", "gym software comparison"],
    summary: "Fitnessforce is an established enterprise player, but gym owners looking for rapid setup, intuitive user interfaces, and built-in website building prefer Repsi.",
    featuresMatrix: [
      { feature: "Member & Lead CRM", repsiHas: true, competitorHas: true },
      { feature: "QR Code Attendance", repsiHas: true, competitorHas: true },
      { feature: "Instant WhatsApp Billing Reminders", repsiHas: true, competitorHas: false },
      { feature: "Free Built-in Gym Website Builder", repsiHas: true, competitorHas: false },
      { feature: "Multi-Branch Support", repsiHas: true, competitorHas: true },
      { feature: "Setup Time", repsiHas: "< 10 Minutes", competitorHas: "Days / Weeks" },
    ],
    keyDifferences: [
      {
        title: "Instant Setup vs Complex Deployment",
        description: "Repsi allows gyms to go live in under 10 minutes without requiring complex IT configuration.",
      },
    ],
    faq: [
      {
        question: "Does Repsi support multi-branch gyms like Fitnessforce?",
        answer: "Yes, Repsi allows owners to manage single or multi-branch gym chains with central analytics and cross-branch member access.",
      },
    ],
  },
  "repsi-vs-mindbody": {
    slug: "repsi-vs-mindbody",
    competitor: "Mindbody",
    title: "Repsi vs Mindbody Comparison | Gym & Studio Management Software",
    metaDescription: "Compare Repsi vs Mindbody. Learn how Repsi provides a cost-effective, India-optimized alternative with local UPI payments and WhatsApp tools.",
    h1: "Repsi vs Mindbody Comparison",
    subtitle: "Local payments, WhatsApp integration, and transparent pricing without heavy percentage fees.",
    keywords: ["repsi vs mindbody", "mindbody alternative India", "affordable gym software"],
    summary: "Mindbody is built for large Western wellness chains and charges high monthly fees + commission rates. Repsi is tailored specifically with local UPI payments, WhatsApp integration, and affordable flat pricing.",
    featuresMatrix: [
      { feature: "Member & Class Scheduling", repsiHas: true, competitorHas: true },
      { feature: "Indian UPI Payments & QR Code", repsiHas: true, competitorHas: false },
      { feature: "WhatsApp Notification & Invoice Delivery", repsiHas: true, competitorHas: false },
      { feature: "Affordable Flat Monthly Fee", repsiHas: true, competitorHas: false, notes: "Mindbody starts at expensive USD tiers" },
      { feature: "GST Invoice Generation", repsiHas: true, competitorHas: false },
    ],
    keyDifferences: [
      {
        title: "India Payment & GST Native",
        description: "Repsi supports direct UPI, GPay, Paytm, and GST tax invoicing out of the box.",
      },
    ],
    faq: [
      {
        question: "Why choose Repsi over Mindbody in India?",
        answer: "Repsi provides native UPI payments, automated WhatsApp billing, local customer support, and flat INR pricing without expensive USD subscription fees.",
      },
    ],
  },
  "repsi-vs-gymmaster": {
    slug: "repsi-vs-gymmaster",
    competitor: "GymMaster",
    title: "Repsi vs GymMaster Comparison | Gym Management Platform",
    metaDescription: "Compare Repsi and GymMaster. Discover differences in access control, WhatsApp messaging, member app experience, and pricing.",
    h1: "Repsi vs GymMaster Comparison",
    subtitle: "Compare access control hardware flexibility, messaging tools, and member apps.",
    keywords: ["repsi vs gymmaster", "gymmaster alternative", "gym access control software"],
    summary: "GymMaster specializes in door hardware control. Repsi combines access control (via QR and hardware APIs) with powerful local Indian marketing CRM, WhatsApp billing, and website creation.",
    featuresMatrix: [
      { feature: "Access Control / Door Gate Integration", repsiHas: true, competitorHas: true },
      { feature: "QR Code Smartphone Access", repsiHas: true, competitorHas: true },
      { feature: "WhatsApp Marketing & Drip Sequences", repsiHas: true, competitorHas: false },
      { feature: "Gym Website Builder with Local SEO", repsiHas: true, competitorHas: false },
      { feature: "Local Currency (INR) & UPI", repsiHas: true, competitorHas: "Limited" },
    ],
    keyDifferences: [
      {
        title: "All-in-One Operating System",
        description: "Repsi combines gate access control with full billing, marketing CRM, trainer schedules, and gym website creation.",
      },
    ],
    faq: [
      {
        question: "Can I connect existing gate turnstiles to Repsi?",
        answer: "Yes, Repsi provides API connectors for turnstile gates, biometric readers, and tablet QR scanners.",
      },
    ],
  },
};
