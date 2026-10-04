import type { PathwayId, SiteConfig } from "@/types";
import { lakeMeadSites } from "@/data/lakeMead";
import { coimbraDataStatus, coimbraSites } from "@/data/oah/coimbra";

const oah: PathwayId[] = ["waterborne_pathogen_oah", "ecosystem_stress"];
const city = (id: string, name: string, country: string, center: [number, number]): SiteConfig => ({
  id, name, country, center, zoom: 12, pathways: oah, dataStatus: "config-only", sites: [],
});

export const siteConfigs: Record<string, SiteConfig> = {
  "lake-mead": {
    id: "lake-mead", name: "Lake Mead", country: "United States", center: [36.15, -114.55], zoom: 10,
    pathways: ["algal_bloom", "waterborne_pathogen", "heat_low_water"],
    dataStatus: "prototype", sites: lakeMeadSites,
  },
  coimbra: {
    ...city("coimbra", "Coimbra", "Portugal", [40.2033, -8.4103]),
    dataStatus: coimbraDataStatus, sites: coimbraSites,
  },
  benevento: city("benevento", "Benevento", "Italy", [41.1298, 14.7826]),
  ghent: city("ghent", "Ghent", "Belgium", [51.0543, 3.7174]),
  oslo: city("oslo", "Oslo", "Norway", [59.9139, 10.7522]),
  toulouse: city("toulouse", "Toulouse", "France", [43.6047, 1.4442]),
};

export const regionIds = ["lake-mead", "coimbra"] as const;
export type RegionId = (typeof regionIds)[number];
