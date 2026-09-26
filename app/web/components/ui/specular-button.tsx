"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";

interface SpecularButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SpecularButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
}: SpecularButtonProps) {
  const btnRef = useRef<HTMLDivElement>(null);
  const [specularPos, setSpecularPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpecularPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const sizes = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-3.5 text-base",
    lg: "px-9 py-4 text-lg",
  };

  const variants = {
    primary:
      "bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white shadow-lg shadow-[#16A34A]/25 hover:shadow-xl hover:shadow-[#16A34A]/35",
    secondary:
      "bg-[#0B120E] text-[#F5F7F5] border border-[#1a2f22] hover:border-[#22C55E]/40",
  };

  const content = (
    <div
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl font-bold overflow-hidden transition-all duration-300 active:scale-[0.97] cursor-pointer ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {/* Specular highlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(120px circle at ${specularPos.x}px ${specularPos.y}px, rgba(255,255,255,0.18), transparent 60%)`,
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return <button onClick={onClick}>{content}</button>;
}
