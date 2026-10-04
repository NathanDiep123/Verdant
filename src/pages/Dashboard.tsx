import { useMemo } from "react";
import { KpiCards } from "@/components/KpiCards";
import { RiskMap } from "@/components/RiskMap";
import { SamplingPriorityList, type SiteRow } from "@/components/SamplingPriorityList";
import { coimbraDataStatus } from "@/data/oah/coimbra";
import { scoreSite, trend } from "@/engine/score";
import { useRegion } from "@/state/RegionContext";

const COIMBRA_LABEL = {
  "synthetic-demo": "Synthetic demo, structured as a Resilience Map export",
  "resilience-map-export": "Resilience Map export, Coimbra",
} as const;

export default function Dashboard() {
  const { regionId, config, sites, reports } = useRegion();

  const rows: SiteRow[] = useMemo(
    () =>
      sites
        .map((site) => ({
          site,
          result: scoreSite(site, config),
          trend: trend(site.history),
          reportCount: reports.filter((r) => r.siteId === site.id).length,
        }))
        .sort((a, b) => b.result.siteScore - a.result.siteScore),
    [sites, config, reports],
  );

  const dataLabel = regionId === "lake-mead" ? "Prototype demonstration data" : COIMBRA_LABEL[coimbraDataStatus];

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-[28px] leading-[1.1] font-bold tracking-[-0.02em] md:text-[40px]">
          Where to sample first at {config.name}
        </h1>
        <div>
          <span className="inline-block rounded-sm border border-dashed px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {dataLabel}
          </span>
        </div>
        <KpiCards
          rows={rows}
          reportCount={reports.length}
          regionName={config.name}
          showOfficial={regionId === "lake-mead"}
        />
      </div>

      <div className="grid gap-6 lg:h-[620px] lg:grid-cols-12">
        <div className="lg:col-span-7 lg:h-full">
          <RiskMap rows={rows} center={config.center} zoom={config.zoom} />
        </div>
        <div className="lg:col-span-5 lg:h-full lg:min-h-0">
          <SamplingPriorityList rows={rows} />
        </div>
      </div>
    </div>
  );
}
