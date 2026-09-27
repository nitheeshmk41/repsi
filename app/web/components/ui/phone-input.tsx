"use client";

import { useState } from "react";

export interface PhoneInputProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: boolean;
}

const COUNTRY_CODES = [
  { code: "+91", country: "IN", flag: "🇮🇳", label: "India (+91)" },
  { code: "+1", country: "US", flag: "🇺🇸", label: "USA (+1)" },
  { code: "+44", country: "GB", flag: "🇬🇧", label: "UK (+44)" },
  { code: "+971", country: "AE", flag: "🇦🇪", label: "UAE (+971)" },
  { code: "+65", country: "SG", flag: "🇸🇬", label: "Singapore (+65)" },
  { code: "+61", country: "AU", flag: "🇦🇺", label: "Australia (+61)" },
  { code: "+1", country: "CA", flag: "🇨🇦", label: "Canada (+1)" },
  { code: "+49", country: "DE", flag: "🇩🇪", label: "Germany (+49)" },
];

export function PhoneInput({
  id = "phone",
  value,
  onChange,
  onBlur,
  placeholder = "98765 43210",
  className = "",
  required = false,
  error = false,
}: PhoneInputProps) {
  // Extract initial country code if present, default +91
  const initialCountry = COUNTRY_CODES.find((c) => value.startsWith(c.code)) || COUNTRY_CODES[0];
  const [selectedCountry, setSelectedCountry] = useState(initialCountry.code);

  const rawNumber = value.startsWith(selectedCountry)
    ? value.slice(selectedCountry.length).trim()
    : value;

  const handleCountryChange = (newCode: string) => {
    setSelectedCountry(newCode);
    const cleanDigits = rawNumber.replace(/[^0-9]/g, "");
    onChange(cleanDigits ? `${newCode} ${cleanDigits}` : "");
  };

  const handleNumberChange = (num: string) => {
    const cleanDigits = num.replace(/[^0-9\s-]/g, "");
    onChange(cleanDigits ? `${selectedCountry} ${cleanDigits}` : "");
  };

  return (
    <div className={`flex items-center rounded-xl border bg-white dark:bg-zinc-900 focus-within:ring-2 transition-all shadow-2xs overflow-hidden ${
      error
        ? "border-red-500 focus-within:ring-red-500 focus-within:border-red-500"
        : "border-[#D5DDD7] dark:border-zinc-800 focus-within:ring-[#16A34A] focus-within:border-[#16A34A]"
    } ${className}`}>
      {/* Country Select */}
      <div className="relative border-r border-[#E2E8E4] dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-800/50">
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="h-10 pl-3 pr-6 text-xs font-bold text-slate-700 dark:text-zinc-200 bg-transparent border-none outline-none cursor-pointer appearance-none"
          aria-label="Select country code"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={`${c.country}-${c.code}`} value={c.code} className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-400">▼</span>
      </div>

      {/* Phone Number Input */}
      <input
        id={id}
        type="tel"
        required={required}
        placeholder={placeholder}
        value={rawNumber}
        onChange={(e) => handleNumberChange(e.target.value)}
        onBlur={onBlur}
        className="flex-1 h-10 px-3 text-sm text-[#111714] dark:text-white placeholder:text-slate-400 bg-transparent outline-none"
      />
    </div>
  );
}
