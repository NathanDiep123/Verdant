import { describe, expect, it } from "vitest";
import { toggleExclusive } from "./toggleExclusive";

describe("toggleExclusive", () => {
  it("adds and removes ordinary options", () => {
    expect(toggleExclusive(["foam"], "colour", "normal")).toEqual(["foam", "colour"]);
    expect(toggleExclusive(["foam", "colour"], "foam", "normal")).toEqual(["colour"]);
  });
  it("exclusive option clears the others", () => {
    expect(toggleExclusive(["foam", "colour"], "normal", "normal")).toEqual(["normal"]);
  });
  it("any other option clears the exclusive one", () => {
    expect(toggleExclusive(["normal"], "foam", "normal")).toEqual(["foam"]);
  });
  it("deselecting the last choice leaves it empty", () => {
    expect(toggleExclusive(["normal"], "normal", "normal")).toEqual([]);
  });
});
