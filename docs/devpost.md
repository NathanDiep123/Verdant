# Verdant

**See the bloom before it becomes a warning.**

## Elevator pitch

Rangers rely on citizen bloom reports that are often unreliable. Verdant makes reporting easy, triages each report, and shows reporters what it led to.

## Try it out

- Live demo: https://verdant.albert14059.workers.dev
- Source: https://github.com/heliaval/Verdant

## Track alignment

Track 6, Resilience Informatics. Verdant turns scattered environmental and citizen signals into early warning and monitoring priorities for freshwater sites.

## Inspiration

Across the United States, 18 states reported 421 harmful algal bloom events, 389 cases of human illness and 413 cases of animal illness during 2016–2018 (CDC national count; no Lake Mead figure found). At Lake Mead, the National Park Service says blooms occur, can seriously sicken or kill dogs, and are most common from August through December.

Rangers cannot watch every cove, so they depend on citizen reports. Those reports are often unreliable, and reporters rarely hear what happened next. We wanted to fix that loop.

## What it does

- Reporting is easy: a three-step guided report with a photo and an "Is it a bloom?" picture guide. A "Report what you see" button is on every page.
- Rangers triage each report in a demonstration Report queue that shows the reporter's track record.
- Reporters see what their report led to in My reports, with a status timeline and outcomes such as "You got it right."
- Evidence is review-weighted: a new report adds 10 points, one confirmed by field sample adds 20, one ruled Not a bloom adds 0. Callville Bay goes 79 to 81 on submit, 82 once confirmed, and back to 79 if ruled Not a bloom.
- Each site is scored on hazard pathways. The highest pathway sets the score and is named, with factor contributions and a recommendation.
- The dashboard has a risk map with community pins, a Community reports feed and a Sampling priority list.
- The OneAquaHealth cities page runs the same engine on Coimbra, with a satellite signal chart from a Resilience Map export. Coimbra site scores are synthetic.

A report never confirms a bloom by itself. All ranger outcomes, seed reports and Lake Mead values are demonstration data and are labelled that way.

## How we built it

A tested TypeScript risk engine with fixed, published weights, plus a tested report lifecycle that applies the review weights. The interface is React with Leaflet and Recharts. Each city is a `SiteConfig`, and a parser reads Resilience Map CSV exports. FHIR-shaped JSON export. Coimbra's only export is an area-level NDVI and NDWI summary, so its 20 sites use real Resilience Map names with synthetic scores. There is no backend.

## Challenges

We could not retrieve the official OneAquaHealth protocol fields, so report questions are placeholders. The FHIR guide's build returned 404, so its profile ids are unverified. No score is validated.

## Accomplishments

- One engine for a US reservoir and a European urban stream network.
- Scores that explain themselves, factor by factor.
- A full report-to-outcome loop that works end to end.

## What we learned

A score is only useful if people can see why it is high, and a report is only worth sending if the reporter sees what it led to.

## What's next

1. Validate scores against field-sample results.
2. Real-time Sentinel-2 ingestion; NDCI stays an experimental proxy.
3. Live weather APIs.
4. Agency monitoring integration.
5. Native mobile reporting and automated alerts.
6. FHIR server submission.

## Impact & Alignment

Verdant links freshwater conditions to human and animal health. Every score names its hazard pathway, its evidence and a next step for rangers, water agencies, researchers, residents and visitors. Citizens, rangers and reporters share one loop. Lake Mead is the pilot. The same engine runs on OneAquaHealth's Coimbra data and is configured for Benevento, Ghent, Oslo and Toulouse. Lake Mead is not a OneAquaHealth case-study site, so the cities page and the site configuration carry the alignment.

## Innovation & Creativity

A citizen report changes the risk score on screen, weighted by the ranger's review. Every score breaks down into factor contributions. One configuration switch moves Verdant from a US reservoir to a European urban stream network.

## Technical Implementation

A tested TypeScript risk engine with fixed, published weights and partial-data coverage. A Resilience Map CSV parser. A tested report lifecycle with review-weighted evidence. FHIR-shaped JSON export that uses the OneAquaHealth FHIR implementation guide's canonical base URL and profile names; the profile ids are unverified. React, TypeScript, Leaflet and Recharts.

## Usability & User Experience

Six pages, one path from map to explanation to action, and a report form a first-time visitor can finish in three steps. Disclaimers sit next to every score, and the layout works on a phone in the field.

## Feasibility & Scalability

Adding a city takes a CSV export, a column map and a site config. There is no backend to run. All scores are unvalidated today, and the first future-work step is comparing them with in-situ field-sample results. Further steps are live Sentinel-2 and weather feeds, validated local models, agency integration and FHIR server submission.

## Built with

React, TypeScript, Vite, Tailwind CSS, shadcn, Leaflet, react-leaflet, Recharts, react-router, PapaParse, Vitest, OpenStreetMap tiles.

Sources: see the Data sources and citations table on the Methodology page and in the README

<!-- story chars: 2987 -->
