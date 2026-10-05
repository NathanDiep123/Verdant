import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { RiskBadge } from "@/components/RiskBadge";
import { OfficialDataCard } from "@/components/OfficialDataCard";
import type { SiteRow } from "@/components/SamplingPriorityList";
import { DASHBOARD } from "@/i18n/dashboard";
import { fmt } from "@/i18n/lang";
import { useStrings } from "@/state/LanguageContext";
import type { Category } from "@/types";

const ORDER: Category[] = ["Low", "Moderate", "High", "Very High"];

function Cell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card px-4 py-2.5">
      <p className="text-[0.8125rem] leading-[1.4] text-muted-foreground">{title}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

/** `rows` must be sorted by score, highest first. */
export function KpiCards({
  rows,
  reportCount,
  siteCount,
  regionName,
  showOfficial,
}: {
  rows: SiteRow[];
  reportCount: number;
  siteCount: number;
  regionName: string;
  showOfficial: boolean;
}) {
  const s = useStrings(DASHBOARD);
  const top = rows[0];
  const status = rows.reduce<Category>(
    (m, r) => (ORDER.indexOf(r.result.category) > ORDER.indexOf(m) ? r.result.category : m),
    "Low",
  );
  const attention = rows.filter((r) => r.result.category === "High" || r.result.category === "Very High").length;

  return (
    <div
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-sm border bg-border shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] ${
        showOfficial ? "lg:grid-cols-[13.75rem_13.75rem_11.5rem_11.75rem_1fr]" : "lg:grid-cols-4"
      }`}
    >
      <div className="border-l-[3px] border-l-primary bg-card px-4 py-2.5">
        <p className="text-[0.8125rem] leading-[1.4] text-muted-foreground">{s.kpiReports}</p>
        <p className="mt-1 font-heading text-[1.75rem] leading-[1.15] tracking-[-0.01em] tabular-nums">{reportCount}</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 text-[0.8125rem]">
          <span className="text-muted-foreground">{siteCount === 0 ? s.kpiNoReports : fmt(siteCount === 1 ? s.kpiFromSite : s.kpiFromSites, { n: siteCount })}</span>
          <Link
            to="/report"
            className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            {s.kpiAdd}
            <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </div>
      <Cell title={s.kpiStatus}>
        {rows.length ? <RiskBadge category={status} size="md" /> : <span className="text-sm">{s.kpiNoSites}</span>}
        <p className="mt-1 text-[0.8125rem] text-muted-foreground">{fmt(s.kpiHighest, { name: regionName })}</p>
      </Cell>
      <Cell title={s.kpiTop}>
        {top ? (
          <>
            <p className="text-sm font-semibold leading-[1.45]">{top.site.name}</p>
            <div className="mt-1">
              <RiskBadge category={top.result.category} score={top.result.siteScore} size="md" />
            </div>
          </>
        ) : (
          <span className="text-sm">{s.kpiNoSites}</span>
        )}
      </Cell>
      <Cell title={s.kpiAttention}>
        <p className="font-heading text-[1.75rem] leading-[1.15] tracking-[-0.01em] tabular-nums">{attention}</p>
        <p className="mt-1 text-[0.8125rem] text-muted-foreground">{s.kpiHighOrVery}</p>
      </Cell>
      {showOfficial && (
        <div className="col-span-2 lg:col-span-1">
          <OfficialDataCard />
        </div>
      )}
    </div>
  );
}
