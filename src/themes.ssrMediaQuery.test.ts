import { createTheme } from "@mui/material/styles";
import { describe, expect, it } from "vitest";

import { ssrMediaQueryMatches } from "#/themes";

describe("ssrMediaQueryMatches", () => {
  const downLgQuery = createTheme().breakpoints.down("lg");
  const downSmQuery = createTheme().breakpoints.down("sm");

  it("treats desktop SSR width as full nav (above lg)", () => {
    expect(ssrMediaQueryMatches(downLgQuery, "desktop")).toBe(false);
    expect(ssrMediaQueryMatches(downSmQuery, "desktop")).toBe(false);
  });

  it("treats mobile SSR width as compact/mobile breakpoints", () => {
    expect(ssrMediaQueryMatches(downSmQuery, "mobile")).toBe(true);
    expect(ssrMediaQueryMatches(downLgQuery, "mobile")).toBe(true);
  });
});
