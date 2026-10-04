export type FactorId =
  | "chlorophyll"
  | "water_temperature"
  | "calm_wind"
  | "citizen_evidence"
  | "seasonality"
  | "runoff"
  | "recreation_exposure"
  | "air_temperature"
  | "low_water"
  | "lab_pathogen_risk"
  | "contamination"
  | "ecosystem_health_deficit";

export type PathwayId =
  | "algal_bloom"
  | "waterborne_pathogen"
  | "heat_low_water"
  | "waterborne_pathogen_oah"
  | "ecosystem_stress";

export type Category = "Low" | "Moderate" | "High" | "Very High";

export type Trend = "Increasing" | "Stable" | "Decreasing";

export type DataTag = "synthetic-demo" | "prototype" | "user-submitted";

export type PathwayDef = {
  id: PathwayId;
  label: string;
  weights: Partial<Record<FactorId, number>>;
};

/** Factor scores, each 0-100. Absent keys are missing data. */
export type Factors = Partial<Record<FactorId, number>>;

export type ReportStatus =
  | "received"
  | "reviewing"
  | "sample-requested"
  | "confirmed"
  | "not-bloom"
  | "more-info";

export type CitizenReport = {
  id: string;
  siteId: string;
  observationTypes: string[];
  animalsPresent: boolean;
  notes: string;
  createdAt: string;
  dataTag: DataTag;
  reporterId?: string;
  status?: ReportStatus;
  rangerNote?: string;
  statusHistory?: { status: ReportStatus; at: string }[];
};

export type SiteRecord = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  factors: Factors;
  /** Seven daily site scores, ending at the current score. */
  history: number[];
  reports?: CitizenReport[];
};

export type SiteConfig = {
  id: string;
  name: string;
  country: string;
  center: [number, number];
  zoom: number;
  pathways: PathwayId[];
  dataStatus:
    | "prototype"
    | "resilience-map-export"
    | "synthetic-demo"
    | "config-only";
  sites: SiteRecord[];
};

export type Contribution = {
  factor: FactorId;
  value: number;
  weight: number;
  points: number;
};

export type PathwayResult = {
  pathwayId: PathwayId;
  score: number;
  category: Category;
  /** Sum of weights of present factors, 0-1. */
  coverage: number;
  contributions: Contribution[];
  missing: FactorId[];
};

export type SiteResult = {
  siteScore: number;
  category: Category;
  leadingPathway: PathwayId;
  pathways: PathwayResult[];
};

export type Citation = {
  id: string;
  item: string;
  claim: string;
  source: string;
  publisher: string;
  url: string;
  accessed: string;
};
