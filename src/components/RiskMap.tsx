import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { ArrowRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useRegion } from "@/state/RegionContext";
import { formatReportTime, REPORT_TAG_LABEL, reportSummary } from "@/lib/communityReports";
import { RiskBadge } from "@/components/RiskBadge";
import { TrendLabel, type SiteRow } from "@/components/SamplingPriorityList";
import { CATEGORY_STYLE } from "@/lib/risk";
import { PATHWAYS } from "@/engine/pathways";
import type { Category, CitizenReport } from "@/types";

const ATTRIBUTION =
  'Tiles &copy; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const RANGES: Record<Category, string> = { Low: "0-25", Moderate: "26-50", High: "51-75", "Very High": "76-100" };
const CATEGORIES: Category[] = ["Low", "Moderate", "High", "Very High"];

function markerIcon(category: Category, score: number) {
  const { color, markerSize: d } = CATEGORY_STYLE[category];
  const veryHigh = category === "Very High";
  const big = category === "High" || veryHigh;
  const ink = veryHigh ? "var(--card)" : "var(--foreground)";
  const html =
    `<div class="${veryHigh ? "verdant-pulse" : ""}" style="--pulse-color:${color};width:${d}px;height:${d}px;` +
    `border-radius:9999px;background:${color};border:2px solid var(--card);box-sizing:border-box;` +
    `box-shadow:0 0 0 1px rgb(20 33 31 / 0.4);display:flex;align-items:center;justify-content:center;` +
    `transition:background-color 300ms,width 300ms,height 300ms;">` +
    `<span style="position:relative;z-index:1;font:600 ${big ? 13 : 12}px var(--font-mono);color:${ink};` +
    `font-variant-numeric:tabular-nums;">${score}</span></div>`;
  return L.divIcon({ html, className: "", iconSize: [d, d], iconAnchor: [d / 2, d / 2], popupAnchor: [0, -d / 2] });
}

function pinIcon(k: number, n: number, siteDiameter: number) {
  const angle = ((-90 + (k * 360) / Math.max(n, 4)) * Math.PI) / 180;
  const radius = siteDiameter / 2 + 10;
  const dx = Math.cos(angle) * radius;
  const dy = Math.sin(angle) * radius;
  const html =
    `<div style="width:12px;height:12px;border-radius:2px;background:var(--primary);` +
    `border:2px solid #FBFCFB;box-sizing:border-box;box-shadow:0 0 0 1px rgb(20 33 31 / 0.4);"></div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6 - dx, 6 - dy],
    popupAnchor: [dx, dy - 6],
  });
}

/** Fits the region's sites with padding on load and on region switch; the toggle sits top-left, so the top gets more room. */
function FitSites({ points, center, zoom }: { points: [number, number][]; center: [number, number]; zoom: number }) {
  const map = useMap();
  const key = points.join("|");
  useEffect(() => {
    if (points.length === 0) {
      map.setView(center, zoom);
      return;
    }
    map.fitBounds(L.latLngBounds(points), {
      paddingTopLeft: [40, 56],
      paddingBottomRight: [40, 40],
      maxZoom: zoom + 1,
      animate: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key, center, zoom]);
  return null;
}

function Legend({ showPins }: { showPins: boolean }) {
  return (
    <div className="mt-2 md:absolute md:bottom-3 md:left-3 md:z-[1000] md:mt-0 md:rounded-sm md:border md:bg-card md:px-3 md:py-2">
      <ul className="flex flex-wrap gap-x-4 gap-y-1 md:block md:space-y-1">
        {CATEGORIES.map((c) => {
          const { color, icon: Icon, markerSize } = CATEGORY_STYLE[c];
          return (
            <li key={c} className="flex items-center gap-2 font-mono text-xs">
              <span
                className="inline-block shrink-0 rounded-full border border-foreground/40"
                style={{ background: color, width: markerSize / 2, height: markerSize / 2 }}
                aria-hidden
              />
              <Icon className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
              <span className="font-sans font-medium md:w-16">{c}</span>
              <span className="text-muted-foreground">{RANGES[c]}</span>
            </li>
          );
        })}
        {showPins && (
          <li className="flex items-center gap-2 font-mono text-xs">
            <span
              className="inline-block size-3 shrink-0 rounded-[2px] border-2 border-[#FBFCFB] bg-primary ring-1 ring-foreground/40"
              aria-hidden
            />
            <span className="font-sans font-medium">Community report</span>
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
  const [showPins, setShowPins] = useState(true);
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
      <div className="relative h-[420px] overflow-hidden rounded-sm border bg-card xl:h-full">
      <MapContainer center={center} zoom={zoom} zoomControl={false} scrollWheelZoom={!touch} className="h-full w-full">
        <ZoomControl position="topright" />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
          attribution={ATTRIBUTION}
        />
        <FitSites points={points} center={center} zoom={zoom} />
        {rows.map((r, i) => (
          <Marker
            key={r.site.id}
            position={[r.site.lat, r.site.lon]}
            icon={icons[i]}
            zIndexOffset={r.result.siteScore * 10}
            title={`${r.site.name}, risk ${r.result.siteScore}, ${r.result.category}`}
          >
            <Popup>
              <p className="text-xl leading-[1.3] font-semibold">{r.site.name}</p>
              <div className="mt-2">
                <RiskBadge category={r.result.category} score={r.result.siteScore} size="md" />
              </div>
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">Leading pathway: </span>
                {PATHWAYS[r.result.leadingPathway].label}
              </p>
              <div className="mt-1">
                <TrendLabel trend={r.trend} />
              </div>
              <Link
                to={`/site/${r.site.id}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View analysis
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
              title={`Community report at ${row.site.name}`}
            >
              <Popup>
                <p className="text-sm font-semibold text-primary">Community report</p>
                <p className="mt-1 text-xl leading-[1.3] font-semibold">{row.site.name}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{formatReportTime(report.createdAt)}</p>
                <p className="mt-2 text-sm">{reportSummary(report)}</p>
                <p className="mt-2 inline-block border border-dashed px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {REPORT_TAG_LABEL[report.dataTag]}
                </p>
                <div>
                  <Link
                    to={`/site/${row.site.id}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View site
                    <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      <label className="absolute top-3 left-3 z-[1000] flex items-center gap-2 rounded-sm border bg-card px-3 py-2 text-sm font-medium">
        <Switch checked={showPins} onCheckedChange={setShowPins} />
        Community reports ({reports.filter((r) => rows.some((x) => x.site.id === r.siteId)).length})
      </label>
      </div>
      <Legend showPins={showPins} />
    </div>
  );
}
