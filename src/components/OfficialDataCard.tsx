import { SpecimenTag } from "@/components/FieldMarks";
import { lakeMeadOfficial as o } from "@/data/citations";

/** Official data cell of the KPI band. Never carries the prototype label. */
export function OfficialDataCard() {
  const valueText = `${o.value} ${o.unit}`;
  const [before, after] = o.displayText.split(valueText);
  return (
    <div className="h-full border-l-4 border-primary bg-card px-3 py-2.5">
      <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.8125rem] text-muted-foreground">
        <SpecimenTag tone="official">Official data</SpecimenTag>
        <span>{before}</span>
        <span className="font-heading text-[1.75rem] leading-[1.15] tracking-[-0.01em] tabular-nums text-foreground">{valueText}</span>
        <span>{after}</span>
      </p>
      <p className="mt-1 font-mono text-xs leading-[1.4] text-muted-foreground">
        {o.sourceLine}{" "}
        <a
          href={o.url}
          title={o.url}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-2"
        >
          usbr.gov
        </a>
      </p>
    </div>
  );
}
