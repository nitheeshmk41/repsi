export interface CityDetail {
  slug: string;
  city: string;
  state: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  keywords: string[];
  localContext: string;
  popularFeatures: string[];
  pricingContext: string;
  faq: {
    question: string;
    answer: string;
  }[];
}

export const CITY_DATA: Record<string, CityDetail> = {
  "gym-management-software-coimbatore": {
    slug: "gym-management-software-coimbatore",
    city: "Coimbatore",
    state: "Tamil Nadu",
    title: "Gym Management Software in Coimbatore | Repsi",
    metaDescription: "Best gym management software for gym owners in Coimbatore. QR code attendance, WhatsApp automated billing, UPI collection, and local support.",
    h1: "Gym Management Software in Coimbatore",
    subtitle: "Empowering fitness centers, CrossFit boxes, and multi-branch gyms across Coimbatore with local UPI billing and instant QR check-in.",
    keywords: [
      "gym management software coimbatore",
      "gym software coimbatore",
      "gym billing software coimbatore",
      "gym attendance app coimbatore",
    ],
    localContext: "Coimbatore is home to a rapidly growing network of fitness hubs, bodybuilding centers, and boutique yoga studios in RS Puram, Peelamedu, Saibaba Colony, and Gandhipuram. Gym owners in Coimbatore require high-speed front desk check-in, GST compliant billing, and native WhatsApp notifications.",
    popularFeatures: [
      "Instant WhatsApp Fee Receipts",
      "QR Code Attendance via Mobile",
      "UPI & Cashfree Payment Links",
      "Multi-Branch Owner Dashboards",
    ],
    pricingContext: "Repsi offers transparent INR pricing tailored for small studios and large multi-branch chains in Coimbatore starting with zero setup fees.",
    faq: [
      {
        question: "Does Repsi support Tamil language invoices or WhatsApp messages?",
        answer: "Yes, Repsi supports customized WhatsApp message templates allowing gym owners in Coimbatore to send friendly renewal reminders in English or Tamil.",
      },
      {
        question: "Is local support available in Coimbatore?",
        answer: "Yes! Our Indian support team provides fast WhatsApp and phone assistance during local business hours.",
      },
    ],
  },
  "gym-management-software-chennai": {
    slug: "gym-management-software-chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    title: "Gym Management Software in Chennai | Repsi",
    metaDescription: "Top gym management app in Chennai. Manage gym memberships, UPI payments, trainer sessions, and QR attendance in Anna Nagar, Velachery, T. Nagar.",
    h1: "Gym Management Software in Chennai",
    subtitle: "Modern fitness management software for gyms and wellness studios across Chennai.",
    keywords: ["gym management software chennai", "gym billing software chennai", "gym software chennai"],
    localContext: "From Anna Nagar and Velachery to OMR and Adyar, Chennai's vibrant fitness culture demands seamless member management, automatic renewals, and digital workout tracking.",
    popularFeatures: [
      "Contactless QR Turnstile Check-in",
      "WhatsApp Renewal Reminders",
      "GST Invoicing & Tax Ledgers",
    ],
    pricingContext: "Affordable INR pricing per location with no long-term contracts.",
    faq: [
      {
        question: "Can I manage multiple gym branches in Chennai under one account?",
        answer: "Absolutely. Repsi's multi-branch architecture lets you monitor branch revenue, member transfers, and trainer rosters across Chennai in real-time.",
      },
    ],
  },
  "gym-management-software-bangalore": {
    slug: "gym-management-software-bangalore",
    city: "Bangalore",
    state: "Karnataka",
    title: "Gym Management Software in Bangalore | Repsi",
    metaDescription: "Leading gym software in Bangalore for tech-forward gyms and studios in Indiranagar, HSR Layout, Koramangala, and Whitefield.",
    h1: "Gym Management Software in Bangalore",
    subtitle: "Tech-first fitness platform for modern gyms, CrossFit boxes, and swim centers in Bangalore.",
    keywords: ["gym management software bangalore", "gym software bangalore", "fitness app bangalore"],
    localContext: "Bangalore fitness enthusiasts expect digital-first experiences: instant QR entrance, automated UPI subscriptions, mobile workout plans, and digital pass management.",
    popularFeatures: [
      "Automated UPI Recurring Payments",
      "Trainer Class & PT Scheduler",
      "Member Mobile App & QR Pass",
    ],
    pricingContext: "Flexible monthly and annual plans built for tech hubs and premium fitness chains.",
    faq: [
      {
        question: "Can members check in using their smartphones?",
        answer: "Yes! Members simply open their Repsi mobile app to display dynamic QR codes for high-speed entrance.",
      },
    ],
  },
  "gym-management-software-mumbai": {
    slug: "gym-management-software-mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    title: "Gym Management Software in Mumbai | Repsi",
    metaDescription: "Streamline gym operations in Mumbai. Track memberships, QR attendance, GST billing, and personal training in Bandra, Andheri, and South Mumbai.",
    h1: "Gym Management Software in Mumbai",
    subtitle: "High-performance gym software for premium clubs and local fitness centers across Mumbai.",
    keywords: ["gym management software mumbai", "gym software mumbai", "gym billing app mumbai"],
    localContext: "Gyms in Mumbai require fast check-in during rush hours, automated payment follow-ups, and trainer commission tracking.",
    popularFeatures: [
      "Peak Hours Capacity Tracking",
      "WhatsApp Invoice & Lead CRM",
      "Multi-Branch Owner Control",
    ],
    pricingContext: "Transparent INR billing with local payment options.",
    faq: [
      {
        question: "Does Repsi calculate trainer commissions automatically?",
        answer: "Yes, define commission splits for personal training packages and export monthly payroll reports.",
      },
    ],
  },
};
