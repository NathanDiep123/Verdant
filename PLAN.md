# Verdant: Spec and Implementation Plan

OneAquaHealth IEEE Global Hackathon 2026, Track 6: Resilience Informatics ("Enable early warning & resilience planning").
Deadline: **2026-10-04 21:00 PDT**. Internal submission target: **20:45 PDT**. Feature freeze: **18:15 PDT**.

> **For agentic workers:** this plan executes through `superpowers:subagent-driven-development`. Every implementation task goes to an execution-tier agent (`model: "sonnet"`). Tasks marked **Team** are done by the human team, because they need accounts, a camera, or a microphone.

---

## 1. Goal and pitch

**Goal:** a deployed web prototype and a 3–5 minute demo video. Together they show an explainable, multi-hazard early-warning tool for freshwater One Health risk. Lake Mead is the pilot site. The same engine then runs on a OneAquaHealth (OAH) city through a single site configuration.

**Central goal, citizen science (user, 2026-10-04):** people at the shore are one of Verdant's sensors. A citizen report is visible everywhere a score is visible: in the header, on the dashboard, on the map, in the Sampling priority list, on the site page and in the score itself. Section 20 specifies how; the video and the Devpost text give it the longest single segment and paragraph.

**Central problem, report feedback loop (user, 2026-10-04):** rangers depend on citizen reports of algae blooms, and those reports are often hard to act on. Verdant makes reporting easy (a guided three-step flow with a picture guide of blooms and look-alikes), triages every report through a ranger review instead of trusting it blindly, and shows each reporter what happened to their report, including "You got it right." Section 21 specifies how. No statistic on report reliability is claimed.

**Tagline:** "See the bloom before it becomes a warning."

**One-sentence pitch:** "Verdant is an explainable early-warning platform that makes it easy for people at the shore to report what they see, has rangers triage every report and tells reporters what their report led to, and combines those reviewed observations with satellite imagery and environmental conditions to identify emerging harmful algal bloom risk and prioritize monitoring across Lake Mead, and it runs on any OneAquaHealth city through one site configuration."

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
| **Impact & Alignment** (30%) | Sampling priority list with a recommended first sampling target; cited opening statistic (Section 19); One Health panel (environment, human, animal) on the site detail page; multi-hazard pathways; citizen report form built on the OneAquaHealth citizen-science stream questions; "Community reports" feed, report pins on the map and "Community observations" on the site page (Section 20); manager action recommendations; the "Verdant for OneAquaHealth cities" page; the report feedback loop that answers the rangers' problem of hard-to-act-on citizen reports (Section 21: ranger Report queue with reporter track records, reviewed outcomes on "My reports"); video segment 6; Devpost paragraphs 1 and "Citizen science" |
| **Innovation & Creativity** (20%) | Before/after score moment when a citizen report is submitted (79 counting to 81, Section 20 Task 20.7); the site page stating how many points citizen evidence adds; review-weighted citizen evidence (new report 10, confirmed 20, not a bloom 0; Section 21.3) and the "You got it right." outcome shown to the reporter; per-factor contribution bars ("Why is risk elevated?"); one-switch region swap from Lake Mead to Coimbra; Devpost paragraph 2 |
| **Technical Implementation** (20%) | Tested TypeScript risk engine (`src/engine/`); site-agnostic `SiteConfig`; Resilience Map CSV parser; FHIR-shaped JSON export; public GitHub repo with README; Devpost paragraph 3 |
| **Usability & User Experience** (15%) | "Report what you see" call to action in the header on every page (Section 20); three-step guided report flow with large tappable choices, photo first and the "Is it a bloom?" picture guide, plus a status timeline per report (Section 21); four-page app with one clear navigation path; colour-coded map; risk meter; plain-language explanations; disclaimers placed next to every score; mobile layout; Devpost paragraph 4 |
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
9. Citizen science prominence per Section 20: header call to action, "Community reports" feed and KPI, report pins on the map, report-count badges in the Sampling priority list, "Community observations" on the site page, before/after score moment on the report page. Reports live in React state only; a page reload drops submitted reports, by design. (Superseded by Section 21.8: reports and outcomes persist in `localStorage` until "Reset demo data".)
10. Report feedback loop per Section 21: guided three-step report flow, report status lifecycle, "My reports" page, ranger "Report queue" demonstration page, review-weighted citizen evidence.

**Out of scope (closed list):** live satellite ingestion; live weather APIs; authentication; database or backend; photo storage; real-time notifications; machine-learning models; a FHIR server; a separate agency dashboard (the Section 21 Report queue is one demonstration page in the same app); a before/after imagery slider.

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
- Header citizen-science call to action: Section 20, Task 20.2.
- Section 21 adds "My reports" (`/my-reports`) and "Report queue" (`/rangers`) to the nav, which becomes Dashboard · Report a Bloom · My reports · Report queue · OAH Cities · Methodology (Task 21.5), and replaces the report form with a three-step flow (Task 21.3).

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
   - Citizen science additions (subtitle, "Citizen reports" KPI first, "Community reports" feed, report pins, report badges): Section 20, Tasks 20.3, 20.4, 20.5.
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
   - "Community observations" section: Section 20, Task 20.6.
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
   - Intro copy, OAH source line, `?site=` preselect and the before/after score moment: Section 20, Task 20.7.
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
- Shell: header 60px, `bg-card`, bottom hairline; wordmark "Verdant" Sans 700 20px left; nav (Dashboard, Report a Bloom, OAH Cities, Methodology) Sans 500 14px, active link = ink with 2px accent underline; region switch right, as a 2-segment control (Lake Mead | Coimbra), active segment `bg-primary text-primary-foreground`. Below 768px: nav moves into a shadcn `Sheet` opened by a `Menu` icon button; region switch stays visible. (Section 21, Task 21.5: with six nav items the inline nav shows at 1280px and wider, the `Sheet` below 1280px.) Content container `max-w-[1360px] mx-auto px-6` (px-4 below 768px). Footer: disclaimer (§8.2) in 14px muted ink above a hairline.
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
| 0:25–0:40 | C | Dashboard, cursor resting on the header button "Report what you see" | Verdant, Track 6 Resilience Informatics. Spoken, exactly: "Rangers depend on people at the shore to report blooms. But a report can be hard to act on: the wrong spot, no photo, or duckweed that looks like algae. Verdant makes reporting easy, has rangers triage every report, and tells the reporter what happened." |
| 0:40–1:05 | A | Risk map with the community report pins visible, popups, Sampling priority list, official elevation card | The map, the categories, the square community report pins next to the site markers, the Sampling priority list with Callville Bay as the recommended first sampling target and its 3 reports, the official Reclamation elevation card beside the labelled prototype values, and Boulder Basin led by heat and low water. |
| 1:05–1:30 | B | `/site/callville-bay` | 79, Very High, Increasing. Why is risk elevated: the contribution bars. The Verdant recommendation "Recommend field sampling" next to "Official advisory: none issued". The disclaimer. |
| 1:30–2:55 | C | Report feedback loop (Section 21), in this order: (1) `/site/callville-bay` "Community observations" showing "Citizen evidence: 64/100, adds 9.6 points to the Algal bloom score.", click "Add an observation at Callville Bay", 5 s; (2) `/report` Step 1 "Where are you?" with Callville Bay selected, Next; Step 2 "What do you see?": "Add a photo", the "Is it a bloom?" guide, tap "Looks like a bloom" and "lots", Next; Step 3 "Check and send": the warning, "Submit report", 20 s; (3) success: 79 struck through, 81 counting up, "Report VR-xxxx", "Your report is in the ranger queue.", 10 s; (4) "Report queue" in the nav: the new report on top with "You (demo reporter). Record: 2 of 3 reviewed reports matched the field result." and the demonstration label; click "Request field sample", then "Confirmed by field sample", 20 s; (5) "My reports": the new report's timeline Received, Field sample requested, Confirmed by field sample, "You got it right.", "Your report helped prioritize Callville Bay for sampling.", record now 3 of 4; scroll to "Close, but not a bloom this time." on the Las Vegas Bay report, 20 s; (6) Dashboard: Callville Bay at 82 in the Sampling priority list, the new report on top of the feed, 10 s | Spoken, exactly: "Reporting takes three steps and a photo. The guide shows what a bloom looks like, and what only looks like one." Then: "Every report goes to a ranger queue with the reporter's track record. A new report adds 10 points of citizen evidence, a confirmed one adds 20, and a report ruled not a bloom adds nothing." Then: "And the reporter sees what their report led to: you got it right." Then read the warning on screen: "A citizen report does not confirm a harmful algal bloom. Laboratory or agency testing is required for confirmation." |
| 2:55–3:05 | B | One Health panel | Environment, human health and animal health; visitor guidance. |
| 3:05–3:35 | A | `/oah-cities` → Run on Coimbra → Dashboard | Lake Mead is the pilot. The same engine runs on a OneAquaHealth city through one site config and a Resilience Map export. Benevento, Ghent, Oslo and Toulouse are configured next. |
| 3:35–3:45 | A | The "Export FHIR JSON" button on the site detail page of the Coimbra rank-1 site, clicked once; the download bar shows `verdant-coimbra-fhir.json` | Spoken, exactly (this is the only FHIR mention in the video, 10 seconds or less): "One click exports every score and citizen report as FHIR-shaped JSON for the OneAquaHealth implementation guide." |
| 3:45–4:05 | B | `/methodology` diagram and the citizen-evidence weighting paragraph (Task 21.7) | Architecture, Sentinel-2 NDCI as a proxy rather than toxin detection, review-weighted citizen evidence, and the scale path. |
| 4:05–4:30 | C | "My reports", "You got it right." in view | Spoken, exactly: "Anyone at the shore can add to this map, and every reporter sees what their report led to. Verdant does not replace environmental experts. It helps them know where to look first." |

