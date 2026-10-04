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

Status: WRITTEN (Task 1.2). Product context lives in `PRODUCT.md`. Every UI task names `impeccable` and follows this section without reinterpretation (AGENTS.md point 3). Design read: Operate-mode monitoring tool for agency staff and judges, in a field-survey-instrument language. Dials: VARIANCE 4, MOTION 2, DENSITY 5. Light theme only; no dark mode is built. **Superseded in part by Section 23 (field notebook, 2026-10-04 16:20 PDT):** the 11.2 families and import and the 11.3 hex values below were replaced in place; wherever 11.1 to 11.9 conflict with Section 23 (serif, "no serif", "every number Mono", flat page with zero texture, the 11.8 alternatives), Section 23 wins. Layout, spacing, structure and behaviour in 11.4 to 11.7 stay.

**11.1 Thesis.** Verdant looks like a hydrological survey instrument, not a SaaS dashboard: a cool paper-grey sheet, ink type, hairline rules and one deep reservoir-blue accent, so the only saturated colour on screen is risk. Numbers are the hero; every score is set in mono, sits next to its category word and icon, and is one click from its explanation.

**11.2 Typography.**
- Families (Section 23.3 replaced these): `Young Serif` (headlines, wordmark, big numerals), `Schibsted Grotesk` (body, UI), `DM Mono` (data labels, small numbers, equations). Three families.
- Import, first line of `src/index.css`, before `@import "tailwindcss";`:
  `@import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Schibsted+Grotesk:wght@400;500;600;700&family=Young+Serif&display=swap");`
- Tailwind mapping in `@theme inline`: `--font-sans: "Schibsted Grotesk", ui-sans-serif, system-ui, sans-serif;` `--font-heading: "Young Serif", Georgia, serif;` `--font-mono: "DM Mono", ui-monospace, monospace;`. All numbers use `tabular-nums`.
- Scale: the 23.3 scale replaces the one below wherever they differ (old scale kept for reference only):
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
| `--background` | `#F2ECDD` | warm paper page background (`bg-background`), carries the 23.5 grain |
| `--card`, `--popover` | `#FAF6EC` | clean surfaces: map frame, tables, popups, inputs (no grain) |
| `--foreground`, `--card-foreground`, `--popover-foreground` | `#1E2B22` | ink |
| `--muted` | `#E8DFCB` | quiet fills: table header, hover row, `secondary` |
| `--muted-foreground` | `#5A5644` | muted ink: meta lines, helper text |
| `--border` | `#CFC3A5` | decorative rules and panel hairlines |
| `--input` | `#8C8064` | input, checkbox and outline-button borders (3:1 UI contrast) |
| `--primary`, `--ring` | `#1F4D3A` | pond green: primary button, links, focus ring, contribution bars, "Official data" tag |
| `--primary-foreground` | `#FAF6EC` | text on pond green |
| `--olive` (new) | `#596327` | secondary ink: leading pathway, contour strokes, KPI captions |
| `--ochre` (new) | `#B7791F` | marks only (underlines, arrows, stamp borders, tape); never text |
| `--ochre-ink` (new) | `#8A5A12` | ochre text, only on `--background` or `--card` |
| `--secondary` / `--accent` | `#E8DFCB` | shadcn hover surfaces |
| `--secondary-foreground` / `--accent-foreground` | `#1E2B22` | |
| `--destructive` | `#A3241B` | form errors only |
| `--radius` | `0.1875rem` (3px) | |

Risk tokens (also exposed as `--color-risk-*`). Solid = markers, meter, chart dots. Tint + text = badges and table cells. Lightness is non-monotonic on purpose, so every category also carries a size, an icon (lucide-react) and its word.

| Category | `--risk-*` solid | `--risk-*-tint` | `--risk-*-ink` | Icon | Marker diameter | Number on marker |
|---|---|---|---|---|---|---|
| Low | `#276E90` (clear-water blue, Section 23.4) | `#DCEAF0` | `#174A66` | `ShieldCheck` | 24px | `#FAF6EC` |
| Moderate | `#E0AE2E` | `#F6E8BC` | `#634C00` | `Eye` | 28px | ink `#1E2B22` |
| High | `#E07433` | `#F5DAC4` | `#84380A` | `TriangleAlert` | 32px | ink `#1E2B22` |
| Very High | `#A3241B` | `#F2D5CF` | `#861B14` | `OctagonAlert` | 36px | `#FAF6EC` |

Risk badge (one component, `RiskBadge`): tint background, ink text, 1px border in the solid colour, icon 14px + score (Mono) + category word. Never colour without the word. Icons: lucide-react only (installed by shadcn; no second icon library), stroke width 1.75 everywhere.

**11.4 Layout, spacing, radius, shadow.**
- Shell: header 60px, `bg-card`, bottom hairline; wordmark "Verdant" Sans 700 20px left; nav (Dashboard, Report a Bloom, OAH Cities, Methodology) Sans 500 14px, active link = ink with 2px accent underline; region switch right, as a 2-segment control (Lake Mead | Coimbra), active segment `bg-primary text-primary-foreground`. Below 768px: nav moves into a shadcn `Sheet` opened by a `Menu` icon button; region switch stays visible. (Section 21, Task 21.5: with six nav items the inline nav shows at 1280px and wider, the `Sheet` below 1280px.) Content container `max-w-[1360px] mx-auto px-6` (px-4 below 768px). Footer: disclaimer (§8.2) in 14px muted ink above a hairline.
- Spacing: 4px base; only Tailwind steps 1, 2, 3, 4, 6, 8, 12, 16. Section gap 48px (`gap-12`) desktop, 32px mobile. Inside panels 16px or 24px.
- Radius: 4px (`rounded-sm`) on every rectangle (buttons, inputs, panels, popups, badges). Markers and meter pointer are the only round shapes. No `rounded-xl`, no pills.
- Shadow: none on page elements; panels are separated by 1px `border` hairlines. One shadow token, `0 6px 24px rgb(20 33 31 / 0.14)`, used only on Leaflet popups, `Select`/dropdown content and `Sheet`.
- Dashboard @1440: row 1 = KPI strip, one bordered band split into 5 cells by vertical hairlines: Region status, Highest-risk site, Citizen reports, Areas Requiring Attention, then the Official data cell (4px left border in `--primary`, "Official data" badge, value Mono 28px, source line Mono 12px with link). Row 2 = 12-col grid: map `col-span-7`, height 620px; "Sampling priority list" `col-span-5`, same height, scroll inside if needed. Data label "Prototype demonstration data" sits directly above the KPI strip, left-aligned. @375: KPI strip becomes 2x2 grid, official cell full width beneath, map full width 380px tall, priority list renders as stacked rows (rank + site + badge on line 1; leading pathway, trend, reports, action on line 2). No horizontal scroll.
- Priority list (Section 22 amends: at 1024px and up the table has 5 columns, Rank | Site with leading pathway beneath | Risk with trend beneath | Reports | Action, headers "Site / Leading pathway" and "Risk / Trend"; site names never wrap): rank in Mono 20px muted, site Sans 600, `RiskBadge`, trend as lucide `TrendingUp`/`TrendingDown`/`MoveRight` + word, action text. Rows separated by one bottom hairline (no top borders). Rank-1 row has no risk-tinted background; it gets a 3px left `--primary` border and the "Verdant recommendation" label block containing "Recommended first sampling target".
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
- Legend (Section 22 amends: below 768px the legend sits under the map frame as one wrapped row, not over the map): bottom-left inside the map, `bg-card` hairline box, four rows of marker swatch + icon + category word + range (Mono 12px).
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
| 0:00–0:25 | C | The live site at `/` (Section 23.10, Task 23.2): the StatHero block is the first frame, filmed on the deployed site at 1440x900, showing the statistic and the stamped source line "Source: CDC, MMWR 69(50), Dec 18, 2020" (Section 19.2 row C1); hold 8 s, then click "See where to sample first" and let the page settle on the map (a separate title card and the Lake Mead photo are optional, no longer required) | Spoken, exactly: "Across the United States, 18 states reported 421 harmful algal bloom events, 389 cases of human illness and 413 cases of animal illness from 2016 to 2018." Then: "At Lake Mead, the National Park Service warns that bloom toxins can make people sick and can kill dogs. Monitoring cannot continuously cover every part of the lake." |
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

## 22. UI improvement pass

**Why (user, 2026-10-04, verbatim):** "next lets work on the ui, its not bad but could use substantial improvement". Written 15:55 PDT by the planning-tier agent from a headless-Chrome audit (1440x900 and 390x844, every route, the full report flow, Coimbra). Screenshots live outside the repo in the session scratchpad `ui-audit/`. Section 11 stays the direction; this section sharpens it. Fonts stay (Schibsted Grotesk + IBM Plex Mono read well in every screenshot; the audit gives no reason to change them, so the Section 11.2 import line is unchanged). Colour tokens stay unchanged. Section 11.4 (priority list) and 11.5 (legend) carry one-line amendments pointing here.

**Assumptions (no user available):** the video is recorded at 1440x900 in Chrome on the production build; every exact string in Sections 8, 20 and 21 stays verbatim; no new dependency, no new CSS file, Leaflet and all demo logic stay.

### Findings, ranked by impact on the demo video

