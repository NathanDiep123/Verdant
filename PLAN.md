# Verdant: Spec and Implementation Plan

OneAquaHealth IEEE Global Hackathon 2026, Track 6: Resilience Informatics ("Enable early warning & resilience planning").
Deadline: **2026-10-04 21:00 PDT**. Internal submission target: **20:45 PDT**. Feature freeze: **18:15 PDT**.

> **For agentic workers:** this plan executes through `superpowers:subagent-driven-development`. Every implementation task goes to an execution-tier agent (`model: "sonnet"`). Tasks marked **Team** are done by the human team, because they need accounts, a camera, or a microphone.

---

## 1. Goal and pitch

**Goal:** a deployed web prototype and a 3–5 minute demo video. Together they show an explainable, multi-hazard early-warning tool for freshwater One Health risk. Lake Mead is the pilot site. The same engine then runs on a OneAquaHealth (OAH) city through a single site configuration.

**Tagline:** "See the bloom before it becomes a warning."

**One-sentence pitch:** "Verdant is an explainable early-warning platform that combines satellite imagery, environmental conditions, and citizen observations to identify emerging harmful algal bloom risk and prioritize monitoring across Lake Mead, and it runs on any OneAquaHealth city through one site configuration."

## 2. The presentation-first rule

1. Judges score what they see in the video, the Devpost text, and the deployed site. Every task is ranked by how much it adds to those three things.
2. Lake Mead features run on **prototype data**. Every screen that shows prototype data displays the label "Prototype demonstration data".
3. Real data is used only where it is cheap: the OAH Resilience Map CSV export for the OAH-city transferability demo (Section 6), and the one official Lake Mead data element in Section 19.3, shown next to the prototype values.
4. Every feature shown in the video works in the deployed app. Nothing in the video is a static mockup.
5. Features the video does not show are not built.
6. Visual polish, narrative and copy take priority over feature depth. When a task's time box ends, its working state is kept and the next task starts.
7. Every number and every claim taken from an external source, wherever it appears (site, video, README, Devpost), has a row in the Section 19 citations table. Actor: the orchestrator, during Task 12.1 QA. Action: a number or claim without a row is removed before submission.

## 3. Judging-criteria map

These are the weights and exact criterion titles from the Devpost rules page.

| Criterion (weight) | Features and assets that answer it |
|---|---|
| **Impact & Alignment** (30%) | Sampling priority list with a recommended first sampling target; cited opening statistic (Section 19); One Health panel (environment, human, animal) on the site detail page; multi-hazard pathways; citizen report form; manager action recommendations; the "Verdant for OneAquaHealth cities" page; video segment 6; Devpost paragraph 1 |
| **Innovation & Creativity** (20%) | Live score change when a citizen report is submitted; per-factor contribution bars ("Why is risk elevated?"); one-switch region swap from Lake Mead to Coimbra; Devpost paragraph 2 |
| **Technical Implementation** (20%) | Tested TypeScript risk engine (`src/engine/`); site-agnostic `SiteConfig`; Resilience Map CSV parser; FHIR-shaped JSON export; public GitHub repo with README; Devpost paragraph 3 |
| **Usability & User Experience** (15%) | Four-page app with one clear navigation path; colour-coded map; risk meter; plain-language explanations; disclaimers placed next to every score; mobile layout; Devpost paragraph 4 |
| **Feasibility & Scalability** (15%) | Site configs for all five OAH cities; Methodology page architecture diagram; data-source cards; official Lake Mead elevation card; "Data sources and citations" table; future-work list naming field-sample validation; Devpost paragraph 5 |

## 4. Scope

**In scope (closed list):**
1. Dashboard page: Leaflet map, KPI cards, official Lake Mead elevation card, Sampling priority list, region switch.
2. Site detail page: risk meter, pathway scores, factor contribution bars, 7-day trend chart, explanation, recommendation, One Health panel, disclaimer, FHIR export button.
3. Report a Bloom page: citizen report form, local photo preview, success state, live score update.
4. Verdant for OneAquaHealth cities page: five city cards and a "Run on Coimbra" switch.
5. Methodology page: How Verdant Works, risk equation, NDCI note, architecture diagram, data-source cards, limitations, future work, "Data sources and citations" table.
6. Risk engine with unit tests.
7. FHIR-shaped JSON export of sites, risk scores and citizen reports.
8. README, Devpost text, demo video, deployed URL.

**Out of scope (closed list):** live satellite ingestion; live weather APIs; authentication; database or backend; photo storage; real-time notifications; machine-learning models; a FHIR server; a separate agency dashboard; a before/after imagery slider.

## 5. Assumptions

These are the reconciliations of the user's answers.

