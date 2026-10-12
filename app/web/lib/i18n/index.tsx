"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, LanguageCode, SUPPORTED_LANGUAGES, LanguageMeta } from "./translations";
import { repsiApi } from "@/lib/api";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageMeta[];
  currentLanguageMeta: LanguageMeta;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  languages: SUPPORTED_LANGUAGES,
  currentLanguageMeta: SUPPORTED_LANGUAGES[0],
});

export const STORAGE_KEY = "repsi_preferred_locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  // Initialize language from local storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (saved && ["en", "ta", "ml", "kn", "te"].includes(saved)) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = useCallback((newLang: LanguageCode) => {
    setLanguageState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLang);
      window.dispatchEvent(new CustomEvent("repsi_language_change", { detail: newLang }));
    }
    // Attempt asynchronous profile sync (non-blocking)
    repsiApi.updateUserLanguage(newLang).catch(() => {});
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const currentDict = translations[language];
      if (currentDict && currentDict[key]) {
        return currentDict[key];
      }
      // Fallback to English
      const enDict = translations["en"];
      if (enDict && enDict[key]) {
        return enDict[key];
      }
      return fallback !== undefined ? fallback : key;
    },
    [language]
  );

  const currentLanguageMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageMeta,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