1. **Dashboard @1440x900: the map, the hero of video 0:40-1:05, starts at y=520 and shows only 380px above the fold.** The title block and a 210px-tall KPI band with half-empty cells push it down.
2. **Dashboard map: the initial view clips the sites.** Las Vegas Bay and Boulder Basin sit on the bottom edge, the east basin is empty grey, and the "+" zoom button is hidden under the "Community reports" toggle (both top-left; Section 11.5 said zoom top-right).
3. **Dashboard: the Sampling priority list is cramped.** Seven columns in 620px: "Callville Bay", "Leading pathway", "Las Vegas Bay" and every action wrap to two lines, so the rank-1 row, a key video frame, reads as clutter.
4. **Mobile dashboard: the legend covers about 45% of the 380px map;** markers are cut at the left edge and the attribution runs into the legend.
5. **Site detail: the score is said twice.** The 72px "79" sits next to a badge that repeats "79". The contribution bars end at about 35% of the row while their values sit at the far right, so bar and number never read together. The hero's right column floats.
6. **Every page: "outline" buttons look grey and disabled.** The outline variant uses `bg-background` (page grey) on `bg-card` surfaces: Back, File another report, Start review, Reset demo data, Add a follow-up report.
7. **Report Step 2: raw lowercase options ("none", "sewage-smell", "oil-sheen") in a 2-column grid leave orphan tiles ("lots" alone on a row);** "Step 2 of 3" is the only progress cue; the long step has no visual rhythm.
8. **Report aside hides under the header** (`lg:sticky lg:top-6` under a 60px sticky header). In dev, StrictMode fires the step-scroll effect on mount, so `/report` opens scrolled past its H1 (production unaffected; the fix is one line).
9. **Report queue: no button hierarchy.** Five identical grey buttons per row; the two the video clicks ("Request field sample", "Confirmed by field sample") do not stand out. The demonstration label stretches the full 1312px as a dashed bar. Decided rows leave the right half empty except the seed note.
10. **My reports: the payoff line "You got it right." is a plain 20px line,** the same weight as "The ranger needs one more detail."; the record band is a small 600px strip; the right 400px of the page is empty.
11. **Report success: the aside repeats 81 next to the before/after block,** and two text links plus two buttons read as four equal choices.
12. **OAH Cities: the five 120x64 locator boxes are near-empty frames with one dot** and look broken.
13. **Coimbra dashboard:** central markers overlap (a "46" hidden under "54"); acceptable once the map fits its bounds.
14. **Methodology:** readable and solid; only the shared button and spacing fixes reach it.

### Design decisions (absolute)

- **Typography:** families, scale and import unchanged (Section 11.2). Choice-button labels render with `first-letter:uppercase`; the stored strings are unchanged.
- **Colour:** tokens unchanged. New uses, token-derived only: selected choice buttons `bg-primary/10` plus the existing 2px `--primary` border; the "Confirmed by field sample" ranger button `border-primary text-primary`; the confirmed outcome block in My reports `bg-primary/5`.
- **Buttons:** the shadcn `outline` variant becomes `border-border bg-card hover:bg-muted`.
- **Spacing rhythm:** Layout `main` gets `pt-8 pb-16` (32px top, 64px bottom) and pages drop their own top padding; section gap stays 48px desktop, 32px mobile.
- **Dashboard @1440:** title block (H1 40px, subtitle max 68ch, data label beneath). KPI band cells padding 16px, top-aligned, band height at most 132px: "From {n} sites" and "Add a report" sit on one line; the official cell's source URL displays as "usbr.gov" (`href` unchanged, full URL in `title`). 24px gap from KPI band to the map row. Result: map top edge at y ≤ 380 at 1440x900 (Section 23.10 amends: the StatHero now sits first, the title block collapses to one row and the KPI band to 112px, so the map top moves to y ≤ 540). Row 2 stays map `col-span-7` + list `col-span-5`, 620px tall.
- **Map:** on load and on region switch the map fits the bounds of the region's sites with 40px padding (`fitBounds`, max zoom = config zoom + 1), so every marker sits inside the frame. Zoom control top-right; toggle top-left; attribution 11px muted on `bg-card/90`. Below 768px: map 420px tall, scroll-wheel zoom off, legend under the frame as one wrapped row.
- **Priority list @1024+:** 5 columns, Rank | Site / Leading pathway | Risk / Trend | Reports | Action. Site name Sans 600 `whitespace-nowrap` with the leading pathway 13px muted beneath; `RiskBadge` with the trend icon and word 13px beneath; Action 13px. The rank-1 row keeps its 3px `--primary` left border and the "Verdant recommendation" block. Below 1024px the stacked rows stay.
- **Site detail hero:** the badge beside the 72px numeral renders without the score (`RiskBadge` without `score`). The hero sits in a `bg-card` band, hairline border, 24px padding; the right column (meter, then the recommendation pair) is vertically centred against the left.
- **Contribution bars:** columns label 180px | bar followed by its value. The value block (Mono 12px "34.8 pts", "87 × 0.40" beneath) sits 8px after the bar's end. Bar length rule unchanged.
- **Report flow:** a 3-segment progress rule (segments 4px tall, 4px gaps, `--primary` for reached steps, `--border` otherwise, total width 120px) sits beside "Step {n} of 3". Choice sets of exactly three short options render as a 3-column row; others stay 2 columns. Aside `lg:top-[84px]`. The step-scroll effect runs only when `step` or `done` differs from the previous value held in a ref, so StrictMode cannot scroll on mount. Success: at 1024px and up the aside is hidden; the two text links sit on one line above "Track it in My reports" (primary) and "File another report" (outline).
- **Report queue:** each row's buttons form two groups: "Start review" and "Request field sample" (outline); then, 12px apart, a 12px muted label "Outcome" followed by "Confirmed by field sample" (outline with `border-primary text-primary`), "Not a bloom", "Needs more info" (outline). The data label is `w-fit`. Decided rows are a single column, max 72ch, with the score-weight or seed note under the status tag.
- **My reports:** the record band spans the content width, values Mono 40px. "You got it right." becomes 24px Sans 700 with a lucide `CircleCheck` 24px `--primary` before it; the confirmed block gets `bg-primary/5`. Content grid 8/4 (message left, timeline right) across the full container.
- **OAH Cities:** the locator SVGs are removed; each row keeps name, country, Mono coordinates, data-status label and pathways.
- **Motion:** unchanged (Section 11.7); no new animation.

### Order, agents and file ownership

Every agent: `model: "sonnet"`, follows Sections 11 and 22, names `impeccable`, applies the `ponytail` ladder, reads graphify-first (`graphify-out/graph.json` exists as of 15:50 PDT), runs `no-ai-slop` on new user-facing text (this section adds only "Outcome" and the "usbr.gov" link text), keeps every exact string of Sections 8, 20 and 21 verbatim, adds no dependency and no CSS file, appends its `PROGRESS.md` entry, and puts no AI attribution in commits. TDD does not apply (visual work).

- **Step 1 (sequential, start 16:05, done by 16:30 PDT):** Agent S, Task 22.1. Only Agent S edits `src/index.css`, `src/components/ui/button.tsx`, `src/components/Layout.tsx`, `src/components/Footer.tsx`, `src/components/RiskBadge.tsx`.
- **Step 2 (three agents in parallel after Step 1 lands, 16:30 to 17:30 PDT):**

| Agent | Tasks | Owns (no other agent edits these) |
|---|---|---|
| A | 22.2, 22.3 | `src/pages/Dashboard.tsx`, `src/components/KpiCards.tsx`, `src/components/OfficialDataCard.tsx`, `src/components/RiskMap.tsx`, `src/components/SamplingPriorityList.tsx`, `src/components/CommunityReportsFeed.tsx`, `src/components/CommunityReportItem.tsx` |
| B | 22.4, 22.5 | `src/pages/SiteDetail.tsx`, `src/components/ContributionBars.tsx`, `src/components/RiskMeter.tsx`, `src/pages/Report.tsx`, `src/components/BloomGuide.tsx` |
| C | 22.6, 22.7 | `src/pages/RangerQueue.tsx`, `src/pages/MyReports.tsx`, `src/components/ReportTimeline.tsx`, `src/components/ReportStatusTag.tsx`, `src/pages/OahCities.tsx`, `src/components/CityCard.tsx`, `src/pages/Methodology.tsx` |

No Section 22 task edits `src/engine/`, `src/lib/`, `src/data/`, `src/state/`, `src/fhir/`, `src/types.ts` or `src/App.tsx`.

### Tasks

Every done-check also requires `npx tsc -b`, `npm run build` (exit 0) and `npx vitest run` (all green), plus screenshots at 1440x900 and 390x844 of the named routes with no horizontal scroll and no console errors (headless Chrome over DevTools on a dev server on its own port, as the audit did).

- **22.1 Shared shell and tokens.** Agent S. Effort S.
  - Files: `src/components/ui/button.tsx` (outline variant); `src/components/Layout.tsx` (`main` `pt-8 pb-16`); `src/index.css` (`.leaflet-control-attribution` 11px muted on `bg-card/90`; `.leaflet-bar a` `bg-card`, `--border` hairlines; nothing else); `Footer.tsx` and `RiskBadge.tsx` only if a decision needs them.
  - Visible result: every outline button shows a near-white fill with a hairline border; Leaflet controls match the tokens. Pages may show doubled top padding until Step 2 removes theirs.
  - Done: `/my-reports` "Reset demo data" and `/report` Step 2 "Back" read as live buttons at both widths.
- **22.2 Dashboard fold and KPI band.** Agent A. Effort M.
  - Files: `Dashboard.tsx`, `KpiCards.tsx`, `OfficialDataCard.tsx`.
  - Visible result: per the Dashboard decision; at 1440x900 the map top is at y ≤ 380 and the full rank-1 row is in the first screen.
  - Done: fold screenshot of `/` at 1440x900 confirms both; 390 keeps the 2x2 KPI grid and the full-width official cell.
- **22.3 Map framing and priority list.** Agent A. Effort M.
  - Files: `RiskMap.tsx`, `SamplingPriorityList.tsx`, `CommunityReportsFeed.tsx` and `CommunityReportItem.tsx` (spacing only, if needed).
  - Visible result: per the Map and Priority list decisions.
  - Done: screenshots of `/` on Lake Mead and Coimbra at 1440 and 390 show every marker inside the frame, both zoom buttons visible, no wrapped site names in the desktop table, the legend under the map at 390, and the Callville Bay popup still opening.
- **22.4 Site detail hero and contribution bars.** Agent B. Effort S.
  - Files: `SiteDetail.tsx`, `ContributionBars.tsx`, `RiskMeter.tsx` (only if centring needs it).
  - Visible result: per the Site detail and Contribution bars decisions; every 8.2, 8.3 and 20.6 string unchanged.
  - Done: `/site/callville-bay` at 1440 shows "79" once in the hero and values next to bar ends; at 390 label above bar, value right of bar.
- **22.5 Report flow polish.** Agent B. Effort M.
  - Files: `Report.tsx`, `BloomGuide.tsx` (spacing only).
  - Visible result: per the Report flow decision; stored option strings unchanged.
  - Done: walk `/report?site=callville-bay` Steps 1 to 3 and submit at 1440 and 390: the progress rule advances, none/some/lots sit in one row, selected choices show the tint, the page opens at its H1 in `npm run dev`, success shows 79 struck through and 81 counting with no aside at 1440.
