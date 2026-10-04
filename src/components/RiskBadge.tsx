import { CATEGORY_STYLE } from "@/lib/risk";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const SIZE = {
  sm: "gap-1 px-1.5 py-1 text-[11px]",
  md: "gap-1.5 px-2 py-1 text-xs",
  lg: "gap-2 px-3 py-2 text-sm",
} as const;

/** Stamp fill and ink per category. Border colour is the ink (.stamp uses currentColor). */
const STAMP: Record<Category, string> = {
  Low: "bg-risk-low-tint text-risk-low-ink [--stamp-bg:var(--risk-low-tint)]",
  Moderate: "bg-risk-moderate-tint text-risk-moderate-ink [--stamp-bg:var(--risk-moderate-tint)]",
  High: "bg-risk-high-tint text-risk-high-ink [--stamp-bg:var(--risk-high-tint)]",
  "Very High": "bg-risk-very-high-tint text-risk-very-high-ink [--stamp-bg:var(--risk-very-high-tint)]",
};

export function RiskBadge({
  category,
  score,
  size = "md",
  className,
}: {
  category: Category;
  score?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { icon: Icon, label } = CATEGORY_STYLE[category];
  return (
    <span
      className={cn(
        "stamp inline-flex items-center whitespace-nowrap font-semibold leading-none",
        STAMP[category],
        SIZE[size],
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
      {score !== undefined && (
        <span className="font-mono font-medium tabular-nums">{Math.round(score)}</span>
      )}
      <span className="uppercase font-semibold tracking-[0.06em]">{label}</span>
    </span>
  );
}