Recording note for 1:30–2:55: before the take, click "Reset demo data" on `/my-reports` and reload, so the feed, the pins, the queue and the score start from the seed state (Callville Bay 79, 3 reports, 7 reports in total, record 2 of 3). Record steps (1) to (6) in one take. The Section 21.7 cuts name the fallback for each step.

## 14. Devpost description (draft; task 10.1 finalizes it)

- **Track alignment:** Track 6, Resilience Informatics. Verdant turns scattered environmental and citizen signals into early warning and monitoring priorities for freshwater sites.
- **Inspiration / What it does / How we built it / Challenges / Accomplishments / What we learned / What's next:** these are written in task 10.1 from Sections 1, 7, 8 and 9.
- **Impact & Alignment.** Verdant links freshwater conditions to human and animal health. Every score names its hazard pathway, its evidence and a next step for rangers, water agencies, researchers, residents and visitors. Lake Mead is the pilot; the same engine runs on OneAquaHealth's Coimbra data and is configured for Benevento, Ghent, Oslo and Toulouse.
- **Citizen science and the report feedback loop.** Rangers depend on people at the shore to report blooms, and those reports are often hard to act on: the wrong spot, no photo, or a look-alike such as duckweed. Verdant attacks that from both ends. Reporting is three steps: pick the site (or use your location), add a photo and compare it with an "Is it a bloom?" guide of blooms and look-alikes, then send. The questions come from the OneAquaHealth citizen-science stream survey. Every report goes to a ranger Report queue that shows the reporter's track record, and its weight in the score follows the review: a new report adds 10 points of citizen evidence (Callville Bay: 79 to 81), a report confirmed by field sample adds 20 (82), and a report ruled not a bloom adds nothing (back to 79). The reporter follows the report on "My reports" from Received to the outcome and sees "You got it right." or what the ranger found instead. Ranger outcomes in the prototype are demonstration data and say so on screen. A report never confirms a bloom by itself: the form says so above the submit button, and only a field sample can.
- **Innovation & Creativity.** A citizen report changes the risk score on screen, and the site page states how many points citizen evidence adds. Every score breaks down into factor contributions. One configuration switch moves Verdant from a US reservoir to a European urban stream network.
- **Technical Implementation.** A tested TypeScript risk engine with fixed, published weights and partial-data coverage. A Resilience Map CSV parser. FHIR-shaped JSON export aligned to the OneAquaHealth FHIR IG profiles. React, TypeScript, Leaflet and Recharts.
- **Usability & User Experience.** Four pages, one path from map to explanation to action. Disclaimers sit next to every score, and the layout works on a phone in the field.
- **Feasibility & Scalability.** Adding a city takes a CSV export, a column map and a site config. There is no backend to run. All scores are unvalidated today; the first future-work step is comparing them with in-situ field-sample results. Further future work: live Sentinel-2 and weather feeds, validated local models, agency integration, FHIR server submission.
- **Citations.** The Devpost text ends with a link to the Methodology page's "Data sources and citations" table, and every number in the Devpost text has a Section 19.2 row.

## 15. README outline

1. Verdant: tagline, deployed link, video link, screenshot.
2. Problem and solution, led by the Section 1 central problem (rangers depend on hard-to-act-on citizen reports) and the Section 21 report feedback loop: guided reporting, ranger triage, review-weighted evidence (10 / 20 / 0), "My reports" outcomes, demonstration-data note.
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

1. FHIR export button (Task 9.2). Trigger: 18:45 PDT and Phase 8 not done. The Methodology page then describes the export as future work, and video segment 3:35–3:45 shows the Methodology future-work item "FHIR server submission" with the spoken sentence "FHIR export to the OneAquaHealth implementation guide is next on our roadmap."
2. Photo preview on the report form. Trigger: Task 5.2 not done at 17:00 PDT.
3. Contribution bars become a plain sorted list. Trigger: Task 4.1 not done at 16:30 PDT.
4. Coimbra switch becomes a static screenshot card on `/oah-cities`. Trigger: Task 2.4 or 6.1 not done at 17:45 PDT. Video segment 3:05–3:40 then narrates over the card.
5. Architecture SVG becomes a bulleted flow list. Trigger: Task 7.1 not done at 18:15 PDT.
6. Trend chart becomes a trend label only. Trigger: Recharts fails to render at 16:15 PDT.
7. Deployment is replaced by recording the video on `npm run dev` and submitting the repo link. Trigger: the Vercel deploy fails at 19:00 PDT.

Section 20 cuts: Section 20.4. Section 21 cuts, with clock triggers: Section 21.7.

The never-cut list: the map, the risk engine and its tests, the Section 21.7 never-cut items, the site detail page, the disclaimer, the OAH-cities page, the video, and the submission.

## 18. Core message and final pitch

- **Problem:** monitoring cannot continuously cover every part of a lake or an urban stream network, so rangers depend on citizen reports, and those reports are often hard to act on.
- **Solution:** make reporting easy, have rangers triage every report, and combine the reviewed citizen observations with satellite and environmental data into an explainable, multi-hazard risk score.
- **Citizen science:** people at the shore are sensors between agency samples; every report is visible on the map, in the feed and on the site page, its weight follows the ranger's review (new 10, confirmed 20, not a bloom 0), and the reporter sees the outcome on "My reports": "You got it right."
- **Impact:** experts see where follow-up monitoring is needed first.
- **One Health:** protects aquatic ecosystems, recreational users, pets, wildlife and downstream communities.
- **Responsible AI:** supports human decisions and never diagnoses or confirms toxic blooms.
- **Scale:** Lake Mead is the pilot; OneAquaHealth cities run on the same engine through one site config.

