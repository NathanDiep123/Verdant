# Verdant demo video — revised 3:50 timeline

## 0:00–0:20 · Slide 1 — The problem and One Health

**Show:**

- Title: "Healthier water starts with better observations."
- Three connected labels: Environment · People · Animals
- Below: 421 bloom events · 389 human illnesses · 413+ animal illnesses
- 18 U.S. states, 2016–2018 — not Lake Mead-specific
- Footer: Source: CDC, MMWR 69(50), December 18, 2020

**Say:**
"Water ecosystem health connects people, animals, and the environment. From 2016 to 2018, eighteen U.S. states reported four hundred twenty-one harmful algal bloom events, associated with hundreds of human and animal illnesses. Monitoring and useful citizen observations are both part of the response."

## 0:20–0:40 · Slide 2 — The gap Verdant addresses

**Show:**

- Title: "Turn an observation into useful follow-up."
- Diagram: Citizen observation → Ranger review → Sampling priority → Reporter feedback
- Bottom line: Track 6: Resilience Informatics
- Lake Mead: pilot workflow · Coimbra: OneAquaHealth application

**Say:**
"Typically rangers rely on citizen reports to address these issues, though a report may lack detail, confuse a bloom with a look-alike, or leave the reporter without feedback. Verdant connects guided reporting, ranger review, and explainable sampling priorities. We used Lake Mead as a pilot to demonstrate the workflow; we used Coimbra to show its application to a OneAquaHealth case-study city and its scalability to other locations"

## 0:40–1:00 · Website — Find the first sampling target

**Show and do:**

- Start on the Lake Mead dashboard, with the prototype-data label visible.
- Show the map's colored risk circles and blue square report markers.
- Move to the Sampling priority list.
- Point to Callville Bay — 79 — Recommended first sampling target.
- Click Callville Bay.

**Say:**
"Here is the working prototype. The map combines site scores with community reports, and the priority list recommends where to investigate first. Callville Bay leads this demonstration. These are prototype scores, not live measurements or verified predictions of a harmful bloom."

## 1:00–1:20 · Website — Explain what the score means

**Show and do:**

- Show "Why is risk elevated?"
- Point to the contribution bars for chlorophyll, water temperature, and citizen evidence.
- Briefly show "Recommend field sampling" beside "Official advisory: none issued."
- Scroll to Community observations.
- Click Add an observation at Callville Bay.

**Say:**
"The site page shows exactly which factors contribute to the score. These fixed weights are transparent prototype assumptions that still need field validation. Citizen evidence is one contribution. The recommendation supports sampling decisions; it does not confirm toxins or replace an official advisory."

## 1:20–1:55 · Website — File a guided report

**Show and do:**

- 1:20–1:25: Show Callville Bay selected. Click Next.
- 1:25–1:35: Show the optional photo control and "Is it a bloom?" guide. Pause on bloom drawings and duckweed.
- 1:35–1:42: Select Looks like a bloom, then Lots for green slime/stringy algae.
- 1:42–1:48: Click Next. Show the summary and warning, then Submit report.
- 1:48–1:55: Hold on the new report identifier and 79 → 81 change. Add an editing caption with the actual identifier: "Follow report VR-____."

**Say:**
"Let's talk about reporting possible blooms.
A person at the shore selects a site, compares their observation with the bloom and look-alike guide, and submits what they know. Photos are optional, and uncertain answers can be skipped. Here, the report adds ten citizen-evidence points, which moves the overall site score by two points—not ten. The report receives an identifier so we can follow that same observation through review."

## 1:55–2:25 · Website — Review the same report

**Show and do:**

- Open Report queue.
- Keep "Demonstration ranger view" visible briefly.
- Find the same report identifier shown after submission.
- Point to its reporter track record.
- Click Request field sample.
- Pause on the changed status.
- Click Confirmed by field sample for that report.
- Keep this caption visible: "Simulated outcome — no actual field sample."

**Say:**
"The ranger queue shows the same report, its status, and the reporter's history. We'll simulate requesting a sample and recording a confirmed result. Our prototype assigns ten evidence points to a new report, twenty after confirmation, and zero if ruled not a bloom. These rules demonstrate review changing the evidence weight; they are not scientifically calibrated, and duplicate or malicious reports remain a production challenge."

## 2:25–2:45 · Website — Close the feedback loop

**Show and do:**

- Open My reports.
- Find the same report identifier again.
- Hold on "You got it right."
- Show Received → Field sample requested → Confirmed by field sample.
- Point to "Your report helped prioritize Callville Bay for sampling."

**Say:**
"The reporter now sees what happened to their observation, including the review history and outcome. That closes the feedback loop: people can understand their contribution and learn from the result. Encouraging better observations and continued participation is the intended benefit, which we still need to evaluate with users."

## 2:45–3:10 · Website — Demonstrate OneAquaHealth transferability

**Show and do:**

- Open OAH Cities.
- Show Coimbra and the other four city names.
- Scroll to the Coimbra satellite signal chart and its source line.
- Return to Coimbra and click Run Verdant on Coimbra.
- Hold on the changed dashboard and synthetic-data label.

**Say:**
"Coimbra demonstrates reuse of the workflow in a OneAquaHealth city. This chart displays real area-level vegetation and water-index summaries from the Resilience Map. It does not currently drive the synthetic site scores. The same scoring architecture supports different regional configurations, while the other four cities are configured but still need suitable site data."

## 3:10–3:40 · Slide 3 — What works, what comes next, and why it matters

**Show:**

- Title: "From a working demonstration to field use"

| Working now | Next validation and deployment steps |
|---|---|
| Guided reporting and outcome history | Test reporting with citizens and rangers |
| Explainable scoring and regional configuration | Compare scores with field measurements |
| Demonstrated ranger-review workflow | Shared backend, ranger authentication, duplicate controls |

- Bottom line: Intended impact: more useful reports · clearer sampling priorities · visible follow-up

**Say:**
"Today, our prototype demonstrates the interface, scoring logic, and reporting loop. Reports stay in one browser, but this is not a shared citizen-and-ranger service yet. Our next steps are a shared backend, authenticated ranger roles, and duplicate-report controls, alongside field validation and usability testing. We would measure reporting completion, usefulness to rangers, and agreement with field results before claiming better monitoring outcomes."

## 3:40–3:50 · Slide 4 — Close

**Show:**

- Verdant
- Better observations. Clearer priorities. Visible follow-up.
- verdant.albert14059.workers.dev

**Say:**
"Verdant turns a shoreline observation into a visible path toward review and action, helping communities contribute and experts decide where to look first."
