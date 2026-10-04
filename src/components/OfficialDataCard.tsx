import { lakeMeadOfficial as o } from "@/data/citations";

/** Official data cell of the KPI band. Never carries the prototype label. */
export function OfficialDataCard() {
  const valueText = `${o.value} ${o.unit}`;
  const [before, after] = o.displayText.split(valueText);
  return (
    <div className="h-full border-l-4 border-primary bg-card p-4">
      <span className="inline-block rounded-sm bg-primary px-2 py-0.5 font-mono text-xs font-medium text-primary-foreground">
        Official data
      </span>
      <p className="mt-2 text-sm text-muted-foreground">
        {before}
        <span className="block font-mono text-[28px] leading-[1.2] font-semibold tabular-nums text-foreground">
          {valueText}
        </span>
        {after}
      </p>
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        {o.sourceLine}{" "}
        <a href={o.url} target="_blank" rel="noreferrer" className="break-all text-primary underline underline-offset-2">
          {o.url.replace("https://", "")}
        </a>
      </p>
    </div>
  );
}
