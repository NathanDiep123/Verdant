import type { SiteRecord } from "../types";

/** Prototype demonstration data. Coordinates are approximate. */
export const lakeMeadSites: SiteRecord[] = [
  {
    id: "callville-bay",
    name: "Callville Bay",
    lat: 36.14,
    lon: -114.72,
    factors: { chlorophyll: 87, water_temperature: 78, calm_wind: 73, citizen_evidence: 64, seasonality: 85, runoff: 20, recreation_exposure: 68, air_temperature: 80, low_water: 60 },
    history: [58, 61, 63, 67, 70, 74, 79],
  },
  {
    id: "las-vegas-bay",
    name: "Las Vegas Bay",
    lat: 36.12,
    lon: -114.86,
    factors: { chlorophyll: 72, water_temperature: 75, calm_wind: 60, citizen_evidence: 55, seasonality: 85, runoff: 60, recreation_exposure: 60, air_temperature: 80, low_water: 50 },
    history: [60, 62, 63, 65, 66, 68, 70],
  },
  {
    id: "boulder-basin",
    name: "Boulder Basin",
    lat: 36.05,
    lon: -114.78,
    factors: { chlorophyll: 33, water_temperature: 70, calm_wind: 50, citizen_evidence: 30, seasonality: 85, runoff: 15, recreation_exposure: 90, air_temperature: 82, low_water: 85 },
    history: [72, 73, 71, 72, 74, 73, 73],
  },
  {
    id: "echo-bay",
    name: "Echo Bay",
    lat: 36.31,
    lon: -114.43,
    factors: { chlorophyll: 30, water_temperature: 65, calm_wind: 45, citizen_evidence: 20, seasonality: 85, runoff: 10, recreation_exposure: 40, air_temperature: 60, low_water: 30 },
    history: [44, 42, 43, 45, 44, 43, 43],
  },
  {
    id: "overton-arm",
    name: "Overton Arm",
    lat: 36.4,
    lon: -114.38,
    factors: { chlorophyll: 58, water_temperature: 72, calm_wind: 65, citizen_evidence: 40, seasonality: 85, runoff: 25, recreation_exposure: 35, air_temperature: 78, low_water: 40 },
    history: [60, 61, 63, 62, 61, 62, 62],
  },
  {
    id: "temple-basin",
    name: "Temple Basin",
    lat: 36.05,
    lon: -114.33,
    factors: { chlorophyll: 8, water_temperature: 35, calm_wind: 25, citizen_evidence: 5, seasonality: 85, runoff: 6, recreation_exposure: 15, air_temperature: 30, low_water: 20 },
    history: [35, 33, 30, 28, 26, 25, 23],
  },
];
