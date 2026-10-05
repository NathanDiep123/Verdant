import { Area, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { coimbraEoSeries } from "@/data/oah/coimbraEo";
import { DASHBOARD } from "@/i18n/dashboard";
import { fmt, LOCALE, type Lang } from "@/i18n/lang";
import { useLang } from "@/state/LanguageContext";

const NDVI = "#2f7d4f";
const NDWI = "var(--primary)";
const tick = { fontSize: 12, fontFamily: "var(--font-mono)", fill: "var(--muted-foreground)" };

function buildData(lang: Lang) {
  const month = new Intl.DateTimeFormat(LOCALE[lang], { month: "short", year: "2-digit", timeZone: "UTC" });
  return coimbraEoSeries.map((r) => ({
    ...r,
    month: month.format(new Date(`${r.period}-01T00:00:00Z`)),
    ndviBand: [r.ndviMin, r.ndviMax],
    ndwiBand: [r.ndwiMin, r.ndwiMax],
  }));
}

function Key({ color, name, note }: { color: string; name: string; note: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="h-0.5 w-5 rounded-full" style={{ background: color }} aria-hidden />
      <span className="font-medium">{name}</span>
      <span className="text-muted-foreground">{note}</span>
    </span>
  );
}

export function CoimbraSatelliteChart() {
  const { lang } = useLang();
  const s = DASHBOARD[lang];
  const data = useMemo(() => buildData(lang), [lang]);
  const first = data[0];
  const last = data[data.length - 1];
  return (
    <section aria-labelledby="eo-heading" className="flex flex-col gap-4 rounded-sm border bg-card p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h2 id="eo-heading" className="text-[28px] font-semibold leading-[1.2]">
          {s.eoTitle}
        </h2>
        <p className="max-w-[68ch] text-sm text-muted-foreground">
          {s.eoIntro}
        </p>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Key color={NDVI} name="NDVI" note={s.eoKey} />
        <Key color={NDWI} name="NDWI" note={s.eoKey} />
      </div>

      <div
        role="img"
        aria-label={fmt(s.eoAria, {
          from: first.month,
          to: last.month,
          ndvi0: first.ndviMean.toFixed(2),
          ndvi1: last.ndviMean.toFixed(2),
          ndwi0: first.ndwiMean.toFixed(2),
          ndwi1: last.ndwiMean.toFixed(2),
        })}
        className="h-[280px] w-full md:h-[320px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 28, bottom: 0, left: -12 }}>
            <ReferenceLine y={0} stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              tick={tick}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis domain={[-1, 1]} ticks={[-1, -0.5, 0, 0.5, 1]} tickLine={false} axisLine={false} tick={tick} />
            <Tooltip
              cursor={{ stroke: "var(--border)" }}
              contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 12 }}
              formatter={(v, name) => {
                if (Array.isArray(v))
                  return [
                    fmt(s.eoRangeVal, { a: Number(v[0]).toFixed(2), b: Number(v[1]).toFixed(2) }),
                    fmt(s.eoRange, { name: name === "ndviBand" ? "NDVI" : "NDWI" }),
                  ];
                return [Number(v).toFixed(2), fmt(s.eoMean, { name: name === "ndviMean" ? "NDVI" : "NDWI" })];
              }}
            />
            <Area dataKey="ndviBand" stroke="none" fill={NDVI} fillOpacity={0.14} isAnimationActive={false} activeDot={false} />
            <Area dataKey="ndwiBand" stroke="none" fill={NDWI} fillOpacity={0.14} isAnimationActive={false} activeDot={false} />
            <Line type="monotone" dataKey="ndviMean" stroke={NDVI} strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="ndwiMean" stroke={NDWI} strokeWidth={2} dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground">
        {s.eoSource}
      </p>
    </section>
  );
}
