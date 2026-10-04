import { useMemo, type CSSProperties } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Download, MoveRight, TrendingDown, TrendingUp } from "lucide-react";
import { useRegion } from "@/state/RegionContext";
import { recommend, scoreSite, trend } from "@/engine/score";
import { explain } from "@/engine/explain";
import { PATHWAYS } from "@/engine/pathways";
import { downloadFhirJson } from "@/fhir/download";
import { RiskBadge } from "@/components/RiskBadge";
import { RiskMeter } from "@/components/RiskMeter";
import { ContributionBars } from "@/components/ContributionBars";
import { TrendChart } from "@/components/TrendChart";
import { OneHealthPanel } from "@/components/OneHealthPanel";
import { Button } from "@/components/ui/button";
import type { Trend } from "@/types";

const TREND_ICON: Record<Trend, typeof TrendingUp> = {
  Increasing: TrendingUp,
  Decreasing: TrendingDown,
  Stable: MoveRight,
};

const DISCLAIMER =
  "Verdant identifies conditions associated with increased bloom risk. It does not confirm toxin presence or replace field sampling.";

export default function SiteDetail() {
  const { id } = useParams();
  const { config, sites, reports } = useRegion();

  const results = useMemo(() => sites.map((s) => scoreSite(s, config)), [sites, config]);
  const index = sites.findIndex((s) => s.id === id);

  if (index < 0) {
    return (
      <div className="flex flex-col items-start gap-4 py-12">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] md:text-[40px]">Site not found</h1>
        <p className="max-w-[68ch] text-muted-foreground">
          There is no site called "{id}" in the current region.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden />
          Back to the dashboard
        </Link>
      </div>
    );
  }

  const site = sites[index];
  const result = results[index];
  const lead = result.pathways.find((p) => p.pathwayId === result.leadingPathway)!;
  const t = trend(site.history);
  const TrendIcon = TREND_ICON[t];
  const topId = results.reduce((best, r, i) => (r.siteScore > results[best].siteScore ? i : best), 0);
  const isRankOne = topId === index;
  const prototype = config.dataStatus === "prototype";

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden />
            Dashboard
          </Link>
          <h1 className="mt-3 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[40px]">{site.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <TrendIcon className="size-4" strokeWidth={1.75} aria-hidden />
              {t}
            </span>
            <span>
              {prototype ? "Prototype data" : "Demonstration data"}, updated Oct 4, 2026
            </span>
          </p>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="font-mono text-[48px] font-semibold leading-none tabular-nums md:text-[72px]">
              {result.siteScore}
            </span>
            <RiskBadge category={result.category} score={result.siteScore} />
          </div>
          <p className="mt-4 max-w-[44ch] text-sm leading-[1.45] text-muted-foreground">{DISCLAIMER}</p>
        </div>

        <div className="flex flex-col gap-6 md:col-span-7">
          <RiskMeter score={result.siteScore} category={result.category} />
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
            <div className="border-l-[3px] border-primary px-3 py-2">
              <p className="text-xs font-semibold text-primary">Verdant recommendation</p>
              <p className="mt-1 text-sm">{recommend(result.category)}</p>
              {isRankOne && <p className="mt-1 text-sm font-semibold">Recommended first sampling target</p>}
            </div>
            <p className="rounded-sm border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
              Official advisory: none issued
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <h2 className="text-[28px] font-semibold leading-tight">Why is risk elevated?</h2>
          <p className="mt-2 max-w-[68ch] leading-[1.55]">{explain(result)}</p>
          <div className="mt-6">
            <ContributionBars contributions={lead.contributions} missing={lead.missing} coverage={lead.coverage} />
          </div>
        </div>
        <div className="md:col-span-5">
          <h2 className="text-xl font-semibold leading-tight">Last 7 days</h2>
          <p className="mb-2 mt-1 text-sm text-muted-foreground">Site score by day</p>
          <TrendChart history={site.history} category={result.category} />
        </div>
      </section>

      <section aria-labelledby="pathways">
        <h2 id="pathways" className="mb-4 text-[28px] font-semibold leading-tight">
          Pathway scores
        </h2>
        <div
          className="grid divide-y divide-border rounded-sm border border-border bg-card md:grid-cols-[repeat(var(--n),minmax(0,1fr))] md:divide-x md:divide-y-0"
          style={{ "--n": result.pathways.length } as CSSProperties}
        >
          {result.pathways.map((p) => (
            <div key={p.pathwayId} className="p-4">
              <p className="text-sm font-medium">
                {PATHWAYS[p.pathwayId].label}
                {p.pathwayId === result.leadingPathway && <span className="text-muted-foreground"> (leading)</span>}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="font-mono text-[28px] font-semibold leading-none tabular-nums">{p.score}</span>
                <RiskBadge category={p.category} size="sm" />
              </div>
              {p.coverage < 1 && (
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  Partial data: {Math.round(p.coverage * 100)}% of factors
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <OneHealthPanel lakeMead={config.id === "lake-mead"} />

      <section className="flex flex-col items-start gap-4 border-t border-border pt-6">
        <p className="max-w-[68ch] text-sm text-muted-foreground">{DISCLAIMER}</p>
        <Button variant="outline" onClick={() => downloadFhirJson(config, results, reports)}>
          <Download strokeWidth={1.75} aria-hidden />
          Export FHIR JSON
        </Button>
      </section>
    </div>
  );
}
