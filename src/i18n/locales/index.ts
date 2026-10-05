import { LANGS, type Lang } from "../lang";
import { EN, type Locale } from "./en";
import { ES } from "./es";
import { FR } from "./fr";
import { IT } from "./it";
import { NB } from "./nb";
import { NL } from "./nl";
import { PT } from "./pt";

export type { Locale };
export const LOCALES: Record<Lang, Locale> = { en: EN, pt: PT, es: ES, fr: FR, it: IT, nl: NL, nb: NB };

/** One section of every language, e.g. `byLang("dashboard")` is `{ en, pt, es }` of that table. */
export const byLang = <K extends keyof Locale>(k: K) =>
  Object.fromEntries(LANGS.map((l) => [l, LOCALES[l][k]])) as Record<Lang, Locale[K]>;
