"use client";

import { useState, useEffect, use } from "react";
import {
  Send,
  Dumbbell,
  User,
  CheckCheck,
  Paperclip,
  MessageSquare,
  Search,
  Megaphone,
  Sparkles,
  HelpCircle,
  Clock,
  PhoneCall,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { getAuthUser } from "@/lib/auth";

interface ChatMessage {
  id: string;
  sender: "me" | "them";
  senderName: string;
  text: string;
  timestamp: string;
  isWorkoutShare?: boolean;
  attachmentType?: "workout" | "progress" | "announcement";
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  unread: number;
  online: boolean;
  lastMessage: string;
  lastTime: string;
  type: "trainer" | "announcement" | "support";
  messages: ChatMessage[];
}

export default function MemberTrainerChatPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChannelId, setActiveChannelId] = useState<string>("conv-1");

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      name: "Coach Vikram",
      role: "Head Personal Trainer • Strength & Conditioning",
      avatar: "V",
      unread: 0,
      online: true,
      lastMessage: "Bump incline bench press to 28kg per hand tomorrow!",
      lastTime: "09:40 AM",
      type: "trainer",
      messages: [
        {
          id: "msg-1",
          sender: "them",
          senderName: "Coach Vikram",
          text: "Hey Nitheesh! Great job hitting your 80kg bench press target yesterday.",
          timestamp: "09:30 AM",
        },
        {
          id: "msg-2",
          sender: "me",
          senderName: "Me",
          text: "Thanks Coach! Feeling strong. Should I increase the incline dumbbell press weight tomorrow?",
          timestamp: "09:34 AM",
        },
        {
          id: "msg-3",
          sender: "them",
          senderName: "Coach Vikram",
          text: "Yes! Bump it to 28kg per hand for 3 sets of 8 reps. Control the eccentric phase!",
          timestamp: "09:40 AM",
          isWorkoutShare: true,
          attachmentType: "workout",
        },
      ],
    },
    {
      id: "conv-2",
      name: "Gym Announcements",
      role: "Official Repsi Broadcast • Apex Fitness",
      avatar: "📢",
      unread: 1,
      online: true,
      lastMessage: "New Heavy Duty Squat Racks Installed in Zone 2! 🏋️‍♂️",
      lastTime: "Yesterday",
      type: "announcement",
      messages: [
        {
          id: "msg-201",
          sender: "them",
          senderName: "Gym Management",
          text: "Happy Weekend Warriors! We have upgraded Zone 2 with 3 new Eleiko power racks & bumper plates.",
          timestamp: "Yesterday 04:00 PM",
          attachmentType: "announcement",
        },
        {
          id: "msg-202",
          sender: "them",
          senderName: "Gym Management",
          text: "Sunday Operating Hours Update: 7:00 AM to 2:00 PM. Recover well!",
          timestamp: "Yesterday 06:15 PM",
        },
      ],
    },
    {
      id: "conv-3",
      name: "Coach Kavya",
      role: "HIIT & Fat Loss Specialist",
      avatar: "K",
      unread: 0,
      online: false,
      lastMessage: "Drink 3L water minimum after today's HIIT session!",
      lastTime: "Oct 2",
      type: "trainer",
      messages: [
        {
          id: "msg-301",
          sender: "them",
          senderName: "Coach Kavya",
          text: "High energy performance during morning Tabata circuit! Keep pushing!",
          timestamp: "Oct 2 10:15 AM",
        },
        {
          id: "msg-302",
          sender: "me",
          senderName: "Me",
          text: "Loved the session Coach! What should I focus on for post-workout nutrition?",
          timestamp: "Oct 2 10:20 AM",
        },
        {
          id: "msg-303",
          sender: "them",
          senderName: "Coach Kavya",
          text: "Aim for 30g protein + 50g complex carbs within 45 mins. Drink 3L water minimum today!",
          timestamp: "Oct 2 10:25 AM",
        },
      ],
    },
    {
      id: "conv-4",
      name: "Front Desk & Support",
      role: "Locker Keys, Guest Passes & Member Desk",
      avatar: "🏢",
      unread: 0,
      online: true,
      lastMessage: "Your annual membership renewal discount is active.",
      lastTime: "Sep 28",
      type: "support",
      messages: [
        {
          id: "msg-401",
          sender: "them",
          senderName: "Front Desk",
          text: "Welcome to Apex Fitness Desk Support! How can we assist your gym experience today?",
          timestamp: "Sep 28 11:00 AM",
        },
      ],
    },
  ]);

  const [inputText, setInputText] = useState("");

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const activeConv = conversations.find((c) => c.id === activeChannelId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "me",
      senderName: user?.name || "Me",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChannelId) {
          return {
            ...c,
            lastMessage: userText,
            lastTime: "Just now",
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setInputText("");

    // Instant Automated Reply Simulation for interactive feedback
    setTimeout(() => {
      let replyText = "Received! I will review your progress log during my training shift today. Keep grinding!";
      if (activeConv.type === "announcement") {
        replyText = "Thanks for your feedback! Our gym staff monitors announcement comments.";
      } else if (activeConv.type === "support") {
        replyText = "Thank you for reaching out to Front Desk! Your request is queued and our desk manager will assist you shortly.";
      }

      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "them",
        senderName: activeConv.name,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeChannelId) {
            return {
              ...c,
              lastMessage: replyText,
              lastTime: "Just now",
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-6xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Gym Communications Hub</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              LIVE MESSAGING
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Direct 1-on-1 coach chat, workout instruction sharing, and gym broadcasts for {workspace}.
          </p>
        </div>
      </div>

      {/* Main Chat Layout (Split Pane: Channels Left | Messages Right) */}
      <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] shadow-md overflow-hidden flex flex-col md:flex-row h-[640px]">
        {/* LEFT CHANNEL SIDEBAR */}
        <div className="w-full md:w-80 border-r border-[var(--border)] bg-[var(--background)]/60 flex flex-col shrink-0">
          {/* Channel Search */}
          <div className="p-3 border-b border-[var(--border)]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search coaches, broadcasts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              />
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredConversations.map((c) => {
              const isActive = c.id === activeChannelId;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveChannelId(c.id);
                    // Clear unread
                    setConversations((prev) =>
                      prev.map((item) => (item.id === c.id ? { ...item, unread: 0 } : item))
                    );
                  }}
                  className={`w-full p-3 rounded-xl text-left transition flex items-start gap-3 ${
                    isActive
                      ? "bg-[var(--surface-hover)] border border-[var(--border)] shadow-sm"
                      : "hover:bg-[var(--surface)] opacity-85"
                  }`}
                >
                  {/* Channel Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center shadow-sm ${
                        c.type === "announcement"
                          ? "bg-amber-500/15 text-amber-500"
                          : c.type === "support"
                          ? "bg-blue-500/15 text-blue-500"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {c.avatar}
                    </div>
                    {c.online && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--background)] absolute -bottom-0.5 -right-0.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className={`text-xs truncate ${isActive ? "font-bold text-[var(--text)]" : "font-semibold text-[var(--text-secondary)]"}`}>
                        {c.name}
                      </h3>
                      <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">{c.lastTime}</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">{c.lastMessage}</p>
                  </div>

                  {c.unread > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white shrink-0 self-center">
                      {c.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT MESSAGE STREAM */}
        <div className="flex-1 flex flex-col bg-[var(--surface)] min-w-0">
          {/* Active Chat Header */}
          <div className="p-4 border-b border-[var(--border)] bg-[var(--background)]/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 shadow-sm ${
                  activeConv.type === "announcement"
                    ? "bg-amber-500/15 text-amber-500"
                    : activeConv.type === "support"
                    ? "bg-blue-500/15 text-blue-500"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {activeConv.avatar}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-[var(--text)] truncate">{activeConv.name}</h2>
                <p className="text-[11px] text-[var(--text-muted)] truncate">{activeConv.role}</p>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center gap-2 shrink-0">
              {activeConv.type === "trainer" && (
                <button
                  onClick={() => {
                    setInputText("Coach, please share my assigned workout routine for this week!");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-hover)] transition"
                >
                  <Dumbbell className="h-3.5 w-3.5 text-purple-500" />
                  <span className="hidden sm:inline">Request Routine</span>
                </button>
              )}
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeConv.messages.map((msg) => {
              const isMe = msg.sender === "me";
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mb-1">
                    <span className="font-semibold">{msg.senderName}</span>
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[80%] p-3.5 rounded-[16px] text-xs leading-relaxed shadow-sm ${
                      isMe
                        ? "bg-emerald-600 text-white font-medium rounded-br-none"
                        : "bg-[var(--background)] border border-[var(--border)] text-[var(--text)] rounded-bl-none"
                    }`}
                  >
                    {msg.attachmentType === "workout" && (
                      <div className="mb-2 p-2 rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[11px] font-bold flex items-center gap-1.5">
                        <Dumbbell className="h-3.5 w-3.5" />
                        <span>Workout Instruction Attached</span>
                      </div>
                    )}
                    {msg.attachmentType === "announcement" && (
                      <div className="mb-2 p-2 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1.5">
                        <Megaphone className="h-3.5 w-3.5" />
                        <span>Gym Broadcast Notice</span>
                      </div>
                    )}
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[var(--border)] bg-[var(--background)]/40 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInputText((prev) => prev + " 🏋️‍♂️ Heavy sets done!")}
              className="p-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition"
              title="Share Workout Log"
            >
              <Dumbbell className="h-4 w-4" />
            </button>

            <input
              type="text"
              placeholder={`Message ${activeConv.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
