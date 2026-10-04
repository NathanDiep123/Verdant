import { describe, expect, it } from "vitest";
import type { CitizenReport, SiteConfig, SiteResult } from "../types";
import { toFhirBundle } from "./bundle";

const config: SiteConfig = {
  id: "demo",
  name: "Demo",
  country: "XX",
  center: [0, 0],
  zoom: 5,
  pathways: ["algal_bloom"],
  dataStatus: "synthetic-demo",
  sites: [
    { id: "a", name: "Site A", lat: 1, lon: 2, factors: {}, history: [1, 2, 3, 4, 5, 6, 7] },
    { id: "b", name: "Site B", lat: 3, lon: 4, factors: {}, history: [7, 6, 5, 4, 3, 2, 1] },
  ],
};
const result = (score: number): SiteResult => ({
  siteScore: score,
  category: "Moderate",
  leadingPathway: "algal_bloom",
  pathways: [
    { pathwayId: "algal_bloom", score, category: "Moderate", coverage: 1, contributions: [], missing: [] },
  ],
});
const results = [result(40), result(60)];
const report = (id: string, siteId: string): CitizenReport => ({
  id,
  siteId,
  observationTypes: ["green water", "scum"],
  animalsPresent: false,
  notes: "n",
  createdAt: "2026-10-01T00:00:00Z",
  dataTag: "user-submitted",
});
const reports = [report("r1", "a"), report("r2", "a"), report("r3", "b")];

const bundle = toFhirBundle(config, results, reports);
const resources = bundle.entry.map((e) => e.resource);
const locations = resources.filter((r) => r.resourceType === "Location");
const observations = resources.filter((r) => r.resourceType === "Observation");

describe("toFhirBundle", () => {
  it("is a collection bundle", () => {
    expect(bundle.resourceType).toBe("Bundle");
    expect(bundle.type).toBe("collection");
  });

  it("resolves every Observation subject to a Location fullUrl", () => {
    const urls = new Set(bundle.entry.filter((e) => e.resource.resourceType === "Location").map((e) => e.fullUrl));
    expect(observations.length).toBeGreaterThan(0);
    for (const o of observations) expect(urls.has(o.subject!.reference)).toBe(true);
  });

  it("tags every resource", () => {
    for (const r of resources) expect(r.meta.tag.length).toBeGreaterThan(0);
  });

  it("matches fixture counts", () => {
    expect(locations).toHaveLength(2);
    expect(observations.filter((o) => o.code?.text === "Verdant site risk score")).toHaveLength(2);
    expect(observations.filter((o) => o.category?.text === "citizen-science")).toHaveLength(3);
  });
});
