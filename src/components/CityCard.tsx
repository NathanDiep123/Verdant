import type { ReactNode } from "react";
import type { SiteConfig } from "@/types";
import { PATHWAYS } from "@/engine/pathways";

export const dataStatusLabel: Record<SiteConfig["dataStatus"], string> = {
  prototype: "Prototype data",
  "resilience-map-export": "Resilience Map export",
  "synthetic-demo": "Synthetic demo",
  "config-only": "Config only: ready for data",
};

const LON = [-12, 18];
const LAT = [38, 62];

/** Static locator: a hairline frame with one ink dot at the city's position over western Europe. */
function Locator({ center }: { center: [number, number] }) {
  const [lat, lon] = center;
  const x = 4 + ((lon - LON[0]) / (LON[1] - LON[0])) * 112;
  const y = 4 + (1 - (lat - LAT[0]) / (LAT[1] - LAT[0])) * 56;
  return (
    <svg viewBox="0 0 120 64" className="h-16 w-[120px] shrink-0 rounded-sm border border-border bg-card" role="img" aria-label={`Location ${lat.toFixed(2)} north, ${lon.toFixed(2)} east`}>
      <line x1="0" x2="120" y1={y} y2={y} stroke="var(--border)" strokeWidth="1" />
      <line y1="0" y2="64" x1={x} x2={x} stroke="var(--border)" strokeWidth="1" />
      <circle cx={x} cy={y} r="3.5" fill="var(--foreground)" />
    </svg>
  );
}

export default function CityCard({ city, action }: { city: SiteConfig; action?: ReactNode }) {
  const [lat, lon] = city.center;
  const pathways = [...new Set(city.pathways.map((p) => PATHWAYS[p].label))];
  return (
    <li className="flex flex-col gap-4 border-b border-border p-4 last:border-b-0 md:flex-row md:items-center md:gap-6 md:p-6">
      <Locator center={city.center} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-xl font-semibold leading-tight">{city.name}</h3>
          <span className="text-sm text-muted-foreground">{city.country}</span>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {lat.toFixed(2)} N, {lon.toFixed(2)} E
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="rounded-sm border border-dashed border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {dataStatusLabel[city.dataStatus]}
          </span>
          <span className="font-mono text-xs text-foreground">{pathways.join(" / ")}</span>
        </div>
      </div>
      {action && <div className="md:ml-auto">{action}</div>}
    </li>
  );
}
