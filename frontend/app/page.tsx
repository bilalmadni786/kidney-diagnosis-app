"use client";

import { useState, useEffect } from "react";
import WelcomePopup from "@/components/WelcomePopup";
import ChatInterface from "@/components/ChatInterface";
import type { LanguageCode } from "@/lib/translations";

const LANG_KEY = "kidneyai_language";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>("en");

  // Restore saved language
  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as LanguageCode | null;
    if (saved) setLanguage(saved);
  }, []);

  function handleLanguageChange(lang: LanguageCode) {
    setLanguage(lang);
    localStorage.setItem(LANG_KEY, lang);
  }

  return (
    <>
      <WelcomePopup
        open={showWelcome}
        onClose={() => setShowWelcome(false)}
        language={language}
      />
      <ChatInterface language={language} onLanguageChange={handleLanguageChange} />
    </>
  );
}
