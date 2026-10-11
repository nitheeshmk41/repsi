"use client";

import { useEffect, useRef, useState } from "react";

interface RepsiLottieLoaderProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function RepsiLottieLoader({
  className = "",
  width = 240,
  height = 180,
}: RepsiLottieLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let anim: any = null;
    let isCancelled = false;

    async function loadLottie() {
      try {
        const lottie = (await import("lottie-web")).default;
        if (isCancelled || !containerRef.current) return;

        // Fetch our Repsi-themed JSON directly
        const res = await fetch("/animations/repsi-loading.json");
        const animationData = await res.json();
        if (isCancelled || !containerRef.current) return;

        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData,
        });

        setLoaded(true);
      } catch (err) {
        console.warn("Could not initialize Lottie loader:", err);
      }
    }

    loadLottie();

    return () => {
      isCancelled = true;
      if (anim) {
        try {
          anim.destroy();
        } catch {}
      }
    };
  }, []);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Fallback spinner while SVG Lottie compiles */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        </div>
      )}
      <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
    </div>
  );
}
