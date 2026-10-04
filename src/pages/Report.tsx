import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ArrowRight,
  Ban,
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
  Turtle,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { useRegion } from "@/state/RegionContext";
import { applyCitizenReport, scoreSite } from "@/engine/score";
import { PATHWAYS } from "@/engine/pathways";
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

const WARNING = "A citizen report does not confirm a harmful algal bloom. Laboratory or agency testing is required for confirmation.";

const GUIDE_ID = "guide";
const GUIDE_OPTIONS = ["Looks like a bloom", "Looks like a look-alike", "Not sure"];
const PICK_ONE = "Pick one";
const PICK_MANY = "Pick all that apply";
const pick = (ids: string[]) => ids.map((id) => reportFields.find((f) => f.id === id)).filter((f): f is ReportField => !!f);
const SLIME = pick(["algae"])[0];
const WATER = pick(["foam"])[0];
const ANIMALS = pick(["wildlife"])[0];
const MORE_FIELDS = pick(["riparian", "hydrology", "diptera", "ticks"]);
const STEP_TITLES = ["Where are you?", "What do you see?", "Check and send"];

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
  amphibians: Turtle,
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
    const fail = () => setLocMsg("Location unavailable. Pick a site below.");
    if (!("geolocation" in navigator)) return fail();
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const near = nearestSite(pos.coords.latitude, pos.coords.longitude, sites);
          if (!near) return fail();
          chooseSite(near.id);
          setLocMsg(`Nearest site: ${near.name}`);
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
        <p className="font-mono text-xs text-muted-foreground">Leading pathway: {PATHWAYS[current.leadingPathway].label}</p>
      </div>
      <p className="flex shrink-0 items-center gap-3 lg:items-baseline">
        <CountUp target={current.siteScore} className="font-heading text-[2rem] leading-none lg:text-[2.5rem]" />
        <RiskBadge category={current.category} />
      </p>
    </div>
  );

  /** Back, "Step n of 3" and Next. Fixed to the bottom edge below 1024px, an inline row above it. */
  const bar = (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] lg:static lg:z-auto lg:border-0 lg:bg-transparent lg:pb-0">
      <div className="mx-auto flex h-16 max-w-[640px] items-center gap-3 px-4 lg:h-auto lg:px-0">
        <div className="w-[88px] shrink-0">
          {step > 1 && (
            <Button type="button" variant="outline" className="h-11 w-full" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
        </div>
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <p className="font-mono text-xs text-muted-foreground">Step {step} of 3</p>
          <div className="flex w-full max-w-[96px] gap-1" aria-hidden>
            {[1, 2, 3].map((n) => (
              <span key={n} className={cn("h-[3px] flex-1 rounded-full", n <= step ? "bg-primary" : "bg-border")} />
            ))}
          </div>
        </div>
        <div className="flex w-[132px] shrink-0 justify-end">
          {step < 3 ? (
            <Button key="next" type="button" className="h-11 min-w-[120px]" onClick={next}>
              Next
            </Button>
          ) : (
            <Button key="submit" type="submit" className="h-11 min-w-[132px]">
              Submit report
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const tileGrid = (f: ReportField) =>
    f.options.length === 3 && f.options.every((o) => o.length <= 5) ? "grid-cols-3" : "grid-cols-2";

  const choiceField = (f: ReportField, title = f.question) => (
    <Question key={f.id} title={title} hint={f.multi ? PICK_MANY : PICK_ONE}>
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
              {o}
            </Tile>
          );
        })}
      </div>
      {f.id === "wildlife" && <p className="text-sm text-muted-foreground">Animals present: {animalsPresent ? "yes" : "no"}</p>}
    </Question>
  );

  const obs = observations();

  return (
    <div className="flex flex-col gap-8 pb-24 md:gap-12 lg:pb-0">
      <header className="flex max-w-[68ch] flex-col gap-2">
        <h1 className="text-[1.875rem] leading-[1.05] tracking-[-0.015em] md:text-[2.5rem]">Report a Bloom</h1>
        <p className="leading-[1.55] text-muted-foreground">
          Agencies sample a few points a few times a month. You see the water today. Your report raises this site's citizen evidence and can move it up the Sampling priority list.
        </p>
        <p className="w-fit rounded-[3px] border border-dashed border-border px-3 py-2 font-mono text-xs text-muted-foreground">
          Questions from the OneAquaHealth citizen-science stream survey, via a public copy not yet checked against the official OAH app.
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
        <aside
          className={cn(
            "rounded-[3px] border border-border bg-card p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] lg:sticky lg:top-[84px] lg:order-2 lg:w-[320px] lg:shrink-0",
            done && "lg:hidden",
          )}
        >
          {summary ?? <p className="text-sm text-muted-foreground">Choose a site to see its current risk score.</p>}
        </aside>

        <div className="w-full max-w-[640px] lg:order-1">
          {done ? (
            <div className="flex flex-col gap-6" role="status">
              <div className="flex flex-col gap-3">
                <p ref={successRef} tabIndex={-1} className="scroll-mt-24 font-heading text-2xl leading-[1.25] tracking-[-0.01em] outline-none">
                  Report received. Your observation has been added to the community monitoring layer.
                </p>
                <div className="flex items-center gap-3">
                  <Ripple className="size-12 shrink-0 text-primary/50" />
                  <p className="stamp verdant-stamp w-fit bg-card px-3 py-1.5 font-mono text-sm font-medium text-primary [--stamp-bg:var(--card)]">{`Report ${done.code}`}</p>
                </div>
                <p className="text-base">Your report is in the ranger queue.</p>
                <p className="text-base text-muted-foreground">A ranger reviews it next. Check My reports to see what they found.</p>
              </div>
              <div className="flex flex-col gap-3 rounded-[3px] border border-border border-l-[3px] border-l-primary bg-card p-4 md:p-6">
                <p className="text-sm text-muted-foreground">{done.site.name} risk score</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="font-heading text-[2rem] leading-none tabular-nums lining-nums text-muted-foreground line-through">{done.before}</span>
                  <ArrowRight className="size-6 text-muted-foreground" strokeWidth={1.75} aria-hidden />
                  <CountUp target={done.after} from={done.before} className="font-heading text-[3rem] leading-none md:text-[4.5rem]" />
                  <RiskBadge category={done.category} />
                </div>
                {done.evBefore !== null && done.evAfter !== null && (
                  <p className="text-sm">
                    Citizen evidence {done.evBefore} to {done.evAfter}. Your report added {done.after - done.before} points to this score.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <Link to={`/site/${done.site.id}`} className="w-fit text-sm font-medium text-primary underline underline-offset-[3px]">View updated site</Link>
                  <Link to="/" className="w-fit text-sm font-medium text-primary underline underline-offset-[3px]">See it on the dashboard</Link>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/my-reports" className={cn(buttonVariants(), "h-11 w-full px-4 sm:w-auto")}>
                    <ListChecks strokeWidth={1.75} aria-hidden />
                    Track it in My reports
                  </Link>
                  <Button type="button" variant="outline" className="h-11 w-full sm:w-auto" onClick={reset}>File another report</Button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
              <h2 ref={stepHeading} tabIndex={-1} className="scroll-mt-24 text-[1.5rem] leading-[1.15] tracking-[-0.01em] outline-none md:text-[1.75rem]">
                {STEP_TITLES[step - 1]}
              </h2>

              {step === 1 && (
                <>
                  <div className="flex flex-col gap-2">
                    <Button type="button" variant="outline" className="h-11 w-full sm:w-fit" onClick={useLocation}>
                      <LocateFixed strokeWidth={1.75} aria-hidden />
                      Use my location
                    </Button>
                    {locMsg && <p className="text-sm text-muted-foreground" role="status">{locMsg}</p>}
                  </div>
                  <fieldset ref={siteGroup} tabIndex={-1} className="flex flex-col gap-2 outline-none">
                    <legend className="sr-only">Site</legend>
                    <p className="text-[0.8125rem] leading-[1.4] text-muted-foreground">{PICK_ONE}</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Site">
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
                        Choose the place you are reporting from.
                      </p>
                    )}
                  </fieldset>
                </>
              )}

              {step === 2 && (
                <>
                  <p className="-mt-2 text-[0.9375rem] leading-[1.45] text-muted-foreground">Every question is optional. Skip what you are not sure about.</p>

                  <section className={SHEET}>
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="photo"
                        className="flex h-16 min-w-0 flex-1 cursor-pointer items-center justify-center gap-3 rounded-[3px] border-2 border-dashed border-input bg-card text-base font-medium transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background hover:bg-muted"
                      >
                        {photo ? (
                          <img src={photo} alt="Selected photo preview" className="size-12 rounded-[3px] border border-border object-cover" />
                        ) : (
                          <Camera className="size-6" strokeWidth={1.75} aria-hidden />
                        )}
                        {photo ? "Change photo" : "Add a photo"}
                        <input
                          id="photo"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="sr-only"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            setPhoto(f ? URL.createObjectURL(f) : null);
                          }}
                        />
                      </label>
                      <SpecimenTag className="shrink-0">Optional</SpecimenTag>
                    </div>
                    <p className="-mt-3 text-sm text-muted-foreground">Photo stays on your device</p>
                  </section>

                  <InkRule className="text-border" />

                  <section className={SHEET}>
                    <BloomGuide />
                    <Question title="Which matches what you see?" hint={PICK_ONE}>
                      <div className="grid grid-cols-1 gap-2" role="radiogroup" aria-label="Which matches what you see?">
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
                            {o}
                          </Tile>
                        ))}
                      </div>
                    </Question>
                  </section>

                  <InkRule className="text-border" />

                  <section className={SHEET}>
                    <h3 className={SHEET_TITLE}>Water and animals</h3>
                    {choiceField(SLIME)}
                    {choiceField(WATER)}
                    {choiceField(ANIMALS)}
                  </section>

                  <details className="group rounded-[3px] border border-border bg-card px-4">
                    <summary className="flex min-h-12 cursor-pointer items-center text-base font-medium">More questions (optional)</summary>
                    <div className="flex flex-col gap-6 pt-2 pb-4">{MORE_FIELDS.map((f) => choiceField(f))}</div>
                  </details>
                </>
              )}

              {step === 3 && (
                <>
                  <section className={SHEET}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-muted-foreground">Site</p>
                        <p className="font-heading text-xl leading-[1.3]">{site?.name}</p>
                      </div>
                      <button type="button" className="min-h-11 shrink-0 text-sm font-medium text-primary underline underline-offset-[3px]" onClick={() => setStep(1)}>
                        Edit
                      </button>
                    </div>
                    <InkRule className="-my-2 text-border" />
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 flex-col gap-2">
                        <p className="font-mono text-xs text-muted-foreground">Photo and answers</p>
                        {photo ? (
                          <img src={photo} alt="Selected photo preview" className="size-16 rounded-[3px] border border-border object-cover" />
                        ) : (
                          <p className="text-[0.9375rem]">No photo</p>
                        )}
                        {photo && <p className="sr-only">Photo added</p>}
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
                          <p className="text-[0.9375rem] text-muted-foreground">No answers added.</p>
                        )}
                      </div>
                      <button type="button" className="min-h-11 shrink-0 text-sm font-medium text-primary underline underline-offset-[3px]" onClick={() => setStep(2)}>
                        Edit
                      </button>
                    </div>
                  </section>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="notes">Anything else? (optional)</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                  </div>
                  <Alert className="rounded-[3px] border-border bg-muted text-foreground">
                    <TriangleAlert />
                    <AlertDescription className="text-foreground">{WARNING}</AlertDescription>
                  </Alert>
                </>
              )}

              {bar}
            </form>
          )}
          <section className="mt-8 flex max-w-[68ch] flex-col gap-2 pt-2">
            <InkRule className="mb-4 text-border" />
            <h2 className="text-[1.5rem] leading-[1.2]">Why citizen observations matter</h2>
            <p className="leading-[1.55]">Agencies sample a lake at a few points and a few times a month. Reports from people at the shore fill the gaps between those samples. Several reports at one site are a reason to look there sooner.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
