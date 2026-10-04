import { describe, expect, it } from "vitest";
import { lakeMeadSites } from "../data/lakeMead";
import { lakeMeadReports } from "../data/lakeMeadReports";
import { applyCitizenReport, scoreSite } from "../engine/score";
import type { CitizenReport } from "../types";
import {
  REPORT_TAG_LABEL,
  citizenEvidence,
  formatReportTime,
  newestFirst,
  reportSummary,
} from "./communityReports";

const callville = lakeMeadSites.find((s) => s.id === "callville-bay")!;
const cfg = { pathways: ["algal_bloom", "waterborne_pathogen", "heat_low_water"] as const };
const config = { pathways: [...cfg.pathways] };

describe("communityReports", () => {
  it("summarizes seed report 1", () => {
    expect(reportSummary(lakeMeadReports[0])).toBe("Green surface layer, Unusual odor");
  });

  it("cuts a long summary to 80 characters plus ellipsis", () => {
    const r: CitizenReport = { ...lakeMeadReports[0], observationTypes: ["x".repeat(120)] };
    const s = reportSummary(r);
    expect(s.endsWith("...")).toBe(true);
    expect(s).toHaveLength(83);
  });

  it("handles an empty observation list", () => {
    expect(reportSummary({ ...lakeMeadReports[0], observationTypes: [] })).toBe("No details given");
  });

  it("sorts newest first without mutating", () => {
    const copy = [...lakeMeadReports];
    expect(newestFirst(lakeMeadReports)[0].id).toBe("report-5");
    expect(lakeMeadReports).toEqual(copy);
  });

  it("labels tags", () => {
    expect(REPORT_TAG_LABEL["synthetic-demo"]).toBe("Demo report");
    expect(REPORT_TAG_LABEL["user-submitted"]).toBe("Submitted in this session");
    expect(REPORT_TAG_LABEL.prototype).toBe("Demo report");
  });

  it("formats time in Pacific time, 24h", () => {
    expect(formatReportTime("2026-10-03T11:20:00Z")).toBe("Oct 3, 04:20");
  });

  it("formats time per language", () => {
    const iso = "2026-10-03T11:20:00Z";
    const opts: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Los_Angeles",
    };
    expect(formatReportTime(iso, "en")).toBe("Oct 3, 04:20");
    expect(formatReportTime(iso, "pt")).toBe(new Date(iso).toLocaleString("pt-PT", opts));
    expect(formatReportTime(iso, "es")).toBe(new Date(iso).toLocaleString("es-ES", opts));
  });

  it("localizes the empty-summary fallback", () => {
    const empty = { ...lakeMeadReports[0], observationTypes: [] };
    expect(reportSummary(empty, "pt")).toBe("Sem detalhes");
    expect(reportSummary(empty, "es")).toBe("Sin detalles");
  });

  it("reads citizen evidence from the leading pathway", () => {
    expect(citizenEvidence(scoreSite(callville, config))).toEqual({ value: 64, points: 9.6, pathwayId: "algal_bloom" });
    expect(citizenEvidence(scoreSite(applyCitizenReport(callville), config))).toEqual({
      value: 74,
      points: 11.1,
      pathwayId: "algal_bloom",
    });
  });

  it("returns null when the factor is missing", () => {
    const { citizen_evidence: _drop, ...rest } = callville.factors;
    void _drop;
    expect(citizenEvidence(scoreSite({ ...callville, factors: rest }, config))).toBeNull();
  });
});
