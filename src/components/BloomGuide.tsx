import type { ReactNode } from "react";
import { SpecimenTag } from "@/components/FieldMarks";
import { cn } from "@/lib/utils";

// Drawings, not photos. Colours come from the Section 11.3 tokens only.
// Source for the descriptions: Illinois EPA, Identifying Cyanobacteria Blooms (row C11).

const WATER = "fill-risk-low/20";
const STRAND = "fill-none stroke-olive";

function Tile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" className={cn("shrink-0 rounded-sm border border-border", className)} aria-hidden focusable="false">
      <rect width="64" height="64" className="fill-muted" />
      {children}
    </svg>
  );
}

const Water = () => <rect x="0" y="0" width="64" height="64" className={WATER} />;

const PaintSpill = ({ className }: { className?: string }) => (
  <Tile className={className}>
    <Water />
    <path d="M14 30c-2-10 8-16 18-14s20 2 19 12-6 12-14 13-8 8-12 8-4-7-8-9-1-4-3-10z" className="fill-olive" />
    <path d="M24 44c0 5 1 9 3 9s3-4 2-9z" className="fill-olive" />
    <path d="M24 24c4-3 9-3 13-1" className="fill-none stroke-card" strokeWidth="2" strokeLinecap="round" />
  </Tile>
);

const ShoreCrust = ({ className }: { className?: string }) => (
  <Tile className={className}>
    <Water />
    <path d="M0 0h64v20c-10 6-18 2-28 6S14 30 0 26z" className="fill-muted" />
    <path d="M0 24c14 4 22 0 34-3s20 1 30-1v9c-10 3-20-1-30 2S12 38 0 33z" className="fill-olive" />
    <path d="M6 30c8 2 14 0 22-2" className="fill-none stroke-card" strokeWidth="1.5" strokeLinecap="round" />
  </Tile>
);

const PuffyScum = ({ className }: { className?: string }) => (
  <Tile className={className}>
    <Water />
    {[
      [20, 38, 11],
      [34, 30, 10],
      [44, 42, 9],
      [30, 46, 8],
      [18, 24, 7],
    ].map(([cx, cy, r]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} className="fill-card stroke-olive" strokeWidth="2" />
    ))}
  </Tile>
);

const Swirls = ({ className }: { className?: string }) => (
  <Tile className={className}>
    <Water />
    <path d="M8 20c10-8 18 6 28-2s14-4 20-2" className={STRAND} strokeWidth="5" strokeLinecap="round" strokeOpacity="0.45" />
    <path d="M6 36c12-8 18 8 30 0s14 0 22-2" className={STRAND} strokeWidth="5" strokeLinecap="round" strokeOpacity="0.45" />
    <path d="M10 52c10-6 16 4 26-2s14-2 18 0" className={STRAND} strokeWidth="5" strokeLinecap="round" strokeOpacity="0.45" />
  </Tile>
);

const Duckweed = ({ className }: { className?: string }) => (
  <Tile className={className}>
    <Water />
    {[
      [12, 14], [26, 10], [42, 16], [54, 12], [18, 28], [34, 26], [50, 30], [10, 42],
      [28, 40], [44, 44], [56, 50], [20, 54], [38, 56],
    ].map(([cx, cy], i) => (
      <ellipse key={i} cx={cx} cy={cy} rx="3.6" ry="2.6" transform={`rotate(${(i * 37) % 90} ${cx} ${cy})`} className="fill-olive" />
    ))}
  </Tile>
);

const LongStrands = ({ className }: { className?: string }) => (
  <Tile className={className}>
    <Water />
    {[10, 20, 30, 40, 50].map((x, i) => (
      <path key={x} d={`M${x} 4c${i % 2 ? -6 : 6} 14 ${i % 2 ? 6 : -6} 28 0 56`} className={STRAND} strokeWidth="2" strokeLinecap="round" />
    ))}
  </Tile>
);

const MacroAlgae = ({ className }: { className?: string }) => (
  <Tile className={className}>
    <Water />
    <path d="M4 60c4-18 10-26 18-30 6-3 10 4 6 8s-10 2-12-4M16 60c6-14 14-20 24-20 6 0 7 7 2 8s-9-4-12-1M30 60c6-12 14-12 20-18 4-4 10-2 8 3s-8 2-8-2M44 60c4-8 8-10 14-10" className={STRAND} strokeWidth="2.5" strokeLinecap="round" />
  </Tile>
);

const BLOOM = [
  { label: "Spilled green paint", Art: PaintSpill },
  { label: "Green crust along the shore", Art: ShoreCrust },
  { label: "Puffy green scum", Art: PuffyScum },
  { label: "Swirls under the surface", Art: Swirls },
];
const LOOKALIKE = [
  { label: "Duckweed: tiny separate leaves", Art: Duckweed },
  { label: "Long strands of green algae", Art: LongStrands },
  { label: "Filamentous macro-algae", Art: MacroAlgae },
];

/** Small drawing for the answer tiles in the report flow. */
export function GuideThumb({ kind, className }: { kind: "bloom" | "lookalike"; className?: string }) {
  const Art = kind === "bloom" ? PuffyScum : Duckweed;
  return <Art className={cn("size-7", className)} />;
}

function Group({ heading, items }: { heading: string; items: { label: string; Art: (p: { className?: string }) => ReactNode }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <SpecimenTag className="self-start">{heading}</SpecimenTag>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-3 lg:grid-cols-4">
        {items.map(({ label, Art }) => (
          <li key={label} className="flex items-center gap-2.5 lg:flex-col lg:items-start">
            <Art className="size-14 lg:size-16" />
            <span className="text-[0.8125rem] leading-[1.35]">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BloomGuide() {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="bloom-guide-title">
      <h3 id="bloom-guide-title" className="text-xl leading-[1.3]">Is it a bloom?</h3>
      <Group heading="Looks like a bloom" items={BLOOM} />
      <Group heading="Often mistaken for one" items={LOOKALIKE} />
      <p className="font-mono text-xs text-muted-foreground">Guide based on Illinois EPA, Identifying Cyanobacteria Blooms. Drawings, not photos.</p>
    </section>
  );
}
