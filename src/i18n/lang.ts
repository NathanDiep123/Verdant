export const LANGS = ["en", "pt", "es"] as const;
export type Lang = (typeof LANGS)[number];

export const HTML_LANG: Record<Lang, string> = { en: "en", pt: "pt-PT", es: "es" };
export const LOCALE: Record<Lang, string> = { en: "en-US", pt: "pt-PT", es: "es-ES" };
export const LANG_NAME: Record<Lang, string> = { en: "English", pt: "Português", es: "Español" };
export const LANG_CODE: Record<Lang, string> = { en: "EN", pt: "PT", es: "ES" };

const isLang = (v: unknown): v is Lang => LANGS.includes(v as Lang);

export function pickLang(stored: string | null, browser: readonly string[]): Lang {
  if (isLang(stored)) return stored;
  for (const tag of browser) {
    const primary = tag.toLowerCase().split("-")[0];
    if (isLang(primary)) return primary;
  }
  return "en";
}

const KEY = "verdant.lang";
const defaultStorage = (): Storage | undefined => {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
};

export function loadLang(storage: Storage | undefined = defaultStorage()): string | null {
  try {
    return storage?.getItem(KEY) ?? null;
  } catch {
    return null;
  }
}

export function saveLang(lang: Lang, storage: Storage | undefined = defaultStorage()): void {
  try {
    storage?.setItem(KEY, lang);
  } catch {
    // storage unavailable: language stays in memory
  }
}

export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}
