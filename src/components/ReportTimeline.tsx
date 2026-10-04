import { CircleCheck, CircleHelp, CircleX, FlaskConical, Inbox, Search, type LucideIcon } from "lucide-react";
import { formatReportTime } from "@/lib/communityReports";
import { NEXT_STEP_LABEL, STATUS_LABEL, isOutcome } from "@/lib/reportLoop";
import type { CitizenReport, ReportStatus } from "@/types";

const ICON: Record<ReportStatus, LucideIcon> = {
  received: Inbox,
  reviewing: Search,
  "sample-requested": FlaskConical,
  confirmed: CircleCheck,
  "not-bloom": CircleX,
  "more-info": CircleHelp,
};

type Row = { key: string; icon: LucideIcon | null; label: string; at: string; reached: boolean };

export function ReportTimeline({ report }: { report: CitizenReport }) {
  const status = report.status ?? "received";
  const history = report.statusHistory?.length ? report.statusHistory : [{ status, at: report.createdAt }];
  const next = isOutcome(status) ? undefined : NEXT_STEP_LABEL[status as keyof typeof NEXT_STEP_LABEL];
  const rows: Row[] = history.map((h) => ({
    key: `${h.status}-${h.at}`,
    icon: ICON[h.status],
    label: STATUS_LABEL[h.status],
    at: h.at,
    reached: true,
  }));
  if (next) rows.push({ key: "next", icon: null, label: next, at: "", reached: false });

  return (
    <ol aria-label="Report history" className="m-0 list-none p-0">
      {rows.map((r, i) => {
        const Icon = r.icon;
        const last = i === rows.length - 1;
        return (
          <li key={r.key} className="grid grid-cols-[16px_1fr] gap-x-3">
            <div className="flex flex-col items-center">
              {Icon ? (
                <Icon className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
              ) : (
                <span className="mt-0.5 size-4 shrink-0" aria-hidden />
              )}
              {!last && <span className="my-1 w-px flex-1 bg-border" aria-hidden />}
            </div>
            <div className={"flex flex-wrap items-baseline justify-between gap-x-4 " + (last ? "" : "pb-3")}>
              <span className={r.reached ? "text-sm font-medium" : "text-sm font-medium text-muted-foreground"}>
                {r.label}
              </span>
              {r.at && (
                <time dateTime={r.at} className="font-mono text-xs text-muted-foreground">
                  {formatReportTime(r.at)}
                </time>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
