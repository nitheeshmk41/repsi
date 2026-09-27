import Link from "next/link";
import type { Metadata } from "next";
import { constructMetadata, getFaqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { CheckCircle2, ArrowRight, ShieldCheck, QrCode, CreditCard, MessageSquare } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Gym Management Software India | UPI Payments & WhatsApp Billing | Repsi",
  description:
    "The #1 Gym Management Software in India. Built for gyms, fitness studios, swimming pools, and CrossFit centers with direct UPI billing, WhatsApp reminders, and QR code attendance.",
  keywords: [
    "gym management software India",
    "gym billing software India",
    "gym software UPI payments",
    "gym management software with WhatsApp",
    "gym attendance app India",
  ],
  path: "/gym-management-software-india",
});

const faqs = [
  {
    question: "Why is Repsi the best gym management software in India?",
    answer:
      "Repsi is built specifically for Indian gym owners with direct UPI/Cashfree payment links, auto WhatsApp reminders, GST-compliant invoicing, fast QR code attendance, and INR pricing with zero hidden fees.",
  },
  {
    question: "Does Repsi issue GST invoices for gym memberships?",
    answer:
      "Yes! Repsi allows you to configure your business GSTIN, automatic CGST/SGST tax split, and send instant PDF receipts to members via WhatsApp.",
  },
];

export default function IndiaGymSoftwarePage() {
  const faqSchema = getFaqSchema(faqs);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <JsonLd data={faqSchema} />
      <MarketingNav />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            🇮🇳 Built Specifically for India
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Gym Management Software for India
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Automate your gym with instant UPI payments, automated WhatsApp billing reminders, QR attendance, and GST compliant invoicing.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-all gap-2 text-base"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">UPI & Cashfree Integration</h2>
            <p className="text-sm text-muted-foreground">
              Collect gym membership fees instantly via Google Pay, PhonePe, Paytm, BHIM UPI, and credit cards with zero manual reconciliation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Automated WhatsApp Billing</h2>
            <p className="text-sm text-muted-foreground">
              Send payment receipts, membership renewal links, and birthday wishes directly to member WhatsApp inbox with 99% open rates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Contactless QR Attendance</h2>
            <p className="text-sm text-muted-foreground">
              High-speed member check-in using smartphone QR codes. No biometric hardware failure, zero front desk queues.
            </p>
          </div>
        </section>

        {/* Major Cities Directory */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Repsi for Gyms Across Major Indian Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/cities/gym-management-software-coimbatore"
              className="p-4 rounded-xl bg-card border border-border text-center hover:border-primary transition-all font-semibold text-foreground text-sm"
            >
              Coimbatore
            </Link>
            <Link
              href="/cities/gym-management-software-chennai"
              className="p-4 rounded-xl bg-card border border-border text-center hover:border-primary transition-all font-semibold text-foreground text-sm"
            >
              Chennai
            </Link>
            <Link
              href="/cities/gym-management-software-bangalore"
              className="p-4 rounded-xl bg-card border border-border text-center hover:border-primary transition-all font-semibold text-foreground text-sm"
            >
              Bangalore
            </Link>
            <Link
              href="/cities/gym-management-software-mumbai"
              className="p-4 rounded-xl bg-card border border-border text-center hover:border-primary transition-all font-semibold text-foreground text-sm"
            >
              Mumbai
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
