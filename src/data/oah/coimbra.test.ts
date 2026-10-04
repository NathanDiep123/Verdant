import { describe, expect, it } from "vitest";
import { scoreSite } from "@/engine/score";
import { coimbraDataStatus, coimbraSites } from "./coimbra";

const config = { pathways: ["waterborne_pathogen_oah", "ecosystem_stress"] as const };

describe("coimbraSites", () => {
  it("has 20 synthetic sites", () => {
    expect(coimbraDataStatus).toBe("synthetic-demo");
    expect(coimbraSites).toHaveLength(20);
    expect(coimbraSites.map((s) => s.id)).toEqual(Array.from({ length: 20 }, (_, i) => `c${i + 1}`));
  });

  it("ends each 7-value history at the current site score", () => {
    for (const s of coimbraSites) {
      expect(s.history).toHaveLength(7);
      expect(s.history[6]).toBe(scoreSite(s, { pathways: [...config.pathways] }).siteScore);
    }
  });

  it("mixes categories with exactly one Very High site", () => {
    const cats = coimbraSites.map((s) => scoreSite(s, { pathways: [...config.pathways] }).category);
    expect(cats.filter((c) => c === "Very High")).toHaveLength(1);
    for (const c of ["Low", "Moderate", "High"]) expect(cats).toContain(c);
  });
});
