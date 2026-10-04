import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { MessageSquarePlus } from "lucide-react";
import { InkRule } from "@/components/FieldMarks";
import { CommunityReportItem } from "@/components/CommunityReportItem";
import { buttonVariants } from "@/components/ui/button";
import { newestFirst } from "@/lib/communityReports";
import { cn } from "@/lib/utils";
import type { CitizenReport, SiteRecord } from "@/types";

/** Fades a row from --muted to transparent over 1200ms when it mounts after the feed first rendered. */
function FadeIn({ fresh, children }: { fresh: boolean; children: React.ReactNode }) {
  const [shown, setShown] = useState(!fresh);
  useEffect(() => {
    if (!fresh) return;
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [fresh]);
  return (
    <div className={cn("transition-[background-color] duration-[1200ms] ease-out", shown ? "bg-transparent" : "bg-muted")}>
      {children}
    </div>
  );
}

export function CommunityReportsFeed({
  reports,
  sites,
  regionName,
}: {
  reports: CitizenReport[];
  sites: SiteRecord[];
  regionName: string;
}) {
  const initialIds = useRef(new Set(reports.map((r) => r.id)));
  const newest = newestFirst(reports).slice(0, 5);
  const nameOf = (id: string) => sites.find((s) => s.id === id)?.name ?? id;

  return (
    <section aria-labelledby="community-reports" className="grid gap-8 rounded-sm border bg-card p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] md:p-6 lg:grid-cols-12 lg:gap-0">
      <div className="lg:col-span-8 lg:pr-8">
        <h2 id="community-reports" className="text-[1.75rem] leading-[1.15] tracking-[-0.01em]">
          Community reports
        </h2>
        <p className="mt-2 max-w-[68ch] text-sm text-muted-foreground">
          Observations from people at the shore. Each new report raises that site's citizen evidence by 10 points, capped at 100.
        </p>
        <div className="mt-4">
          {newest.length === 0 ? (
            <p className="max-w-[68ch] rounded-sm border border-dashed p-4 text-sm text-muted-foreground">
              No community reports for {regionName} yet. Reports filed here appear in this list and on the map.
            </p>
          ) : (
            <ul>
              {newest.map((r, i) => (
                <li key={r.id} className="[&>div>div]:border-b-0">
                  {i > 0 && <InkRule className="text-border" />}
                  <FadeIn fresh={!initialIds.current.has(r.id)}>
                    <CommunityReportItem report={r} siteName={nameOf(r.siteId)} showSite />
                  </FadeIn>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t pt-8 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
        <h3 className="text-xl leading-[1.3]">Between agency samples</h3>
        <p className="text-sm">
          Agencies sample a few points a few times a month. People at the shore see the water every day. Your report goes straight into the score, and the site page shows how many points it adds.
        </p>
        <Link to="/report" className={cn(buttonVariants(), "h-9 w-fit px-3")}>
          <MessageSquarePlus strokeWidth={1.75} aria-hidden />
          Report what you see
        </Link>
        <p className="text-xs text-muted-foreground">Reports never confirm a bloom. They tell experts where to look.</p>
      </div>
    </section>
  );
}
