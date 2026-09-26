"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, Zap, Sparkles, Trophy } from "lucide-react";

export function LanyardSection() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 15, y: -y * 15 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="relative bg-[#F7F9F7] py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E5EAE6] text-[#111714] overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#16A34A] bg-white px-3.5 py-1.5 rounded-full border border-[#E5EAE6]">
              Your Brand, Your Rules
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111714] leading-tight">
              Your business. <br />
              <span className="text-[#16A34A]">Your customized brand identity.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#66706A] leading-relaxed">
              Repsi works behind the scenes so your fitness business shines. From custom-branded member mobile passes and WhatsApp check-in notifications to Cashfree invoices, your brand stays front and center.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-5 rounded-2xl border border-[#E5EAE6] shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#111714]">White-Label Experience</h4>
                <p className="text-xs text-[#66706A] mt-1">
                  Custom domain, branded mobile receipts, and logo-customized QR membership cards.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5EAE6] shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold mb-3">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#111714]">Instant Onboarding</h4>
                <p className="text-xs text-[#66706A] mt-1">
                  Migrate your existing member database and start issuing digital passes in under 10 minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Right Interactive Lanyard Pass Badge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Lanyard Strap Visual */}
            <div className="w-1.5 h-24 bg-gradient-to-b from-[#111714] to-[#16A34A] rounded-full shadow-md z-0" />
            <div className="w-8 h-8 rounded-full bg-[#111714] border-2 border-[#16A34A] flex items-center justify-center z-10 shadow-lg -mt-3">
              <div className="w-3 h-3 rounded-full bg-[#16A34A]" />
            </div>

            {/* Tiltable Lanyard Card */}
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              animate={{ rotateY: tilt.x, rotateX: tilt.y }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-full max-w-sm bg-white border border-[#E5EAE6] rounded-3xl p-6 shadow-2xl relative z-10 cursor-pointer overflow-hidden transform-gpu mt-1"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Green Glow Aura */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#16A34A]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-[#E5EAE6] pb-4 mb-5">
                <Image
                  src="/logos/primary_logo.png"
                  alt="REPSI"
                  width={140}
                  height={45}
                  className="h-8 w-auto object-contain"
                />
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
                  Official Pass
                </span>
              </div>

              {/* Pass Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#22C55E] flex items-center justify-center text-white font-black text-xl shadow-md">
                    RS
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#111714]">Repsi Verified Gym</h3>
                    <p className="text-xs text-[#66706A]">ID: #REPSI-2026-VIP</p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-[#16A34A]">
                      ● Active Enterprise License
                    </span>
                  </div>
                </div>

                <div className="bg-[#F7F9F7] p-4 rounded-xl border border-[#E5EAE6] space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#66706A]">Facility Status</span>
                    <span className="font-bold text-[#111714]">Verified Owner</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#66706A]">Gate Pass Protocol</span>
                    <span className="font-bold text-[#16A34A]">Encrypted QR</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#66706A]">Cashfree Gateway</span>
                    <span className="font-bold text-[#111714]">Active</span>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <span className="text-[11px] text-[#66706A] italic">
                    Hover/tilt to inspect 3D security badge
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
