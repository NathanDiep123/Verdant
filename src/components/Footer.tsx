import { InkRule, SpecimenTag } from "@/components/FieldMarks";
import { COMMON } from "@/i18n/common";
import { useStrings } from "@/state/LanguageContext";
import { useRegion } from "@/state/RegionContext";

const DATA_KEY = {
  prototype: "dataPrototype",
  "synthetic-demo": "dataSynthetic",
  "resilience-map-export": "dataExport",
} as const;

export function Footer() {
  const { config } = useRegion();
  const s = useStrings(COMMON);
  const status = config.dataStatus;
  return (
    <footer className="mt-12">
      <InkRule variant="wave" className="mx-auto w-[calc(100%-2rem)] max-w-[1312px] text-olive/60" />
      <div className="mx-auto flex max-w-[1360px] flex-col gap-3 px-4 py-6 md:px-6">
        <p className="max-w-[68ch] text-sm leading-[1.45] text-muted-foreground">{s.disclaimer}</p>
        <SpecimenTag>{s[status in DATA_KEY ? DATA_KEY[status as keyof typeof DATA_KEY] : "dataConfigOnly"]}</SpecimenTag>
      </div>
    </footer>
  );
}
