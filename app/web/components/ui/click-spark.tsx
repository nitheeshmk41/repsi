"use client";

import { useCallback, useRef, useEffect } from "react";

interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkCount?: number;
  sparkSize?: number;
}

export function ClickSpark({
  children,
  sparkColor = "#22C55E",
  sparkCount = 8,
  sparkSize = 10,
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const createSpark = useCallback(
    (e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement("div");
        const angle = (360 / sparkCount) * i;
        const velocity = 30 + Math.random() * 30;
        const radians = (angle * Math.PI) / 180;
        const dx = Math.cos(radians) * velocity;
        const dy = Math.sin(radians) * velocity;

        Object.assign(spark.style, {
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          width: `${sparkSize}px`,
          height: `${sparkSize}px`,
          borderRadius: "50%",
          backgroundColor: sparkColor,
          pointerEvents: "none",
          zIndex: "9999",
          transform: "translate(-50%, -50%)",
          transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          opacity: "1",
        });

        container.appendChild(spark);

        requestAnimationFrame(() => {
          Object.assign(spark.style, {
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`,
            opacity: "0",
          });
        });

        setTimeout(() => spark.remove(), 600);
      }
    },
    [sparkColor, sparkCount, sparkSize]
  );

  return (
    <div
      ref={containerRef}
      onClick={createSpark}
      className="relative inline-block"
      style={{ position: "relative", overflow: "visible" }}
    >
      {children}
    </div>
  );
}
