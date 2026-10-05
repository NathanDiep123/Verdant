import { useMemo } from "react";
import { CoimbraSatelliteChart } from "@/components/CoimbraSatelliteChart";
import { CommunityReportsFeed } from "@/components/CommunityReportsFeed";
import { SpecimenTag } from "@/components/FieldMarks";
import { KpiCards } from "@/components/KpiCards";
import { RiskMap } from "@/components/RiskMap";
import { StatHero } from "@/components/StatHero";
import { SamplingPriorityList, type SiteRow } from "@/components/SamplingPriorityList";
import { coimbraDataStatus } from "@/data/oah/coimbra";
import { scoreSite, trend } from "@/engine/score";
import { DASHBOARD } from "@/i18n/dashboard";
import { fmt } from "@/i18n/lang";
import { useStrings } from "@/state/LanguageContext";
import { useRegion } from "@/state/RegionContext";


export default function Dashboard() {
  const { regionId, config, sites, reports } = useRegion();
  const s = useStrings(DASHBOARD);

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

  const dataLabel = 
    regionId === "lake-mead" ? s.dataLakeMead : coimbraDataStatus === "synthetic-demo" ? s.dataSynthetic : s.dataExport;

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <div className="flex flex-col gap-6 md:gap-4">
        <div className="-mt-2 md:mb-2">
          <StatHero />
        </div>
        <div className="flex flex-col gap-1 xl:flex-row xl:items-baseline xl:gap-4">
          <h1 className="text-[1.75rem] leading-[1.1] tracking-[-0.015em] md:text-[2rem]">
            {fmt(s.title, { name: config.name })}
          </h1>
          <p className="max-w-[68ch] text-sm text-muted-foreground">
            {s.subtitle}
          </p>
          <SpecimenTag className="mt-1 xl:mt-0 xl:ml-auto">{dataLabel}</SpecimenTag>
        </div>
        <KpiCards
          rows={rows}
          reportCount={reports.length}
          siteCount={new Set(reports.map((r) => r.siteId)).size}
          regionName={config.name}
          showOfficial={regionId === "lake-mead"}
        />
        <div id="map" className="grid scroll-mt-20 gap-6 xl:h-[620px] xl:grid-cols-12">
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
