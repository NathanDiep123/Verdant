import { useMemo, type CSSProperties } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Download, MessageSquarePlus, MoveRight, TrendingDown, TrendingUp } from "lucide-react";
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
import { Annotation, ContourField, InkRule } from "@/components/FieldMarks";
import { CommunityReportItem } from "@/components/CommunityReportItem";
import { citizenEvidence, newestFirst } from "@/lib/communityReports";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-[1.875rem] leading-[1.05] tracking-[-0.015em] md:text-[2.5rem]">Site not found</h1>
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
  const siteReports = newestFirst(reports.filter((r) => r.siteId === site.id));
  const evidence = citizenEvidence(result);
  const prototype = config.dataStatus === "prototype";

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="relative grid gap-8 overflow-hidden rounded-[3px] border border-border bg-card p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] md:grid-cols-12 md:items-center md:gap-12 md:p-6">
        <ContourField className="pointer-events-none absolute -top-16 -right-16 hidden h-48 w-72 text-olive/25 md:block" />
        <div className="relative md:col-span-5">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden />
            Dashboard
          </Link>
          <h1 className="mt-3 text-[1.875rem] leading-[1.05] tracking-[-0.015em] md:text-[2.5rem]">{site.name}</h1>
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
            <span className="font-heading text-[3rem] leading-none tracking-[-0.02em] tabular-nums lining-nums md:text-[4.5rem]">
              {result.siteScore}
            </span>
            <RiskBadge category={result.category} />
          </div>
          <p className="mt-4 max-w-[44ch] text-sm leading-[1.45] text-muted-foreground">{DISCLAIMER}</p>
        </div>

        <div className="relative flex flex-col gap-6 md:col-span-7">
          <RiskMeter score={result.siteScore} category={result.category} />
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
            <div className="border-l-[3px] border-primary px-3 py-2">
              <p className="font-mono text-xs font-medium text-primary">Verdant recommendation</p>
              <p className="mt-1 text-sm">{recommend(result.category)}</p>
              {isRankOne && <Annotation direction="left" className="mt-2"><span className="font-semibold">Recommended first sampling target</span></Annotation>}
            </div>
            <p className="rounded-[3px] border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
              Official advisory: none issued
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <h2 className="text-[1.75rem] leading-[1.15] tracking-[-0.01em]">Why is risk elevated?</h2>
          <p className="mt-2 max-w-[68ch] leading-[1.55]">{explain(result)}</p>
          <div className="mt-6">
            <ContributionBars contributions={lead.contributions} missing={lead.missing} coverage={lead.coverage} />
          </div>
        </div>
        <div className="md:col-span-5">
          <h2 className="text-xl leading-[1.3]">Last 7 days</h2>
          <p className="mb-2 mt-1 text-sm text-muted-foreground">Site score by day</p>
          <TrendChart history={site.history} category={result.category} />
        </div>
      </section>

      <InkRule className="text-border" />

      <section id="community" aria-labelledby="community-h" className="flex max-w-[68ch] scroll-mt-6 flex-col items-start gap-4">
        <h2 id="community-h" className="text-[1.75rem] leading-[1.15] tracking-[-0.01em]">Community observations</h2>
        <div className="border-l-[3px] border-primary px-3 py-2">
          <p className="font-mono text-xs font-medium text-primary">Citizen evidence</p>
          <p className="mt-1 text-sm">
            {evidence ? (
              <>
                Citizen evidence: {evidence.value}/100, adds <span className="font-mono">{evidence.points}</span> points to the{" "}
                {PATHWAYS[evidence.pathwayId].label} score.
              </>
            ) : (
              "No citizen evidence in this score yet."
            )}
          </p>
        </div>
        {siteReports.length > 0 ? (
          <div className="w-full">
            {siteReports.map((r) => (
              <CommunityReportItem key={r.id} report={r} siteName={site.name} showSite={false} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No community reports for this site yet.</p>
        )}
        <Link to={`/report?site=${site.id}`} className={cn(buttonVariants(), "h-auto min-h-9 px-3 py-2")}>
          <MessageSquarePlus strokeWidth={1.75} aria-hidden />
          Add an observation at {site.name}
        </Link>
      </section>

      <InkRule className="text-border" />

      <section aria-labelledby="pathways">
        <h2 id="pathways" className="mb-4 text-[1.75rem] leading-[1.15] tracking-[-0.01em]">
          Pathway scores
        </h2>
        <div
          className="grid divide-y divide-border rounded-[3px] border border-border bg-card md:grid-cols-[repeat(var(--n),minmax(0,1fr))] md:divide-x md:divide-y-0"
          style={{ "--n": result.pathways.length } as CSSProperties}
        >
          {result.pathways.map((p) => (
            <div key={p.pathwayId} className="p-4">
              <p className="text-sm font-medium">
                {PATHWAYS[p.pathwayId].label}
                {p.pathwayId === result.leadingPathway && <span className="text-muted-foreground"> (leading)</span>}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="font-heading text-[1.75rem] leading-none tabular-nums lining-nums">{p.score}</span>
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

      <InkRule className="text-border" />

      <OneHealthPanel lakeMead={config.id === "lake-mead"} />

      <section className="flex flex-col items-start gap-4">
        <Button variant="outline" onClick={() => downloadFhirJson(config, results, reports)}>
          <Download strokeWidth={1.75} aria-hidden />
          Export FHIR JSON
        </Button>
      </section>
    </div>
  );
}
