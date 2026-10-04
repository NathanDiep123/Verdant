import type { CitizenReport, ReportStatus, SiteRecord } from "../types";

export const STATUS_LABEL: Record<ReportStatus, string> = {
  received: "Received",
  reviewing: "Ranger reviewing",
  "sample-requested": "Field sample requested",
  confirmed: "Confirmed by field sample",
  "not-bloom": "Not a bloom",
  "more-info": "Needs more info",
};

export const EVIDENCE_WEIGHT: Record<ReportStatus, number> = {
  received: 10,
  reviewing: 10,
  "sample-requested": 10,
  confirmed: 20,
  "not-bloom": 0,
  "more-info": 10,
};

export const NEXT_STEP_LABEL: Partial<Record<ReportStatus, string>> = {
  received: "Next: Ranger reviewing",
  reviewing: "Next: field sample or outcome",
  "sample-requested": "Next: outcome",
};

export const REPORTER_NAME: Record<string, string> = {
  you: "You (demo reporter)",
  "reporter-b": "Reporter B",
  "reporter-c": "Reporter C",
};

export const isOutcome = (status: ReportStatus): boolean =>
  status === "confirmed" || status === "not-bloom" || status === "more-info";

/** Site with citizen evidence weighted by each user-submitted report's review status. */
export function withReportEvidence(site: SiteRecord, reports: CitizenReport[]): SiteRecord {
  const counted = reports.filter((r) => r.siteId === site.id && r.dataTag === "user-submitted");
  const base = site.factors.citizen_evidence;
  if (base === undefined && counted.length === 0) return site;
  const added = counted.reduce((t, r) => t + EVIDENCE_WEIGHT[r.status ?? "received"], 0);
  return { ...site, factors: { ...site.factors, citizen_evidence: Math.min(100, (base ?? 0) + added) } };
}

export function setStatus(report: CitizenReport, status: ReportStatus, at: string, note?: string): CitizenReport {
  return {
    ...report,
    status,
    ...(note !== undefined ? { rangerNote: note } : {}),
    statusHistory: [...(report.statusHistory ?? []), { status, at }],
  };
}

export function trackRecord(reports: CitizenReport[], reporterId: string) {
  const mine = reports.filter((r) => r.reporterId === reporterId);
  return {
    filed: mine.length,
    decided: mine.filter((r) => r.status === "confirmed" || r.status === "not-bloom").length,
    matched: mine.filter((r) => r.status === "confirmed").length,
  };
}

export function recordLine(rec: { decided: number; matched: number }): string {
  return rec.decided === 0
    ? "No reviewed reports yet."
    : `${rec.matched} of ${rec.decided} reviewed reports matched the field result.`;
}

export function reportCode(report: CitizenReport): string {
  const seed = /^report-(\d+)$/.exec(report.id);
  if (seed) return `VR-${1000 + Number(seed[1])}`;
  const digits = report.id.replace(/\D/g, "");
  return `VR-${digits.slice(-4).padStart(4, "0")}`;
}

export function nearestSite(lat: number, lon: number, sites: SiteRecord[]): SiteRecord {
  const k = Math.cos((lat * Math.PI) / 180);
  const d = (s: SiteRecord) => (s.lat - lat) ** 2 + ((s.lon - lon) * k) ** 2;
  return sites.reduce((best, s) => (d(s) < d(best) ? s : best));
}

export type ReportState = {
  submitted: CitizenReport[];
  seedStatus: Record<string, Pick<CitizenReport, "status" | "statusHistory" | "rangerNote">>;
};

const KEY = "verdant.reports.v1";
const defaultStorage = (): Storage | undefined => {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
};

export function loadReportState(storage: Storage | undefined = defaultStorage()): ReportState | null {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (!v || !Array.isArray(v.submitted) || typeof v.seedStatus !== "object" || v.seedStatus === null) return null;
    return v as ReportState;
  } catch {
    return null;
  }
}

export function saveReportState(state: ReportState, storage: Storage | undefined = defaultStorage()): void {
  try {
    storage?.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage unavailable: state stays in memory
  }
}

export function clearReportState(storage: Storage | undefined = defaultStorage()): void {
  try {
    storage?.removeItem(KEY);
  } catch {
    // ignore
  }
}
