import { COMMON } from "@/i18n/common";
import { useLang, useStrings } from "@/state/LanguageContext";
import { cn } from "@/lib/utils";

export function EnglishOnlyNote({ className }: { className?: string }) {
  const s = useStrings(COMMON);
  const { lang } = useLang();
  if (lang === "en") return null;
  return (
    <p className={cn("font-mono text-xs text-muted-foreground", className)}>
      {s.englishOnly}
    </p>
  );
}
