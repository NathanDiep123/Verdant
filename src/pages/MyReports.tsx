import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { ReportStatusTag } from "@/components/ReportStatusTag";
import { ReportTimeline } from "@/components/ReportTimeline";
import {
  formatReportTime,
  newestFirst,
  reportSummary,
} from "@/lib/communityReports";
import { recordLine, reportCode, trackRecord } from "@/lib/reportLoop";
import { cn } from "@/lib/utils";
import { useRegion } from "@/state/RegionContext";
import type { CitizenReport } from "@/types";

const headline = "text-xl font-semibold leading-snug";

function Outcome({
  report,
  siteName,
}: {
  report: CitizenReport;
  siteName: string;
}) {
  const status = report.status ?? "received";
  const note = report.rangerNote;
  const prioritized = `Your report helped prioritize ${siteName} for sampling.`;
  let label = "Outcome";
  let body;
  switch (status) {
    case "received":
      label = "Status";
      body = <p className="text-sm">Your report is in the ranger queue.</p>;
      break;
    case "reviewing":
      label = "Status";
      body = <p className="text-sm">A ranger is reviewing your report.</p>;
      break;
    case "sample-requested":
      label = "Status";
      body = (
        <p className="text-sm">{`A ranger requested a field sample at ${siteName}. ${prioritized}`}</p>
      );
      break;
    case "confirmed":
      body = (
        <>
          <p className={headline}>You got it right.</p>
          <p className="mt-1 text-sm">{`A field sample confirmed a bloom at ${siteName}. ${prioritized}`}</p>
          {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
        </>
      );
      break;
    case "not-bloom":
      body = (
        <>
          <p className={headline}>Close, but not a bloom this time.</p>
          {note && <p className="mt-1 text-sm">{note}</p>}
          <p className="mt-1 text-sm text-muted-foreground">
            Check{" "}
            <Link
              to="/report"
              className="text-primary underline underline-offset-4"
            >
              the guide
            </Link>{" "}
            on the report page to tell blooms from look-alikes.
          </p>
        </>
      );
      break;
    case "more-info":
      body = (
        <>
          <p className={headline}>The ranger needs one more detail.</p>
          {note && <p className="mt-1 text-sm">{note}</p>}
          <Link
            to={`/report?site=${report.siteId}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "mt-3 h-9 px-3",
            )}
          >
            Add a follow-up report
          </Link>
        </>
      );
      break;
  }
  return (
    <div className="border-l-[3px] border-primary px-3 py-2">
      <p className="mb-1 text-xs font-semibold text-primary">{label}</p>
      {body}
    </div>
  );
}

export function MyReports() {
  const { reports, sites, config, resetDemo } = useRegion();
  const mine = newestFirst(reports.filter((r) => r.reporterId === "you"));
  const rec = trackRecord(reports, "you");
  const siteName = (id: string) => sites.find((s) => s.id === id)?.name ?? id;
  const cells: [string, number][] = [
    ["Reports filed", rec.filed],
    ["Reviewed", rec.decided],
    ["Matched the field result", rec.matched],
  ];

  return (
    <div className="py-8 md:py-12">
      <h1 className="text-[28px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[40px]">
        My reports
      </h1>
      <p className="mt-3 inline-block rounded-sm border border-dashed border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
        Demonstration outcomes. In this prototype, a ranger outcome is set by
        hand on the Report queue page.
      </p>

      <dl className="mt-6 grid max-w-[560px] grid-cols-3 divide-x divide-border rounded-sm border border-border bg-card">
        {cells.map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col-reverse justify-end gap-2 p-3 md:p-4"
          >
            <dt className="text-xs text-muted-foreground md:text-sm">
              {label}
            </dt>
            <dd className="font-mono text-[28px] font-semibold leading-none tabular-nums">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-base">Your record: {recordLine(rec)}</p>

      {mine.length === 0 ? (
        <div className="mt-8 max-w-[960px] border-t border-border pt-6">
          <p className="text-base">
            You have not filed a report in {config.name} yet.
          </p>
          <Link to="/report" className={cn(buttonVariants(), "mt-4 h-10 px-4")}>
            Report what you see
          </Link>
        </div>
      ) : (
        <ul className="mt-8 max-w-[960px] list-none border-t border-border p-0">
          {mine.map((r) => {
            const name = siteName(r.siteId);
            return (
              <li
                key={r.id}
                className="grid gap-4 border-b border-border py-6 md:grid-cols-[minmax(0,1fr)_320px] md:gap-12"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-xs text-muted-foreground">
                      {reportCode(r)}
                    </span>
                    <Link
                      to={`/site/${r.siteId}`}
                      className="text-base font-semibold hover:underline"
                    >
                      {name}
                    </Link>
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatReportTime(r.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{reportSummary(r)}</p>
                  <ReportStatusTag status={r.status ?? "received"} />
                  <Outcome report={r} siteName={name} />
                </div>
                <ReportTimeline report={r} />
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6 flex max-w-[960px] flex-col items-start gap-4 pt-2">
        <Link
          to="/rangers"
          className="text-sm font-medium text-primary underline underline-offset-4"
        >
          Ranger view: open the Report queue
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="h-9 px-3" onClick={resetDemo}>
            Reset demo data
          </Button>
          <span className="text-sm text-muted-foreground">
            Clears reports and outcomes saved in this browser.
          </span>
        </div>
      </div>
    </div>
  );
}

export default MyReports;
