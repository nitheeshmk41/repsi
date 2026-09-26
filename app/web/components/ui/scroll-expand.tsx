"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, SpringOptions } from "framer-motion";

interface ScrollExpandProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollExpand({ children, className = "" }: ScrollExpandProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "start 25%"],
  });

  // Scale from 0.88 to 1.0 (equivalent to 68vw to 95vw expansion)
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 1], [0.15, 0.25]);

  return (
    <div ref={containerRef} className={`w-full flex justify-center perspective-[1200px] ${className}`}>
      <motion.div
        style={{
          scale,
          rotateX,
          y,
          transformStyle: "preserve-3d",
        }}
        className="w-full max-w-[94vw] lg:max-w-7xl transition-shadow duration-300"
      >
        {children}
      </motion.div>
    </div>
  );
}
