> In three years, 18 US states alone reported 389 human and 413 animal illnesses from harmful algal blooms. Verdant shows water managers where to sample first, from a US lake to a Portuguese city. A guided citizen report goes to ranger review, and the reporter sees the outcome.

![Verdant dashboard: risk map, sampling priority list and score breakdown](https://raw.githubusercontent.com/heliaval/Verdant/main/docs/gallery/01-dashboard.png)

## Inspiration

Across eighteen U.S. states, 421 harmful algal bloom events were reported during 2016–2018, alongside 389 human illnesses and at least 413 animal illnesses. These are national figures, not Lake Mead counts ([CDC, MMWR 69(50)](https://www.cdc.gov/mmwr/volumes/69/wr/mm6950a2.htm)). Agencies cannot watch every shoreline, and the people near the water rarely hear whether their report helped. Verdant connects those steps: people report, rangers prioritize follow-up, and reporters see the outcome.

## What it does

Verdant is a working demonstration of a report-to-outcome workflow, with six pages and an interface in seven languages. It is for reporters at a lake or stream, for rangers and water managers who decide where to sample, and for OneAquaHealth researchers who could use reviewed observations.

| Step | What happens |
|---|---|
| 1. Find a site | A risk map (Satellite or Map) and a sampling priority list show where follow-up is recommended. |
| 2. Understand the score | Each site breaks its score into factor contributions and names its hazard pathway. |
| 3. Report | A three-step form with a bloom and look-alike guide. Every question and the photo are optional. |
| 4. Review | A demonstration ranger queue lets users request sampling and record a simulated outcome. |
| 5. See what happened | My reports shows the report's status history and outcome. |

Review changes how much a report counts: a new report adds 10 citizen-evidence points, a confirmed one adds 20, and one ruled not a bloom adds 0. At Callville Bay the score goes from 79 to 81 on a new report, to 82 once confirmed, and back to 79 if ruled not a bloom.

**These weights are demonstration rules, not validated. A citizen report never confirms a bloom, and every ranger outcome here is simulated. Verdant flags conditions associated with higher bloom risk. It does not confirm toxins or replace field sampling, and its scores are not an official advisory.**

### What is real and what is demonstration data

| Item | Status |
|---|---|
| Lake Mead scores and reports | Demonstration data |
| Lake Mead elevation (1,037.93 ft on 2026-10-03) | Official U.S. Bureau of Reclamation snapshot |
| Coimbra satellite chart | Real Resilience Map export (monthly NDVI and NDWI area means) |
| Coimbra site scores | Synthetic; the chart does not drive them |
| Review outcomes, FHIR-shaped export | Simulated and unvalidated |
| Translations (all but English) | Machine-drafted, pending native-speaker review |

![Callville Bay with the ranger queue showing how a review changes the score](https://raw.githubusercontent.com/heliaval/Verdant/main/docs/gallery/04-ranger-and-payoff.png)

## Challenges

- **Area-level data.** The Coimbra export holds monthly area means, not site-level measurements. We kept the real chart and gave the 20 sites real names with synthetic scores, labelled as such.
- **Recommendation versus advisory.** A sampling priority is not a confirmed hazard, so every score reads as "where to look first" with the disclaimer beside it.
- **Open verification.** The official OneAquaHealth survey fields and FHIR profile ids could not be retrieved, so some questions are placeholders.

## What we learned

A score is more useful when people can see why it is high, and a report is worth sending when the reporter sees what it led to.

## What's next

1. Test with citizens and rangers.
2. Validate scores against field measurements and revise the weights.
3. Add shared storage, ranger accounts, and privacy controls.
4. Verify OneAquaHealth fields, add live satellite and weather feeds, and have native speakers review the translations. None of these exist today.

## Impact & Alignment with the OneAquaHealth mission

Verdant supports OneAquaHealth and **Track 6: Resilience Informatics** by turning scattered citizen and environmental signals into explainable monitoring priorities.

- **Monitoring.** A ranked sampling list sends limited field time to the worst-looking sites.
- **Protection.** Every score names its hazard pathway and gives a next step, with visitor guidance for people and pets.
- **Awareness.** The bloom and look-alike guide shows reporters what a bloom looks like.
- **One Health.** Each site page pairs the score with environment, human health and animal health panels.

Earlier sampling can mean earlier warnings for people and animals. We have not measured this, and field validation comes first. Lake Mead is the US pilot and Coimbra, Portugal, is a OneAquaHealth case-study city. Benevento, Ghent, Oslo, and Toulouse are configured and need site data.

## Innovation & Creativity

Citizen science often ends when the report is sent. In Verdant the report keeps going: it enters ranger review, its status changes its weight in the site score, and the reporter sees the outcome. Scores break down into factors so anyone can see why a site ranks where it does, and one config object per region lets the same engine run a US reservoir and a Portuguese city.

![The same app in three languages](https://raw.githubusercontent.com/heliaval/Verdant/main/docs/gallery/05-three-languages.png)

## Architecture

| Layer | What we used |
|---|---|
| Scoring | A tested TypeScript engine with fixed, published weights and a separate tested module for review weights |
| Data | CDC counts (cited), a Bureau of Reclamation elevation snapshot, a Resilience Map CSV for Coimbra (PapaParse), and labelled demonstration scores for Lake Mead |
| Interface | React, TypeScript, Vite, Tailwind, shadcn, Leaflet with Esri tiles, Recharts, and seven languages |
| Integration | A FHIR-shaped JSON export (profile ids unverified) |
| Storage and tests | Browser local storage with no backend yet, and 151 automated tests |

## UX

The path is map, explanation, report, outcome. Reporting takes three steps with optional answers and a photo from the camera or phone library. Controls carry screen-reader labels, the switches work from the keyboard, and layouts adapt to phones. We have not run an accessibility audit or tested with intended users yet.

## Scale

A new city needs site coordinates, suitable data such as a Resilience Map CSV, a validated scoring model, and a local review process. Existing systems connect through the CSV import and the FHIR-shaped export, and both need validation with partners. There is no server to run today, so a small agency-supported pilot is the natural first step.

---

[Live prototype](https://verdant.albert14059.workers.dev/) · [Methodology and sources](https://verdant.albert14059.workers.dev/methodology) · [GitHub repository](https://github.com/heliaval/Verdant)
