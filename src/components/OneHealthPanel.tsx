import { Leaf, PawPrint, User } from "lucide-react";
import { SITE_DETAIL } from "@/i18n/siteDetail";
import { useLang } from "@/state/LanguageContext";

const COLUMNS = [
  { icon: Leaf, title: "environment", text: "environmentText" },
  { icon: User, title: "humanHealth", text: "humanHealthText" },
  { icon: PawPrint, title: "animalHealth", text: "animalHealthText" },
] as const;

export function OneHealthPanel({ lakeMead }: { lakeMead: boolean }) {
  const s = SITE_DETAIL[useLang().lang];
  return (
    <section aria-labelledby="one-health" className="">
      <h2 id="one-health" className="text-[1.75rem] leading-[1.15] tracking-[-0.01em]">
        {s.oneHealth}
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3 md:gap-8">
        {COLUMNS.map(({ icon: Icon, title, text }) => (
          <div key={title}>
            <h3 className="flex items-center gap-2 text-xl leading-[1.3]">
              <Icon className="size-5 text-olive" strokeWidth={1.75} aria-hidden />
              {s[title]}
            </h3>
            <p className="mt-2 text-sm leading-[1.45] text-muted-foreground">{s[text]}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 max-w-[68ch]">
        <h3 className="text-xl leading-[1.3]">{s.visitorGuidance}</h3>
        <p className="mt-2 leading-[1.55]">
          {lakeMead ? s.guidanceMead : s.guidanceGeneric}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {s.guidanceNote}
        </p>
      </div>
    </section>
  );
}
