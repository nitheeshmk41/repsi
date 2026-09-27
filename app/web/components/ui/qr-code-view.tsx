"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Copy, Check, QrCode as QrIcon } from "lucide-react";

interface QrCodeViewProps {
  value: string;
  size?: number;
  title?: string;
  subtitle?: string;
  showDownload?: boolean;
  showCopy?: boolean;
  darkColor?: string;
  lightColor?: string;
  className?: string;
}

export function QrCodeView({
  value,
  size = 200,
  title,
  subtitle,
  showDownload = true,
  showCopy = true,
  darkColor = "#0f172a",
  lightColor = "#ffffff",
  className = "",
}: QrCodeViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: "M",
      },
      (err) => {
        if (err) {
          console.error("QR Code generation error:", err);
          setError("Failed to render QR Code");
        } else {
          setError(null);
        }
      }
    );
  }, [value, size, darkColor, lightColor]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      const cleanTitle = (title || "repsi-qr-pass").toLowerCase().replace(/[^a-z0-9]/g, "-");
      a.download = `${cleanTitle}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("Failed to download QR code:", e);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy QR code value:", e);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* QR Canvas Container with sleek styling */}
      <div className="relative p-3.5 bg-white rounded-2xl border border-[var(--border)] shadow-md transition-transform hover:scale-[1.01]">
        {error ? (
          <div
            style={{ width: size, height: size }}
            className="flex flex-col items-center justify-center text-xs text-red-500 p-2 text-center"
          >
            <QrIcon className="w-8 h-8 mb-1 text-red-400" />
            <span>{error}</span>
          </div>
        ) : (
          <canvas ref={canvasRef} className="block rounded-xl mx-auto" />
        )}
      </div>

      {(title || subtitle) && (
        <div className="text-center mt-3 space-y-0.5 max-w-[260px]">
          {title && (
            <p className="text-xs font-bold text-[var(--text)] tracking-wider uppercase font-mono">{title}</p>
          )}
          {subtitle && <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{subtitle}</p>}
        </div>
      )}

      {(showDownload || showCopy) && (
        <div className="flex items-center gap-2 mt-3.5">
          {showDownload && (
            <button
              onClick={handleDownload}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-hover)] text-xs font-semibold transition-colors cursor-pointer"
              title="Download QR Code image"
            >
              <Download className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Download</span>
            </button>
          )}

          {showCopy && (
            <button
              onClick={handleCopy}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-hover)] text-xs font-semibold transition-colors cursor-pointer"
              title="Copy QR payload"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
