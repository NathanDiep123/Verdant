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
  it("defaults to satellite", () => expect(loadBasemap(store())).toBe("satellite"));
  it("round-trips both values", () => {
    const s = store();
    saveBasemap("map", s);
    expect(loadBasemap(s)).toBe("map");
    expect(s.getItem("verdant.basemap")).toBe("map");
    saveBasemap("satellite", s);
    expect(loadBasemap(s)).toBe("satellite");
    expect(s.getItem("verdant.basemap")).toBe("satellite");
  });
  it("loads a stored map as map", () => expect(loadBasemap(store("map"))).toBe("map"));
  it("falls back to satellite on an unknown value", () => expect(loadBasemap(store("terrain"))).toBe("satellite"));
  it("survives throwing storage", () => {
    expect(loadBasemap(broken)).toBe("satellite");
    expect(() => saveBasemap("map", broken)).not.toThrow();
  });
  it("survives missing storage", () => {
    expect(loadBasemap(undefined)).toBe("satellite");
    expect(() => saveBasemap("map", undefined)).not.toThrow();
  });
});
