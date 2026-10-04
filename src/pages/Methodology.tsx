import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { CitationsTable } from "@/components/CitationsTable";
import { RiskBadge } from "@/components/RiskBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { citations } from "@/data/citations";
import { PATHWAYS } from "@/engine/pathways";
import type { Category, FactorId, PathwayId } from "@/types";

const SECTIONS = [
  ["how-it-works", "How Verdant Works"],
  ["equations", "Risk equations"],
  ["sentinel-2", "Sentinel-2 note"],
  ["architecture", "Architecture"],
  ["sources", "Data sources"],
  ["limitations", "Limitations"],
  ["future-work", "Future work"],
  ["citations", "Data sources and citations"],
] as const;

const STEPS = [
  ["Satellite observation", "Sentinel-2 imagery is the planned input for a chlorophyll signal over the water surface."],
  ["Environmental data", "Water temperature, wind, season, runoff, recreation and low-water conditions are scored for each site."],
  ["Citizen reports", "A visitor reports what they see. Each report adds evidence to the site, and the score updates right away."],
  ["Risk scoring", "Each pathway combines its factors with fixed, published weights. The site score is the highest pathway score."],
  ["Human review", "A manager reads the factor breakdown and decides whether the score matches what they know of the site."],
  ["Field sampling", "Sites are ranked so sampling crews go to the highest-scoring site first. Lab and agency testing confirm what is there."],
] as const;

const LAKE_MEAD: PathwayId[] = ["algal_bloom", "waterborne_pathogen", "heat_low_water"];
const OAH: PathwayId[] = ["waterborne_pathogen_oah", "ecosystem_stress"];

const CATEGORIES: [Category, string][] = [
  ["Low", "0 to 25"],
  ["Moderate", "26 to 50"],
  ["High", "51 to 75"],
  ["Very High", "76 to 100"],
];

const FUTURE = [
  "Validation: compare Verdant scores with in-situ field-sample results (chlorophyll-a and cyanotoxin measurements from agency sampling) at the same sites and dates.",
  "Real-time Sentinel-2 ingestion",
  "Live weather APIs",
  "Agency monitoring integration",
  "Validated local risk models",
  "Mobile citizen reporting",
  "Automated alerts",
  "FHIR server submission",
];

const LIMITS = [
  "All Verdant scores are unvalidated. The weights are fixed and published, but no score has yet been compared with field measurements.",
  "Lake Mead values are prototype demonstration data. They are labelled as such on every screen that shows them.",
  "The weights are set by hand for this prototype. They are not fitted to observed bloom events.",
  "A citizen report adds a fixed 10 points of citizen evidence. It does not confirm a bloom, and one report can move a site up a category.",
  "Verdant estimates conditions. It never confirms a toxin, and sampling remains the only way to know what is in the water.",
];

const SOURCE_CARDS: { id: string; name: string; use: string }[] = [
  { id: "C7", name: "OAH Resilience Map", use: "Source of the CSV export that feeds the Coimbra demonstration." },
  { id: "C5", name: "Sentinel-2", use: "Band definitions for the planned NDCI chlorophyll proxy (B4 red, B5 red-edge)." },
  { id: "C2", name: "NPS Lake Mead HAB page", use: "Park Service description of bloom risk and the August to December season." },
  { id: "C3", name: "US Bureau of Reclamation", use: "Official Lake Mead elevation shown on the dashboard." },
  { id: "C6", name: "OAH FHIR IG", use: "Canonical base URL used by the FHIR-shaped JSON export." },
];

const H2 = "text-[28px] font-semibold leading-[1.2] tracking-[-0.01em] scroll-mt-20";
const H3 = "text-xl font-semibold leading-[1.3]";
const PROSE = "max-w-[68ch]";
const LINK = "text-primary underline underline-offset-2 hover:no-underline";

function Equation({ id }: { id: PathwayId }) {
  const p = PATHWAYS[id];
  const terms = Object.entries(p.weights) as [FactorId, number][];
  return (
    <div className="p-4 font-mono text-sm tabular-nums">
      <p className="font-semibold">{p.id}</p>
      <p className="mb-2 font-sans text-sm text-muted-foreground">{p.label}</p>
      {terms.map(([f, w], i) => (
        <span key={f} className="block break-all pl-[2ch] -indent-[2ch]">
          {i === 0 ? "  " : "+ "}
          {w.toFixed(2)} × {f}
        </span>
      ))}
    </div>
  );
}

