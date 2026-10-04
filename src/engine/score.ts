import type {
  Category,
  Contribution,
  Factors,
  FactorId,
  PathwayDef,
  PathwayResult,
  SiteConfig,
  SiteRecord,
  SiteResult,
  Trend,
} from "../types";
import { PATHWAYS } from "./pathways";

export function categorize(score: number): Category {
  if (score <= 25) return "Low";
  if (score <= 50) return "Moderate";
  if (score <= 75) return "High";
  return "Very High";
}

export function scorePathway(factors: Factors, pathway: PathwayDef): PathwayResult {
  const entries = Object.entries(pathway.weights) as [FactorId, number][];
  const present = entries.filter(([f]) => factors[f] !== undefined);
  const coverage = present.reduce((t, [, w]) => t + w, 0);
  const contributions: Contribution[] = present
    .map(([factor, weight]) => {
      const value = factors[factor]!;
      return { factor, value, weight, points: (weight * value) / coverage };
    })
    .sort((a, b) => b.points - a.points);
  const score = Math.round(contributions.reduce((t, c) => t + c.points, 0));
  return {
    pathwayId: pathway.id,
    score,
    category: categorize(score),
    coverage,
    contributions,
    missing: entries.filter(([f]) => factors[f] === undefined).map(([f]) => f),
  };
}

export function scoreSite(site: SiteRecord, config: Pick<SiteConfig, "pathways">): SiteResult {
  const pathways = config.pathways.map((id) => scorePathway(site.factors, PATHWAYS[id]));
  // strict ">" keeps the earlier pathway on a tie
  const lead = pathways.reduce((best, p) => (p.score > best.score ? p : best));
  return {
    siteScore: lead.score,
    category: categorize(lead.score),
    leadingPathway: lead.pathwayId,
    pathways,
  };
}

export function trend(history: number[]): Trend {
  const d = history[history.length - 1] - history[0];
  return d >= 5 ? "Increasing" : d <= -5 ? "Decreasing" : "Stable";
}

export function applyCitizenReport(site: SiteRecord): SiteRecord {
  const current = site.factors.citizen_evidence ?? 0;
  return { ...site, factors: { ...site.factors, citizen_evidence: Math.min(100, current + 10) } };
}

export function recommend(category: Category): string {
  return {
    Low: "Routine observation",
    Moderate: "Continue monitoring",
    High: "Prioritize follow-up observation",
    "Very High": "Recommend field sampling",
  }[category];
}