**Final pitch:** "Verdant transforms scattered environmental signals into actionable early warning. It makes reporting a bloom easy, has rangers triage every report, and shows each reporter what their report led to. By combining those reviewed reports from people at the shore with satellite observations and environmental conditions, Verdant helps identify where harmful algal bloom risk may be increasing across Lake Mead, and the same engine already runs on OneAquaHealth's urban streams, so experts know where to look first."

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
| C10 Citizen-science stream questions (report form, Task 20.7) | Seven citizen-science questions (foam, riparian vegetation, filamentous algae, hydrology, diptera, ticks, wildlife) as used in a OneAquaHealth citizen-science form; reproduced in a public hackathon repository and not verified against the official OAH app | `codes.js` in the AquaLink repository | GitHub user Sravya1802 (public repository) | https://github.com/Sravya1802/aqualink | 2026-10-04 |
| C11 Bloom vs look-alike guide (report form "Is it a bloom?", Task 21.3; video 0:25–0:40) | Cyanobacteria blooms can look like blue or green paint spilled into the water, a coloured crust along the shoreline, puffy surface scums, or swirls beneath the surface; duckweed, long strands of green algae and filamentous macro-algae are sometimes confused with them | "Identifying Cyanobacteria Blooms" | Illinois Environmental Protection Agency | https://epa.illinois.gov/topics/water-quality/monitoring/algal-bloom/identifying.html | 2026-10-04 |

### 19.3 Official Lake Mead data element

- **Value:** Lake Mead elevation 1,037.93 ft, for 2026-10-03 (row C3). The value is a fixed snapshot; the app does not fetch it live.
- **Built by:** Task 2.2 writes it to `lakeMeadOfficial` in `src/data/citations.ts`; Task 3.2 renders it as the "Official data" card on the Dashboard (Section 8 item 1), shown only when the region is `lake-mead`.
- **Shown with:** the source line "Source: U.S. Bureau of Reclamation, Lower Colorado River Operations. Accessed 2026-10-04." and a link to the C3 URL.
- **Done-check:** Task 3.2 browser check and Task 12.1 QA confirm the card text matches this subsection.

## 20. Citizen science prominence

**Why:** the user, 2026-10-04: "make the citizen science part of it a lot more apparent - thats one of the central goals". A judge who watches the video or opens the site sees, without scrolling past the first screen, that people at the shore feed the score.

### 20.1 Rules for this section

1. Every task here is executed by an execution-tier agent (`model: "sonnet"`). TDD applies only to Task 20.1. Every other task is visual and is verified with `npm run dev` in the browser at 1440 px and 375 px.
2. Every agent follows Section 11 (design direction) and names `impeccable`, applies the `ponytail` ladder, reads graphify-first (AGENTS.md point 8; when no graph exists the agent says so and reads the named files directly), and runs `no-ai-slop` on any user-facing text it writes beyond the exact strings below. Exact strings in this section are copied verbatim and are never reworded.
3. No backend, no storage, no new dependency. Reports stay in `RegionContext` state (`reports`, `addReport`); a reload resets to the 7 seed reports. `src/state/RegionContext.tsx`, `src/engine/` and `src/data/` are not edited by any Section 20 task, except Task 20.8's one citation row and its count assertion.
4. Existing exact strings stay unchanged: the nav label "Report a Bloom"; the KPI title "Citizen reports"; the priority-list column "Reports"; the heading "Sampling priority list"; the warning "A citizen report does not confirm a harmful algal bloom. Laboratory or agency testing is required for confirmation."; the success sentence "Report received. Your observation has been added to the community monitoring layer."; the link "View updated site"; the note heading "Why citizen observations matter"; every Section 8.2 and 8.3 string.
5. Citizen-report visuals use the accent `--primary` (`#174C6B`) and the square shape: a report pin is a 12px square with 2px radius, `--primary` fill, 2px `#FBFCFB` border. It never uses a risk colour and is never round, so it is never confused with a site marker (Section 11.4: only site markers are round).
6. Data tags shown on every report item and pin, in the Section 11.4 data-label style (Mono 12px, dashed border): `synthetic-demo` renders as "Demo report"; `user-submitted` renders as "Submitted in this session".
7. Coimbra has no seed reports. Every Section 20 surface shows its empty-state string on Coimbra and works once a report is submitted there.
8. Start condition: the orchestrator dispatches Task 20.1 as soon as the Coimbra update in `src/` (Section 19.2 / A3 work) has landed, so no two agents edit `src/pages/Dashboard.tsx` or `src/pages/SiteDetail.tsx` at once. Time box for the whole section: 75 minutes, finished before the 18:15 PDT feature freeze; Task 8.1 polish then covers these screens.

### 20.2 Order, parallelism and file ownership

- **Step 1 (sequential, one agent):** Task 20.1.
- **Step 2 (three agents in parallel, after 20.1 is done):** no two agents share a file.

| Agent | Tasks | Owns these files (no other agent edits them) |
|---|---|---|
| Step 1 agent | 20.1 | `src/lib/communityReports.ts` (new), `src/lib/communityReports.test.ts` (new), `src/components/CommunityReportItem.tsx` (new) |
| Agent A | 20.2, 20.3 | `src/components/Layout.tsx`, `src/pages/Dashboard.tsx`, `src/components/KpiCards.tsx`, `src/components/CommunityReportsFeed.tsx` (new) |
| Agent B | 20.4, 20.5 | `src/components/RiskMap.tsx`, `src/components/SamplingPriorityList.tsx` |
| Agent C | 20.6, 20.7 | `src/pages/SiteDetail.tsx`, `src/pages/Report.tsx`, `src/lib/useCountUp.ts` (new) |
| Orchestrator, inline | 20.8 | `src/data/citations.ts`, PLAN.md Section 19.2 (one row) |

Agent B reads reports with `useRegion().reports` inside `RiskMap.tsx`, so `Dashboard.tsx` (Agent A) needs no new prop for the pins.

### 20.3 Tasks

- **20.1 Shared report helpers and item component.** Effort S. TDD applies.
  - Files: `src/lib/communityReports.ts`, `src/lib/communityReports.test.ts`, `src/components/CommunityReportItem.tsx`.
  - Exports from `communityReports.ts`:
    - `newestFirst(reports)`: a new array sorted by `createdAt` descending.
    - `reportSummary(report)`: `observationTypes.join(", ")`, cut to 80 characters with "..." appended when longer; "No details given" when the array is empty.
    - `REPORT_TAG_LABEL`: `{ "synthetic-demo": "Demo report", "user-submitted": "Submitted in this session", "prototype": "Demo report" }`.
    - `formatReportTime(iso)`: `new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Los_Angeles" })`.
    - `citizenEvidence(result)`: from the leading pathway of a `SiteResult`, returns `{ value, points, pathwayId }` for the `citizen_evidence` contribution, `points` rounded to one decimal; returns `null` when the factor is missing.
  - `CommunityReportItem({ report, siteName, showSite })`: one row, hairline bottom border, padding 12px 0. Line 1: site name as a link to `/site/:id` (Sans 600 14px, only when `showSite`), then `formatReportTime` in Mono 12px muted. Line 2: `reportSummary` in 14px ink. Line 3: the tag label (rule 6) and, when `animalsPresent`, the plain text "Animals present" in 12px muted. A lucide `MessageSquare` icon (14px, stroke 1.75, `--primary`) sits left of line 1.
  - Tests: Callville seed report 1 summarizes to "Green surface layer, Unusual odor"; `newestFirst(lakeMeadReports)[0].id` is `report-5` (2026-10-03T11:20Z); a 120-character summary ends with "..." and is 83 characters long; `citizenEvidence(scoreSite(callville))` returns value 64, points 9.6, pathway `algal_bloom`; after `applyCitizenReport` it returns 74 and 11.1.
  - Done: `npx vitest run src/lib` passes and `npm run build` exits 0.

