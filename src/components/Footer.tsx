import { useRegion } from "@/state/RegionContext";

export const DISCLAIMER =
  "Verdant identifies conditions associated with increased bloom risk. It does not confirm toxin presence or replace field sampling.";

export function dataLabel(status: string): string {
  if (status === "prototype") return "Prototype demonstration data";
  if (status === "synthetic-demo") return "Synthetic demo, structured as a Resilience Map export";
  if (status === "resilience-map-export") return "OneAquaHealth Resilience Map export";
  return "Configuration only, no site data";
}

export function Footer() {
  const { config } = useRegion();
  return (
    <footer className="mt-12 border-t border-border">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-3 px-4 py-6 md:px-6">
        <p className="max-w-[68ch] text-sm leading-[1.45] text-muted-foreground">{DISCLAIMER}</p>
        <p className="w-fit rounded-sm border border-dashed border-border px-2 py-0.5 font-mono text-xs font-medium leading-[1.4] text-muted-foreground">
          {dataLabel(config.dataStatus)}
        </p>
      </div>
    </footer>
  );
}
