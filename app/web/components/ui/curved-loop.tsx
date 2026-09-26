"use client";

export function CurvedLoop() {
  return (
    <div className="relative w-full bg-transparent overflow-hidden -mt-16 sm:-mt-24 pointer-events-none select-none z-20">
      {/* Shallow green curved arc SVG transition */}
      <div className="relative w-full h-20 sm:h-32">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
          preserveAspectRatio="none"
        >
          {/* Subtle green ambient aura glow behind the curve line */}
          <path
            d="M0,35 Q720,105 1440,35 L1440,120 L0,120 Z"
            fill="url(#greenGlowGrad)"
            opacity="0.3"
          />

          {/* Solid White bottom section fill with smooth curve */}
          <path
            d="M0,40 Q720,110 1440,40 L1440,120 L0,120 Z"
            fill="#FFFFFF"
          />

          {/* Glowing Repsi Green Curved Line Accent */}
          <path
            d="M0,40 Q720,110 1440,40"
            stroke="url(#greenCurveGrad)"
            strokeWidth="3.5"
            fill="none"
          />

          <defs>
            <linearGradient id="greenCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16A34A" stopOpacity="0.1" />
              <stop offset="25%" stopColor="#16A34A" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#22C55E" stopOpacity="1" />
              <stop offset="75%" stopColor="#16A34A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#16A34A" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="greenGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16A34A" stopOpacity="0" />
              <stop offset="50%" stopColor="#22C55E" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
