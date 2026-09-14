"use client";

import { useState, useEffect , use } from "react";
import { Send, Dumbbell, User, CheckCheck, Paperclip, MessageSquare } from "lucide-react";
import { getAuthUser } from "@/lib/auth";

interface ChatMessage {
  id: string;
  sender: "me" | "trainer" | "member";
  senderName: string;
  text: string;
  timestamp: string;
  isWorkoutShare?: boolean;
}

export default function MemberTrainerChatPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "trainer",
      senderName: "Coach Vikram",
      text: "Hey Nitheesh! Great job hitting your 80kg bench press target yesterday 💪",
      timestamp: "09:30 AM",
    },
    {
      id: "msg-2",
      sender: "me",
      senderName: "Nitheesh",
      text: "Thanks Coach! Feeling strong. Should I increase the incline dumbell press weight tomorrow?",
      timestamp: "09:34 AM",
    },
    {
      id: "msg-3",
      sender: "trainer",
      senderName: "Coach Vikram",
      text: "Yes, bump it to 28kg per hand for 3 sets of 8 reps. Control the eccentric phase!",
      timestamp: "09:40 AM",
      isWorkoutShare: true,
    },
  ]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "me",
      senderName: user?.name || "Me",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMsg]);
    setInputText("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Trainer & Member Chat</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Direct messaging channel for workout instruction, routine sharing, and form feedback.
        </p>
      </div>

      {/* Chat Container */}
      <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] shadow-sm flex flex-col h-[580px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 font-bold text-base flex items-center justify-center">
              V
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text)]">Coach Vikram</h2>
              <p className="text-[10px] text-emerald-600 font-medium">● Online • Strength & Conditioning</p>
            </div>
          </div>

          <button
            onClick={() => {
              setInputText("Check my assigned workout routine for today!");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--background)] text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-hover)]"
          >
            <Dumbbell className="h-3.5 w-3.5 text-purple-500" />
            <span>Share Workout Routine</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender === "me";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mb-1">
                  <span>{msg.senderName}</span>
                  <span>• {msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[75%] p-3.5 rounded-[12px] text-xs leading-relaxed ${
                    isMe
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium rounded-br-none"
                      : "bg-[var(--background)] border border-[var(--border)] text-[var(--text)] rounded-bl-none"
                  }`}
                >
                  {msg.isWorkoutShare && (
                    <div className="mb-2 p-2 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[11px] font-bold flex items-center gap-1.5">
                      <Dumbbell className="h-3.5 w-3.5" />
                      <span>Workout Instruction Attached</span>
                    </div>
                  )}
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-[var(--border)] flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message or ask coach a question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 h-10 rounded-[10px] border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />

          <button
            type="submit"
            className="h-10 px-4 rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Send</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
