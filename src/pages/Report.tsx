import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { useRegion } from "@/state/RegionContext";
import { applyCitizenReport, scoreSite } from "@/engine/score";
import { PATHWAYS } from "@/engine/pathways";
import { RiskBadge } from "@/components/RiskBadge";
import { citizenEvidence } from "@/lib/communityReports";
import { useCountUp } from "@/lib/useCountUp";
import { reportFields } from "@/data/reportFields";
import type { CitizenReport, Category, SiteRecord } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Answers = Record<string, string[]>;
type Done = {
  site: SiteRecord;
  before: number;
  after: number;
  category: Category;
  evBefore: number | null;
  evAfter: number | null;
};

function CountUp({ target, from, className }: { target: number; from?: number; className?: string }) {
  const ref = useCountUp(target, from);
  return <span ref={ref} className={className} />;
}

const WARNING = "A citizen report does not confirm a harmful algal bloom. Laboratory or agency testing is required for confirmation.";

export default function Report() {
  const { config, sites, addReport } = useRegion();
  const [params] = useSearchParams();
  const [siteId, setSiteId] = useState(params.get("site") ?? "");
  const [answers, setAnswers] = useState<Answers>({});
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);

  const topId = sites.reduce((best, s) => (scoreSite(s, config).siteScore > scoreSite(best, config).siteScore ? s : best), sites[0])?.id ?? "";
  const activeId = sites.some((s) => s.id === siteId) ? siteId : topId;
  const site = sites.find((s) => s.id === activeId);
  const current = site ? scoreSite(site, config) : null;
  const wildlife = answers.wildlife ?? [];
  const animalsPresent = wildlife.some((a) => a !== "none");

  const setOne = (id: string, v: string | null) => setAnswers((a) => ({ ...a, [id]: v ? [v] : [] }));
  const toggleWildlife = (opt: string, on: boolean) =>
    setAnswers((a) => {
      const cur = a.wildlife ?? [];
      let next = on ? [...cur, opt] : cur.filter((x) => x !== opt);
      if (on && opt === "none") next = ["none"];
      if (on && opt !== "none") next = next.filter((x) => x !== "none");
      return { ...a, wildlife: next };
    });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!site || !current) {
      setError("Choose a site before submitting.");
      return;
    }
    const observationTypes = reportFields
      .filter((f) => (answers[f.id] ?? []).length > 0)
      .map((f) => `${f.label}: ${answers[f.id].join(", ")}`);
    const report: CitizenReport = {
      id: `user-${Date.now()}`,
      siteId: site.id,
      observationTypes,
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
    });
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

  return (
    <div className="flex flex-col gap-8 py-8 md:gap-12 md:py-12">
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
        <aside className="border border-border bg-card p-4 lg:sticky lg:top-6 lg:order-2 lg:w-[320px] lg:shrink-0">
          {summary ?? <p className="text-sm text-muted-foreground">Choose a site to see its current risk score.</p>}
        </aside>

        <div className="w-full max-w-[640px] lg:order-1">
          {done ? (
            <div className="flex flex-col gap-6" role="status">
              <p className="text-xl font-semibold leading-[1.3]">Report received. Your observation has been added to the community monitoring layer.</p>
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
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Link to={`/site/${done.site.id}`} className="w-fit text-sm font-medium text-primary underline underline-offset-4">View updated site</Link>
                <Link to="/" className="w-fit text-sm font-medium text-primary underline underline-offset-4">See it on the dashboard</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
              <div className="flex flex-col gap-2">
                <Label htmlFor="site">Site</Label>
                <Select value={activeId} onValueChange={(v) => { setSiteId(v ?? ""); setError(""); }}>
                  <SelectTrigger id="site" className="w-full">
                    <SelectValue placeholder="Choose a site">{site?.name}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
              </div>

              {reportFields.map((f) =>
                f.multi ? (
                  <fieldset key={f.id} className="flex flex-col gap-2">
                    <legend className="mb-2 text-sm font-medium">{f.question}</legend>
                    <div className="grid grid-cols-2 gap-3">
                      {f.options.map((o) => (
                        <div key={o} className="flex items-center gap-2">
                          <Checkbox id={`${f.id}-${o}`} checked={wildlife.includes(o)} onCheckedChange={(c) => toggleWildlife(o, c === true)} />
                          <Label htmlFor={`${f.id}-${o}`} className="font-normal">{o}</Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Animals present: {animalsPresent ? "yes" : "no"}</p>
                  </fieldset>
                ) : (
                  <div key={f.id} className="flex flex-col gap-2">
                    <Label htmlFor={f.id}>{f.question}</Label>
                    <Select value={answers[f.id]?.[0] ?? ""} onValueChange={(v) => setOne(f.id, v)}>
                      <SelectTrigger id={f.id} className="w-full">
                        <SelectValue placeholder="Choose one">{answers[f.id]?.[0]}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ),
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="photo">Photo</Label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setPhoto(f ? URL.createObjectURL(f) : null);
                  }}
                  className="w-full rounded-sm border border-input bg-card px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
                <p className="text-sm text-muted-foreground">Photo stays on your device</p>
                {photo && <img src={photo} alt="Selected photo preview" className="max-h-48 w-fit rounded-sm border border-border" />}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
              </div>

              <Alert className="rounded-sm border-border bg-muted text-foreground">
                <TriangleAlert />
                <AlertDescription className="text-foreground">{WARNING}</AlertDescription>
              </Alert>
              <Button type="submit" className="w-full sm:w-fit">Submit report</Button>
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
