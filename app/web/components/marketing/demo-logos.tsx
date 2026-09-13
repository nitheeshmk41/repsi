export function DemoLogos() {
  const brands = [
    {
      name: "IRONLAB",
      symbol: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M4 6h3v12H4zm6-2h4v16h-4zm7 4h3v8h-3z" />
        </svg>
      ),
    },
    {
      name: "FITCORE",
      symbol: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: "NOVA FITNESS",
      symbol: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M12 2l2.6 6.9 7.4.5-5.6 4.8 1.8 7.2L12 17.6l-6.2 3.8 1.8-7.2L2 9.4l7.4-.5z" />
        </svg>
      ),
    },
    {
      name: "PEAK",
      symbol: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M3 20h18L12 4 3 20zm9-11.5L16.5 17h-9L12 8.5z" />
        </svg>
      ),
    },
    {
      name: "MOTION",
      symbol: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      name: "ELEVATE GYM",
      symbol: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M12 3l9 18H3l9-18zm0 4.5L6.5 18h11L12 7.5z" />
        </svg>
      ),
    },
    {
      name: "PULSE CLUB",
      symbol: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M2 12h4l3-7 4 14 3-9h6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  // Repeat for continuous seamless loop
  const marqueeBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-10 border-y border-[var(--border)] bg-[var(--background)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
        <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
          Designed for modern fitness businesses & boutique clubs
        </p>
      </div>

      {/* Infinite Logo Scroll Container with Fade Edges */}
      <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-12 sm:gap-20 py-2">
          {marqueeBrands.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="flex items-center gap-2.5 text-zinc-400 hover:text-zinc-900 transition-colors shrink-0 cursor-pointer"
            >
              {brand.symbol}
              <span className="text-sm font-extrabold tracking-wider font-mono">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
