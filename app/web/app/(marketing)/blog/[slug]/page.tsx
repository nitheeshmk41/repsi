"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Bookmark,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Tag
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { getStoredBlogs, BlogPost } from "@/lib/content-growth-store";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const list = getStoredBlogs();
    setAllBlogs(list);
    const found = list.find((b) => b.slug === slug);
    if (found) {
      setPost(found);
    }
  }, [slug]);

  if (!post && allBlogs.length > 0) {
    // If not found in loaded blogs
    const found = allBlogs.find((b) => b.slug === slug);
    if (!found) {
      return (
        <div className="min-h-screen bg-[#070D09] text-zinc-100 flex flex-col justify-between">
          <MarketingNav />
          <div className="text-center py-40 px-4">
            <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
            <p className="text-zinc-400 mb-6">The blog post you're looking for might have been moved or unpublished.</p>
            <Link
              href="/blog"
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500"
            >
              ← Back to Blog Hub
            </Link>
          </div>
          <MarketingFooter />
        </div>
      );
    }
  }

  const currentPost = post || allBlogs.find((b) => b.slug === slug) || getStoredBlogs()[0];

  const relatedPosts = allBlogs.filter(
    (b) => b.id !== currentPost.id && (currentPost.relatedSlugs?.includes(b.slug) || b.category === currentPost.category)
  ).slice(0, 3);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Structured Schema data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: currentPost.title,
    description: currentPost.seoDescription || currentPost.summary,
    image: currentPost.featuredImage,
    datePublished: currentPost.publishDate,
    dateModified: currentPost.publishDate,
    author: {
      "@type": "Person",
      name: currentPost.author.name,
      jobTitle: currentPost.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Repsi",
      logo: {
        "@type": "ImageObject",
        url: "https://repsi.app/icon.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentPost.canonicalUrl || `https://repsi.app/blog/${currentPost.slug}`,
    },
  };

  const faqSchema = currentPost.faqs && currentPost.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: currentPost.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <div className="min-h-screen bg-[#070D09] text-zinc-100 font-sans antialiased flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <MarketingNav />

      {/* Breadcrumbs & Header */}
      <section className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-5">
          {/* Breadcrumb row */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-300 truncate max-w-xs">{currentPost.category}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase">
              {currentPost.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {currentPost.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {currentPost.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            {currentPost.summary}
          </p>

          {/* Author & Share Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
                <img
                  src={currentPost.author.avatar}
                  alt={currentPost.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-100">{currentPost.author.name}</div>
                <div className="text-xs text-zinc-400 flex items-center gap-2">
                  <span>{currentPost.author.role}</span>
                  <span>•</span>
                  <span>Published {currentPost.publishDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 border border-zinc-700 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? "Link Copied!" : "Share"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Banner Image */}
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl h-[300px] sm:h-[420px] relative">
          <img
            src={currentPost.featuredImage}
            alt={currentPost.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <article className="prose prose-invert prose-emerald max-w-none space-y-6 text-zinc-300 leading-relaxed text-base sm:text-lg">
          {currentPost.content.split("\n\n").map((block, idx) => {
            const trimmed = block.trim();
            if (trimmed.startsWith("## ")) {
              return (
                <h2 key={idx} className="text-2xl sm:text-3xl font-bold text-white pt-4 pb-2 border-b border-zinc-800">
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }
            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={idx} className="text-xl sm:text-2xl font-semibold text-emerald-300 pt-3">
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }
            if (trimmed.startsWith("- ")) {
              const items = trimmed.split("\n").map((li) => li.replace(/^- /, ""));
              return (
                <ul key={idx} className="list-disc list-inside space-y-1.5 text-zinc-300 pl-2">
                  {items.map((item, i) => (
                    <li key={i} className="text-sm sm:text-base">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </article>

        {/* Tags */}
        <div className="pt-6 border-t border-zinc-800 flex items-center flex-wrap gap-2">
          <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mr-2">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            Topic Tags:
          </span>
          {currentPost.tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* FAQs Section if provided */}
        {currentPost.faqs && currentPost.faqs.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-zinc-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <span>Frequently Asked Questions</span>
            </h3>
            <div className="space-y-3">
              {currentPost.faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="border border-zinc-800 rounded-xl bg-zinc-900/60 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-zinc-200 hover:text-emerald-300 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <span className="text-emerald-400 text-lg font-mono">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 bg-zinc-950/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Mid-Article Repsi Showcase Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/70 via-zinc-900 to-zinc-950 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Repsi All-In-One Fitness OS</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold text-white">
            Transform Your Fitness Business With Zero Complexity
          </h4>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
            Join top gyms, studios, and swimming facilities running check-ins, automated WhatsApp billing, and trainer apps on Repsi.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/partners"
              className="text-xs font-semibold text-zinc-300 hover:text-emerald-400 underline underline-offset-4"
            >
              Become a Repsi Partner →
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-zinc-800">
            <h3 className="text-xl font-bold text-white">Related In This Topic Cluster</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPosts.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-emerald-500/40 transition-all block space-y-2.5"
                >
                  <div className="h-32 rounded-lg overflow-hidden relative">
                    <img
                      src={r.featuredImage}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                    {r.category}
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-emerald-300 line-clamp-2">
                    {r.title}
                  </h5>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <MarketingFooter />
    </div>
  );
}
