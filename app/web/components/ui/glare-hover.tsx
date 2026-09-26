"use client";

import { useRef, useState, useCallback } from "react";

interface GlareHoverProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
  borderColor?: string;
}

export function GlareHover({
  children,
  className = "",
  glareColor = "rgba(34, 197, 94, 0.08)",
  borderColor = "#E5EAE6",
}: GlareHoverProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glarePos, setGlarePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlarePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  // Ensure solid hex colors are safely turned into low-opacity RGBA glare
  const safeGlareColor = glareColor.startsWith("#")
    ? "rgba(34, 197, 94, 0.08)"
    : glareColor;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl border transition-all duration-300 ${
        isHovered ? "border-[#16A34A] shadow-md shadow-[#16A34A]/10" : ""
      } ${className}`}
      style={{
        borderColor: isHovered ? undefined : borderColor,
      }}
    >
      {/* Glare overlay (subtle transparent light glow only) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${glarePos.x}px ${glarePos.y}px, ${safeGlareColor}, transparent 70%)`,
        }}
      />
      {/* Border glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(250px circle at ${glarePos.x}px ${glarePos.y}px, rgba(34, 197, 94, 0.15), transparent 60%)`,
          maskImage:
            "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      <div className="relative z-0 h-full">{children}</div>
    </div>
  );
}
