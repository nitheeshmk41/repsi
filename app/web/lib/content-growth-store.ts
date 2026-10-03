"use client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  status: "draft" | "published";
  publishDate: string;
  readTime: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  faqs?: { question: string; answer: string }[];
  relatedSlugs?: string[];
  views: number;
}

export interface JobPosting {
  id: string;
  title: string;
  slug: string;
  department: "Engineering" | "Product" | "Marketing" | "Sales & Growth" | "Customer Success" | "Operations";
  location: string;
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Remote";
  experience: string;
  salaryRange?: string;
  status: "published" | "draft" | "closed";
  publishDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  experienceYears: string;
  portfolioUrl?: string;
  resumeFileName: string;
  coverLetter?: string;
  appliedAt: string;
  status: "new" | "screening" | "interview" | "selected" | "rejected";
  notes?: string;
}

export interface PartnerAccount {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  partnerType: "Gym Consultant" | "Fitness Equipment Dealer" | "Personal Trainer" | "Gym Setup Company" | "Fitness Influencer" | "Digital Agency" | "Community / Association";
  referralCode: string;
  referralUrl: string;
  status: "pending" | "approved" | "active" | "suspended" | "rejected";
  tier: "Standard Partner" | "Certified Partner" | "Strategic Partner";
  commissionRate: number; // percentage, e.g. 20
  clicks: number;
  signups: number;
  paidCustomers: number;
  revenueGenerated: number;
  commissionEarned: number;
  pendingCommission: number;
  paidCommission: number;
  joinedAt: string;
  payoutUpiOrBank?: string;
}

export interface ReferralRecord {
  id: string;
  partnerId: string;
  partnerCode: string;
  partnerName: string;
  gymName: string;
  customerEmail: string;
  planName: "Starter" | "Pro" | "Business" | "Enterprise";
  planAmount: number;
  commissionAmount: number;
  status: "pending" | "confirmed" | "payable" | "paid" | "cancelled";
  signupDate: string;
  purchaseDate: string;
  orderId: string;
  payoutDate?: string;
}

