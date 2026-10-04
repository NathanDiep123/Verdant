import { describe, expect, it } from "vitest";
import { fmt, loadLang, pickLang, saveLang } from "./lang";

const fakeStorage = () => {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
  } as unknown as Storage;
};
const throwing = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
} as unknown as Storage;

describe("pickLang", () => {
  it("a valid stored value wins", () => expect(pickLang("es", ["pt-PT"])).toBe("es"));
  it("ignores an invalid stored value", () => expect(pickLang("fr", ["pt-PT"])).toBe("pt"));
  it("pt-BR maps to pt", () => expect(pickLang(null, ["pt-BR"])).toBe("pt"));
  it("skips unsupported languages", () => expect(pickLang(null, ["fr", "es-MX"])).toBe("es"));
  it("first supported entry wins", () => expect(pickLang(null, ["en-GB", "pt"])).toBe("en"));
  it("empty list gives en", () => expect(pickLang(null, [])).toBe("en"));
});

describe("fmt", () => {
  it("replaces a placeholder", () => expect(fmt("{n} reports", { n: 3 })).toBe("3 reports"));
  it("replaces a repeated placeholder", () => expect(fmt("{a}-{a}", { a: "x" })).toBe("x-x"));
  it("keeps an unknown placeholder", () => expect(fmt("{a} {b}", { a: 1 })).toBe("1 {b}"));
});

describe("loadLang / saveLang", () => {
  it("round-trips", () => {
    const s = fakeStorage();
    expect(loadLang(s)).toBeNull();
    saveLang("pt", s);
    expect(loadLang(s)).toBe("pt");
  });
  it("never throws when storage throws", () => {
    expect(loadLang(throwing)).toBeNull();
    expect(() => saveLang("es", throwing)).not.toThrow();
  });
  it("undefined storage is safe", () => {
    expect(loadLang(undefined)).toBeNull();
    expect(() => saveLang("en", undefined)).not.toThrow();
  });
});
