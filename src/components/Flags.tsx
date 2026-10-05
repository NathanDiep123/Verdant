import type { ReactNode } from "react";
import type { Lang } from "@/i18n/lang";
import { cn } from "@/lib/utils";

const stripes = Array.from({ length: 7 }, (_, i) => i * 2);
const dots = [0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => [1 + c * 2, 1.25 + r * 2.5] as const));

const ART: Record<Lang, ReactNode> = {
  en: (
    <>
      <rect width="20" height="14" fill="#fff" />
      {stripes.map((y) => (
        <rect key={y} y={y} width="20" height="1" fill="#B31942" />
      ))}
      <rect width="8" height="7.5" fill="#0A3161" />
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.45" fill="#fff" />
      ))}
    </>
  ),
  pt: (
    <>
      <rect width="8" height="14" fill="#046A38" />
      <rect x="8" width="12" height="14" fill="#DA291C" />
      <circle cx="8" cy="7" r="2.6" fill="none" stroke="#FFE900" strokeWidth="0.9" />
      <rect x="6.9" y="5.7" width="2.2" height="2.6" fill="#fff" />
      <rect x="7.3" y="6.1" width="1.4" height="1.8" fill="#DA291C" />
    </>
  ),
  es: (
    <>
      <rect width="20" height="14" fill="#AA151B" />
      <rect y="3.5" width="20" height="7" fill="#F1BF00" />
    </>
  ),
};

export function Flag({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 14"
      width="20"
      height="14"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0 rounded-[1px] ring-1 ring-foreground/25", className)}
    >
      {ART[lang]}
    </svg>
  );
}
