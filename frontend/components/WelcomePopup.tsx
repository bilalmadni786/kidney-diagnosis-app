"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { t, type LanguageCode } from "@/lib/translations";

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export default function WelcomePopup({ open, onClose, language }: WelcomePopupProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-dark/70 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Popup */}
          <motion.div
            key="popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative w-full max-w-md rounded-3xl glass-card p-6 sm:p-8 text-center max-h-[90vh] overflow-y-auto"
              style={{
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
                boxShadow:
                  "0 0 60px rgba(220,38,38,0.12), 0 0 120px rgba(14,165,233,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {/* Glowing ring gradient — red to cyan */}
              <div
                className="absolute -inset-px rounded-3xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(220,38,38,0.4) 0%, rgba(14,165,233,0.3) 50%, rgba(20,184,166,0.2) 100%)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "1px",
                  borderRadius: "inherit",
                }}
              />

              {/* Floating icon — red glow */}
              <motion.div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(220,38,38,0.3), rgba(14,165,233,0.2))",
                  border: "1px solid rgba(220,38,38,0.5)",
                  boxShadow: "0 0 28px rgba(220,38,38,0.4), 0 0 8px rgba(14,165,233,0.2)",
                }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Activity className="h-8 w-8 text-red-400" aria-hidden />
              </motion.div>

              {/* Title */}
              <h1
                id="welcome-title"
                className="mb-1 text-2xl font-bold gradient-text"
              >
                {t("welcomeTitle", language)}
              </h1>
              <p className="mb-1 text-sm font-medium text-teal-300">
                {t("welcomeSubtitle", language)}
              </p>
              <p className="mb-5 text-xs text-slate-500">
                {t("welcomeCreatedBy", language)}
              </p>

              {/* Description */}
              <p className="mb-4 text-sm leading-relaxed text-slate-300">
                {t("welcomeDescription", language)}
              </p>

              {/* Capabilities */}
              <div
                className="mb-5 rounded-xl px-4 py-3 text-sm text-cyan-300"
                style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)" }}
              >
                {t("welcomeCapabilities", language)}
              </div>

              {/* Disclaimer */}
              <p
                className="mb-6 rounded-xl px-4 py-3 text-xs leading-relaxed text-amber-300/80 italic"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                {t("welcomeDisclaimer", language)}
              </p>

              {/* CTA button — medical red */}
              <motion.button
                onClick={onClose}
                className="w-full rounded-xl py-3.5 text-sm font-semibold text-white btn-glow-red btn-3d"
                style={{
                  background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label={t("getStarted", language)}
              >
                {t("getStarted", language)} →
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
