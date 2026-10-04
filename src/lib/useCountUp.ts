import { useLayoutEffect, useRef } from "react";

const DURATION_MS = 600;

/**
 * Counts a number from its previous value to `target` over 600ms (ease-out),
 * writing straight to the returned ref's element. Jumps when the user prefers
 * reduced motion. `from` sets the first displayed value (defaults to `target`).
 */
export function useCountUp(target: number, from?: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(from ?? target);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = shown.current;
    const write = (n: number) => {
      shown.current = n;
      el.textContent = String(Math.round(n));
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || start === target) {
      write(target);
      return;
    }
    write(start);
    const t0 = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const p = Math.min(1, (now - t0) / DURATION_MS);
      write(start + (target - start) * (1 - (1 - p) ** 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return ref;
}
