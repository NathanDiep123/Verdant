import { CircleCheck, CircleHelp, CircleX, FlaskConical, Inbox, Search, type LucideIcon } from "lucide-react";
import type { ReportStatus } from "@/types";
import { STATUS } from "@/i18n/shared";
import { useLang } from "@/state/LanguageContext";

const ICON: Record<ReportStatus, LucideIcon> = {
  received: Inbox,
  reviewing: Search,
  "sample-requested": FlaskConical,
  confirmed: CircleCheck,
  "not-bloom": CircleX,
  "more-info": CircleHelp,
};

const STYLE: Record<ReportStatus, string> = {
  received: "text-muted-foreground",
  reviewing: "text-muted-foreground",
  "sample-requested": "text-muted-foreground",
  confirmed: "text-primary",
  "not-bloom": "text-muted-foreground",
  "more-info": "text-muted-foreground",
};

export function ReportStatusTag({ status }: { status: ReportStatus }) {
  const { lang } = useLang();
  const Icon = ICON[status];
  return (
    <span className={`stamp inline-flex items-center gap-1.5 bg-card px-2 py-0.5 font-sans text-xs font-semibold [--stamp-bg:var(--card)] ${STYLE[status]}`}>
      <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
      {STATUS[lang][status]}
    </span>
  );
}