- **20.2 Header call to action.** Effort S. Agent A.
  - File: `src/components/Layout.tsx`.
  - Visible result: at 768 px and wider, a primary button "Report what you see" with a lucide `MessageSquarePlus` icon (16px, stroke 1.75) sits in the header immediately left of the region switch, on every page. It links to `/report`. It is hidden on `/report` itself. Below 768 px the button is not shown (the Sheet nav keeps "Report a Bloom"). The nav labels and order stay exactly as Section 8.
  - Done: the button shows on `/`, `/site/callville-bay`, `/oah-cities`, `/methodology`; clicking it opens `/report`; the header stays on one line at 1440 px and 768 px.

- **20.3 Dashboard: subtitle, KPI order, "Community reports" feed.** Effort M. Agent A.
  - Files: `src/pages/Dashboard.tsx`, `src/components/KpiCards.tsx`, `src/components/CommunityReportsFeed.tsx` (new).
  - Subtitle: directly under the H1, 16px muted ink, max 68ch, exactly: "Scores combine satellite signals, environmental data and reports from people at the shore."
  - KPI strip: the "Citizen reports" cell moves to the first position (before "Region status"). It keeps its title and Mono 28px count, and adds the line "From {n} sites" (n = distinct `siteId` count; "From 1 site" when n is 1) in 14px muted, then a text link "Add a report" in `--primary` with an `ArrowRight` icon, linking to `/report`. The cell gets a 3px left border in `--primary`. The other cells keep their content and order.
  - Feed: a new full-width band below the map and priority-list row (above the Coimbra satellite chart when present), bordered `bg-card`, 12-column grid at 1024 px and up:
    - Left, `col-span-8`: H2 "Community reports" (28px Sans 600), then the line "Observations from people at the shore. Each new report raises that site's citizen evidence by 10 points, capped at 100." (14px muted), then the 5 newest reports (`newestFirst`) as `CommunityReportItem` with `showSite`. A newly submitted report appears on top with the Section 11.7 1200ms `--muted` to transparent background fade. Empty state, exactly: "No community reports for {region name} yet. Reports filed here appear in this list and on the map."
    - Right, `col-span-4`, separated by a vertical hairline: H3 "Between agency samples" (20px Sans 600); the paragraph, exactly: "Agencies sample a few points a few times a month. People at the shore see the water every day. Your report goes straight into the score, and the site page shows how many points it adds."; a primary button "Report what you see" (same icon as 20.2) linking to `/report`; under it, 12px muted, exactly: "Reports never confirm a bloom. They tell experts where to look."
    - At 375 px the two parts stack, the right part second.
  - Done: on Lake Mead the KPI strip starts with "Citizen reports 7", "From 4 sites"; the feed lists 5 reports, newest first, each tagged "Demo report"; after submitting a Callville Bay report and returning to `/`, the count reads 8 and the new report is on top tagged "Submitted in this session"; on Coimbra the feed shows the empty-state string; no horizontal scroll at 375 px.

- **20.4 Map: community report pins and layer toggle.** Effort M. Agent B.
  - File: `src/components/RiskMap.tsx`.
  - Pins: one Leaflet `Marker` per report in `useRegion().reports` whose site is in `rows`, at its site's lat/lon, with a `divIcon` drawn per rule 5. Pins fan out around the site marker at a fixed pixel offset (not a coordinate offset, so they never move onto land differently at each zoom): pin k of n at angle `-90° + k × 360° / max(n, 4)`, radius = site marker diameter ÷ 2 + 10px, set through `iconAnchor`. `zIndexOffset` is above every site marker. `title` = "Community report at {site name}".
  - Pin popup (same popup style as 11.5): "Community report" (14px Sans 600, `--primary`), site name (20px Sans 600), `formatReportTime`, `reportSummary`, the tag label, and the link "View site" to `/site/:id`.
  - Toggle: a shadcn `Switch` with label "Community reports ({count})" in a `bg-card` hairline box at the map's top-left, `z-[1000]`; on by default; off hides the pins.
  - Legend: one row appended to the existing legend: the square pin swatch, then "Community report" (Sans 500), no range.
  - Done: on Lake Mead 7 square accent pins show (3 around Callville Bay, 2 around Las Vegas Bay, 1 each at Overton Arm and Boulder Basin) and none overlaps its site marker's score numeral at the default zoom; the toggle hides and shows them and reads "Community reports (7)"; submitting a Callville Bay report adds a fourth pin there and the toggle reads 8; the site-marker popups are unchanged.

- **20.5 Priority list: report-count badges.** Effort S. Agent B.
  - File: `src/components/SamplingPriorityList.tsx`.
  - The "Reports" cell (desktop table) and the reports line (stacked list) render a lucide `MessageSquare` icon (14px, stroke 1.75) plus the count in Mono 14px. When the count is above 0, icon and count are `--primary` and the cell links to `/site/:id#community`; at 0 they are muted with no link. The column heading stays "Reports".
  - Done: Callville Bay shows 3 in accent, Echo Bay and Temple Basin show 0 muted; after a Callville submission it shows 4.

- **20.6 Site page: "Community observations".** Effort S. Agent C.
  - File: `src/pages/SiteDetail.tsx`.
  - A section with `id="community"` placed directly after the "Why is risk elevated?" and 7-day chart row, before "Pathway scores":
    - H2 "Community observations" (28px Sans 600).
    - The evidence line in the "Verdant recommendation" label style from 11.4 but with the label "Citizen evidence" (12px Sans 600 `--primary`), content 14px, exactly: "Citizen evidence: {value}/100, adds {points} points to the {pathway label} score." (values from `citizenEvidence(result)`; `{points}` in Mono). When `citizenEvidence` returns null: "No citizen evidence in this score yet."
    - The site's reports from `useRegion().reports`, `newestFirst`, as `CommunityReportItem` without `showSite`. Empty state, exactly: "No community reports for this site yet."
    - A primary button "Add an observation at {site name}" with the `MessageSquarePlus` icon, linking to `/report?site={id}`.
  - Done: `/site/callville-bay` shows "Citizen evidence: 64/100, adds 9.6 points to the Algal bloom score." and 3 reports; after one submission it shows 74/100, 11.1 points and 4 reports; `/site/temple-basin` shows the empty-state string; the score numeral and all Section 8.3 labels are unchanged.

