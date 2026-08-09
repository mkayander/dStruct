import { describe, expect, it } from "vitest";

import { localePathForPage } from "#/i18n/localePathForPage";

describe("localePathForPage", () => {
  it("returns bare path for default locale", () => {
    expect(localePathForPage("en", "/daily")).toBe("/daily");
    expect(localePathForPage("en", "/")).toBe("/");
  });

  it("prefixes non-default locale", () => {
    expect(localePathForPage("de", "/daily")).toBe("/de/daily");
    expect(localePathForPage("de", "/")).toBe("/de");
    expect(localePathForPage("ja", "/privacy")).toBe("/ja/privacy");
  });

  it("normalizes page path without leading slash", () => {
    expect(localePathForPage("en", "privacy")).toBe("/privacy");
    expect(localePathForPage("fr", "daily")).toBe("/fr/daily");
  });
});
