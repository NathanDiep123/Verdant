import { describe, expect, it } from "vitest";
import { lakeMeadSites } from "../data/lakeMead";
import { lakeMeadReports } from "../data/lakeMeadReports";
import { scoreSite } from "../engine/score";
import type { CitizenReport, ReportStatus, SiteRecord } from "../types";
import {
  EVIDENCE_WEIGHT,
  NEXT_STEP_LABEL,
  STATUS_LABEL,
  clearReportState,
  isOutcome,
  loadReportState,
  nearestSite,
  recordLine,
  reportCode,
  saveReportState,
  setStatus,
  trackRecord,
  withReportEvidence,
} from "./reportLoop";

const callville = lakeMeadSites.find((s) => s.id === "callville-bay")!;
const config = { pathways: ["algal_bloom" as const, "waterborne_pathogen" as const, "heat_low_water" as const] };
const bloom = (s: SiteRecord) => scoreSite(s, config).pathways.find((p) => p.pathwayId === "algal_bloom")!.score;

const user = (status: ReportStatus | undefined, siteId = "callville-bay", id = "user-1759600000123"): CitizenReport => ({
  id,
  siteId,
  observationTypes: [],
  animalsPresent: false,
  notes: "",
  createdAt: "2026-10-04T10:00:00Z",
  dataTag: "user-submitted",
  status,
});

const stub = (init: Record<string, string> = {}) => {
  const m = new Map(Object.entries(init));
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  } as unknown as Storage;
};
const throwing = {
  getItem: () => {
    throw new Error("no");
  },
  setItem: () => {
    throw new Error("no");
  },
  removeItem: () => {
    throw new Error("no");
  },
} as unknown as Storage;

describe("labels and weights", () => {
  it("matches the lifecycle table", () => {
    expect(STATUS_LABEL.confirmed).toBe("Confirmed by field sample");
    expect(STATUS_LABEL["sample-requested"]).toBe("Field sample requested");
    expect(EVIDENCE_WEIGHT).toEqual({ received: 10, reviewing: 10, "sample-requested": 10, confirmed: 20, "not-bloom": 0, "more-info": 10 });
    expect(isOutcome("confirmed")).toBe(true);
    expect(isOutcome("received")).toBe(false);
    expect(NEXT_STEP_LABEL.received).toBe("Next: Ranger reviewing");
    expect(NEXT_STEP_LABEL.reviewing).toBe("Next: field sample or outcome");
    expect(NEXT_STEP_LABEL["sample-requested"]).toBe("Next: outcome");
  });
});

describe("withReportEvidence", () => {
  const cases: [ReportStatus, number, number][] = [
    ["received", 74, 81],
    ["reviewing", 74, 81],
    ["sample-requested", 74, 81],
    ["more-info", 74, 81],
    ["confirmed", 84, 82],
    ["not-bloom", 64, 79],
  ];
  it.each(cases)("Callville with one %s report", (status, ev, score) => {
    const s = withReportEvidence(callville, [user(status)]);
    expect(s.factors.citizen_evidence).toBe(ev);
    expect(bloom(s)).toBe(score);
  });
  it("treats a missing status as received", () => {
    expect(withReportEvidence(callville, [user(undefined)]).factors.citizen_evidence).toBe(74);
  });
  it("seed reports add 0", () => {
    const s = withReportEvidence(callville, lakeMeadReports);
    expect(s.factors.citizen_evidence).toBe(64);
    expect(bloom(s)).toBe(79);
  });
  it("two received reports give 84", () => {
    const two = [user("received"), user("received", "callville-bay", "user-2")];
    expect(withReportEvidence(callville, two).factors.citizen_evidence).toBe(84);
  });
  it("caps at 100", () => {
    const hi = { ...callville, factors: { ...callville.factors, citizen_evidence: 95 } };
    expect(withReportEvidence(hi, [user("received")]).factors.citizen_evidence).toBe(100);
  });
  it("ignores other sites", () => {
    expect(withReportEvidence(callville, [user("received", "overton-arm")]).factors.citizen_evidence).toBe(64);
  });
  it("leaves missing evidence missing with no counted reports", () => {
    const bare = { ...callville, factors: { chlorophyll: 10 } };
    expect(withReportEvidence(bare, []).factors.citizen_evidence).toBeUndefined();
    expect(withReportEvidence(bare, [user("received")]).factors.citizen_evidence).toBe(10);
  });
});

describe("setStatus", () => {
  it("appends history without mutating", () => {
    const r = user("received");
    r.statusHistory = [{ status: "received", at: "2026-10-04T10:00:00Z" }];
    const next = setStatus(r, "confirmed", "2026-10-04T12:00:00Z", "note");
    expect(next.status).toBe("confirmed");
    expect(next.rangerNote).toBe("note");
    expect(next.statusHistory).toEqual([
      { status: "received", at: "2026-10-04T10:00:00Z" },
      { status: "confirmed", at: "2026-10-04T12:00:00Z" },
    ]);
    expect(r.status).toBe("received");
    expect(r.statusHistory).toHaveLength(1);
    expect(r.rangerNote).toBeUndefined();
  });
});

describe("track record", () => {
  it("counts for you", () => {
    const rec = trackRecord(lakeMeadReports, "you");
    expect(rec).toEqual({ filed: 4, decided: 3, matched: 2 });
    expect(recordLine(rec)).toBe("2 of 3 reviewed reports matched the field result.");
  });
  it("handles no decisions", () => {
    expect(recordLine(trackRecord(lakeMeadReports, "reporter-b"))).toBe("No reviewed reports yet.");
  });
});

describe("reportCode", () => {
  it("formats seed and user ids", () => {
    expect(reportCode(lakeMeadReports[0])).toBe("VR-1001");
    expect(reportCode(user("received"))).toBe("VR-0123");
  });
});

describe("nearestSite", () => {
  it("picks the closest site", () => {
    expect(nearestSite(36.15, -114.7, lakeMeadSites).name).toBe("Callville Bay");
    expect(nearestSite(36.06, -114.34, lakeMeadSites).name).toBe("Temple Basin");
  });
});

describe("persistence", () => {
  it("returns null on throwing storage, bad JSON, missing key", () => {
    expect(loadReportState(throwing)).toBeNull();
    expect(loadReportState(stub({ "verdant.reports.v1": "{nope" }))).toBeNull();
    expect(loadReportState(stub())).toBeNull();
  });
  it("round-trips", () => {
    const s = stub();
    const state = { submitted: [user("received")], seedStatus: { "report-3": { status: "confirmed" as const } } };
    saveReportState(state, s);
    expect(loadReportState(s)).toEqual(state);
    clearReportState(s);
    expect(loadReportState(s)).toBeNull();
  });
  it("swallows errors", () => {
    expect(() => saveReportState({ submitted: [], seedStatus: {} }, throwing)).not.toThrow();
    expect(() => clearReportState(throwing)).not.toThrow();
  });
});
