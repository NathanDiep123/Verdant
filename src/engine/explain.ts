import type { FactorId, PathwayId, SiteResult } from "../types";
import type { Lang } from "../i18n/lang";
import { PATHWAYS } from "./pathways";

export const PHRASE: Record<Lang, Record<FactorId, string>> = {
  en: {
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
  },
  pt: {
    chlorophyll: "um sinal forte de clorofila",
    water_temperature: "água quente",
    calm_wind: "vento fraco",
    citizen_evidence: "observações de cidadãos",
    seasonality: "época de floração",
    runoff: "escorrência intensa",
    recreation_exposure: "elevada exposição recreativa",
    air_temperature: "temperatura do ar elevada",
    low_water: "nível de água baixo",
    lab_pathogen_risk: "uma leitura laboratorial elevada de agentes patogénicos",
    contamination: "um nível de contaminação elevado",
    ecosystem_health_deficit: "um índice de saúde do ecossistema fraco",
  },
  es: {
    chlorophyll: "una señal fuerte de clorofila",
    water_temperature: "agua cálida",
    calm_wind: "viento en calma",
    citizen_evidence: "observaciones ciudadanas",
    seasonality: "la temporada de floraciones",
    runoff: "escorrentía intensa",
    recreation_exposure: "alta exposición recreativa",
    air_temperature: "temperatura del aire alta",
    low_water: "nivel bajo del agua",
    lab_pathogen_risk: "una lectura alta de patógenos en laboratorio",
    contamination: "un nivel alto de contaminación",
    ecosystem_health_deficit: "una puntuación baja de salud del ecosistema",
  },
};

export const PATHWAY_LABEL: Record<Lang, Record<PathwayId, string>> = {
  en: Object.fromEntries(Object.values(PATHWAYS).map((p) => [p.id, p.label])) as Record<PathwayId, string>,
  pt: {
    algal_bloom: "Floração de algas",
    waterborne_pathogen: "Agentes patogénicos na água",
    heat_low_water: "Calor e nível de água baixo",
    waterborne_pathogen_oah: "Agentes patogénicos na água",
    ecosystem_stress: "Stress do ecossistema",
  },
  es: {
    algal_bloom: "Floración de algas",
    waterborne_pathogen: "Patógenos en el agua",
    heat_low_water: "Calor y nivel bajo del agua",
    waterborne_pathogen_oah: "Patógenos en el agua",
    ecosystem_stress: "Estrés del ecosistema",
  },
};

const SENTENCE: Record<Lang, (pathway: string, a: string, b: string) => string> = {
  en: (pathway, a, b) => `Risk is elevated mainly by ${pathway} conditions: ${a} and ${b}.`,
  pt: (pathway, a, b) => `O risco está elevado sobretudo devido a condições de ${pathway}: ${a} e ${b}.`,
  es: (pathway, a, b) => `El riesgo es elevado sobre todo por condiciones de ${pathway}: ${a} y ${b}.`,
};

export function explain(result: SiteResult, lang: Lang = "en"): string {
  const lead = result.pathways.find((p) => p.pathwayId === result.leadingPathway)!;
  const label = PATHWAY_LABEL[lang][lead.pathwayId].toLowerCase();
  const [a, b] = lead.contributions.slice(0, 2).map((c) => PHRASE[lang][c.factor]);
  return SENTENCE[lang](label, a, b);
}
