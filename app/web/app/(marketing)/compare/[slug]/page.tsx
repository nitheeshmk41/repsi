import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { COMPARISON_DATA } from "@/lib/compare-data";
import { constructMetadata, getFaqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Check, X, ArrowRight, Scale, Sparkles, HelpCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(COMPARISON_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comp = COMPARISON_DATA[slug];

  if (!comp) {
    return constructMetadata({
      title: "Comparison Not Found",
      description: "The requested comparison page does not exist.",
    });
  }

  return constructMetadata({
    title: comp.title,
    description: comp.metaDescription,
    keywords: comp.keywords,
    path: `/compare/${slug}`,
  });
}

export default async function ComparisonDetailPage({ params }: Props) {
  const { slug } = await params;
  const comp = COMPARISON_DATA[slug];

  if (!comp) {
    notFound();
  }

  const faqSchema = getFaqSchema(comp.faq);

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
        name: "Compare",
        item: "https://repsi.app/compare",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: comp.h1,
        item: `https://repsi.app/compare/${slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <MarketingNav />

      <main className="flex-1 pt-24 pb-16">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-xs text-muted-foreground flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-muted-foreground">Compare</span>
            <span>/</span>
            <span className="text-foreground font-medium">{comp.h1}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Scale className="w-3.5 h-3.5" />
            Software Comparison
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-[1.1]">
            {comp.h1}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {comp.subtitle}
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-all gap-2 text-base"
            >
              Try Repsi Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Summary Card */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
            <h2 className="text-xl font-bold text-foreground mb-3">Overview</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              {comp.summary}
            </p>
          </div>
        </section>

        {/* Comparison Matrix Table */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Feature Breakdown Matrix
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 sm:p-5 text-sm font-semibold text-foreground">Feature</th>
                  <th className="p-4 sm:p-5 text-sm font-bold text-primary text-center">Repsi</th>
                  <th className="p-4 sm:p-5 text-sm font-semibold text-muted-foreground text-center">{comp.competitor}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comp.featuresMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 sm:p-5 text-sm font-medium text-foreground">
                      {item.feature}
                      {item.notes && (
                        <p className="text-xs text-muted-foreground font-normal mt-0.5">{item.notes}</p>
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      {typeof item.repsiHas === "boolean" ? (
                        item.repsiHas ? (
                          <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-rose-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">{item.repsiHas}</span>
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      {typeof item.competitorHas === "boolean" ? (
                        item.competitorHas ? (
                          <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-rose-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">{item.competitorHas}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Differences */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-6">
            Key Differences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comp.keyDifferences.map((diff, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-card border border-border shadow-xs">
                <h3 className="text-lg font-semibold text-foreground mb-2">{diff.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{diff.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        {comp.faq.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {comp.faq.map((item, idx) => (
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

        {/* Bottom CTA */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-primary text-primary-foreground text-center space-y-6 shadow-xl">
            <h2 className="text-3xl font-extrabold">Switch to Repsi Today</h2>
            <p className="text-primary-foreground/90 max-w-lg mx-auto text-sm sm:text-base">
              Experience modern, fast, and local gym management software built for growing fitness businesses.
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
