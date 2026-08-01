import { describe, expect, it } from "vitest";

import {
  blendColors,
  parseCssColor,
} from "#/shared/ui/effects/domDisintegrate/parseCssColor";

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

  it("alpha-composites foreground over background", () => {
    expect(
      blendColors(
        { red: 255, green: 255, blue: 255, alpha: 0.5 },
        { red: 0, green: 0, blue: 0, alpha: 1 },
      ),
    ).toEqual({
      red: 128,
      green: 128,
      blue: 128,
      alpha: 1,
    });
  });
});
