import { describe, expect, it } from "vitest";
import { lakeMeadSites } from "../../data/lakeMead";
import { explain } from "../../engine/explain";
import { scoreSite } from "../../engine/score";
import { EN } from "./en";
import { FR } from "./fr";

const result = scoreSite(lakeMeadSites.find((s) => s.id === "callville-bay")!, {
  pathways: ["algal_bloom", "waterborne_pathogen", "heat_low_water"],
});

const leaves = (o: unknown, p = ""): [string, string][] =>
  typeof o === "string"
    ? [[p, o]]
    : o && typeof o === "object"
      ? Object.entries(o).flatMap(([k, v]) => leaves(v, p ? `${p}.${k}` : k))
      : [];

describe("French locale", () => {
  it("builds the engine sentence with the vous-register template", () => {
    expect(explain(result, "fr")).toBe(
      "Le risque est élevé surtout en raison de conditions de prolifération d’algues\u00a0: un signal de chlorophylle fort et une eau chaude.",
    );
  });

  it("elides de before a vowel or mute h", () => {
    expect(FR.explain.sentence("écosystème", "a", "b")).toContain("conditions d’écosystème\u00a0: a et b.");
    expect(FR.explain.sentence("heure", "a", "b")).toContain("conditions d’heure");
    expect(FR.explain.sentence("chaleur", "a", "b")).toContain("conditions de chaleur\u00a0: a et b.");
  });

  it("uses the glossary risk and status words", () => {
    expect(FR.riskWord).toEqual({ Low: "Faible", Moderate: "Modéré", High: "Élevé", "Very High": "Très élevé" });
    expect(FR.status).toEqual({
      received: "Reçu",
      reviewing: "En examen par un garde",
      "sample-requested": "Échantillon demandé",
      confirmed: "Confirmé par échantillon",
      "not-bloom": "Pas une prolifération",
      "more-info": "Informations manquantes",
    });
  });

  it("uses the short nav label and the English-only note", () => {
    expect(FR.common.navDashboard).toBe("Tableau");
    expect(FR.common.navReport).toBe("Signaler");
    expect(FR.common.moreCitiesShort).toBe("Autres villes");
    expect(FR.common.englishOnly).toBe("Cette page n’est disponible qu’en anglais.");
  });

  it("differs from EN in at least 80% of string leaves", () => {
    const en = new Map(leaves(EN));
    const all = leaves(FR);
    const same = all.filter(([k, v]) => en.get(k) === v).length;
    expect(same / all.length).toBeLessThan(0.2);
  });
});
