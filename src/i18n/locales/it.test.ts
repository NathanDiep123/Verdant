import { describe, expect, it } from "vitest";
import { lakeMeadSites } from "../../data/lakeMead";
import { explain } from "../../engine/explain";
import { scoreSite } from "../../engine/score";
import { EN } from "./en";
import { IT } from "./it";

const result = scoreSite(lakeMeadSites.find((s) => s.id === "callville-bay")!, {
  pathways: ["algal_bloom", "waterborne_pathogen", "heat_low_water"],
});

describe("Italian locale", () => {
  it("writes the engine sentence as grammatical Italian", () => {
    expect(explain(result, "it")).toBe(
      "Il rischio è elevato soprattutto per condizioni di fioritura algale: un forte segnale di clorofilla e temperatura dell’acqua elevata.",
    );
  });

  it("uses ed before a phrase that starts with e", () => {
    expect(IT.explain.sentence("stress dell’ecosistema", "acqua calda", "escursione termica")).toBe(
      "Il rischio è elevato soprattutto per condizioni di stress dell’ecosistema: acqua calda ed escursione termica.",
    );
    expect(IT.explain.sentence("caldo", "acqua calda", "vento debole")).toContain("acqua calda e vento debole");
  });

  it("keeps the glossary risk and status words", () => {
    expect(IT.riskWord).toEqual({ Low: "Basso", Moderate: "Moderato", High: "Alto", "Very High": "Molto alto" });
    expect(IT.status).toEqual({
      received: "Ricevuta",
      reviewing: "In esame dal guardiaparco",
      "sample-requested": "Campione richiesto",
      confirmed: "Confermata da campione",
      "not-bloom": "Non è una fioritura",
      "more-info": "Servono più informazioni",
    });
    expect(IT.trend).toEqual({ Increasing: "In aumento", Decreasing: "In calo", Stable: "Stabile" });
  });

  it("translates at least 80% of the string leaves", () => {
    const leaves = (o: unknown): string[] =>
      typeof o === "string" ? [o] : o && typeof o === "object" ? Object.values(o).flatMap(leaves) : [];
    const en = leaves(EN);
    const it_ = leaves(IT);
    const differing = en.filter((s, i) => s !== it_[i]).length;
    expect(differing / en.length).toBeGreaterThanOrEqual(0.8);
  });
});
