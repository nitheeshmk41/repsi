"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Maximize,
  Minimize,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Dumbbell,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrCodeView } from "@/components/ui/qr-code-view";
import { repsiApi, ApiAttendanceQR } from "@/lib/api";
import { slugToGymName } from "@/lib/workspace";

export default function QRDisplayScreenPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const gymName = slugToGymName(workspace);

  const [activeQr, setActiveQr] = useState<ApiAttendanceQR | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const loadQr = async () => {
    try {
      const qr = await repsiApi.getActiveQr();
      setActiveQr(qr);
    } catch (e) {
      console.warn("Failed to load active QR", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQr();
    // Auto refresh active QR every 30 seconds
    const interval = setInterval(loadQr, 30000);

    // Live clock update
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, [workspace]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const payload =
    activeQr?.payload || `repsi://gym/checkin?gym_id=${workspace}&token=default`;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none relative overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header / Bar */}
      <header className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Link
            href={`/${workspace}/attendance`}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            title="Exit to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider uppercase text-slate-200">
                {gymName}
              </h1>
              <p className="text-[11px] text-slate-400">Reception Check-In Terminal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentTime && (
            <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-semibold text-slate-300">
              {currentTime}
            </div>
          )}

          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="sm"
            className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 text-xs gap-1.5"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </Button>
        </div>
      </header>

      {/* Center Station: Big QR & Instructions */}
      <main className="flex flex-col items-center justify-center my-auto text-center space-y-6 z-10 py-6">
        {/* Welcome Tag */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>WELCOME</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase pt-2">
            SCAN TO CHECK IN
          </h2>
        </div>

        {/* Extra Large QR Container */}
        <div className="relative p-6 sm:p-8 bg-white rounded-3xl shadow-2xl shadow-emerald-950/40 border-4 border-emerald-500/40 transition-transform duration-300 hover:scale-[1.01]">
          <QrCodeView
            value={payload}
            size={280}
            showDownload={false}
            showCopy={false}
            darkColor="#090d16"
            lightColor="#ffffff"
          />

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-600 text-xs font-bold font-mono uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Live Repsi Verified Pass</span>
          </div>
        </div>

        {/* Member instruction */}
        <div className="space-y-1.5 max-w-sm">
          <p className="text-base sm:text-lg font-bold text-slate-100">
            Open Repsi → Tap <span className="text-emerald-400">Scan QR</span>
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Aim camera at this screen to instantly unlock access and record your workout session.
          </p>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-4 z-10 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-400 font-semibold">Repsi Entrance Gate Online</span>
        </div>

        <div className="text-[11px] font-mono opacity-80">
          Token: {activeQr?.token ? `${activeQr.token.slice(0, 12)}...` : "Active"} • Repsi Cloud Access
        </div>
      </footer>
    </div>
  );
}
