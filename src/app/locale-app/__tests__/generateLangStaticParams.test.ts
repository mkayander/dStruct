import { describe, expect, it } from "vitest";

import { baseLocale, locales } from "#/i18n/i18n-util";

import { generateLangStaticParams } from "#/app/locale-app/generateLangStaticParams";

describe("generateLangStaticParams", () => {
  it("returns every locale except baseLocale", () => {
    const params = generateLangStaticParams();
    const langs = params.map((entry) => entry.lang);

    expect(langs).toEqual(locales.filter((locale) => locale !== baseLocale));
    expect(langs).not.toContain(baseLocale);
    expect(langs).toHaveLength(locales.length - 1);
  });
});
