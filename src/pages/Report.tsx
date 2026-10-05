import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ArrowRight,
  Ban,
  Leaf,
  Bird,
  Camera,
  Check,
  CircleHelp,
  Droplet,
  Droplets,
  Fish,
  ListChecks,
  LocateFixed,
  Palette,
  TriangleAlert,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { useRegion } from "@/state/RegionContext";
import { applyCitizenReport, scoreSite } from "@/engine/score";
import { PATHWAY_LABEL } from "@/engine/explain";
import { fmt } from "@/i18n/lang";
import { REPORT } from "@/i18n/report";
import { useLang, useStrings } from "@/state/LanguageContext";
import { RiskBadge } from "@/components/RiskBadge";
import { BloomGuide, GuideThumb } from "@/components/BloomGuide";
import { InkRule, Ripple, SpecimenTag } from "@/components/FieldMarks";
import { citizenEvidence } from "@/lib/communityReports";
import { nearestSite, reportCode } from "@/lib/reportLoop";
import { toggleExclusive } from "@/lib/toggleExclusive";
import { useCountUp } from "@/lib/useCountUp";
import { cn } from "@/lib/utils";
import { reportFields, type ReportField } from "@/data/reportFields";
import type { CitizenReport, Category, SiteRecord } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Answers = Record<string, string[]>;
type Done = {
  site: SiteRecord;
  before: number;
  after: number;
  category: Category;
  evBefore: number | null;
  evAfter: number | null;
  code: string;
};

function CountUp({ target, from, className }: { target: number; from?: number; className?: string }) {
  const ref = useCountUp(target, from);
  return <span ref={ref} className={cn("inline-block min-w-[2ch] tabular-nums lining-nums", className)} />;
}

const GUIDE_ID = "guide";
const GUIDE_OPTIONS = ["Looks like a bloom", "Looks like a look-alike", "Not sure"];
const pick = (ids: string[]) => ids.map((id) => reportFields.find((f) => f.id === id)).filter((f): f is ReportField => !!f);
const SLIME = pick(["algae"])[0];
const WATER = pick(["foam"])[0];
const ANIMALS = pick(["wildlife"])[0];
const MORE_FIELDS = pick(["riparian", "hydrology", "diptera", "ticks"]);

const SHEET = "flex flex-col gap-5 rounded-[3px] border border-border bg-card p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] md:p-6";
const SHEET_TITLE = "text-xl leading-[1.3]";
const OPTION_ICON: Record<string, LucideIcon> = {
  normal: Droplet,
  foam: Waves,
  colour: Palette,
  "sewage-smell": Wind,
  "oil-sheen": Droplets,
  none: Ban,
  fish: Fish,
  amphibians: Leaf,
  birds: Bird,
};

/** One answer tile. Radio tiles are round and checkbox tiles are square, so the two kinds read apart without words. */
function Tile({
  kind,
  selected,
  onClick,
  icon,
  children,
}: {
  kind: "radio" | "check";
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role={kind === "radio" ? "radio" : "checkbox"}
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex min-h-12 w-full items-center gap-2.5 rounded-[3px] border-2 px-3 py-2 text-left text-[0.9375rem] font-medium leading-[1.25] outline-none transition-colors duration-[120ms] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px",
        selected ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted",
      )}
    >
      {kind === "radio" ? (
        <span className={cn("grid size-5 shrink-0 place-content-center rounded-full border-[1.5px]", selected ? "border-primary" : "border-input")} aria-hidden>
          {selected && <span className="size-2.5 rounded-full bg-primary" />}
        </span>
      ) : (
        <span
          className={cn("grid size-5 shrink-0 place-content-center rounded-[3px] border-[1.5px]", selected ? "border-primary bg-primary text-primary-foreground" : "border-input")}
          aria-hidden
        >
          {selected && <Check className="size-3.5" strokeWidth={3} />}
        </span>
      )}
      {icon}
      <span className="min-w-0 flex-1 first-letter:uppercase">{children}</span>
    </button>
  );
}

