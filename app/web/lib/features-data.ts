export interface FeatureDetail {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  keywords: string[];
  sections: {
    h2: string;
    description: string;
    bullets: string[];
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export const FEATURES_DATA: Record<string, FeatureDetail> = {
  "gym-management": {
    slug: "gym-management",
    title: "Gym Management Software | Repsi",
    metaDescription: "Comprehensive gym management software to streamline operations, member tracking, payments, trainer scheduling, and multi-branch gym performance.",
    h1: "Gym Management Software",
    subtitle: "The complete operating system to manage members, payments, attendance, and branch growth.",
    keywords: ["gym management software", "gym management system", "gym operating system", "gym software India"],
    sections: [
      {
        h2: "Manage members seamlessly",
        description: "Track complete member lifecycles from initial lead capture to active membership, renewal reminders, and attendance histories.",
        bullets: ["Automated membership renewals", "Member profile & check-in status", "Digital membership cards & QR passes"],
      },
      {
        h2: "Track attendance with instant QR check-in",
        description: "Eliminate front desk bottlenecks with high-speed QR code scanning, biometrics integration, and live access control.",
        bullets: ["Contactless QR check-in", "Live occupancy tracking", "Automated absent member follow-ups"],
      },
      {
        h2: "Collect payments & manage subscriptions",
        description: "Automate billing with instant UPI, credit/debit card gateway integration, cash receipts, and direct WhatsApp invoice delivery.",
        bullets: ["UPI & Cashfree payment integration", "Automated WhatsApp payment reminders", "GST invoice generation"],
      },
      {
        h2: "Manage trainers & class schedules",
        description: "Assign personal trainers, track session attendance, calculate trainer payouts, and coordinate group class calendars.",
        bullets: ["Personal trainer session tracking", "Class capacity management", "Trainer commission calculation"],
      },
      {
        h2: "Track gym performance & analytics",
        description: "Get real-time insights into revenue, active member ratios, renewal retention rates, and peak usage hours.",
        bullets: ["Monthly recurring revenue (MRR) reports", "Member churn analytics", "Branch performance benchmarking"],
      },
      {
        h2: "Manage multiple branches effortlessly",
        description: "Switch seamlessly between multiple locations, compare revenue, and allow cross-branch member access.",
        bullets: ["Centralized multi-branch dashboard", "Cross-branch member pass authorization", "Location-based financial reporting"],
      },
    ],
    faq: [
      {
        question: "What is Repsi Gym Management Software?",
        answer: "Repsi is an all-in-one cloud platform designed for gyms, fitness studios, swimming pools, and sports clubs to manage members, payments, attendance, CRM, and staff from a single dashboard.",
      },
      {
        question: "Does Repsi support UPI and Indian payment gateways?",
        answer: "Yes! Repsi comes pre-integrated with Indian payment gateways (Cashfree/UPI) and supports instant WhatsApp payment reminders.",
      },
    ],
  },
  "member-management": {
    slug: "member-management",
    title: "Gym Member Management Software | Repsi",
    metaDescription: "Manage member rosters, digital IDs, subscriptions, attendance history, and engagement with Repsi Member Management Software.",
    h1: "Gym Member Management Software",
    subtitle: "Empower your members with a digital portal while keeping your roster organized.",
    keywords: ["gym member management software", "gym roster software", "member tracking app"],
    sections: [
      {
        h2: "Complete Member Roster Control",
        description: "Access detailed member profiles, medical history, membership status, and emergency contacts in seconds.",
        bullets: ["Digital profile storage", "Freeze & transfer membership options", "Document storage & ID proof"],
      },
      {
        h2: "Automated Membership Renewal Reminders",
        description: "Never lose a member to missed renewals. Send automated WhatsApp and SMS alerts prior to expiration.",
        bullets: ["WhatsApp renewal links", "Customized discount codes for early renewal", "Auto-recurring billing"],
      },
    ],
    faq: [
      {
        question: "Can members track their workouts and attendance?",
        answer: "Yes, members get access to a branded mobile app where they can view attendance, active memberships, and trainer notes.",
      },
    ],
  },
  "gym-crm": {
    slug: "gym-crm",
    title: "Gym CRM Software | Turn Leads into Loyal Members | Repsi",
    metaDescription: "Convert trial leads into paying members with Repsi Gym CRM Software. Track inquiries, automate follow-ups, and reduce churn.",
    h1: "Gym CRM Software",
    subtitle: "Capture, nurture, and convert inquiries into long-term gym members.",
    keywords: ["gym crm software", "gym lead management", "gym crm software India", "gym marketing automation"],
    sections: [
      {
        h2: "Automated Lead Capture & Management",
        description: "Automatically sync leads from Instagram, Google My Business, website forms, and walk-ins into a visual sales pipeline.",
        bullets: ["Lead source tracking", "Automated trial session booking", "Pipeline stage management"],
      },
      {
        h2: "WhatsApp & SMS Follow-up Sequences",
        description: "Never let a potential member slip away. Set up automated WhatsApp drip campaigns for trial leads.",
        bullets: ["1-click WhatsApp messaging", "Automated follow-up scheduling", "Conversion analytics"],
      },
    ],
    faq: [
      {
        question: "Can I connect Repsi CRM with WhatsApp?",
        answer: "Yes, Repsi supports direct WhatsApp integration for automated lead greetings, follow-up messages, and trial booking confirmations.",
      },
    ],
  },
  "gym-billing": {
    slug: "gym-billing",
    title: "Gym Billing & Invoicing Software with WhatsApp & UPI | Repsi",
    metaDescription: "Simplify gym payments with Repsi Gym Billing Software. Collect payments via UPI, generate GST invoices, and send instant WhatsApp receipts.",
    h1: "Gym Billing Software",
    subtitle: "Fast, accurate, and GST-compliant invoicing with automated UPI payments.",
    keywords: ["gym billing software", "gym billing software with WhatsApp", "gym billing software with UPI payments", "gym gst invoice software"],
    sections: [
      {
        h2: "Instant UPI & QR Code Billing",
        description: "Generate static or dynamic QR codes for instant UPI payment collection directly at the front desk.",
        bullets: ["Direct UPI & GPay integration", "Instant payment reconciliation", "Zero manual data entry"],
      },
      {
        h2: "GST Compliant Invoicing & Receipts",
        description: "Automatically generate branded GST invoices with detailed tax breakdown and send them directly to member WhatsApp.",
        bullets: ["Automated tax calculations (CGST/SGST)", "Digital PDF receipt generation", "Expense & income ledger tracking"],
      },
    ],
    faq: [
      {
        question: "Is Repsi compliant with Indian GST requirements?",
        answer: "Yes, Repsi allows gym owners to configure GST registration numbers (GSTIN), set custom HSN/SAC codes, and issue compliant tax invoices.",
      },
    ],
  },
  "gym-attendance": {
    slug: "gym-attendance",
    title: "Gym Attendance Software with QR Code & Biometrics | Repsi",
    metaDescription: "Track gym member and trainer attendance with contactless QR scanning, biometric integration, and live access control with Repsi.",
    h1: "Gym Attendance Software",
    subtitle: "High-speed, contactless attendance tracking with real-time access management.",
    keywords: ["gym attendance software", "gym management software with QR attendance", "biometric gym attendance"],
    sections: [
      {
        h2: "Instant Contactless QR Attendance",
        description: "Members scan their dynamic app QR code at the desk or turnstile for instant check-in approval.",
        bullets: ["Sub-second scan validation", "Active membership check before entry", "Offline mode resilience"],
      },
      {
        h2: "Biometric & Hardware Turnstile Integration",
        description: "Seamlessly sync with facial recognition devices, RFID cards, and automated turnstile gates.",
        bullets: ["Hardware API integration", "Automatic access revoking for unpaid members", "Real-time peak hours monitoring"],
      },
    ],
    faq: [
      {
        question: "Does QR attendance work without expensive hardware?",
        answer: "Yes! Front desk staff can use any smartphone or tablet running Repsi to scan member QR codes instantly.",
      },
    ],
  },
  "trainer-management": {
    slug: "trainer-management",
    title: "Gym Trainer Management Software | Repsi",
    metaDescription: "Assign personal trainers, schedule PT sessions, track client progress, and calculate commissions with Repsi Trainer Management.",
    h1: "Gym Trainer Management Software",
    subtitle: "Optimize personal training schedules, commissions, and client workout results.",
    keywords: ["gym trainer management software", "personal trainer management software", "pt session tracking"],
    sections: [
      {
        h2: "Personal Training Session Tracking",
        description: "Manage PT packages, deduct completed sessions automatically, and notify clients of remaining sessions.",
        bullets: ["Digital PT punch-card system", "Session completion sign-off", "Client feedback tracking"],
      },
      {
        h2: "Trainer Payouts & Commission Calculation",
        description: "Automate commission calculations based on packages sold, sessions delivered, or percentage splits.",
        bullets: ["Custom commission tiers", "Performance analytics per trainer", "Automated monthly payroll reports"],
      },
    ],
    faq: [
      {
        question: "Can trainers log workouts for their clients?",
        answer: "Yes, trainers get dedicated mobile access to assign workout schedules, log weights, and track client progression.",
      },
    ],
  },
  "workout-management": {
    slug: "workout-management",
    title: "Gym Workout & Routine Builder Software | Repsi",
    metaDescription: "Create custom workout plans, exercise libraries, and exercise routines for gym members with Repsi Workout Management.",
    h1: "Gym Workout Management Software",
    subtitle: "Deliver personalized workout plans and track strength progress digitally.",
    keywords: ["gym workout management software", "fitness routine builder", "workout logger software"],
    sections: [
      {
        h2: "Rich Exercise Library & Routine Builder",
        description: "Build custom workout routines with video guides, rep/set specifications, and muscle group targeting.",
        bullets: ["500+ exercise library", "Custom exercise creation", "1-click workout plan assignment"],
      },
    ],
    faq: [
      {
        question: "Can members view their daily workout plan in the mobile app?",
        answer: "Yes, members can open their Repsi mobile app to view daily workout routines, watch exercise demo clips, and log completed sets.",
      },
    ],
  },
  "diet-management": {
    slug: "diet-management",
    title: "Gym Diet & Nutrition Plan Software | Repsi",
    metaDescription: "Design custom diet plans, macro breakdowns, and nutrition targets for gym members with Repsi Diet Management Software.",
    h1: "Gym Diet & Nutrition Management Software",
    subtitle: "Complement workouts with tailored meal plans and macro tracking.",
    keywords: ["diet management software", "gym nutrition plan software", "macro meal planner for gyms"],
    sections: [
      {
        h2: "Tailored Macro & Meal Plan Builder",
        description: "Create Indian and global diet plans with calorie count, macro ratios (proteins, carbs, fats), and meal timings.",
        bullets: ["Indian food nutrition database", "Custom meal timing schedules", "PDF & App diet delivery"],
      },
    ],
    faq: [
      {
        question: "Does the diet planner include Indian food items?",
        answer: "Yes! Repsi features an extensive database of Indian dishes, regional meals, and precise macronutrient breakdowns.",
      },
    ],
  },
  "gym-website-builder": {
    slug: "gym-website-builder",
    title: "Gym Website Builder | Automated Local SEO & Booking | Repsi",
    metaDescription: "Create a stunning, SEO-optimized website for your gym in under 5 minutes with Repsi Gym Website Builder. Includes Google Local Business schema.",
    h1: "Gym Website Builder",
    subtitle: "Launch a high-converting, local SEO-optimized gym website with zero coding.",
    keywords: ["gym website builder", "fitness website builder", "local seo for gyms", "gym landing page builder"],
    sections: [
      {
        h2: "Instant Subdomain & Custom Domain Setup",
        description: "Get your gym online instantly with fitzone.repsi.app or connect your custom domain with free SSL certificate.",
        bullets: ["Instant 1-click publishing", "Custom domain configuration", "Mobile-first responsive design"],
      },
      {
        h2: "Automated Local SEO & Schema Markup",
        description: "Repsi automatically embeds Google LocalBusiness schema, meta tags, sitemaps, and canonical links to boost your local rank.",
        bullets: ["Automatic Google LocalBusiness JSON-LD", "Dynamic sitemap.xml & robots.txt", "Google Maps & review integration"],
      },
    ],
    faq: [
      {
        question: "Do I need coding knowledge to build a gym website on Repsi?",
        answer: "Not at all! Choose a theme, add your photos, select membership packages, and your site is live instantly.",
      },
    ],
  },
  "gym-analytics": {
    slug: "gym-analytics",
    title: "Gym Business Analytics & Revenue Reporting | Repsi",
    metaDescription: "Make data-driven decisions with Repsi Gym Analytics. Monitor MRR, retention rate, peak attendance hours, and profit margins.",
    h1: "Gym Analytics Software",
    subtitle: "Real-time revenue, member retention, and operational intelligence.",
    keywords: ["gym analytics software", "gym reporting tool", "gym mrr dashboard", "fitness business analytics"],
    sections: [
      {
        h2: "Revenue & MRR Dashboards",
        description: "Track monthly recurring revenue, upcoming renewals, outstanding dues, and payment breakdown by mode.",
        bullets: ["Visual revenue growth trends", "Outstanding payment ledger", "Cashflow projections"],
      },
    ],
    faq: [
      {
        question: "Can I export financial reports for tax filing?",
        answer: "Yes, export clean Excel/CSV reports for income, expenses, GST liability, and trainer payouts anytime.",
      },
    ],
  },
  "gym-payment-management": {
    slug: "gym-payment-management",
    title: "Gym Payment Management Software | Cashfree & UPI | Repsi",
    metaDescription: "Collect, track, and reconcile gym fees with automatic UPI links, Cashfree integration, and auto WhatsApp reminders with Repsi.",
    h1: "Gym Payment Management Software",
    subtitle: "Automate fee collection, payment links, and financial reconciliation.",
    keywords: ["gym payment software", "gym payment links", "upi gym fee collection"],
    sections: [
      {
        h2: "Automated Payment Links via WhatsApp",
        description: "Send direct payment links to members before due dates, allowing 1-tap payment through UPI, Paytm, or Credit Card.",
        bullets: ["Direct WhatsApp link delivery", "Automatic status reconciliation", "Zero manual confirmation needed"],
      },
    ],
    faq: [
      {
        question: "Are online payments deposited directly to my bank account?",
        answer: "Yes, funds collected through online gateways are settled directly into your linked gym business bank account.",
      },
    ],
  },
  "gym-staff-management": {
    slug: "gym-staff-management",
    title: "Gym Staff & Front Desk Management Software | Repsi",
    metaDescription: "Manage front desk staff, shift schedules, attendance, and role-based access permissions with Repsi Gym Staff Management.",
    h1: "Gym Staff Management Software",
    subtitle: "Empower front desk staff while protecting sensitive financial data with role-based security.",
    keywords: ["gym staff management software", "front desk gym software", "gym staff permissions"],
    sections: [
      {
        h2: "Granular Role-Based Access Control",
        description: "Assign front-desk staff, manager, or accountant roles with customized permissions for billing, member data, and reports.",
        bullets: ["Custom staff permissions", "Audit logs for staff actions", "Shift attendance tracking"],
      },
    ],
    faq: [
      {
        question: "Can front desk staff see overall gym revenue?",
        answer: "No, you can easily restrict staff access so they can only check in members and issue receipts without viewing full financial reports.",
      },
    ],
  },
};
