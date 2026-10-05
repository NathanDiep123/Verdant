import { describe, expect, it } from "vitest";
import { reportFields } from "@/data/reportFields";
import { LANGS } from "./lang";
import { REPORT } from "./report";

describe("report strings", () => {
  it("cover every report field label, question and option in each language", () => {
    for (const lang of LANGS) {
      const s: Record<string, string> = REPORT[lang];
      for (const f of reportFields) {
        expect(s[`field:${f.id}`], `${lang} field:${f.id}`).toBeTruthy();
        expect(s[`q:${f.id}`], `${lang} q:${f.id}`).toBeTruthy();
        for (const o of f.options) if (!/^\d/.test(o)) expect(s[`o:${o}`], `${lang} o:${o}`).toBeTruthy();
      }
    }
  });
});
