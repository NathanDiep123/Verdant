import { describe, expect, it } from "vitest";
import { lakeMeadSites } from "../data/lakeMead";
import type { FactorId, PathwayId } from "../types";
import { LANGS } from "../i18n/lang";
import { PATHWAYS } from "./pathways";
import { PATHWAY_LABEL, PHRASE, explain } from "./explain";
import { scoreSite } from "./score";

const callville = lakeMeadSites.find((s) => s.id === "callville-bay")!;
const result = scoreSite(callville, { pathways: ["algal_bloom", "waterborne_pathogen", "heat_low_water"] });
const lead = result.pathways.find((p) => p.pathwayId === result.leadingPathway)!;
const [a, b] = lead.contributions.slice(0, 2).map((c) => c.factor);

describe("explain", () => {
  it("keeps the English sentence unchanged", () => {
    const label = PATHWAYS[lead.pathwayId].label.toLowerCase();
    expect(explain(result)).toBe(`Risk is elevated mainly by ${label} conditions: ${PHRASE.en[a]} and ${PHRASE.en[b]}.`);
    expect(explain(result, "en")).toBe(explain(result));
    expect(explain(result)).toMatch(/^Risk is elevated mainly by algal bloom conditions: /);
  });

  it("localizes pathway and factor phrases in PT and ES", () => {
    for (const lang of ["pt", "es"] as const) {
      const s = explain(result, lang);
      expect(s).toContain(PATHWAY_LABEL[lang][lead.pathwayId].toLowerCase());
      expect(s).toContain(PHRASE[lang][a]);
      expect(s).toContain(PHRASE[lang][b]);
    }
    expect(explain(result, "pt")).toMatch(/^O risco está elevado sobretudo devido a condições de floração de algas: .+ e .+\.$/);
    expect(explain(result, "es")).toMatch(/^El riesgo es elevado sobre todo por condiciones de floración de algas: .+ y .+\.$/);
  });

  it("has a non-empty entry for every factor and pathway in every language", () => {
    const factors = Object.keys(PHRASE.en) as FactorId[];
    const pathways = Object.keys(PATHWAYS) as PathwayId[];
    expect(factors).toHaveLength(12);
    expect(pathways).toHaveLength(5);
    for (const lang of LANGS) {
      for (const f of factors) expect(PHRASE[lang][f]).toBeTruthy();
      for (const p of pathways) expect(PATHWAY_LABEL[lang][p]).toBeTruthy();
    }
  });
});
