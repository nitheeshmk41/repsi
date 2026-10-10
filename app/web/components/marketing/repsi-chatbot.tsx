"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  MessageCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Send,
  Building2,
  Users,
  Dumbbell,
  Globe,
  ChevronLeft,
  DollarSign,
  Phone,
  Video,
  Bot,
  MessageSquare,
} from "lucide-react";

type ChatScreen = "menu" | "features" | "pricing" | "website" | "demo_booking" | "qa" | "booking_success";

const SUGGESTED_QUESTIONS = [
  "What does Repsi include?",
  "Which plan is right for my gym?",
  "How do I add members?",
  "How does QR attendance work?",
  "Can I create my own gym website?",
  "Can I use WhatsApp with Repsi?",
  "How do trainers manage clients?",
  "How do I get started?",
];

export function RepsiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissedBubble, setHasDismissedBubble] = useState(false);
  const [screen, setScreen] = useState<ChatScreen>("menu");
  const [mascotMood, setMascotMood] = useState<"welcome" | "support" | "onboarding" | "website" | "success" | "fitness">("welcome");

  // Demo Booking State
  const [gymName, setGymName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [gymCity, setGymCity] = useState("");
  const [preferredDate, setPreferredDate] = useState("Tomorrow");
  const [preferredTime, setPreferredTime] = useState("4:00 PM");
  const [submittingDemo, setSubmittingDemo] = useState(false);

  // Q&A State
  const [userQuestion, setUserQuestion] = useState("");
  const [messages, setMessages] = useState<
    { sender: "bot" | "user"; text: string; action?: { label: string; href?: string; screen?: ChatScreen } }[]
  >([
    {
      sender: "bot",
      text: "Hi! I'm your Repsi AI Guide. What can I help you with today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (screen === "qa") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, screen]);

  const getMascotSrc = () => {
    switch (mascotMood) {
      case "fitness":
        return "/mascot/fitness.png";
      case "support":
        return "/mascot/support.png";
      case "onboarding":
        return "/mascot/onboarding.png";
      case "success":
        return "/mascot/success.png";
      case "website":
        return "/mascot/website.png";
      default:
        return "/mascot/welcome.png";
    }
  };

  const openScreen = (s: ChatScreen, mood: "welcome" | "support" | "onboarding" | "website" | "success" | "fitness" = "welcome") => {
    setScreen(s);
    setMascotMood(mood);
  };

  const handleBookDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !phone.trim()) {
      alert("Please provide your name and WhatsApp number.");
      return;
    }
    setSubmittingDemo(true);
    try {
      await fetch("https://repsi.fastapicloud.dev/api/v1/websites/public/apex-fitness/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ownerName.trim(),
          phone: phone.trim(),
          message: `Repsi Homepage Demo Request: Gym: ${gymName || "New Gym"} | City: ${gymCity || "India"} | Date: ${preferredDate} at ${preferredTime}`,
          booking_type: "demo_call",
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          source: "Repsi Homepage Chatbot",
        }),
      }).catch(() => null);

      setMascotMood("success");
      setScreen("booking_success");
    } finally {
      setSubmittingDemo(false);
    }
  };

  const processUserQuery = (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;

    const qLower = q.toLowerCase();
    const updated = [...messages, { sender: "user" as const, text: q }];
    setMessages(updated);
    setUserQuestion("");

    let reply = "Repsi provides all-in-one gym management with member records, QR attendance, trainer assignments, CRM leads, and built-in website builder!";
    let action: { label: string; href?: string; screen?: ChatScreen } | undefined;

    if (qLower.includes("price") || qLower.includes("cost") || qLower.includes("plan") || qLower.includes("fee") || qLower.includes("rate") || qLower.includes("much")) {
      reply = "Repsi offers 3 simple transparent plans:\n\n• Starter: ₹416/mo (billed ₹4,990/year)\n• Growth: ₹833/mo (billed ₹9,990/year) ★ Popular\n• Pro: ₹1,499/mo (billed ₹17,990/year)\n\nNo setup fees or hidden renewal charges.";
      action = { label: "Explore Detailed Plans →", href: "/pricing" };
      setMascotMood("onboarding");
    } else if (qLower.includes("website") || qLower.includes("domain") || qLower.includes("landing")) {
      reply = "Yes! Repsi includes a built-in Gym Website Builder. You get a public address (repsi.app/yourgym) with membership plans, trainer profiles, and WhatsApp lead capture!";
      action = { label: "Learn About Website Builder →", screen: "website" };
      setMascotMood("website");
    } else if (qLower.includes("member") || qLower.includes("add") || qLower.includes("import") || qLower.includes("csv")) {
      reply = "Adding members is instant! You can add members 1-by-1 or batch import your entire member database via CSV spreadsheet in seconds.";
      action = { label: "Explore Features →", screen: "features" };
      setMascotMood("fitness");
    } else if (qLower.includes("attendance") || qLower.includes("qr") || qLower.includes("check")) {
      reply = "Repsi features QR Digital Attendance. Members scan a live QR code at your front desk using their phone, or desk staff can mark attendance in 1 click.";
      setMascotMood("support");
    } else if (qLower.includes("whatsapp") || qLower.includes("message") || qLower.includes("chat")) {
      reply = "Yes! Repsi integrates with WhatsApp so you can send membership renewal reminders, check-in alerts, and capture prospective leads directly.";
      action = { label: "Talk to Repsi Team on WhatsApp →", href: "https://wa.me/918667783321" };
      setMascotMood("support");
    } else if (qLower.includes("trainer") || qLower.includes("coach") || qLower.includes("staff")) {
      reply = "Trainers get a dedicated Coach Portal where they can view assigned clients, build workout routines, track attendance, and log exercise protocols.";
      setMascotMood("fitness");
    } else if (qLower.includes("start") || qLower.includes("trial") || qLower.includes("sign")) {
      reply = "Getting started takes less than 2 minutes! Create your account, choose your gym URL, and add your first membership plan.";
      action = { label: "Get Started Free →", href: "/signup" };
      setMascotMood("success");
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: reply, action }]);
    }, 400);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    processUserQuery(userQuestion);
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────────────────
          FLOATING TRIGGER BUTTON (Bottom Right)
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        {/* Unread Teaser Pill */}
        {!isOpen && !hasDismissedBubble && (
          <div className="mb-3 px-3.5 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl text-xs font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[240px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="truncate">Need help choosing a plan?</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHasDismissedBubble(true);
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
          aria-label="Toggle Repsi AI Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative w-9 h-9">
              <Image
                src="/mascot/support.png"
                alt="Repsi AI Assistant"
                fill
                className="object-contain drop-shadow"
              />
            </div>
          )}

          {/* Active Status Badge */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-zinc-900" />
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          CHATBOT DIALOG WINDOW
      ───────────────────────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[390px] h-[540px] max-h-[82vh] rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans">
          {/* HEADER BAR */}
          <div className="h-16 px-4 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {screen !== "menu" && (
                <button
                  onClick={() => openScreen("menu", "welcome")}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition"
                  title="Back to menu"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Mascot Avatar Header Pill */}
              <div className="relative w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Image src={getMascotSrc()} alt="Mascot" width={26} height={26} className="object-contain" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute bottom-0 right-0 border border-white dark:border-zinc-900" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight truncate">
                    Repsi AI Guide
                  </h3>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/20 uppercase tracking-wider">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                  Your gym management assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* SCREEN BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-white dark:bg-zinc-900 text-xs">
            {/* ─────────────────────────────────────────────────────────────────────────
                1. MENU SCREEN
            ───────────────────────────────────────────────────────────────────────── */}
            {screen === "menu" && (
              <div className="space-y-4">
                {/* Welcome Card */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white text-xs">
                    Hi! I’m your Repsi AI Guide.
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed">
                    I can help you understand Repsi, pricing, features, setup, and getting started.
                  </p>
                </div>

                {/* 4 Primary Action Cards */}
                <div className="space-y-2">
                  <button
                    onClick={() => openScreen("features", "fitness")}
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-left transition flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                        <span>Explore Repsi</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                        Members • Attendance • Trainers • CRM
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button
                    onClick={() => openScreen("pricing", "onboarding")}
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-left transition flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                        <span>Pricing & Plans</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                        Plans from ₹416/month
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button
                    onClick={() => openScreen("website", "website")}
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-left transition flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                        <span>Website Builder</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                        Create your gym website
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button
                    onClick={() => openScreen("qa", "support")}
                    className="w-full p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-left transition flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Ask Repsi AI</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                        Get instant answers
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

                {/* Divider Header */}
                <div className="pt-2">
                  <div className="relative text-center">
                    <span className="bg-white dark:bg-zinc-900 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider relative z-10">
                      Need personal help?
                    </span>
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
                    </div>
                  </div>

                  {/* Personal Help Links */}
                  <div className="space-y-2 mt-3">
                    <button
                      onClick={() => openScreen("demo_booking", "onboarding")}
                      className="w-full p-3 rounded-2xl border border-emerald-500/40 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-left transition flex items-center justify-between shadow-md group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Video className="w-4 h-4" />
                        <div>
                          <div className="text-xs">Book a Live Demo</div>
                          <p className="text-[10px] font-normal opacity-90">15-minute personalized walkthrough</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </button>

                    <a
                      href="https://wa.me/918667783321?text=Hi%20Repsi%20Team!%20I'd%20like%20to%20know%20more%20about%20Repsi%20gym%20management."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/80 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-emerald-500" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">Talk to the Repsi Team</div>
                          <p className="text-[10px] text-slate-500 dark:text-zinc-400">WhatsApp support & sales</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────────────
                2. INTERACTIVE ASK REPSI AI CHAT SCREEN
            ───────────────────────────────────────────────────────────────────────── */}
            {screen === "qa" && (
              <div className="space-y-3 flex flex-col h-full">
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          m.sender === "user"
                            ? "bg-emerald-600 text-white font-medium rounded-br-none"
                            : "bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 rounded-bl-none shadow-2xs whitespace-pre-line"
                        }`}
                      >
                        {m.text}
                      </div>

                      {m.action && (
                        <div className="mt-1.5">
                          {m.action.href ? (
                            <Link
                              href={m.action.href}
                              onClick={() => setIsOpen(false)}
                              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                            >
                              {m.action.label}
                            </Link>
                          ) : m.action.screen ? (
                            <button
                              onClick={() => openScreen(m.action!.screen!)}
                              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                            >
                              {m.action.label}
                            </button>
                          ) : null}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Popular Suggested Question Chips */}
                <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
                    Popular questions:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => processUserQuery(q)}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleAskQuestion} className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Ask anything about Repsi..."
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    className="flex-1 h-9 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!userQuestion.trim()}
                    className="h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────────────
                3. PRICING SCREEN
            ───────────────────────────────────────────────────────────────────────── */}
            {screen === "pricing" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Plans from ₹416/month</h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">Annual billing • Save 17%</p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">STARTER</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">₹416 / mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      Up to 100 members • Attendance & Member Management (Billed ₹4,990/yr)
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-500/5 relative">
                    <span className="absolute -top-2 right-3 text-[9px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      ★ MOST POPULAR
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">GROWTH</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">₹833 / mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      Up to 500 members • CRM Leads • Gym Website (Billed ₹9,990/yr)
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">PRO</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">₹1,499 / mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      Up to 1,500 members • Custom Domain • Multi-branch (Billed ₹17,990/yr)
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/pricing"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span>View Full Pricing Comparison</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────────────
                4. WEBSITE BUILDER SCREEN
            ───────────────────────────────────────────────────────────────────────── */}
            {screen === "website" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Repsi Gym Website Builder</h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Get a clean public gym address: <strong className="font-mono text-emerald-600 dark:text-emerald-400">repsi.app/{gymName || "fitzone"}</strong>
                  </p>
                </div>

                <div className="space-y-2 border-l-2 border-emerald-500 pl-3">
                  <p className="text-xs text-slate-700 dark:text-zinc-300 font-semibold">✓ Custom gym branding & hero banner</p>
                  <p className="text-xs text-slate-700 dark:text-zinc-300 font-semibold">✓ Live synced membership plans & prices</p>
                  <p className="text-xs text-slate-700 dark:text-zinc-300 font-semibold">✓ Trainer profiles & certified qualifications</p>
                  <p className="text-xs text-slate-700 dark:text-zinc-300 font-semibold">✓ Integrated WhatsApp lead capture</p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Build Your Gym Website Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────────────
                5. EXPLORE FEATURES SCREEN
            ───────────────────────────────────────────────────────────────────────── */}
            {screen === "features" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Repsi Core Features</h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">Everything needed to run and grow your facility</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <span className="font-bold text-slate-900 dark:text-white block">Member Management</span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">Profiles, renewals & CSV import</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <span className="font-bold text-slate-900 dark:text-white block">QR Attendance</span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">Live QR scan & daily check-ins</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <span className="font-bold text-slate-900 dark:text-white block">Gym CRM & Leads</span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">Lead pipeline & conversion</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                    <span className="font-bold text-slate-900 dark:text-white block">Trainer Portal</span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">Client assignment & workouts</span>
                  </div>
                </div>

                <Link
                  href="/features"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <span>View Full Features Matrix →</span>
                </Link>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────────────
                6. DEMO BOOKING SCREEN
            ───────────────────────────────────────────────────────────────────────── */}
            {screen === "demo_booking" && (
              <form onSubmit={handleBookDemo} className="space-y-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">🎥 Book a 1-on-1 Live Demo</h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">15-minute personalized walkthrough with Repsi product team</p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full h-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 block mb-1">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Gym Name</label>
                  <input
                    type="text"
                    placeholder="e.g. FitZone Studio"
                    value={gymName}
                    onChange={(e) => setGymName(e.target.value)}
                    className="w-full h-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Date</label>
                    <select
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full h-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 px-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Today">Today</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="In 2 days">In 2 days</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Time</label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full h-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 px-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingDemo}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 mt-1"
                >
                  <span>{submittingDemo ? "Confirming..." : "Confirm Demo Call"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* ─────────────────────────────────────────────────────────────────────────
                7. DEMO BOOKING SUCCESS SCREEN
            ───────────────────────────────────────────────────────────────────────── */}
            {screen === "booking_success" && (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-base text-slate-900 dark:text-white">Demo Call Confirmed!</h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-xs mx-auto">
                  Our product specialist will reach out to <strong>{phone}</strong> on <strong>{preferredDate} at {preferredTime}</strong> for your 1-on-1 walkthrough.
                </p>
                <button
                  onClick={() => openScreen("menu", "welcome")}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white text-xs font-bold transition hover:bg-slate-200 dark:hover:bg-zinc-700"
                >
                  Back to Menu
                </button>
              </div>
            )}
          </div>

          {/* FOOTER BAR */}
          <div className="h-9 px-4 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500 shrink-0 font-medium">
            <span>Repsi • AI Guide • Human support</span>
            <a
              href="https://wa.me/918667783321"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
            >
              WhatsApp →
            </a>
          </div>
        </div>
      )}
    </>
  );
}
