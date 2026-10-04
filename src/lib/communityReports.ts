import type { CitizenReport, DataTag, PathwayId, SiteResult } from "../types";

export function newestFirst(reports: CitizenReport[]): CitizenReport[] {
  return [...reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function reportSummary(report: CitizenReport): string {
  const text = report.observationTypes.join(", ");
  if (!text) return "No details given";
  return text.length > 80 ? `${text.slice(0, 80)}...` : text;
}

export const REPORT_TAG_LABEL: Record<DataTag, string> = {
  "synthetic-demo": "Demo report",
  "user-submitted": "Submitted in this session",
  prototype: "Demo report",
};

export function formatReportTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Los_Angeles",
  });
}

export function citizenEvidence(
  result: SiteResult,
): { value: number; points: number; pathwayId: PathwayId } | null {
  const lead = result.pathways.find((p) => p.pathwayId === result.leadingPathway);
  const c = lead?.contributions.find((x) => x.factor === "citizen_evidence");
  if (!lead || !c) return null;
  return { value: c.value, points: Math.round(c.points * 10) / 10, pathwayId: lead.pathwayId };
}