1. **A1:** Lake Mead stays the pilot site because it gives the video a stronger hook. Lake Mead is not an OAH case-study site, which costs points on Impact & Alignment (30%). The mitigation is the OAH-cities page, video segment 6, and the site-agnostic `SiteConfig`. Every Lake Mead screen links to the OAH-cities page.
2. **A2:** Multi-hazard is reconciled with the Lake Mead focus as follows. Lake Mead runs three pathways:
   - `algal_bloom` (primary, the user's original weights);
   - `waterborne_pathogen` (Las Vegas Wash urban runoff and recreation);
   - `heat_low_water` (reservoir drawdown and heat).
   The site risk score is the highest pathway score. The pathway that sets it is the **leading pathway**.
3. **A3:** The only Resilience Map export available is an area-level Earth-observation summary for **Coimbra** (`data/raw/oah-coimbra-eo-summary.csv`, monthly NDVI and NDWI, 2020-01 to 2026-09), and it drives the satellite signal chart. Per-site Coimbra values stay synthetic, shown under the 20 real Resilience Map site names and labelled "Synthetic demo, structured as a Resilience Map export", because the export has no per-site columns; Lake Mead uses prototype data.
4. **A4:** I could not retrieve the official OAH citizen-science protocol fields. The Zenodo record 10.5281/zenodo.20344421 exposes only a PDF, and the FHIR IG CI build returned 404. The report form keeps the user's options, each marked **TO REPLACE with OAH protocol fields**. Task 5.1 attempts the replacement once. When that attempt fails, the user's options ship unchanged.
5. **A5:** The FHIR IG canonical base URL is `http://hl7.eu/fhir/ig/oah`, read from the IG's `sushi-config.yaml` on 2026-10-04 (Section 19, row C6). It is stored in one constant, `OAH_IG_BASE = "http://hl7.eu/fhir/ig/oah"`, in `src/fhir/constants.ts`. The profile ids `location-oah` and `observation-indicators-oah` are unverified, because the IG CI build returned 404 on 2026-10-04. The README states that the profile ids are unverified.
6. **A6:** All team members are students, so eligibility needs no action.
7. **A7:** The user approves these new dependencies by approving this plan: leaflet, react-leaflet, recharts, react-router, papaparse, vitest. shadcn components are pulled per AGENTS.md point 4.
8. **A8:** The workspace is not a git repository. Task 1.1 runs `git init`. The Team creates the public GitHub repo, pushes, and deploys.

## 6. Data plan

### 6.1 Lake Mead prototype dataset: `src/data/lakeMead.ts`

Every value is a 0–100 factor score and is labelled prototype. Coordinates are approximate. Task 2.3 verifies that each marker sits on water on the map.

| id | Name | lat | lon | chlorophyll | water_temperature | calm_wind | citizen_evidence | seasonality | runoff | recreation_exposure | air_temperature | low_water |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| callville-bay | Callville Bay | 36.14 | -114.72 | 87 | 78 | 73 | 64 | 85 | 20 | 68 | 80 | 60 |
| las-vegas-bay | Las Vegas Bay | 36.12 | -114.86 | 72 | 75 | 60 | 55 | 85 | 60 | 60 | 80 | 50 |
| boulder-basin | Boulder Basin | 36.05 | -114.78 | 33 | 70 | 50 | 30 | 85 | 15 | 90 | 82 | 85 |
| echo-bay | Echo Bay | 36.31 | -114.43 | 30 | 65 | 45 | 20 | 85 | 10 | 40 | 60 | 30 |
| overton-arm | Overton Arm | 36.40 | -114.38 | 58 | 72 | 65 | 40 | 85 | 25 | 35 | 78 | 40 |
| temple-basin | Temple Basin | 36.05 | -114.33 | 8 | 35 | 25 | 5 | 85 | 6 | 15 | 30 | 20 |

Expected engine output (asserted in tests):

| Site | algal_bloom | waterborne_pathogen | heat_low_water | Site score | Category | Leading pathway |
|---|---|---|---|---|---|---|
| Callville Bay | 79 | 52 | 69 | 79 | Very High | algal_bloom |
| Las Vegas Bay | 70 | 61 | 63 | 70 | High | algal_bloom |
| Boulder Basin | 48 | 49 | 73 | 73 | High | heat_low_water |
| Echo Bay | 43 | 29 | 40 | 43 | Moderate | algal_bloom |
| Overton Arm | 62 | 38 | 55 | 62 | High | algal_bloom |
| Temple Basin | 23 | 13 | 21 | 23 | Low | algal_bloom |

**7-day history:** each site carries `history: number[7]` of site scores, ending at its current score.
- Callville Bay: `[58, 61, 63, 67, 70, 74, 79]`
- Las Vegas Bay: `[60, 62, 63, 65, 66, 68, 70]`
- Boulder Basin: `[72, 73, 71, 72, 74, 73, 73]`
- Echo Bay: `[44, 42, 43, 45, 44, 43, 43]`
- Overton Arm: `[60, 61, 63, 62, 61, 62, 62]`
- Temple Basin: `[35, 33, 30, 28, 26, 25, 23]`

**Seed citizen reports:** 7 reports in `src/data/lakeMeadReports.ts`, each tagged `synthetic-demo`. Callville Bay has 3, Las Vegas Bay 2, Overton Arm 1, Boulder Basin 1.

### 6.2 OAH Coimbra dataset: `src/data/oah/coimbra.ts`

- **Source:** a Resilience Map CSV export (https://apps.oneaquahealth.eu/resmap/), city Coimbra, all sites, latest available date range.
- **Team** exports it and saves it to `data/raw/oah-coimbra.csv` by 15:00 PDT.
- `src/data/oah/parseResmapCsv.ts` (papaparse) reads the CSV. Rows are grouped by site, and the latest row per site is kept.
- Columns map to these factors:
  - `lab_pathogen_risk` ← pathogen risk
  - `contamination` ← contamination level
  - `ecosystem_health_deficit` ← 100 minus ecosystem health
  - `air_temperature` ← temperature
  - `runoff` ← precipitation
- `src/data/oah/columnMap.ts` holds the exact header names. The implementer writes them after reading the CSV header.
- Each mapped column is min-max normalized to 0–100 across the city's sites. A column already on a 0–100 scale is used as-is.
- When the CSV is missing at 15:00 PDT, or has no per-site rows, the fallback applies: 20 synthetic Coimbra sites (the real Resilience Map site names C1 to C20 at approximate coordinates), labelled per A3, built in the same shape.

### 6.3 Site configs: `src/config/sites.ts`

```ts
type SiteConfig = {
  id: string; name: string; country: string;
  center: [number, number]; zoom: number;
  pathways: PathwayId[];        // which pathway definitions apply
  dataStatus: "prototype" | "resilience-map-export" | "synthetic-demo" | "config-only";
  sites: SiteRecord[];          // empty for config-only cities
};
```

| Config | dataStatus |
|---|---|
| lake-mead | prototype |
| coimbra | resilience-map-export or synthetic-demo |
| benevento, ghent, oslo, toulouse | config-only (center, zoom, pathways; no sites) |

## 7. Risk engine spec: `src/engine/`

**Pathway definitions** (`src/engine/pathways.ts`). Weights are fixed and each pathway's weights sum to 1.00.

| Pathway | Factors and weights | Used by |
|---|---|---|
| `algal_bloom` | chlorophyll 0.40, water_temperature 0.20, calm_wind 0.15, citizen_evidence 0.15, seasonality 0.10 | lake-mead |
| `waterborne_pathogen` | runoff 0.35, water_temperature 0.15, citizen_evidence 0.20, recreation_exposure 0.30 | lake-mead |
| `heat_low_water` | air_temperature 0.40, low_water 0.40, citizen_evidence 0.20 | lake-mead |
| `waterborne_pathogen_oah` | lab_pathogen_risk 0.40, runoff 0.25, air_temperature 0.15, citizen_evidence 0.20 | OAH cities |
| `ecosystem_stress` | contamination 0.40, ecosystem_health_deficit 0.40, citizen_evidence 0.20 | OAH cities |

**Functions** (`src/engine/score.ts`):

- `scorePathway(factors, pathway)` returns `{ pathwayId, score, category, coverage, contributions, missing }`.
  - `score` = round(Σ weight × value over present factors ÷ Σ weights of present factors), using `Math.round`.
  - `coverage` = Σ weights of present factors (0–1). When coverage is below 1, the UI shows "Partial data: X% of factors".
  - `contributions` = `[{ factor, value, weight, points }]` sorted by points, descending. `points` = weight × value ÷ coverage.
  - `missing` = the factor ids with no value.
- `scoreSite(site, config)` returns `{ siteScore, category, leadingPathway, pathways[] }`. `siteScore` is the highest pathway score. A tie goes to the earlier pathway in `config.pathways`.
- `categorize(score)`: 0–25 Low, 26–50 Moderate, 51–75 High, 76–100 Very High.
- `trend(history)`: last minus first ≥ +5 gives Increasing; ≤ −5 gives Decreasing; anything else gives Stable.
- `applyCitizenReport(site)`: returns a copy of the site with `citizen_evidence` raised by 10, capped at 100.
- `recommend(category)`:
  - Low: "Routine observation"
  - Moderate: "Continue monitoring"
  - High: "Prioritize follow-up observation"
  - Very High: "Recommend field sampling"

**Explanation** (`src/engine/explain.ts`): `explain(result)` returns one sentence naming the leading pathway and its top two contributions. Example: "Risk is elevated mainly by algal bloom conditions: a strong chlorophyll signal and warm water temperature."

**Tests** (`src/engine/score.test.ts`, Vitest; TDD applies):
1. Every pathway's weights sum to 1.00 (±1e-9).
2. Every row of the Section 6.1 expected-output table, exact integers.
3. Category boundaries: 25 is Low, 26 is Moderate, 50 is Moderate, 51 is High, 75 is High, 76 is Very High.
4. `algal_bloom` with `citizen_evidence` missing and every other factor at 60 gives score 60, coverage 0.85, and `missing` = `["citizen_evidence"]`.
5. Trend: Callville is Increasing, Temple is Decreasing, Echo is Stable.
6. `applyCitizenReport` on Callville raises citizen_evidence to 74 and algal_bloom to 81. A site at 95 is capped at 100.
7. Contributions are sorted in descending order, and their points sum to the unrounded score (±1e-9).

## 8. Pages

Routes use react-router. The navigation order is Dashboard · Report a Bloom · OAH Cities · Methodology. The active region (`lake-mead` | `coimbra`) lives in React context and is shown in the header as a two-state switch.

1. **`/` Dashboard.**
   - KPI cards:
     - Region status: the highest category across sites.
     - Highest-risk site.
     - Citizen reports: the count.
     - Areas Requiring Attention: the count of High plus Very High.
     - Official data card, shown only when the region is `lake-mead`: "Lake Mead elevation: 1,037.93 ft (Oct 3, 2026)", badge "Official data", and the line "Source: U.S. Bureau of Reclamation, Lower Colorado River Operations. Accessed 2026-10-04." with the source URL as a link. The values come from Section 19.3. This card never carries the prototype label, and the prototype values around it keep the "Prototype demonstration data" label.
   - Leaflet map with OSM tiles. Markers are colored by category: Low green, Moderate yellow, High orange, Very High red. A popup shows name, score, category, leading pathway, trend, and a "View analysis" link.
   - **Sampling priority list**: table | Rank | Site | Risk | Leading pathway | Trend | Reports | Action |, ranked by site score descending (rank 1 = highest score). The heading text is exactly "Sampling priority list".
   - The rank-1 row carries the tag "Recommended first sampling target", rendered inside the "Verdant recommendation" label style (Section 8.3).
   - "Prototype demonstration data" label, or the A3 label on Coimbra.
2. **`/site/:id` Site detail.**
   - Name, site score, category, trend, last updated, recommended action.
   - Risk meter.
   - One card per pathway.
   - Factor contribution bars for the leading pathway, headed "Why is risk elevated?" with the `explain()` sentence.
   - Recharts 7-day line chart.
   - One Health panel (Section 8.1).
   - Manager actions with the label "Verdant recommendation", shown next to the label "Official advisory: none issued" (Section 8.3). When the site is rank 1 in the Sampling priority list, the Verdant recommendation block also reads "Recommended first sampling target".
   - Disclaimer (Section 8.2).
   - "Export FHIR JSON" button.
3. **`/report` Report a Bloom.**
   - Fields:
     - site (select);
     - observation type, multi-select. These are the user's options, **TO REPLACE with OAH protocol fields** (A4): Green surface layer, Floating clumps, Green streaks, Discolored water, Unusual odor, Dead fish, Other;
     - animals present (yes/no);
     - photo (local preview only, not stored);
     - notes.
   - Warning above the submit button: "A citizen report does not confirm a harmful algal bloom. Laboratory or agency testing is required for confirmation."
   - On submit, `applyCitizenReport` updates the site in context, the report is added to the list, and the success state shows "Report received. Your observation has been added to the community monitoring layer." with a link to the updated site.
   - Note: "Why citizen observations matter".
4. **`/oah-cities` Verdant for OneAquaHealth cities.**
   - Intro: "Lake Mead serves as Verdant's pilot site, but the architecture is designed to support other lakes, reservoirs, and urban freshwater ecosystems using the same satellite and environmental monitoring workflow."
   - Five city cards (Benevento, Coimbra, Ghent, Oslo, Toulouse), each showing its `dataStatus` badge and its pathways.
   - Coimbra card button "Run Verdant on Coimbra": it sets the active region to `coimbra` and navigates to `/`.
   - Below the cards, the satellite signal chart for Coimbra (monthly NDVI and NDWI means, last 24 months, citation row C9). It also shows on the Dashboard when the region is `coimbra`.
   - A 3-step "How to add a city" panel: export the Resilience Map CSV, map its columns, add the `SiteConfig`.
5. **`/methodology` Methodology.**
   - How Verdant Works: satellite observation → environmental data → citizen reports → risk scoring → human review → field sampling.
   - Risk equations from Section 7.
   - Sentinel-2 note: "NDCI = (B5 − B4) / (B5 + B4), with B4 red and B5 red-edge, is an experimental chlorophyll proxy, not toxin detection. Verdant shows it as the planned satellite input; the prototype uses labelled demonstration values."
   - Architecture diagram as inline SVG: Satellite data → chlorophyll processing → risk engine ← weather data, citizen reports, Resilience Map export → risk score → public dashboard and agency view → FHIR JSON export.
   - Data-source cards.
   - Limitations, including this exact sentence: "All Verdant scores are unvalidated. The weights are fixed and published, but no score has yet been compared with field measurements."
   - Future work, first item: "Validation: compare Verdant scores with in-situ field-sample results (chlorophyll-a and cyanotoxin measurements from agency sampling) at the same sites and dates." Then: real-time Sentinel-2 ingestion, live weather APIs, agency monitoring integration, validated local risk models, mobile citizen reporting, automated alerts, FHIR server submission.
   - "Data sources and citations" table, rendered from `src/data/citations.ts` per Section 19.

### 8.1 One Health panel text

- **Environment:** ecological stress, nutrients, temperature, hydrology.
- **Human health:** recreational exposure.
- **Animal health:** pets and wildlife.
- Visitor guidance in cautious scientific language.

### 8.2 Disclaimer text

"Verdant identifies conditions associated with increased bloom risk. It does not confirm toxin presence or replace field sampling."

This text appears on the site detail page and in the footer of every page.

### 8.3 Verdant recommendation vs Official advisory

- Every recommendation Verdant produces (including "Recommended first sampling target") sits under the label "Verdant recommendation".
- The label "Official advisory: none issued" sits next to it on the site detail page. Verdant never shows its own output under the word "advisory".
- On the dashboard, the rank-1 tag in the Sampling priority list uses the same "Verdant recommendation" label style.

## 9. FHIR-shaped JSON export: `src/fhir/`

- `toFhirBundle(config, results, reports)` returns a `Bundle` with `type: "collection"` containing these resources.
  - One `Location` per site:
    - `meta.profile` = `${OAH_IG_BASE}/StructureDefinition/location-oah`
    - `name`, `position {latitude, longitude}`.
  - One `Observation` per site score:
    - `status: "preliminary"`, `code.text: "Verdant site risk score"`;
    - `subject` references the Location, `valueInteger` = site score;
    - one `component` per pathway (`code.text` = pathway id, `valueInteger` = score);
    - `interpretation.text` = category.
  - One `Observation` per citizen report:
    - `meta.profile` = `${OAH_IG_BASE}/StructureDefinition/observation-indicators-oah`;
    - `status: "preliminary"`, `category.text: "citizen-science"`;
    - `valueCodeableConcept.text` = observation types joined, `effectiveDateTime`, `subject` = the Location, `note` = notes.
  - Every resource carries `meta.tag` = `{ code: "synthetic-demo" }`, or `{ code: "prototype" }` for Lake Mead.
- The "Export FHIR JSON" button downloads `verdant-<config.id>-fhir.json`.
- **Tests** (`src/fhir/bundle.test.ts`, TDD applies):
  - The bundle type is collection.
  - Every Observation `subject.reference` resolves to a Location `fullUrl` in the bundle.
  - Every resource has a `meta.tag`.
  - The Lake Mead seed bundle has 6 Locations, 6 score Observations and 7 report Observations.

## 10. Tech stack and install list

- React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui (AGENTS.md point 5). The only stylesheet is `src/index.css`. Leaflet's CSS is imported once in `src/main.tsx`.
- npm packages: `react-router leaflet react-leaflet recharts papaparse`. Dev packages: `vitest @types/leaflet @types/papaparse`.
- shadcn components: `button card badge table tabs input textarea select checkbox label separator alert switch`.
- Deploy target: Vercel (static build, `npm run build` → `dist/`), with a SPA rewrite in `vercel.json`.

## 11. Design direction

Status: WRITTEN (Task 1.2). Product context lives in `PRODUCT.md`. Every UI task names `impeccable` and follows this section without reinterpretation (AGENTS.md point 3). Design read: Operate-mode monitoring tool for agency staff and judges, in a field-survey-instrument language. Dials: VARIANCE 4, MOTION 2, DENSITY 5. Light theme only; no dark mode is built.

**11.1 Thesis.** Verdant looks like a hydrological survey instrument, not a SaaS dashboard: a cool paper-grey sheet, ink type, hairline rules and one deep reservoir-blue accent, so the only saturated colour on screen is risk. Numbers are the hero; every score is set in mono, sits next to its category word and icon, and is one click from its explanation.

**11.2 Typography.**
- Families: `Schibsted Grotesk` (all text, headings, UI) and `IBM Plex Mono` (every number, score, factor id, equation, data label). No third family. No serif.
- Import, first line of `src/index.css`, before `@import "tailwindcss";`:
  `@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Schibsted+Grotesk:wght@400;500;600;700&display=swap");`
- Tailwind mapping in `@theme inline`: `--font-sans: "Schibsted Grotesk", ui-sans-serif, system-ui, sans-serif;` `--font-mono: "IBM Plex Mono", ui-monospace, monospace;`. All mono numbers use `tabular-nums`.
- Scale (size / line-height / weight / use):
  - 72px / 1 / Mono 600: site-detail score numeral only (48px below 768px).
  - 40px / 1.1 / Sans 700, tracking -0.02em: page H1 (28px below 768px).
  - 28px / 1.2 / Sans 600: KPI values (Mono 600), section H2.
  - 20px / 1.3 / Sans 600: H3, card titles, popup site name.
  - 16px / 1.55 / Sans 400: body, form controls, explanation sentence. Prose max width 68ch.
  - 14px / 1.45 / Sans 500: table cells, nav links, buttons, factor labels.
  - 12px / 1.4 / Mono 500: data labels (prototype/official/source lines), axis ticks, units, "pts". Sentence case, no letter-spacing, no uppercase.
- Uppercase is used nowhere except the category word inside risk badges (Sans 600, 12px, tracking 0.04em).

**11.3 Colour tokens** (`src/index.css`, `:root`; hex values exact). shadcn reads the semantic names; Tailwind gets `--color-*` via `@theme inline { --color-X: var(--X); }` for every token below.

| CSS variable | Hex | shadcn/Tailwind role |
|---|---|---|
| `--background` | `#F3F5F4` | page background (`bg-background`) |
| `--card`, `--popover` | `#FBFCFB` | surfaces: map frame, tables, popups, inputs |
| `--foreground`, `--card-foreground`, `--popover-foreground` | `#14211F` | ink |
| `--muted` | `#E7ECEA` | quiet fills: table header, hover row, `secondary` |
| `--muted-foreground` | `#56645F` | muted ink: meta lines, helper text |
| `--border`, `--input` | `#D3DBD8` | hairlines, input borders |
| `--primary`, `--ring` | `#174C6B` | accent: primary button, links, focus ring, contribution bars, "Official data" badge |
| `--primary-foreground` | `#FBFCFB` | text on accent |
| `--secondary` / `--accent` | `#E7ECEA` | shadcn hover surfaces (never coloured) |
| `--secondary-foreground` / `--accent-foreground` | `#14211F` | |
| `--destructive` | `#B3261E` | form errors only |
| `--radius` | `0.25rem` | |

Risk tokens (also exposed as `--color-risk-*`). Solid = markers, meter, chart dots. Tint + text = badges and table cells. Lightness is non-monotonic on purpose, so every category also carries a size, an icon (lucide-react) and its word.

| Category | `--risk-*` solid | `--risk-*-tint` | `--risk-*-ink` | Icon | Marker diameter | Number on marker |
|---|---|---|---|---|---|---|
| Low | `#3E9A5A` | `#E2F1E6` | `#1D5C34` | `ShieldCheck` | 24px | ink `#14211F` |
| Moderate | `#F2C230` | `#FBF0C6` | `#6B5300` | `Eye` | 28px | ink `#14211F` |
| High | `#E8762B` | `#FCE5D3` | `#8A3D0B` | `TriangleAlert` | 32px | ink `#14211F` |
| Very High | `#B3261E` | `#F8DEDB` | `#8C1D16` | `OctagonAlert` | 36px | `#FBFCFB` |

Risk badge (one component, `RiskBadge`): tint background, ink text, 1px border in the solid colour, icon 14px + score (Mono) + category word. Never colour without the word. Icons: lucide-react only (installed by shadcn; no second icon library), stroke width 1.75 everywhere.

**11.4 Layout, spacing, radius, shadow.**
- Shell: header 60px, `bg-card`, bottom hairline; wordmark "Verdant" Sans 700 20px left; nav (Dashboard, Report a Bloom, OAH Cities, Methodology) Sans 500 14px, active link = ink with 2px accent underline; region switch right, as a 2-segment control (Lake Mead | Coimbra), active segment `bg-primary text-primary-foreground`. Below 768px: nav moves into a shadcn `Sheet` opened by a `Menu` icon button; region switch stays visible. Content container `max-w-[1360px] mx-auto px-6` (px-4 below 768px). Footer: disclaimer (§8.2) in 14px muted ink above a hairline.
- Spacing: 4px base; only Tailwind steps 1, 2, 3, 4, 6, 8, 12, 16. Section gap 48px (`gap-12`) desktop, 32px mobile. Inside panels 16px or 24px.
- Radius: 4px (`rounded-sm`) on every rectangle (buttons, inputs, panels, popups, badges). Markers and meter pointer are the only round shapes. No `rounded-xl`, no pills.
- Shadow: none on page elements; panels are separated by 1px `border` hairlines. One shadow token, `0 6px 24px rgb(20 33 31 / 0.14)`, used only on Leaflet popups, `Select`/dropdown content and `Sheet`.
- Dashboard @1440: row 1 = KPI strip, one bordered band split into 5 cells by vertical hairlines: Region status, Highest-risk site, Citizen reports, Areas Requiring Attention, then the Official data cell (4px left border in `--primary`, "Official data" badge, value Mono 28px, source line Mono 12px with link). Row 2 = 12-col grid: map `col-span-7`, height 620px; "Sampling priority list" `col-span-5`, same height, scroll inside if needed. Data label "Prototype demonstration data" sits directly above the KPI strip, left-aligned. @375: KPI strip becomes 2x2 grid, official cell full width beneath, map full width 380px tall, priority list renders as stacked rows (rank + site + badge on line 1; leading pathway, trend, reports, action on line 2). No horizontal scroll.
- Priority list: rank in Mono 20px muted, site Sans 600, `RiskBadge`, trend as lucide `TrendingUp`/`TrendingDown`/`MoveRight` + word, action text. Rows separated by one bottom hairline (no top borders). Rank-1 row has no risk-tinted background; it gets a 3px left `--primary` border and the "Verdant recommendation" label block containing "Recommended first sampling target".
- "Verdant recommendation" label style: 3px left border `--primary`, padding 8px 12px, label 12px Sans 600 in `--primary`, content 14px ink. "Official advisory: none issued" sits beside it as plain 14px muted text with 1px dashed `--border` box. Never coloured red/orange.
- Data labels: "Prototype demonstration data" and the A3 Coimbra label = Mono 12px muted ink, 1px dashed border, 4px radius, padding 2px 8px. "Official data" = solid `--primary` background, `--primary-foreground` text, Mono 12px.
- Site detail @1440: hero band, 2 columns 5/7. Left: H1 site name, meta line (trend, last updated) 14px muted, then score numeral 72px + `RiskBadge` on one baseline. Right: risk meter (11.6) on top, then the recommendation pair (Verdant recommendation | Official advisory). Below: 7/5 grid, "Why is risk elevated?" with explanation sentence and contribution bars left, 7-day chart right (Recharts line, stroke `--foreground` 2px, dots coloured by category, no gridlines except a hairline at y=25/50/75 for category bounds, y 0-100). Then the three pathway scores as one bordered strip split by vertical hairlines (not three cards). Then One Health panel: three columns (Environment, Human health, Animal health) each with lucide icon (`Leaf`, `User`, `PawPrint`) + 14px text, visitor guidance below full width. Then disclaimer, then "Export FHIR JSON" secondary button (outline, `Download` icon). @375: everything single column in that order; score numeral 48px.
- Report form: single left-aligned column `max-w-[640px]` plus a sticky aside `w-[320px]` on the right (@1024+), showing the selected site's live `RiskBadge`, score Mono 40px and leading pathway; this is where the 79 to 81 change is seen in the video. Labels above inputs, helper/errors below, `gap-2` per field. Observation types as a 2-column checkbox grid. Warning (§8 item 3) is a shadcn `Alert` with `TriangleAlert`, tint `--muted`, ink text, directly above the submit button. Submit = primary button "Submit report". Success state replaces the form in place with the confirmation sentence and a link "View updated site". @375: aside moves above the form as a compact one-line summary.
- OAH Cities: H1 + intro (68ch). Cities as one bordered list, 5 rows split by hairlines: city name Sans 600 20px, country muted, `dataStatus` label (Mono 12px dashed style), pathway ids in Mono 12px; the Coimbra row alone has the primary button "Run Verdant on Coimbra" right-aligned. "How to add a city" below as an ordered list whose items start with the verb (Export, Map, Add), numbers in Mono 28px muted.
- Methodology (Read mode): @1024+ left sticky in-page nav `w-[220px]` (anchors to each section), content column max 72ch. Equations in `bg-muted` blocks, Mono 14px, 16px padding. Architecture SVG spans the content column, strokes `--foreground` 1.5px, nodes `bg-card` with hairline border, flow arrows `--primary`. Citations table full content width inside an `overflow-x-auto` wrapper (the only permitted horizontal scroll). @375: nav hidden, single column.

**11.5 Map.**
- Tiles: Esri World Light Gray Canvas (free, no key; built on OpenStreetMap and other data), URL `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, `maxZoom: 16`, attribution `Tiles &copy; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`; CARTO Positron was dropped because its tiles show an "API key required" watermark.
- Map frame: 1px `--border`, 4px radius, `bg-card`; zoom control top-right; scroll-wheel zoom off on mobile.
- Markers: Leaflet `divIcon`, circle sized per 11.3, fill = risk solid, 2px `#FBFCFB` stroke plus 1px outer `#14211F` at 40% (box-shadow ring), site score centred in Mono 600 12px (13px for High/Very High). Very High also carries the pulse ring (11.7). Larger markers render above smaller (`zIndexOffset` = score × 10).
- Legend: bottom-left inside the map, `bg-card` hairline box, four rows of marker swatch + icon + category word + range (Mono 12px).
- Popup: `bg-card`, 4px radius, the one shadow token, padding 12px, width 240px. Content: site name 20px Sans 600; `RiskBadge`; leading pathway and trend 14px; "View analysis" text link in `--primary` with `ArrowRight` icon. Restyle Leaflet's default popup tip and close button to these tokens in `src/index.css` `@layer base` (no new CSS file).

**11.6 Risk meter and contribution bars.**
- Risk meter: full-width horizontal scale 0-100, height 14px, four equal segments (0-25, 26-50, 51-75, 76-100) with 2px gaps; segments show the category tint, the current category segment shows its solid colour. Pointer: 2px ink vertical line 22px tall at the score position, score in Mono 600 14px above it. Below: tick labels 0, 25, 50, 75, 100 Mono 12px muted and category words under each segment centre in 12px. Score change animates the pointer position (11.7).
- Contribution bars ("Why is risk elevated?"): one row per contribution, sorted descending. Grid columns: factor label (Sans 500 14px, human name) 180px | bar | value. Bar height 10px, 2px radius, fill `--primary`, length = points as % of 100 (so bars sum to the pathway score), no background track. Value column Mono 12px: "34.8 pts" and under it muted "87 × 0.40". Missing factors list below as muted 12px "No data: citizen evidence". Partial-data note "Partial data: X% of factors" above the bars when coverage < 1. @375: label above bar, value right of bar.

**11.7 Motion** (the only motion in the app; all disabled under `prefers-reduced-motion: reduce`).
- Very High marker pulse: a ring pseudo-element in the risk solid colour, `scale 1 → 1.9`, `opacity 0.5 → 0`, 1800ms, `cubic-bezier(0.16, 1, 0.3, 1)`, infinite, defined as one `@keyframes verdant-pulse` in `src/index.css`.
- Live score change on report submit: the score numeral counts from old to new over 600ms ease-out (requestAnimationFrame in a small hook writing to a ref, not React state per frame); the risk meter pointer translates over 600ms same easing; marker size/colour and badge swap with 300ms transitions; the changed priority-list row and the report aside get a 1200ms fade from `--muted` to transparent background.
- Hover/focus: colour and border transitions 120ms. No entrance animations, no scroll reveals, no skeleton shimmer, no page transitions.

**11.8 Anti-patterns rejected** (pattern → what Verdant does instead).
1. Purple/blue gradient backgrounds or gradient text → flat `#F3F5F4` page, single flat accent `#174C6B`, zero gradients.
2. Generic rounded cards on a grid (default shadcn `Card` with `rounded-xl shadow-sm`) → hairline-divided bands and strips, 4px radius, no shadow.
3. Default shadcn spacing and shadows → spacing limited to the 11.4 steps; shadow only on popups/dropdowns/sheet.
4. Centered hero with emoji → no hero on any page; dashboard opens on data, H1s left-aligned; zero emoji anywhere.
5. Stock "clean SaaS" look (Inter + slate-900 + white) → Schibsted Grotesk + IBM Plex Mono on cool paper-grey with ink.
6. Three equal feature cards → pathway scores as one divided strip; One Health as three text columns with no boxes.
7. KPI tiles with giant numbers, icons in coloured circles, and fake trend deltas → one 5-cell KPI band, Mono values, no decorative icon bubbles, no invented percentages.
8. Colour-only risk encoding → colour + marker size + icon + category word + number, everywhere.
9. Uppercase tracked eyebrows above every heading → no eyebrows; headings stand alone.
10. Decorative status dots before list items and nav links → none; only map markers are dots.
11. Progress bars with grey background tracks → contribution bars have no track; only the risk meter shows its full scale, because the scale is the information.
12. Em dashes and en dashes in UI copy → hyphens, commas, periods (copy also passes `no-ai-slop`).
13. Default Leaflet blue pin markers and popup chrome → sized circle markers with scores, restyled popup.
14. Red/orange styling on Verdant's own recommendation (alarm theatre) → recommendation uses the accent label style; only risk badges carry risk colour.

**11.9 Polish checklist** (`impeccable` polish pass, Task 8.1, runs every item at 1440px and 375px).
- [ ] Only Schibsted Grotesk and IBM Plex Mono load; every number is Mono with `tabular-nums`.
- [ ] Only colours from 11.3 appear (grep for stray hex, `slate-`, `gray-`, `zinc-`, `blue-`, `purple-`).
- [ ] Every risk mention shows colour + icon + word; Moderate and High are told apart in a deuteranopia simulation by icon and size.
- [ ] Text contrast ≥ 4.5:1 for body and badge text; focus ring `--ring` visible on every interactive element.
- [ ] All radii 4px except markers/meter pointer; no shadow outside popups/dropdowns/sheet.
- [ ] "Prototype demonstration data" (or A3 label) visible on every screen with prototype values; Official data card has no prototype label; disclaimer on site detail and footer.
- [ ] "Verdant recommendation" and "Official advisory: none issued" appear together on site detail; the word "advisory" never labels Verdant output.
- [ ] Map uses the Section 11.5 tiles with their attribution; Callville Bay marker is red, 36px, pulsing; popups match 11.5.
- [ ] Report submit shows 79 → 81 counting in the aside and on the dashboard; reduced motion shows the final value instantly.
- [ ] No horizontal page scroll at 375px (citations table scrolls inside its wrapper only); nav on one line at 1440px.
- [ ] No 11.8 anti-pattern present; zero em/en dashes in rendered text; no emoji; no console errors.

## 12. Task list

**Rules for every task:**
- The execution-tier agent (`model: "sonnet"`) implements it unless the task says **Team**.
- Every implementing agent applies the `ponytail` ladder (point 2), reads files graphify-first (point 8), runs `no-ai-slop` on the user-facing text it writes (point 12), and makes no AI-attribution commits (point 11).
- **TDD** applies to Tasks 2.1, 2.2, 2.4 and 9.2 only.
- Visual tasks are verified by running `npm run dev` and checking the named screen in the browser.
- The orchestrator writes `PROGRESS.md` entries.
- The time box for each phase is shown in brackets (PDT).

### Phase 1: Setup [13:15–13:45]

- **1.1** Scaffold.
  - Trigger: plan approved.
  - Action: Vite React-TS app at the repo root, Tailwind v4, `shadcn init`, the Section 10 packages, the Vitest config, `vercel.json`, and `git init`.
  - Files: `package.json`, `vite.config.ts`, `tsconfig*.json`, `components.json`, `src/index.css`, `src/main.tsx`, `src/App.tsx`, `vercel.json`, `.gitignore`.
  - Done: `npm run build` exits 0 and `npx vitest run` exits 0.
- **1.2** Design direction.
  - Trigger: 1.1 done.
  - Actor: a planning-tier agent (`model: "opus"`), per AGENTS.md point 3.
  - Action: run the `impeccable` init step, then the `design-taste-frontend` pass. Write the direction into Section 11.
  - Done: Section 11 no longer says "NOT YET WRITTEN".
- **1.3 Team:** export the Coimbra CSV from the Resilience Map into `data/raw/oah-coimbra.csv`. Done: the file exists by 15:00 PDT. Else the A3 fallback applies.

### Phase 2: Data and engine [13:45–14:45]

- **2.1** Write the engine (`src/engine/pathways.ts`, `score.ts`, `explain.ts`, `score.test.ts`) per Section 7. Done: `npx vitest run src/engine` passes all 7 test groups.
- **2.2** Write the Lake Mead data (`src/data/lakeMead.ts`, `src/data/lakeMeadReports.ts`) per Section 6.1, and the citations data (`src/data/citations.ts`): one exported array holding every Section 19.2 row verbatim, plus one exported object `lakeMeadOfficial` holding the Section 19.3 element. Done: test group 2 passes against this data, and `citations.length` equals the Section 19.2 row count (9).
- **2.3** Write site configs and region context (`src/config/sites.ts`, `src/state/RegionContext.tsx`) for 6 configs per Section 6.3. Done: the build passes, and a temporary `/` shows 6 Lake Mead markers sitting on water.
- **2.4** Write the Coimbra data (`src/data/oah/parseResmapCsv.ts`, `columnMap.ts`, `coimbra.ts`, `parseResmapCsv.test.ts`).
  - When the CSV exists, map it. Else build the A3 fallback.
  - The test uses a 3-row fixture in `src/data/oah/fixture.csv`.
  - Done: `npx vitest run src/data` passes, and `coimbra.sites.length` ≥ 3.

### Phase 3: Map and dashboard [14:45–15:45]

- **3.1** App shell (`src/App.tsx`, `src/components/Layout.tsx`): routes, navigation, region switch, footer disclaimer. Done: every route renders; the switch toggles the region.
- **3.2** Dashboard (`src/pages/Dashboard.tsx`, `src/components/RiskMap.tsx`, `KpiCards.tsx`, `OfficialDataCard.tsx`, `SamplingPriorityList.tsx`) per Section 8 item 1. The official data card reads `lakeMeadOfficial` from `src/data/citations.ts`. Done: in the browser, Callville Bay shows a red marker; the "Sampling priority list" heading shows; the list ranks 79/73/70/62/43/23 as ranks 1–6; Callville Bay carries "Recommended first sampling target"; Areas Requiring Attention shows 4; the official data card shows 1,037.93 ft with its source line, access date and link; switching to Coimbra re-centres the map and hides the official data card.

### Phase 4: Site detail [15:45–16:30]

- **4.1** Site detail (`src/pages/SiteDetail.tsx`, `src/components/RiskMeter.tsx`, `ContributionBars.tsx`, `TrendChart.tsx`, `OneHealthPanel.tsx`) per Section 8 item 2. Done: `/site/callville-bay` shows 79 Very High and Increasing, contribution bars led by chlorophyll, the 7-point chart, the One Health panel, the disclaimer, and "Recommended first sampling target" under "Verdant recommendation" next to "Official advisory: none issued".

### Phase 5: Report form [16:30–17:00]

- **5.1** Protocol fields.
  - Actor: the orchestrator. It tries one fetch of the Zenodo PDF (zenodo.org record 20344421) for the citizen form fields.
  - When the fields are retrieved, the form options are replaced with them and the source is cited in a code comment. Else the user's options stay.
  - Done: the A4 entry is updated with the outcome.
- **5.2** Report page (`src/pages/Report.tsx`) per Section 8 item 3. Done: submitting a Callville Bay report changes its score from 79 to 81 on the dashboard, and the success state shows.

### Phase 6: OAH-cities page [17:00–17:45]

- **6.1** OAH-cities page (`src/pages/OahCities.tsx`) per Section 8 item 4. Done: "Run Verdant on Coimbra" switches the region, the dashboard shows the Coimbra sites with their label, and all five city cards render.

### Phase 7: Methodology [17:45–18:15]

- **7.1** Methodology page (`src/pages/Methodology.tsx`, `src/components/ArchitectureDiagram.tsx`) per Section 8 item 5. Done: the page renders the equations, the NDCI note, the SVG diagram, the limitations sentence "All Verdant scores are unvalidated.", the future-work list led by the field-sample validation item, and the "Data sources and citations" table with every Section 19.2 row and a working link per row.
- Schedule note: the citations table and the official data card reuse data written in Task 2.2 and add one table and one card. Tasks 2.2, 3.2 and 7.1 keep their time boxes, so no clock time in this section changes and submit stays at 20:45 PDT.

**18:15 PDT: feature freeze.** After 18:15 no new feature starts; only fixes and polish.

### Phase 8: Polish [18:15–18:45]

- **8.1** `impeccable` pass on all pages. It fixes spacing, typography, marker colors and the mobile layout at 375 px, removes unfinished UI, and checks that every prototype label and disclaimer is visible. Done: every page has been checked at 1440 px and 375 px, with no horizontal scroll and no console errors.
- **8.2 Team:** create the public GitHub repo and push. Deploy to Vercel. Done: the public URL loads `/site/callville-bay` directly.

### Phase 9: README and export [18:45–19:00]

- **9.1** README (`README.md`) per Section 15, with `no-ai-slop` run on it. The README's "Data sources and citations" section is the Section 19.2 table, copied row for row. Done: the README renders on GitHub with the screenshots, and its citations table has the same rows as `src/data/citations.ts`.
- **9.2** FHIR export (`src/fhir/constants.ts`, `bundle.ts`, `bundle.test.ts`, plus the export button). This runs in parallel with 9.1 because the two tasks share no files. Done: `npx vitest run src/fhir` passes, and the button downloads a valid JSON file.

### Phase 10: Devpost [18:45–19:15]

- **10.1** Devpost text (`docs/devpost.md`) from Section 14 with the final URLs, with `no-ai-slop` run on it. Done: every Devpost field has text, and every number or external claim in it has a Section 19.2 row (Section 2 rule 7).

### Phase 11: Demo video [19:15–20:05]

- **11.1 Team:** record the Section 13 script against the deployed URL. Edit to 4:30 or less. Upload as an unlisted YouTube video. Done: the video plays and runs between 3:00 and 5:00.

### Phase 12: QA [20:05–20:30]

- **12.1** QA.
  - Actor: a light-tier agent (`model: "haiku"`).
  - Action: run `npm run build` and `npx vitest run`. Then check on the deployed URL: every navigation link, every marker popup, mobile layout, console errors, the score math against Section 6.1, every data label, the disclaimer, the official data card values against Section 19.3, and every citation link on the Methodology page (each returns a page, not an error).
  - Done: a report with zero failures. Else the orchestrator dispatches fixes until 20:30, then ships what passes.

### Phase 13: Submit [20:30–20:45]

- **13.1 Team:** complete the Section 16 checklist and submit. Done: a screenshot of the Devpost confirmation, taken by 20:45 PDT.

## 13. Demo video script (4:30)

Speakers are A (Frontend/Map), B (Data/Risk Model) and C (Product/Citizen Science).

| Time | Speaker | Screen | Script |
|---|---|---|---|
| 0:00–0:25 | C | Title card with the statistic and the on-screen source line "Source: CDC, MMWR 69(50), Dec 18, 2020" (Section 19.2 row C1), then a Lake Mead photo, then Dashboard | Spoken, exactly: "Across the United States, 18 states reported 421 harmful algal bloom events, 389 cases of human illness and 413 cases of animal illness from 2016 to 2018." Then: "At Lake Mead, the National Park Service warns that bloom toxins can make people sick and can kill dogs. Monitoring cannot continuously cover every part of the lake." |
| 0:25–0:45 | C | Dashboard | Verdant, Track 6 Resilience Informatics: an explainable early warning that combines satellite, environmental and citizen signals. |
| 0:45–1:30 | A | Risk map, popups, Sampling priority list, official elevation card | The map, the categories, Areas Requiring Attention, the Sampling priority list with Callville Bay as the recommended first sampling target, the official Reclamation elevation card beside the labelled prototype values, and Boulder Basin led by heat and low water, which shows the multi-hazard view. |
| 1:30–2:15 | B | `/site/callville-bay` | 79, Very High, Increasing. Why is risk elevated: the contribution bars. The Verdant recommendation "Recommend field sampling" and "Recommended first sampling target", next to "Official advisory: none issued". The disclaimer. |
| 2:15–2:45 | C | `/report` | Submit a report; Callville rises to 81 live. Spoken, exactly: "Citizen reports add coverage between agency samples." The confirmation warning text. |
| 2:45–3:05 | B | One Health panel | Environment, human health and animal health; visitor guidance. |
| 3:05–3:40 | A | `/oah-cities` → Run on Coimbra → Dashboard | Lake Mead is the pilot. The same engine runs on a OneAquaHealth city through one site config and a Resilience Map export. Benevento, Ghent, Oslo and Toulouse are configured next. |
| 3:40–3:50 | A | The "Export FHIR JSON" button on the site detail page of the Coimbra rank-1 site, clicked once; the download bar shows `verdant-coimbra-fhir.json` | Spoken, exactly (this is the only FHIR mention in the video, 10 seconds or less): "One click exports every score and citizen report as FHIR-shaped JSON for the OneAquaHealth implementation guide." |
| 3:50–4:15 | B | `/methodology` diagram | Architecture, Sentinel-2 NDCI as a proxy rather than toxin detection, and the scale path. |
| 4:15–4:30 | C | Dashboard | "Verdant does not replace environmental experts. It helps them know where to look first." |

## 14. Devpost description (draft; task 10.1 finalizes it)

- **Track alignment:** Track 6, Resilience Informatics. Verdant turns scattered environmental and citizen signals into early warning and monitoring priorities for freshwater sites.
- **Inspiration / What it does / How we built it / Challenges / Accomplishments / What we learned / What's next:** these are written in task 10.1 from Sections 1, 7, 8 and 9.
- **Impact & Alignment.** Verdant links freshwater conditions to human and animal health. Every score names its hazard pathway, its evidence and a next step for rangers, water agencies, researchers, residents and visitors. Lake Mead is the pilot; the same engine runs on OneAquaHealth's Coimbra data and is configured for Benevento, Ghent, Oslo and Toulouse.
- **Innovation & Creativity.** A citizen report changes the risk score on screen. Every score breaks down into factor contributions. One configuration switch moves Verdant from a US reservoir to a European urban stream network.
- **Technical Implementation.** A tested TypeScript risk engine with fixed, published weights and partial-data coverage. A Resilience Map CSV parser. FHIR-shaped JSON export aligned to the OneAquaHealth FHIR IG profiles. React, TypeScript, Leaflet and Recharts.
- **Usability & User Experience.** Four pages, one path from map to explanation to action. Disclaimers sit next to every score, and the layout works on a phone in the field.
- **Feasibility & Scalability.** Adding a city takes a CSV export, a column map and a site config. There is no backend to run. All scores are unvalidated today; the first future-work step is comparing them with in-situ field-sample results. Further future work: live Sentinel-2 and weather feeds, validated local models, agency integration, FHIR server submission.
- **Citations.** The Devpost text ends with a link to the Methodology page's "Data sources and citations" table, and every number in the Devpost text has a Section 19.2 row.

## 15. README outline

1. Verdant: tagline, deployed link, video link, screenshot.
2. Problem and solution.
3. Track 6 alignment.
4. Risk model: pathways, weights, equation, categories, coverage.
5. Data: Lake Mead prototype data, Coimbra Resilience Map export or synthetic fallback, labels.
6. Methodology: How Verdant Works, NDCI note.
7. Architecture: the diagram.
8. FHIR export: profiles used, the verified `OAH_IG_BASE` canonical, and the unverified profile-id note (A5).
9. Tech stack, plus run instructions (`npm install`, `npm run dev`, `npx vitest run`).
10. Limitations: the Section 8 item 5 sentence "All Verdant scores are unvalidated." with its follow-on sentence.
11. Future work, led by validation against in-situ field-sample results.
12. Disclaimer.
13. Data sources and citations: the Section 19.2 table.

## 16. Final-submission checklist

1. Track 6 is selected.
2. The track alignment statement is filled.
3. The description covers problem, solution, users and impact.
4. The video runs 3–5 minutes and its link plays.
5. The public GitHub link opens without login.
6. The live demo link loads.
7. The technologies are listed.
8. Screenshots are uploaded.
9. All team members are on the submission.
10. Submit is clicked and the confirmation screenshot is saved by 20:45 PDT.

## 17. Cut list (in order; each cut fires on its trigger)

1. FHIR export button (Task 9.2). Trigger: 18:45 PDT and Phase 8 not done. The Methodology page then describes the export as future work, and video segment 3:40–3:50 shows the Methodology future-work item "FHIR server submission" with the spoken sentence "FHIR export to the OneAquaHealth implementation guide is next on our roadmap."
2. Photo preview on the report form. Trigger: Task 5.2 not done at 17:00 PDT.
3. Contribution bars become a plain sorted list. Trigger: Task 4.1 not done at 16:30 PDT.
4. Coimbra switch becomes a static screenshot card on `/oah-cities`. Trigger: Task 2.4 or 6.1 not done at 17:45 PDT. Video segment 3:05–3:40 then narrates over the card.
5. Architecture SVG becomes a bulleted flow list. Trigger: Task 7.1 not done at 18:15 PDT.
6. Trend chart becomes a trend label only. Trigger: Recharts fails to render at 16:15 PDT.
7. Deployment is replaced by recording the video on `npm run dev` and submitting the repo link. Trigger: the Vercel deploy fails at 19:00 PDT.

The never-cut list: the map, the risk engine and its tests, the site detail page, the disclaimer, the OAH-cities page, the video, and the submission.

## 18. Core message and final pitch

- **Problem:** monitoring cannot continuously cover every part of a lake or an urban stream network.
- **Solution:** combine satellite, environmental and citizen observations into an explainable, multi-hazard risk score.
- **Impact:** experts see where follow-up monitoring is needed first.
- **One Health:** protects aquatic ecosystems, recreational users, pets, wildlife and downstream communities.
- **Responsible AI:** supports human decisions and never diagnoses or confirms toxic blooms.
- **Scale:** Lake Mead is the pilot; OneAquaHealth cities run on the same engine through one site config.

**Final pitch:** "Verdant transforms scattered environmental signals into actionable early warning. By combining satellite observations, environmental conditions, and citizen science, Verdant helps identify where harmful algal bloom risk may be increasing across Lake Mead, and the same engine already runs on OneAquaHealth's urban streams, so experts know where to look first."

## 19. Data sources and citations

### 19.1 Rules

1. **One table, three renderings.** The Section 19.2 table is the single source. Task 2.2 writes it to `src/data/citations.ts`; Task 7.1 renders it on the Methodology page under the heading "Data sources and citations"; Task 9.1 copies it into the README under the same heading. Done-check: the three have identical rows.
2. **Columns, in this order:** item | value or claim | source | publisher | URL | accessed date.
3. **Coverage.** Every cited number and every claim taken from an external source, used anywhere in the site, the video, the README or the Devpost text, has a row. Actor: the session writing that text. Trigger: the text cites an external number or claim. Action: add the row to `src/data/citations.ts` and to this table in the same change. Done-check: Task 12.1 QA finds no external number or claim without a row.
4. **Quoting.** A row quotes at most 15 words of its source and paraphrases the rest. Numbers are copied exactly, never rounded or extrapolated.
5. **Prototype values are not citations.** The Section 6.1 factor scores are Verdant's own prototype values. They keep the "Prototype demonstration data" label and get no row.

### 19.2 Citations table

| item | value or claim | source | publisher | URL | accessed date |
|---|---|---|---|---|---|
| C1 Opening statistic (video 0:00–0:25) | Across the United States, 18 states reported 421 harmful algal bloom events, 389 cases of human illness and 413 cases of animal illness during 2016–2018 (national figure; no Lake Mead-specific count was found) | Roberts et al., "Surveillance for Harmful Algal Bloom Events and Associated Human and Animal Illnesses — One Health Harmful Algal Bloom System, United States, 2016–2018", MMWR 69(50), published 2020-12-18 | U.S. Centers for Disease Control and Prevention | https://www.cdc.gov/mmwr/volumes/69/wr/mm6950a2.htm | 2026-10-04 |
| C2 Lake Mead bloom risk (video 0:00–0:25, One Health panel) | Harmful blue-green algae blooms occur at Lake Mead NRA; exposure symptoms include nausea, vomiting and breathing problems; dogs and other animals can become seriously ill or die from HAB toxins; blooms are most common from August through December | "Harmful Blue-Green Algae Blooms (HABs) - Lake Mead National Recreation Area", page last updated 2026-05-14 | U.S. National Park Service | https://www.nps.gov/lake/planyourvisit/harmful-blue-green-algae-blooms-habs.htm | 2026-10-04 |
| C3 Official Lake Mead data element (dashboard card) | Lake Mead elevation 1,037.93 ft on 2026-10-03 (daily operations report) | "Lower Colorado River Operations" | U.S. Bureau of Reclamation, Lower Colorado Region | https://www.usbr.gov/lc/region/g4000/hourly/levels.html | 2026-10-04 |
| C4 NDCI reference (Methodology NDCI note) | NDCI is a normalized difference of red-edge and red reflectance for estimating chlorophyll-a in turbid productive waters | Mishra, S. and Mishra, D. R., "Normalized difference chlorophyll index: A novel model for remote estimation of chlorophyll-a concentration in turbid productive waters", Remote Sensing of Environment 117: 394–406 (2012) | Elsevier | https://doi.org/10.1016/j.rse.2011.10.016 | 2026-10-04 |
| C5 Sentinel-2 bands (Methodology NDCI note) | Sentinel-2 MSI band B4 (red, central wavelength 664.6 nm on Sentinel-2A, 10 m) and band B5 (vegetation red edge, 704.1 nm on Sentinel-2A, 20 m) | "S2 Mission", SentiWiki | European Space Agency / Copernicus | https://sentiwiki.copernicus.eu/web/s2-mission | 2026-10-04 |
| C6 OAH FHIR IG (FHIR export, A5) | IG "OneAquaHealth Project", id `hl7.eu.fhir.oah`, canonical `http://hl7.eu/fhir/ig/oah`, version 0.1.0-ci-build | `sushi-config.yaml` in the `hl7-eu/oah` repository | HL7 Europe / OneAquaHealth Project | https://github.com/hl7-eu/oah | 2026-10-04 |
| C7 OAH Resilience Map (Coimbra data, OAH-cities page) | Source of the Coimbra CSV export (A3) | "Resilience Map" web application | OneAquaHealth Project (served from the oneaquahealth.eu domain; the page names no publisher) | https://apps.oneaquahealth.eu/resmap/ | 2026-10-04 |
| C8 OAH citizen-science / field protocol (report form, A4) | Harmonized OneAquaHealth procedures for sampling-site characterization and ecosystem-health and biological indicators | Calapez, A. R. et al., "OneAquaHealth Field Sampling Protocols for Urban Stream Ecosystems", 2026-05-22, DOI 10.5281/zenodo.20344421 | Zenodo (OneAquaHealth, Horizon Europe) | https://zenodo.org/records/20344421 | 2026-10-04 |
| C9 Coimbra Earth-observation summary (satellite signal chart) | Monthly NDVI and NDWI area means for Coimbra, 2020-01 to 2026-09 | Resilience Map, Earth-observation area summary export (file eo_summary_area_Coimbra_1969-01-01_to_2026-10-03.csv) | OneAquaHealth Project (served from the oneaquahealth.eu domain) | https://apps.oneaquahealth.eu/resmap/ | 2026-10-04 |

### 19.3 Official Lake Mead data element

- **Value:** Lake Mead elevation 1,037.93 ft, for 2026-10-03 (row C3). The value is a fixed snapshot; the app does not fetch it live.
- **Built by:** Task 2.2 writes it to `lakeMeadOfficial` in `src/data/citations.ts`; Task 3.2 renders it as the "Official data" card on the Dashboard (Section 8 item 1), shown only when the region is `lake-mead`.
- **Shown with:** the source line "Source: U.S. Bureau of Reclamation, Lower Colorado River Operations. Accessed 2026-10-04." and a link to the C3 URL.
- **Done-check:** Task 3.2 browser check and Task 12.1 QA confirm the card text matches this subsection.
