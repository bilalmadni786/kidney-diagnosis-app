"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { t, type LanguageCode } from "@/lib/translations";

interface TypingIndicatorProps {
  language: LanguageCode;
}

export default function TypingIndicator({ language }: TypingIndicatorProps) {
  return (
    <motion.div
      className="flex items-end gap-3 px-4 py-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.25), rgba(20,184,166,0.25))", border: "1px solid rgba(14,165,233,0.3)" }}
      >
        <Activity className="h-4 w-4 text-cyan-400" aria-hidden />
      </div>

      {/* Bubble */}
      <div className="glass-card flex items-center gap-1.5 rounded-2xl rounded-bl-sm px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-cyan-400"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        <span className="sr-only">{t("thinking", language)}</span>
      </div>
    </motion.div>
  );
}
