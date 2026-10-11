"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

/**
 * React Bits / Motion Component: AnimatedNumber
 * Smoothly animates numerical statistics, metrics, and pricing values.
 */
export function AnimatedNumber({
  value,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    damping: 30,
    stiffness: 100,
  });

  const display = useTransform(springVal, (current) => {
    const formatted = current.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}
