"use client";

import React, { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { LanguageCode } from "@/lib/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LanguageSelectorProps {
  className?: string;
  variant?: "ghost" | "outline" | "default";
  showLabel?: boolean;
}

export function LanguageSelector({
  className = "",
  variant = "ghost",
  showLabel = true,
}: LanguageSelectorProps) {
  const { language, setLanguage, languages, currentLanguageMeta } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={`h-8 px-2.5 gap-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] transition-colors ${className}`}
          title="Change Application Language"
        >
          <span className="flex items-center justify-center w-4 h-4 rounded bg-[#16A34A]/20 text-[#16A34A] text-[10px] font-bold">
            {currentLanguageMeta.badge}
          </span>
          <Globe className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          {showLabel && <span>{currentLanguageMeta.nativeName}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 p-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl z-50 animate-in fade-in-50 zoom-in-95"
      >
        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)] mb-1">
          App Language / மொழி
        </div>
        {languages.map((lang) => {
          const isSelected = lang.code === language;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={`flex items-center justify-between px-2.5 py-2 text-xs rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? "bg-[#16A34A]/10 text-[#16A34A] font-bold"
                  : "text-[var(--text)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded bg-[var(--surface-hover)] text-[11px] font-extrabold text-[var(--text)]">
                  {lang.badge}
                </span>
                <div className="flex flex-col">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-normal">{lang.label}</span>
                </div>
              </div>
              {isSelected && <Check className="h-4 w-4 text-[#16A34A]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
