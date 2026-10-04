import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CitizenReport, ReportStatus, SiteConfig, SiteRecord } from "@/types";
import { siteConfigs, type RegionId } from "@/config/sites";
import { lakeMeadReports } from "@/data/lakeMeadReports";
import {
  clearReportState,
  loadReportState,
  saveReportState,
  setStatus,
  withReportEvidence,
  type ReportState,
} from "@/lib/reportLoop";

type Ctx = {
  regionId: RegionId;
  setRegionId: (id: RegionId) => void;
  config: SiteConfig;
  sites: SiteRecord[];
  reports: CitizenReport[];
  addReport: (r: CitizenReport) => void;
  updateReportStatus: (id: string, status: ReportStatus, note?: string) => void;
  resetDemo: () => void;
};

const RegionCtx = createContext<Ctx | null>(null);
const seedReports = (id: RegionId): CitizenReport[] => (id === "lake-mead" ? lakeMeadReports : []);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [regionId, setRegionId] = useState<RegionId>("lake-mead");
  const [initial] = useState<ReportState | null>(() => loadReportState());
  const [submitted, setSubmitted] = useState<CitizenReport[]>(initial?.submitted ?? []);
  const [seedStatus, setSeedStatus] = useState<ReportState["seedStatus"]>(initial?.seedStatus ?? {});

  useEffect(() => {
    saveReportState({ submitted, seedStatus });
  }, [submitted, seedStatus]);

  const config = siteConfigs[regionId];
  const reports = useMemo(() => {
    const ids = new Set(config.sites.map((s) => s.id));
    const seeds = seedReports(regionId).map((r) => (seedStatus[r.id] ? { ...r, ...seedStatus[r.id] } : r));
    return [...seeds, ...submitted.filter((r) => ids.has(r.siteId))];
  }, [regionId, config, seedStatus, submitted]);
  const sites = useMemo(() => config.sites.map((s) => withReportEvidence(s, reports)), [config, reports]);

  const addReport = (r: CitizenReport) => {
    setSubmitted((prev) => [
      ...prev,
      {
        ...r,
        reporterId: r.reporterId ?? "you",
        status: r.status ?? "received",
        statusHistory: r.statusHistory ?? [{ status: "received", at: r.createdAt }],
      },
    ]);
  };

  const updateReportStatus = (id: string, status: ReportStatus, note?: string) => {
    const at = new Date().toISOString();
    if (submitted.some((r) => r.id === id)) {
      setSubmitted((prev) => prev.map((r) => (r.id === id ? setStatus(r, status, at, note) : r)));
      return;
    }
    const seed = lakeMeadReports.find((r) => r.id === id);
    if (!seed) return;
    setSeedStatus((prev) => {
      const cur = { ...seed, ...prev[id] };
      const next = setStatus(cur, status, at, note);
      return { ...prev, [id]: { status: next.status, statusHistory: next.statusHistory, rangerNote: next.rangerNote } };
    });
  };

  const resetDemo = () => {
    clearReportState();
    setSubmitted([]);
    setSeedStatus({});
  };

  return (
    <RegionCtx.Provider
      value={{ regionId, setRegionId, config, sites, reports, addReport, updateReportStatus, resetDemo }}
    >
      {children}
    </RegionCtx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegion(): Ctx {
  const c = useContext(RegionCtx);
  if (!c) throw new Error("useRegion must be used inside RegionProvider");
  return c;
}
