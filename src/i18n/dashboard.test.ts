import { describe, expect, it } from "vitest";
import { DASHBOARD } from "./dashboard";

const holes = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join();

describe("DASHBOARD", () => {
  it("uses the same placeholders in every language", () => {
    for (const k of Object.keys(DASHBOARD.en) as (keyof typeof DASHBOARD.en)[]) {
      expect(holes(DASHBOARD.pt[k]), `pt ${k}`).toBe(holes(DASHBOARD.en[k]));
      expect(holes(DASHBOARD.es[k]), `es ${k}`).toBe(holes(DASHBOARD.en[k]));
    }
  });
});
