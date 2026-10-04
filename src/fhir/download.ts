import type { CitizenReport, SiteConfig, SiteResult } from "../types";
import { toFhirBundle } from "./bundle";

export function downloadFhirJson(config: SiteConfig, results: SiteResult[], reports: CitizenReport[]) {
  const blob = new Blob([JSON.stringify(toFhirBundle(config, results, reports), null, 2)], {
    type: "application/fhir+json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `verdant-${config.id}-fhir.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
