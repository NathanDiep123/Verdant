import type { Category } from "@/types";

const SEGMENTS: { category: Category; key: string }[] = [
  { category: "Low", key: "low" },
  { category: "Moderate", key: "moderate" },
  { category: "High", key: "high" },
  { category: "Very High", key: "very-high" },
];

export function RiskMeter({ score, category }: { score: number; category: Category }) {
  const pos = Math.min(100, Math.max(0, score));
  return (
    <div role="img" aria-label={`Risk meter: ${score} out of 100, ${category}`} className="w-full pt-6">
      <div className="relative">
        <div className="grid grid-cols-4 gap-0.5">
          {SEGMENTS.map((s) => (
            <div
              key={s.key}
              className="h-3.5 rounded-sm transition-colors duration-300"
              style={{ background: `var(--risk-${s.key}${s.category === category ? "" : "-tint"})` }}
            />
          ))}
        </div>
        <div
          className="absolute -top-6 flex flex-col items-center transition-[left] duration-[600ms] ease-out motion-reduce:transition-none"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        >
          <span className="font-mono text-sm font-semibold tabular-nums leading-none">{score}</span>
          <span className="mt-1 h-[22px] w-0.5 bg-foreground" />
        </div>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-0.5 text-center text-xs text-muted-foreground">
        {SEGMENTS.map((s) => (
          <span key={s.key}>{s.category}</span>
        ))}
      </div>
      <div className="mt-1 flex justify-between font-mono text-xs tabular-nums text-muted-foreground">
        {[0, 25, 50, 75, 100].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}
