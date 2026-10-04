import { NEXT_STEP_LABEL, STATUS_LABEL } from "../lib/reportLoop";
import type { Category, DataTag, ReportStatus } from "../types";
import { defineStrings } from "./lang";

/** Risk category words. Category ids stay English; only the displayed word changes. */
export const RISK_WORD = defineStrings({
  en: { Low: "Low", Moderate: "Moderate", High: "High", "Very High": "Very High" } satisfies Record<Category, string>,
  pt: { Low: "Baixo", Moderate: "Moderado", High: "Alto", "Very High": "Muito alto" },
  es: { Low: "Bajo", Moderate: "Moderado", High: "Alto", "Very High": "Muy alto" },
});

export const STATUS = defineStrings({
  en: { ...STATUS_LABEL } satisfies Record<ReportStatus, string>,
  pt: {
    received: "Recebido",
    reviewing: "Guarda a analisar",
    "sample-requested": "Amostra de campo pedida",
    confirmed: "Confirmado por amostra de campo",
    "not-bloom": "Não é floração",
    "more-info": "Faltam informações",
  },
  es: {
    received: "Recibido",
    reviewing: "Guardabosques revisando",
    "sample-requested": "Muestra de campo solicitada",
    confirmed: "Confirmado por muestra de campo",
    "not-bloom": "No es floración",
    "more-info": "Falta información",
  },
});

export const NEXT_STEP = defineStrings({
  en: {
    received: NEXT_STEP_LABEL.received!,
    reviewing: NEXT_STEP_LABEL.reviewing!,
    "sample-requested": NEXT_STEP_LABEL["sample-requested"]!,
  },
  pt: {
    received: "Seguinte: guarda a analisar",
    reviewing: "Seguinte: amostra de campo ou resultado",
    "sample-requested": "Seguinte: resultado",
  },
  es: {
    received: "Siguiente: guardabosques revisando",
    reviewing: "Siguiente: muestra de campo o resultado",
    "sample-requested": "Siguiente: resultado",
  },
});

/** Report data-tag labels. English values match REPORT_TAG_LABEL. */
export const TAG = defineStrings({
  en: {
    "synthetic-demo": "Demo report",
    "user-submitted": "Submitted in this session",
    prototype: "Demo report",
  } satisfies Record<DataTag, string>,
  pt: {
    "synthetic-demo": "Relato de demonstração",
    "user-submitted": "Enviado nesta sessão",
    prototype: "Relato de demonstração",
  },
  es: {
    "synthetic-demo": "Aviso de demostración",
    "user-submitted": "Enviado en esta sesión",
    prototype: "Aviso de demostración",
  },
});

export const REPORT_MISC = defineStrings({
  en: { noDetails: "No details given", animalsPresent: "Animals present", history: "Report history" },
  pt: { noDetails: "Sem detalhes", animalsPresent: "Há animais presentes", history: "Histórico do relato" },
  es: { noDetails: "Sin detalles", animalsPresent: "Hay animales presentes", history: "Historial del aviso" },
});
