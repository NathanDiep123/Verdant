import { describe, expect, it } from "vitest";
import { loadBasemap, saveBasemap } from "./basemap";

const store = (init?: string): Storage => {
  const m = new Map<string, string>(init === undefined ? [] : [["verdant.basemap", init]]);
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v) } as Storage;
};
const broken = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
} as unknown as Storage;

describe("basemap choice", () => {
  it("defaults to map", () => expect(loadBasemap(store())).toBe("map"));
  it("round-trips satellite", () => {
    const s = store();
    saveBasemap("satellite", s);
    expect(loadBasemap(s)).toBe("satellite");
    expect(s.getItem("verdant.basemap")).toBe("satellite");
  });
  it("falls back to map on an unknown value", () => expect(loadBasemap(store("terrain"))).toBe("map"));
  it("survives throwing storage", () => {
    expect(loadBasemap(broken)).toBe("map");
    expect(() => saveBasemap("satellite", broken)).not.toThrow();
  });
  it("survives missing storage", () => {
    expect(loadBasemap(undefined)).toBe("map");
    expect(() => saveBasemap("map", undefined)).not.toThrow();
  });
});
