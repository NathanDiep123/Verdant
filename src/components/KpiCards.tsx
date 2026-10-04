import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { RiskBadge } from "@/components/RiskBadge";
import { OfficialDataCard } from "@/components/OfficialDataCard";
import type { SiteRow } from "@/components/SamplingPriorityList";
import type { Category } from "@/types";

const ORDER: Category[] = ["Low", "Moderate", "High", "Very High"];

function Cell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card p-4">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="mt-2">{children}</div>
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
  const top = rows[0];
  const status = rows.reduce<Category>(
    (m, r) => (ORDER.indexOf(r.result.category) > ORDER.indexOf(m) ? r.result.category : m),
    "Low",
  );
  const attention = rows.filter((r) => r.result.category === "High" || r.result.category === "Very High").length;

  return (
    <div
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-sm border bg-border ${
        showOfficial ? "lg:grid-cols-[repeat(4,1fr)_1.5fr]" : "lg:grid-cols-4"
      }`}
    >
      <div className="border-l-[3px] border-l-primary bg-card p-4">
        <p className="text-sm font-medium text-muted-foreground">Citizen reports</p>
        <p className="mt-2 font-mono text-[28px] leading-[1.2] font-semibold tabular-nums">{reportCount}</p>
        <p className="mt-1 text-sm text-muted-foreground">From {siteCount} {siteCount === 1 ? "site" : "sites"}</p>
        <Link
          to="/report"
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Add a report
          <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>
      <Cell title="Region status">
        {rows.length ? <RiskBadge category={status} size="md" /> : <span className="text-sm">No sites</span>}
        <p className="mt-2 text-sm text-muted-foreground">Highest category at {regionName}</p>
      </Cell>
      <Cell title="Highest-risk site">
        {top ? (
          <>
            <p className="text-sm font-semibold">{top.site.name}</p>
            <div className="mt-2">
              <RiskBadge category={top.result.category} score={top.result.siteScore} size="md" />
            </div>
          </>
        ) : (
          <span className="text-sm">No sites</span>
        )}
      </Cell>
      <Cell title="Areas Requiring Attention">
        <p className="font-mono text-[28px] leading-[1.2] font-semibold tabular-nums">{attention}</p>
        <p className="mt-1 text-sm text-muted-foreground">High or Very High</p>
      </Cell>
      {showOfficial && (
        <div className="col-span-2 lg:col-span-1">
          <OfficialDataCard />
        </div>
      )}
    </div>
  );
}