export interface CommissionSettings {
  starterRate: number; // percentage
  proRate: number;
  businessRate: number;
  commissionDuration: "first_payment" | "12_months" | "lifetime";
  minPayoutThreshold: number; // INR
  refundHoldDays: number;
}

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "10 Proven Ways to Increase Gym Membership and Member Retention in 2026",
    slug: "how-to-increase-gym-membership",
    summary: "Discover data-backed marketing, automated WhatsApp engagement, and onboarding retention strategies to scale your fitness center profitably.",
    content: `
## The New Economics of Gym Growth in India

Running a profitable gym in 2026 is no longer just about filling floor space with heavy iron and standard treadmills. With rising urban rents, premium fitness studio alternatives, and digital fitness options, gym owners must operate with modern systems.

### 1. Zero-Friction QR Onboarding and Digital Check-ins
Long queues at the front desk kill the workout vibe. When members walk into your facility and scan a personalized dynamic QR code on their smartphone, check-in takes less than two seconds. Instant attendance alerts give members a sense of accountability and give front-desk staff real-time floor capacity analytics.

### 2. Automated WhatsApp Lifecycle Messaging
Email open rates for gym members average under 14%. WhatsApp open rates in India exceed 98%. By setting up automated WhatsApp triggers for:
- Payment renewal reminders (7 days, 3 days, and 1 day prior)
- Instant UPI invoice receipts with one-tap download
- Birthday greetings with a complimentary buddy pass
- Inactive alerts when a member hasn't checked in for 6 days

Gyms using Repsi report a **34% decrease in subscription churn** within the first 60 days of automated WhatsApp workflows.

### 3. Integrated UPI & Auto-Pay Billing
Chasing late fees manually through paper registers is embarrassing and inefficient. Offer members direct UPI links (Google Pay, PhonePe, Paytm, Cred) right inside WhatsApp reminders so they can renew in under 15 seconds without waiting in line.

### 4. Trainer Accountability and Goal Tracking
Members don't quit gyms; they quit lack of progress. Equip your personal trainers with mobile tools to log body composition (BMI, body fat %, muscle mass) and workout routines directly into member profiles. When members see tangible monthly results on their app, renewal becomes a no-brainer.
    `,
    category: "Gym Growth",
    tags: ["Gym Marketing", "Member Retention", "WhatsApp Automation", "Revenue"],
    featuredImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Repsi Editorial Team",
      role: "Fitness Operations Specialists",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    },
    status: "published",
    publishDate: "2026-09-15",
    readTime: "6 min read",
    seoTitle: "How to Increase Gym Membership & Member Retention (2026 Guide) | Repsi",
    seoDescription: "Learn 10 actionable tactics to increase gym memberships, cut member churn by 34%, and automate renewals using WhatsApp and UPI with Repsi.",
    canonicalUrl: "https://repsi.app/blog/how-to-increase-gym-membership",
    views: 3420,
    faqs: [
      {
        question: "How does automated WhatsApp billing increase gym renewals?",
        answer: "Automated WhatsApp billing sends personalized renewal links with direct UPI payment buttons 7 days, 3 days, and on the expiration date, eliminating manual phone calls and boosting on-time renewals by over 30%."
      },
      {
        question: "What is the average churn rate for Indian commercial gyms?",
        answer: "Without proactive member engagement software, traditional gyms suffer 40-50% annual member drop-off. Modern automation and attendance tracking bring this below 18%."
      }
    ],
    relatedSlugs: ["gym-management-software", "gym-whatsapp-automation"]
  },
  {
    id: "blog-2",
    title: "Why Modern Fitness Centers are Replacing Legacy Desktop Software with Cloud OS",
    slug: "gym-management-software",
    summary: "A breakdown of why legacy desktop gym software is holding your business back, and how modern cloud-native systems drive profit and multi-branch scalability.",
    content: `
## The Hidden Cost of Legacy Gym Software

For over a decade, gyms relied on offline desktop software tied to a single, dusty desktop computer at the reception desk. If the hard drive crashed, members' payment history and active plans were wiped out.

### The Cloud Advantage
With Repsi's cloud-native architecture:
1. **Multi-Branch Visibility**: Monitor gym revenue, active members, and staff check-ins across Chennai, Bangalore, and Mumbai from a single owner dashboard.
2. **Device Independence**: Manage member enrollments and check attendance from your iPhone, Android tablet, MacBook, or reception PC seamlessly.
3. **Automated Cloud Backups**: Enterprise-grade encryption and real-time database replication ensure zero data loss.
4. **Member Self-Service**: Members view their workout plans, diet logs, and payment receipts directly on their own mobile app.
    `,
    category: "Software & Tech",
    tags: ["Gym Management Software", "Cloud CRM", "Multi-Branch", "Gym Operating System"],
    featuredImage: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Karthik Subramanian",
      role: "Lead Product Architect",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop",
    },
    status: "published",
    publishDate: "2026-09-20",
    readTime: "5 min read",
    seoTitle: "Best Fitness Management Software for Modern Gyms & Studios | Repsi",
    seoDescription: "Compare cloud vs desktop gym management software. Discover how Repsi simplifies billing, attendance, member management, and multi-branch operations.",
    canonicalUrl: "https://repsi.app/blog/gym-management-software",
    views: 4180,
    faqs: [
      {
        question: "Can I manage multiple gym branches with Repsi?",
        answer: "Yes, Repsi provides central multi-branch management where owners can switch between locations, compare branch revenues, and share trainer schedules effortlessly."
      }
    ],
    relatedSlugs: ["how-to-increase-gym-membership", "gym-whatsapp-automation"]
  },
  {
    id: "blog-3",
    title: "How to Automate Gym Attendance and WhatsApp Billing: The Complete Playbook",
    slug: "gym-whatsapp-automation",
    summary: "Stop chasing late fees and manual registers. Learn how QR codes and automated WhatsApp triggers revolutionize day-to-day gym management.",
    content: `
## Why WhatsApp is the #1 Growth Channel for Fitness Businesses

In India and across emerging fitness markets, WhatsApp is where members communicate daily. Integrating your gym software with the official WhatsApp Business API transforms front-desk operations.

### Key WhatsApp Automations Built into Repsi:
- **Instant Welcome Kit**: When a new member joins, they receive their membership ID, locker rules, trainer assignment, and tax invoice instantly on WhatsApp.
- **Smart Renewal Reminders**: 3-tier automated alerts with zero human intervention required.
- **Attendance Celebration Milestones**: Celebrate a member's 50th or 100th gym check-in with an automated motivational badge on WhatsApp.
    `,
    category: "Automation",
    tags: ["WhatsApp Automation", "QR Attendance", "UPI Payments", "Billing"],
    featuredImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Repsi Editorial Team",
      role: "Growth Operations",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    },
    status: "published",
    publishDate: "2026-09-28",
    readTime: "4 min read",
    seoTitle: "Gym WhatsApp Automation & QR Attendance System | Repsi",
    seoDescription: "Step-by-step guide to setting up automated WhatsApp renewal reminders, invoice sharing, and QR attendance for your fitness club.",
    canonicalUrl: "https://repsi.app/blog/gym-whatsapp-automation",
    views: 2890,
    relatedSlugs: ["how-to-increase-gym-membership", "gym-management-software"]
  }
];

