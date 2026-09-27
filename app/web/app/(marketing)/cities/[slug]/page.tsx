import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CITY_DATA } from "@/lib/city-data";
import { constructMetadata, getFaqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MapPin, ArrowRight, CheckCircle2, Building2, HelpCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CITY_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cityInfo = CITY_DATA[slug];

  if (!cityInfo) {
    return constructMetadata({
      title: "City Page Not Found",
      description: "The requested city page does not exist.",
    });
  }

  return constructMetadata({
    title: cityInfo.title,
    description: cityInfo.metaDescription,
    keywords: cityInfo.keywords,
    path: `/cities/${slug}`,
  });
}

export default async function CityDetailPage({ params }: Props) {
  const { slug } = await params;
  const cityInfo = CITY_DATA[slug];

  if (!cityInfo) {
    notFound();
  }

  const faqSchema = getFaqSchema(cityInfo.faq);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Repsi Gym Software ${cityInfo.city}`,
    areaServed: {
      "@type": "City",
      name: cityInfo.city,
      containedIn: cityInfo.state,
    },
    description: cityInfo.metaDescription,
    applicationCategory: "BusinessApplication",
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <JsonLd data={faqSchema} />
      <JsonLd data={localBusinessSchema} />
      <MarketingNav />

      <main className="flex-1 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-xs text-muted-foreground flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/gym-management-software-india" className="hover:text-primary transition-colors">India</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{cityInfo.city}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <MapPin className="w-3.5 h-3.5" />
            {cityInfo.city}, {cityInfo.state}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-[1.1]">
            {cityInfo.h1}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {cityInfo.subtitle}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-all gap-2 text-base"
            >
              Start Free Trial in {cityInfo.city}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Local Market Context */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-8 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Tailored for Gym Owners in {cityInfo.city}
              </h2>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed">
              {cityInfo.localContext}
            </p>
          </div>
        </section>

        {/* Popular Local Features */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Popular Features in {cityInfo.city}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cityInfo.popularFeatures.map((feature, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-card border border-border flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-base font-semibold text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        {cityInfo.faq.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Frequently Asked Questions ({cityInfo.city})
            </h2>
            <div className="space-y-4">
              {cityInfo.faq.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-card border border-border">
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

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-primary text-primary-foreground text-center space-y-6 shadow-xl">
            <h2 className="text-3xl font-extrabold">Grow your {cityInfo.city} gym with Repsi</h2>
            <p className="text-primary-foreground/90 max-w-lg mx-auto text-base">
              Set up your gym profile in 2 minutes with local UPI collection, QR attendance, and automated WhatsApp billing.
            </p>
            <div className="flex justify-center">
              <Link
                href="/register"
                className="px-8 py-3.5 rounded-xl bg-background text-foreground font-bold hover:bg-accent transition-all text-base shadow-md"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
