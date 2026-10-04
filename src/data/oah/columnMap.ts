import type { FactorId } from "@/types";

/**
 * Header names of the Resilience Map export.
 * ponytail: data/raw/oah-coimbra.csv did not exist when this was written, so
 * these are defaults. Replace with the exact header names once the CSV lands.
 */
export const columnMap = {
  id: "site_id",
  name: "site_name",
  lat: "latitude",
  lon: "longitude",
  date: "date",
  factors: {
    lab_pathogen_risk: "pathogen_risk",
    contamination: "contamination_level",
    ecosystem_health_deficit: "ecosystem_health", // inverted: deficit = 100 - health
    air_temperature: "temperature",
    runoff: "precipitation",
  } as Partial<Record<FactorId, string>>,
  invert: ["ecosystem_health_deficit"] as FactorId[],
};

export type ColumnMap = typeof columnMap;
