"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Scan } from "lucide-react";
import type { LanguageCode } from "@/lib/translations";

interface ScannerModalProps {
  imageUrl: string;
  fileName: string;
  language: LanguageCode;
  open: boolean;
}

const CORNERS = [
  "top-2 left-2 border-t-2 border-l-2",
  "top-2 right-2 border-t-2 border-r-2",
  "bottom-2 left-2 border-b-2 border-l-2",
  "bottom-2 right-2 border-b-2 border-r-2",
];

export default function ScannerModal({ imageUrl, fileName, open }: ScannerModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0a0a14]/90 backdrop-blur-lg" />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden"
            initial={{ scale: 0.85, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            style={{
              background: "rgba(8, 8, 18, 0.98)",
              border: "1px solid rgba(220,38,38,0.45)",
              boxShadow:
                "0 0 50px rgba(220,38,38,0.18), 0 0 100px rgba(14,165,233,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2.5 px-4 py-3 border-b border-white/10"
              style={{ background: "rgba(220,38,38,0.06)" }}
            >
              <Scan className="h-4 w-4 text-red-400 animate-pulse shrink-0" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white leading-none">Analyzing CT Scan</p>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{fileName}</p>
              </div>
              {/* LIVE indicator */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                </span>
                <span className="text-[10px] font-bold text-red-400 tracking-widest">LIVE</span>
              </div>
            </div>

            {/* Image + Scanner beam */}
            <div className="relative overflow-hidden bg-black" style={{ aspectRatio: "1/1", maxHeight: "min(70vw, 300px)" }}>
              {/* CT Scan image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="CT scan being analyzed"
                className="w-full h-full object-contain select-none"
                draggable={false}
              />

              {/* Horizontal scan-line grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(220,38,38,0.07) 0px, rgba(220,38,38,0.07) 1px, transparent 1px, transparent 18px)",
                }}
              />

              {/* Vignette edges */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 55%, rgba(8,8,18,0.6) 100%)",
                }}
              />

              {/* Corner brackets — medical scanner frame */}
              {CORNERS.map((cls, i) => (
                <div
                  key={i}
                  className={`absolute h-6 w-6 ${cls} border-red-500/70`}
                />
              ))}

              {/* Scanner beam — moves top → bottom → top */}
              <motion.div
                className="absolute left-0 right-0 pointer-events-none"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Upper glow trail */}
                <div
                  style={{
                    height: "50px",
                    background:
                      "linear-gradient(to bottom, transparent, rgba(220,38,38,0.10))",
                  }}
                />
                {/* Main beam */}
                <div
                  style={{
                    height: "3px",
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(220,38,38,0.55) 12%, rgba(255,120,100,0.95) 35%, rgba(255,255,255,1) 50%, rgba(255,120,100,0.95) 65%, rgba(220,38,38,0.55) 88%, transparent 100%)",
                    boxShadow:
                      "0 0 10px rgba(255,100,80,1), 0 0 22px rgba(220,38,38,0.8), 0 0 50px rgba(220,38,38,0.35)",
                  }}
                />
                {/* Lower glow trail */}
                <div
                  style={{
                    height: "50px",
                    background:
                      "linear-gradient(to top, transparent, rgba(220,38,38,0.10))",
                  }}
                />
              </motion.div>
            </div>

            {/* Footer — audio bars + status */}
            <div
              className="flex items-center justify-between px-4 py-3 border-t border-white/10"
              style={{ background: "rgba(220,38,38,0.04)" }}
            >
              {/* Audio-visualizer bars */}
              <div className="flex items-end gap-0.5" aria-hidden>
                {[0.7, 1.4, 0.9, 1.7, 1.1, 1.5, 0.8].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-red-500"
                    animate={{ height: ["5px", `${10 + i * 2}px`, "5px"] }}
                    transition={{
                      duration: 0.7 + i * 0.05,
                      repeat: Infinity,
                      delay: delay * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-400">AI is analyzing your scan…</p>

              <p className="text-[10px] font-mono text-red-500/50 tracking-widest">KidneyAI</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