- **20.7 Report page: framing, OAH source, preselect, before/after moment.** Effort M. Agent C.
  - Files: `src/pages/Report.tsx`, `src/lib/useCountUp.ts` (new).
  - Intro: the paragraph under the H1 "Report a Bloom" becomes, exactly: "Agencies sample a few points a few times a month. You see the water today. Your report raises this site's citizen evidence and can move it up the Sampling priority list." Under it, the source line in the Section 11.4 data-label style, exactly: "Questions from the OneAquaHealth citizen-science stream survey, via a public copy not yet checked against the official OAH app." (cited by row C10, Task 20.8).
  - Preselect: `?site={id}` from `useSearchParams` sets the initial site when that id exists in the region.
  - Observation text: each answered field is stored as `"{label}: {answers joined by ", "}"` (for example "Filamentous algae: lots"), so the feed and pins read cleanly.
  - `useCountUp(target)`: when `target` changes, the displayed number counts from the previous value to the new one over 600ms ease-out with `requestAnimationFrame` writing to a ref; under `prefers-reduced-motion: reduce` it jumps to the target. The aside score numeral uses it.
  - Success state, in this order: the unchanged success sentence; a before/after block: the label "{site name} risk score" (14px muted), then the old score in Mono 28px muted with a line-through, a lucide `ArrowRight`, and the new score in Mono 72px (48px below 768 px) counting up with `useCountUp`, then the new `RiskBadge`; the line, exactly: "Citizen evidence {before} to {after}. Your report added {delta} points to this score." (`{delta}` = new minus old site score, which is 2 for Callville Bay); the unchanged link "View updated site"; and a second link "See it on the dashboard" to `/`. The warning stays above the submit button.
  - Done: from `/site/callville-bay` → "Add an observation at Callville Bay", the form opens with Callville Bay selected; submitting shows 79 struck through, 81 counting up, "Citizen evidence 64 to 74. Your report added 2 points to this score."; both links work; reduced motion shows 81 at once.

- **20.8 Citation row for the form source.** Effort S. Orchestrator, inline, after the Coimbra agent releases Section 19.2.
  - Files: `src/data/citations.ts` and PLAN.md Section 19.2 (README copies it in Task 9.1).
  - Row C10: item "C10 Citizen-science stream questions (report form, Task 20.7)"; claim "Seven citizen-science questions (foam, riparian vegetation, filamentous algae, hydrology, diptera, ticks, wildlife) as used in a OneAquaHealth citizen-science form; reproduced in a public hackathon repository and not verified against the official OAH app"; source "`codes.js` in the AquaLink repository"; publisher "GitHub user Sravya1802 (public repository)"; URL `https://github.com/Sravya1802/aqualink`; accessed 2026-10-04.
  - Done: `citations.length` is 10 and the `src/data/citations.test.ts` count assertion is updated to 10 in the same change; the Methodology table shows C10.

### 20.4 Cut order (first cut first; trigger: Section 20 not done at 18:00 PDT)

1. 20.5 badges: the "Reports" cell stays a plain number.
2. 20.4 toggle: pins stay, always on; the legend row stays.
3. 20.7 count-up: the success block shows "79" struck through and "81" without animation.
4. 20.4 pins entirely: video 0:40–1:15 drops the pin mention and step (6) drops the fourth pin.
5. 20.3 KPI reorder: "Citizen reports" stays in its old position.

Never cut from this section: 20.1, 20.2, the 20.3 feed and subtitle, 20.6, the 20.7 intro, source line, preselect and before/after numbers, 20.8.

### 20.5 Done-check for the whole section

The orchestrator runs `npm run build` and `npx vitest run`, then walks the Section 13 citizen sequence (1:30–2:55 after the Section 21 amendment; before Section 21 lands, the Section 20 strings only) on `npm run dev` after a reload, and confirms every string in Section 20.3 appears as written, at 1440 px and 375 px, with no console errors.

## 21. Report feedback loop

**Why (user, 2026-10-04, verbatim; this is the central problem statement):** "the issue is that rangers often depend on citizens to report algae blooms that can often be unreliable so we're trying to combat that by making it easy to report, and users should feel a sense of accomplishment after reporting because they can see if the report got addressed, or if they got it right".

**What judges must see:** (1) the problem: rangers depend on citizen reports, and a report can be hard to act on (wrong spot, no photo, a look-alike such as duckweed); (2) reporting is fast and guided, with a picture guide of what a bloom looks like and what only looks like one; (3) every report is triaged by a ranger, not blindly trusted, and its weight in the score depends on the outcome; (4) the reporter sees what happened: "You got it right." No claim is made about how often citizen reports are wrong; no statistic on report reliability is used anywhere.

### 21.1 Rules for this section

1. Every task is executed by an execution-tier agent (`model: "sonnet"`) unless marked orchestrator. TDD applies to Task 21.1 only. Every other task is visual and is verified with `npm run dev` in the browser at 1440 px and 375 px.
2. Every agent follows Section 11, names `impeccable`, applies the `ponytail` ladder, reads graphify-first (AGENTS.md point 8; no graph exists as of 13:40 PDT, so the agent says so and reads the named files directly), and runs `no-ai-slop` on user-facing text beyond the exact strings below. Exact strings here are copied verbatim.
3. Every Section 20.1 rule 4 string stays unchanged: the warning, the success sentence, "View updated site", "Report a Bloom", "Citizen reports", "Reports", "Sampling priority list", "Why citizen observations matter", every Section 8.2 and 8.3 string. The success sentence may be followed by the new lines in Task 21.4.
4. Honesty: every ranger outcome in the app is demonstration data and is labelled so (exact label strings in Tasks 21.5 and 21.6). A citizen report never confirms a bloom by itself; the outcome "Confirmed by field sample" is the only confirming label and it always names the field sample.
5. No backend and no new dependency. Persistence is `localStorage` only, every read and write wrapped in try/catch, so the app works when storage throws.
6. Start condition: Section 21 starts after the Section 20 tasks have landed and `npm run build` passes. Step 1 (Tasks 21.1, 21.2) edits no Section 20 file, so the orchestrator may start it as soon as Section 20 Step 2 is dispatched; Step 2 waits for Section 20 to land because it edits `Report.tsx`, `Layout.tsx` and `CommunityReportItem.tsx`.
7. Time box: Step 1 35 minutes, Step 2 60 minutes; the section is done by 17:45 PDT and frozen at 18:15 PDT. Task 8.1 polish then covers these screens.

### 21.2 Report status lifecycle (exact ids and labels)

| `ReportStatus` id | Label (exact) | Kind | Citizen evidence weight (user-submitted reports) | Icon (lucide) |
|---|---|---|---|---|
| `received` | Received | open | 10 | `Inbox` |
| `reviewing` | Ranger reviewing | open | 10 | `Search` |
| `sample-requested` | Field sample requested | open | 10 | `FlaskConical` |
| `confirmed` | Confirmed by field sample | outcome | 20 | `CircleCheck` |
| `not-bloom` | Not a bloom | outcome | 0 | `CircleX` |
| `more-info` | Needs more info | outcome | 10 | `CircleHelp` |

Allowed transitions (ranger buttons, Task 21.6): `received` to `reviewing`; `received` or `reviewing` to `sample-requested`; any open status to any outcome. Outcomes are final in this prototype.

### 21.3 Score rule (reports are weighted by review, not trusted blindly)

- A site's displayed `citizen_evidence` = min(100, prototype value + the sum of the weights in 21.2 over the **user-submitted** reports at that site). Seed reports (`dataTag` `synthetic-demo`) carry statuses for display only; their evidence is already inside the Section 6.1 prototype values, so they add 0 and the Section 6.1 table is unchanged.
- Callville Bay (prototype citizen evidence 64, algal bloom 79): one new report (Received) gives 74 and 81, the existing 79 to 81 moment, unchanged; Ranger reviewing, Field sample requested or Needs more info keep 74 and 81; Confirmed by field sample gives 84 and **82** (34.8 + 15.6 + 10.95 + 12.6 + 8.5 = 82.45); Not a bloom gives 64 and **79**.
- `applyCitizenReport` (Section 7) is unchanged and remains the "new report adds 10" rule; `src/engine/score.test.ts` and `src/lib/communityReports.test.ts` are not edited. The new rule lives in `withReportEvidence` (Task 21.1) with its own tests. The dashboard line "Each new report raises that site's citizen evidence by 10 points, capped at 100." stays true.

