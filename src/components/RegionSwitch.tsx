import { cn } from "@/lib/utils";
import { useRegion } from "@/state/RegionContext";

const OPTIONS = [
  { id: "lake-mead", label: "Lake Mead" },
  { id: "coimbra", label: "Coimbra" },
] as const;

export function RegionSwitch() {
  const { regionId, setRegionId } = useRegion();
  return (
    <div role="group" aria-label="Region" className="flex rounded-sm border border-border bg-card">
      {OPTIONS.map((o) => {
        const active = regionId === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            onClick={() => setRegionId(o.id)}
            className={cn(
              "h-8 px-3 text-sm font-medium transition-colors duration-[120ms] first:rounded-l-[3px] last:rounded-r-[3px] focus-visible:relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
