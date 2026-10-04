import { Fragment } from "react";
import { Link } from "react-router";
import { MoveRight, TrendingDown, TrendingUp } from "lucide-react";
import { RiskBadge } from "@/components/RiskBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PATHWAYS } from "@/engine/pathways";
import { recommend } from "@/engine/score";
import type { SiteResult, SiteRecord, Trend } from "@/types";

export type SiteRow = { site: SiteRecord; result: SiteResult; trend: Trend; reportCount: number };

const TREND_ICON = { Increasing: TrendingUp, Decreasing: TrendingDown, Stable: MoveRight } as const;

export function TrendLabel({ trend, stacked }: { trend: Trend; stacked?: boolean }) {
  const Icon = TREND_ICON[trend];
  return (
    <span className={`inline-flex gap-1.5 text-sm ${stacked ? "flex-col items-start gap-0.5" : "items-center"}`}>
      <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
      {trend}
    </span>
  );
}

function FirstTarget() {
  return (
    <div className="mt-2 border-l-[3px] border-primary px-3 py-2">
      <p className="text-xs font-semibold text-primary">Verdant recommendation</p>
      <p className="text-sm font-medium">Recommended first sampling target</p>
    </div>
  );
}

export function SamplingPriorityList({ rows }: { rows: SiteRow[] }) {
  return (
    <section aria-labelledby="priority-heading" className="flex h-full min-h-0 flex-col rounded-sm border bg-card">
      <div className="px-4 pt-4 pb-3">
        <h2 id="priority-heading" className="text-[28px] leading-[1.2] font-semibold">
          Sampling priority list
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Ranked by site score, highest first.</p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <Table className="hidden table-fixed md:table">
          <TableHeader className="bg-muted">
            <TableRow>
              {(
                [["Rank", "w-9"], ["Site", "w-20"], ["Risk", "w-[100px]"], ["Leading pathway", "w-[76px]"], ["Trend", "w-[72px]"], ["Reports", "w-[58px]"], ["Action", ""]] as const
              ).map(([h, w]) => (
                <TableHead key={h} className={`h-auto px-1.5 py-2 text-sm font-medium whitespace-normal text-foreground first:pl-3 last:pr-3 ${w}`}>
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <Fragment key={r.site.id}>
              <TableRow className={`align-top hover:bg-muted/60 ${i === 0 ? "border-b-0 border-l-[3px] border-l-primary" : ""}`}>
                <TableCell className="py-3 pr-1 pl-3 font-mono text-lg tabular-nums text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="px-1.5 py-3 whitespace-normal">
                  <Link
                    to={`/site/${r.site.id}`}
                    className="text-sm font-semibold hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {r.site.name}
                  </Link>
                </TableCell>
                <TableCell className="px-1.5 py-3">
                  <RiskBadge category={r.result.category} score={r.result.siteScore} size="sm" />
                </TableCell>
                <TableCell className="px-1.5 py-3 text-sm whitespace-normal">{PATHWAYS[r.result.leadingPathway].label}</TableCell>
                <TableCell className="px-1.5 py-3">
                  <TrendLabel trend={r.trend} stacked />
                </TableCell>
                <TableCell className="px-1.5 py-3 font-mono text-sm tabular-nums">{r.reportCount}</TableCell>
                <TableCell className="py-3 pr-3 pl-1.5 text-sm whitespace-normal">{recommend(r.result.category)}</TableCell>
              </TableRow>
              {i === 0 && (
                <TableRow className="border-l-[3px] border-l-primary hover:bg-transparent">
                  <TableCell colSpan={7} className="px-4 pt-0 pb-3">
                    <FirstTarget />
                  </TableCell>
                </TableRow>
              )}
              </Fragment>
            ))}
          </TableBody>
        </Table>

        <ol className="md:hidden">
          {rows.map((r, i) => (
            <li
              key={r.site.id}
              className={`border-b px-4 py-3 last:border-b-0 ${i === 0 ? "border-l-[3px] border-l-primary" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 font-mono text-lg tabular-nums text-muted-foreground">{i + 1}</span>
                <Link to={`/site/${r.site.id}`} className="flex-1 text-sm font-semibold hover:text-primary">
                  {r.site.name}
                </Link>
                <RiskBadge category={r.result.category} score={r.result.siteScore} size="sm" />
              </div>
              <div className="mt-2 pl-8 text-sm">
                <p>{PATHWAYS[r.result.leadingPathway].label}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <TrendLabel trend={r.trend} />
                  <span className="font-mono tabular-nums">
                    {r.reportCount} {r.reportCount === 1 ? "report" : "reports"}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">{recommend(r.result.category)}</p>
                {i === 0 && <FirstTarget />}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
