import { describe, expect, it } from "vitest";
import { recommend } from "../engine/score";
import { LANGS } from "./lang";
import { RECOMMEND, SITE_DETAIL } from "./siteDetail";

describe("site detail strings", () => {
  it("English recommendation matches the engine", () => {
    for (const c of ["Low", "Moderate", "High", "Very High"] as const) expect(RECOMMEND.en[c]).toBe(recommend(c));
  });
  it("evidence template keeps the points placeholder once in every language", () => {
    for (const l of LANGS) expect(SITE_DETAIL[l].evidence.split("{points}")).toHaveLength(2);
  });
});