- **22.6 Report queue and My reports.** Agent C. Effort M.
  - Files: `RangerQueue.tsx`, `MyReports.tsx`, `ReportTimeline.tsx`, `ReportStatusTag.tsx` (only if needed).
  - Visible result: per the Report queue and My reports decisions; every 21.5 and 21.6 string unchanged.
  - Done: after "Reset demo data" and one Callville submission, `/rangers` shows the separated outcome group with "Confirmed by field sample" in primary outline and a `w-fit` label; after "Request field sample" then "Confirmed by field sample", `/my-reports` shows "You got it right." with its icon and record 3 of 4.
- **22.7 OAH Cities and Methodology tidy.** Agent C. Effort S.
  - Files: `OahCities.tsx`, `CityCard.tsx`, `Methodology.tsx` (top-padding fix only).
  - Visible result: city rows without locator boxes; "Run Verdant on Coimbra" still switches region and opens `/`.
  - Done: screenshots of `/oah-cities` and `/methodology` at both widths.

### Cut order (first cut first)

1. 22.7. Trigger: not started by 17:15 PDT.
2. 22.5 progress rule and 3-up rows (keep the aside offset and the scroll fix). Trigger: 22.5 not done at 17:30 PDT.
3. 22.4 hero band (keep the badge without score and the bar values). Trigger: 22.4 not done at 17:30 PDT.
4. 22.6 My reports layout (keep the "You got it right." emphasis). Trigger: not done at 17:40 PDT.
5. 22.3 priority list restructure (keep `fitBounds` and zoom top-right). Trigger: not done at 17:45 PDT.
6. At 18:00 PDT any unfinished task's files are reverted to their last green state, never left half-styled.

Never cut: 22.1, 22.2, the map `fitBounds` and zoom position, the ranger button hierarchy.

### Verification protocol

1. After each agent returns, the orchestrator runs `npx tsc -b`, `npm run build`, `npx vitest run` and checks the agent's screenshots against its done-check.
2. At 17:40 PDT one execution-tier agent runs an `impeccable` polish pass over every route at 1440 and 390 (Section 11.9 checklist plus the decisions above), fixing only spacing, alignment and token mismatches.
3. By 18:00 PDT the orchestrator clicks "Reset demo data", reloads, and walks the full Section 13 video path at 1440x900 on the production build (`npm run build` then `npx vite preview`): dashboard fold, Callville popup, `/site/callville-bay`, Community observations, the three report steps, success 79 to 81, Report queue clicks, My reports "You got it right." with record 3 of 4, dashboard Callville at 82, One Health panel, OAH Cities to Coimbra, the Coimbra rank-1 "Export FHIR JSON", the Methodology diagram. Every exact string of Sections 8, 20 and 21 present, no console errors, no horizontal scroll at 390.

## 23. Visual direction: field notebook

**Why (user, 2026-10-04, verbatim):** "mostly, that it looks too ai if you know what i mean ... the underlying structure is fine". Direction answers already given by the user: character = field notebook; palette = pond green + ochre; typography = serif display + grotesk body (+ mono for data); detail level = strong. Second binding requirement (verbatim): "make the statistic literally the first thing they see when they open the website" (23.10). Written 16:20 PDT by the planning-tier agent from a fresh headless-Chrome audit (`ui-audit2/` in the session scratchpad): the Section 22 layout reads well, but cool grey paper + one blue + grotesk-only type + hairline boxes is the generic "clean tool" look the user rejects.

**What this section changes elsewhere:** Section 11.2 families and import line and the 11.3 hex tables were replaced in place (11.0 status line says so); Section 22's map-top target moves from y ≤ 380 to y ≤ 540 (22 Dashboard decision carries the amendment); Section 13 row 0:00-0:25 now films the StatHero on the live site. Structure, routes, behaviours, every exact string of Sections 8, 13, 20, 21, the five-column priority list and all Section 22 layout fixes stay. No new dependency, no image file, no new CSS file: everything below is Tailwind utilities, `src/index.css`, and one new component file of inline SVG.

### 23.1 Thesis

Verdant is a ranger's field notebook: warm paper, ink headings set in a sturdy serif, data written on specimen tags and stamped seals, and a few hand-drawn marks (contours, ripples, an arrow in the margin) that say people made this at the shore. Decoration lives in the margins and on labels; the data itself (tables, scores, forms, the map) stays clean, ruled and fast to read.

### 23.2 Assumptions (no user available)

- Video recorded at 1440x900 in Chrome on the production build, light theme only.
- "Strong" detail means motifs on every page, but at most two decorative motifs per viewport and never on tables, forms or body text.
- Low risk turns from green to clear-water blue (23.4); the only change in `src/lib/` is the four `color` hex values in `src/lib/risk.ts` (no test asserts them; grep confirmed 16:15 PDT).

### 23.3 Typography

- **Families:** `Young Serif` (display: H1, H2, wordmark, card titles, every big numeral: score, KPI values, StatHero numerals, record band, "You got it right."), `Schibsted Grotesk` (body, nav, buttons, table cells, form labels, badges), `DM Mono` (data labels, specimen tags, small numbers, units, timestamps, report ids, equations, axis ticks). Young Serif has one weight (400); never fake-bold it (`font-synthesis: none` on `.font-heading`).
- **Import, first line of `src/index.css`:** `@import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Schibsted+Grotesk:wght@400;500;600;700&family=Young+Serif&display=swap");`
- **`@theme inline`:** `--font-sans: "Schibsted Grotesk", ui-sans-serif, system-ui, sans-serif;` `--font-heading: "Young Serif", Georgia, serif;` `--font-mono: "DM Mono", ui-monospace, monospace;`. Numbers: `tabular-nums lining-nums`; counting numerals get a fixed `min-w-[2ch]` so the 79 to 81 count does not jitter.
- **Scale** (rem / line-height / family / tracking / use):
  - 4.5rem / 1 / Serif / -0.02em: site-detail score numeral (3rem below 768px).
  - 3.5rem / 1 / Serif / -0.02em: StatHero numerals 421, 389, 413 (2.5rem below 768px).
  - 2.5rem / 1.05 / Serif / -0.015em: page H1 (1.875rem below 768px). Dashboard H1 is 2rem (23.10 budget).
  - 1.875rem / 1.25 / Serif / -0.01em: StatHero sentence (1.375rem below 768px).
  - 1.75rem / 1.15 / Serif / -0.01em: section H2, KPI values, record-band values (2.5rem on My reports per Section 22), "You got it right." (1.5rem).
  - 1.25rem / 1.3 / Serif / 0: H3, card and popup site names, city names, wordmark "Verdant" 1.5rem.
  - 1rem / 1.55 / Sans 400: body, inputs, explanation sentence; prose max 68ch.
  - 0.875rem / 1.45 / Sans 500: table cells, nav, buttons, factor labels.
  - 0.8125rem / 1.4 / Sans 400: meta lines, leading pathway (in `--olive`), trend words.
  - 0.75rem / 1.4 / Mono 400 or 500 / +0.02em: specimen-tag labels, source lines, units, "pts", ids, timestamps. Sentence case.
  - 0.75rem / 1 / Sans 600 / +0.06em uppercase: the category word inside risk stamps only (unchanged rule).
- Headings are never set in Mono and never uppercase; Serif is never used below 1.25rem.

### 23.4 Colour tokens and contrast

Exact hexes live in the rewritten Section 11.3 tables; `src/index.css` `:root` gets every value, `@theme inline` maps each to `--color-*` (add `--color-olive`, `--color-ochre`, `--color-ochre-ink`). Summary: paper `#F2ECDD`, surface `#FAF6EC`, ink `#1E2B22`, muted ink `#5A5644`, rule `#CFC3A5`, input border `#8C8064`, muted fill `#E8DFCB`, pond green primary `#1F4D3A`, olive `#596327`, ochre `#B7791F`, ochre ink `#8A5A12`, destructive `#A3241B`. Risk: Low `#276E90` / tint `#DCEAF0` / ink `#174A66`; Moderate `#E0AE2E` / `#F6E8BC` / `#634C00`; High `#E07433` / `#F5DAC4` / `#84380A`; Very High `#A3241B` / `#F2D5CF` / `#861B14`.

Computed WCAG ratios (node script, 16:14 PDT):

| Pair | Ratio | Need |
|---|---|---|
| ink on paper / on surface | 12.51 / 13.67 | 4.5 |
| muted ink on paper / surface / muted fill | 6.25 / 6.83 / 5.56 | 4.5 |
| pond green on paper; surface text on pond green | 8.17; 8.92 | 4.5 |
| olive on paper / surface | 5.50 / 6.01 | 4.5 |
| ochre ink on paper / surface | 5.02 / 5.48 | 4.5 (never on muted fill: 4.46) |
| ochre marks on paper | 3.09 | 3 (UI only, never text) |
| input border on surface | 3.61 | 3 |
| risk ink on tint: Low / Mod / High / VH | 7.73 / 6.70 / 6.16 / 6.97 | 4.5 |
| marker number: surface on Low, ink on Mod, ink on High, surface on VH | 5.23 / 7.21 / 4.72 / 6.89 | 4.5 |
| marker outer ink ring on paper | 12.51 | 3 (carries Moderate 1.74 and High 2.65 fills) |

**How risk stays unmistakable on a green and ochre page:** (1) no risk colour equals or neighbours a brand colour: Low moved off green to blue, Moderate yellow `#E0AE2E` is lighter and cooler than ochre `#B7791F`, and ochre never fills a shape larger than a 3px stroke; (2) risk always appears as a stamp (23.6 RiskBadge) or a seal (23.7 marker), shapes no brand element uses; (3) icon + uppercase word + number, always; (4) marker diameter by category (24/28/32/36px) unchanged; (5) brand green appears only on buttons, links, bars and the recommendation rule, never on a status.

### 23.5 Texture and hand-drawn kit (no dependencies, no image files)

**Paper grain, `src/index.css` `@layer base`:** `body { background-color: var(--background); background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.29 0 0 0 0 0.18 0 0 0 0.07 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }` Grain sits only on the page background; every `bg-card` surface is flat, so no text ever sits on grain at less than its token contrast. No overlay layer, no `::after` noise above content.

