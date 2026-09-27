export interface SolutionDetail {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  badge: string;
  keywords: string[];
  keyBenefits: {
    title: string;
    description: string;
  }[];
  features: string[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export const SOLUTIONS_DATA: Record<string, SolutionDetail> = {
  yoga: {
    slug: "yoga",
    title: "Yoga Studio Management Software | Class Booking & Memberships | Repsi",
    metaDescription: "Streamline your yoga studio with effortless class pack scheduling, instant QR check-ins, automated WhatsApp renewal reminders, and instructor payouts.",
    h1: "The Modern Operating System for Yoga Studios",
    subtitle: "Deliver a calm, seamless member experience with easy class booking, recurring subscriptions, and zero front-desk friction.",
    badge: "For Yoga & Pilates Studios",
    keywords: ["yoga studio software", "yoga studio management", "yoga class booking software india", "pilates studio software"],
    keyBenefits: [
      {
        title: "Flexible Class Packs & Recurring Passes",
        description: "Sell multi-class packages, monthly drop-in passes, and auto-renewing unlimited yoga memberships effortlessly."
      },
      {
        title: "Contactless QR Check-ins",
        description: "Allow students to scan in smoothly with dynamic QR passes to avoid line-ups before class sessions."
      },
      {
        title: "Automated WhatsApp Class Reminders",
        description: "Reduce no-shows with automated WhatsApp session reminders, slot confirmations, and renewal alerts."
      },
      {
        title: "Instructor Rosters & Commission Splits",
        description: "Track instructor attendance, class headcount, and calculate instructor pay and commissions accurately."
      }
    ],
    features: [
      "Drop-in & Multi-Class Pack Billing",
      "Automated WhatsApp Payment & Renewal Alerts",
      "Instructor Schedule & Roster Management",
      "Instant Dynamic QR Check-in",
      "UPI & Instant Payment Gateway",
      "Real-time Studio Capacity & Attendance Tracking"
    ],
    faq: [
      {
        question: "Can I manage single drop-ins and monthly yoga passes together?",
        answer: "Yes! Repsi allows you to create custom membership tiers, single drop-in passes, 10-class punch cards, and auto-renewing monthly or annual packages."
      },
      {
        question: "How do students check into yoga classes?",
        answer: "Students can scan the entrance QR code using their member portal or present their personal digital QR pass for rapid verification."
      },
      {
        question: "Can we collect UPI payments with automated GST invoices?",
        answer: "Absolutely. Repsi integrates with UPI and Indian payment gateways, automatically generating GST-compliant invoices and receipts on WhatsApp."
      }
    ]
  },
  "yoga-studios": {
    slug: "yoga-studios",
    title: "Yoga Studio Management Software | Class Booking & Memberships | Repsi",
    metaDescription: "Streamline your yoga studio with effortless class pack scheduling, instant QR check-ins, automated WhatsApp renewal reminders, and instructor payouts.",
    h1: "The Modern Operating System for Yoga Studios",
    subtitle: "Deliver a calm, seamless member experience with easy class booking, recurring subscriptions, and zero front-desk friction.",
    badge: "For Yoga & Pilates Studios",
    keywords: ["yoga studio software", "yoga studio management", "yoga class booking software india", "pilates studio software"],
    keyBenefits: [
      {
        title: "Flexible Class Packs & Recurring Passes",
        description: "Sell multi-class packages, monthly drop-in passes, and auto-renewing unlimited yoga memberships effortlessly."
      },
      {
        title: "Contactless QR Check-ins",
        description: "Allow students to scan in smoothly with dynamic QR passes to avoid line-ups before class sessions."
      },
      {
        title: "Automated WhatsApp Class Reminders",
        description: "Reduce no-shows with automated WhatsApp session reminders, slot confirmations, and renewal alerts."
      },
      {
        title: "Instructor Rosters & Commission Splits",
        description: "Track instructor attendance, class headcount, and calculate instructor pay and commissions accurately."
      }
    ],
    features: [
      "Drop-in & Multi-Class Pack Billing",
      "Automated WhatsApp Payment & Renewal Alerts",
      "Instructor Schedule & Roster Management",
      "Instant Dynamic QR Check-in",
      "UPI & Instant Payment Gateway",
      "Real-time Studio Capacity & Attendance Tracking"
    ],
    faq: [
      {
        question: "Can I manage single drop-ins and monthly yoga passes together?",
        answer: "Yes! Repsi allows you to create custom membership tiers, single drop-in passes, 10-class punch cards, and auto-renewing monthly or annual packages."
      },
      {
        question: "How do students check into yoga classes?",
        answer: "Students can scan the entrance QR code using their member portal or present their personal digital QR pass for rapid verification."
      }
    ]
  },
  pools: {
    slug: "pools",
    title: "Swimming Pool Management Software | Membership & Slot Booking | Repsi",
    metaDescription: "Manage public pools, swimming clubs, coaching academies, and aquatic centers with lane booking, visitor passes, and automated membership renewals.",
    h1: "Smart Operating System for Swimming Pools & Aquatic Centers",
    subtitle: "Control pool lane capacity, track coach sessions, automate swimmer renewals, and streamline gate check-ins with QR technology.",
    badge: "For Swimming Pools & Aquatic Clubs",
    keywords: ["swimming pool management software", "pool membership software", "aquatic center software india", "swimming academy software"],
    keyBenefits: [
      {
        title: "Batch & Slot Capacity Limits",
        description: "Prevent overcrowding by scheduling defined time slots with automatic capacity caps per session."
      },
      {
        title: "Turnstile & Gate QR Check-ins",
        description: "Enforce fast, turnstile-friendly entry with dynamic QR passes that instantly verify active memberships."
      },
      {
        title: "Coaching Batches & Trainer Tracking",
        description: "Organize beginner to advanced swimming batches, track coach assignments, and monitor student progress."
      },
      {
        title: "Automated WhatsApp Dues & Passes",
        description: "Send instant payment links, digital pool ID passes, and renewal notices directly to swimmers and parents."
      }
    ],
    features: [
      "Batch & Timed Slot Booking",
      "Turnstile & QR Access Control",
      "Coach & Batch Scheduling",
      "Daily Guest & Monthly Member Passes",
      "UPI Payment Collection with Instant Invoicing",
      "Real-time Capacity & Attendance Dashboard"
    ],
    faq: [
      {
        question: "Can Repsi manage hourly slots and coaching batches simultaneously?",
        answer: "Yes. You can configure separate schedules for general member lane swimming, public hourly slots, and dedicated coaching batches."
      },
      {
        question: "Can we restrict gate entry to only members with active valid plans?",
        answer: "Yes, the Repsi QR scanner instantly flags expired memberships, overdue balances, or invalid time slots upon scan."
      }
    ]
  },
  "swimming-pools": {
    slug: "swimming-pools",
    title: "Swimming Pool Management Software | Membership & Slot Booking | Repsi",
    metaDescription: "Manage public pools, swimming clubs, coaching academies, and aquatic centers with lane booking, visitor passes, and automated membership renewals.",
    h1: "Smart Operating System for Swimming Pools & Aquatic Centers",
    subtitle: "Control pool lane capacity, track coach sessions, automate swimmer renewals, and streamline gate check-ins with QR technology.",
    badge: "For Swimming Pools & Aquatic Clubs",
    keywords: ["swimming pool management software", "pool membership software", "aquatic center software india", "swimming academy software"],
    keyBenefits: [
      {
        title: "Batch & Slot Capacity Limits",
        description: "Prevent overcrowding by scheduling defined time slots with automatic capacity caps per session."
      },
      {
        title: "Turnstile & Gate QR Check-ins",
        description: "Enforce fast, turnstile-friendly entry with dynamic QR passes that instantly verify active memberships."
      },
      {
        title: "Coaching Batches & Trainer Tracking",
        description: "Organize beginner to advanced swimming batches, track coach assignments, and monitor student progress."
      },
      {
        title: "Automated WhatsApp Dues & Passes",
        description: "Send instant payment links, digital pool ID passes, and renewal notices directly to swimmers and parents."
      }
    ],
    features: [
      "Batch & Timed Slot Booking",
      "Turnstile & QR Access Control",
      "Coach & Batch Scheduling",
      "Daily Guest & Monthly Member Passes",
      "UPI Payment Collection with Instant Invoicing",
      "Real-time Capacity & Attendance Dashboard"
    ],
    faq: [
      {
        question: "Can Repsi manage hourly slots and coaching batches simultaneously?",
        answer: "Yes. You can configure separate schedules for general member lane swimming, public hourly slots, and dedicated coaching batches."
      }
    ]
  },
  gyms: {
    slug: "gyms",
    title: "Gym Management Software for Commercial Gyms | Repsi",
    metaDescription: "The all-in-one platform built specifically to handle the scale, billing, trainer management, and member experience of modern gyms.",
    h1: "Built for Modern Commercial Gyms",
    subtitle: "Scale your fitness business with automated billing, WhatsApp retention workflows, trainer scheduling, and sub-second attendance.",
    badge: "For Commercial Gyms",
    keywords: ["commercial gym management software", "gym operating system", "gym software india"],
    keyBenefits: [
      {
        title: "Automated WhatsApp Billing & Renewals",
        description: "Collect dues on time with 1-click UPI links and automated reminders sent straight to WhatsApp."
      },
      {
        title: "High-Speed Turnstile & QR Attendance",
        description: "Sub-second member verification with turnstile support and digital QR passes."
      },
      {
        title: "Trainer Payouts & Client Allocation",
        description: "Assign PT clients, track trainer attendance, and calculate commission splits automatically."
      },
      {
        title: "Integrated Website & Lead Pipeline",
        description: "Convert online visitors into paying members with a free SEO-optimized gym website."
      }
    ],
    features: [
      "Unlimited Member Roster & Subscriptions",
      "Automated WhatsApp Payment & Renewal Alerts",
      "Trainer & Personal Training Management",
      "Turnstile & QR Attendance Engine",
      "Integrated Website Builder & Lead Capture",
      "Financial Analytics, GST Reports & Cashflow Metrics"
    ],
    faq: [
      {
        question: "Can I migrate member data from my old gym software?",
        answer: "Yes! Repsi provides 1-click CSV roster import so you can transfer your member lists, active dates, and balances in seconds."
      }
    ]
  },
  studios: {
    slug: "studios",
    title: "Fitness Studio Management Software | Repsi",
    metaDescription: "The perfect operating system for boutique studios, functional training, Pilates, and group fitness centers.",
    h1: "Designed for High-Energy Fitness Studios",
    subtitle: "Deliver memorable workout experiences with effortless class booking, spot reservations, instructor tracking, and automated memberships.",
    badge: "For Boutique & Fitness Studios",
    keywords: ["fitness studio management software", "boutique fitness software", "studio booking system"],
    keyBenefits: [
      {
        title: "Class Scheduling & Waitlists",
        description: "Run group fitness, spin, HIIT, and functional training sessions with automatic waitlist management."
      },
      {
        title: "Digital Passes & QR Check-ins",
        description: "Eliminate front desk queues with quick mobile check-ins before every session."
      },
      {
        title: "Instructor Performance & Attendance",
        description: "Track coach hours, class fill rates, and student feedback."
      },
      {
        title: "Recurring Memberships & Class Bundles",
        description: "Sell monthly auto-pay passes or flexible session credits that deduct automatically per visit."
      }
    ],
    features: [
      "Group Class Scheduling & Waitlist System",
      "Class Pack & Monthly Membership Billing",
      "Trainer Shift Rostering & Payouts",
      "Instant WhatsApp Session Confirmations",
      "Real-time Studio Fill Rate Analytics",
      "Member Mobile Portal & Digital Pass"
    ],
    faq: [
      {
        question: "How do class credit packs work in Repsi?",
        answer: "When a member books or attends a class, credits are automatically deducted from their package, with WhatsApp notifications showing remaining credits."
      }
    ]
  },
  "fitness-studios": {
    slug: "fitness-studios",
    title: "Fitness Studio Management Software | Repsi",
    metaDescription: "The perfect operating system for boutique studios, functional training, Pilates, and group fitness centers.",
    h1: "Designed for High-Energy Fitness Studios",
    subtitle: "Deliver memorable workout experiences with effortless class booking, spot reservations, instructor tracking, and automated memberships.",
    badge: "For Boutique & Fitness Studios",
    keywords: ["fitness studio management software", "boutique fitness software", "studio booking system"],
    keyBenefits: [
      {
        title: "Class Scheduling & Waitlists",
        description: "Run group fitness, spin, HIIT, and functional training sessions with automatic waitlist management."
      },
      {
        title: "Digital Passes & QR Check-ins",
        description: "Eliminate front desk queues with quick mobile check-ins before every session."
      }
    ],
    features: [
      "Group Class Scheduling & Waitlist System",
      "Class Pack & Monthly Membership Billing",
      "Trainer Shift Rostering & Payouts",
      "Instant WhatsApp Session Confirmations"
    ],
    faq: [
      {
        question: "How do class credit packs work in Repsi?",
        answer: "When a member books or attends a class, credits are automatically deducted from their package, with WhatsApp notifications showing remaining credits."
      }
    ]
  },
  "personal-trainers": {
    slug: "personal-trainers",
    title: "Software for Personal Trainers & Coaches | Repsi",
    metaDescription: "Empower your trainers and freelance fitness coaches with client workout tracking, diet planning, PT session logs, and automated payouts.",
    h1: "Built for Personal Trainers & Fitness Coaches",
    subtitle: "Supercharge client results with interactive workout builders, diet templates, session check-ins, and clear earnings tracking.",
    badge: "For Trainers & Coaches",
    keywords: ["personal trainer software", "fitness coach management app", "client workout builder"],
    keyBenefits: [
      {
        title: "Custom Workout & Diet Builders",
        description: "Assign personalized exercise routines and customized nutritional plans directly to clients' mobile portals."
      },
      {
        title: "PT Session Logging & Validation",
        description: "Log completed 1-on-1 personal training sessions with instant client sign-off and remaining session tallies."
      },
      {
        title: "Client Progress & Body Measurement Logs",
        description: "Track weight changes, body fat percentage, measurements, and progress photos over time."
      },
      {
        title: "Transparent Commission Tracking",
        description: "Give trainers real-time visibility into their earned commissions, active PT clients, and pending payouts."
      }
    ],
    features: [
      "Digital Workout & Exercise Library",
      "Macro & Diet Template Assignment",
      "1-on-1 PT Session Check-in Tracker",
      "Client Progress & Metric Graphs",
      "Automated Trainer Commission Breakdown",
      "Trainer Mobile App Access"
    ],
    faq: [
      {
        question: "Can trainers view only their assigned clients?",
        answer: "Yes, Repsi enforces strict role permissions where trainers only see their assigned clients, schedules, and individual performance metrics."
      }
    ]
  },
  crossfit: {
    slug: "crossfit",
    title: "CrossFit Box & Functional Fitness Software | Repsi",
    metaDescription: "Manage your CrossFit affiliate or functional training box with WOD programming, class bookings, QR attendance, and automated member billing.",
    h1: "Engineered for CrossFit & Functional Fitness Boxes",
    subtitle: "Program workouts, manage high-intensity group classes, track athlete PRs, and automate membership fees with ease.",
    badge: "For CrossFit Boxes",
    keywords: ["crossfit software", "functional fitness box software", "wod management software"],
    keyBenefits: [
      {
        title: "WOD Programming & Workout Sharing",
        description: "Publish the Workout of the Day directly to athletes' mobile apps with exercise scaling options."
      },
      {
        title: "Capacity-Controlled Class Bookings",
        description: "Manage athlete caps per class so every participant has adequate rack and barbell space."
      },
      {
        title: "Athlete Attendance & Leaderboards",
        description: "Fast QR code check-in with attendance history and session completion stats."
      },
      {
        title: "Automated Monthly & Annual Subscriptions",
        description: "Collect membership dues reliably via UPI and recurring payment reminders on WhatsApp."
      }
    ],
    features: [
      "WOD & Workout Programming Tools",
      "Class Reservation & Slot Cap Engine",
      "Rapid QR Entrance Verification",
      "Automated WhatsApp Invoicing & Dues",
      "Coach & Shift Management",
      "Performance & Attendance Insights"
    ],
    faq: [
      {
        question: "Can members reserve their spots for CrossFit sessions in advance?",
        answer: "Yes, athletes can book class slots from their mobile member portal to guarantee their spot."
      }
    ]
  },
  "multi-branch-gyms": {
    slug: "multi-branch-gyms",
    title: "Multi-Location Gym & Franchise Management Software | Repsi",
    metaDescription: "Oversee multi-branch gyms and fitness franchises from a single unified master dashboard with centralized analytics, cross-branch access, and staff controls.",
    h1: "Enterprise Control for Multi-Branch Gym Chains",
    subtitle: "Manage 2 to 100+ fitness branches with multi-location reporting, cross-branch member access, role-based staff permissions, and central financial governance.",
    badge: "For Gym Chains & Franchises",
    keywords: ["multi branch gym software", "gym franchise management software", "enterprise gym management system"],
    keyBenefits: [
      {
        title: "Centralized Multi-Location Dashboard",
        description: "View aggregate revenue, active member totals, and cross-branch performance from a single executive console."
      },
      {
        title: "Cross-Branch Roaming Access",
        description: "Enable members to check into any branch across your chain using their universal digital QR pass."
      },
      {
        title: "Granular Role & Branch Permissions",
        description: "Restrict branch managers and trainers to their designated location while executives maintain full oversight."
      },
      {
        title: "Consolidated Financial Reports",
        description: "Export unified GST reports, branch-wise revenue comparisons, and staff commission statements in one click."
      }
    ],
    features: [
      "Master Executive Dashboard & Branch Switching",
      "Cross-Location Dynamic QR Check-ins",
      "Role-Based Branch Access Control",
      "Consolidated Multi-Unit Financial Reports",
      "Chain-Wide Member CRM & Marketing",
      "Universal Trainer & Staff Roster Management"
    ],
    faq: [
      {
        question: "Can an owner switch between branches without logging in again?",
        answer: "Yes! Repsi includes an instant workspace switcher allowing owners and managers to jump between branches in one click."
      }
    ]
  }
};
