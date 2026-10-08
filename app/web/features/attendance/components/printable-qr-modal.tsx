"use client";

import { useRef } from "react";
import { Printer, X, Sparkles, ShieldCheck, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrCodeView } from "@/components/ui/qr-code-view";

interface PrintableQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  gymName: string;
  qrPayload: string;
  qrLabel: string;
  gymLocation?: string;
}

export function PrintableQrModal({
  isOpen,
  onClose,
  gymName,
  qrPayload,
  qrLabel,
  gymLocation = "Main Reception",
}: PrintableQrModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 space-y-6">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between print:hidden">
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">Print Official Gym QR Poster</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Display at entrance turnstiles, reception desk, or check-in stands.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md">
              <Printer className="w-4 h-4" />
              <span>Print Poster</span>
            </Button>
            <button
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Poster Sheet (Visible in Print & Preview) */}
        <div
          id="repsi-printable-poster"
          className="print:fixed print:inset-0 print:m-0 print:p-8 print:w-full print:h-full bg-white text-slate-900 border-2 border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-sm mx-auto max-w-md print:max-w-none"
        >
          {/* Header Branding */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
              <span>REPSI GYM ACCESS STATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
              {gymName}
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {gymLocation} • {qrLabel}
            </p>
          </div>

          <div className="py-2">
            <div className="h-0.5 w-16 bg-emerald-500 mx-auto rounded-full" />
          </div>

          {/* Call to action */}
          <div className="space-y-1">
            <p className="text-lg font-extrabold text-slate-900 tracking-wide uppercase">
              SCAN TO CHECK IN
            </p>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Open the <strong className="text-slate-900">Repsi app</strong> and scan this QR code to mark your attendance.
            </p>
          </div>

          {/* Large QR Code Container */}
          <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl inline-block shadow-inner mx-auto">
            <QrCodeView
              value={qrPayload}
              size={240}
              title={gymName}
              subtitle="Repsi Verified Pass"
              showDownload={false}
              showCopy={false}
              darkColor="#0f172a"
              lightColor="#f8fafc"
            />
          </div>

          {/* Footer Instructions & Badge */}
          <div className="space-y-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Please scan when you enter the gym</span>
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              Powered by Repsi • Smart Access & Attendance Platform
            </div>
          </div>
        </div>

        {/* Print Stylesheet injection */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #repsi-printable-poster,
            #repsi-printable-poster * {
              visibility: visible;
            }
            #repsi-printable-poster {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border: none;
              box-shadow: none;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
