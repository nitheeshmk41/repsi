"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface StepperProps {
  steps: {
    number: string;
    title: string;
    description: string;
  }[];
  className?: string;
  theme?: "light" | "dark";
}

export function Stepper({ steps, className = "", theme = "light" }: StepperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 30%"],
  });

  const lineColor = theme === "light" ? "bg-[#E5EAE6]" : "bg-[#1a2f22]";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Vertical progress line */}
      <div className={`absolute left-[23px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] ${lineColor}`}>
        <motion.div
          className="w-full bg-gradient-to-b from-[#16A34A] to-[#22C55E] origin-top"
          style={{ scaleY: scrollYProgress, height: "100%" }}
        />
      </div>

      <div className="space-y-16 md:space-y-20">
        {steps.map((step, i) => {
          const isLeft = i % 2 === 0;
          return (
            <StepItem
              key={step.number}
              step={step}
              index={i}
              isLeft={isLeft}
              total={steps.length}
              theme={theme}
            />
          );
        })}
      </div>
    </div>
  );
}

function StepItem({
  step,
  index,
  isLeft,
  total,
  theme,
}: {
  step: { number: string; title: string; description: string };
  index: number;
  isLeft: boolean;
  total: number;
  theme: "light" | "dark";
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 85%", "start 50%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [25, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  const dotBg = theme === "light" ? "bg-white" : "bg-[#050B07]";
  const titleColor = theme === "light" ? "text-[#111714]" : "text-[#F5F7F5]";
  const descColor = theme === "light" ? "text-[#66706A]" : "text-[#9CA3AF]";

  return (
    <div ref={itemRef} className="relative">
      <div
        className={`flex items-start gap-6 md:gap-0 ${
          isLeft ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        {/* Step dot */}
        <div className="absolute left-[14px] md:left-1/2 md:-translate-x-1/2 z-10">
          <motion.div
            style={{ scale }}
            className={`w-[18px] h-[18px] rounded-full border-2 border-[#16A34A] ${dotBg} flex items-center justify-center shadow-sm`}
          >
            <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
          </motion.div>
        </div>

        {/* Content */}
        <motion.div
          style={{ opacity, y }}
          className={`ml-14 md:ml-0 md:w-[calc(50%-40px)] ${
            isLeft ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left md:ml-auto"
          }`}
        >
          <span className="text-xs font-mono font-bold text-[#16A34A] tracking-wider px-2 py-0.5 rounded bg-[#16A34A]/10 border border-[#16A34A]/20">
            STEP {step.number}
          </span>
          <h3 className={`text-xl font-extrabold ${titleColor} mt-2`}>
            {step.title}
          </h3>
          <p className={`text-sm ${descColor} mt-2 leading-relaxed`}>
            {step.description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
