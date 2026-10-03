"use client";

import { useState } from "react";
import Image from "next/image";
import { repsiApi } from "@/lib/api";
import {
  X,
  MessageCircle,
  Dumbbell,
  Ticket,
  Calendar,
  UserCheck,
  MapPin,
  HelpCircle,
  Send,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Clock,
  Phone,
  MessageSquare,
} from "lucide-react";

interface GymAssistantProps {
  website: any;
  gymName: string;
  plans: any[];
  trainers: any[];
  classes: any[];
  slug: string;
}

type ScreenType =
  | "menu"
  | "memberships"
  | "trial_booking"
  | "visit_booking"
  | "trainers"
  | "location"
  | "qa"
  | "human_chat"
  | "booking_success";

export function GymAssistantWidget({
  website,
  gymName,
  plans,
  trainers,
  classes,
  slug,
}: GymAssistantProps) {
  // Check if assistant is disabled in settings
  if (website?.assistant_enabled === false) {
    return null;
  }

  const assistantName = website?.assistant_name || "Gym Assistant";
  const welcomeMsg =
    website?.assistant_welcome ||
    `Hi! I'm your ${assistantName}. How can I help you today?`;
  const whatsappPhone =
    website?.assistant_whatsapp ||
    website?.phone ||
    "919876543210";
  const primaryColor = website?.primary_color || "#16A34A";

  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissedBubble, setHasDismissedBubble] = useState(false);
  const [screen, setScreen] = useState<ScreenType>("menu");
  const [mascotMood, setMascotMood] = useState<string>("welcome");

  // Booking Flow State
  const [bookingType, setBookingType] = useState<"free_trial" | "visit">("free_trial");
  const [bookingDate, setBookingDate] = useState("Tomorrow");
  const [customDate, setCustomDate] = useState("");
  const [bookingTime, setBookingTime] = useState("5:00 PM");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userGoal, setUserGoal] = useState("");
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingConfirmedDetails, setBookingConfirmedDetails] = useState<any>(null);

  // Q&A State
  const [userQuestion, setUserQuestion] = useState("");
  const [qaMessages, setQaMessages] = useState<
    { sender: "user" | "bot"; text: string; action?: { label: string; screen: ScreenType } }[]
  >([
    {
      sender: "bot",
      text: `Ask me anything about ${gymName}! I can answer questions about pricing, membership options, personal training, hours, or facilities.`,
    },
  ]);
  const [submittingChatLead, setSubmittingChatLead] = useState(false);
  const [chatLeadSuccess, setChatLeadSuccess] = useState(false);

  // Mascot image selection based on context/mood
  const getMascotSrc = () => {
    switch (mascotMood) {
      case "weights":
        return "/mascot/fitness.png";
      case "calendar":
        return "/mascot/help.png";
      case "ticket":
        return "/mascot/membership.png";
      case "trainer":
        return "/mascot/members.png";
      case "success":
        return "/mascot/success.png";
      case "website":
        return "/mascot/website.png";
      default:
        return "/mascot/welcome.png";
    }
  };

  const openWithMood = (newScreen: ScreenType, mood: string) => {
    setMascotMood(mood);
    setScreen(newScreen);
  };

  const handleStartBooking = (type: "free_trial" | "visit") => {
    setBookingType(type);
    setMascotMood(type === "free_trial" ? "ticket" : "calendar");
    setScreen(type === "free_trial" ? "trial_booking" : "visit_booking");
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) {
      alert("Please provide your name and contact phone number.");
      return;
    }

    setSubmittingBooking(true);
    const chosenDate = bookingDate === "Custom" ? customDate || "Upcoming Date" : bookingDate;

    try {
      await repsiApi.submitPublicLead(slug, {
        name: userName.trim(),
        phone: userPhone.trim(),
        booking_type: bookingType,
        preferred_date: chosenDate,
        preferred_time: bookingTime,
        message: userGoal ? `Goal: ${userGoal}` : undefined,
        source: bookingType === "free_trial" ? "Trial Booking" : "Visit Booking",
        source_page: "Gym Assistant",
      });

      setBookingConfirmedDetails({
        name: userName,
        phone: userPhone,
        date: chosenDate,
        time: bookingTime,
        type: bookingType === "free_trial" ? "Free Trial Workout" : "Gym Visit & Tour",
      });

      setMascotMood("success");
      setScreen("booking_success");
    } catch (err: any) {
      alert(err.message || "Failed to submit booking. Please try again or message via WhatsApp.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  // Automated FAQ Answer Engine
  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const q = userQuestion.trim();
    const qLower = q.toLowerCase();
    const updated = [...qaMessages, { sender: "user" as const, text: q }];
    setUserQuestion("");

    // Answer matching
    if (qLower.includes("price") || qLower.includes("cost") || qLower.includes("fee") || qLower.includes("membership") || qLower.includes("plan") || qLower.includes("how much")) {
      const topPlan = plans?.[0];
      const answer = topPlan
        ? `Our memberships start from ₹${topPlan.price?.toLocaleString()} for ${topPlan.duration_months} month(s). We have ${plans.length} flexible plans with no hidden charges.`
        : `We offer competitive and affordable membership packages tailored to your schedule.`;
      updated.push({
        sender: "bot",
        text: `${answer} Would you like to view our full membership tiers?`,
        action: { label: "View Memberships", screen: "memberships" },
      });
      setMascotMood("ticket");
    } else if (qLower.includes("hour") || qLower.includes("time") || qLower.includes("open") || qLower.includes("close") || qLower.includes("sunday")) {
      const hours = website?.opening_hours || "Mon - Sat: 6:00 AM - 10:00 PM | Sun: 7:00 AM - 1:00 PM";
      updated.push({
        sender: "bot",
        text: `Our opening hours are:\n${hours}\n\nWould you like to book a visit or free trial session?`,
        action: { label: "Book Free Trial", screen: "trial_booking" },
      });
      setMascotMood("calendar");
    } else if (qLower.includes("trainer") || qLower.includes("personal training") || qLower.includes("coach") || qLower.includes("pt")) {
      const trainerCount = trainers?.length || 0;
      updated.push({
        sender: "bot",
        text: `Yes! We have certified personal trainers specializing in fat loss, muscle building, and strength conditioning (${trainerCount > 0 ? `${trainerCount} dedicated coaches on site` : "certified fitness coaches"}).`,
        action: { label: "View Trainers", screen: "trainers" },
      });
      setMascotMood("trainer");
    } else if (qLower.includes("location") || qLower.includes("where") || qLower.includes("address") || qLower.includes("near")) {
      const addr = website?.address || "Coimbatore, Tamil Nadu";
      updated.push({
        sender: "bot",
        text: `We are located at:\n${addr}.\n\nFeel free to drop by or contact us anytime!`,
        action: { label: "View Contact & Map", screen: "location" },
      });
      setMascotMood("welcome");
    } else if (qLower.includes("trial") || qLower.includes("free") || qLower.includes("demo")) {
      updated.push({
        sender: "bot",
        text: `Yes! We offer a complimentary 1-day free trial so you can experience our facility, equipment, and community before deciding.`,
        action: { label: "Book Free Trial Now", screen: "trial_booking" },
      });
      setMascotMood("ticket");
    } else {
      // Human handoff recommendation
      updated.push({
        sender: "bot",
        text: `I want to make sure you get the exact right answer regarding that! Would you like to send a direct message to our gym team or talk on WhatsApp?`,
        action: { label: "Chat with Gym Team", screen: "human_chat" },
      });
      setMascotMood("calendar");
    }

    setQaMessages(updated);
  };

  const handleSendHumanChatLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) {
      alert("Please provide your name and contact phone number.");
      return;
    }
    setSubmittingChatLead(true);
    try {
      await repsiApi.submitPublicLead(slug, {
        name: userName.trim(),
        phone: userPhone.trim(),
        booking_type: "chat_handoff",
        message: userQuestion || "Requested chat callback via Assistant",
        source: "Website Chat",
        source_page: "Gym Assistant",
      });
      setChatLeadSuccess(true);
      setMascotMood("success");
    } catch (err: any) {
      alert(err.message || "Failed to submit request.");
    } finally {
      setSubmittingChatLead(false);
    }
  };

  const cleanWhatsappNumber = whatsappPhone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    `Hi, I found ${gymName} through your website (repsi.app/${slug}). I'd like to ask a question or book a visit!`
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Speech Bubble Tooltip when Assistant is closed */}
      {!isOpen && !hasDismissedBubble && (
        <div className="absolute bottom-20 right-0 mb-2 w-56 bg-zinc-900 border border-zinc-700/80 text-white p-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setHasDismissedBubble(true);
            }}
            className="absolute top-1.5 right-1.5 text-zinc-400 hover:text-white p-1 rounded-full"
            aria-label="Dismiss greeting"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-start gap-2.5">
            <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-white leading-tight">
                Hi! Need gym info?
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                Check plans, book a free trial, or chat with us.
              </p>
            </div>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute -bottom-2 right-7 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-zinc-900" />
        </div>
      )}

      {/* Floating Mascot Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setHasDismissedBubble(true);
          }}
          className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-zinc-950 border-2 border-emerald-500/50 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          style={{ borderColor: primaryColor }}
          aria-label="Open Gym Assistant"
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <Image
              src={getMascotSrc()}
              alt="Gym Assistant Mascot"
              width={48}
              height={48}
              className="object-contain drop-shadow-md group-hover:scale-110 transition-transform"
            />
          </div>
          {/* Online green indicator */}
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full animate-pulse" />
        </button>
      )}

      {/* Assistant Modal Window */}
      {isOpen && (
        <div className="w-[370px] sm:w-[400px] max-h-[85vh] h-[580px] bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                <Image
                  src={getMascotSrc()}
                  alt="Gym Assistant"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                  {assistantName}
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1 leading-none">{gymName}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {screen !== "menu" && (
                <button
                  onClick={() => {
                    setScreen("menu");
                    setMascotMood("welcome");
                  }}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition"
                  title="Back to menu"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition"
                title="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* SCREEN: MAIN MENU */}
            {screen === "menu" && (
              <div className="space-y-3.5">
                {/* Greeting Speech bubble */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-zinc-200">
                  <p className="font-medium text-white text-xs">{welcomeMsg}</p>
                </div>

                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1">
                  What can I help you with?
                </p>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => openWithMood("memberships", "weights")}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 text-left transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-base">
                        🏋️
                      </span>
                      <div>
                        <div className="font-semibold text-zinc-100 group-hover:text-white">
                          View Memberships
                        </div>
                        <div className="text-[11px] text-zinc-400">Plans, rates, and inclusions</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition" />
                  </button>

                  <button
                    onClick={() => handleStartBooking("free_trial")}
                    className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-left transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-base">
                        🎟️
                      </span>
                      <div>
                        <div className="font-semibold text-emerald-300 group-hover:text-emerald-200 flex items-center gap-1.5">
                          Book Free Trial
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                            Free
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-400/80">
                          Try our gym pass with 0 commitment
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition" />
                  </button>

                  <button
                    onClick={() => handleStartBooking("visit")}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 text-left transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-base">
                        📅
                      </span>
                      <div>
                        <div className="font-semibold text-zinc-100 group-hover:text-white">
                          Book a Facility Visit
                        </div>
                        <div className="text-[11px] text-zinc-400">Tour gym & meet trainers</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition" />
                  </button>

                  <button
                    onClick={() => openWithMood("trainers", "trainer")}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 text-left transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-base">
                        👨‍🏫
                      </span>
                      <div>
                        <div className="font-semibold text-zinc-100 group-hover:text-white">
                          Certified Trainers
                        </div>
                        <div className="text-[11px] text-zinc-400">Personal coaching & bios</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition" />
                  </button>

                  <button
                    onClick={() => openWithMood("location", "welcome")}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 text-left transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-base">
                        📍
                      </span>
                      <div>
                        <div className="font-semibold text-zinc-100 group-hover:text-white">
                          Location & Hours
                        </div>
                        <div className="text-[11px] text-zinc-400">Address, schedule & phone</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition" />
                  </button>

                  <button
                    onClick={() => openWithMood("qa", "calendar")}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 text-left transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-base">
                        💬
                      </span>
                      <div>
                        <div className="font-semibold text-zinc-100 group-hover:text-white">
                          Ask a Question
                        </div>
                        <div className="text-[11px] text-zinc-400">Instant answers or chat with team</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition" />
                  </button>

                  {/* WhatsApp Quick Action */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-left transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
                        💚
                      </span>
                      <div>
                        <div className="font-semibold text-emerald-300">
                          Chat on WhatsApp
                        </div>
                        <div className="text-[11px] text-zinc-400">Direct message our desk</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition" />
                  </a>
                </div>
              </div>
            )}

            {/* SCREEN: MEMBERSHIPS */}
            {screen === "memberships" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>🏋️</span> Membership Plans
                  </h4>
                  <button
                    onClick={() => handleStartBooking("free_trial")}
                    className="text-[11px] text-emerald-400 hover:underline font-semibold"
                  >
                    Book Trial First →
                  </button>
                </div>

                {plans && plans.length > 0 ? (
                  <div className="space-y-2.5">
                    {plans.map((p, idx) => (
                      <div
                        key={p.id || idx}
                        className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-white text-xs">{p.name}</span>
                            <p className="text-[10px] text-zinc-400">
                              {p.duration_months} Month{p.duration_months > 1 ? "s" : ""} Validity
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-emerald-400 text-sm">
                              ₹{p.price?.toLocaleString()}
                            </div>
                            <span className="text-[9px] text-zinc-500">All access</span>
                          </div>
                        </div>
                        {p.description && (
                          <p className="text-[11px] text-zinc-300 leading-snug">{p.description}</p>
                        )}
                        <button
                          onClick={() => {
                            setUserGoal(`Interested in plan: ${p.name}`);
                            handleStartBooking("free_trial");
                          }}
                          className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-center font-medium transition"
                        >
                          Select Plan & Book
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                    <p className="text-zinc-400">Membership details are available at the gym reception.</p>
                    <button
                      onClick={() => handleStartBooking("free_trial")}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs"
                    >
                      Book a Free Trial Session
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SCREEN: BOOKING FLOW (TRIAL OR VISIT) */}
            {(screen === "trial_booking" || screen === "visit_booking") && (
              <form onSubmit={handleSubmitBooking} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    {bookingType === "free_trial" ? "🎟️ Book a Free Trial Workout" : "📅 Book a Gym Visit"}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    100% free pass. Meet certified trainers and check our facility.
                  </p>
                </div>

                {/* Date Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-300">Choose Date</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["Today", "Tomorrow", "Saturday"].map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => {
                          setBookingDate(d);
                          setCustomDate("");
                        }}
                        className={`py-1.5 px-2 rounded-lg border text-center font-medium transition ${
                          bookingDate === d
                            ? "bg-emerald-600 border-emerald-500 text-white font-bold"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1">
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => {
                        setCustomDate(e.target.value);
                        setBookingDate("Custom");
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
                      placeholder="Or choose specific date"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-300">Preferred Time Slot</label>
                  <div className="grid grid-cols-4 gap-1">
                    {["7:00 AM", "9:00 AM", "5:00 PM", "7:00 PM"].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setBookingTime(t)}
                        className={`py-1 px-1 rounded-lg border text-[11px] text-center font-medium transition ${
                          bookingTime === t
                            ? "bg-emerald-600 border-emerald-500 text-white font-bold"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs mt-0.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-300">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98765 43210"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs mt-0.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-300">Primary Goal (Optional)</label>
                    <select
                      value={userGoal}
                      onChange={(e) => setUserGoal(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs mt-0.5 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select your fitness goal...</option>
                      <option value="Fat Loss & Cardio">Weight Loss & Cardio</option>
                      <option value="Muscle Building">Muscle Building & Hypertrophy</option>
                      <option value="General Fitness">General Strength & Fitness</option>
                      <option value="Personal Training">Personal Coaching</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition disabled:opacity-50"
                >
                  {submittingBooking ? (
                    <span>Confirming Pass...</span>
                  ) : (
                    <>
                      <span>Confirm {bookingType === "free_trial" ? "Free Trial Pass" : "Visit"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* SCREEN: BOOKING SUCCESS */}
            {screen === "booking_success" && (
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 text-center space-y-3 py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h4 className="text-base font-bold text-white">Booking Confirmed!</h4>
                <p className="text-zinc-300 text-xs">
                  We look forward to seeing you at {gymName}!
                </p>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-left text-xs space-y-1 text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Visitor:</span>
                    <span className="font-semibold text-white">{bookingConfirmedDetails?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Date:</span>
                    <span className="font-semibold text-emerald-400">{bookingConfirmedDetails?.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Time:</span>
                    <span className="font-semibold text-white">{bookingConfirmedDetails?.time}</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400">
                  Our front desk team will send your entry barcode pass via WhatsApp before your visit.
                </p>

                <div className="pt-2 flex gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-center text-xs"
                  >
                    Open in WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      setScreen("menu");
                      setMascotMood("welcome");
                    }}
                    className="py-2 px-3 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN: TRAINERS */}
            {screen === "trainers" && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>👨‍🏫</span> Certified Trainers
                </h4>

                {trainers && trainers.length > 0 ? (
                  <div className="space-y-2">
                    {trainers.map((t, idx) => (
                      <div
                        key={t.id || idx}
                        className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{t.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                            {t.specialty || "Fitness Coach"}
                          </span>
                        </div>
                        {t.bio && <p className="text-[11px] text-zinc-400">{t.bio}</p>}
                        <button
                          onClick={() => {
                            setUserGoal(`Personal training inquiry for coach ${t.name}`);
                            handleStartBooking("free_trial");
                          }}
                          className="text-[11px] text-emerald-400 hover:underline font-semibold block pt-1"
                        >
                          Book Free Session with {t.name} →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center text-zinc-400">
                    Our certified instructors are on the gym floor every day to guide your posture and training.
                  </div>
                )}
              </div>
            )}

            {/* SCREEN: LOCATION & HOURS */}
            {screen === "location" && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>📍</span> Location & Timings
                </h4>

                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Address</span>
                    <p className="text-zinc-200 text-xs font-medium mt-0.5">
                      {website?.address || "Coimbatore, Tamil Nadu, India"}
                    </p>
                  </div>

                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Operating Schedule</span>
                    <p className="text-zinc-200 text-xs font-medium mt-0.5">
                      {website?.opening_hours || "Mon - Sat: 6:00 AM - 10:00 PM\nSunday: 7:00 AM - 1:00 PM"}
                    </p>
                  </div>

                  {website?.phone && (
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Front Desk Phone</span>
                      <p className="text-emerald-400 text-xs font-semibold mt-0.5">
                        {website.phone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-center text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>WhatsApp</span>
                  </a>
                  <button
                    onClick={() => handleStartBooking("visit")}
                    className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-center text-xs"
                  >
                    Book a Visit
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN: Q&A INTERACTION */}
            {screen === "qa" && (
              <div className="space-y-3 flex flex-col h-full">
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {qaMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        m.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-2xl max-w-[85%] text-xs ${
                          m.sender === "user"
                            ? "bg-emerald-600 text-white rounded-br-none"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none"
                        }`}
                      >
                        <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                        {m.action && (
                          <button
                            onClick={() => {
                              if (m.action?.screen === "trial_booking") handleStartBooking("free_trial");
                              else if (m.action?.screen) setScreen(m.action.screen);
                            }}
                            className="mt-2 block w-full py-1 px-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold text-[11px] text-center border border-emerald-500/30 hover:bg-emerald-500/30 transition"
                          >
                            {m.action.label} →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAskQuestion} className="pt-2 flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Ask about price, timings, trainers..."
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition"
                    title="Send question"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* SCREEN: HUMAN CHAT / DIRECT HANDOFF */}
            {screen === "human_chat" && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <h4 className="font-bold text-white text-xs">💬 Connect with Gym Team</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Leave your inquiry and our desk team will reply directly to your phone.
                  </p>
                </div>

                {chatLeadSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="font-bold text-white text-xs">Message Sent to Gym Team!</p>
                    <p className="text-[11px] text-zinc-300">
                      Our desk will get in touch with you shortly.
                    </p>
                    <button
                      onClick={() => setScreen("menu")}
                      className="mt-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-200"
                    >
                      Return to Assistant
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendHumanChatLead} className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-300">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Rahul"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white mt-0.5 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-300">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white mt-0.5 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-300">Your Question / Inquiry</label>
                      <textarea
                        rows={2}
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        placeholder="e.g. Can I get a discount for a yearly membership?"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white mt-0.5 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingChatLead}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition disabled:opacity-50"
                    >
                      {submittingChatLead ? "Sending..." : "Submit Inquiry to Gym"}
                    </button>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-zinc-800" />
                      <span className="flex-shrink mx-2 text-[10px] text-zinc-500">OR</span>
                      <div className="flex-grow border-t border-zinc-800" />
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-center font-semibold text-xs transition"
                    >
                      Continue on WhatsApp →
                    </a>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2 border-t border-zinc-800/60 bg-zinc-900/40 flex items-center justify-between text-[10px] text-zinc-500">
            <span className="flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              repsi.app/{slug}
            </span>
            <span>Powered by Repsi</span>
          </div>
        </div>
      )}
    </div>
  );
}