export const INITIAL_JOBS: JobPosting[] = [
  {
    id: "job-1",
    title: "Senior Full Stack Engineer (Next.js & Python)",
    slug: "senior-fullstack-engineer",
    department: "Engineering",
    location: "Bangalore, India (Hybrid)",
    employmentType: "Full-Time",
    experience: "4-7 years",
    salaryRange: "₹24,00,000 – ₹38,00,000 + ESOPs",
    status: "published",
    publishDate: "2026-09-10",
    description: "Join Repsi's core engineering team to architect high-throughput APIs, offline-first mobile sync protocols, and real-time attendance engines serving 500+ gyms across India.",
    responsibilities: [
      "Architect and scale core microservices using FastAPI, PostgreSQL, and Redis.",
      "Build high-performance, polished web interfaces in Next.js 15 and Tailwind CSS.",
      "Optimize real-time QR check-in latency to sub-200ms at peak hours.",
      "Work closely with our mobile team on offline sync data protocols for biometric devices."
    ],
    requirements: [
      "4+ years of production experience with Python/FastAPI and modern React/TypeScript.",
      "Deep understanding of relational databases, indexing, and transactional integrity (PostgreSQL).",
      "Experience with asynchronous queues, WebSockets, and payment gateway webhooks.",
      "Strong bias for action and passion for clean, self-documenting code."
    ],
    benefits: [
      "Competitive compensation + high-upside equity.",
      "Comprehensive health and accidental insurance for you and your family.",
      "Free premium gym membership reimbursement at any partner gym.",
      "Latest MacBook Pro and ergonomic home office budget."
    ]
  },
  {
    id: "job-2",
    title: "Product Marketing Manager — Fitness Industry",
    slug: "product-marketing-manager",
    department: "Marketing",
    location: "Mumbai / Remote, India",
    employmentType: "Full-Time",
    experience: "3-5 years",
    salaryRange: "₹16,00,000 – ₹26,00,000",
    status: "published",
    publishDate: "2026-09-18",
    description: "Shape the narrative of Repsi as the premier operating system for gyms, health clubs, and boutique studios across South Asia.",
    responsibilities: [
      "Design and execute product launch campaigns for new features (e.g. WhatsApp Marketing Hub, Trainer Portal).",
      "Produce high-ranking SEO topic clusters, case studies with top gym owners, and product walkthrough videos.",
      "Collaborate with our Partner Program team to produce co-marketing kits for gym consultants.",
      "Analyze conversion funnel metrics from landing pages to paid tier activation."
    ],
    requirements: [
      "3+ years experience in B2B SaaS product marketing or growth.",
      "Exceptional storytelling and copywriting skills with a deep understanding of fitness business owners.",
      "Proven track record of driving organic pipeline through SEO and community-led growth.",
      "Comfortable with analytics tools (PostHog, Google Search Console, Mixpanel)."
    ],
    benefits: [
      "Flexible remote work options.",
      "Annual learning and conference stipend.",
      "Gym & wellness allowance.",
      "High growth trajectory in a rapidly expanding SaaS category."
    ]
  },
  {
    id: "job-3",
    title: "Customer Success & Gym Onboarding Lead",
    slug: "customer-success-lead-india",
    department: "Customer Success",
    location: "Coimbatore / Bangalore (Onsite / Field)",
    employmentType: "Full-Time",
    experience: "2-4 years",
    salaryRange: "₹8,00,000 – ₹14,00,000 + Performance Bonus",
    status: "published",
    publishDate: "2026-09-25",
    description: "Be the trusted advisor to gym owners and managers during their transition from paper registers or legacy systems to Repsi.",
    responsibilities: [
      "Lead structured onboarding and data migration for new gym clients within 48 hours.",
      "Conduct in-person and video training sessions for gym receptionists and personal trainers.",
      "Identify upsell and multi-branch expansion opportunities with growing gym chains.",
      "Channel product feedback and pain points directly to the product engineering team."
    ],
    requirements: [
      "2+ years in SaaS onboarding, customer success, or gym club management.",
      "Fluent in English, Hindi, and regional languages (Tamil, Kannada, or Marathi is a strong plus).",
      "High empathy and outstanding problem-solving skills.",
      "Comfortable traveling locally to visit partner gyms and fitness clubs."
    ],
    benefits: [
      "Performance incentives based on retention and expansion.",
      "Full travel and fuel allowance for gym visits.",
      "Company-sponsored health insurance.",
      "Career progression into Operations and Growth management."
    ]
  }
];

