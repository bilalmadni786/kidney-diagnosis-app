"use client";

import { motion } from "framer-motion";

// One ECG cycle = 36 units wide, baseline y=10 in a 20-unit tall viewBox
const CYCLE_W = 36;
const TOTAL_CYCLES = 12;
const VISIBLE_CYCLES = 6;
const ANIM_W = CYCLE_W * VISIBLE_CYCLES; // 216 — scroll distance = one full loop half

function buildEcgPath(cycles: number): string {
  const segs: string[] = [`M0,10`];
  for (let i = 0; i < cycles; i++) {
    const o = i * CYCLE_W;
    segs.push(
      `L${o + 4},10`,        // flat
      `L${o + 6},8`,         // P wave rise
      `L${o + 8},12`,        // P wave fall
      `L${o + 10},10`,       // back to baseline
      `L${o + 12},10`,       // flat before QRS
      `L${o + 14},1`,        // QRS peak (spike up)
      `L${o + 15},19`,       // QRS trough (spike down)
      `L${o + 16},10`,       // back to baseline
      `L${o + 18},10`,       // flat after QRS
      `L${o + 21},5`,        // T wave peak
      `L${o + 24},10`,       // T wave end
      `L${o + CYCLE_W},10`,  // flat to next cycle
    );
  }
  return segs.join(" ");
}

const ECG_PATH = buildEcgPath(TOTAL_CYCLES); // 12 cycles = 432 units

export default function HeartbeatLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      aria-hidden
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
      }}
    >
      <svg
        viewBox={`0 0 ${ANIM_W} 20`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <filter id="ecg-glow" x="-10%" y="-80%" width="120%" height="260%">
            <feGaussianBlur stdDeviation="0.7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Scrolling ECG path — loops seamlessly */}
        <motion.g
          animate={{ x: [0, -ANIM_W] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
        >
          <path
            d={ECG_PATH}
            fill="none"
            stroke="rgba(220,38,38,0.88)"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ecg-glow)"
          />
        </motion.g>
      </svg>
    </div>
  );
}
