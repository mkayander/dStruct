import { describe, expect, it } from "vitest";

import {
  localeSwitchHref,
  parseLocaleFromPathname,
} from "#/i18n/localeSwitchHref";

describe("parseLocaleFromPathname", () => {
  it("returns base locale for unprefixed paths", () => {
    expect(parseLocaleFromPathname("/playground/foo")).toEqual({
      locale: "en",
      pagePath: "/playground/foo",
    });
  });

  it("strips locale prefix when present", () => {
    expect(parseLocaleFromPathname("/de/playground/foo")).toEqual({
      locale: "de",
      pagePath: "/playground/foo",
    });
  });
});

describe("localeSwitchHref", () => {
  it("preserves page path and query when switching locale", () => {
    expect(
      localeSwitchHref("/playground/two-sum", "view=code", "de"),
    ).toBe("/de/playground/two-sum?view=code");
  });

  it("drops locale prefix when switching to default locale", () => {
    expect(localeSwitchHref("/de/daily", "", "en")).toBe("/daily");
  });

  it("preserves profile paths across locales", () => {
    expect(
      localeSwitchHref("/profile/user-1", "", "ja"),
    ).toBe("/ja/profile/user-1");
  });
});
