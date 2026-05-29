"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { formatPercent, CLASS_COLORS } from "@/lib/utils";
import { t, type LanguageCode } from "@/lib/translations";
import type { PredictResponse } from "@/lib/api";

interface PredictionCardProps {
  result: PredictResponse;
  imageUrl: string;
  language: LanguageCode;
}

function ConditionIcon({ cls }: { cls: string }) {
  if (cls === "Normal") return <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden />;
  if (cls === "Tumor") return <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden />;
  return <Activity className="h-5 w-5 text-amber-400" aria-hidden />;
}

function ConfidenceBar({
  label,
  value,
  color,
  delay = 0,
}: {
  label: string;
  value: number;
  color: string;
  delay?: number;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value * 100), 100 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-14 shrink-0 text-slate-400 text-right">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full confidence-fill ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-10 text-slate-400">{formatPercent(value, 1)}</span>
    </div>
  );
}

export default function PredictionCard({ result, imageUrl, language }: PredictionCardProps) {
  const colors = CLASS_COLORS[result.predicted_class] ?? CLASS_COLORS["Normal"];
  const [bigBar, setBigBar] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBigBar(result.confidence * 100), 200);
    return () => clearTimeout(t);
  }, [result.confidence]);

  const sortedProbs = Object.entries(result.all_probabilities).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image thumbnail */}
        <div className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Uploaded CT scan"
            className="h-28 w-28 rounded-xl object-cover border border-white/10"
          />
        </div>

        {/* Result */}
        <div className="flex-1 min-w-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">
            {t("predictionResult", language)}
          </p>

          {/* Predicted class badge */}
          <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 mb-3 ${colors.bg}`}>
            <ConditionIcon cls={result.predicted_class} />
            <span className={`text-lg font-bold ${colors.text}`}>
              {result.predicted_class}
            </span>
          </div>

          {/* Confidence big bar */}
          <p className="mb-1 text-xs text-slate-500">
            {t("confidence", language)}: {formatPercent(result.confidence)}
          </p>
          <div className="mb-3 h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full confidence-fill ${colors.bar}`}
              style={{ width: `${bigBar}%` }}
            />
          </div>

          {/* All probabilities */}
          <p className="mb-2 text-xs font-medium text-slate-500">
            {t("allProbabilities", language)}
          </p>
          <div className="space-y-1.5">
            {sortedProbs.map(([cls, prob], i) => (
              <ConfidenceBar
                key={cls}
                label={cls}
                value={prob}
                color={CLASS_COLORS[cls]?.bar ?? "bg-slate-500"}
                delay={i * 80}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Explanation */}
      {result.explanation && (
        <div className="border-t border-white/10 px-4 py-3">
          <div className="message-prose text-sm text-slate-300">
            <ReactMarkdown>{result.explanation}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="border-t border-white/10 px-4 py-2">
        <p className="text-xs italic text-amber-400/60">
          ⚠️ {t("disclaimer", language)}
        </p>
      </div>
    </motion.div>
  );
}
