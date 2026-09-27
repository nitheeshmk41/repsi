import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { SOLUTIONS_DATA } from "@/lib/solutions-data";
import { constructMetadata, getFaqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, HelpCircle, Check } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SOLUTIONS_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = SOLUTIONS_DATA[slug];

  if (!solution) {
    return constructMetadata({
      title: "Solution Not Found",
      description: "The requested solution page does not exist.",
    });
  }

  return constructMetadata({
    title: solution.title,
    description: solution.metaDescription,
    keywords: solution.keywords,
    path: `/solutions/${slug}`,
  });
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const solution = SOLUTIONS_DATA[slug];

  if (!solution) {
    notFound();
  }

  const faqSchema = getFaqSchema(solution.faq);

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
        name: "Solutions",
        item: "https://repsi.app/#solutions",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: solution.badge,
        item: `https://repsi.app/solutions/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="min-h-screen bg-[#0E1511] text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-black">
        <MarketingNav />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
            {/* Background Glow Elements */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {/* Solution Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold mb-8 shadow-inner">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{solution.badge}</span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
                {solution.h1}
              </h1>
              <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
                {solution.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group"
                >
                  <span>Start Free 14-Day Trial</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/demo"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-base transition-all duration-200 flex items-center justify-center"
                >
                  Watch Demo
                </Link>
              </div>

              {/* Highlights Micro-bar */}
              <div className="mt-14 pt-8 border-t border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sub-second QR Check-ins</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp Automated Billing</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>UPI & Instant Settlement</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero Setup Fees</span>
                </div>
              </div>
            </div>
          </section>

          {/* Key Benefits Grid */}
          <section className="py-20 bg-[#121A15]/60 border-y border-zinc-800/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                  Why Leading Studios Choose Repsi
                </h2>
                <p className="text-zinc-400 text-base sm:text-lg">
                  Purpose-built features designed specifically for the unique workflows of your facility.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {solution.keyBenefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/40 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold mb-5 group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Included List */}
          <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800">
                <div className="text-center mb-10">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    Everything Included in This Solution
                  </h3>
                  <p className="text-zinc-400 text-sm sm:text-base">
                    No hidden add-ons. Full access to all tools from day one.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {solution.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-zinc-200">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          {solution.faq.length > 0 && (
            <section className="py-20 bg-[#121A15]/40 border-t border-zinc-800/60">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Frequently Asked Questions</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Got Questions? We&apos;ve Got Answers.
                  </h2>
                </div>

                <div className="space-y-4">
                  {solution.faq.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/90"
                    >
                      <h4 className="text-lg font-bold text-white mb-2">
                        {item.question}
                      </h4>
                      <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Bottom CTA Banner */}
          <section className="py-20 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-emerald-900/40 to-zinc-900 border border-emerald-500/30 relative">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
                  Ready to Transform Your Operations?
                </h2>
                <p className="text-zinc-300 max-w-xl mx-auto mb-8 text-base sm:text-lg">
                  Join hundreds of gym and studio owners who save 15+ hours weekly with Repsi.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base transition-all duration-200 shadow-xl shadow-emerald-500/30"
                >
                  <span>Start Free Trial Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <MarketingFooter />
      </div>
    </>
  );
}
