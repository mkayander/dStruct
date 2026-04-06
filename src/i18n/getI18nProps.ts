import { type GetStaticProps, type GetStaticPropsContext } from "next";

import type { Locales } from "#/i18n/i18n-types";
import { importLocaleAsync } from "#/i18n/i18n-util.async";
import { SITE_ORIGIN } from "#/shared/lib/seo";
import { type TranslationDictionary } from "#/shared/ui/providers/I18nProvider";

/**
 * Serializable i18n payload for static pages: locale dictionary loaded at build time
 * for the active locale.
 */
export type I18nProps = {
  translations: TranslationDictionary;
};

/**
 * Path segment (after origin) for the canonical URL of a static page under Next.js i18n.
 *
 * For the default locale, returns `pagePath` only (e.g. `/daily`).
 * For other locales, prefixes with `/{locale}` (e.g. `/ru/daily`).
 *
 * @param context - Next `getStaticProps` context; needs `locale` and `defaultLocale`.
 * @param pagePath - App path without locale prefix, e.g. `"/"` or `"/daily"`.
 * @returns Path starting with `/`, suitable to append to {@link SITE_ORIGIN}.
 */
export function localePathForCanonical(
  context: Pick<GetStaticPropsContext, "locale" | "defaultLocale">,
  pagePath: string,
): string {
  const normalized = pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
  const locale = context.locale ?? context.defaultLocale ?? "en";
  const defaultLocale = context.defaultLocale ?? "en";
  if (locale === defaultLocale) {
    return normalized || "/";
  }
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

/**
 * Absolute canonical URL for a static page, accounting for Next.js locale prefixing.
 *
 * @param context - `getStaticProps` context with `locale` / `defaultLocale`.
 * @param pagePath - Logical page path without locale, e.g. `"/"` or `"/daily"`.
 */
export function absoluteCanonicalFromStaticContext(
  context: Pick<GetStaticPropsContext, "locale" | "defaultLocale">,
  pagePath: string,
): string {
  return `${SITE_ORIGIN}${localePathForCanonical(context, pagePath)}`;
}

/**
 * Loads translation bundle for the request locale (used by static page props).
 */
async function loadI18nPageProps(
  context: Pick<GetStaticPropsContext, "locale">,
): Promise<{ i18n: I18nProps }> {
  const locale = (context.locale as Locales) || "en";
  const translations = { [locale]: await importLocaleAsync(locale) };
  return {
    i18n: {
      translations,
    },
  };
}

/**
 * `getStaticProps` helper: provides `i18n.translations` for the active locale only.
 */
export const getI18nProps: GetStaticProps<{
  i18n: I18nProps;
}> = async (context) => ({
  props: await loadI18nPageProps(context),
});

/**
 * `getStaticProps` factory: same as {@link getI18nProps} plus an absolute `canonicalUrl`
 * that includes the locale prefix when the active locale is not the default.
 *
 * @param pagePath - Logical path without locale prefix, e.g. `"/"` or `"/daily"`.
 * @returns `GetStaticProps` to assign as `export const getStaticProps = ...`.
 */
export const getI18nPropsWithCanonical = (
  pagePath: string,
): GetStaticProps<{
  i18n: I18nProps;
  canonicalUrl: string;
}> => {
  return async (context) => {
    const i18n = await loadI18nPageProps(context);
    return {
      props: {
        ...i18n,
        canonicalUrl: absoluteCanonicalFromStaticContext(context, pagePath),
      },
    };
  };
};
