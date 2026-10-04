import { CircleCheck, CircleHelp, CircleX, FlaskConical, Inbox, Search, type LucideIcon } from "lucide-react";
import type { ReportStatus } from "@/types";
import { STATUS_LABEL } from "@/lib/reportLoop";

const ICON: Record<ReportStatus, LucideIcon> = {
  received: Inbox,
  reviewing: Search,
  "sample-requested": FlaskConical,
  confirmed: CircleCheck,
  "not-bloom": CircleX,
  "more-info": CircleHelp,
};

const STYLE: Record<ReportStatus, string> = {
  received: "bg-muted text-foreground border-border",
  reviewing: "bg-muted text-foreground border-border",
  "sample-requested": "bg-muted text-foreground border-border",
  confirmed: "border-primary text-primary",
  "not-bloom": "border-dashed border-border text-muted-foreground",
  "more-info": "border-dashed border-border text-muted-foreground",
};

export function ReportStatusTag({ status }: { status: ReportStatus }) {
  const Icon = ICON[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-0.5 font-sans text-xs font-medium ${STYLE[status]}`}>
      <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}
