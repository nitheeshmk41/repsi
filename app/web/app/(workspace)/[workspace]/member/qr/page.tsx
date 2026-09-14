"use client";

import { useState, useEffect , use } from "react";
import { QrCode, CheckCircle2, ShieldCheck, User, Scan, AlertCircle } from "lucide-react";
import { getAuthUser } from "@/lib/auth";

export default function MemberQRCheckinPage(props: { params: Promise<{ workspace: string }> }) {
  const params = use(props.params);
  const workspace = params.workspace || "apex-fitness";
  const [user, setUser] = useState<any>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const handleSimulateScan = () => {
    setScanning(true);
    setScannedResult(null);

    setTimeout(() => {
      setScanning(false);
      setScannedResult("CHECKIN_SUCCESS");
    }, 1200);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Member Unique QR Pass</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Scan your digital pass at gym entrance turnstile or reception counter for instant check-in.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Member Digital Pass */}
        <div className="rounded-[16px] border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-[var(--surface)] to-[var(--surface)] p-6 space-y-5 shadow-md text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Active Member Pass</span>
          </div>

          <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-2xl flex items-center justify-center mx-auto border-2 border-emerald-500/30">
            {user?.name?.charAt(0) || "N"}
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-[var(--text)]">{user?.name || "Nitheesh"}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{user?.email || "nitheesh@repsi.app"}</p>
            <p className="text-xs font-semibold text-emerald-600 mt-1">Premium Annual Member • {workspace}</p>
          </div>

          {/* QR Code Container */}
          <div className="p-4 rounded-[14px] bg-white border border-[var(--border)] max-w-[220px] mx-auto shadow-inner space-y-2">
            <div className="w-40 h-40 mx-auto bg-slate-900 rounded-lg flex items-center justify-center text-white relative overflow-hidden group">
              <QrCode className="w-32 h-32 text-emerald-400" />
              <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-500 font-mono">REPSI-PASS-88492049</p>
          </div>

          <p className="text-[11px] text-[var(--text-muted)]">
            Refreshes automatically every 60 seconds for security.
          </p>
        </div>

        {/* Turnstile / Reception Scanner Verification Simulator */}
        <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-[var(--primary-dark)] dark:text-[var(--primary-hover)]" />
              <h2 className="text-base font-bold text-[var(--text)]">Turnstile / Counter Verification</h2>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Simulate reception hardware scanning member's QR pass. Checks membership validity in real-time.
            </p>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
                <span>Scanner Status:</span>
                <span className="text-emerald-600 font-bold">ONLINE & READY</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Workflow: QR Scan → Member Query → Membership Active? → Instant Check-in Logged.
              </p>
            </div>
          </div>

          {/* Scanner Output */}
          <div className="space-y-3">
            {scannedResult === "CHECKIN_SUCCESS" && (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 space-y-1 text-center">
                <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500" />
                <h3 className="text-sm font-bold">Check-in Successful</h3>
                <p className="text-xs font-semibold">Welcome back, {user?.name || "Nitheesh"}! 🎉</p>
                <p className="text-[10px] text-[var(--text-muted)]">Logged at 10:04 AM via Entrance QR Scanner</p>
              </div>
            )}

            <button
              onClick={handleSimulateScan}
              disabled={scanning}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold hover:bg-[var(--primary-hover)] transition-all shadow-sm cursor-pointer disabled:opacity-60"
            >
              {scanning ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning Pass...</span>
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4" />
                  <span>Test Turnstile QR Scan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
