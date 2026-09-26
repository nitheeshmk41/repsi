"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface TrailItem {
  id: number;
  x: number;
  y: number;
  img: string;
  title: string;
  sub: string;
  rotation: number;
}

const GYM_IMAGES = [
  { img: "/images/hero_gym.jpg", title: "Iron Vault Gym", sub: "1,240 Members • Bangalore" },
  { img: "/images/gym_pilates_studio.jpg", title: "Lumina Pilates Studio", sub: "850 Members • Mumbai" },
  { img: "/images/reception_checkin.jpg", title: "Titan Athletics Hub", sub: "Turnstile Gate Verified" },
  { img: "/images/gym_swimming_pool.jpg", title: "Aquatic Fit Center", sub: "Pool Lanes & Academy" },
  { img: "/images/trainer_coaching.jpg", title: "CrossFit Zone", sub: "12 Certified Coaches" },
];

// Card dimensions & safety margins to prevent ANY half-clipped images
const CARD_HALF_WIDTH = 115; // 208px card width / 2 + margin
const CARD_HALF_HEIGHT = 85; // 145px card height / 2 + margin
const TOP_NAVBAR_PADDING = 120; // Don't spawn under top transparent navbar

export function ImageTrail({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<TrailItem[]>([]);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTimeRef = useRef<number>(0);
  const indexRef = useRef(0);
  const idCounter = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Strict fitting check: DO NOT SHOW HALF IMAGES. If card cannot fit 100% inside container boundaries, don't show.
    const fitsHorizontally = x >= CARD_HALF_WIDTH && x <= rect.width - CARD_HALF_WIDTH;
    const fitsVertically = y >= TOP_NAVBAR_PADDING && y <= rect.height - CARD_HALF_HEIGHT;

    if (!fitsHorizontally || !fitsVertically) {
      return;
    }

    const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);
    const now = Date.now();

    // Spawn slowly: cursor must travel at least 160px AND minimum 350ms between spawns
    if (dist > 160 && now - lastTimeRef.current > 350) {
      lastPos.current = { x, y };
      lastTimeRef.current = now;

      const currentGym = GYM_IMAGES[indexRef.current % GYM_IMAGES.length];
      indexRef.current += 1;
      const newId = idCounter.current++;
      const randomRotation = (Math.random() - 0.5) * 10; // subtle tilt (-5deg to +5deg)

      setItems((prev) => [
        ...prev.slice(-2), // Keep max 2-3 slow floating cards on screen at a time
        {
          id: newId,
          x,
          y,
          img: currentGym.img,
          title: currentGym.title,
          sub: currentGym.sub,
          rotation: randomRotation,
        },
      ]);

      // Remove after 2.8 seconds for ultra smooth slow float out
      setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== newId));
      }, 2800);
    }
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full h-full overflow-hidden"
    >
      {/* Background Floating Image Trail Cards (Light Theme, z-0, pointer-events-none) */}
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8, rotate: item.rotation, y: 15 }}
            animate={{ opacity: 0.95, scale: 1, rotate: item.rotation, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -15, transition: { duration: 0.6, ease: "easeOut" } }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute pointer-events-none z-0 transform -translate-x-1/2 -translate-y-1/2 select-none"
            style={{ left: item.x, top: item.y }}
          >
            {/* Light Theme Card Styling */}
            <div className="bg-white/95 backdrop-blur-md border border-[#E5EAE6] p-2 rounded-2xl shadow-2xl shadow-black/25 flex flex-col gap-1.5 w-44 sm:w-52">
              <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden border border-[#E5EAE6]">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-[#16A34A] bg-white/90 px-2 py-0.5 rounded-md border border-[#16A34A]/20 backdrop-blur-md shadow-2xs">
                  ● Repsi Partner
                </span>
              </div>
              <div className="px-1">
                <div className="text-xs font-extrabold text-[#111714] truncate">{item.title}</div>
                <div className="text-[10px] text-[#66706A] font-semibold truncate">{item.sub}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hero Foreground Contents (z-10, pointer-events-auto) */}
      <div className="relative z-10 pointer-events-auto">{children}</div>
    </div>
  );
}
