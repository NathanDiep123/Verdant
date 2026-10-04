import Papa from "papaparse";
import raw from "../../../data/raw/oah-coimbra-eo-summary.csv?raw";

export type CoimbraEoRow = {
  period: string;
  ndviMean: number;
  ndviMin: number;
  ndviMax: number;
  ndwiMean: number;
  ndwiMin: number;
  ndwiMax: number;
};

const COLUMN: Record<string, keyof CoimbraEoRow> = {
  "NDVI|Mean": "ndviMean",
  "NDVI|Min": "ndviMin",
  "NDVI|Max": "ndviMax",
  "NDWI|Mean": "ndwiMean",
  "NDWI|Min": "ndwiMin",
  "NDWI|Max": "ndwiMax",
};

/**
 * Area-level monthly Earth-observation summary for Coimbra (OneAquaHealth Resilience Map export).
 * Only NDVI and NDWI are read. GEMI is corrupt in the export and every other index is ignored.
 * Months without values are skipped (2025-02 is blank in the export), so the series is the last 24 months that have all six values.
 */
function build(): CoimbraEoRow[] {
  const { data } = Papa.parse<Record<string, string>>(raw.replace(/^\uFEFF/, ""), { header: true, skipEmptyLines: true });
  const byPeriod = new Map<string, Partial<CoimbraEoRow>>();
  for (const r of data) {
    const key = COLUMN[`${r.Index}|${r.Stat}`];
    const value = Number(r.Value);
    if (!key || r.Value === "" || !Number.isFinite(value)) continue;
    byPeriod.set(r.Period, { ...byPeriod.get(r.Period), period: r.Period, [key]: value });
  }
  return [...byPeriod.values()]
    .filter((p) => Object.keys(p).length === 7)
    .sort((a, b) => a.period!.localeCompare(b.period!))
    .slice(-24) as CoimbraEoRow[];
}

export const coimbraEoSeries: CoimbraEoRow[] = build();