export const INITIAL_PARTNERS: PartnerAccount[] = [
  {
    id: "partner-1",
    name: "Vikram Malhotra",
    company: "ABC Fitness Consulting",
    email: "vikram@abcfitnessconsulting.com",
    phone: "+91 98450 12345",
    partnerType: "Gym Consultant",
    referralCode: "ABC50",
    referralUrl: "https://repsi.app/?ref=ABC50",
    status: "active",
    tier: "Certified Partner",
    commissionRate: 20,
    clicks: 342,
    signups: 48,
    paidCustomers: 12,
    revenueGenerated: 152000,
    commissionEarned: 30447,
    pendingCommission: 8997,
    paidCommission: 21450,
    joinedAt: "2026-07-10",
    payoutUpiOrBank: "vikram@okaxis"
  },
  {
    id: "partner-2",
    name: "Rajesh Kulkarni",
    company: "FitEquipment India",
    email: "rajesh@fitequipment.in",
    phone: "+91 97312 88410",
    partnerType: "Fitness Equipment Dealer",
    referralCode: "EQUIP20",
    referralUrl: "https://repsi.app/?ref=EQUIP20",
    status: "active",
    tier: "Strategic Partner",
    commissionRate: 25,
    clicks: 580,
    signups: 64,
    paidCustomers: 19,
    revenueGenerated: 245000,
    commissionEarned: 61250,
    pendingCommission: 15250,
    paidCommission: 46000,
    joinedAt: "2026-06-15",
    payoutUpiOrBank: "rajesh.k@okhdfcbank"
  },
  {
    id: "partner-3",
    name: "Aarti Sharma",
    company: "FitInfluence Media",
    email: "aarti@fitinfluencemedia.com",
    phone: "+91 99880 33412",
    partnerType: "Fitness Influencer",
    referralCode: "AARTI20",
    referralUrl: "https://repsi.app/?ref=AARTI20",
    status: "pending",
    tier: "Standard Partner",
    commissionRate: 20,
    clicks: 0,
    signups: 0,
    paidCustomers: 0,
    revenueGenerated: 0,
    commissionEarned: 0,
    pendingCommission: 0,
    paidCommission: 0,
    joinedAt: "2026-10-01"
  }
];

export const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: "ref-1",
    partnerId: "partner-1",
    partnerCode: "ABC50",
    partnerName: "ABC Fitness Consulting",
    gymName: "IronHouse Fitness",
    customerEmail: "owner@ironhouse.in",
    planName: "Pro",
    planAmount: 9999,
    commissionAmount: 1999.8,
    status: "paid",
    signupDate: "2026-08-12",
    purchaseDate: "2026-08-14",
    orderId: "ORD_78912",
    payoutDate: "2026-09-01"
  },
  {
    id: "ref-2",
    partnerId: "partner-1",
    partnerCode: "ABC50",
    partnerName: "ABC Fitness Consulting",
    gymName: "FitZone Studio",
    customerEmail: "contact@fitzonestudio.com",
    planName: "Pro",
    planAmount: 9999,
    commissionAmount: 1999.8,
    status: "paid",
    signupDate: "2026-08-20",
    purchaseDate: "2026-08-21",
    orderId: "ORD_78945",
    payoutDate: "2026-09-01"
  },
  {
    id: "ref-3",
    partnerId: "partner-1",
    partnerCode: "ABC50",
    partnerName: "ABC Fitness Consulting",
    gymName: "Pulse Gym & Spa",
    customerEmail: "pulse@pulsefitness.in",
    planName: "Business",
    planAmount: 19999,
    commissionAmount: 3999.8,
    status: "payable",
    signupDate: "2026-09-02",
    purchaseDate: "2026-09-05",
    orderId: "ORD_79102"
  },
  {
    id: "ref-4",
    partnerId: "partner-1",
    partnerCode: "ABC50",
    partnerName: "ABC Fitness Consulting",
    gymName: "XYZ Gym",
    customerEmail: "xyz@xyzgym.com",
    planName: "Starter",
    planAmount: 4999,
    commissionAmount: 999.8,
    status: "pending",
    signupDate: "2026-09-28",
    purchaseDate: "2026-09-29",
    orderId: "ORD_79420"
  },
  {
    id: "ref-5",
    partnerId: "partner-2",
    partnerCode: "EQUIP20",
    partnerName: "FitEquipment India",
    gymName: "Titan Powerhouse",
    customerEmail: "titan@powerhouse.in",
    planName: "Business",
    planAmount: 19999,
    commissionAmount: 4999.75,
    status: "confirmed",
    signupDate: "2026-09-18",
    purchaseDate: "2026-09-20",
    orderId: "ORD_79250"
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Senior Full Stack Engineer (Next.js & Python)",
    applicantName: "Arun Krishnan",
    email: "arun.krishnan@devmail.com",
    phone: "+91 98840 55678",
    experienceYears: "5.5 years",
    portfolioUrl: "https://github.com/arunkrishnan",
    resumeFileName: "Arun_Krishnan_Resume.pdf",
    coverLetter: "I have built multi-tenant SaaS systems using FastAPI and Next.js and would love to contribute to Repsi's high-speed gym OS.",
    appliedAt: "2026-09-28",
    status: "interview",
    notes: "Passed tech screen. Strong system design and real-time WebSocket knowledge."
  },
  {
    id: "app-2",
    jobId: "job-2",
    jobTitle: "Product Marketing Manager — Fitness Industry",
    applicantName: "Sneha Sen",
    email: "sneha.sen@growthlead.com",
    phone: "+91 97112 34567",
    experienceYears: "4 years",
    portfolioUrl: "https://snehawrites.co",
    resumeFileName: "Sneha_Sen_Marketing_Resume.pdf",
    appliedAt: "2026-09-30",
    status: "screening",
    notes: "Previous experience at Cult.fit ecosystem partner. Reviewing portfolio."
  }
];

