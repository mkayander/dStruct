import type { Metadata } from "next";

import type { Locales, Translation } from "#/i18n/i18n-types";
import { importLocaleAsync } from "#/i18n/i18n-util.async";

import { internalMarketingPilotMetadata } from "#/app/internal-marketing/internalMarketingPilotMetadata";

type PilotPageCopy = {
  title: string;
  description: string;
};

/** Server-only metadata for pilot routes using raw locale strings (no `i18nObject`). */
export async function pilotPageMetadataFromTranslation(
  locale: Locales,
  pagePath: string,
  pickCopy: (translation: Translation) => PilotPageCopy,
): Promise<Metadata> {
  const translation = await importLocaleAsync(locale);
  const { title, description } = pickCopy(translation);

  return internalMarketingPilotMetadata({
    locale,
    pagePath,
    title,
    description,
  });
}
