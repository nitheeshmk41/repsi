"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, ShieldCheck, Activity, Smartphone } from "lucide-react";

export default function FitnessIntegrationsPage({ params }: { params: { workspace: string } }) {
  const [stravaConnected, setStravaConnected] = useState(true);
  const [googleFitConnected, setGoogleFitConnected] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Just now");

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1200);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Fitness App & Wearable Integrations</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Connect your favorite fitness providers to automatically synchronize outdoor runs, cardio sessions, and step data.
        </p>
      </div>

      {/* Sync Control Header */}
      <div className="p-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs font-bold text-[var(--text)]">Generic Fitness Integration Layer</span>
          <p className="text-[11px] text-[var(--text-muted)]">Last Activity Sync: {lastSyncTime}</p>
        </div>

        <button
          onClick={handleSyncNow}
          disabled={syncing}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? "Syncing Activities..." : "Sync All Apps Now"}</span>
        </button>
      </div>

      {/* Connected Integration Cards */}
      <div className="space-y-4">
        {/* Strava */}
        <div className="p-5 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 font-extrabold text-lg flex items-center justify-center border border-orange-500/20">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[var(--text)]">Strava Activity Sync</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Automatically imports outdoor running, cycling, and elevation metrics into your REPSI profile.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStravaConnected(!stravaConnected)}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors ${
              stravaConnected
                ? "border border-[var(--border)] bg-[var(--background)] text-[var(--text-muted)] hover:text-[var(--text)]"
                : "bg-orange-600 text-white"
            }`}
          >
            {stravaConnected ? "Disconnect" : "Connect Strava"}
          </button>
        </div>

        {/* Google Fit */}
        <div className="p-5 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 font-extrabold text-lg flex items-center justify-center border border-blue-500/20">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[var(--text)]">Google Fit & Android Wear</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Synchronizes daily step counts, active energy expenditure, and heart-rate recovery data.
              </p>
            </div>
          </div>

          <button
            onClick={() => setGoogleFitConnected(!googleFitConnected)}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors ${
              googleFitConnected
                ? "border border-[var(--border)] bg-[var(--background)] text-[var(--text-muted)] hover:text-[var(--text)]"
                : "bg-blue-600 text-white"
            }`}
          >
            {googleFitConnected ? "Disconnect" : "Connect Google Fit"}
          </button>
        </div>

        {/* Upcoming Wearable Provider Framework */}
        <div className="p-5 rounded-[16px] border border-[var(--border)] bg-[var(--background)] space-y-2 text-xs text-[var(--text-muted)]">
          <p className="font-bold text-[var(--text)]">Generic Fitness Integration System (Apple Health, Garmin, Fitbit)</p>
          <p>
            REPSI is built with a modular integration architecture. Additional providers can be connected seamlessly without altering core gym management logic.
          </p>
        </div>
      </div>
    </div>
  );
}
