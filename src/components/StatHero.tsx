import { Annotation, ContourField, TapeCorner } from "@/components/FieldMarks";

const CDC_URL = "https://www.cdc.gov/mmwr/volumes/69/wr/mm6950a2.htm";

/* The ochre underline is the InkUnderline path drawn as a mask on ::after. InkUnderline itself adds a
   block-level SVG inside the sentence, which makes innerText break the line at every numeral. */
const UNDERLINE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 8' preserveAspectRatio='none'%3E%3Cpath d='M1 5 C 20 2.8, 45 6.4, 70 4.2 S 92 3.6, 99 4.8' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E")`;

function Figure({ children }: { children: string }) {
  return (
    <span
      style={{ "--underline": UNDERLINE } as React.CSSProperties}
      className="relative font-heading text-[2.5rem] leading-[0.8] tracking-[-0.02em] text-primary tabular-nums after:pointer-events-none after:absolute after:-bottom-0.5 after:left-0 after:h-2 after:w-full after:bg-ochre after:[mask:var(--underline)_center/100%_100%_no-repeat] md:text-[3.5rem] md:leading-[0.8]"
    >
      {children}
    </span>
  );
}

/** The CDC statistic, first block on `/`. Wording and source line are fixed by PLAN 23.10. */
export function StatHero() {
  return (
    <section
      aria-labelledby="stat-hero-heading"
      className="relative grid gap-4 rounded-sm border bg-card px-4 py-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] md:grid-cols-[minmax(0,1fr)_auto] md:gap-10 md:px-8 md:py-6"
    >
      <TapeCorner side="left" />
      <ContourField
        rings={6}
        className="absolute top-0 right-0 hidden h-full w-[30%] text-olive/25 md:block"
      />
      <h2 id="stat-hero-heading" className="sr-only">
        Harmful algal blooms in the United States
      </h2>
      <p className="font-heading text-[1.375rem] leading-[1.4] tracking-[-0.01em] md:text-[1.875rem] md:leading-[1.65]">
        Across the United States, 18 states reported <Figure>421</Figure> harmful algal bloom events,{" "}
        <Figure>389</Figure> cases of human illness and <Figure>413</Figure> cases of animal illness from 2016 to 2018.
      </p>
      <div className="relative flex flex-col items-start gap-2 md:max-w-[19rem] md:justify-end">
        <a
          href={CDC_URL}
          target="_blank"
          rel="noreferrer"
          className="stamp [--stamp-bg:var(--card)] -rotate-2 bg-card whitespace-nowrap px-2.5 py-1.5 font-mono text-xs leading-[1.4] text-ochre-ink hover:bg-muted"
        >
          Source: CDC, MMWR 69(50), Dec 18, 2020
        </a>
        <p className="text-[0.8125rem] leading-[1.4] text-muted-foreground">
          National figure for 18 states. It is not a Lake Mead count.
        </p>
        <Annotation direction="down">
          <a href="#map" className="underline underline-offset-2 hover:text-primary">
            See where to sample first
          </a>
        </Annotation>
      </div>
    </section>
  );
}
