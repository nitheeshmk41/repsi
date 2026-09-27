import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { FEATURES_DATA } from "@/lib/features-data";
import { constructMetadata, getFaqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(FEATURES_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const feature = FEATURES_DATA[slug];

  if (!feature) {
    return constructMetadata({
      title: "Feature Not Found",
      description: "The requested feature page does not exist.",
    });
  }

  return constructMetadata({
    title: feature.title,
    description: feature.metaDescription,
    keywords: feature.keywords,
    path: `/features/${slug}`,
  });
}

export default async function FeatureDetailPage({ params }: Props) {
  const { slug } = await params;
  const feature = FEATURES_DATA[slug];

  if (!feature) {
    notFound();
  }

  const faqSchema = getFaqSchema(feature.faq);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://repsi.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Features",
        item: "https://repsi.app/features",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: feature.h1,
        item: `https://repsi.app/features/${slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <MarketingNav />

      <main className="flex-1 pt-24 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-xs text-muted-foreground flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{feature.h1}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Product Feature
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-[1.1]">
            {feature.h1}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal">
            {feature.subtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-all gap-2 text-base"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-border bg-card hover:bg-accent font-semibold transition-all text-base"
            >
              Book 1-on-1 Demo
            </Link>
          </div>
        </section>

        {/* Deep Dive Sections */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {feature.sections.map((section, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {section.h2}
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {section.description}
                </p>
                <ul className="space-y-2.5 pt-2">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-foreground/90">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-5">
                <div className="p-6 rounded-2xl bg-card border border-border shadow-md space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <ShieldCheck className="w-4 h-4" /> Built for Scale
                  </div>
                  <div className="p-4 rounded-xl bg-muted/60 text-xs text-muted-foreground font-mono">
                    // Operational Efficiency Matrix<br />
                    Module: {feature.slug}<br />
                    Status: Active & GST Ready
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* FAQ Section */}
        {feature.faq.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                Everything you need to know about {feature.h1}
              </p>
            </div>
            <div className="space-y-6">
              {feature.faq.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-card border border-border shadow-xs">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed pl-6">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-primary text-primary-foreground text-center space-y-6 shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start managing your gym with Repsi today
            </h2>
            <p className="text-primary-foreground/90 max-w-xl mx-auto text-base">
              Join hundreds of gym owners across India automating member management, QR attendance, and UPI billing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-background text-foreground font-bold hover:bg-accent transition-all text-base shadow-md"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
