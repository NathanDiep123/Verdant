import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { RiskBadge } from "@/components/RiskBadge";
import { ReportStatusTag } from "@/components/ReportStatusTag";
import { Button } from "@/components/ui/button";
import { InkRule, SpecimenTag } from "@/components/FieldMarks";
import { formatReportTime, reportSummary } from "@/lib/communityReports";
import {
  EVIDENCE_WEIGHT,
  REPORTER_NAME,
  isOutcome,
  recordLine,
  reportCode,
  trackRecord,
} from "@/lib/reportLoop";
import { scoreSite } from "@/engine/score";
import { useRegion } from "@/state/RegionContext";
import { cn } from "@/lib/utils";
import type { CitizenReport, ReportStatus, SiteResult } from "@/types";

const OUTCOME_NOTE: Record<
  "confirmed" | "not-bloom" | "more-info",
  (site: string) => string
> = {
  confirmed: (site) =>
    `Demo outcome: a field sample confirmed a bloom at ${site}.`,
  "not-bloom": (site) =>
    `Demo outcome: the ranger found no bloom at ${site}. It was likely a look-alike such as duckweed or strands of green algae.`,
  "more-info": () =>
    "Demo outcome: the ranger asks for a photo and the exact spot on the shore.",
};

/** Fades a row from --muted to transparent over 1200ms when it appears or changes after the page first rendered. */
function Flash({ fresh, children }: { fresh: boolean; children: ReactNode }) {
  const [shown, setShown] = useState(!fresh);
  useEffect(() => {
    if (!fresh) return;
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [fresh]);
  return (
    <div
      className={cn(
        "transition-[background-color] duration-[1200ms] ease-out motion-reduce:transition-none",
        shown ? "bg-transparent" : "bg-muted",
      )}
    >
      {children}
    </div>
  );
}

export default function RangerQueue() {
  const { config, sites, reports, updateReportStatus } = useRegion();

  const scores = useMemo(() => {
    const m = new Map<string, SiteResult>();
    for (const s of sites) m.set(s.id, scoreSite(s, config));
    return m;
  }, [sites, config]);
  const siteName = (id: string) => sites.find((s) => s.id === id)?.name ?? id;
  const scoreOf = (id: string) => scores.get(id)?.siteScore ?? 0;

  const initialKeys = useRef(
    new Set(reports.map((r) => `${r.id}:${r.status ?? "received"}`)),
  );
  const status = (r: CitizenReport): ReportStatus => r.status ?? "received";

  const open = reports
    .filter((r) => !isOutcome(status(r)))
    .sort(
      (a, b) =>
        scoreOf(b.siteId) - scoreOf(a.siteId) ||
        b.createdAt.localeCompare(a.createdAt),
    );
  const decided = reports
    .filter((r) => isOutcome(status(r)))
    .sort((a, b) => lastChange(b).localeCompare(lastChange(a)));

  function lastChange(r: CitizenReport) {
    return r.statusHistory?.[r.statusHistory.length - 1]?.at ?? r.createdAt;
  }

  function act(r: CitizenReport, next: ReportStatus) {
    const name = siteName(r.siteId);
    const note =
      next === "confirmed" || next === "not-bloom" || next === "more-info"
        ? OUTCOME_NOTE[next](name)
        : undefined;
    updateReportStatus(r.id, next, note);
  }

  function renderRow(r: CitizenReport, withActions: boolean) {
    const st = status(r);
    const res = scores.get(r.siteId);
    const rec = trackRecord(reports, r.reporterId ?? "");
    const who =
      (r.reporterId &&
        REPORTER_NAME[r.reporterId as keyof typeof REPORTER_NAME]) ||
      "Unknown reporter";
    const fresh = !initialKeys.current.has(`${r.id}:${st}`);
    return (
      <li key={r.id} className="border-b border-border last:border-b-0">
        <Flash fresh={fresh}>
          <article
            className={cn(
              "grid gap-3 py-4 md:px-2",
              withActions
                ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,37rem)] lg:gap-x-10"
                : "max-w-[72ch]",
            )}
            aria-label={`Report ${reportCode(r)}`}
          >
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-xs text-muted-foreground">
                  {reportCode(r)}
                </span>
                <Link
                  to={`/site/${r.siteId}`}
                  className="font-semibold hover:underline"
                >
                  {siteName(r.siteId)}
                </Link>
                {res && (
                  <RiskBadge
                    category={res.category}
                    score={res.siteScore}
                    size="sm"
                  />
                )}
                <span className="font-mono text-xs text-muted-foreground">
                  {formatReportTime(r.createdAt)}
                </span>
              </div>
              <p className="max-w-[68ch] text-base">{reportSummary(r)}</p>
              <p className="text-sm">
                {who}. Record: {recordLine(rec)}
              </p>
              <div>
                <ReportStatusTag status={st} />
              </div>
              {r.rangerNote && !withActions && (
                <p className="max-w-[68ch] text-sm text-muted-foreground">
                  {r.rangerNote}
                </p>
              )}
              {!withActions && (
                <p className="text-xs text-muted-foreground">
                  {r.dataTag === "user-submitted"
                    ? `Score weight: ${EVIDENCE_WEIGHT[st]} points of citizen evidence.`
                    : "Demo report: its evidence is already in the prototype values."}
                </p>
              )}
            </div>
            {withActions && (
              <div className="flex min-w-0 flex-col gap-2 lg:justify-center">
                <div className="flex flex-col items-start gap-3">
                  <div className="flex flex-wrap gap-2 empty:hidden">
                    {st === "received" && (
                      <Button
                        variant="outline"
                        className="h-9 px-3"
                        onClick={() => act(r, "reviewing")}
                      >
                        Start review
                      </Button>
                    )}
                    {(st === "received" || st === "reviewing") && (
                      <Button
                        variant="outline"
                        className="h-9 px-3"
                        onClick={() => act(r, "sample-requested")}
                      >
                        Request field sample
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Outcome
                    </span>
                    <Button
                      variant="outline"
                      className="h-9 border-primary bg-card px-3 text-primary hover:bg-primary/10"
                      onClick={() => act(r, "confirmed")}
                    >
                      Confirmed by field sample
                    </Button>
                    <Button
                      variant="outline"
                      className="h-9 px-3"
                      onClick={() => act(r, "not-bloom")}
                    >
                      Not a bloom
                    </Button>
                    <Button
                      variant="outline"
                      className="h-9 px-3"
                      onClick={() => act(r, "more-info")}
                    >
                      Needs more info
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {r.dataTag === "user-submitted"
                    ? `Score weight: ${EVIDENCE_WEIGHT[st]} points of citizen evidence.`
                    : "Demo report: its evidence is already in the prototype values."}
                </p>
              </div>
            )}
          </article>
        </Flash>
      </li>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-[1.875rem] leading-[1.05] tracking-[-0.015em] md:text-[2.5rem]">
          Report queue
        </h1>
        <SpecimenTag>
          Demonstration ranger view. Outcomes here are set by hand to show the
          feedback loop. No real ranger or lab result is involved.
        </SpecimenTag>
        <p className="max-w-[68ch] text-base text-muted-foreground">
          Reports at higher-risk sites come first. Each one shows the reporter's
          track record, so a ranger can weigh it before acting.
        </p>
      </header>

      <InkRule className="text-border" />

      <section aria-labelledby="open-reports" className="flex flex-col gap-3">
        <h2
          id="open-reports"
          className="text-[1.75rem] leading-[1.15] tracking-[-0.01em]"
        >
          Open reports ({open.length})
        </h2>
        {open.length === 0 ? (
          <p className="max-w-[68ch] rounded-sm border border-dashed border-border p-4 text-sm text-muted-foreground">
            No open reports for {config.name}.
          </p>
        ) : (
          <ul className="border-t border-border bg-card">{open.map((r) => renderRow(r, true))}</ul>
        )}
      </section>

      <section
        aria-labelledby="decided-reports"
        className="flex flex-col gap-3"
      >
        <h2
          id="decided-reports"
          className="text-[1.75rem] leading-[1.15] tracking-[-0.01em]"
        >
          Decided ({decided.length})
        </h2>
        {decided.length > 0 && (
          <ul className="border-t border-border bg-card">
            {decided.map((r) => renderRow(r, false))}
          </ul>
        )}
      </section>
    </div>
  );
}
