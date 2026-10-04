import { describe, expect, it } from "vitest";
import { coimbraEoSeries } from "./coimbraEo";

describe("coimbraEoSeries", () => {
  it("has 24 rows in ascending period order ending at 2026-09", () => {
    expect(coimbraEoSeries).toHaveLength(24);
    const periods = coimbraEoSeries.map((r) => r.period);
    expect(periods[0]).toBe("2024-09");
    expect(periods[23]).toBe("2026-09");
    expect([...periods].sort()).toEqual(periods);
  });

  it("never carries GEMI", () => {
    expect(JSON.stringify(coimbraEoSeries).toLowerCase()).not.toContain("gemi");
    expect(Object.keys(coimbraEoSeries[0]).some((k) => /gemi/i.test(k))).toBe(false);
  });

  it("holds finite numbers", () => {
    for (const r of coimbraEoSeries) {
      for (const [k, v] of Object.entries(r)) {
        if (k !== "period") expect(Number.isFinite(v)).toBe(true);
      }
    }
  });

  it("keeps each mean between its min and max", () => {
    for (const r of coimbraEoSeries) {
      expect(r.ndviMean).toBeGreaterThanOrEqual(r.ndviMin);
      expect(r.ndviMean).toBeLessThanOrEqual(r.ndviMax);
      expect(r.ndwiMean).toBeGreaterThanOrEqual(r.ndwiMin);
      expect(r.ndwiMean).toBeLessThanOrEqual(r.ndwiMax);
    }
  });
});