export default function Methodology() {
  return (
    <div className="w-full py-8 md:py-12 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
      <nav aria-label="On this page" className="hidden lg:block">
        <ul className="sticky top-20 flex flex-col gap-2 border-l border-border text-sm font-medium">
          {SECTIONS.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="-ml-px block border-l-2 border-transparent py-1 pl-3 text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex min-w-0 flex-col gap-8 md:gap-12">
        <header className={PROSE}>
          <h1 className="text-[28px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[40px]">Methodology</h1>
          <p className="mt-3 text-muted-foreground">
            How a Verdant score is built, and what it has not yet been tested against.
          </p>
        </header>

        <section id="how-it-works" className="flex flex-col gap-6">
          <h2 className={H2}>How Verdant Works</h2>
          <ol className="grid max-w-[68ch] gap-y-6">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="grid grid-cols-[3rem_1fr] items-baseline gap-x-2">
                <span className="font-mono text-[28px] font-semibold leading-none tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <div>
                  <h3 className={H3}>{title}</h3>
                  <p className="mt-1">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="equations" className="flex flex-col gap-6">
          <h2 className={H2}>Risk equations</h2>
          <div className={`${PROSE} flex flex-col gap-3`}>
            <p>
              Every pathway is a weighted average of 0 to 100 factor scores. When a factor has no value, it drops out
              and the remaining weights are rescaled, so a missing input never counts as zero.
            </p>
            <div className="bg-muted p-4 font-mono text-sm">
              <p>score = round( Σ weight × value ÷ Σ weight )</p>
              <p className="text-muted-foreground">sums run over the factors that have a value</p>
              <p className="mt-2">site score = highest pathway score</p>
              <p className="text-muted-foreground">the pathway that sets it is the leading pathway</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className={H3}>Lake Mead pathways</h3>
            <div className="grid gap-px border border-border bg-border md:grid-cols-3 [&>*]:bg-muted">
              {LAKE_MEAD.map((id) => (
                <Equation key={id} id={id} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className={H3}>OneAquaHealth city pathways</h3>
            <div className="grid gap-px border border-border bg-border md:grid-cols-2 [&>*]:bg-muted">
              {OAH.map((id) => (
                <Equation key={id} id={id} />
              ))}
            </div>
          </div>

          <div className="flex max-w-[68ch] flex-col gap-3">
            <h3 className={H3}>Categories</h3>
            <div className="border border-border bg-card">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Score</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CATEGORIES.map(([cat, range]) => (
                    <TableRow key={cat}>
                      <TableCell className="font-mono tabular-nums">{range}</TableCell>
                      <TableCell>
                        <RiskBadge category={cat} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        <section id="sentinel-2" className="flex flex-col gap-3">
          <h2 className={H2}>Sentinel-2 note</h2>
          <p className="max-w-[68ch] border-l-[3px] border-primary py-1 pl-4">
            NDCI = (B5 − B4) / (B5 + B4), with B4 red and B5 red-edge, is an experimental chlorophyll proxy, not toxin
            detection. Verdant shows it as the planned satellite input; the prototype uses labelled demonstration
            values.
          </p>
        </section>

        <section id="architecture" className="flex flex-col gap-6">
          <h2 className={H2}>Architecture</h2>
          <ArchitectureDiagram />
        </section>

        <section id="sources" className="flex flex-col gap-6">
          <h2 className={H2}>Data sources</h2>
          <ul className="grid divide-y divide-border border border-border bg-card md:grid-cols-2 md:divide-y-0 md:[&>li:nth-child(n+3)]:border-t md:[&>li:nth-child(odd)]:border-r md:[&>li]:border-border">
            {SOURCE_CARDS.map(({ id, name, use }) => {
              const c = citations.find((x) => x.id === id);
              return (
                <li key={id} className="flex flex-col gap-2 p-4">
                  <h3 className={H3}>{name}</h3>
                  <p className="text-sm">{use}</p>
                  {c && (
                    <>
                      <p className="text-sm text-muted-foreground">{c.publisher}</p>
                      <a href={c.url} target="_blank" rel="noopener" className={`${LINK} break-all font-mono text-xs`}>
                        {c.url}
                      </a>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section id="limitations" className="flex flex-col gap-4">
          <h2 className={H2}>Limitations</h2>
          <ul className={`${PROSE} flex list-disc flex-col gap-2 pl-5`}>
            {LIMITS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section id="future-work" className="flex flex-col gap-4">
          <h2 className={H2}>Future work</h2>
          <ol className={`${PROSE} flex list-decimal flex-col gap-2 pl-6 marker:font-mono marker:text-muted-foreground`}>
            {FUTURE.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </section>

        <section id="citations" className="flex flex-col gap-6">
          <h2 className={H2}>Data sources and citations</h2>
          <CitationsTable />
        </section>
      </div>
    </div>
  );
}
