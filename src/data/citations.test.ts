import { describe, expect, it } from "vitest";
import { citations } from "./citations";

describe("citations", () => {
  it("has the nine Section 19.2 rows C1 to C9", () => {
    expect(citations.map((c) => c.id)).toEqual(["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"]);
  });
});
