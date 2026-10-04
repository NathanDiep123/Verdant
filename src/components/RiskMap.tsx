import { useEffect, useMemo } from "react";
import { Link } from "react-router";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { ArrowRight } from "lucide-react";
import { RiskBadge } from "@/components/RiskBadge";
import { TrendLabel, type SiteRow } from "@/components/SamplingPriorityList";
import { CATEGORY_STYLE } from "@/lib/risk";
import { PATHWAYS } from "@/engine/pathways";
import type { Category } from "@/types";

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

function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

function Legend() {
  return (
    <div className="absolute bottom-3 left-3 z-[1000] rounded-sm border bg-card px-3 py-2">
      <ul className="space-y-1">
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
              <span className="w-16 font-sans font-medium">{c}</span>
              <span className="text-muted-foreground">{RANGES[c]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RiskMap({ rows, center, zoom }: { rows: SiteRow[]; center: [number, number]; zoom: number }) {
  const icons = useMemo(
    () => rows.map((r) => markerIcon(r.result.category, r.result.siteScore)),
    [rows],
  );
  const touch = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

  return (
    <div className="relative h-[380px] overflow-hidden rounded-sm border bg-card lg:h-full">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={!touch} className="h-full w-full">
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
          attribution={ATTRIBUTION}
        />
        <Recenter center={center} zoom={zoom} />
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
      </MapContainer>
      <Legend />
    </div>
  );
}
