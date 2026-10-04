import type { CitizenReport } from "../types";

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

export const lakeMeadReports: CitizenReport[] = [
  r(1, "callville-bay", ["Green surface layer", "Unusual odor"], false, "Bright green film along the marina docks.", "2026-10-01T08:30:00Z"),
  r(2, "callville-bay", ["Floating clumps", "Green streaks"], true, "My dog drank from the shoreline. Streaks drifting toward the launch ramp.", "2026-10-02T16:10:00Z"),
  r(3, "callville-bay", ["Green surface layer"], false, "Thicker than last week near the swim area.", "2026-10-03T09:45:00Z"),
  r(4, "las-vegas-bay", ["Discolored water"], false, "Water looks brown-green after the weekend storms.", "2026-10-01T14:00:00Z"),
  r(5, "las-vegas-bay", ["Green streaks", "Unusual odor"], false, "Earthy smell near the wash inflow.", "2026-10-03T11:20:00Z"),
  r(6, "overton-arm", ["Green surface layer"], false, "Light green tint in the shallow cove.", "2026-10-02T10:05:00Z"),
  r(7, "boulder-basin", ["Dead fish", "Other"], false, "A few dead fish near the beach, cause unknown.", "2026-10-03T07:50:00Z"),
];
