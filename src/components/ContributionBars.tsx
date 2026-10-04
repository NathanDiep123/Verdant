import type { Contribution, FactorId } from "@/types";

export const FACTOR_LABEL: Record<FactorId, string> = {
  chlorophyll: "Chlorophyll",
  water_temperature: "Water temperature",
  calm_wind: "Calm wind",
  citizen_evidence: "Citizen evidence",
  seasonality: "Bloom season",
  runoff: "Runoff",
  recreation_exposure: "Recreation exposure",
  air_temperature: "Air temperature",
  low_water: "Low water",
  lab_pathogen_risk: "Lab pathogen reading",
  contamination: "Contamination",
  ecosystem_health_deficit: "Ecosystem health deficit",
};

export function ContributionBars({
  contributions,
  missing,
  coverage,
}: {
  contributions: Contribution[];
  missing: FactorId[];
  coverage: number;
}) {
  return (
    <div>
      {coverage < 1 && (
        <p className="mb-3 font-mono text-xs text-muted-foreground">
          Partial data: {Math.round(coverage * 100)}% of factors
        </p>
      )}
      <ul className="flex flex-col gap-3">
        {contributions.map((c) => (
          <li
            key={c.factor}
            className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 md:grid-cols-[180px_1fr_auto]"
          >
            <span className="text-sm font-medium">{FACTOR_LABEL[c.factor]}</span>
            <span className="order-last col-span-2 md:order-none md:col-span-1">
              <span className="block h-2.5 rounded-[2px] bg-primary" style={{ width: `${Math.max(1, c.points)}%` }} />
            </span>
            <span className="text-right font-mono text-xs leading-tight tabular-nums">
              {c.points.toFixed(1)} pts
              <span className="block text-muted-foreground">
                {c.value} × {c.weight.toFixed(2)}
              </span>
            </span>
          </li>
        ))}
      </ul>
      {missing.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          No data: {missing.map((m) => FACTOR_LABEL[m].toLowerCase()).join(", ")}
        </p>
      )}
    </div>
  );
}
