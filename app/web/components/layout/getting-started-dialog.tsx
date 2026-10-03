"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, HelpCircle, X, Sparkles } from "lucide-react";
import { RepsiMascot } from "@/components/ui/repsi-mascot";
import { Button } from "@/components/ui/button";

interface StepItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  completed: boolean;
}

interface GettingStartedDialogProps {
  workspace: string;
  isOpen: boolean;
  onClose: () => void;
  completedSteps?: Record<string, boolean>;
}

export function GettingStartedDialog({
  workspace,
  isOpen,
  onClose,
  completedSteps = {},
}: GettingStartedDialogProps) {
  if (!isOpen) return null;

  const steps: StepItem[] = [
    {
      id: "profile",
      title: "Gym Profile",
      desc: "Gym name, contact info, operating hours and logo",
      href: `/${workspace}/settings`,
      completed: completedSteps.profile ?? true,
    },
    {
      id: "memberships",
      title: "Add Membership Plans",
      desc: "Packages & pricing your members can purchase",
      href: `/${workspace}/memberships`,
      completed: completedSteps.memberships ?? false,
    },
    {
      id: "trainers",
      title: "Add Trainers",
      desc: "Coaches to manage client workouts and routines",
      href: `/${workspace}/trainers`,
      completed: completedSteps.trainers ?? false,
    },
    {
      id: "members",
      title: "Add Members",
      desc: "Create members manually or upload CSV spreadsheet",
      href: `/${workspace}/members`,
      completed: completedSteps.members ?? false,
    },
    {
      id: "attendance",
      title: "Set up Attendance",
      desc: "QR scanner code & front-desk check-in kiosk",
      href: `/${workspace}/attendance`,
      completed: completedSteps.attendance ?? false,
    },
    {
      id: "website",
      title: "Public Gym Website",
      desc: "Launch repsi.app/" + workspace + " in Website Studio",
      href: `/${workspace}/website`,
      completed: completedSteps.website ?? false,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#131a16] border border-[#E5EAE6] dark:border-[#223127] p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#111714] dark:hover:text-white hover:bg-[#F1F5F2] dark:hover:bg-[#1b2520] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Mascot */}
        <div className="flex items-center gap-4 border-b border-[#E5EAE6] dark:border-[#223127] pb-5">
          <RepsiMascot pose="onboarding" size="sm" animate={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#16A34A] bg-[#E8F8ED] dark:bg-[#163321] px-2 py-0.5 rounded">
                Getting Started Guide
              </span>
              <span className="text-xs font-bold text-[#64748B]">
                {completedCount} of {steps.length} completed
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#111714] dark:text-white mt-1">
              Set up your gym
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#8D9C94] mt-0.5">
              Follow these recommended steps to have your gym operational in minutes.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="my-5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#111714] dark:text-[#E8F0EC] mb-1.5">
            <span>Setup progress</span>
            <span className="text-[#16A34A]">{progressPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#F1F5F2] dark:bg-[#1a251e] overflow-hidden">
            <div
              className="h-full bg-[#16A34A] transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Step Items List */}
        <div className="space-y-2.5">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                s.completed
                  ? "bg-[#F7FCF9] dark:bg-[#102317]/40 border-[#16A34A]/20"
                  : "bg-white dark:bg-[#16201b] border-[#E5EAE6] dark:border-[#223127] hover:border-[#16A34A]/40"
              }`}
            >
              <div className="flex items-start gap-3">
                {s.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-[#94A3B8] shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-[#111714] dark:text-white">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#8D9C94] mt-0.5">
                    {s.desc}
                  </p>
                </div>
              </div>

              <Link
                href={s.href}
                onClick={onClose}
                className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  s.completed
                    ? "text-[#16A34A] bg-[#16A34A]/10 hover:bg-[#16A34A]/20"
                    : "bg-[#111714] dark:bg-white text-white dark:text-[#111714] hover:opacity-90"
                }`}
              >
                <span>{s.completed ? "✓ Completed" : "Set up"}</span>
                {!s.completed && <ArrowRight className="w-3 h-3" />}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#E5EAE6] dark:border-[#223127] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B] dark:text-[#8D9C94]">
            You can reopen this checklist anytime from the top bar.
          </span>
          <Button size="sm" variant="outline" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
