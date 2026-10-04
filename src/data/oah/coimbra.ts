import type { SiteRecord } from "@/types";
import { parseResmapCsv } from "./parseResmapCsv";

// Optional real export. The glob matches nothing when the file is absent, so the build never breaks.
const csv = Object.values(
  import.meta.glob("/data/raw/oah-coimbra.csv", { query: "?raw", import: "default", eager: true }),
)[0] as string | undefined;

const parsed = csv ? parseResmapCsv(csv) : [];

/**
 * SYNTHETIC DEMO fallback (PLAN A3): 5 invented sites at real Mondego basin coordinates,
 * structured as a Resilience Map export. Values are not measurements.
 */
const f = (lab: number, con: number, eco: number, air: number, run: number) => ({
  lab_pathogen_risk: lab,
  contamination: con,
  ecosystem_health_deficit: eco,
  air_temperature: air,
  runoff: run,
  citizen_evidence: 0,
});
const synthetic: SiteRecord[] = [
  { id: "mondego-coimbra", name: "Mondego at Coimbra", lat: 40.2086, lon: -8.4289, factors: f(62, 55, 58, 70, 45), history: [48, 50, 52, 55, 57, 59, 60] },
  { id: "parque-verde", name: "Parque Verde do Mondego", lat: 40.2031, lon: -8.4247, factors: f(48, 42, 40, 70, 40), history: [45, 46, 44, 45, 46, 47, 46] },
  { id: "foz-do-dao", name: "Foz do Dao", lat: 40.3317, lon: -8.1903, factors: f(30, 25, 28, 62, 35), history: [32, 31, 30, 29, 30, 29, 29] },
  { id: "aguieira", name: "Aguieira Reservoir", lat: 40.3822, lon: -8.1861, factors: f(40, 35, 45, 66, 30), history: [36, 37, 38, 40, 41, 42, 43] },
  { id: "montemor", name: "Montemor-o-Velho", lat: 40.1763, lon: -8.6828, factors: f(72, 66, 70, 74, 60), history: [60, 62, 65, 66, 68, 70, 71] },
];

export const coimbraSites: SiteRecord[] = parsed.length >= 3 ? parsed : synthetic;
export const coimbraDataStatus: "resilience-map-export" | "synthetic-demo" =
  parsed.length >= 3 ? "resilience-map-export" : "synthetic-demo";
