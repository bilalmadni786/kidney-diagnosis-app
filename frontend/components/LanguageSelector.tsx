"use client";

import { Globe } from "lucide-react";
import { LANGUAGES, type LanguageCode } from "@/lib/translations";

interface LanguageSelectorProps {
  value: LanguageCode;
  onChange: (lang: LanguageCode) => void;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="relative flex items-center gap-1.5">
      <Globe className="h-4 w-4 text-slate-400 pointer-events-none" aria-hidden />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as LanguageCode)}
        className="appearance-none bg-transparent text-sm text-slate-300 cursor-pointer focus:outline-none hover:text-white transition-colors pr-1"
        aria-label="Select language"
      >
        {LANGUAGES.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            className="bg-slate-800 text-white"
          >
            {lang.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
