"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Building2, Briefcase, CreditCard, Users, CheckCircle2 } from "lucide-react";

const steps = [
  { id: "gym", label: "Gym Identity", path: "/onboarding/gym", icon: Building2 },
  { id: "business", label: "Business Setup", path: "/onboarding/business", icon: Briefcase },
  { id: "plans", label: "Membership Plans", path: "/onboarding/plans", icon: CreditCard },
  { id: "team", label: "Invite Team", path: "/onboarding/team", icon: Users },
  { id: "complete", label: "Launch", path: "/onboarding/complete", icon: CheckCircle2 },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const currentStepIndex = steps.findIndex((s) => pathname.includes(s.id));
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;
  const currentStep = steps[activeIndex] || steps[0];

  const handleSaveAndExit = () => {
    const slug = localStorage.getItem("repsi_workspace_slug") || "apex-fitness";
    localStorage.setItem("repsi_onboarding_saved_step", currentStep.id);
    router.push(`/${slug}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logos/repsi_logo_black.png"
            alt="REPSI"
            width={160}
            height={50}
            className="h-9 sm:h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Stepper (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {steps.map((step, idx) => {
            const isDone = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    isCurrent
                      ? "bg-emerald-500/10 text-[#16A34A] border border-emerald-500/30"
                      : isDone
                      ? "bg-emerald-50 text-[#16A34A] border border-emerald-200"
                      : "text-zinc-400 bg-zinc-50 border border-zinc-200"
                  }`}
                >
                  <span>{isDone ? "✓" : idx + 1}</span>
                  <span>{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-4 h-0.5 ${idx < activeIndex ? "bg-[#16A34A]" : "bg-zinc-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Save & Exit Button */}
        <button
          onClick={handleSaveAndExit}
          className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-100 px-3 py-1.5 rounded-lg transition-colors shrink-0"
        >
          Save & Exit
        </button>
      </header>

      {/* Stepper Progress Bar (Mobile Only) */}
      <div className="md:hidden border-b border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-zinc-500">Step {activeIndex + 1} of 5</span>
          <span className="text-[#16A34A]">{currentStep.label}</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#16A34A] transition-all duration-300 rounded-full"
            style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {children}
      </main>
    </div>
  );
}
