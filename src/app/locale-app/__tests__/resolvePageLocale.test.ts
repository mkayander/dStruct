import { describe, expect, it } from "vitest";

import { baseLocale } from "#/i18n/i18n-util";

import { resolvePageLocale } from "#/app/locale-app/resolvePageLocale";

describe("resolvePageLocale", () => {
  it("returns base locale when params are omitted", async () => {
    await expect(resolvePageLocale()).resolves.toBe(baseLocale);
  });

  it("returns base locale when lang param is absent", async () => {
    await expect(resolvePageLocale(Promise.resolve({}))).resolves.toBe(
      baseLocale,
    );
  });

  it("returns the resolved locale for supported lang params", async () => {
    await expect(
      resolvePageLocale(Promise.resolve({ lang: "de" })),
    ).resolves.toBe("de");
  });

  it("falls back to base locale for unsupported lang params", async () => {
    await expect(
      resolvePageLocale(Promise.resolve({ lang: "zz" })),
    ).resolves.toBe(baseLocale);
  });
});
