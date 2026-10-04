import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ContourField, InkRule } from "@/components/FieldMarks";
import CityCard from "@/components/CityCard";
import { CoimbraSatelliteChart } from "@/components/CoimbraSatelliteChart";
import { siteConfigs } from "@/config/sites";
import { useRegion } from "@/state/RegionContext";

const cityIds = ["benevento", "coimbra", "ghent", "oslo", "toulouse"];

const steps = [
  { verb: "Export", text: "the city's data from the OneAquaHealth Resilience Map as a CSV." },
  { verb: "Map", text: "its columns to Verdant's factors in columnMap.ts." },
  { verb: "Add", text: "a SiteConfig with the city's center, zoom and pathways." },
];

export default function OahCities() {
  const { setRegionId } = useRegion();
  const navigate = useNavigate();
  const runCoimbra = () => {
    setRegionId("coimbra");
    navigate("/");
  };

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <header className="flex flex-col gap-4">
        <div className="relative">
          <ContourField className="pointer-events-none absolute -top-6 right-0 hidden h-40 w-64 text-olive/25 md:block" />
          <h1 className="text-[1.875rem] leading-[1.05] tracking-[-0.015em] md:text-[2.5rem]">Verdant for OneAquaHealth cities</h1>
        </div>
        <p className="max-w-[68ch] text-base leading-[1.55]">
          Lake Mead serves as Verdant's pilot site, but the architecture is designed to support other lakes, reservoirs, and urban freshwater ecosystems using the same satellite and environmental monitoring workflow.
        </p>
        <p className="max-w-[68ch] text-base leading-[1.55] text-muted-foreground">
          Lake Mead is the pilot because anyone can see the water at risk. The same engine runs on OneAquaHealth's urban streams.
        </p>
      </header>

      <section className="flex flex-col gap-4" aria-labelledby="cities-h">
        <h2 id="cities-h" className="text-[1.75rem] leading-[1.15] tracking-[-0.01em]">Case-study cities</h2>
        <ul className="rounded-sm border border-border bg-card shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]">
          {cityIds.map((id) => (
            <CityCard
              key={id}
              city={siteConfigs[id]}
              action={id === "coimbra" ? <Button onClick={runCoimbra}>Run Verdant on Coimbra</Button> : undefined}
            />
          ))}
        </ul>
      </section>

      <CoimbraSatelliteChart />

      <InkRule className="text-border" />

      <section className="flex flex-col gap-4" aria-labelledby="add-h">
        <h2 id="add-h" className="text-[1.75rem] leading-[1.15] tracking-[-0.01em]">How to add a city</h2>
        <ol className="flex max-w-[68ch] flex-col">
          {steps.map((s, i) => (
            <li key={s.verb} className="flex items-baseline gap-4 border-b border-border py-4 first:pt-0">
              <span className="w-8 font-heading text-[1.75rem] tabular-nums leading-none text-muted-foreground">{i + 1}</span>
              <p className="text-base leading-[1.55]">
                <span className="font-semibold">{s.verb}</span> {s.text}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
