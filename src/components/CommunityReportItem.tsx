import { MessageSquare } from "lucide-react";
import { Link } from "react-router";
import { REPORT_TAG_LABEL, formatReportTime, reportSummary } from "@/lib/communityReports";
import { ReportStatusTag } from "@/components/ReportStatusTag";
import type { CitizenReport } from "@/types";

export function CommunityReportItem({
  report,
  siteName,
  showSite,
}: {
  report: CitizenReport;
  siteName: string;
  showSite?: boolean;
}) {
  return (
    <div className="flex gap-2 border-b py-3 last:border-b-0">
      <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          {showSite && (
            <Link to={`/site/${report.siteId}`} className="text-sm font-semibold hover:underline">
              {siteName}
            </Link>
          )}
          <span className="font-mono text-xs text-muted-foreground">{formatReportTime(report.createdAt)}</span>
        </div>
        <p className="text-sm">{reportSummary(report)}</p>
        <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {report.status && <ReportStatusTag status={report.status} />}
          <span className="rounded-sm border border-dashed px-1.5 py-0.5 font-mono">
            {REPORT_TAG_LABEL[report.dataTag]}
          </span>
          {report.animalsPresent && <span>Animals present</span>}
        </p>
      </div>
    </div>
  );
}
