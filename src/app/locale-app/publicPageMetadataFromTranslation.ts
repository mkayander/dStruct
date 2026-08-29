import type { Metadata } from "next";
import { cacheLife } from "next/cache";

import type { Locales, Translation } from "#/i18n/i18n-types";
import { importLocaleAsync } from "#/i18n/i18n-util.async";

import { publicAppMetadata } from "#/app/locale-app/publicAppMetadata";

type PublicPageCopy = {
  title: string;
  description: string;
};

async function loadTranslationCached(locale: Locales): Promise<Translation> {
  "use cache";
  cacheLife("max");
  return importLocaleAsync(locale);
}

/** Server-only SEO metadata for `app/[lang]/*` using locale dictionaries. */
export async function publicPageMetadataFromTranslation(
  locale: Locales,
  pagePath: string,
  pickCopy: (translation: Translation) => PublicPageCopy,
  options?: { indexable?: boolean },
): Promise<Metadata> {
  const translation = await loadTranslationCached(locale);
  const { title, description } = pickCopy(translation);

  return publicAppMetadata({
    locale,
    pagePath,
    title,
    description,
    indexable: options?.indexable,
  });
}
