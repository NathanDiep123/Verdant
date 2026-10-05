import { Eye, OctagonAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Category } from "@/types";

export const CATEGORY_STYLE: Record<
  Category,
  { color: string; icon: LucideIcon; markerSize: number }
> = {
  Low: { color: "#276E90", icon: ShieldCheck, markerSize: 24 },
  Moderate: { color: "#E0AE2E", icon: Eye, markerSize: 28 },
  High: { color: "#E07433", icon: TriangleAlert, markerSize: 32 },
  "Very High": {
    color: "#A3241B",
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
