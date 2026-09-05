import type { Metadata } from "next";

import type { Locales, Translation } from "#/i18n/i18n-types";
import { baseLocale } from "#/i18n/i18n-util";

import { publicPageMetadataFromTranslation } from "#/app/locale-app/publicPageMetadataFromTranslation";
import { resolveLangParam } from "#/app/locale-app/resolveLangParam";

type PublicPageCopy = {
  title: string;
  description: string;
};

type PickPublicPageCopy = (translation: Translation) => PublicPageCopy;

type MetadataOptions = {
  indexable?: boolean;
};

/** `(default-locale)/` metadata factory — fixed `baseLocale`. */
export function createDefaultLocaleRouteMetadata(
  pagePath: string,
  pickCopy: PickPublicPageCopy,
  options?: MetadataOptions,
) {
  return async (): Promise<Metadata> =>
    publicPageMetadataFromTranslation(baseLocale, pagePath, pickCopy, options);
}

/** `[lang]/` metadata factory — validates locale param. */
export function createLangRouteMetadata(
  pagePath: string,
  pickCopy: PickPublicPageCopy,
  options?: MetadataOptions,
) {
  return async ({
    params,
  }: {
    params: Promise<{ lang: string }>;
  }): Promise<Metadata> => {
    const locale = await resolveLangParam(params);
    if (!locale) {
      return {};
    }
    return publicPageMetadataFromTranslation(
      locale,
      pagePath,
      pickCopy,
      options,
    );
  };
}

/** Shared helper when locale is already resolved (playground/profile). */
export async function publicRouteMetadataForLocale(
  locale: Locales,
  pagePath: string,
  pickCopy: PickPublicPageCopy,
  options?: MetadataOptions,
): Promise<Metadata> {
  return publicPageMetadataFromTranslation(locale, pagePath, pickCopy, options);
}
