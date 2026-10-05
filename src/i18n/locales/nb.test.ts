import { describe, expect, it } from "vitest";
import { lakeMeadSites } from "../../data/lakeMead";
import { explain } from "../../engine/explain";
import { scoreSite } from "../../engine/score";
import { EN } from "./en";
import { NB } from "./nb";

const result = scoreSite(lakeMeadSites.find((s) => s.id === "callville-bay")!, {
  pathways: ["algal_bloom", "waterborne_pathogen", "heat_low_water"],
});

const leaves = (o: unknown, p = ""): [string, string][] =>
  typeof o === "string"
    ? [[p, o]]
    : o && typeof o === "object"
      ? Object.entries(o).flatMap(([k, v]) => leaves(v, `${p}.${k}`))
      : [];

describe("nb locale", () => {
  it("writes the engine sentence with the 25.7 template", () => {
    expect(explain(result, "nb")).toBe("Risikoen er forhøyet hovedsakelig på grunn av forhold knyttet til algeoppblomstring: et sterkt klorofyllsignal og høy vanntemperatur.");
  });
  it("uses the glossary risk and status words", () => {
    expect(NB.riskWord).toEqual({ Low: "Lav", Moderate: "Moderat", High: "Høy", "Very High": "Svært høy" });
    expect(NB.status).toEqual({
      received: "Mottatt",
      reviewing: "Under vurdering hos parkvokter",
      "sample-requested": "Prøve bestilt",
      confirmed: "Bekreftet av prøve",
      "not-bloom": "Ikke oppblomstring",
      "more-info": "Trenger mer informasjon",
    });
  });
  it("translates at least 80% of string leaves", () => {
    const en = leaves(EN);
    const nb = new Map(leaves(NB));
    const changed = en.filter(([k, v]) => nb.get(k) !== v).length;
    expect(changed / en.length).toBeGreaterThanOrEqual(0.8);
  });
});