export const INITIAL_SETTINGS: CommissionSettings = {
  starterRate: 20,
  proRate: 20,
  businessRate: 20,
  commissionDuration: "first_payment",
  minPayoutThreshold: 1000,
  refundHoldDays: 14
};

// Storage Keys
const STORAGE_KEYS = {
  BLOGS: "repsi_cms_blogs",
  JOBS: "repsi_careers_jobs",
  APPLICATIONS: "repsi_job_applications",
  PARTNERS: "repsi_partner_accounts",
  REFERRALS: "repsi_partner_referrals",
  SETTINGS: "repsi_commission_settings",
  ATTRIBUTION: "repsi_ref_attribution"
};

// LocalStorage Helper functions
export function getStoredBlogs(): BlogPost[] {
  if (typeof window === "undefined") return INITIAL_BLOGS;
  const saved = localStorage.getItem(STORAGE_KEYS.BLOGS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(INITIAL_BLOGS));
    return INITIAL_BLOGS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_BLOGS;
  }
}

export function saveStoredBlogs(blogs: BlogPost[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
}

export function getStoredJobs(): JobPosting[] {
  if (typeof window === "undefined") return INITIAL_JOBS;
  const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
    return INITIAL_JOBS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_JOBS;
  }
}

export function saveStoredJobs(jobs: JobPosting[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
}

export function getStoredApplications(): JobApplication[] {
  if (typeof window === "undefined") return INITIAL_APPLICATIONS;
  const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

export function saveStoredApplications(apps: JobApplication[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
}

export function getStoredPartners(): PartnerAccount[] {
  if (typeof window === "undefined") return INITIAL_PARTNERS;
  const saved = localStorage.getItem(STORAGE_KEYS.PARTNERS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(INITIAL_PARTNERS));
    return INITIAL_PARTNERS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_PARTNERS;
  }
}

export function saveStoredPartners(partners: PartnerAccount[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));
}

export function getStoredReferrals(): ReferralRecord[] {
  if (typeof window === "undefined") return INITIAL_REFERRALS;
  const saved = localStorage.getItem(STORAGE_KEYS.REFERRALS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(INITIAL_REFERRALS));
    return INITIAL_REFERRALS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_REFERRALS;
  }
}

export function saveStoredReferrals(referrals: ReferralRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
}

export function getStoredSettings(): CommissionSettings {
  if (typeof window === "undefined") return INITIAL_SETTINGS;
  const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveStoredSettings(settings: CommissionSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Attribution Tracker (stores ?ref=CODE for 30 days)
export function setReferralAttribution(code: string): void {
  if (typeof window === "undefined" || !code) return;
  const payload = {
    code: code.toUpperCase().trim(),
    capturedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.ATTRIBUTION, JSON.stringify(payload));
  // Set cookie for server accessibility
  document.cookie = `repsi_ref=${payload.code}; path=/; max-age=2592000; SameSite=Lax`;
}

export function getReferralAttribution(): string | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    if (new Date(parsed.expiresAt) > new Date()) {
      return parsed.code;
    }
    localStorage.removeItem(STORAGE_KEYS.ATTRIBUTION);
    return null;
  } catch {
    return null;
  }
}
