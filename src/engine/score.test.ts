import { describe, expect, it } from "vitest";
import { lakeMeadSites } from "../data/lakeMead";
import type { Category, FactorId, PathwayId } from "../types";
import { PATHWAYS } from "./pathways";
import {
  applyCitizenReport,
  categorize,
  scorePathway,
  scoreSite,
  trend,
} from "./score";

const lakeMead: PathwayId[] = ["algal_bloom", "waterborne_pathogen", "heat_low_water"];
const site = (id: string) => lakeMeadSites.find((s) => s.id === id)!;

describe("pathway weights", () => {
  it.each(Object.values(PATHWAYS))("$id sums to 1", (p) => {
    const sum = Object.values(p.weights).reduce((a, b) => a + b, 0);
    expect(Math.abs(sum - 1)).toBeLessThan(1e-9);
  });
});

describe("Lake Mead expected output", () => {
  const rows: [string, number, number, number, number, Category, PathwayId][] = [
    ["callville-bay", 79, 52, 69, 79, "Very High", "algal_bloom"],
    ["las-vegas-bay", 70, 61, 63, 70, "High", "algal_bloom"],
    ["boulder-basin", 48, 49, 73, 73, "High", "heat_low_water"],
    ["echo-bay", 43, 29, 40, 43, "Moderate", "algal_bloom"],
    ["overton-arm", 62, 38, 55, 62, "High", "algal_bloom"],
    ["temple-basin", 23, 13, 21, 23, "Low", "algal_bloom"],
  ];
  it.each(rows)("%s", (id, a, w, h, score, cat, lead) => {
    const r = scoreSite(site(id), { pathways: lakeMead });
    expect(r.pathways.map((p) => p.score)).toEqual([a, w, h]);
    expect(r.siteScore).toBe(score);
    expect(r.category).toBe(cat);
    expect(r.leadingPathway).toBe(lead);
  });
});

describe("categorize", () => {
  it.each([
    [25, "Low"],
    [26, "Moderate"],
    [50, "Moderate"],
    [51, "High"],
    [75, "High"],
    [76, "Very High"],
  ] as const)("%i is %s", (n, c) => expect(categorize(n)).toBe(c));
});

describe("partial data", () => {
  it("renormalizes over present factors", () => {
    const factors: Partial<Record<FactorId, number>> = {
      chlorophyll: 60, water_temperature: 60, calm_wind: 60, seasonality: 60,
    };
    const r = scorePathway(factors, PATHWAYS.algal_bloom);
    expect(r.score).toBe(60);
    expect(r.coverage).toBeCloseTo(0.85, 9);
    expect(r.missing).toEqual(["citizen_evidence"]);
  });
});

describe("trend", () => {
  it("classifies history", () => {
    expect(trend(site("callville-bay").history)).toBe("Increasing");
    expect(trend(site("temple-basin").history)).toBe("Decreasing");
    expect(trend(site("echo-bay").history)).toBe("Stable");
  });
});

describe("applyCitizenReport", () => {
  it("raises citizen_evidence by 10", () => {
    const next = applyCitizenReport(site("callville-bay"));
    expect(next.factors.citizen_evidence).toBe(74);
    expect(scorePathway(next.factors, PATHWAYS.algal_bloom).score).toBe(81);
    expect(site("callville-bay").factors.citizen_evidence).toBe(64);
  });
  it("caps at 100", () => {
    const s = { ...site("callville-bay"), factors: { citizen_evidence: 95 } };
    expect(applyCitizenReport(s).factors.citizen_evidence).toBe(100);
  });
});

describe("contributions", () => {
  it("are sorted and sum to the unrounded score", () => {
    for (const s of lakeMeadSites) {
      for (const id of lakeMead) {
        const r = scorePathway(s.factors, PATHWAYS[id]);
        const pts = r.contributions.map((c) => c.points);
        expect(pts).toEqual([...pts].sort((a, b) => b - a));
        const w = PATHWAYS[id].weights;
        const num = Object.entries(w).reduce((t, [k, wt]) => t + wt * (s.factors[k as FactorId] ?? 0), 0);
        const raw = num / r.coverage;
        expect(Math.abs(pts.reduce((a, b) => a + b, 0) - raw)).toBeLessThan(1e-9);
      }
    }
  });
});
