import { Fragment } from "react";
import { Link } from "react-router";
import { MessageSquare, MoveRight, TrendingDown, TrendingUp } from "lucide-react";
import { Annotation } from "@/components/FieldMarks";
import { RiskBadge } from "@/components/RiskBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PATHWAY_LABEL } from "@/engine/explain";
import { DASHBOARD, RECOMMEND, TREND } from "@/i18n/dashboard";
import { useLang, useStrings } from "@/state/LanguageContext";
import type { SiteResult, SiteRecord, Trend } from "@/types";

export type SiteRow = { site: SiteRecord; result: SiteResult; trend: Trend; reportCount: number };

const TREND_ICON = { Increasing: TrendingUp, Decreasing: TrendingDown, Stable: MoveRight } as const;

export function TrendLabel({ trend, small }: { trend: Trend; small?: boolean }) {
  const { lang } = useLang();
  const Icon = TREND_ICON[trend];
  return (
    <span className={`inline-flex items-center gap-1.5 ${small ? "text-[13px]" : "text-sm"}`}>
      <Icon className={small ? "size-3.5 shrink-0" : "size-4 shrink-0"} strokeWidth={1.75} aria-hidden />
      {TREND[lang][trend]}
    </span>
  );
}

function ReportCount({ id, count }: { id: string; count: number }) {
  const { lang } = useLang();
  const body = (
    <>
      <MessageSquare className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
      <span className="sr-only">{DASHBOARD[lang].reportsSr}</span>
      {count}
    </>
  );
  const cls = "inline-flex items-center gap-1.5 font-mono text-sm tabular-nums";
  return count > 0 ? (
    <Link to={`/site/${id}#community`} className={`${cls} text-primary hover:underline`}>
      {body}
    </Link>
  ) : (
    <span className={`${cls} text-muted-foreground`}>{body}</span>
  );
}

function FirstTarget() {
  const s = useStrings(DASHBOARD);
  return (
    <div className="mt-2 border-l-[3px] border-primary px-3 py-1.5">
      <p className="font-mono text-xs font-medium text-primary">{s.firstLabel}</p>
      <Annotation direction="left" className="[&_span]:text-sm [&_span]:font-semibold">
        {s.firstTarget}
      </Annotation>
    </div>
  );
}

export function SamplingPriorityList({ rows }: { rows: SiteRow[] }) {
  const { lang } = useLang();
  const s = DASHBOARD[lang];
  const pathway = (r: SiteRow) => PATHWAY_LABEL[lang][r.result.leadingPathway];
  return (
    <section aria-labelledby="priority-heading" className="flex h-full min-h-0 flex-col rounded-sm border bg-card shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]">
      <div className="px-4 pt-4 pb-3">
        <h2 id="priority-heading" className="text-[1.75rem] leading-[1.15] tracking-[-0.01em]">
          {s.listTitle}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{s.listSub}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <Table className="hidden lg:table">
          <TableHeader className="bg-muted/60">
            <TableRow className="border-b-[3px] border-double border-foreground/40 hover:bg-transparent">
              {[s.colRank, s.colSite, s.colRisk, s.colReports, s.colAction].map((h) => (
                <TableHead key={h} className="h-auto px-1.5 py-2 text-[0.8125rem] font-medium whitespace-normal text-muted-foreground first:pl-3 last:pr-3">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <Fragment key={r.site.id}>
              <TableRow className={`align-top hover:bg-muted/60 ${i === 0 ? "border-b-0 border-l-[3px] border-l-primary" : ""}`}>
                <TableCell className="py-2 pr-1 pl-3 font-heading text-xl leading-[1.3] tabular-nums text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="px-1.5 py-2 whitespace-normal">
                  <Link
                    to={`/site/${r.site.id}`}
                    className="font-semibold whitespace-nowrap hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {r.site.name}
                  </Link>
                  <p className="mt-0.5 text-[0.8125rem] leading-[1.4] text-olive">{pathway(r)}</p>
                </TableCell>
                <TableCell className="px-1.5 py-2 whitespace-nowrap">
                  <RiskBadge category={r.result.category} score={r.result.siteScore} size="sm" />
                  <div className="mt-1">
                    <TrendLabel trend={r.trend} small />
                  </div>
                </TableCell>
                <TableCell className="px-1.5 py-2">
                  <ReportCount id={r.site.id} count={r.reportCount} />
                </TableCell>
                <TableCell className="py-2 pr-3 pl-1.5 text-[13px] whitespace-normal">{RECOMMEND[lang][r.result.category]}</TableCell>
              </TableRow>
              {i === 0 && (
                <TableRow className="border-l-[3px] border-l-primary hover:bg-transparent">
                  <TableCell colSpan={5} className="px-4 pt-0 pb-3">
                    <FirstTarget />
                  </TableCell>
                </TableRow>
              )}
              </Fragment>
            ))}
          </TableBody>
        </Table>

        <ol className="lg:hidden">
          {rows.map((r, i) => (
            <li
              key={r.site.id}
              className={`border-b px-4 py-3 last:border-b-0 ${i === 0 ? "border-l-[3px] border-l-primary" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 font-heading text-xl leading-[1.3] tabular-nums text-muted-foreground">{i + 1}</span>
                <Link to={`/site/${r.site.id}`} className="flex-1 text-sm font-semibold hover:text-primary">
                  {r.site.name}
                </Link>
                <RiskBadge category={r.result.category} score={r.result.siteScore} size="sm" />
              </div>
              <div className="mt-2 pl-8 text-sm">
                <p className="text-[0.8125rem] text-olive">{pathway(r)}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <TrendLabel trend={r.trend} />
                  <ReportCount id={r.site.id} count={r.reportCount} />
                </div>
                <p className="mt-1 text-muted-foreground">{RECOMMEND[lang][r.result.category]}</p>
                {i === 0 && <FirstTarget />}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
