import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { HTML_LANG, loadLang, pickLang, saveLang, type Lang } from "@/i18n/lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };

const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() =>
    pickLang(loadLang(), navigator.languages ?? [navigator.language]),
  );

  useEffect(() => {
    saveLang(lang);
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);

  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): Ctx {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang must be used inside LanguageProvider");
  return c;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStrings<T>(dict: Record<Lang, T>): T {
  return dict[useLang().lang];
}
