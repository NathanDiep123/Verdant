type Node = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub: string;
  planned?: boolean;
  core?: boolean;
};

const H = 56;
type Edge = readonly [string, boolean?];

const WIDE = {
  viewBox: "0 0 980 372",
  nodes: [
    { id: "sat", x: 8, y: 20, w: 160, h: H, label: "Satellite data", sub: "Sentinel-2, planned", planned: true },
    { id: "chl", x: 208, y: 20, w: 150, h: H, label: "Chlorophyll processing", sub: "NDCI proxy, planned", planned: true },
    { id: "wx", x: 8, y: 112, w: 160, h: H, label: "Weather data", sub: "planned", planned: true },
    { id: "cit", x: 8, y: 204, w: 160, h: H, label: "Citizen reports", sub: "in the prototype" },
    { id: "rm", x: 8, y: 296, w: 160, h: H, label: "Resilience Map export", sub: "OAH city data" },
    { id: "eng", x: 398, y: 158, w: 130, h: 56, label: "Risk engine", sub: "fixed weights", core: true },
    { id: "score", x: 566, y: 158, w: 110, h: 56, label: "Risk score", sub: "0 to 100" },
    { id: "dash", x: 716, y: 112, w: 130, h: H, label: "Public dashboard", sub: "map and detail" },
    { id: "agency", x: 716, y: 204, w: 130, h: H, label: "Agency view", sub: "sampling priority" },
    { id: "fhir", x: 876, y: 158, w: 96, h: 56, label: "FHIR JSON", sub: "export" },
  ] satisfies Node[],
  edges: ([
    ["M168 48 H208", true],
    ["M358 48 H378 V186 H398", true],
    ["M168 140 H378 V186"],
    ["M168 232 H378 V186"],
    ["M168 324 H378 V186"],
    ["M528 186 H566", true],
    ["M676 186 H696 V140 H716", true],
    ["M696 186 V232 H716", true],
    ["M846 140 H861 V186 H876", true],
    ["M846 232 H861 V186"],
  ] as Edge[]),
};

const TALL = {
  viewBox: "0 0 340 676",
  nodes: [
    { id: "sat", x: 8, y: 8, w: 138, h: H, label: "Satellite data", sub: "Sentinel-2, planned", planned: true },
    { id: "chl", x: 162, y: 8, w: 138, h: H, label: "Chlorophyll proc.", sub: "NDCI, planned", planned: true },
    { id: "wx", x: 8, y: 92, w: 292, h: H, label: "Weather data", sub: "planned", planned: true },
    { id: "cit", x: 8, y: 176, w: 292, h: H, label: "Citizen reports", sub: "in the prototype" },
    { id: "rm", x: 8, y: 260, w: 292, h: H, label: "Resilience Map export", sub: "OAH city data" },
    { id: "eng", x: 8, y: 358, w: 292, h: 56, label: "Risk engine", sub: "fixed weights", core: true },
    { id: "score", x: 8, y: 444, w: 292, h: 56, label: "Risk score", sub: "0 to 100" },
    { id: "dash", x: 8, y: 530, w: 138, h: H, label: "Public dashboard", sub: "map and detail" },
    { id: "agency", x: 162, y: 530, w: 138, h: H, label: "Agency view", sub: "sampling priority" },
    { id: "fhir", x: 8, y: 616, w: 292, h: 52, label: "FHIR JSON export", sub: "sites, scores, reports" },
  ] satisfies Node[],
  edges: ([
    ["M146 36 H162", true],
    ["M300 36 H320 V386 H300", true],
    ["M300 120 H320"],
    ["M300 204 H320"],
    ["M300 288 H320"],
    ["M154 414 V444", true],
    ["M154 500 V515 H77 V530", true],
    ["M154 515 H231 V530", true],
    ["M77 586 V601 H154 V616", true],
    ["M231 586 V601 H154"],
  ] as Edge[]),
};

function Layout({ spec, className, id }: { spec: typeof WIDE | typeof TALL; className: string; id: string }) {
  return (
    <svg
      viewBox={spec.viewBox}
      className={className}
      role="img"
      aria-label="Verdant architecture. Satellite data passes through chlorophyll processing to the risk engine. Weather data, citizen reports and the Resilience Map export also feed the risk engine. The risk engine produces the risk score, which feeds the public dashboard and the agency view, and both lead to the FHIR JSON export."
    >
      <defs>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M1 1 L9 5 L1 9 Z" className="fill-primary" />
        </marker>
      </defs>
      {spec.edges.map(([d, arrow]) => (
        <path
          key={d}
          d={d}
          fill="none"
          className="stroke-primary"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={arrow ? `url(#${id}-arrow)` : undefined}
        />
      ))}
      {spec.nodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            rx={3}
            className={n.core ? "fill-primary stroke-foreground" : "fill-card stroke-foreground"}
            strokeWidth={n.core ? 1.5 : 1}
            strokeDasharray={n.planned ? "4 3" : undefined}
          />
          <text
            x={n.x + n.w / 2}
            y={n.y + n.h / 2 - 3}
            textAnchor="middle"
            className={`font-sans text-[13px] font-semibold ${n.core ? "fill-primary-foreground" : "fill-foreground"}`}
          >
            {n.label}
          </text>
          <text
            x={n.x + n.w / 2}
            y={n.y + n.h / 2 + 14}
            textAnchor="middle"
            className={`font-mono text-[11px] ${n.core ? "fill-primary-foreground" : "fill-muted-foreground"}`}
          >
            {n.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function ArchitectureDiagram() {
  return (
    <figure className="border border-border bg-card p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]">
      <Layout id="wide" spec={WIDE} className="hidden h-auto w-full md:block" />
      <Layout id="tall" spec={TALL} className="mx-auto h-auto w-full max-w-[380px] md:hidden" />
      <figcaption className="mt-3 font-mono text-xs text-muted-foreground">
        Dashed outline: planned input. The prototype fills these with labelled demonstration values.
      </figcaption>
    </figure>
  );
}
