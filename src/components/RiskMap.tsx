import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { MapContainer, Marker, Pane, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { ArrowRight } from "lucide-react";
import { SpecimenTag } from "@/components/FieldMarks";
import { Switch } from "@/components/ui/switch";
import { useRegion } from "@/state/RegionContext";
import { formatReportTime, reportSummary } from "@/lib/communityReports";
import { DASHBOARD } from "@/i18n/dashboard";
import { fmt } from "@/i18n/lang";
import { cn } from "@/lib/utils";
import { loadBasemap, saveBasemap, type Basemap } from "@/lib/basemap";
import { RISK_WORD, TAG } from "@/i18n/shared";
import { useLang } from "@/state/LanguageContext";
import { PATHWAY_LABEL } from "@/engine/explain";
import { RiskBadge } from "@/components/RiskBadge";
import { TrendLabel, type SiteRow } from "@/components/SamplingPriorityList";
import { CATEGORY_STYLE } from "@/lib/risk";
import type { Category, CitizenReport } from "@/types";

const ATTRIBUTION: Record<Basemap, string> = {
  map: 'Tiles &copy; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  satellite: "Imagery &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community; labels &copy; Esri",
};
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const TILES: Record<Basemap, string> = {
  map: `${ESRI}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
  satellite: `${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
};
const LABELS = `${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`;

const RANGES: Record<Category, string> = { Low: "0-25", Moderate: "26-50", High: "51-75", "Very High": "76-100" };
const CATEGORIES: Category[] = ["Low", "Moderate", "High", "Very High"];

function markerIcon(category: Category, score: number) {
  const { color, markerSize: d } = CATEGORY_STYLE[category];
  const veryHigh = category === "Very High";
  const big = category === "High" || veryHigh;
  const ink = category === "Moderate" || category === "High" ? "var(--foreground)" : "var(--card)";
  const html =
    `<div class="seal${d >= 32 ? " seal-dashed" : ""}${veryHigh ? " verdant-pulse" : ""}" style="--pulse-color:${color};` +
    `width:${d}px;height:${d}px;background:${color};box-sizing:border-box;` +
    `transition:background-color 300ms,width 300ms,height 300ms;">` +
    `<span style="position:relative;z-index:1;font-size:${big ? 13 : 12}px;color:${ink};` +
    `font-variant-numeric:tabular-nums;">${score}</span></div>`;
  return L.divIcon({ html, className: "", iconSize: [d, d], iconAnchor: [d / 2, d / 2], popupAnchor: [0, -d / 2] });
}

/** Tag-shaped community report pin. The outer box carries the ink outline (filter), the inner one the clip. */
function pinIcon(k: number, n: number, siteDiameter: number) {
  const angle = ((-90 + (k * 360) / Math.max(n, 4)) * Math.PI) / 180;
  const radius = siteDiameter / 2 + 12;
  const dx = Math.cos(angle) * radius;
  const dy = Math.sin(angle) * radius;
  const html =
    `<div style="width:16px;height:11px;filter:drop-shadow(0 0 0.5px #1E2B22) drop-shadow(0 0 0.5px #1E2B22) drop-shadow(0 1px 3px rgb(0 0 0 / 0.5));">` +
    `<div style="position:relative;width:16px;height:11px;background:var(--primary);` +
    `clip-path:polygon(4px 0,100% 0,100% 100%,4px 100%,0 50%);">` +
    `<span style="position:absolute;left:4px;top:4.5px;width:2px;height:2px;border-radius:9999px;background:var(--card);"></span>` +
    `</div></div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [16, 11],
    iconAnchor: [8 - dx, 5.5 - dy],
    popupAnchor: [dx, dy - 5.5],
  });
}

/** Fits the region's sites with padding on load and on region switch; the toggle sits top-left, so the top gets more room. */
function FitSites({ points, center, zoom, top }: { points: [number, number][]; center: [number, number]; zoom: number; top: number }) {
  const map = useMap();
  const key = points.join("|");
  useEffect(() => {
    if (points.length === 0) {
      map.setView(center, zoom);
      return;
    }
    map.fitBounds(L.latLngBounds(points), {
      paddingTopLeft: [40, top],
      paddingBottomRight: [40, 40],
      maxZoom: zoom + 1,
      animate: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key, center, zoom, top]);
  return null;
}

function BasemapSwitch({ value, onChange }: { value: Basemap; onChange: (b: Basemap) => void }) {
  const { lang } = useLang();
  const s = DASHBOARD[lang];
  const options: [Basemap, string][] = [["map", s.mapStyleMap], ["satellite", s.mapStyleSatellite]];
  return (
    <div
      role="group"
      aria-label={s.mapBasemap}
      className="absolute top-[82px] right-[10px] z-[1000] flex rounded-sm border border-input bg-card"
    >
      {options.map(([id, label], i) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={cn(
            "h-7 px-2.5 font-mono text-xs transition-colors duration-[120ms] focus-visible:relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            i > 0 && "border-l border-input",
            value === id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const PIN_SHAPE = "[clip-path:polygon(4px_0,100%_0,100%_100%,4px_100%,0_50%)]";

function Legend({ showPins }: { showPins: boolean }) {
  const { lang } = useLang();
  return (
    <div className="mt-2 md:absolute md:bottom-3 md:left-3 md:z-[1000] md:mt-0 md:rounded-sm md:border md:border-input md:bg-card md:px-3 md:py-1">
      <ul className="flex flex-wrap gap-x-4 gap-y-1 md:block md:space-y-0 md:divide-y md:divide-dashed md:divide-border">
        {CATEGORIES.map((c) => {
          const { color, icon: Icon } = CATEGORY_STYLE[c];
          return (
            <li key={c} className="flex items-center gap-2 font-mono text-xs md:py-1">
              <span
                className="seal !size-3 shrink-0 !border-[1px] !shadow-[0_0_0_1px_var(--foreground)]"
                style={{ background: color }}
                aria-hidden
              />
              <Icon className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
              <span className="font-sans font-medium md:w-16">{RISK_WORD[lang][c]}</span>
              <span className="text-muted-foreground">{RANGES[c]}</span>
            </li>
          );
        })}
        {showPins && (
          <li className="flex items-center gap-2 font-mono text-xs md:py-1">
            <span
              className="inline-block shrink-0 [filter:drop-shadow(0_0_0.5px_#1E2B22)_drop-shadow(0_0_0.5px_#1E2B22)]"
              aria-hidden
            >
              <span className={`relative block h-[11px] w-4 bg-primary ${PIN_SHAPE}`}>
                <span className="absolute top-[4.5px] left-1 size-0.5 rounded-full bg-card" />
              </span>
            </span>
            <span className="font-sans font-medium">{DASHBOARD[lang].mapCommunity}</span>
          </li>
        )}
      </ul>
    </div>
  );
}

export function RiskMap({ rows, center, zoom }: { rows: SiteRow[]; center: [number, number]; zoom: number }) {
  const icons = useMemo(
    () => rows.map((r) => markerIcon(r.result.category, r.result.siteScore)),
    [rows],
  );
  const { reports } = useRegion();
  const { lang } = useLang();
  const s = DASHBOARD[lang];
  const [showPins, setShowPins] = useState(true);
  const [basemap, setBasemap] = useState<Basemap>(loadBasemap);
  const pickBasemap = (b: Basemap) => {
    setBasemap(b);
    saveBasemap(b);
  };
  const pins = useMemo(() => {
    const byId = new Map(rows.map((r) => [r.site.id, r]));
    const bySite = new Map<string, CitizenReport[]>();
    for (const rep of reports) {
      if (byId.has(rep.siteId)) bySite.set(rep.siteId, [...(bySite.get(rep.siteId) ?? []), rep]);
    }
    return [...bySite.entries()].flatMap(([id, list]) => {
      const row = byId.get(id)!;
      const d = CATEGORY_STYLE[row.result.category].markerSize;
      return list.map((report, k) => ({ report, row, icon: pinIcon(k, list.length, d) }));
    });
  }, [reports, rows]);
  const points = useMemo(() => rows.map((r) => [r.site.lat, r.site.lon] as [number, number]), [rows]);
  const touch = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

  return (
    <div className="relative xl:h-full">
      <div
        data-basemap={basemap}
        className={cn(
          "relative h-[420px] overflow-hidden rounded-sm border xl:h-full",
          basemap === "map" ? "bg-[#e9e1cc]" : "bg-[#26332a]",
        )}
      >
      <MapContainer center={center} zoom={zoom} zoomControl={false} scrollWheelZoom={!touch} className="h-full w-full">
        <ZoomControl position="topright" />
        <TileLayer key={basemap} url={TILES[basemap]} maxZoom={16} attribution={ATTRIBUTION[basemap]} />
        {basemap === "satellite" && (
          <Pane name="labels" style={{ zIndex: 350 }}>
            <TileLayer url={LABELS} maxZoom={16} pane="labels" />
          </Pane>
        )}
        <FitSites points={points} center={center} zoom={zoom} top={touch ? 120 : 56} />
        {rows.map((r, i) => (
          <Marker
            key={r.site.id}
            position={[r.site.lat, r.site.lon]}
            icon={icons[i]}
            zIndexOffset={r.result.siteScore * 10}
            title={fmt(s.mapMarkerTitle, { name: r.site.name, score: r.result.siteScore, category: RISK_WORD[lang][r.result.category] })}
          >
            <Popup autoPanPaddingTopLeft={[16, 64]}>
              <p className="border-b border-dashed pb-2 font-heading text-xl leading-[1.3]">{r.site.name}</p>
              <div className="mt-2">
                <RiskBadge category={r.result.category} score={r.result.siteScore} size="md" />
              </div>
              <p className="mt-2 text-[0.8125rem] leading-[1.4] text-olive">
                <span>{s.mapLeading}</span>
                {PATHWAY_LABEL[lang][r.result.leadingPathway]}
              </p>
              <div className="mt-1">
                <TrendLabel trend={r.trend} />
              </div>
              <Link
                to={`/site/${r.site.id}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {s.mapViewAnalysis}
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
              </Link>
            </Popup>
          </Marker>
        ))}
        {showPins &&
          pins.map(({ report, row, icon }) => (
            <Marker
              key={report.id}
              position={[row.site.lat, row.site.lon]}
              icon={icon}
              zIndexOffset={10000}
              title={fmt(s.mapPinTitle, { name: row.site.name })}
            >
              <Popup>
                <p className="font-mono text-xs font-medium text-primary">{s.mapCommunity}</p>
                <p className="mt-1 border-b border-dashed pb-2 font-heading text-xl leading-[1.3]">{row.site.name}</p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">{formatReportTime(report.createdAt, lang)}</p>
                <p className="mt-2 text-sm">{reportSummary(report, lang)}</p>
                <SpecimenTag className="mt-2">{TAG[lang][report.dataTag]}</SpecimenTag>
                <div>
                  <Link
                    to={`/site/${row.site.id}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {s.mapViewSite}
                    <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      <BasemapSwitch value={basemap} onChange={pickBasemap} />
      <label className="absolute top-3 left-3 z-[1000] flex items-center gap-2 rounded-sm border border-input bg-card px-3 py-2 text-sm font-medium">
        <Switch checked={showPins} onCheckedChange={setShowPins} />
        {fmt(s.mapCommunityToggle, { n: reports.filter((r) => rows.some((x) => x.site.id === r.siteId)).length })}
      </label>
      </div>
      <Legend showPins={showPins} />
    </div>
  );
}