### 21.4 Order, parallelism and file ownership

| Step | Agent | Tasks | Owns these files (no other agent edits them) | Section 20 files touched |
|---|---|---|---|---|
| 1 (sequential) | Agent L | 21.1 then 21.2 | `src/types.ts`, `src/lib/reportLoop.ts` (new), `src/lib/reportLoop.test.ts` (new), `src/data/lakeMeadReports.ts`, `src/components/ReportStatusTag.tsx` (new), `src/state/RegionContext.tsx`, `src/App.tsx`, `src/pages/MyReports.tsx` (new, placeholder only), `src/pages/RangerQueue.tsx` (new, placeholder only) | none |
| 2 (parallel) | Agent D | 21.3, 21.4 | `src/pages/Report.tsx`, `src/components/BloomGuide.tsx` (new) | `Report.tsx` (20.7) |
| 2 (parallel) | Agent E | 21.5 | `src/pages/MyReports.tsx`, `src/components/ReportTimeline.tsx` (new), `src/components/Layout.tsx` | `Layout.tsx` (20.2) |
| 2 (parallel) | Agent F | 21.6, 21.7 | `src/pages/RangerQueue.tsx`, `src/components/CommunityReportItem.tsx`, `src/pages/Methodology.tsx` | `CommunityReportItem.tsx` (20.1) |
| any time | Orchestrator, inline | 21.8 | `src/data/citations.ts`, `src/data/citations.test.ts`, PLAN.md Section 19.2 (one row) | none |

Step 2 agents import only from `src/lib/reportLoop.ts`, `ReportStatusTag.tsx` and `useRegion()`; none edits a Step 1 file.

### 21.5 Tasks

- **21.1 Lifecycle logic, types, seed outcomes.** Effort M. Agent L. TDD applies. Priority P1 (never cut).
  - `src/types.ts`: add `export type ReportStatus = "received" | "reviewing" | "sample-requested" | "confirmed" | "not-bloom" | "more-info";` and optional fields on `CitizenReport`: `reporterId?: string; status?: ReportStatus; rangerNote?: string; statusHistory?: { status: ReportStatus; at: string }[];`. Optional, so FHIR and Section 20 code compile unchanged.
  - `src/lib/reportLoop.ts` exports:
    - `STATUS_LABEL: Record<ReportStatus, string>` and `EVIDENCE_WEIGHT: Record<ReportStatus, number>`, exactly the 21.2 table; `isOutcome(status)`; `NEXT_STEP_LABEL`: `received` "Next: Ranger reviewing", `reviewing` "Next: field sample or outcome", `sample-requested` "Next: outcome".
    - `withReportEvidence(site, reports)`: per 21.3. A report counts when `siteId === site.id` and `dataTag === "user-submitted"`; missing `status` counts as `received`. When the site has no `citizen_evidence` and no counted reports, it is left missing.
    - `setStatus(report, status, at, note?)`: returns a new report with `status`, `rangerNote` (when given) and `statusHistory` appended `{ status, at }`; never mutates.
    - `trackRecord(reports, reporterId)`: `{ filed, decided, matched }` where `decided` counts `confirmed` + `not-bloom` and `matched` counts `confirmed`.
    - `recordLine(rec)`: exactly "{matched} of {decided} reviewed reports matched the field result." or, when `decided` is 0, "No reviewed reports yet."
    - `reportCode(report)`: seed `report-{n}` gives "VR-{1000+n}"; `user-{ms}` gives "VR-" + the last 4 digits of `ms`.
    - `REPORTER_NAME`: `{ you: "You (demo reporter)", "reporter-b": "Reporter B", "reporter-c": "Reporter C" }`.
    - `nearestSite(lat, lon, sites)`: the site with the smallest equirectangular distance.
    - `loadReportState(storage = globalThis.localStorage)` and `saveReportState(state, storage = globalThis.localStorage)`, key `verdant.reports.v1`, value `{ submitted: CitizenReport[], seedStatus: Record<string, Pick<CitizenReport, "status" | "statusHistory" | "rangerNote">> }`; load returns `null` on a missing key, bad JSON or a throwing storage; save swallows errors. `clearReportState(storage)` removes the key inside try/catch.
  - `src/data/lakeMeadReports.ts`: add to the seven seed reports (ids, sites, text and timestamps unchanged):
    - report-1 Callville Bay: `reporterId "you"`, `confirmed`, note "Demo outcome: a field sample on Oct 2 confirmed a bloom at the marina docks.", history received 2026-10-01T08:30Z, reviewing 2026-10-01T15:00Z, sample-requested 2026-10-01T16:00Z, confirmed 2026-10-02T18:00Z.
    - report-2 Callville Bay: `reporter-b`, `sample-requested`, history received, reviewing, sample-requested on 2026-10-02 after 16:10Z.
    - report-3 Callville Bay: `reporter-c`, `reviewing`.
    - report-4 Las Vegas Bay: `you`, `not-bloom`, note "Demo outcome: the brown-green water after the storms was stirred-up sediment, not a bloom.", history received, reviewing, not-bloom 2026-10-02T09:00Z.
    - report-5 Las Vegas Bay: `reporter-b`, `received`.
    - report-6 Overton Arm: `you`, `confirmed`, note "Demo outcome: a field sample on Oct 3 confirmed a bloom in the shallow cove.", history through confirmed 2026-10-03T17:00Z.
    - report-7 Boulder Basin: `you`, `more-info`, note "Demo outcome: the ranger asks where exactly the fish were, and for a photo if you go back."
    - Every history entry is at or after the report's `createdAt`.
  - `src/components/ReportStatusTag.tsx`: `ReportStatusTag({ status })`: the 21.2 icon (14px, stroke 1.75) plus label, Sans 500 12px, 4px radius, padding 2px 8px, 1px border. Open statuses: `--muted` fill, ink text. `confirmed`: `--primary` border and text. `not-bloom` and `more-info`: dashed `--border`, muted ink. Never a risk colour.
  - Tests (`src/lib/reportLoop.test.ts`): Callville plus one user-submitted report gives citizen evidence 74 and algal bloom 81 for `received`, `reviewing`, `sample-requested` and `more-info`; 84 and 82 for `confirmed`; 64 and 79 for `not-bloom`; the 3 seed Callville reports add 0 (64, 79); two `received` user reports give 84; a site at 95 plus one report caps at 100; a report at another site adds 0; `setStatus` appends history and leaves the input unchanged; `trackRecord(lakeMeadReports, "you")` is `{ filed: 4, decided: 3, matched: 2 }` and its `recordLine` is "2 of 3 reviewed reports matched the field result."; `trackRecord(lakeMeadReports, "reporter-b")` gives "No reviewed reports yet."; `reportCode` of report-1 is "VR-1001" and of `user-1759600000123` is "VR-0123"; `nearestSite(36.15, -114.70, sites)` is Callville Bay and `nearestSite(36.06, -114.34, sites)` is Temple Basin; `loadReportState` on a throwing stub returns `null`, on bad JSON returns `null`, and round-trips a saved state through a Map-backed stub.
  - Done: `npx vitest run` passes (every existing test unchanged and green) and `npm run build` exits 0.

