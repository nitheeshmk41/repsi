"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  blur?: string;
}

export function BlurFade({
  children,
  className = "",
  duration = 0.4,
  delay = 0,
  yOffset = 12,
  blur = "6px",
}: BlurFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, filter: `blur(${blur})` }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -yOffset, filter: `blur(${blur})` }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
