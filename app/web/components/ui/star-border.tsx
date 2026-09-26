"use client";

import { useRef } from "react";

interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  speed?: number | string;
  innerBg?: string;
}

export function StarBorder({
  children,
  className = "",
  color = "#22C55E",
  speed = 6,
  innerBg = "bg-white",
}: StarBorderProps) {
  const borderRef = useRef<HTMLDivElement>(null);
  const animSpeed = typeof speed === "number" ? `${speed}s` : speed;

  return (
    <div className={`relative ${className}`} ref={borderRef}>
      {/* Animated border using conic-gradient */}
      <div
        className="absolute -inset-[1.5px] rounded-[24px] overflow-hidden z-0"
        style={{
          background: `conic-gradient(from var(--star-angle, 0deg), transparent 60%, ${color} 85%, transparent 100%)`,
          animation: `star-border-spin ${animSpeed} linear infinite`,
        }}
      />
      {/* Inner content with background */}
      <div className={`relative z-10 rounded-[24px] ${innerBg} h-full`}>
        {children}
      </div>
      <style jsx>{`
        @property --star-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes star-border-spin {
          from {
            --star-angle: 0deg;
          }
          to {
            --star-angle: 360deg;
          }
        }
      `}</style>
    </div>
  );
}
