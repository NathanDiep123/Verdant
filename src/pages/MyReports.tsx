import { CircleCheck } from "lucide-react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { InkRule, SpecimenTag, TapeCorner } from "@/components/FieldMarks";
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
import { EnglishOnlyNote } from "@/components/EnglishOnlyNote";
import type { CitizenReport } from "@/types";

const headline = "font-heading text-[1.25rem] leading-[1.3]";
const payoff = "font-heading text-[1.5rem] leading-tight";

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
          <p className={cn(payoff, "flex items-center gap-2")}>
            <CircleCheck
              className="size-6 shrink-0 text-primary"
              strokeWidth={2}
              aria-hidden
            />
            You got it right.
          </p>
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
    <div
      className={cn(
        "relative border-l-[3px] border-primary px-3 py-2",
        status === "confirmed" && "bg-primary/5 px-4 py-3",
      )}
    >
      {status === "confirmed" && <TapeCorner side="right" className="right-3 top-1" />}
      <p className="mb-1 font-mono text-xs font-medium text-primary">{label}</p>
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
    <div>
      <EnglishOnlyNote className="mb-6" />
      <h1 className="text-[1.875rem] leading-[1.05] tracking-[-0.015em] md:text-[2.5rem]">
        My reports
      </h1>
      <SpecimenTag className="mt-3">
        Demonstration outcomes. In this prototype, a ranger outcome is set by
        hand on the Report queue page.
      </SpecimenTag>

      <dl className="mt-6 grid grid-cols-3 divide-x divide-border rounded-sm border border-border bg-card shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]">
        {cells.map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col-reverse justify-end gap-2 p-4 md:p-6"
          >
            <dt className="text-[0.8125rem] text-muted-foreground md:text-sm">
              {label}
            </dt>
            <dd className="font-heading text-[2rem] leading-none tabular-nums md:text-[2.5rem]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-base">Your record: {recordLine(rec)}</p>

      {mine.length === 0 ? (
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-base">
            You have not filed a report in {config.name} yet.
          </p>
          <Link to="/report" className={cn(buttonVariants(), "mt-4 h-10 px-4")}>
            Report what you see
          </Link>
        </div>
      ) : (
        <ul className="mt-8 list-none p-0">
          {mine.map((r) => {
            const name = siteName(r.siteId);
            return (
              <li key={r.id} className="py-6">
                <InkRule className="mb-6 text-border" />
                <div className="grid gap-4 md:grid-cols-12 md:gap-12">
                  <div className="space-y-3 md:col-span-8">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-xs text-muted-foreground">
                        {reportCode(r)}
                      </span>
                      <Link
                        to={`/site/${r.siteId}`}
                        className="font-semibold hover:underline"
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
                  <div className="md:col-span-4">
                    <ReportTimeline report={r} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6 flex flex-col items-start gap-4 pt-2">
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
