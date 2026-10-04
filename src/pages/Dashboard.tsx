import { useMemo } from "react";
import { CoimbraSatelliteChart } from "@/components/CoimbraSatelliteChart";
import { CommunityReportsFeed } from "@/components/CommunityReportsFeed";
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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] leading-[1.1] font-bold tracking-[-0.02em] md:text-[40px]">
            Where to sample first at {config.name}
          </h1>
          <p className="max-w-[68ch] text-base text-muted-foreground">
            Scores combine satellite signals, environmental data and shore reports.
          </p>
          <span className="w-fit rounded-sm border border-dashed px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {dataLabel}
          </span>
        </div>
        <KpiCards
          rows={rows}
          reportCount={reports.length}
          siteCount={new Set(reports.map((r) => r.siteId)).size}
          regionName={config.name}
          showOfficial={regionId === "lake-mead"}
        />
        <div className="mt-2 grid gap-6 xl:h-[620px] xl:grid-cols-12">
          <div className="xl:col-span-7 xl:h-full">
            <RiskMap rows={rows} center={config.center} zoom={config.zoom} />
          </div>
          <div className="xl:col-span-5 xl:h-full xl:min-h-0">
            <SamplingPriorityList rows={rows} />
          </div>
        </div>
      </div>

      <CommunityReportsFeed reports={reports} sites={sites} regionName={config.name} />

      {regionId === "coimbra" && <CoimbraSatelliteChart />}
    </div>
  );
}
