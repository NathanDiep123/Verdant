import Papa from "papaparse";
import type { Factors, FactorId, SiteRecord } from "@/types";
import { columnMap, type ColumnMap } from "./columnMap";

type Row = Record<string, string>;

/** Latest row per site, mapped to 0-100 factor scores (PLAN 6.2). */
export function parseResmapCsv(text: string, map: ColumnMap = columnMap): SiteRecord[] {
  const rows = Papa.parse<Row>(text, { header: true, skipEmptyLines: true }).data;
  const bySite = new Map<string, Row[]>();
  for (const r of rows) bySite.set(r[map.id], [...(bySite.get(r[map.id]) ?? []), r]);
  for (const list of bySite.values()) list.sort((a, b) => (a[map.date] < b[map.date] ? -1 : 1));

  const ids = [...bySite.keys()];
  const latest = ids.map((id) => bySite.get(id)!.at(-1)!);
  const ids2 = Object.keys(map.factors) as FactorId[];

  // Per-column scaler: as-is when every value in the city is within 0-100, else min-max.
  const scalers = Object.fromEntries(
    ids2.map((f) => {
      const vals = latest.map((r) => Number(r[map.factors[f]!])).filter(Number.isFinite);
      const [min, max] = [Math.min(...vals), Math.max(...vals)];
      const asIs = min >= 0 && max <= 100;
      const scale = (v: number) => {
        const n = asIs ? v : max === min ? 0 : ((v - min) / (max - min)) * 100;
        return Math.round(map.invert.includes(f) ? 100 - n : n);
      };
      return [f, scale];
    }),
  ) as Record<FactorId, (v: number) => number>;

  const factorsOf = (r: Row): Factors => {
    const out: Factors = { citizen_evidence: 0 };
    for (const f of ids2) {
      const v = Number(r[map.factors[f]!]);
      if (Number.isFinite(v)) out[f] = scalers[f](v);
    }
    return out;
  };
  // History: mean of the scored factors per row, last 7 rows, padded at the front.
  const meanOf = (r: Row) => {
    const v = Object.entries(factorsOf(r)).filter(([k]) => k !== "citizen_evidence").map(([, x]) => x);
    return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : 0;
  };

  return ids.map((id, i) => {
    const r = latest[i];
    const hist = bySite.get(id)!.slice(-7).map(meanOf);
    while (hist.length < 7) hist.unshift(hist[0]);
    return {
      id,
      name: r[map.name],
      lat: Number(r[map.lat]),
      lon: Number(r[map.lon]),
      factors: factorsOf(r),
      history: hist,
    };
  });
}
