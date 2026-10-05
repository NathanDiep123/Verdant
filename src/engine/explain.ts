import { byLang } from "../i18n/locales";
import type { Lang } from "../i18n/lang";
import type { SiteResult } from "../types";

const EXPLAIN = byLang("explain");
export const PHRASE = Object.fromEntries(Object.entries(EXPLAIN).map(([l, e]) => [l, e.phrase])) as Record<Lang, (typeof EXPLAIN)["en"]["phrase"]>;
export const PATHWAY_LABEL = Object.fromEntries(Object.entries(EXPLAIN).map(([l, e]) => [l, e.pathway])) as Record<Lang, (typeof EXPLAIN)["en"]["pathway"]>;

export function explain(result: SiteResult, lang: Lang = "en"): string {
  const lead = result.pathways.find((p) => p.pathwayId === result.leadingPathway)!;
  const label = PATHWAY_LABEL[lang][lead.pathwayId].toLowerCase();
  const [a, b] = lead.contributions.slice(0, 2).map((c) => PHRASE[lang][c.factor]);
  return EXPLAIN[lang].sentence(label, a, b);
}
