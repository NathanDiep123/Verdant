import { CATEGORY_CLASS, CATEGORY_STYLE } from "@/lib/risk";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const SIZE = {
  sm: "gap-1 px-1.5 py-1 text-[11px]",
  md: "gap-1.5 px-2 py-1 text-xs",
  lg: "gap-2 px-3 py-2 text-sm",
} as const;

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
        "inline-flex items-center whitespace-nowrap rounded-sm border font-semibold leading-none",
        CATEGORY_CLASS[category],
        SIZE[size],
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
      {score !== undefined && (
        <span className="font-mono font-semibold tabular-nums">{Math.round(score)}</span>
      )}
      <span className="uppercase tracking-[0.04em]">{label}</span>
    </span>
  );
}
