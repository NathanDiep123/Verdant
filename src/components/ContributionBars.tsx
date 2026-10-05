import type { Contribution, FactorId } from "@/types";
import { fmt } from "@/i18n/lang";
import { FACTOR_LABEL, SITE_DETAIL } from "@/i18n/siteDetail";
import { useLang } from "@/state/LanguageContext";

export function ContributionBars({
  contributions,
  missing,
  coverage,
}: {
  contributions: Contribution[];
  missing: FactorId[];
  coverage: number;
}) {
  const { lang } = useLang();
  const s = SITE_DETAIL[lang];
  const label = FACTOR_LABEL[lang];
  return (
    <div>
      {coverage < 1 && (
        <p className="mb-3 font-mono text-xs text-muted-foreground">
          {fmt(s.partial, { pct: Math.round(coverage * 100) })}
        </p>
      )}
      <ul className="flex flex-col gap-3">
        {contributions.map((c) => (
          <li key={c.factor} className="grid grid-cols-1 items-center gap-x-3 gap-y-1 md:grid-cols-[180px_1fr]">
            <span className="text-sm font-medium">{label[c.factor]}</span>
            <span className="flex items-center gap-2">
              <span className="block h-2.5 shrink-0 rounded-[2px] bg-primary" style={{ width: `${Math.max(1, c.points)}%` }} />
              <span className="whitespace-nowrap font-mono text-xs leading-tight tabular-nums">
                {c.points.toFixed(1)} {s.pts}
                <span className="block text-muted-foreground">
                  {c.value} × {c.weight.toFixed(2)}
                </span>
              </span>
            </span>
          </li>
        ))}
      </ul>
      {missing.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {fmt(s.noData, { list: missing.map((m) => label[m].toLowerCase()).join(", ") })}
        </p>
      )}
    </div>
  );
}
