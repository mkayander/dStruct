import { describe, expect, it } from "vitest";

import { getNodeColors } from "#/shared/lib";
import { theme } from "#/themes";

describe("getNodeColors", () => {
  it("uses the app accent as the default node primary color", () => {
    expect(getNodeColors(theme)).toEqual({
      nodeColor: theme.appDesign.accent,
      shadowColor: theme.appDesign.accentSoft,
    });
  });

  it("keeps explicit material color overrides", () => {
    expect(getNodeColors(theme, "green")).toEqual({
      nodeColor: "#4caf50",
      shadowColor: "#4caf50",
    });
  });
});
