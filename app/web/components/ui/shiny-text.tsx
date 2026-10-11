"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  shimmerColor?: string;
}

export function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = "",
  shimmerColor = "rgba(255, 255, 255, 0.8)",
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-clip-text text-transparent font-medium ${
        disabled ? "text-current" : ""
      } ${className}`}
      style={{
        backgroundImage: disabled
          ? "none"
          : `linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, ${shimmerColor} 50%, rgba(255, 255, 255, 0) 60%)`,
        backgroundSize: "200% 100%",
        animation: disabled ? "none" : `shiny-text-shimmer ${animationDuration} linear infinite`,
      }}
    >
      {text}
      <style jsx>{`
        @keyframes shiny-text-shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
      `}</style>
    </span>
  );
}
