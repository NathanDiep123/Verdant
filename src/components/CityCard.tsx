import type { ReactNode } from "react";
import type { SiteConfig } from "@/types";
import { PATHWAYS } from "@/engine/pathways";

export const dataStatusLabel: Record<SiteConfig["dataStatus"], string> = {
  prototype: "Prototype data",
  "resilience-map-export": "Resilience Map export",
  "synthetic-demo": "Synthetic demo",
  "config-only": "Config only: ready for data",
};

export default function CityCard({ city, action }: { city: SiteConfig; action?: ReactNode }) {
  const [lat, lon] = city.center;
  const pathways = [...new Set(city.pathways.map((p) => PATHWAYS[p].label))];
  return (
    <li className="flex flex-col gap-4 border-b border-border p-4 last:border-b-0 md:flex-row md:items-center md:gap-6 md:p-6">
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
