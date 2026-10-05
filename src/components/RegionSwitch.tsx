import { Link, useLocation } from "react-router";
import { Plus } from "lucide-react";
import { siteConfigs } from "@/config/sites";
import { COMMON } from "@/i18n/common";
import { fmt } from "@/i18n/lang";
import { cn } from "@/lib/utils";
import { useStrings } from "@/state/LanguageContext";
import { useRegion } from "@/state/RegionContext";

const OPTIONS = [
  { id: "lake-mead", label: "Lake Mead" },
  { id: "coimbra", label: "Coimbra" },
] as const;

// eslint-disable-next-line react-refresh/only-export-components
export const nextCities = () =>
  Object.values(siteConfigs)
    .filter((c) => c.dataStatus === "config-only")
    .map((c) => c.name);

export function RegionSwitch() {
  const { regionId, setRegionId } = useRegion();
  const s = useStrings(COMMON);
  const onCities = useLocation().pathname.startsWith("/oah-cities");
  return (
    <div role="group" aria-label={s.region} className="flex rounded-sm border border-border bg-card">
      {OPTIONS.map((o) => {
        const active = regionId === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            onClick={() => setRegionId(o.id)}
            className={cn(
              "h-8 px-2 text-sm font-medium whitespace-nowrap transition-colors duration-[120ms] first:rounded-l-[3px] max-md:last-of-type:rounded-r-[3px] focus-visible:relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-2.5 md:px-3",
              active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
            )}
          >
            {o.label}
          </button>
        );
      })}
      <Link
        to="/oah-cities"
        title={fmt(s.moreCitiesNext, { cities: nextCities().join(", ") })}
        className={cn(
          "hidden h-8 items-center gap-1 rounded-r-[3px] border-l border-dashed border-input px-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-[120ms] hover:bg-muted hover:text-foreground focus-visible:relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:inline-flex",
          onCities ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <Plus className="size-3.5" strokeWidth={1.75} aria-hidden />
        <span className="2xl:hidden">{s.moreCitiesShort}</span>
        <span className="hidden 2xl:inline">{s.moreCitiesFull}</span>
      </Link>
    </div>
  );
}
