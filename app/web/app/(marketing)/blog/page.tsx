"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, ArrowRight, BookOpen, Sparkles, Tag, ChevronRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { FadeIn } from "@/components/ui/fade-in";
import { getStoredBlogs, BlogPost } from "@/lib/content-growth-store";

const TOPIC_CLUSTERS = [
  "All Topics",
  "Gym Management Software",
  "Gym Growth",
  "WhatsApp Automation",
  "Software & Tech",
  "Automation",
  "Member Retention"
];

export default function BlogIndexPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const list = getStoredBlogs().filter((b) => b.status === "published");
    setBlogs(list);
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((post) => {
      const matchCategory =
        selectedCategory === "All Topics" ||
        post.category.toLowerCase() === selectedCategory.toLowerCase() ||
        post.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()));
      
      const matchSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const featuredPost = blogs[0];
  const remainingPosts = selectedCategory === "All Topics" && !searchQuery
    ? filteredBlogs.slice(1)
    : filteredBlogs;

  return (
    <div className="min-h-screen bg-[#070D09] text-zinc-100 font-sans antialiased flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      <MarketingNav />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto text-center space-y-4">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gym Business & Tech Insights</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">Repsi Blog</span> for Fitness Leaders
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto pt-2">
              Data-backed growth strategies, WhatsApp automation playbooks, and modern software tactics to scale your gym profitably.
            </p>
          </FadeIn>

          {/* Search bar */}
          <div className="pt-6 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topic clusters: WhatsApp, Retention, Software, UPI..."
                className="w-full h-12 pl-11 pr-4 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 shadow-lg shadow-black/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300 px-1.5 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Topic Cluster Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-4">
            {TOPIC_CLUSTERS.map((topic) => {
              const active = selectedCategory.toLowerCase() === topic.toLowerCase();
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedCategory(topic)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "bg-zinc-900/80 text-zinc-400 border border-zinc-800/80 hover:bg-zinc-800/80 hover:text-zinc-200"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Featured Post (Only show on default filter) */}
        {selectedCategory === "All Topics" && !searchQuery && featuredPost && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Featured Publication</span>
            </div>

            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block relative rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 overflow-hidden hover:border-emerald-500/40 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {featuredPost.title}
                  </h2>

                  <p className="text-sm sm:text-base text-zinc-400 line-clamp-3 leading-relaxed">
                    {featuredPost.summary}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-zinc-800/80">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
                        <img
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-200">{featuredPost.author.name}</div>
                        <div className="text-[11px] text-zinc-500">{featuredPost.publishDate}</div>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 h-64 sm:h-80 lg:h-full relative overflow-hidden">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-zinc-950 via-zinc-950/20 to-transparent" />
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>Articles & Guides ({filteredBlogs.length})</span>
            </h3>
            <span className="text-xs text-zinc-500">Updated weekly</span>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 p-8">
              <p className="text-zinc-400 text-sm">No articles matched your filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All Topics");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-900 hover:border-emerald-500/40 transition-all duration-200 overflow-hidden shadow-lg hover:shadow-emerald-500/5"
                >
                  <div className="h-48 w-full relative overflow-hidden bg-zinc-800">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-emerald-300 border border-white/10 text-[11px] font-bold">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                        <span>{post.publishDate}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {post.readTime}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-emerald-500/70" />
                        <span className="text-[11px] text-zinc-400">{post.tags[0]}</span>
                      </div>
                      <span className="text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA Growth Box */}
        <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-zinc-950 p-8 sm:p-10 relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              Supercharge Your Gym Operations
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to automate attendance, billing, and member renewals?
            </h3>
            <p className="text-sm text-zinc-400">
              Join 500+ top fitness centers across India already running on Repsi. Set up your club in under 5 minutes.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>Start with Repsi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-all"
              >
                <span>Join Partner Program</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
