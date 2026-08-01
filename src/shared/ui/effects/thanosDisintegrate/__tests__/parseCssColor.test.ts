import { describe, expect, it } from "vitest";

import { parseCssColor } from "#/shared/ui/effects/thanosDisintegrate/parseCssColor";

describe("parseCssColor", () => {
  it("parses rgb and rgba values", () => {
    expect(parseCssColor("rgb(10, 20, 30)")).toEqual({
      red: 10,
      green: 20,
      blue: 30,
      alpha: 1,
    });
    expect(parseCssColor("rgba(10, 20, 30, 0.5)")).toEqual({
      red: 10,
      green: 20,
      blue: 30,
      alpha: 0.5,
    });
  });

  it("returns null for transparent colors", () => {
    expect(parseCssColor("transparent")).toBeNull();
    expect(parseCssColor("rgba(0, 0, 0, 0)")).toBeNull();
  });
});
