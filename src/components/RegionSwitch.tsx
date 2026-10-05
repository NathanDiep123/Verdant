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
    <div role="group" aria-label={s.region} className="relative flex rounded-sm border border-border bg-card">
      {OPTIONS.map((o) => {
        const active = regionId === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            onClick={() => setRegionId(o.id)}
            className={cn(
              "h-8 px-1.5 text-xs min-[380px]:text-sm font-medium whitespace-nowrap transition-colors duration-[120ms] first:rounded-l-[3px] max-md:last-of-type:rounded-r-[3px] focus-visible:relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring min-[380px]:px-2 sm:px-2.5 md:px-3",
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
          "absolute right-0 top-full mt-0.5 text-[10px] leading-none font-medium whitespace-nowrap md:static md:mt-0 md:inline-flex md:h-8 md:items-center md:gap-1 md:rounded-r-[3px] md:border-l md:border-dashed md:border-input md:px-2.5 md:text-sm transition-colors duration-[120ms] hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:focus-visible:relative",
          onCities ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <Plus className="hidden size-3.5 md:block" strokeWidth={1.75} aria-hidden />
        <span className="md:hidden">{s.moreCitiesFull}</span>
        <span className="hidden md:inline 2xl:hidden">{s.moreCitiesShort}</span>
        <span className="hidden 2xl:inline">{s.moreCitiesFull}</span>
      </Link>
    </div>
  );
}