- **21.2 Shared report state, persistence, routes.** Effort M. Agent L, after 21.1. Priority P1 (never cut, except persistence per 21.7).
  - `src/state/RegionContext.tsx`:
    - State: `submitted: CitizenReport[]` and `seedStatus`, both initialised from `loadReportState()` (empty when `null`), saved with `saveReportState` in a `useEffect` on change.
    - `reports` = the region's seed reports (with `seedStatus` overrides merged by id) plus the `submitted` reports whose `siteId` is in the region's sites. Switching region no longer drops submitted reports.
    - `sites` = `config.sites.map((s) => withReportEvidence(s, reports))` in `useMemo`. The `sites` `useState`, `setSites` and the `applyCitizenReport` call are removed (nothing outside this file uses `setSites`).
    - `addReport(r)`: fills `reporterId "you"`, `status "received"` and `statusHistory [{ status: "received", at: r.createdAt }]` when absent, then appends to `submitted`. Its signature is unchanged, so `Report.tsx` keeps working, and its 79 to 81 preview still matches because a Received report weighs 10.
    - New: `updateReportStatus(id, status, note?)` (uses `setStatus` with `new Date().toISOString()`; updates `submitted` when the id is there, else `seedStatus`) and `resetDemo()` (calls `clearReportState()` and empties both).
  - `src/App.tsx`: routes `/my-reports` to `MyReports` and `/rangers` to `RangerQueue`. Both page files are created here as placeholders rendering their H1 only ("My reports", "Report queue"); Agents E and F replace the bodies.
  - Done: build passes; all tests pass; in the browser, submitting a Callville Bay report still shows 79 to 81; a reload keeps the submitted report and Callville at 81 (Task 21.5 adds the "Reset demo data" button that clears it).

- **21.3 Guided three-step report flow (easier reporting).** Effort L. Agent D. Priority P1.
  - Files: `src/pages/Report.tsx`, `src/components/BloomGuide.tsx` (new).
  - The H1, intro paragraph, OAH source line, aside and "Why citizen observations matter" stay as Section 20.7 left them. The form becomes three steps shown one at a time, mobile-first, single column `max-w-[640px]`. Above each step: "Step {n} of 3" (Mono 12px muted) and the step title as H2 (20px Sans 600). Buttons: "Next" (primary) and "Back" (outline), 44px minimum height, full width below 640 px. Answers survive moving between steps.
  - **Step 1, title exactly "Where are you?"**
    - Sites as large tappable buttons (one column below 640 px, two columns above; each at least 56px tall; site name Sans 600 16px with its `RiskBadge` on the right). Selected: 2px `--primary` border, lucide `Check`, `aria-pressed="true"`. `?site=` preselects (Section 20.7); otherwise no site is preselected.
    - An outline button "Use my location" with lucide `LocateFixed`: calls `navigator.geolocation.getCurrentPosition` and selects `nearestSite`; then shows "Nearest site: {name}" (14px muted); on error or no support shows exactly "Location unavailable. Pick a site below." The button is the first item in the 21.7 cut order.
    - "Next" is disabled until a site is selected.
  - **Step 2, title exactly "What do you see?"**
    - Photo first: a full-width dashed `--border` box button, 96px tall, lucide `Camera` icon and the text "Add a photo", backed by `<input type="file" accept="image/*" capture="environment">`; helper "Photo stays on your device" (unchanged); preview under it once chosen.
    - `BloomGuide` (H3 exactly "Is it a bloom?"): two groups of illustrated tiles, each tile a 64px square drawn as inline SVG using only Section 11.3 colours (`--risk-low` solid and tint for green, `--primary` for water, `--muted` for background), with a 14px caption. Group 1, heading "Looks like a bloom": "Spilled green paint", "Green crust along the shore", "Puffy green scum", "Swirls under the surface". Group 2, heading "Often mistaken for one": "Duckweed: tiny separate leaves", "Long strands of green algae", "Filamentous macro-algae". Under the tiles, data-label style, exactly: "Guide based on Illinois EPA, Identifying Cyanobacteria Blooms. Drawings, not photos." (row C11).
    - Directly under the guide, a single-choice question "Which matches what you see?" with three large choice buttons (min height 48px): "Looks like a bloom", "Looks like a look-alike", "Not sure". Stored as the first observation entry "Guide match: {answer}".
    - The bloom questions from `src/data/reportFields.ts`, in this order, as large tappable choice buttons instead of selects (options verbatim): `algae`, `foam`, then `wildlife` (multi, with the existing "none" exclusivity and the "Animals present: yes/no" line).
    - The other four fields (`riparian`, `hydrology`, `diptera`, `ticks`) sit in a native `<details>` with summary exactly "More questions (optional)", same choice buttons.
    - "Next" is always enabled (every answer is optional).
  - **Step 3, title exactly "Check and send"**: a summary list (site name, "Photo added" or "No photo", each answered question as "{label}: {answers}"), the Notes textarea labelled "Anything else? (optional)", the unchanged warning `Alert`, then "Submit report" (unchanged label) and "Back".
  - Observation text format stays Section 20.7's `"{label}: {answers joined by ", "}"`, with "Guide match: ..." first.
  - Done: from `/site/callville-bay`, "Add an observation at Callville Bay" opens Step 1 with Callville Bay selected; Next, tap "Looks like a bloom" and "lots", Next, Submit report: the Section 20.7 success state appears with 79 to 81; on 375 px every step fits with no horizontal scroll and every choice is at least 44px tall; keyboard Tab reaches every choice; "Use my location" with location blocked shows the exact error line.

- **21.4 Accomplishment moment after submit.** Effort S. Agent D. Priority P1.
  - File: `src/pages/Report.tsx` (success state only).
  - Directly after the unchanged success sentence, in this order: "Report {reportCode}" in Mono 14px; the line exactly "Your report is in the ranger queue."; the line exactly "A ranger reviews it next. Check My reports to see what they found." (16px muted). Then the Section 20.7 before/after block and links unchanged, then a primary button "Track it in My reports" with lucide `ListChecks`, linking to `/my-reports`, and an outline button "File another report" that resets the form to Step 1.
  - Done: after a Callville Bay submission the success state reads, top to bottom: the success sentence, "Report VR-xxxx", "Your report is in the ranger queue.", the follow-up line, 79 struck through, 81, the evidence line, "View updated site", "See it on the dashboard", "Track it in My reports".

- **21.5 "My reports" page, timeline, navigation.** Effort M. Agent E. Priority P1.
  - Files: `src/pages/MyReports.tsx`, `src/components/ReportTimeline.tsx` (new), `src/components/Layout.tsx`.
  - Navigation: order becomes Dashboard · Report a Bloom · My reports · Report queue · OAH Cities · Methodology (links `/my-reports`, `/rangers`). Inline nav shows at 1280 px and wider; below 1280 px the nav lives in the existing `Sheet`. The "Report what you see" button keeps its Section 20.2 behaviour (768 px and wider, hidden on `/report`). Done-check: header on one line at 1440, 1280 and 768 px.
  - Page `/my-reports`:
    - H1 "My reports". Under it, data-label style, exactly: "Demonstration outcomes. In this prototype, a ranger outcome is set by hand on the Report queue page."
    - Record band (one bordered strip, three cells split by hairlines, values Mono 28px): "Reports filed" (`filed`), "Reviewed" (`decided`), "Matched the field result" (`matched`). Under the band: "Your record: " + `recordLine` (16px ink).
    - The reports with `reporterId "you"` in the active region, newest first. Each row (hairline bottom border, padding 16px 0): line 1 `reportCode` (Mono 12px), site name as a link to `/site/:id` (Sans 600 16px), `formatReportTime`; line 2 `reportSummary`; line 3 `ReportStatusTag`. Then the message block in the "Verdant recommendation" label style (11.4) with the label "Outcome" for outcomes and "Status" for open statuses, content exactly:
      - `received`: "Your report is in the ranger queue."
      - `reviewing`: "A ranger is reviewing your report."
      - `sample-requested`: "A ranger requested a field sample at {site}. Your report helped prioritize {site} for sampling."
      - `confirmed`: first line "You got it right." (20px Sans 600), then "A field sample confirmed a bloom at {site}. Your report helped prioritize {site} for sampling.", then the `rangerNote` in 14px muted.
      - `not-bloom`: first line "Close, but not a bloom this time." (20px Sans 600), then the `rangerNote`, then "Check the guide on the report page to tell blooms from look-alikes." with "the guide" linking to `/report`.
      - `more-info`: first line "The ranger needs one more detail." (20px Sans 600), then the `rangerNote`, then an outline button "Add a follow-up report" linking to `/report?site={siteId}`.
    - Below the message, `ReportTimeline({ report })`: one row per `statusHistory` entry, oldest first: the 21.2 icon (16px, `--primary` for reached steps), the label (Sans 500 14px), the time via `formatReportTime` (Mono 12px muted); rows joined by a 1px `--border` vertical connector; for an open status a final muted row with `NEXT_STEP_LABEL`. No dots.
    - Empty state, exactly: "You have not filed a report in {region name} yet." with a primary button "Report what you see".
    - Page foot: a text link "Ranger view: open the Report queue" to `/rangers`, and an outline button "Reset demo data" with the helper "Clears reports and outcomes saved in this browser." calling `resetDemo()`.
  - Done: after a reload with reset data, Lake Mead shows Reports filed 4, Reviewed 3, Matched 2, "Your record: 2 of 3 reviewed reports matched the field result."; report-6 and report-1 show "You got it right.", report-4 "Close, but not a bloom this time.", report-7 "The ranger needs one more detail."; after a Callville Bay submission the new report is on top with Received and "Your report is in the ranger queue."; Coimbra shows the empty state; 375 px has no horizontal scroll.

