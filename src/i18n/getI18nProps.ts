import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from "next";

import type { Locales } from "#/i18n/i18n-types";
import { importLocaleAsync } from "#/i18n/i18n-util.async";
import { localePathForPage } from "#/i18n/localePathForPage";
import { SITE_ORIGIN } from "#/shared/lib/seo";
import { type TranslationDictionary } from "#/shared/ui/providers/I18nProvider";

type LocaleContext = Pick<
  GetStaticPropsContext | GetServerSidePropsContext,
  "locale" | "defaultLocale"
>;

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
  const locale = (context.locale ?? context.defaultLocale ?? "en") as Locales;
  const defaultLocale = (context.defaultLocale ?? "en") as Locales;
  return localePathForPage(locale, pagePath, defaultLocale);
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
 * Active locale from Next.js static or server props context.
 */
export function localeFromContext(context: LocaleContext): Locales {
  return (context.locale ?? context.defaultLocale ?? "en") as Locales;
}

/**
 * Loads translation bundle for the request locale (static and server pages).
 */
async function loadI18nPageProps(
  context: LocaleContext,
): Promise<{ i18n: I18nProps }> {
  const locale = localeFromContext(context);
  const translations = { [locale]: await importLocaleAsync(locale) };
  return {
    i18n: {
      translations,
    },
  };
}

/**
 * `getServerSideProps` helper: provides `i18n.translations` for the active locale.
 */
export async function loadI18nServerProps(
  context: LocaleContext,
): Promise<{ i18n: I18nProps }> {
  return loadI18nPageProps(context);
}

/**
 * Wraps `getServerSideProps` to merge `i18n.translations` into successful page props.
 */
export function withI18nServerSideProps<P extends Record<string, unknown>>(
  handler: GetServerSideProps<P>,
): GetServerSideProps<P & { i18n: I18nProps }> {
  return async (context) => {
    const result = await handler(context);
    if ("notFound" in result && result.notFound) {
      return result;
    }
    if ("redirect" in result && result.redirect) {
      return result;
    }
    const i18n = await loadI18nPageProps(context);
    return {
      props: {
        ...(result as { props: P }).props,
        ...i18n,
      },
    };
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
