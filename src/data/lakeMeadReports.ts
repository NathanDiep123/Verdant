import type { CitizenReport, ReportStatus } from "../types";

/** Synthetic demo reports. */
const r = (
  n: number,
  siteId: string,
  observationTypes: string[],
  animalsPresent: boolean,
  notes: string,
  createdAt: string,
): CitizenReport => ({
  id: `report-${n}`,
  siteId,
  observationTypes,
  animalsPresent,
  notes,
  createdAt,
  dataTag: "synthetic-demo",
});

type Outcome = Pick<CitizenReport, "reporterId" | "status" | "rangerNote" | "statusHistory">;
const h = (...steps: [ReportStatus, string][]) => steps.map(([status, at]) => ({ status, at }));
const base: CitizenReport[] = [
  r(1, "callville-bay", ["Green surface layer", "Unusual odor"], false, "Bright green film along the marina docks.", "2026-10-01T08:30:00Z"),
  r(2, "callville-bay", ["Floating clumps", "Green streaks"], true, "My dog drank from the shoreline. Streaks drifting toward the launch ramp.", "2026-10-02T16:10:00Z"),
  r(3, "callville-bay", ["Green surface layer"], false, "Thicker than last week near the swim area.", "2026-10-03T09:45:00Z"),
  r(4, "las-vegas-bay", ["Discolored water"], false, "Water looks brown-green after the weekend storms.", "2026-10-01T14:00:00Z"),
  r(5, "las-vegas-bay", ["Green streaks", "Unusual odor"], false, "Earthy smell near the wash inflow.", "2026-10-03T11:20:00Z"),
  r(6, "overton-arm", ["Green surface layer"], false, "Light green tint in the shallow cove.", "2026-10-02T10:05:00Z"),
  r(7, "boulder-basin", ["Dead fish", "Other"], false, "A few dead fish near the beach, cause unknown.", "2026-10-03T07:50:00Z"),
];

/** Demonstration ranger outcomes. Not real ranger or lab results. */
const outcomes: Outcome[] = [
  {
    reporterId: "you",
    status: "confirmed",
    rangerNote: "Demo outcome: a field sample on Oct 2 confirmed a bloom at the marina docks.",
    statusHistory: h(
      ["received", "2026-10-01T08:30:00Z"],
      ["reviewing", "2026-10-01T15:00:00Z"],
      ["sample-requested", "2026-10-01T16:00:00Z"],
      ["confirmed", "2026-10-02T18:00:00Z"],
    ),
  },
  {
    reporterId: "reporter-b",
    status: "sample-requested",
    statusHistory: h(
      ["received", "2026-10-02T16:10:00Z"],
      ["reviewing", "2026-10-02T17:00:00Z"],
      ["sample-requested", "2026-10-02T18:30:00Z"],
    ),
  },
  {
    reporterId: "reporter-c",
    status: "reviewing",
    statusHistory: h(["received", "2026-10-03T09:45:00Z"], ["reviewing", "2026-10-03T12:00:00Z"]),
  },
  {
    reporterId: "you",
    status: "not-bloom",
    rangerNote: "Demo outcome: the brown-green water after the storms was stirred-up sediment, not a bloom.",
    statusHistory: h(
      ["received", "2026-10-01T14:00:00Z"],
      ["reviewing", "2026-10-01T20:00:00Z"],
      ["not-bloom", "2026-10-02T09:00:00Z"],
    ),
  },
  {
    reporterId: "reporter-b",
    status: "received",
    statusHistory: h(["received", "2026-10-03T11:20:00Z"]),
  },
  {
    reporterId: "you",
    status: "confirmed",
    rangerNote: "Demo outcome: a field sample on Oct 3 confirmed a bloom in the shallow cove.",
    statusHistory: h(
      ["received", "2026-10-02T10:05:00Z"],
      ["reviewing", "2026-10-02T13:00:00Z"],
      ["sample-requested", "2026-10-02T15:00:00Z"],
      ["confirmed", "2026-10-03T17:00:00Z"],
    ),
  },
  {
    reporterId: "you",
    status: "more-info",
    rangerNote: "Demo outcome: the ranger asks where exactly the fish were, and for a photo if you go back.",
    statusHistory: h(
      ["received", "2026-10-03T07:50:00Z"],
      ["reviewing", "2026-10-03T10:00:00Z"],
      ["more-info", "2026-10-03T13:00:00Z"],
    ),
  },
];

export const lakeMeadReports: CitizenReport[] = base.map((r, i) => ({ ...r, ...outcomes[i] }));
