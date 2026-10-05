import { describe, expect, it } from "vitest";
import { lakeMeadSites } from "../../data/lakeMead";
import { explain } from "../../engine/explain";
import { scoreSite } from "../../engine/score";
import { LANGS } from "../lang";
import { EN } from "./en";
import { LOCALES } from "./index";

const holes = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join();

type Node = Record<string, unknown>;
function check(en: unknown, other: unknown, path: string): void {
  if (typeof en === "string") {
    expect(typeof other, path).toBe("string");
    expect((other as string).length, path).toBeGreaterThan(0);
    expect(holes(other as string), path).toBe(holes(en));
  } else if (typeof en === "function") {
    expect(typeof other, path).toBe("function");
  } else if (en && typeof en === "object") {
    expect(other && typeof other, path).toBe("object");
    for (const k of Object.keys(en as Node)) {
      expect(k in (other as Node), `${path}.${k} missing`).toBe(true);
      check((en as Node)[k], (other as Node)[k], `${path}.${k}`);
    }
  }
}

describe("locale parity", () => {
  it("has a locale for every language", () => expect(Object.keys(LOCALES).sort()).toEqual([...LANGS].sort()));
  for (const l of LANGS) it(`${l} has every EN key with the same placeholders`, () => check(EN, LOCALES[l], l));
});

describe("explain per language", () => {
  const result = scoreSite(lakeMeadSites.find((s) => s.id === "callville-bay")!, {
    pathways: ["algal_bloom", "waterborne_pathogen", "heat_low_water"],
  });
  for (const l of LANGS)
    it(`${l} returns a sentence`, () => {
      const t = explain(result, l);
      expect(t.length).toBeGreaterThan(0);
      expect(t.endsWith(".")).toBe(true);
    });
});
