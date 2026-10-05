import { Flag } from "@/components/Flags";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { COMMON } from "@/i18n/common";
import { fmt, LANGS, LANG_CODE, LANG_NAME, type Lang } from "@/i18n/lang";
import { useLang, useStrings } from "@/state/LanguageContext";

export function LanguageSwitch() {
  const { lang, setLang } = useLang();
  const s = useStrings(COMMON);
  return (
    <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
      <SelectTrigger
        aria-label={fmt(s.languageLabel, { name: LANG_NAME[lang] })}
        className="h-8 gap-1 rounded-sm border-border px-1.5 py-0 md:gap-1.5 md:px-2"
      >
        <Flag lang={lang} />
        <span className="sr-only font-mono text-xs md:not-sr-only">{LANG_CODE[lang]}</span>
      </SelectTrigger>
      <SelectContent
        align="end"
        alignItemWithTrigger={false}
        className="w-auto min-w-44 rounded-sm border-input p-1 shadow-none"
      >
        {LANGS.map((l) => (
          <SelectItem key={l} value={l} className="gap-2.5">
            <Flag lang={l} />
            <span className="flex-1">{LANG_NAME[l]}</span>
            <span className="mr-5 font-mono text-xs text-muted-foreground">{LANG_CODE[l]}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
