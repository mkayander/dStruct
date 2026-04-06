import { type GetStaticProps, type GetStaticPropsContext } from "next";

import type { Locales } from "#/i18n/i18n-types";
import { importLocaleAsync } from "#/i18n/i18n-util.async";
import { SITE_ORIGIN } from "#/shared/lib/seo";
import { type TranslationDictionary } from "#/shared/ui/providers/I18nProvider";

export type I18nProps = {
  translations: TranslationDictionary;
};

/** Path after origin for canonical URLs (includes locale prefix when not default). */
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

export function absoluteCanonicalFromStaticContext(
  context: Pick<GetStaticPropsContext, "locale" | "defaultLocale">,
  pagePath: string,
): string {
  return `${SITE_ORIGIN}${localePathForCanonical(context, pagePath)}`;
}

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

export const getI18nProps: GetStaticProps<{
  i18n: I18nProps;
}> = async (context) => ({
  props: await loadI18nPageProps(context),
});

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
