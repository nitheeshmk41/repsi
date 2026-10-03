"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export type MascotPose =
  | "welcome"
  | "onboarding"
  | "website"
  | "membership"
  | "members"
  | "fitness"
  | "help"
  | "empty"
  | "success"
  | "error";

interface RepsiMascotProps {
  pose: MascotPose;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  speechBubble?: string;
  bubblePosition?: "top" | "right" | "left";
  animate?: boolean;
}

const poseMap: Record<MascotPose, { src: string; alt: string; defaultSpeech?: string }> = {
  welcome: {
    src: "/mascot/welcome.png",
    alt: "Repsi Mascot waving welcome",
    defaultSpeech: "Welcome to Repsi!",
  },
  onboarding: {
    src: "/mascot/onboarding.png",
    alt: "Repsi Mascot with setup checklist",
    defaultSpeech: "Let's get your gym ready!",
  },
  website: {
    src: "/mascot/website.png",
    alt: "Repsi Mascot with laptop building website",
    defaultSpeech: "Let's build your website.",
  },
  membership: {
    src: "/mascot/onboarding.png",
    alt: "Repsi Mascot presenting membership plan",
    defaultSpeech: "Let's create your first plan!",
  },
  members: {
    src: "/mascot/members.png",
    alt: "Repsi Mascot welcoming members",
    defaultSpeech: "Ready to add your members?",
  },
  fitness: {
    src: "/mascot/fitness.png",
    alt: "Repsi Mascot lifting dumbbell",
    defaultSpeech: "Train Hard. Live Strong!",
  },
  help: {
    src: "/mascot/support.png",
    alt: "Repsi Mascot with headset and laptop",
    defaultSpeech: "Need help? Ask Repsi!",
  },
  empty: {
    src: "/mascot/empty.png",
    alt: "Repsi Mascot wondering at empty box",
    defaultSpeech: "Your list is empty. Ready to start?",
  },
  success: {
    src: "/mascot/success.png",
    alt: "Repsi Mascot celebrating success",
    defaultSpeech: "You're all set!",
  },
  error: {
    src: "/mascot/error.png",
    alt: "Repsi Mascot resting with warning alert",
    defaultSpeech: "Oops! Let's get back on track.",
  },
};

const sizeClasses = {
  sm: "w-20 h-20",
  md: "w-32 h-32",
  lg: "w-44 h-44",
  xl: "w-60 h-60",
};

export function RepsiMascot({
  pose,
  size = "md",
  className,
  speechBubble,
  bubblePosition = "top",
  animate = true,
}: RepsiMascotProps) {
  const current = poseMap[pose] || poseMap.welcome;

  return (
    <div className={cn("relative inline-flex flex-col items-center select-none", className)}>
      {speechBubble && bubblePosition === "top" && (
        <div className="relative mb-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a211e] border border-[#E5EAE6] dark:border-[#27352d] shadow-sm text-xs font-semibold text-[#111714] dark:text-[#E8F0EC] max-w-[220px] text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
          {speechBubble}
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white dark:bg-[#1a211e] border-b border-r border-[#E5EAE6] dark:border-[#27352d] rotate-45" />
        </div>
      )}

      <div
        className={cn(
          "relative transition-transform duration-300 hover:scale-105",
          sizeClasses[size],
          animate && "animate-in fade-in zoom-in-95 duration-300"
        )}
      >
        <Image
          src={current.src}
          alt={current.alt}
          fill
          sizes="(max-width: 768px) 150px, 240px"
          className="object-contain drop-shadow-md"
          priority={pose === "welcome" || pose === "onboarding"}
        />
      </div>

      {speechBubble && bubblePosition === "right" && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a211e] border border-[#E5EAE6] dark:border-[#27352d] shadow-sm text-xs font-semibold text-[#111714] dark:text-[#E8F0EC] whitespace-nowrap">
          {speechBubble}
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-[#1a211e] border-b border-l border-[#E5EAE6] dark:border-[#27352d] rotate-45" />
        </div>
      )}
    </div>
  );
}
