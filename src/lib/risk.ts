import { Eye, OctagonAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Category } from "@/types";

export const CATEGORY_STYLE: Record<
  Category,
  { color: string; label: string; icon: LucideIcon; markerSize: number }
> = {
  Low: { color: "#3E9A5A", label: "Low", icon: ShieldCheck, markerSize: 24 },
  Moderate: { color: "#F2C230", label: "Moderate", icon: Eye, markerSize: 28 },
  High: { color: "#E8762B", label: "High", icon: TriangleAlert, markerSize: 32 },
  "Very High": {
    color: "#B3261E",
    label: "Very High",
    icon: OctagonAlert,
    markerSize: 36,
  },
};

/** Tailwind classes per category: tint background, ink text, solid border. */
export const CATEGORY_CLASS: Record<Category, string> = {
  Low: "bg-risk-low-tint text-risk-low-ink border-risk-low",
  Moderate: "bg-risk-moderate-tint text-risk-moderate-ink border-risk-moderate",
  High: "bg-risk-high-tint text-risk-high-ink border-risk-high",
  "Very High": "bg-risk-very-high-tint text-risk-very-high-ink border-risk-very-high",
};
