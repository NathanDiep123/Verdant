import { createContext, useContext, useState, type ReactNode } from "react";
import type { CitizenReport, SiteConfig, SiteRecord } from "@/types";
import { siteConfigs, type RegionId } from "@/config/sites";
import { lakeMeadReports } from "@/data/lakeMeadReports";
import { applyCitizenReport } from "@/engine/score";

type Ctx = {
  regionId: RegionId;
  setRegionId: (id: RegionId) => void;
  config: SiteConfig;
  sites: SiteRecord[];
  setSites: (s: SiteRecord[]) => void;
  reports: CitizenReport[];
  addReport: (r: CitizenReport) => void;
};

const RegionCtx = createContext<Ctx | null>(null);
const initialReports = (id: RegionId): CitizenReport[] => (id === "lake-mead" ? [...lakeMeadReports] : []);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [regionId, setId] = useState<RegionId>("lake-mead");
  const [sites, setSites] = useState<SiteRecord[]>(siteConfigs["lake-mead"].sites);
  const [reports, setReports] = useState<CitizenReport[]>(() => initialReports("lake-mead"));

  const setRegionId = (id: RegionId) => {
    setId(id);
    setSites(siteConfigs[id].sites);
    setReports(initialReports(id));
  };
  const addReport = (r: CitizenReport) => {
    setReports((prev) => [...prev, r]);
    setSites((prev) => prev.map((s) => (s.id === r.siteId ? applyCitizenReport({ ...s, reports: [...(s.reports ?? []), r] }) : s)));
  };

  return (
    <RegionCtx.Provider value={{ regionId, setRegionId, config: siteConfigs[regionId], sites, setSites, reports, addReport }}>
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
