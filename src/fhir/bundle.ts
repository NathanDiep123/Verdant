import type { CitizenReport, SiteConfig, SiteResult } from "../types";
import { OAH_IG_BASE } from "./constants";

interface Resource {
  resourceType: "Location" | "Observation";
  meta: { profile?: string[]; tag: { code: string }[] };
  [key: string]: unknown;
}
interface Observation extends Resource {
  subject?: { reference: string };
  code?: { text: string };
  category?: { text: string };
}
export interface FhirBundle {
  resourceType: "Bundle";
  type: "collection";
  entry: { fullUrl: string; resource: Observation }[];
}

/** Deterministic uuid-shaped id from a string (FNV-1a, four seeds). */
function uuid(key: string): string {
  let hex = "";
  for (let s = 0; s < 4; s++) {
    let h = (0x811c9dc5 + s * 7919) >>> 0;
    for (const c of key) h = Math.imul(h ^ c.charCodeAt(0), 0x01000193) >>> 0;
    hex += h.toString(16).padStart(8, "0");
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}
const url = (key: string) => `urn:uuid:${uuid(key)}`;

/** `results[i]` is the engine result for `config.sites[i]`. */
export function toFhirBundle(config: SiteConfig, results: SiteResult[], reports: CitizenReport[]): FhirBundle {
  const profile = (name: string) => [`${OAH_IG_BASE}/StructureDefinition/${name}`];
  const entry: FhirBundle["entry"] = [];
  const add = (key: string, resource: Observation) => entry.push({ fullUrl: url(key), resource });

  config.sites.forEach((site, i) => {
    const r = results[i];
    const tag = [{ code: config.dataStatus === "prototype" ? "prototype" : "synthetic-demo" }];
    add(`location:${site.id}`, {
      resourceType: "Location",
      meta: { profile: profile("location-oah"), tag },
      name: site.name,
      position: { latitude: site.lat, longitude: site.lon },
    });
    add(`score:${site.id}`, {
      resourceType: "Observation",
      meta: { tag },
      status: "preliminary",
      code: { text: "Verdant site risk score" },
      subject: { reference: url(`location:${site.id}`) },
      valueInteger: r.siteScore,
      component: r.pathways.map((p) => ({ code: { text: p.pathwayId }, valueInteger: p.score })),
      interpretation: { text: r.category },
    });
  });
  for (const rep of reports) {
    add(`report:${rep.id}`, {
      resourceType: "Observation",
      meta: { profile: profile("observation-indicators-oah"), tag: [{ code: rep.dataTag }] },
      status: "preliminary",
      category: { text: "citizen-science" },
      valueCodeableConcept: { text: rep.observationTypes.join(", ") },
      effectiveDateTime: rep.createdAt,
      subject: { reference: url(`location:${rep.siteId}`) },
      note: [{ text: rep.notes }],
    });
  }
  return { resourceType: "Bundle", type: "collection", entry };
}