- **21.6 Ranger "Report queue" page.** Effort M. Agent F. Priority P2 (in scope; cut per 21.7).
  - File: `src/pages/RangerQueue.tsx`.
  - H1 "Report queue". Under it, data-label style, exactly: "Demonstration ranger view. Outcomes here are set by hand to show the feedback loop. No real ranger or lab result is involved." Intro (16px muted, 68ch), exactly: "Reports at higher-risk sites come first. Each one shows the reporter's track record, so a ranger can weigh it before acting."
  - H2 "Open reports ({n})": every report with an open status, sorted by its site's score descending, then newest first. Row: `reportCode`, site name with `RiskBadge`, `formatReportTime`, `reportSummary`; reporter line "{REPORTER_NAME}. Record: {recordLine}" (14px); `ReportStatusTag`; buttons (outline, size sm, 36px tall, wrap on mobile): "Start review" (only when `received`), "Request field sample" (when `received` or `reviewing`), then "Confirmed by field sample", "Not a bloom", "Needs more info". Clicking calls `updateReportStatus` with the note: confirmed "Demo outcome: a field sample confirmed a bloom at {site}."; not-bloom "Demo outcome: the ranger found no bloom at {site}. It was likely a look-alike such as duckweed or strands of green algae."; more-info "Demo outcome: the ranger asks for a photo and the exact spot on the shore."; no note for the open transitions. The changed row gets the Section 11.7 1200ms fade.
  - Under each row's buttons, 12px muted: for user-submitted reports "Score weight: {EVIDENCE_WEIGHT[status]} points of citizen evidence."; for seed reports "Demo report: its evidence is already in the prototype values."
  - H2 "Decided ({n})": outcome reports, newest first, same row without buttons, plus the `rangerNote`.
  - Empty state for open reports, exactly: "No open reports for {region name}."
  - Done: on Lake Mead, Open shows 3 seed reports (report-2, report-3, report-5) with Callville reports first; after a Callville submission the new report heads the list with "You (demo reporter). Record: 2 of 3 reviewed reports matched the field result."; "Request field sample" then "Confirmed by field sample" moves it to Decided, the dashboard shows Callville Bay at 82, `/site/callville-bay` shows "Citizen evidence: 84/100, adds 12.6 points to the Algal bloom score.", and `/my-reports` shows "You got it right." with record 3 of 4; marking a fresh report "Not a bloom" returns Callville Bay to 79.

- **21.7 Status on community items and the weight rule on Methodology.** Effort S. Agent F. Priority P2.
  - `src/components/CommunityReportItem.tsx`: line 3 starts with `ReportStatusTag` (when `status` is set), before the Section 20 tag label. Nothing else changes.
  - `src/pages/Methodology.tsx`: directly under the Section 7 risk equations, a paragraph, exactly: "Citizen evidence is weighted by review. A new report adds 10 points to its site's citizen evidence. A report confirmed by field sample adds 20. A report a ranger marks Not a bloom adds 0. Demo reports are already counted in the prototype values."
  - Done: the dashboard feed and the site page show a status tag on every Lake Mead report; the Methodology paragraph shows verbatim.

- **21.8 Citation row C11 for the bloom guide.** Effort S. Orchestrator, inline.
  - Files: `src/data/citations.ts`, `src/data/citations.test.ts` (expected ids end with "C11"), PLAN.md Section 19.2 (row C11, already added by this amendment). Done: `npx vitest run src/data` passes and the Methodology table shows C11.

### 21.6 Video, Devpost, README

Section 13 (segments 0:25–0:40, 1:30–2:55, 4:05–4:30), Section 14 ("Citizen science" paragraph) and Section 15 (item 2) carry this section's story. The recording note in Section 13 requires clicking "Reset demo data" on `/my-reports` before the take.

### 21.7 Cut order (first cut first)

1. "Use my location" in Step 1. Trigger: Task 21.3 not done at 17:00 PDT.
2. `BloomGuide` drawings become a two-column text list with the same captions and source line. Trigger: 21.3 not done at 17:15 PDT.
3. `localStorage` persistence: state stays in React only; "Reset demo data" then just empties state. Trigger: 21.2 persistence tests failing at 17:15 PDT.
4. Ranger page `/rangers` (21.6): replaced by the same outcome buttons rendered inside each open row on `/my-reports` under the data label "Demo: act as the ranger"; the "Report queue" nav item is removed; video step (4) is filmed on `/my-reports`. Trigger: 21.6 not done at 17:45 PDT.
5. Three-step flow: the form stays on one screen with the Step 2 order (photo, match question, bloom questions as choice buttons, "More questions (optional)"), then the warning and submit. Trigger: 21.3 not done at 17:45 PDT.
6. 21.7 status tags on community items. Trigger: not done at 18:00 PDT.

Never cut: 21.1, the 21.2 shared state (with or without persistence), 21.4, 21.5 with its seed outcomes and "You got it right.", 21.8, every demonstration label.

### 21.8 Conflicts resolved by this section

- Section 4 item 9 ("a page reload drops submitted reports, by design") is superseded: submitted reports and outcomes persist in `localStorage` until "Reset demo data".
- Section 4 out-of-scope "a separate agency dashboard": the Report queue is one demonstration page inside the same app, not a separate dashboard; "authentication" stays out of scope (the reporter is the fixed demo reporter "you").
- Section 11.4 nav breakpoint moves from 768 px to 1280 px for the inline nav (six items); the CTA keeps 768 px.
- Section 20.1 rule 3 ("reports stay in `RegionContext` state; a reload resets") is superseded by Task 21.2; the 7-seed-report counts in Sections 9 and 20 are unchanged because no seed report is added.

### 21.9 Done-check for the whole section

The orchestrator runs `npm run build` and `npx vitest run`, clicks "Reset demo data", reloads, walks the Section 13 1:30–2:55 steps (1) to (6) on `npm run dev`, and confirms every exact string in Section 21.5 at 1440 px and 375 px with no console errors.
