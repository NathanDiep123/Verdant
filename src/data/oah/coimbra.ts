import { scoreSite } from "@/engine/score";
import type { SiteConfig, SiteRecord } from "@/types";
import { parseResmapCsv } from "./parseResmapCsv";

// Optional per-site export. The glob matches nothing when the file is absent, so the build never breaks.
const csv = Object.values(
  import.meta.glob("/data/raw/oah-coimbra.csv", { query: "?raw", import: "default", eager: true }),
)[0] as string | undefined;

const parsed = csv ? parseResmapCsv(csv) : [];

/**
 * SYNTHETIC DEMO sites (PLAN A3). The 20 site names come from the OneAquaHealth Resilience Map, but the
 * export Verdant received holds only an area-level Earth-observation summary (see coimbraEo.ts) and no
 * per-site columns. Site positions are approximate (looked up in OpenStreetMap Nominatim, or placed by
 * hand near the Mondego where no match was found). The factor values and histories below are synthetic
 * demonstration values, not measurements.
 */
const OAH_PATHWAYS: SiteConfig["pathways"] = ["waterborne_pathogen_oah", "ecosystem_stress"];

const f = (lab: number, con: number, eco: number, air: number, run: number) => ({
  lab_pathogen_risk: lab,
  contamination: con,
  ecosystem_health_deficit: eco,
  air_temperature: air,
  runoff: run,
  citizen_evidence: 0,
});

// id, name, lat, lon, [lab pathogen, contamination, ecosystem deficit, air temperature, runoff],
// and the offsets of the six earlier daily scores from the current score.
type Row = [string, string, number, number, [number, number, number, number, number], number[]];
const TABLE: Row[] = [
  ["c1", "C1 Exploratório", 40.2068, -8.4282, [22, 18, 20, 60, 30], [-3, -2, -2, -1, 0, 0]],
  ["c2", "C2 Estação Cbr-B", 40.2247, -8.4405, [55, 60, 50, 66, 58], [4, 3, 3, 2, 1, 1]],
  ["c3", "C3 Vale das Flores", 40.1952, -8.4104, [35, 30, 38, 64, 40], [2, 1, 2, 0, 1, 0]],
  ["c4", "C4 Eiras", 40.2482, -8.4155, [48, 52, 46, 68, 50], [-6, -5, -3, -3, -1, 0]],
  ["c5", "C5 Mina Hospital", 40.215, -8.429, [70, 98, 95, 72, 60], [-9, -7, -5, -3, -2, -1]],
  ["c6", "C6 Casa do Sal", 40.2204, -8.4399, [62, 70, 64, 70, 55], [-4, -4, -2, -2, -1, 0]],
  ["c7", "C7 São Romão", 40.19, -8.435, [28, 24, 30, 62, 35], [1, 1, 0, 1, 0, 0]],
  ["c8", "C8 Covões", 40.23, -8.39, [40, 45, 42, 66, 38], [3, 2, 2, 1, 1, 0]],
  ["c9", "C9 Fornos", 40.2661, -8.4444, [66, 58, 60, 68, 62], [-5, -4, -3, -2, -1, -1]],
  ["c10", "C10 Arregaça", 40.216, -8.414, [52, 48, 55, 68, 45], [0, 1, -1, 0, 1, 0]],
  ["c11", "C11 Bairro São Miguel", 40.198, -8.42, [74, 62, 68, 72, 70], [-7, -5, -4, -3, -1, -1]],
  ["c12", "C12 Escola Agrária", 40.2118, -8.4652, [15, 12, 18, 58, 20], [2, 2, 1, 1, 0, 0]],
  ["c13", "C13 Condeixa", 40.1139, -8.4986, [44, 40, 35, 66, 48], [-1, 0, -1, 1, 0, 0]],
  ["c14", "C14 Antanhol", 40.1687, -8.4639, [58, 64, 60, 70, 52], [5, 4, 3, 2, 2, 1]],
  ["c15", "C15 Copeira", 40.18, -8.4219, [30, 28, 33, 64, 30], [3, 2, 1, 1, 1, 0]],
  ["c16", "C16 Rio Velho", 40.2356, -8.4558, [78, 72, 76, 72, 72], [-8, -6, -5, -3, -2, -1]],
  ["c17", "C17 Conraria", 40.1761, -8.3961, [36, 32, 28, 62, 34], [0, -1, 1, 0, 0, 1]],
  ["c18", "C18 Ponte da Espertina", 40.2562, -8.4521, [68, 55, 50, 70, 66], [3, 3, 2, 1, 1, 0]],
  ["c19", "C19 Escravote", 40.2482, -8.4134, [18, 22, 20, 60, 24], [1, 0, 1, 0, 1, 0]],
  ["c20", "C20 Corujeira", 40.2076, -8.4761, [50, 66, 70, 70, 48], [-6, -4, -4, -2, -2, -1]],
];

const synthetic: SiteRecord[] = TABLE.map(([id, name, lat, lon, v, offsets]) => {
  const site: SiteRecord = { id, name, lat, lon, factors: f(...v), history: [] };
  const score = scoreSite(site, { pathways: OAH_PATHWAYS }).siteScore;
  site.history = [...offsets.map((o) => Math.min(100, Math.max(0, score + o))), score];
  return site;
});

export const coimbraSites: SiteRecord[] = parsed.length >= 3 ? parsed : synthetic;
export const coimbraDataStatus: "resilience-map-export" | "synthetic-demo" =
  parsed.length >= 3 ? "resilience-map-export" : "synthetic-demo";
