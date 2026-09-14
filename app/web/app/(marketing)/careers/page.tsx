import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { FadeIn } from "@/components/ui/fade-in";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4fbf6] via-[#fafdfb] to-white text-zinc-900 font-sans antialiased flex flex-col">
      <MarketingNav />
      
      <main className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-6 shadow-2xs mx-auto">
            <span>Coming Soon</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 mb-6">
            Careers at Repsi
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Join us in our mission to build the future of operating systems for the fitness industry.
          </p>
        </FadeIn>
      </main>

      <MarketingFooter />
    </div>
  );
}
