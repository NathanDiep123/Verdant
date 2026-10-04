import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Hand-drawn field-notebook marks. Inline SVG only: paths are constants (no per-render
   randomness), stroke is currentColor so the call site sets colour with a text class,
   and every mark is decorative (aria-hidden). */

const MARK = {
  "aria-hidden": true,
  focusable: "false",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const NS = { vectorEffect: "non-scaling-stroke" } as const;

const WAVE =
  "M2 4 C 22 1, 44 7, 66 4 S 110 1, 132 4 S 176 7, 198 4 S 242 1, 264 4 S 308 7, 330 4 S 374 1, 398 4";
const LINE = "M2 4 C 90 2.5, 180 5.5, 270 3.8 S 360 4.6, 398 3.6";

export function InkRule({ className, variant = "line" }: { className?: string; variant?: "line" | "wave" }) {
  return (
    <svg
      {...MARK}
      viewBox="0 0 400 8"
      preserveAspectRatio="none"
      className={cn("block h-2 w-full", className)}
    >
      <path d={variant === "wave" ? WAVE : LINE} strokeWidth={1.25} {...NS} />
    </svg>
  );
}

export function InkUnderline({
  children,
  className,
  tone = "ochre",
}: {
  children: ReactNode;
  className?: string;
  tone?: "ochre" | "primary";
}) {
  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      <svg
        {...MARK}
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        className={cn(
          "pointer-events-none absolute -bottom-1.5 left-0 h-2 w-full",
          tone === "ochre" ? "text-ochre" : "text-primary",
        )}
      >
        <path d="M1 5 C 20 2.8, 45 6.4, 70 4.2 S 92 3.6, 99 4.8" strokeWidth={2} {...NS} />
      </svg>
    </span>
  );
}

/* Per-ring, per-quadrant radius drift. Fixed numbers, so every render draws the same map. */
const DRIFT = [
  [1.0, 0.94, 1.06, 0.97],
  [1.05, 0.96, 0.95, 1.04],
  [0.96, 1.05, 1.03, 0.94],
  [1.04, 0.97, 0.94, 1.06],
  [0.95, 1.04, 1.05, 0.96],
  [1.03, 0.95, 0.96, 1.05],
  [0.97, 1.06, 1.02, 0.95],
  [1.05, 0.96, 0.95, 1.03],
];
const K = 0.5523;

function contour(ring: number): string {
  const cx = 214;
  const cy = 96;
  const base = 18 * (ring + 1);
  const d = DRIFT[ring % DRIFT.length];
  const r = d.map((m, i) => base * m * (i % 2 === 0 ? 1.35 : 0.95));
  const [e, s, w, n] = r;
  const f = (v: number) => v.toFixed(1);
  // Four cubic segments: east, south, west, north points, controls bent by the drift.
  return (
    `M${f(cx + e)} ${f(cy + ring * 0.6)} ` +
    `C ${f(cx + e)} ${f(cy + s * K)}, ${f(cx + e * K)} ${f(cy + s)}, ${f(cx)} ${f(cy + s)} ` +
    `C ${f(cx - w * K)} ${f(cy + s)}, ${f(cx - w)} ${f(cy + n * K * 0.8)}, ${f(cx - w)} ${f(cy - ring * 0.5)} ` +
    `C ${f(cx - w)} ${f(cy - n * K)}, ${f(cx - w * K)} ${f(cy - n)}, ${f(cx)} ${f(cy - n)} ` +
    `C ${f(cx + e * K)} ${f(cy - n)}, ${f(cx + e)} ${f(cy - n * K * 1.1)}, ${f(cx + e)} ${f(cy + ring * 0.6)} Z`
  );
}

export function ContourField({ className, rings = 5 }: { className?: string; rings?: number }) {
  return (
    <svg {...MARK} viewBox="0 0 320 200" className={cn("pointer-events-none", className)}>
      {Array.from({ length: rings }, (_, i) => (
        <path key={i} d={contour(i)} strokeWidth={1} {...NS} />
      ))}
    </svg>
  );
}

export function Ripple({ className }: { className?: string }) {
  return (
    <svg {...MARK} viewBox="0 0 60 60" className={cn("size-10", className)}>
      {[10, 18, 26].map((rx) => (
        <ellipse key={rx} cx={30} cy={30} rx={rx} ry={rx * 0.92} strokeWidth={1.25} {...NS} />
      ))}
    </svg>
  );
}

const TAG = "[clip-path:polygon(8px_0,100%_0,100%_100%,8px_100%,0_50%)]";

/** A specimen tag: notched label with a punched hole. Real text, so it stays readable. */
export function SpecimenTag({
  children,
  tone = "plain",
  className,
}: {
  children: ReactNode;
  tone?: "plain" | "official";
  className?: string;
}) {
  const official = tone === "official";
  return (
    <span className={cn("inline-flex w-fit max-w-full", TAG, official ? "bg-primary" : "bg-input", className)}>
      <span
        className={cn(
          "relative m-px inline-flex items-center py-0.5 pr-2 pl-4 font-mono text-xs leading-[1.4] font-medium",
          TAG,
          official ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
          "before:absolute before:top-1/2 before:left-[5px] before:size-1 before:-translate-y-1/2 before:rounded-full before:bg-background",
        )}
      >
        {children}
      </span>
    </span>
  );
}

/** Masking tape over the corner of a `relative` parent. Use in exactly two places. */
export function TapeCorner({ className, side = "left" }: { className?: string; side?: "left" | "right" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -top-1 z-10 h-[18px] w-14 bg-ochre/25 mix-blend-multiply",
        "[clip-path:polygon(0_10%,4%_0,96%_8%,100%_0,100%_90%,96%_100%,4%_92%,0_100%)]",
        side === "left" ? "-left-4 -rotate-[38deg]" : "-right-4 rotate-[38deg]",
        className,
      )}
    />
  );
}

/** A margin note: existing text plus one curved arrow. Never new claims. */
export function Annotation({
  children,
  direction = "down",
  className,
}: {
  children: ReactNode;
  direction?: "down" | "left" | "up-left";
  className?: string;
}) {
  const arrow = (
    <svg
      {...MARK}
      viewBox="0 0 36 28"
      className={cn(
        "h-7 w-9 shrink-0 text-ochre",
        direction === "left" && "-scale-x-100",
        direction === "up-left" && "rotate-180",
      )}
    >
      <path d="M4 4 C 10 18, 22 24, 32 22 M26 16 L32 22 L25 27.5" strokeWidth={1.5} {...NS} />
    </svg>
  );
  const text = <span className="text-[0.8125rem] leading-[1.4] text-ochre-ink">{children}</span>;
  return (
    <span
      className={cn(
        "inline-flex",
        direction === "left" ? "flex-row items-center gap-1" : "flex-col items-start",
        className,
      )}
    >
      {direction === "down" ? (
        <>
          {text}
          {arrow}
        </>
      ) : (
        <>
          {arrow}
          {text}
        </>
      )}
    </span>
  );
}
