import type { PathwayDef, PathwayId } from "../types";

export const PATHWAYS: Record<PathwayId, PathwayDef> = {
  algal_bloom: {
    id: "algal_bloom",
    label: "Algal bloom",
    weights: { chlorophyll: 0.4, water_temperature: 0.2, calm_wind: 0.15, citizen_evidence: 0.15, seasonality: 0.1 },
  },
  waterborne_pathogen: {
    id: "waterborne_pathogen",
    label: "Waterborne pathogen",
    weights: { runoff: 0.35, water_temperature: 0.15, citizen_evidence: 0.2, recreation_exposure: 0.3 },
  },
  heat_low_water: {
    id: "heat_low_water",
    label: "Heat and low water",
    weights: { air_temperature: 0.4, low_water: 0.4, citizen_evidence: 0.2 },
  },
  waterborne_pathogen_oah: {
    id: "waterborne_pathogen_oah",
    label: "Waterborne pathogen",
    weights: { lab_pathogen_risk: 0.4, runoff: 0.25, air_temperature: 0.15, citizen_evidence: 0.2 },
  },
  ecosystem_stress: {
    id: "ecosystem_stress",
    label: "Ecosystem stress",
    weights: { contamination: 0.4, ecosystem_health_deficit: 0.4, citizen_evidence: 0.2 },
  },
};
