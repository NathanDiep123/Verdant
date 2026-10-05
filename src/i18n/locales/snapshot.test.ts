import { describe, expect, it } from "vitest";
import { lakeMeadSites } from "../../data/lakeMead";
import { PATHWAY_LABEL, PHRASE, explain } from "../../engine/explain";
import { scoreSite } from "../../engine/score";
import { COMMON } from "../common";
import { DASHBOARD, RECOMMEND, TREND } from "../dashboard";
import { GUIDE, REPORT } from "../report";
import { NEXT_STEP, REPORT_MISC, RISK_WORD, STATUS, TAG } from "../shared";
import { FACTOR_LABEL, SITE_DETAIL } from "../siteDetail";

// Permanent byte-identity guard for the EN, PT and ES text (PLAN.md 25.6).
const TABLES = {
  COMMON, RISK_WORD, STATUS, NEXT_STEP, TAG, REPORT_MISC, RECOMMEND, TREND,
  DASHBOARD, SITE_DETAIL, FACTOR_LABEL, REPORT, GUIDE, PHRASE, PATHWAY_LABEL,
};
const LANG3 = ["en", "pt", "es"] as const;

const callville = lakeMeadSites.find((s) => s.id === "callville-bay")!;
const result = scoreSite(callville, { pathways: ["algal_bloom", "waterborne_pathogen", "heat_low_water"] });

describe("locale snapshot (en, pt, es)", () => {
  for (const [name, table] of Object.entries(TABLES)) {
    it(name, () => {
      const t = table as Record<(typeof LANG3)[number], unknown>;
      expect(Object.fromEntries(LANG3.map((l) => [l, t[l]]))).toMatchSnapshot();
    });
  }
  it("explain()", () => {
    expect(Object.fromEntries(LANG3.map((l) => [l, explain(result, l)]))).toMatchSnapshot();
  });
});
