import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export const CLASS_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  Normal: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    bar: "bg-emerald-500",
  },
  Cyst: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    bar: "bg-amber-500",
  },
  Stone: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    bar: "bg-orange-500",
  },
  Tumor: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    bar: "bg-red-500",
  },
};