**One new file, `src/components/FieldMarks.tsx`**, all inline SVG, all `aria-hidden="true"` and `focusable="false"`, `stroke="currentColor"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, `vector-effect="non-scaling-stroke"`. Irregularity comes from hand-picked cubic Béziers with 1-3px vertical drift (never random per render; paths are constants, so screenshots are stable). Colour is set by a Tailwind text class at the call site.

| Component | Props | SVG guidance | Default use |
|---|---|---|---|
| `InkRule` | `className?`, `variant?: "line" \| "wave"` | `viewBox="0 0 400 8"`, `preserveAspectRatio="none"`, height 8px, width 100%. line: `M2 4 C 90 2.5, 180 5.5, 270 3.8 S 360 4.6, 398 3.6`, stroke 1.25. wave: 6 shallow waves `M2 4 C 22 1, 44 7, 66 4 S 110 1, 132 4 ...` to 398, stroke 1.25 | Section dividers in `text-border`; footer top in `text-olive/60` (wave) |
| `InkUnderline` | `children`, `className?`, `tone?: "ochre" \| "primary"` | inline wrapper `relative inline-block`; SVG absolutely placed at `-bottom-1.5 left-0 w-full h-2`, `viewBox="0 0 100 8"`, `preserveAspectRatio="none"`, `M1 5 C 20 2.8, 45 6.4, 70 4.2 S 92 3.6, 99 4.8`, stroke 2 | StatHero numerals (ochre), active nav link (primary), site H1 none |
| `ContourField` | `className?`, `rings?: number` (default 5) | `viewBox="0 0 320 200"`; `rings` closed irregular loops around one off-centre point, each `M` + 4 cubic segments, radii growing ~18px per ring, stroke 1, opacity via class | StatHero right margin, site-detail hero band corner, OAH Cities header, all `text-olive/25` |
| `Ripple` | `className?` | `viewBox="0 0 60 60"`, three concentric slightly flattened ellipses (rx 10/18/26, ry 0.92×rx), stroke 1.25 | Report success beside "Report VR-xxxx", empty states; `text-primary/50` |
| `SpecimenTag` | `children`, `tone?: "plain" \| "official"`, `className?` | a real `<span>` with Mono 0.75rem text; shape via `clip-path: polygon(8px 0,100% 0,100% 100%,8px 100%,0 50%)` on a wrapper, `pl-4 pr-2 py-0.5`; a 4px punched hole: `before:` circle `bg-background` at left 5px centre. plain = `bg-card` + 1px `--input` outline drawn with an inline SVG of the same polygon (clip-path cuts borders); official = `bg-primary text-primary-foreground` | Replaces every data label: "Prototype demonstration data", the A3 Coimbra label, the My reports and Report queue demonstration lines, "Official data" (official tone) |
| `TapeCorner` | `className?`, `side?: "left" \| "right"` | not SVG: a 56x18px `div` `bg-ochre/25` with `mix-blend-multiply`, rotated ±38deg, jagged ends via `clip-path: polygon(0 10%,4% 0,96% 8%,100% 0,100% 90%,96% 100%,4% 92%,0 100%)`, absolutely placed over the corner of a `relative` parent | Exactly two places: StatHero top-left, My reports confirmed-outcome block top-right |
| `Annotation` | `children`, `direction?: "down" \| "left" \| "up-left"`, `className?` | inline-flex; text Sans 0.8125rem `text-ochre-ink`; arrow SVG 36x28 with one curved shaft `M4 4 C 10 18, 22 24, 32 22` plus a two-stroke head, stroke 1.5, `text-ochre` | Wraps existing strings only (never new claims): "See where to sample first" (StatHero), "Recommended first sampling target" (priority list rank-1 and site detail) |

**Stamp styles, `src/index.css` `@layer components`** (the only new classes; everything else is utilities): `.stamp { border: 1.5px solid currentColor; box-shadow: inset 0 0 0 2px var(--stamp-bg, transparent), inset 0 0 0 3px color-mix(in srgb, currentColor 35%, transparent); border-radius: 2px; }` used by RiskBadge, ReportStatusTag and the CDC source stamp. `.seal` for map markers (23.7).

**Motif map, page by page** (at most two decorative motifs per viewport): Layout = wordmark in Serif, active nav `InkUnderline` primary, footer `InkRule` wave. Dashboard = StatHero (TapeCorner, ContourField, InkUnderline ×3, stamp, Annotation), then plain data. Site detail = ContourField in the hero band's top-right corner behind the meter's empty space, Annotation on "Recommended first sampling target". Report = `InkRule` between steps' sections; success gets `Ripple` and the stamp press (23.8). Report queue = SpecimenTag only. My reports = TapeCorner on confirmed outcomes, `InkRule` between reports. OAH Cities = ContourField beside the H1. Methodology = `InkRule` between sections, nothing else.

### 23.6 Component restyling rules

- **Panels and cards** (KPI band, priority list frame, map frame, hero band, report rows, city list): `bg-card`, 1px `--border`, radius 3px, no shadow, never rotated. "Paper tag" feel comes from a 1px inner top highlight `shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]` only. Rotation (max 0.5deg, except the CDC stamp at -2deg and tape) is allowed only on decorative, non-interactive items: StatHero source stamp, TapeCorner, Annotation arrows. Never on tables, forms, buttons, badges, KPI cells, headings or any text read under time pressure.
- **Buttons** (`src/components/ui/button.tsx`): default = `bg-primary text-primary-foreground border border-[#163829] shadow-[inset_0_-2px_0_rgb(0_0_0/0.18)] hover:bg-[#245a44]`, radius 3px, Sans 600 0.875rem; active state `translate-y-px` and the inset shadow removed (a letterpress press, no animation beyond 120ms). outline = `bg-card border-input text-foreground hover:bg-muted`. ghost/link keep shadcn behaviour with `text-primary` and underline offset 3px. No `rounded-full`, no gradients, no glow.
- **Risk badge = stamp** (`RiskBadge`): `.stamp` with `bg-risk-*-tint text-risk-*-ink`, `--stamp-bg` = the tint, icon 14px stroke 1.75, score Mono 500, category word Sans 600 uppercase +0.06em. Not rotated.
- **ReportStatusTag** = `.stamp` in `text-primary` (positive outcomes) or `text-muted-foreground` (pending, not a bloom, needs info), on `bg-card`. Never risk colours.
- **Tables** (priority list, citations, ranger rows where tabular): header row `bg-muted/60`, Sans 500 0.8125rem `text-muted-foreground`, bottom border `border-b-[3px] border-double border-foreground/40` (a ledger double rule); body rows one 1px `--border` bottom rule; no zebra, no rotation, no motifs inside cells. Five-column priority list unchanged.
- **Inputs, selects, textareas, checkboxes:** `bg-card`, 1px `--input` border, radius 3px, focus `ring-2 ring-ring ring-offset-2 ring-offset-background`. Choice buttons (Section 22) selected = `bg-primary/10 border-2 border-primary`. Form surfaces stay flat and unrotated.
- **KPI band:** labels Sans 0.8125rem muted, values Serif 1.75rem; official cell keeps its 4px pond-green left rule and `SpecimenTag tone="official"`.
- **Charts (Recharts):** line stroke `--foreground` 1.75px, category bands in risk tints at 60% opacity, axis ticks DM Mono 0.75rem muted, hairline at 25/50/75 in `--border`.

### 23.7 Map treatment

- **Tiles:** keep Esri World Light Gray Canvas and attribution. In `src/index.css`: `.leaflet-tile-pane { filter: sepia(0.35) saturate(0.85) hue-rotate(-6deg) contrast(0.96) brightness(1.02); }`. The filter applies to the tile pane only, never to markers, popups or controls. Map container background `#E9E1CC` so unloaded tiles read as paper.
- **Site markers = stamped seals** (`.seal`, built in `RiskMap.tsx` `divIcon` HTML): circle sized per category, fill = risk solid, 2px `#FAF6EC` ring, 1.5px outer ink ring `box-shadow: 0 0 0 1.5px #1E2B22`, plus an inner dashed ring `outline: 1px dashed rgb(250 246 236 / 0.7); outline-offset: -5px` on 32px and 36px seals only. Number centred, DM Mono 500 12px (13px High/Very High), colours per the 11.3 table.
- **Community report pins = tag-shaped:** 16x11px, `clip-path: polygon(4px 0,100% 0,100% 100%,4px 100%,0 50%)`, `bg-primary`, a 2px surface-coloured punch hole at left; 1px ink outline via `drop-shadow(0 0 0.5px #1E2B22) drop-shadow(0 0 0.5px #1E2B22)`. The legend swatch for "Community reports" uses the same shape.
- **Popup = field-note card:** `bg-card`, 1px `--border`, radius 3px, the one shadow token, padding 12px, 240px wide; site name Serif 1.25rem; a 1px dashed `--border` rule under the name; RiskBadge stamp; leading pathway in `--olive` 0.8125rem; "View analysis" link `text-primary` with `ArrowRight`. Tip and close button restyled to these tokens.
- **Legend = hand-labelled key:** `bg-card/95`, 1px `--border`, rows separated by dashed `--border` rules, each row = mini seal (same `.seal` styling, 12px) + icon + category word Sans 500 + range DM Mono; Section 22 mobile placement unchanged.
- **Controls:** zoom buttons `bg-card`, `--input` border, ink glyphs; attribution 11px muted on `bg-card/90`.

### 23.8 Motion (the video beats only)

Allowed, all off under `prefers-reduced-motion: reduce` (final values shown instantly): (1) score count 79 to 81 over 600ms ease-out (existing); (2) Very High seal ripple: the existing `verdant-pulse` keyframe drawn as two rings, the second delayed 900ms, ring colour risk solid; (3) priority row and aside fade (existing); (4) new: a one-time stamp press on the success "Report VR-xxxx" stamp, `scale 1.12 → 1`, `opacity 0 → 1`, 220ms `cubic-bezier(0.2, 0.9, 0.3, 1.2)`; (5) hover/focus colour transitions 120ms; (6) `html { scroll-behavior: smooth }` only inside `@media (prefers-reduced-motion: no-preference)` for the StatHero anchor. Nothing else moves: no entrance reveals, no wobbling SVG, no parallax, no animated grain.

### 23.9 Accessibility and legibility guards

- Minimum sizes: body 1rem, table and UI text 0.875rem, nothing below 0.75rem except the 11px map attribution. At 1440x900 video resolution, the smallest text the video relies on (KPI captions, leading pathway) is 0.8125rem.
- Contrast per the 23.4 table; ochre is never text colour (use `--ochre-ink`); ochre-ink never on `--muted`.
- No grain over text (grain only on `body` background; every text block that is longer than a heading sits on `bg-card` or on paper at ≥ 6:1).
- No rotation on anything a viewer must read fast; the CDC stamp is the only rotated text (-2deg, 0.75rem Mono in `--ochre-ink`, 5.02:1) and it repeats a source line, not data.
- Every SVG motif is `aria-hidden`; motifs never carry meaning; risk keeps colour + icon + word + number + size.
- Focus ring 2px `--ring` with 2px offset on every interactive element, visible on paper and surface.
- Reduced motion per 23.8. Serif never below 1.25rem (Young Serif is hard to read small).

### 23.10 StatHero: the statistic first (user requirement)

- **Where:** `/` only, first element inside the Dashboard page, directly under the slim 60px header (the nav stays; a band above the nav would push the header down on every route and break the sticky shell). It renders on every load (no dismiss, no storage).
- **Exact strings:** sentence "Across the United States, 18 states reported 421 harmful algal bloom events, 389 cases of human illness and 413 cases of animal illness from 2016 to 2018." Source line "Source: CDC, MMWR 69(50), Dec 18, 2020", linking to the C1 URL `https://www.cdc.gov/mmwr/volumes/69/wr/mm6950a2.htm` (opens in a new tab, `rel="noreferrer"`). Honesty note (new copy, passes `no-ai-slop`): "National figure for 18 states. It is not a Lake Mead count." Anchor: "See where to sample first" linking to `#map` (Agent A adds `id="map"` and `scroll-mt-20` on the map row). C1 citation row in Section 19.2 is unchanged.
- **Component:** new `src/components/StatHero.tsx` (Agent A), a `<section aria-labelledby>` with the sentence as a `<p>` (the heading is a visually hidden H2 "Harmful algal blooms in the United States"; the page H1 stays "Where to sample first at Lake Mead").
- **Look @1440:** one `bg-card` sheet, 1px `--border`, radius 3px, `relative`, padding 24px 32px, height ≤ 232px. 12-col grid: sentence `col-span-9` in Serif 1.875rem / 1.25 ink, max 3 lines; the three numbers are `<span>`s inside the same sentence set at 3.5rem / 1 in `text-primary` with `InkUnderline tone="ochre"`, so the numerals read as oversized ink figures without repeating the sentence. Right `col-span-3`, bottom-aligned: the source stamp (`.stamp`, `text-ochre-ink`, `bg-card`, DM Mono 0.75rem, padding 6px 10px, `-rotate-2`), under it the honesty note Sans 0.8125rem muted, under it `Annotation direction="down"` wrapping the "See where to sample first" link. `ContourField` `text-olive/25` absolutely placed in the right 30% behind the stamp column (never under the sentence). `TapeCorner side="left"` on the top-left corner.
- **Look @390:** padding 20px 16px; sentence 1.375rem, numerals 2.5rem; the right column stacks below the sentence (stamp, note, anchor); ContourField hidden below 768px; the whole block fits in the first viewport (≤ 520px tall).
- **Fold budget @1440x900 (what moves):** header 60 + main top padding 24 (Dashboard uses `-mt-2` on the first block so Layout's `pt-8` nets 24) + StatHero 232 + gap 24 + title row 48 + gap 12 + KPI band 112 + gap 16 = map top at about y 528. The title block collapses to one row: H1 Serif 2rem, the subtitle "Scores combine satellite signals, environmental data and shore reports." 0.875rem muted on the same baseline at ≥ 1280px (beneath it below 1280px), the "Prototype demonstration data" SpecimenTag right-aligned in the same row. KPI band padding 12px 16px, values 1.75rem, band ≤ 112px. Map stays `col-span-7`, 620px tall; at 1440x900 about 370px of map shows above the fold, and the StatHero anchor scrolls the map row to the top.

### 23.11 Anti-patterns rejected (costume and slop)

1. Faux leather, kraft-paper photos, coffee stains, burnt edges → one flat warm paper tone plus 7% SVG grain.
2. Tape on every card → tape in exactly two places (StatHero, confirmed outcomes).
3. Handwriting font (Caveat, Kalam, Patrick Hand) anywhere → hand feel comes only from SVG strokes; all text is Young Serif, Schibsted Grotesk or DM Mono.
4. Rotated cards and tilted tables ("scrapbook") → rotation only on three decorative item types, max 0.5deg except the -2deg stamp.
5. Emoji or leaf/water clip-art icons → lucide icons at stroke 1.75 and the seven SVG marks in 23.5; zero emoji.
6. Purple or blue gradients, glassmorphism, glows → flat fills; zero gradients except the SVG grain.
7. Centered SaaS hero with a big CTA → the StatHero is a left-aligned specimen sheet with the data inline and a small margin anchor, no button.
8. Generic rounded cards with shadows on a grid → ruled panels, 3px radius, no shadow, divided strips.
9. Green-on-green status (brand green as "Low") → Low is blue; brand green never marks a status.
10. Ochre used as text or as large fills (reads as a warning) → ochre is a 1.5-2px mark colour only; text uses `--ochre-ink`.
11. Lined notebook paper, red margin rules, spiral binding graphics → no ruled page background; ruling only inside tables.
12. Decorative motifs that encode nothing but sit on data (contours under a table, ripples on chart) → motifs live in margins, headers and the StatHero only.
13. Typewriter mono for body copy → DM Mono only for labels and numbers ≤ 0.875rem.
14. Em dashes and en dashes in UI copy, invented statistics → unchanged bans; the only new copy is the honesty note, the visually hidden H2 and existing strings.

### 23.12 Order, agents and file ownership

Every agent: `model: "sonnet"`, follows Sections 11, 22 and 23 (23 wins on conflict), names `impeccable` for its pass, applies the `ponytail` ladder, reads graphify-first, runs `no-ai-slop` on new user-facing text (only the 23.10 honesty note and hidden H2), keeps every exact string of Sections 8, 13, 20 and 21 verbatim, adds no dependency, no image and no CSS file, appends its `PROGRESS.md` entry, puts no AI attribution in commits (the orchestrator commits). TDD does not apply (visual work). Done-check for every task: `npx tsc -b`, `npm run build` (exit 0), `npx vitest run` (all 71 green), screenshots at 1440x900 and 390x844 of the named routes over headless Chrome on the agent's own dev-server port, no horizontal scroll, no console errors.

- **Step 1, Agent S alone (start by 16:30, done by 17:00 PDT), Task 23.1. Effort M.** Commit subject starts "Field notebook base:".
  - Files (only Agent S edits these, now and in Step 2): `src/index.css`, `src/components/FieldMarks.tsx` (new), `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/textarea.tsx`, `src/components/ui/select.tsx`, `src/components/ui/checkbox.tsx`, `src/components/RiskBadge.tsx`, `src/components/Layout.tsx`, `src/components/Footer.tsx`, `src/lib/risk.ts` (the four `color` hex values only).
  - Does: fonts and import (23.3); all tokens (11.3 tables, 23.4) in `:root` and `@theme inline`; grain (23.5); `.stamp` and `.seal` classes; Leaflet tile filter, container background, controls, popup and attribution styles (23.7) in `src/index.css`; the seven FieldMarks components exactly as specified; button, input, select, checkbox, textarea base styles (23.6); RiskBadge as stamp; Layout wordmark in Serif, active nav `InkUnderline`, header `bg-card/95` with 1px `--border`; Footer `InkRule` wave and `SpecimenTag` for its data label; `verdant-pulse` second ring and the stamp-press keyframe `verdant-stamp`.
  - Visible result: every route shows warm paper, serif headings, stamped risk badges, pond-green buttons and sepia-warmed map tiles; page bodies are otherwise unchanged.
  - Done: the shared done-check on `/`, `/site/callville-bay`, `/report`; plus a grep showing no `#F3F5F4`, `#174C6B`, `IBM Plex`, `slate-`, `gray-`, `zinc-` left in `src/`.
- **Step 2, three agents in parallel after Step 1 lands (17:00 to 17:55 PDT)**, file ownership as in Section 22 plus the new StatHero:

| Agent | Tasks | Owns |
|---|---|---|
| A | 23.2, 23.3 | `src/pages/Dashboard.tsx`, `src/components/StatHero.tsx` (new), `src/components/KpiCards.tsx`, `src/components/OfficialDataCard.tsx`, `src/components/RiskMap.tsx`, `src/components/SamplingPriorityList.tsx`, `src/components/CommunityReportsFeed.tsx`, `src/components/CommunityReportItem.tsx` |
| B | 23.5, 23.5b, then 23.4 (report flow first: the user asked for it explicitly) | `src/pages/SiteDetail.tsx`, `src/components/ContributionBars.tsx`, `src/components/RiskMeter.tsx`, `src/components/TrendChart.tsx`, `src/components/OneHealthPanel.tsx`, `src/pages/Report.tsx`, `src/components/BloomGuide.tsx` |
| C | 23.6, 23.7 | `src/pages/RangerQueue.tsx`, `src/pages/MyReports.tsx`, `src/components/ReportTimeline.tsx`, `src/components/ReportStatusTag.tsx`, `src/pages/OahCities.tsx`, `src/components/CityCard.tsx`, `src/pages/Methodology.tsx`, `src/components/CitationsTable.tsx`, `src/components/ArchitectureDiagram.tsx` |

No Section 23 task edits `src/engine/`, `src/data/`, `src/state/`, `src/fhir/`, `src/types.ts`, `src/App.tsx`, or `src/lib/` beyond Agent S's four hex values. FieldMarks is consumed, never edited, in Step 2; a missing prop is reported to the orchestrator, not patched.

### 23.13 Tasks

- **23.2 StatHero and dashboard fold.** Agent A. Effort M. Files: `StatHero.tsx` (new), `Dashboard.tsx`, `KpiCards.tsx`, `OfficialDataCard.tsx`.
  - Visible result: per 23.10. At 1440x900 the first screen shows, top to bottom, header, StatHero (sentence with 421/389/413 as oversized pond-green serif numerals with ochre underlines, the rotated CDC stamp, the honesty note, the "See where to sample first" annotation), the one-row title, the KPI band, the top of the map at y ≤ 540. KPI values Serif; data labels as SpecimenTags; official cell keeps "Official data" (official tone).
  - Done: fold screenshots at 1440x900 and 390x844 where the statistic is the first content under the header and fully visible; clicking the anchor brings the map row to the top; the exact sentence and source line match 23.10 character for character (check with `document.body.innerText.includes(...)`); the shared done-check.
- **23.3 Map, priority list, feed.** Agent A. Effort M. Files: `RiskMap.tsx`, `SamplingPriorityList.tsx`, `CommunityReportsFeed.tsx`, `CommunityReportItem.tsx`.
  - Visible result: per 23.7 (seals, tag pins, legend key, popup card; marker HTML uses tokens, no `#FBFCFB`); priority list as a ledger table (23.6), five columns unchanged, rank numerals Serif 1.25rem muted, rank-1 row keeps its rule and "Verdant recommendation" block with `Annotation` on "Recommended first sampling target"; feed items on `bg-card` with `InkRule` separators.
  - Done: screenshots of `/` Lake Mead and Coimbra at both widths, Callville Bay popup open, Very High seal pulsing with two rings, no wrapped site names at 1440; shared done-check.
- **23.4 Site detail.** Agent B. Effort M. Files: `SiteDetail.tsx`, `ContributionBars.tsx`, `RiskMeter.tsx`, `TrendChart.tsx`, `OneHealthPanel.tsx`.
  - Visible result: H1 Serif, score numeral 4.5rem Serif beside the stamp badge (no repeated score, Section 22), ContourField in the hero's top-right corner, `Annotation` on "Recommended first sampling target", risk meter segments in the new tints/solids with a 2px ink pointer, contribution bars `bg-primary` with Mono values at bar ends, chart per 23.6, pathway strip and One Health columns with Serif H3s and `InkRule` between sections.
  - Done: `/site/callville-bay` and the Coimbra rank-1 site at both widths; "Export FHIR JSON" still downloads; shared done-check.
- **23.5 Report flow.** Agent B. Effort M. Files: `Report.tsx`, `BloomGuide.tsx`.
  - Visible result: step progress rule in pond green; choice buttons per 23.6; guide cards `bg-card` with Serif titles; warning `Alert` on `bg-muted` with ink text; success shows 79 struck through and 81 counting in Serif, "Report VR-xxxx" as a stamp with the `verdant-stamp` press and a `Ripple` beside it.
  - Done: walk Steps 1 to 3 and submit at both widths; reduced-motion emulation shows 81 instantly and no stamp animation; shared done-check.
- **23.5b Report flow usability overhaul.** Agent B, right after 23.5 (same files, so same agent, sequential). Effort M. Files: `Report.tsx`, `BloomGuide.tsx`; `src/data/reportFields.ts` read-only (a separate agent made "Does the water look or smell unusual?" multi-select with "Normal" mutually exclusive before this section; that behaviour is assumed and kept).
  - **Why (user, verbatim, on the Step 2 water question):** "this should be a multiple choice" and "it also doesn't look very user friendly, at least in its current form". The 16:15 PDT audit at 390x844 confirms it: Step 2 is one 3,100px scroll with 15 full-width identical grey bars, the guide as a single-column list of seven rows, and Next/Back at the very bottom.
  - **Judge as:** a first-time visitor on a phone at the shore, one thumb. The three steps, "Step {n} of 3", every question's wording, the stored option values, the warning above submit, the success sentence, the "Is it a bloom?" guide content and every behaviour and test stay.
  - **Grouping (Step 2):** three clearly separated groups on `bg-card` sheets with a Serif 1.25rem group title and an `InkRule` between them: (a) "Add a photo" as a 64px-tall dashed-border drop tile with the camera icon and the existing "Photo stays on your device" line, visibly optional ("Optional" Mono tag beside it); (b) "Which matches what you see?" with the guide directly above the three choices; the guide renders as a 2-column grid of drawing tiles at 390 (4 columns at 1024+), captions 0.8125rem, the "Looks like a bloom" and "Often mistaken for one" group labels as SpecimenTags; (c) the slime, unusual water and animals questions; "More questions (optional)" stays collapsed.
  - **Instruction line under every question:** 0.8125rem muted, "Pick one" for single-select, "Pick all that apply" for multi-select (new copy, two strings, `no-ai-slop` pass). Every question except the Step 1 site is optional; leaving one unanswered is the skip, so no new stored option is added. Where an option set already contains "Not sure" it stays last.
  - **Tiles:** single-select = radio tiles (circle indicator 20px left, ring `--input`, checked = filled pond-green dot inside a pond-green ring, tile `border-2 border-primary bg-primary/10`); multi-select = checkbox tiles (rounded-square 20px indicator, checked = pond-green fill with a white `Check` icon, same tile tint). The indicator shapes differ so the two kinds read apart without words. Min height 48px, full-width hit area, 0.9375rem Sans 500 label, first letter capitalised (Section 22), no helper text inside tiles. Short option sets (≤ 3 words each, ≤ 4 options) sit in a 2- or 3-column grid at 390; longer ones one per row. Where a tile maps to a guide drawing ("Looks like a bloom", "Looks like a look-alike") show a 28px thumbnail of the existing `BloomGuide` drawing at its left; no new illustrations beyond the FieldMarks kit.
  - **Sticky action bar (below 1024px):** fixed bottom, `bg-card/95` with a 1px top `--border` and `pb-[env(safe-area-inset-bottom)]`, height 64px: "Back" (outline, hidden on Step 1) left, the 3-segment progress rule with "Step {n} of 3" centre (Mono 0.75rem), "Next" (primary, min-width 120px) right; on Step 3 the right button is "Submit report". The page gets `pb-24` so the bar never covers content. At 1024px and up the bar is a normal inline row under the form (the Section 22 aside stays).
  - **Validation:** only where a value is required today; the message sits under the question in `--destructive` 0.875rem in plain words saying what to do (for example "Choose the place you are reporting from."), focus moves to that question, nothing is cleared.
  - **Step 3 review:** a short summary sheet: site name Serif, the chosen answers as a comma list (0.9375rem), the photo thumbnail if any, an "Edit" text link per group returning to Step 2 with answers kept; then the warning `Alert` and "Submit report". Success keeps 23.5 (struck 79, counting 81, stamped id, `Ripple`).
  - **Visible result:** at 390x844, Step 2 is three compact groups, radio and checkbox tiles look different, the bar with Back, "Step 2 of 3" and Next stays at the bottom while scrolling.
  - **Done:** screenshots at 390x844 of Step 1, Step 2 (top, and scrolled to the water questions with two water options checked), Step 3 review, and success; plus 1440x900 of Step 2. A timed walk on `/report?site=callville-bay` in headless Chrome (a script clicking with 1.5s human pauses) completes the Callville Bay report in 5 taps (Next, "Looks like a bloom", "Lots", Next, "Submit report") and under 20 seconds, ending on the 79 to 81 success; selecting "Normal" clears the other water options and vice versa; the shared done-check (all tests green).
- **23.6 Report queue and My reports.** Agent C. Effort M. Files: `RangerQueue.tsx`, `MyReports.tsx`, `ReportTimeline.tsx`, `ReportStatusTag.tsx`.
  - Visible result: demonstration lines as SpecimenTags; status tags as stamps; Section 22 button groups kept ("Confirmed by field sample" outline in `border-primary text-primary`); My reports record band values Serif 2.5rem, "You got it right." Serif 1.5rem with `CircleCheck`, confirmed block `bg-primary/5` with one `TapeCorner side="right"`; `InkRule` between reports; timeline icons in `--olive`.
  - Done: after "Reset demo data" and one Callville submission, the ranger clicks work and `/my-reports` shows "You got it right." and record 3 of 4; shared done-check.
- **23.7 OAH Cities and Methodology.** Agent C. Effort S. Files: `OahCities.tsx`, `CityCard.tsx`, `Methodology.tsx`, `CitationsTable.tsx`, `ArchitectureDiagram.tsx`.
  - Visible result: city names Serif 1.25rem, data-status labels as SpecimenTags, ContourField beside the OAH H1; Methodology H2s Serif, `InkRule` between sections, equations on `bg-muted` in DM Mono, citations as a ledger table, diagram strokes ink and arrows pond green, nodes `bg-card`.
  - Done: both routes at both widths; "Run Verdant on Coimbra" still switches region and opens `/`; shared done-check.
- **23.8 `impeccable` polish and video-path check.** One execution-tier agent, 17:55 to 18:15 PDT, after Step 2. Effort S. Runs the `impeccable` polish pass over every route at 1440x900 and 390x844 against 23.6, 23.9 and 23.11 and the Section 11.9 checklist (font and colour items read per 23.3 and 23.4), fixing only spacing, alignment and token mismatches in the files it is pointed at, no new motifs. Then on the production build (`npm run build`, `npx vite preview`) it clicks "Reset demo data", reloads, and walks the Section 13 video path: StatHero first frame and anchor, map and Callville popup, priority list, `/site/callville-bay`, Community observations, the three report steps, 79 to 81, Report queue clicks, "You got it right." with record 3 of 4, dashboard Callville at 82, One Health, OAH Cities to Coimbra, Coimbra rank-1 "Export FHIR JSON", Methodology diagram; every exact string present, no console errors, no horizontal scroll at 390.

### 23.14 Cut order and clock triggers

Video priority of pages (what to protect first): 1. Dashboard with StatHero and map (0:00-1:05); 2. Site detail (1:05-1:30, 2:55-3:05); 3. Report flow (1:30-2:20); 4. Report queue and My reports (2:20-2:55, 4:05-4:30); 5. OAH Cities (3:05-3:35); 6. Methodology (3:45-4:05).

Cuts, first cut first:
1. 23.7 motifs (keep tokens, which arrive with 23.1). Trigger: 23.7 not started by 17:25 PDT.
2. Annotation and TapeCorner everywhere except the StatHero. Trigger: any Step 2 agent not done at 17:40 PDT.
3. The `verdant-stamp` press and the success `Ripple`. Trigger: 23.5 not done at 17:40 PDT.
4. Site-detail ContourField and OneHealthPanel styling (keep the Serif numeral and the stamp badge). Trigger: 23.4 not done at 17:45 PDT.
4b. From 23.5b: the guide thumbnails on tiles and the Step 3 "Edit" links (keep the grouping, the instruction lines, the radio/checkbox tile shapes and the sticky bar). Trigger: 23.5b not done at 17:50 PDT.
5. Popup and legend restyle (keep tile filter, seals and tag pins). Trigger: 23.3 not done at 17:50 PDT.
6. 23.8 polish shrinks to the video-path walk only. Trigger: Step 2 not merged by 18:00 PDT.
7. At 18:15 PDT every unfinished task's files revert to the last green commit (`git checkout <sha> -- <files>`), never left half-styled; the video records from that state at 19:15.

Never cut: 23.1 base, 23.2 StatHero and the fold, the 23.5b grouping, tile shapes, instruction lines and sticky bar, the tile filter and seals, the RiskBadge stamp, the Section 22 layout fixes. If 23.1 itself is not green by 17:15 PDT, the orchestrator reverts it and the StatHero (23.2) is built alone on the old tokens with Young Serif added, since the user's statistic requirement outranks the restyle.

## 24. Satellite map, "more cities" signal, language switcher (EN / PT / ES)

**Why (user, 2026-10-04, verbatim):** "the website is practically perfect, but this map could be better as a themed satellite map. also, clearly specify a clear intention to add extra cities in the header. lastly, to the right of that add a language change option with flags". Question round answered "for all changes, just whatever you recommend" (23:5x UTC), so every recommendation below is the agreed design. Written 2026-10-04 23:51 +00:00 by a planning-tier agent; graphify is not installed in this repo, so the reads behind this section were targeted bash reads (stated per AGENTS.md).

**What stays:** Section 23 field notebook (tokens, type, stamps, seals, tag pins, FieldMarks), every route and behaviour, and every English string byte-identical (existing tests asserting English labels stay unchanged and green). No new dependency, no new CSS file: `src/index.css` is the only stylesheet touched. Section 23's cut-list line "keep tile filter" now means the 24.2 filter.

### 24.1 Decisions (all agreed)

1. **Languages:** English (`en`, US flag), Português (`pt`, pt-PT, Portugal flag), Español (`es`, Spain flag, civil version without arms). Flags are inline SVG (Windows does not render flag emoji) and always sit next to a DM Mono code `EN` / `PT` / `ES`; the menu shows endonyms ("English", "Português", "Español"), never translated.
2. **Scope translated:** header, nav, mobile sheet, footer; the Dashboard (StatHero, KPIs, OfficialDataCard, sampling list, community feed, Coimbra satellite chart, map toggle, legend, popups); Site detail including the engine explanation sentence, pathway labels and risk words; the Report a Bloom form and BloomGuide. Shared atoms (risk category words, report status tags, report data tags, report time format) are translated wherever they render.
3. **Scope left in English:** Methodology, OAH Cities, Report queue, My reports, the citations table. In PT/ES each shows one mono line at the top: PT "Esta página só está disponível em inglês." / ES "Esta página solo está disponible en inglés." Shared atoms on those pages may appear translated; that is accepted.
4. **Never translated:** site, lake and city names; the wordmark "Verdant"; "OneAquaHealth", "OAH", "CDC", "FHIR"; data values, including `observationTypes` text inside reports; numbers and units.
5. **Translation accuracy:** PT/ES text is drafted by the implementers against the 24.4 glossary (binding) and is marked "pending native-speaker review" in the 24.9 PROGRESS end entry. pt-PT, not pt-BR (e.g. "agentes patogénicos", "ecrã", "relato"). Spanish uses tú; Portuguese uses the impersonal/você-implicit imperative ("Relate o que vê").
6. **Language state:** stored in localStorage key `verdant.lang` (every access in try/catch). First visit: the first entry of `navigator.languages` whose primary subtag is `en`, `pt` or `es`; else `en`. Language and region are independent (choosing Coimbra does not switch language). `document.documentElement.lang` follows the language (`en`, `pt-PT`, `es`).
7. **Satellite map replaces the gray map** (no Map/Satellite toggle).
8. **"More cities" signal:** a third, dashed segment at the end of the region switch, "More cities soon" with a lucide `Plus` icon, linking to `/oah-cities`. Language switcher immediately to its right.

### 24.2 Design direction: themed satellite map (`impeccable` builds from this; nothing reinterpreted)

- **Base imagery:** `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`, `maxZoom={16}` kept. No API key.
- **Labels:** second `TileLayer` `https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}` inside a react-leaflet `<Pane name="labels" style={{ zIndex: 350 }}>` (above tiles 200, below overlays 400 and markers 600), so the tile filter never touches the labels. `.leaflet-labels-pane { opacity: 0.9; }` in `src/index.css`.
- **Attribution (exact):** `Imagery &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community; labels &copy; Esri`. The attribution control styling stays as is.
- **Notebook theming, `src/index.css`:** replace the `.leaflet-tile-pane` filter with `filter: saturate(0.55) sepia(0.28) hue-rotate(-8deg) contrast(1.05) brightness(0.92);`. Intent: water reads deep teal-olive, desert and town read warm ochre-grey, no saturated sea blue or vegetation green anywhere, so risk colour stays the only saturated thing on screen (23.4 rule). The implementer may tune each value by at most ±0.1 against a screenshot of both regions and records the final values in the end entry. `.leaflet-container` background `#e9e1cc` → `#26332a` and the map wrapper's `bg-muted` → `bg-[#26332a]`, so loading tiles never flash cream over dark imagery.
- **Marker contrast on imagery:** `.seal` keeps its 2px surface border and 1.5px ink ring (the surface border carries it on dark water, the ink ring on pale sand) and gains a soft lift: `box-shadow: 0 0 0 1.5px var(--foreground), 0 1px 6px rgb(0 0 0 / 0.45);`. Tag pins (`pinIcon` in `RiskMap.tsx`) append `drop-shadow(0 1px 3px rgb(0 0 0 / 0.5))` to their existing filter. Marker number contrasts in 23.4 are unchanged (they sit inside the seal fill).
- **Overlays stay solid paper:** the legend's `md:bg-card/95` → `md:bg-card` with `md:border-input`; the Community reports toggle (already `bg-card`) and popups unchanged. No glass, blur or gradient anywhere.
- **Anti-slop check:** no vignette, no gradient wash, no glowing markers, no dark-mode "mission control" look. The page around the map stays paper; only the map window is imagery, like a photo pasted into the notebook.

### 24.3 Design direction: header at every width

Order left to right: [menu button <xl] [Verdant] [nav ≥xl] … `ml-auto` … [CTA] [RegionSwitch: Lake Mead | Coimbra | ┆+ More cities soon┆] [LanguageSwitch].

- **More-cities segment:** inside the same bordered group as the region buttons, separated by a `border-l border-dashed border-input`; `text-muted-foreground`, hover `bg-muted text-foreground`; `text-foreground` when the route is `/oah-cities`. It is a `Link` (not `aria-pressed`). `title` = "Next: Benevento, Ghent, Oslo, Toulouse", names taken from `siteConfigs` entries with `dataStatus === "config-only"`, never hardcoded. Label by width: ≥xl full ("More cities soon" / "Mais cidades em breve" / "Más ciudades pronto"); md to xl short ("More cities" / "Mais cidades" / "Más ciudades"); <md hidden from the header and shown instead as the first block of the mobile Sheet, under `SheetTitle`: a dashed-border link with the full label and a mono `text-xs` line listing the four cities.
- **LanguageSwitch:** built on the existing `src/components/ui/select.tsx` (base-ui Select; no new component pulled unless that primitive cannot render custom trigger content, in which case pull shadcn `dropdown-menu`, point 4). Trigger `h-8 rounded-sm border border-border bg-card px-2`, flag 20×14 + mono code + `ChevronDown size-3.5`; <md the code is `sr-only` (flag + chevron only). Accessible name "Language: English" / "Idioma: Português" / "Idioma: Español". Items: flag, endonym in Sans, mono code right-aligned, check on the current one. Popup restyled to tokens (paper surface, `border-input`, `rounded-sm`, no default shadcn shadow).
- **Flags (`src/components/Flags.tsx`, inline SVG, `viewBox="0 0 20 14"`, `aria-hidden`, `focusable="false"`, rendered 20×14 with `rounded-[1px]` and a `ring-1 ring-foreground/25` hairline):** US: 7 red `#B31942` stripes on white (13 equal bands), canton 8×7.5 `#0A3161` with a 3×4 grid of white dots r=0.45 (simplified stars, legible at 20px). PT: green `#046A38` x 0-8, red `#DA291C` x 8-20; at (8,7) a `#FFE900` ring r=2.6 stroke 0.9, centred white shield 2.2×2.6 with a red 1.4×1.8 inner rect. ES: red `#AA151B` 0-3.5, yellow `#F1BF00` 3.5-10.5, red 10.5-14.
- **Width budget at 1440 (content 1312px) and 1280:** in EN the current header plus the new pieces overflows by about 100px, so: (a) below `2xl` (1536px) the "Report what you see" CTA renders icon-only (`size-9`, `aria-label` and `title` = the full label; nav already holds "Report a Bloom"); (b) nav gap `xl:gap-6` → `xl:gap-5`; (c) all header controls `whitespace-nowrap`. If PT or ES still overflows at 1280 after (a) to (c), the shortened nav labels in the glossary already apply; if it still overflows, the more-cities segment uses its short label up to `2xl`. Never wrap to two rows, never hide the language switcher.
- **390px (and 360px):** [menu 40] [Verdant] [Lake Mead | Coimbra with `px-2.5`] [flag ▾]; gaps `gap-2`. CTA stays `hidden md:inline-flex` as today.
- **Done when**, in all three languages at 360, 390, 768, 1024, 1280 and 1440 px: `document.documentElement.scrollWidth === window.innerWidth`, the header is one 60px row, and no header label wraps.

### 24.4 Glossary (binding for every PT/ES string)

| EN | PT (pt-PT) | ES |
|---|---|---|
| Dashboard | Painel | Panel |
| Report a Bloom | Relatar floração | Avisar de floración |
| My reports | Os meus relatos | Mis avisos |
| Report queue | Fila de relatos | Cola de avisos |
| OAH Cities | Cidades OAH | Ciudades OAH |
| Methodology | Metodologia | Metodología |
| Report what you see | Relate o que vê | Cuenta lo que ves |
| Community report | Relato da comunidade | Aviso ciudadano |
| Region / Language | Região / Idioma | Región / Idioma |
| More cities soon | Mais cidades em breve | Más ciudades pronto |
| Risk | Risco | Riesgo |
| Low / Moderate / High / Very High | Baixo / Moderado / Alto / Muito alto | Bajo / Moderado / Alto / Muy alto |
| Leading pathway | Via dominante | Vía dominante |
| View analysis / View site | Ver análise / Ver local | Ver análisis / Ver sitio |
| Algal bloom | Floração de algas | Floración de algas |
| Waterborne pathogen | Agentes patogénicos na água | Patógenos en el agua |
| Heat and low water | Calor e nível de água baixo | Calor y nivel bajo del agua |
| Ecosystem stress | Stress do ecossistema | Estrés del ecosistema |
| bloom (algal) | floração | floración |
| sample / sampling | amostra / amostragem | muestra / muestreo |
| ranger | guarda | guardabosques |

Risk words inside uppercase stamps (`MUITO ALTO`, `MUY ALTO`) must fit the stamp without wrapping; the RiskBadge may grow in width, never in height.

### 24.5 i18n mechanism (24.T1 builds it)

- `src/i18n/lang.ts`: `LANGS = ["en", "pt", "es"] as const`, `type Lang`; `HTML_LANG` (`en`, `pt-PT`, `es`), `LOCALE` for Intl (`en-US`, `pt-PT`, `es-ES`), `LANG_NAME` endonyms, `LANG_CODE` (`EN`/`PT`/`ES`); `pickLang(stored: string | null, browser: readonly string[]): Lang`; `loadLang(storage?)` / `saveLang(lang, storage?)` following the `defaultStorage()` pattern in `src/lib/reportLoop.ts`, never throwing; `fmt(template, vars)` replacing `{name}` placeholders (unknown placeholders left as-is); `defineStrings<T extends Record<string, string>>(d: { en: T; pt: Record<keyof T, string>; es: Record<keyof T, string> })` so a missing or extra PT/ES key fails `tsc`.
- `src/state/LanguageContext.tsx`: `LanguageProvider` (initial state `pickLang(loadLang(), navigator.languages ?? [navigator.language])`; effect saves and sets `document.documentElement.lang`), `useLang(): { lang, setLang }`, `useStrings(dict)` returning `dict[lang]`. Mounted in `src/App.tsx` outside `RegionProvider`.
- One dictionary file per area, so parallel tasks never edit the same file: `src/i18n/common.ts` (T1), `src/i18n/shared.ts` (T4), `src/i18n/dashboard.ts` (T5), `src/i18n/siteDetail.ts` (T6), `src/i18n/report.ts` (T7). Components read `const s = useStrings(DASHBOARD)`, then `s.title` and `fmt(s.reportsCount, { n })`. The English values are moved verbatim from the JSX.
- Pure logic takes `lang: Lang = "en"` as its last parameter, so existing callers and tests stay unchanged.

### 24.6 Task list

**Rules for every task:** the execution tier implements it (`model: "sonnet"`) through `superpowers:subagent-driven-development`; the brief carries the AGENTS.md point 10 checklist: the `ponytail` ladder, graphify-first reading (or a stated fallback while graphify is missing), `impeccable` plus this section for visual work, `no-ai-slop` once on new English copy, conventional commits with no AI trailer. The orchestrator writes the PROGRESS.md entries. **TDD applies to T1 and T4.** Visual tasks are verified with `npm run dev` in a browser at the 24.3 widths. Every task finishes with `npx tsc --noEmit && npx vitest run && npm run build` all exiting 0.

**Waves** (no file is owned by two tasks in the same wave): Wave 1 = T1, T2. Wave 2 (after T1) = T3, T4, T8. Wave 3 (after T4; T5 also after T2) = T5, T6, T7. Wave 4 = T9.

- **24.T1 i18n core.** Depends: none.
  - Files: `src/i18n/lang.ts`, `src/i18n/lang.test.ts`, `src/i18n/common.ts`, `src/state/LanguageContext.tsx`, `src/App.tsx`.
  - `common.ts` holds every header, nav, sheet, footer (DISCLAIMER and the four `dataLabel` strings), more-cities (full, short, "Next: {cities}"), language-switch and English-only-note string, in all three languages, per the glossary.
  - Tests (`lang.test.ts`):
    - `pickLang`: a valid stored value wins; an invalid stored value is ignored; `["pt-BR"]` → pt; `["fr", "es-MX"]` → es; `["en-GB", "pt"]` → en; `[]` → en.
    - `fmt`: replaces a placeholder, replaces a repeated one, keeps an unknown placeholder.
    - `loadLang`/`saveLang`: round-trip with a fake storage; a storage whose methods throw makes `loadLang` return null and `saveLang` not throw; an undefined storage is safe.
  - Done: the tests pass; the app renders unchanged in EN.
- **24.T2 Themed satellite map.** Depends: none.
  - Files: `src/components/RiskMap.tsx` (tile layers, Pane, ATTRIBUTION, wrapper background, `pinIcon` filter, legend background only), `src/index.css` (tile filter, labels pane, container background, `.seal` shadow).
  - Run `impeccable` against 24.2.
  - Done: both regions show themed imagery with labels; markers, pins, legend, toggle and popups are legible on water and on land; attribution reads exactly as in 24.2; screenshots at 1440 and 390 are attached to the report.
- **24.T3 Header: more cities, language switch, translated chrome.** Depends: T1.
  - Files: `src/components/RegionSwitch.tsx`, `src/components/LanguageSwitch.tsx` (new), `src/components/Flags.tsx` (new), `src/components/Layout.tsx`, `src/components/Footer.tsx`, `src/components/ui/select.tsx` (only if needed).
  - Run `impeccable` against 24.3.
  - Done: the 24.3 "Done when" holds; switching language updates the header, sheet and footer, persists across a reload, and sets `<html lang>`.
- **24.T4 Shared atoms and the engine sentence.** Depends: T1.
  - Files: `src/i18n/shared.ts`, `src/engine/explain.ts`, `src/engine/explain.test.ts` (new), `src/lib/communityReports.ts`, `src/lib/communityReports.test.ts`, `src/components/RiskBadge.tsx`, `src/components/ReportStatusTag.tsx`, `src/components/ReportTimeline.tsx`, `src/components/CommunityReportItem.tsx`.
  - `shared.ts` holds the risk words, status labels and next-step labels (en values imported from the existing `STATUS_LABEL` / `NEXT_STEP_LABEL`, so `reportLoop.ts` stays untouched), plus the report data-tag labels.
  - `explain(result, lang = "en")`, with per-language PHRASE tables and a sentence template, and an exported `PATHWAY_LABEL: Record<Lang, Record<PathwayId, string>>` (en from `PATHWAYS`, PT/ES from the glossary). Templates:
    - EN: unchanged.
    - PT: `O risco está elevado sobretudo devido a condições de {pathway}: {a} e {b}.`
    - ES: `El riesgo es elevado sobre todo por condiciones de {pathway}: {a} y {b}.` (use "e" instead of "y" before a word starting with an "i" sound).
  - Factor phrases:
    - PT: um sinal forte de clorofila / água quente / vento fraco / observações de cidadãos / época de floração / escorrência intensa / elevada exposição recreativa / temperatura do ar elevada / nível de água baixo / uma leitura laboratorial elevada de agentes patogénicos / um nível de contaminação elevado / um índice de saúde do ecossistema fraco.
    - ES: una señal fuerte de clorofila / agua cálida / viento en calma / observaciones ciudadanas / la temporada de floraciones / escorrentía intensa / alta exposición recreativa / temperatura del aire alta / nivel bajo del agua / una lectura alta de patógenos en laboratorio / un nivel alto de contaminación / una puntuación baja de salud del ecosistema.
  - `formatReportTime(iso, lang = "en")` uses `LOCALE[lang]`, same options and time zone. `reportSummary(report, lang = "en")` changes only the "No details given" fallback. `REPORT_TAG_LABEL` stays (its tests stay); the localized map lives in `shared.ts`.
  - Tests:
    - `explain.test.ts`: the EN output equals the current output for a fixture result; PT and ES contain the localized pathway label and both localized phrases; every `FactorId` and `PathwayId` has a non-empty entry in every language (loop over the keys).
    - `communityReports.test.ts`: EN time output unchanged; PT output equals `toLocaleString("pt-PT", same options)`; the PT/ES empty-summary fallback.
  - Done: the tests pass; the badges and tags render translated on the Dashboard and Site detail.
- **24.T5 Dashboard translated.** Depends: T2, T4.
  - Files: `src/i18n/dashboard.ts`, `src/pages/Dashboard.tsx`, `src/components/StatHero.tsx`, `src/components/KpiCards.tsx`, `src/components/OfficialDataCard.tsx`, `src/components/SamplingPriorityList.tsx` (incl. `TrendLabel`), `src/components/CommunityReportsFeed.tsx`, `src/components/CoimbraSatelliteChart.tsx`, `src/components/RiskMap.tsx` (strings only: toggle, legend, popups, marker titles, pathway label via `PATHWAY_LABEL`).
  - Done: in PT and ES no English is left on the Dashboard except the 24.1 item 4 exceptions; StatHero and KPI numerals keep their 23.3 sizes and the fold target of Section 23.
- **24.T6 Site detail translated.** Depends: T4.
  - Files: `src/i18n/siteDetail.ts`, `src/pages/SiteDetail.tsx` (passes `lang` to `explain`), `src/components/RiskMeter.tsx`, `src/components/ContributionBars.tsx` (factor labels), `src/components/TrendChart.tsx` (axis labels, tooltip, dates via `LOCALE`), `src/components/OneHealthPanel.tsx`.
  - Done: same check as T5 for `/site/:id` in both regions.
- **24.T7 Report a Bloom translated.** Depends: T4.
  - Files: `src/i18n/report.ts`, `src/pages/Report.tsx`, `src/components/BloomGuide.tsx`.
  - Validation and error messages are translated too; submitted `observationTypes` values stay as the existing English data values (24.1 item 4), and only their on-screen labels are translated.
  - Done: the full report flow completes in PT and ES; the existing report-loop tests still pass.
- **24.T8 English-only note.** Depends: T1.
  - Files: `src/components/EnglishOnlyNote.tsx` (new; renders nothing in EN, else a mono `text-xs text-muted-foreground` line with the `common.ts` note), `src/pages/Methodology.tsx`, `src/pages/OahCities.tsx`, `src/pages/MyReports.tsx`, `src/pages/RangerQueue.tsx` (one line each, as the first child of the page).
  - Done: the note shows on those four pages in PT and ES only.
- **24.T9 Integration and review.** Depends: T1 to T8.
  - Run `superpowers:requesting-code-review` plus `ponytail-review` on the whole diff; run an `impeccable` audit of the map and header against 24.2 and 24.3; walk every page in all three languages at the 24.3 widths; grep the T5, T6 and T7 files for leftover hardcoded English JSX text.
  - Then `npx tsc --noEmit && npx vitest run && npm run build`. The orchestrator's PROGRESS end entry lists the PT/ES files as "pending native-speaker review": `src/i18n/*.ts` and `src/engine/explain.ts`.
  - Done: all three commands exit 0, the walk finds no overflow and no stray English outside 24.1 items 3 and 4, and the review findings are resolved.
