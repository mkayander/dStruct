import type { Metadata } from "next";

import { MarketingHomeView } from "#/features/homePage/ui/MarketingHomeView";
import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";

import { publicPageMetadataFromTranslation } from "#/app/locale-app/publicPageMetadataFromTranslation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: langParam } = await params;
  if (!locales.includes(langParam as Locales)) {
    return {};
  }
  const locale = langParam as Locales;

  return publicPageMetadataFromTranslation(locale, "/", (translation) => ({
    title: translation.SITE_SEO_TITLE,
    description: translation.SITE_SEO_DESCRIPTION,
  }));
}

/**
 * App Router home at `/{lang}` (e.g. `/en`, `/de`).
 * Default-locale public `/` remains Pages until locale migration L2/L3.
 */
export default function LangHomePage() {
  return <MarketingHomeView />;
}
