import type { FactorId, SiteResult } from "../types";
import { PATHWAYS } from "./pathways";

const PHRASE: Record<FactorId, string> = {
  chlorophyll: "a strong chlorophyll signal",
  water_temperature: "warm water temperature",
  calm_wind: "calm wind",
  citizen_evidence: "citizen observations",
  seasonality: "bloom season timing",
  runoff: "heavy runoff",
  recreation_exposure: "high recreation exposure",
  air_temperature: "high air temperature",
  low_water: "low water levels",
  lab_pathogen_risk: "a high lab pathogen reading",
  contamination: "a high contamination level",
  ecosystem_health_deficit: "a weak ecosystem health score",
};

export function explain(result: SiteResult): string {
  const lead = result.pathways.find((p) => p.pathwayId === result.leadingPathway)!;
  const label = PATHWAYS[lead.pathwayId].label.toLowerCase();
  const top = lead.contributions.slice(0, 2).map((c) => PHRASE[c.factor]);
  return `Risk is elevated mainly by ${label} conditions: ${top.join(" and ")}.`;
}
