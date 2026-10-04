import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseResmapCsv } from "./parseResmapCsv";

const csv = readFileSync(new URL("./fixture.csv", import.meta.url), "utf8");
const sites = parseResmapCsv(csv);
const by = (id: string) => sites.find((s) => s.id === id)!;

describe("parseResmapCsv", () => {
  it("groups rows by site", () => {
    expect(sites.map((s) => s.id).sort()).toEqual(["s1", "s2"]);
    expect(by("s1")).toMatchObject({ name: "Fixture North", lat: 40.21, lon: -8.43 });
  });

  it("keeps the latest row per site", () => {
    // s1 latest pathogen is 30, s2 is 70; columns already 0-100 stay as-is
    expect(by("s1").factors.lab_pathogen_risk).toBe(30);
    expect(by("s2").factors.lab_pathogen_risk).toBe(70);
  });

  it("inverts ecosystem health into a deficit", () => {
    expect(by("s1").factors.ecosystem_health_deficit).toBe(30);
    expect(by("s2").factors.ecosystem_health_deficit).toBe(60);
  });

  it("uses a column as-is when it is within 0-100", () => {
    expect(by("s2").factors.air_temperature).toBe(20);
  });

  it("min-max normalizes a column outside 0-100", () => {
    const wide = csv.replace("25,12", "250,12");
    const r = parseResmapCsv(wide);
    // temperature latest values: s1 250, s2 20 -> s1 100, s2 0
    expect(r.find((s) => s.id === "s1")!.factors.air_temperature).toBe(100);
    expect(r.find((s) => s.id === "s2")!.factors.air_temperature).toBe(0);
  });

  it("defaults citizen_evidence to 0 and gives 7 history values", () => {
    expect(by("s1").factors.citizen_evidence).toBe(0);
    expect(by("s1").history).toHaveLength(7);
  });
});
