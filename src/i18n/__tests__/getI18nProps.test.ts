import { describe, expect, it, vi } from "vitest";

import {
  loadI18nServerProps,
  localeFromContext,
  withI18nServerSideProps,
} from "#/i18n/getI18nProps";

vi.mock("#/i18n/i18n-util.async", () => ({
  importLocaleAsync: vi.fn(async (locale: string) => ({
    SITE_SEO_TITLE: `title-${locale}`,
    SITE_SEO_DESCRIPTION: `description-${locale}`,
  })),
}));

describe("localeFromContext", () => {
  it("prefers locale over defaultLocale", () => {
    expect(localeFromContext({ locale: "de", defaultLocale: "en" })).toBe("de");
  });

  it("falls back to defaultLocale then en", () => {
    expect(localeFromContext({ locale: undefined, defaultLocale: "fr" })).toBe(
      "fr",
    );
    expect(localeFromContext({ locale: undefined, defaultLocale: undefined })).toBe(
      "en",
    );
  });
});

describe("loadI18nServerProps", () => {
  it("loads translations for the active locale", async () => {
    const { i18n } = await loadI18nServerProps({
      locale: "de",
      defaultLocale: "en",
    });

    expect(i18n.translations.de).toEqual({
      SITE_SEO_TITLE: "title-de",
      SITE_SEO_DESCRIPTION: "description-de",
    });
  });
});

describe("withI18nServerSideProps", () => {
  it("merges i18n into successful props", async () => {
    const wrapped = withI18nServerSideProps(async () => ({
      props: { value: 1 },
    }));

    const result = await wrapped({
      locale: "es",
      defaultLocale: "en",
    } as Parameters<typeof wrapped>[0]);

    expect(result).toEqual({
      props: {
        value: 1,
        i18n: {
          translations: {
            es: {
              SITE_SEO_TITLE: "title-es",
              SITE_SEO_DESCRIPTION: "description-es",
            },
          },
        },
      },
    });
  });

  it("passes through notFound without loading i18n", async () => {
    const wrapped = withI18nServerSideProps(async () => ({ notFound: true }));

    const result = await wrapped({
      locale: "en",
      defaultLocale: "en",
    } as Parameters<typeof wrapped>[0]);

    expect(result).toEqual({ notFound: true });
  });
});
