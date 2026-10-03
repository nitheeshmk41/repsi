"use client";

import { useState } from "react";
import { AlertCircle, RefreshCcw, HelpCircle, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RepsiMascot, MascotPose } from "@/components/ui/repsi-mascot";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  mascotPose?: MascotPose;
  speechBubble?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  guideTitle?: string;
  guideSteps?: string[];
  guideLinkText?: string;
  onGuideClick?: () => void;
  templateCard?: {
    title: string;
    subtitle: string;
    details?: string[];
    actionLabel?: string;
    onUseTemplate: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  mascotPose = "empty",
  speechBubble,
  title,
  description,
  action,
  secondaryAction,
  guideTitle = "Quick Guide",
  guideSteps,
  guideLinkText = "View 30-second guide →",
  onGuideClick,
  templateCard,
  className,
}: EmptyStateProps) {
  const [showGuideModal, setShowGuideModal] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-4 max-w-2xl mx-auto rounded-2xl bg-white/70 dark:bg-[#151c18]/70 border border-[#E5EAE6] dark:border-[#243329] backdrop-blur-sm shadow-xs transition-all",
        className
      )}
    >
      {/* Mascot or Icon */}
      <div className="mb-4">
        {mascotPose ? (
          <RepsiMascot
            pose={mascotPose}
            size="md"
            speechBubble={speechBubble}
            bubblePosition="top"
          />
        ) : icon ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background)] border border-[var(--border)] text-[var(--text-muted)]">
            {icon}
          </div>
        ) : null}
      </div>

      <h3 className="text-xl font-bold text-[var(--text)] tracking-tight mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed mb-6">
          {description}
        </p>
      )}

      {/* Primary & Secondary Action Buttons */}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {action && (
            <Button
              onClick={action.onClick}
              className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold shadow-xs"
            >
              {action.icon}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="border-[#E5EAE6] dark:border-[#27352d] text-[var(--text)] hover:bg-[var(--surface-hover)]"
            >
              {secondaryAction.icon}
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}

      {/* Optional Interactive Template Card */}
      {templateCard && (
        <div className="w-full max-w-sm my-4 text-left p-4 rounded-xl border border-dashed border-[#16A34A]/40 bg-[#F4FBF6] dark:bg-[#112317] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#16A34A] bg-[#E8F8ED] dark:bg-[#1a3824] px-2 py-0.5 rounded">
              Example Template
            </span>
            <span className="text-[11px] text-[#66706A] dark:text-[#8D9C94] font-medium">
              Not saved to database
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#111714] dark:text-[#E8F0EC]">
              {templateCard.title}
            </h4>
            <p className="text-xs text-[#16A34A] font-semibold mt-0.5">
              {templateCard.subtitle}
            </p>
          </div>

          {templateCard.details && templateCard.details.length > 0 && (
            <ul className="text-xs text-[#66706A] dark:text-[#A1B0A8] space-y-1 pl-1">
              {templateCard.details.map((d, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={templateCard.onUseTemplate}
            className="w-full text-xs font-bold border-[#16A34A]/40 text-[#16A34A] hover:bg-[#16A34A] hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            {templateCard.actionLabel || "Use as template"}
          </Button>
        </div>
      )}

      {/* Mini-Guide Section */}
      {guideSteps && guideSteps.length > 0 && (
        <div className="w-full max-w-md mt-2 pt-4 border-t border-[#E5EAE6] dark:border-[#243329] text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#16A34A]" />
              {guideTitle}
            </span>
            {onGuideClick ? (
              <button
                type="button"
                onClick={onGuideClick}
                className="text-[11px] text-[#16A34A] hover:underline font-semibold"
              >
                {guideLinkText}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowGuideModal(!showGuideModal)}
                className="text-[11px] text-[#16A34A] hover:underline font-semibold"
              >
                {showGuideModal ? "Hide steps" : "View steps →"}
              </button>
            )}
          </div>

          <ol className="space-y-1.5 text-xs text-[var(--text-muted)] bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]">
            {guideSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-[#16A34A] shrink-0">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this content.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto",
        className
      )}
    >
      <RepsiMascot pose="error" size="md" speechBubble="Let's fix this together" />
      <h3 className="text-base font-bold text-[var(--text)] mt-4 mb-1">{title}</h3>
      <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