function Question({
  title,
  hint,
  error,
  children,
}: {
  title: string;
  hint: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-base font-medium leading-[1.4]">{title}</legend>
      <p className="text-[0.8125rem] leading-[1.4] text-muted-foreground">{hint}</p>
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export default function Report() {
  const s = useStrings(REPORT);
  const { lang } = useLang();
  const L: Record<string, string> = s;
  const fieldLabel = (f: ReportField) => L[`field:${f.id}`] ?? f.label;
  const optLabel = (o: string) => L[`o:${o}`] ?? o;
  const stepTitles = [s.step1, s.step2, s.step3];
  const { config, sites, addReport } = useRegion();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [siteId, setSiteId] = useState(() => {
    const q = params.get("site") ?? "";
    return sites.some((s) => s.id === q) ? q : "";
  });
  const [answers, setAnswers] = useState<Answers>({});
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [locMsg, setLocMsg] = useState("");
  const [siteError, setSiteError] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const siteGroup = useRef<HTMLFieldSetElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const prev = useRef({ step, done });

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);
  useEffect(() => {
    if (prev.current.step === step && prev.current.done === done) return;
    prev.current = { step, done };
    const el = done ? successRef.current : stepHeading.current;
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({ block: "start" });
  }, [step, done]);

  const site = sites.find((s) => s.id === siteId);
  const current = site ? scoreSite(site, config) : null;
  const wildlife = answers.wildlife ?? [];
  const animalsPresent = wildlife.some((a) => a !== "none");

  const setOne = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: a[id]?.[0] === v ? [] : [v] }));
  const toggleMulti = (f: ReportField, opt: string) =>
    setAnswers((a) => ({ ...a, [f.id]: toggleExclusive(a[f.id] ?? [], opt, f.exclusive ?? "") }));
  const chooseSite = (id: string) => {
    setSiteId(id);
    setSiteError(false);
  };

  const useLocation = () => {
    const fail = () => setLocMsg(s.locUnavailable);
    if (!("geolocation" in navigator)) return fail();
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const near = nearestSite(pos.coords.latitude, pos.coords.longitude, sites);
          if (!near) return fail();
          chooseSite(near.id);
          setLocMsg(fmt(s.nearest, { name: near.name }));
        },
        fail,
        { timeout: 8000 },
      );
    } catch {
      fail();
    }
  };

  const observations = () => {
    const out: [string, string][] = [];
    if (answers[GUIDE_ID]?.[0]) out.push(["Guide match", answers[GUIDE_ID][0]]);
    for (const f of reportFields) if ((answers[f.id] ?? []).length > 0) out.push([f.label, answers[f.id].join(", ")]);
    return out;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step !== 3 || !site || !current) return;
    const report: CitizenReport = {
      id: `user-${Date.now()}`,
      siteId: site.id,
      observationTypes: observations().map(([k, v]) => `${k}: ${v}`),
      animalsPresent,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      dataTag: "user-submitted",
    };
    const before = current.siteScore;
    const afterResult = scoreSite(applyCitizenReport({ ...site, reports: [...(site.reports ?? []), report] }), config);
    addReport(report);
    setDone({
      site,
      before,
      after: afterResult.siteScore,
      category: afterResult.category,
      evBefore: citizenEvidence(current)?.value ?? null,
      evAfter: citizenEvidence(afterResult)?.value ?? null,
      code: reportCode(report),
    });
  };

  const reset = () => {
    setDone(null);
    setStep(1);
    setSiteId("");
    setAnswers({});
    setNotes("");
    setPhoto(null);
    setLocMsg("");
    setSiteError(false);
  };

  const next = () => {
    if (step === 1 && !site) {
      setSiteError(true);
      siteGroup.current?.focus();
      siteGroup.current?.scrollIntoView({ block: "center" });
      return;
    }
    setStep(step + 1);
  };

  const summary = current && site && (
    <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-stretch lg:gap-1">
      <div className="min-w-0">
        <p className="font-heading text-xl leading-[1.3]">{site.name}</p>
        <p className="font-mono text-xs text-muted-foreground">{fmt(s.leadingPathway, { pathway: PATHWAY_LABEL[lang][current.leadingPathway] })}</p>
      </div>
      <p className="flex shrink-0 items-center gap-3 lg:items-baseline">
        <CountUp target={current.siteScore} className="font-heading text-[2rem] leading-none lg:text-[2.5rem]" />
        <RiskBadge category={current.category} />
      </p>
    </div>
  );

  /** Back, "Step n of 3" and Next. Sticks to the bottom edge below 1024px, an inline row above it. */
  const bar = (
    <div className="sticky bottom-0 z-30 -mx-4 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:-mx-6 lg:static lg:z-auto lg:mx-0 lg:border-0 lg:bg-transparent lg:pb-0">
      <div className="mx-auto flex h-16 max-w-[640px] items-center gap-3 px-4 lg:h-auto lg:px-0">
        <div className="w-[88px] shrink-0">
          {step > 1 && (
            <Button type="button" variant="outline" className="h-11 w-full" onClick={() => setStep(step - 1)}>
              {s.back}
            </Button>
          )}
        </div>
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <p className="font-mono text-xs text-muted-foreground">{fmt(s.stepOf, { n: step })}</p>
          <div className="flex w-full max-w-[96px] gap-1" aria-hidden>
            {[1, 2, 3].map((n) => (
              <span key={n} className={cn("h-[3px] flex-1 rounded-full", n <= step ? "bg-primary" : "bg-border")} />
            ))}
          </div>
        </div>
        <div className="flex w-[132px] shrink-0 justify-end">
          {step < 3 ? (
            <Button key="next" type="button" className="h-11 min-w-[120px]" onClick={next}>
              {s.next}
            </Button>
          ) : (
            <Button key="submit" type="submit" className="h-11 min-w-[132px]">
              {s.submit}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const tileGrid = (f: ReportField) =>
    f.options.length === 3 && f.options.every((o) => optLabel(o).length <= 5) ? "grid-cols-3" : "grid-cols-2";

  const choiceField = (f: ReportField, title = L[`q:${f.id}`] ?? f.question) => (
    <Question key={f.id} title={title} hint={f.multi ? s.pickMany : s.pickOne}>
      <div className={cn("grid gap-2", tileGrid(f))} role={f.multi ? "group" : "radiogroup"} aria-label={title}>
        {f.options.map((o) => {
          const Icon = f.id === "algae" ? undefined : OPTION_ICON[o];
          return (
            <Tile
              key={o}
              kind={f.multi ? "check" : "radio"}
              selected={(answers[f.id] ?? []).includes(o)}
              onClick={() => (f.multi ? toggleMulti(f, o) : setOne(f.id, o))}
              icon={Icon && <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden />}
            >
              {optLabel(o)}
            </Tile>
          );
        })}
      </div>
      {f.id === "wildlife" && <p className="text-sm text-muted-foreground">{fmt(s.animalsPresent, { answer: animalsPresent ? s.yes : s.no })}</p>}
    </Question>
  );

  const obs = observations().map(([k, v]): [string, string] => {
    const field = reportFields.find((f) => f.label === k);
    return k === "Guide match"
      ? [s.guideMatch, v.split(", ").map((x) => L[`guide:${x}`] ?? x).join(", ")]
      : [field ? fieldLabel(field) : k, v.split(", ").map(optLabel).join(", ")];
  });

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <header className="flex max-w-[68ch] flex-col gap-2">
        <h1 className="text-[1.875rem] leading-[1.05] tracking-[-0.015em] md:text-[2.5rem]">{s.title}</h1>
        <p className="leading-[1.55] text-muted-foreground">{s.intro}</p>
        <p className="w-fit rounded-[3px] border border-dashed border-border px-3 py-2 font-mono text-xs text-muted-foreground">{s.source}</p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
        <aside
          className={cn(
            "rounded-[3px] border border-border bg-card p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] lg:sticky lg:top-[84px] lg:order-2 lg:w-[320px] lg:shrink-0",
            done && "lg:hidden",
          )}
        >
          {summary ?? <p className="text-sm text-muted-foreground">{s.chooseSiteSummary}</p>}
        </aside>

        <div className="w-full max-w-[640px] lg:order-1">
          {done ? (
            <div className="flex flex-col gap-6" role="status">
              <div className="flex flex-col gap-3">
                <p ref={successRef} tabIndex={-1} className="scroll-mt-24 font-heading text-2xl leading-[1.25] tracking-[-0.01em] outline-none">
                  {s.received}
                </p>
                <div className="flex items-center gap-3">
                  <Ripple className="size-12 shrink-0 text-primary/50" />
                  <p className="stamp verdant-stamp w-fit bg-card px-3 py-1.5 font-mono text-sm font-medium text-primary [--stamp-bg:var(--card)]">{fmt(s.reportCode, { code: done.code })}</p>
                </div>
                <p className="text-base">{s.inQueue}</p>
                <p className="text-base text-muted-foreground">{s.rangerNext}</p>
              </div>
              <div className="flex flex-col gap-3 rounded-[3px] border border-border border-l-[3px] border-l-primary bg-card p-4 md:p-6">
                <p className="text-sm text-muted-foreground">{fmt(s.siteRiskScore, { site: done.site.name })}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="font-heading text-[2rem] leading-none tabular-nums lining-nums text-muted-foreground line-through">{done.before}</span>
                  <ArrowRight className="size-6 text-muted-foreground" strokeWidth={1.75} aria-hidden />
                  <CountUp target={done.after} from={done.before} className="font-heading text-[3rem] leading-none md:text-[4.5rem]" />
                  <RiskBadge category={done.category} />
                </div>
                {done.evBefore !== null && done.evAfter !== null && (
                  <p className="text-sm">
                    {fmt(s.evidenceLine, { before: done.evBefore, after: done.evAfter, points: done.after - done.before })}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <Link to={`/site/${done.site.id}`} className="w-fit text-sm font-medium text-primary underline underline-offset-[3px]">{s.viewSite}</Link>
                  <Link to="/" className="w-fit text-sm font-medium text-primary underline underline-offset-[3px]">{s.seeDashboard}</Link>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/my-reports" className={cn(buttonVariants(), "h-11 w-full px-4 sm:w-auto")}>
                    <ListChecks strokeWidth={1.75} aria-hidden />
                    {s.trackIt}
                  </Link>
                  <Button type="button" variant="outline" className="h-11 w-full sm:w-auto" onClick={reset}>{s.another}</Button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
              <h2 ref={stepHeading} tabIndex={-1} className="scroll-mt-24 text-[1.5rem] leading-[1.15] tracking-[-0.01em] outline-none md:text-[1.75rem]">
                {stepTitles[step - 1]}
              </h2>

              {step === 1 && (
                <>
                  <div className="flex flex-col gap-2">
                    <Button type="button" variant="outline" className="h-11 w-full sm:w-fit" onClick={useLocation}>
                      <LocateFixed strokeWidth={1.75} aria-hidden />
                      {s.useLocation}
                    </Button>
                    {locMsg && <p className="text-sm text-muted-foreground" role="status">{locMsg}</p>}
                  </div>
                  <fieldset ref={siteGroup} tabIndex={-1} className="flex flex-col gap-2 outline-none">
                    <legend className="sr-only">{s.site}</legend>
                    <p className="text-[0.8125rem] leading-[1.4] text-muted-foreground">{s.pickOne}</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label={s.site}>
                      {sites.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          role="radio"
                          aria-checked={s.id === siteId}
                          onClick={() => chooseSite(s.id)}
                          className={cn(
                            "flex min-h-14 items-center gap-3 rounded-[3px] border-2 px-3 py-2 text-left outline-none transition-colors duration-[120ms] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px",
                            s.id === siteId ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted",
                          )}
                        >
                          <span
                            className={cn("grid size-5 shrink-0 place-content-center rounded-full border-[1.5px]", s.id === siteId ? "border-primary" : "border-input")}
                            aria-hidden
                          >
                            {s.id === siteId && <span className="size-2.5 rounded-full bg-primary" />}
                          </span>
                          <span className="min-w-0 flex-1 text-base font-semibold leading-[1.25]">{s.name}</span>
                          <RiskBadge category={scoreSite(s, config).category} size="sm" />
                        </button>
                      ))}
                    </div>
                    {siteError && (
                      <p className="text-sm text-destructive" role="alert">
                        {s.siteError}
                      </p>
                    )}
                  </fieldset>
                </>
              )}

              {step === 2 && (
                <>
                  <p className="-mt-2 text-[0.9375rem] leading-[1.45] text-muted-foreground">{s.optionalNote}</p>

                  <section className={SHEET}>
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="photo"
                        className="flex h-16 min-w-0 flex-1 cursor-pointer items-center justify-center gap-3 rounded-[3px] border-2 border-dashed border-input bg-card text-base font-medium transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background hover:bg-muted"
                      >
                        {photo ? (
                          <img src={photo} alt={s.photoPreviewAlt} className="size-12 rounded-[3px] border border-border object-cover" />
                        ) : (
                          <Camera className="size-6" strokeWidth={1.75} aria-hidden />
                        )}
                        {photo ? s.changePhoto : s.addPhoto}
                        <input
                          id="photo"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            setPhoto(f ? URL.createObjectURL(f) : null);
                          }}
                        />
                      </label>
                      <SpecimenTag className="shrink-0">{s.optional}</SpecimenTag>
                    </div>
                    <p className="-mt-3 text-sm text-muted-foreground">{s.photoStays}</p>
                  </section>

                  <InkRule className="text-border" />

                  <section className={SHEET}>
                    <BloomGuide />
                    <Question title={s.guideQuestion} hint={s.pickOne}>
                      <div className="grid grid-cols-1 gap-2" role="radiogroup" aria-label={s.guideQuestion}>
                        {GUIDE_OPTIONS.map((o, i) => (
                          <Tile
                            key={o}
                            kind="radio"
                            selected={answers[GUIDE_ID]?.[0] === o}
                            onClick={() => setOne(GUIDE_ID, o)}
                            icon={
                              i === 0 ? <GuideThumb kind="bloom" /> : i === 1 ? <GuideThumb kind="lookalike" /> : <CircleHelp className="size-7 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
                            }
                          >
                            {L[`guide:${o}`]}
                          </Tile>
                        ))}
                      </div>
                    </Question>
                  </section>

                  <InkRule className="text-border" />

                  <section className={SHEET}>
                    <h3 className={SHEET_TITLE}>{s.waterAnimals}</h3>
                    {choiceField(SLIME)}
                    {choiceField(WATER)}
                    {choiceField(ANIMALS)}
                  </section>

                  <details className="group rounded-[3px] border border-border bg-card px-4">
                    <summary className="flex min-h-12 cursor-pointer items-center text-base font-medium">{s.moreQuestions}</summary>
                    <div className="flex flex-col gap-6 pt-2 pb-4">{MORE_FIELDS.map((f) => choiceField(f))}</div>
                  </details>
                </>
              )}

              {step === 3 && (
                <>
                  <section className={SHEET}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-muted-foreground">{s.site}</p>
                        <p className="font-heading text-xl leading-[1.3]">{site?.name}</p>
                      </div>
                      <button type="button" className="min-h-11 shrink-0 text-sm font-medium text-primary underline underline-offset-[3px]" onClick={() => setStep(1)}>
                        {s.edit}
                      </button>
                    </div>
                    <InkRule className="-my-2 text-border" />
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 flex-col gap-2">
                        <p className="font-mono text-xs text-muted-foreground">{s.reviewPhotoAnswers}</p>
                        {photo ? (
                          <img src={photo} alt={s.photoPreviewAlt} className="size-16 rounded-[3px] border border-border object-cover" />
                        ) : (
                          <p className="text-[0.9375rem]">{s.noPhoto}</p>
                        )}
                        {photo && <p className="sr-only">{s.photoAdded}</p>}
                        {obs.length > 0 ? (
                          <ul className="flex flex-col gap-1 text-[0.9375rem] leading-[1.4]">
                            {obs.map(([k, v]) => (
                              <li key={k}>
                                <span className="text-muted-foreground">{k}: </span>
                                {v}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[0.9375rem] text-muted-foreground">{s.noAnswers}</p>
                        )}
                      </div>
                      <button type="button" className="min-h-11 shrink-0 text-sm font-medium text-primary underline underline-offset-[3px]" onClick={() => setStep(2)}>
                        {s.edit}
                      </button>
                    </div>
                  </section>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="notes">{s.anythingElse}</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                  </div>
                  <Alert className="rounded-[3px] border-border bg-muted text-foreground">
                    <TriangleAlert />
                    <AlertDescription className="text-foreground">{s.warning}</AlertDescription>
                  </Alert>
                </>
              )}

              {bar}
            </form>
          )}
          <section className="mt-8 flex max-w-[68ch] flex-col gap-2 pt-2">
            <InkRule className="mb-4 text-border" />
            <h2 className="text-[1.5rem] leading-[1.2]">{s.whyTitle}</h2>
            <p className="leading-[1.55]">{s.whyBody}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
