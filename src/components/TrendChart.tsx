import { Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { Category } from "@/types";
import { fmt as tpl } from "@/i18n/lang";
import { LOCALE } from "@/i18n/lang";
import { RISK_WORD } from "@/i18n/shared";
import { SITE_DETAIL } from "@/i18n/siteDetail";
import { useLang } from "@/state/LanguageContext";

const BANDS = [
  { y1: 0, y2: 25, key: "low" },
  { y1: 25, y2: 50, key: "moderate" },
  { y1: 50, y2: 75, key: "high" },
  { y1: 75, y2: 100, key: "very-high" },
];

function bandKey(score: number): string {
  return score <= 25 ? "low" : score <= 50 ? "moderate" : score <= 75 ? "high" : "very-high";
}

const END = new Date(2026, 9, 4);
const tick = { fontSize: 12, fontFamily: "var(--font-mono)", fill: "var(--muted-foreground)" };

type DotProps = { cx?: number; cy?: number; index?: number; payload?: { score: number } };

export function TrendChart({ history, category }: { history: number[]; category: Category }) {
  const { lang } = useLang();
  const fmt = new Intl.DateTimeFormat(LOCALE[lang], { month: "short", day: "numeric" });
  const data = history.map((score, i) => {
    const d = new Date(END);
    d.setDate(END.getDate() - (history.length - 1 - i));
    return { day: fmt.format(d), score };
  });
  return (
    <div
      role="img"
      aria-label={tpl(SITE_DETAIL[lang].chartLabel, {
        from: data[0].score,
        to: data[data.length - 1].score,
        category: RISK_WORD[lang][category],
      })}
      className="h-[260px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 24, bottom: 0, left: -12 }}>
          {BANDS.map((b) => (
            <ReferenceArea
              key={b.key}
              y1={b.y1}
              y2={b.y2}
              fill={`var(--risk-${b.key}-tint)`}
              fillOpacity={0.6}
              stroke="none"
              ifOverflow="hidden"
            />
          ))}
          {[25, 50, 75].map((y) => (
            <ReferenceLine key={y} y={y} stroke="var(--border)" />
          ))}
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            tick={tick}
            interval="preserveStartEnd"
            minTickGap={8}
          />
          <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tick={tick} />
          <Line
            type="linear"
            dataKey="score"
            stroke="var(--foreground)"
            strokeWidth={1.75}
            isAnimationActive={false}
            dot={(p: DotProps) => (
              <circle
                key={p.index}
                cx={p.cx}
                cy={p.cy}
                r={5}
                fill={`var(--risk-${bandKey(p.payload?.score ?? 0)})`}
                stroke="var(--card)"
                strokeWidth={2}
              />
            )}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
