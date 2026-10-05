import { describe, expect, it } from "vitest";
import { lakeMeadSites } from "../../data/lakeMead";
import { explain } from "../../engine/explain";
import { scoreSite } from "../../engine/score";
import { EN } from "./en";
import { NL } from "./nl";

const result = scoreSite(lakeMeadSites.find((s) => s.id === "callville-bay")!, {
  pathways: ["algal_bloom", "waterborne_pathogen", "heat_low_water"],
});

const leaves = (o: unknown, p = ""): [string, string][] =>
  typeof o === "string"
    ? [[p, o]]
    : o && typeof o === "object"
      ? Object.entries(o).flatMap(([k, v]) => leaves(v, p ? `${p}.${k}` : k))
      : [];

describe("nl locale", () => {
  it("writes the engine sentence in Dutch", () => {
    expect(explain(result, "nl")).toBe(
      "Het risico is vooral verhoogd door omstandigheden rond algenbloei: een sterk chlorofylsignaal en een warme watertemperatuur.",
    );
  });

  it("uses the glossary risk and status words", () => {
    expect(NL.riskWord).toEqual({ Low: "Laag", Moderate: "Matig", High: "Hoog", "Very High": "Zeer hoog" });
    expect(NL.status).toEqual({
      received: "Ontvangen",
      reviewing: "In beoordeling bij parkwachter",
      "sample-requested": "Monster aangevraagd",
      confirmed: "Bevestigd door monster",
      "not-bloom": "Geen bloei",
      "more-info": "Meer informatie nodig",
    });
  });

  it("translates at least 80% of the strings", () => {
    const en = new Map(leaves(EN));
    const all = leaves(NL);
    const differing = all.filter(([k, v]) => v !== en.get(k)).length;
    expect(differing / all.length).toBeGreaterThanOrEqual(0.8);
  });
});
