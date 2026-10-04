# Verdant

**See the bloom before it becomes a warning.**

## Track alignment

Track 6, Resilience Informatics. Verdant turns scattered environmental and citizen signals into early warning and monitoring priorities for freshwater sites.

## Inspiration

Across the United States, 18 states reported 421 harmful algal bloom events, 389 cases of human illness and 413 cases of animal illness during 2016–2018. That is the CDC's national count, and we found no Lake Mead-specific figure. At Lake Mead, the National Park Service says blooms occur, that exposure can cause nausea, vomiting and breathing problems, that dogs and other animals can become seriously ill or die, and that blooms are most common from August through December.

No agency can sample every cove of a reservoir every day. We wanted a tool that says where to look first, and shows why.

## What it does

Verdant scores each monitoring site on hazard pathways. At Lake Mead there are three: algal bloom, waterborne pathogen, and heat with low water. The site score is the highest pathway score, and the pathway behind it is named. Scores fall into Low, Moderate, High and Very High, each with a plain recommendation, from "Routine observation" to "Recommend field sampling".

- The dashboard shows a risk map, KPI cards, the official Lake Mead elevation from the U.S. Bureau of Reclamation, and a Sampling priority list that tags the top site as the recommended first sampling target.
- The site page shows a risk meter, a score for each pathway, factor contribution bars under "Why is risk elevated?", a 7-day trend, a One Health panel for environment, human health and animal health, and a disclaimer.
- A citizen can submit a bloom report, and the site's score updates on screen. The form warns that a report does not confirm a bloom.
- The OneAquaHealth cities page runs the same engine on Coimbra with one click and shows a 24-month satellite signal chart from a Resilience Map export. Coimbra site scores are synthetic. Benevento, Ghent, Oslo and Toulouse are configured next.
- One button exports sites, scores and reports as FHIR-shaped JSON.

Lake Mead values are prototype demonstration data and are labelled that way on every screen.

## How we built it

The core is a TypeScript risk engine with fixed, published pathway weights that sum to 1.00. When a factor is missing, the score uses the factors that are present and the page shows "Partial data". Unit tests check every pathway's weights, every expected site score, the category boundaries, partial-data handling, trends, the citizen-report update, and that the contribution points add up to the score.

The interface is React and TypeScript with Leaflet for the map and Recharts for the trend chart. Each city is a `SiteConfig`: a map center, a list of pathways and a set of sites. A PapaParse-based parser reads a OneAquaHealth Resilience Map CSV export into that shape. For Coimbra, the one export we could get is an area-level satellite summary, which feeds a 24-month NDVI and NDWI chart; the 20 Coimbra sites use the real Resilience Map site names with synthetic scores, labelled as such. The FHIR export builds a `Bundle` of `Location` and `Observation` resources. There is no backend.

## Challenges

We could not retrieve the official OneAquaHealth citizen-science protocol fields, so the report form uses placeholder observation types marked for replacement. The OneAquaHealth FHIR implementation guide's CI build returned 404, so we could read its canonical base URL but not verify its profile ids. We say so in the README. Lake Mead values are prototype values, so we labelled them, kept the one official data element visibly separate, and state that no score has been validated.

## Accomplishments

- One engine, two very different places: a US reservoir and a European urban stream network, switched by configuration.
- Scores that explain themselves, down to each factor's contribution.
- A tested engine, a tested FHIR bundle and a tested CSV parser.
- Every external number in the site, video and text traces to a row in a published citations table.

## What we learned

An early-warning score is only useful if a manager can see why it is high. Showing each factor’s contribution keeps the score open to challenge. Adding a new city is mostly data mapping, not modelling, which is why a city configuration is small.

## What's next

1. Validation: compare Verdant scores with in-situ field-sample results (chlorophyll-a and cyanotoxin measurements from agency sampling) at the same sites and dates.
2. Real-time Sentinel-2 ingestion, with NDCI as an experimental chlorophyll proxy and not toxin detection.
3. Live weather APIs.
4. Agency monitoring integration.
5. Validated local risk models.
6. Mobile citizen reporting.
7. Automated alerts.
8. FHIR server submission.

## Impact & Alignment

Verdant links freshwater conditions to human and animal health. Every score names its hazard pathway, its evidence and a next step for rangers, water agencies, researchers, residents and visitors. Lake Mead is the pilot. The same engine runs on OneAquaHealth's Coimbra data and is configured for Benevento, Ghent, Oslo and Toulouse. Lake Mead is not a OneAquaHealth case-study site, so the cities page and the site configuration carry the alignment.

## Innovation & Creativity

A citizen report changes the risk score on screen. Every score breaks down into factor contributions. One configuration switch moves Verdant from a US reservoir to a European urban stream network.

## Technical Implementation

A tested TypeScript risk engine with fixed, published weights and partial-data coverage. A Resilience Map CSV parser. FHIR-shaped JSON export that uses the OneAquaHealth FHIR implementation guide's canonical base URL and profile names; the profile ids are unverified. React, TypeScript, Leaflet and Recharts.

## Usability & User Experience

Four pages, one path from map to explanation to action. Disclaimers sit next to every score, and the layout works on a phone in the field.

## Feasibility & Scalability

Adding a city takes a CSV export, a column map and a site config. There is no backend to run. All scores are unvalidated today, and the first future-work step is comparing them with in-situ field-sample results. Further steps are live Sentinel-2 and weather feeds, validated local models, agency integration and FHIR server submission.

## Built with

React, TypeScript, Vite, Tailwind CSS, shadcn, Leaflet, react-leaflet, Recharts, react-router, PapaParse, Vitest, OpenStreetMap tiles.

Sources: see the Data sources and citations table on the Methodology page and in the README
