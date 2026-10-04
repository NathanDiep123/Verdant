import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowRight, Camera, Check, ListChecks, LocateFixed, TriangleAlert } from "lucide-react";
import { useRegion } from "@/state/RegionContext";
import { applyCitizenReport, scoreSite } from "@/engine/score";
import { PATHWAYS } from "@/engine/pathways";
import { RiskBadge } from "@/components/RiskBadge";
import { BloomGuide } from "@/components/BloomGuide";
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
  return <span ref={ref} className={className} />;
}

const WARNING = "A citizen report does not confirm a harmful algal bloom. Laboratory or agency testing is required for confirmation.";

const GUIDE_ID = "guide";
const GUIDE_OPTIONS = ["Looks like a bloom", "Looks like a look-alike", "Not sure"];
const pick = (ids: string[]) => ids.map((id) => reportFields.find((f) => f.id === id)).filter((f): f is ReportField => !!f);
const MAIN_FIELDS = pick(["algae", "foam", "wildlife"]);
const MORE_FIELDS = pick(["riparian", "hydrology", "diptera", "ticks"]);
const STEP_TITLES = ["Where are you?", "What do you see?", "Check and send"];

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex min-h-12 items-center justify-between gap-3 rounded-sm border-2 px-4 py-2 text-left text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        selected ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted",
      )}
    >
      <span className="first-letter:uppercase">{children}</span>
      {selected && <Check className="size-5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />}
    </button>
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
  const [done, setDone] = useState<Done | null>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
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

  const useLocation = () => {
    const fail = () => setLocMsg("Location unavailable. Pick a site below.");
    if (!("geolocation" in navigator)) return fail();
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const near = nearestSite(pos.coords.latitude, pos.coords.longitude, sites);
          if (!near) return fail();
          setSiteId(near.id);
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
  };

  const summary = current && site && (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-muted-foreground">{site.name}</p>
      <p className="flex items-baseline gap-3">
        <CountUp target={current.siteScore} className="font-mono text-[28px] font-semibold leading-none tabular-nums lg:text-[40px]" />
        <RiskBadge category={current.category} />
      </p>
      <p className="font-mono text-xs text-muted-foreground">Leading pathway: {PATHWAYS[current.leadingPathway].label}</p>
    </div>
  );

  const nav = (next: boolean, nextDisabled = false) => (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {step > 1 && (
        <Button type="button" variant="outline" className="h-11 w-full sm:w-auto sm:min-w-24" onClick={() => setStep(step - 1)}>Back</Button>
      )}
      {next ? (
        <Button type="button" className="h-11 w-full sm:w-auto sm:min-w-24" disabled={nextDisabled} onClick={() => setStep(step + 1)}>Next</Button>
      ) : (
        <Button type="submit" className="h-11 w-full sm:w-auto sm:min-w-32">Submit report</Button>
      )}
    </div>
  );

  const choiceField = (f: ReportField) => (
    <fieldset key={f.id} className="flex flex-col gap-2">
      <legend className="mb-2 text-base font-medium">{f.question}</legend>
      <div className={cn("grid grid-cols-1 gap-2", f.options.length === 3 ? "min-[420px]:grid-cols-3" : "min-[420px]:grid-cols-2")}>
        {f.options.map((o) => (
          <Choice key={o} selected={(answers[f.id] ?? []).includes(o)} onClick={() => (f.multi ? toggleMulti(f, o) : setOne(f.id, o))}>{o}</Choice>
        ))}
      </div>
      {f.id === "wildlife" && <p className="text-sm text-muted-foreground">Animals present: {animalsPresent ? "yes" : "no"}</p>}
    </fieldset>
  );

  const summaryRows: [string, string][] = [["Site", site?.name ?? ""], ["Photo", photo ? "Photo added" : "No photo"], ...observations()];

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <header className="flex max-w-[68ch] flex-col gap-2">
        <h1 className="text-[28px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[40px]">Report a Bloom</h1>
        <p className="leading-[1.55] text-muted-foreground">
          Agencies sample a few points a few times a month. You see the water today. Your report raises this site's citizen evidence and can move it up the Sampling priority list.
        </p>
        <p className="w-fit rounded-sm border border-dashed border-border px-3 py-2 font-mono text-xs text-muted-foreground">
          Questions from the OneAquaHealth citizen-science stream survey, via a public copy not yet checked against the official OAH app.
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
        <aside className={cn("border border-border bg-card p-4 lg:sticky lg:top-[84px] lg:order-2 lg:w-[320px] lg:shrink-0", done && "lg:hidden")}>
          {summary ?? <p className="text-sm text-muted-foreground">Choose a site to see its current risk score.</p>}
        </aside>

        <div className="w-full max-w-[640px] lg:order-1">
          {done ? (
            <div className="flex flex-col gap-6" role="status">
              <div className="flex flex-col gap-2">
                <p ref={successRef} tabIndex={-1} className="scroll-mt-24 text-xl font-semibold leading-[1.3] outline-none">Report received. Your observation has been added to the community monitoring layer.</p>
                <p className="font-mono text-sm">Report {done.code}</p>
                <p className="text-base">Your report is in the ranger queue.</p>
                <p className="text-base text-muted-foreground">A ranger reviews it next. Check My reports to see what they found.</p>
              </div>
              <div className="flex flex-col gap-3 border border-border border-l-[3px] border-l-primary bg-card p-4 md:p-6">
                <p className="text-sm text-muted-foreground">{done.site.name} risk score</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="font-mono text-[28px] font-semibold leading-none tabular-nums text-muted-foreground line-through">{done.before}</span>
                  <ArrowRight className="size-6 text-muted-foreground" strokeWidth={1.75} aria-hidden />
                  <CountUp target={done.after} from={done.before} className="font-mono text-[48px] font-semibold leading-none tabular-nums md:text-[72px]" />
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
                  <Link to={`/site/${done.site.id}`} className="w-fit text-sm font-medium text-primary underline underline-offset-4">View updated site</Link>
                  <Link to="/" className="w-fit text-sm font-medium text-primary underline underline-offset-4">See it on the dashboard</Link>
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
            <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <p className="font-mono text-xs text-muted-foreground">Step {step} of 3</p>
                  <div className="flex w-[120px] gap-1" aria-hidden>
                    {[1, 2, 3].map((n) => (
                      <span key={n} className={cn("h-1 flex-1 rounded-full", n <= step ? "bg-primary" : "bg-border")} />
                    ))}
                  </div>
                </div>
                <h2 ref={stepHeading} tabIndex={-1} className="scroll-mt-24 text-xl font-semibold leading-[1.3] outline-none">{STEP_TITLES[step - 1]}</h2>
              </div>

              {step === 1 && (
                <>
                  <div className="flex flex-col gap-2">
                    <Button type="button" variant="outline" className="h-11 w-full sm:w-fit" onClick={useLocation}>
                      <LocateFixed strokeWidth={1.75} aria-hidden />
                      Use my location
                    </Button>
                    {locMsg && <p className="text-sm text-muted-foreground" role="status">{locMsg}</p>}
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {sites.map((s) => {
                      const sel = s.id === siteId;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          aria-pressed={sel}
                          onClick={() => setSiteId(s.id)}
                          className={cn(
                            "flex min-h-14 items-center justify-between gap-3 rounded-sm border-2 px-4 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                            sel ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted",
                          )}
                        >
                          <span className="flex items-center gap-2 text-base font-semibold">
                            {sel && <Check className="size-5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />}
                            {s.name}
                          </span>
                          <RiskBadge category={scoreSite(s, config).category} />
                        </button>
                      );
                    })}
                  </div>
                  {nav(true, !site)}
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="photo"
                      className="flex h-24 w-full cursor-pointer items-center justify-center gap-3 rounded-sm border border-dashed border-border bg-card text-base font-medium focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring hover:bg-muted"
                    >
                      <Camera className="size-6" strokeWidth={1.75} aria-hidden />
                      Add a photo
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
                    <p className="text-sm text-muted-foreground">Photo stays on your device</p>
                    {photo && <img src={photo} alt="Selected photo preview" className="max-h-48 w-fit rounded-sm border border-border" />}
                  </div>

                  <BloomGuide />

                  <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 text-base font-medium">Which matches what you see?</legend>
                    <div className="grid grid-cols-1 gap-2">
                      {GUIDE_OPTIONS.map((o) => (
                        <Choice key={o} selected={answers[GUIDE_ID]?.[0] === o} onClick={() => setOne(GUIDE_ID, o)}>{o}</Choice>
                      ))}
                    </div>
                  </fieldset>

                  {MAIN_FIELDS.map(choiceField)}

                  <details className="border-t border-border pt-2">
                    <summary className="flex min-h-11 cursor-pointer items-center text-base font-medium">More questions (optional)</summary>
                    <div className="mt-4 flex flex-col gap-6">{MORE_FIELDS.map(choiceField)}</div>
                  </details>

                  {nav(true)}
                </>
              )}

              {step === 3 && (
                <>
                  <dl className="flex flex-col border border-border bg-card">
                    {summaryRows.map(([k, v], i) => (
                      <div key={`${k}-${i}`} className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-border px-4 py-3 last:border-b-0">
                        <dt className="text-sm text-muted-foreground">{k}</dt>
                        <dd className="text-base font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="notes">Anything else? (optional)</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
                  </div>
                  <Alert className="rounded-sm border-border bg-muted text-foreground">
                    <TriangleAlert />
                    <AlertDescription className="text-foreground">{WARNING}</AlertDescription>
                  </Alert>
                  {nav(false)}
                </>
              )}
            </form>
          )}
          <section className="mt-8 flex max-w-[68ch] flex-col gap-2 border-t border-border pt-6">
            <h2 className="text-xl font-semibold leading-[1.3]">Why citizen observations matter</h2>
            <p className="leading-[1.55]">Agencies sample a lake at a few points and a few times a month. Reports from people at the shore fill the gaps between those samples. Several reports at one site are a reason to look there sooner.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
