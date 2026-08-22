import type { Metadata } from "next";

import { MarketingHomeView } from "#/features/homePage/ui/MarketingHomeView";
import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";

import { pilotPageMetadataFromTranslation } from "#/app/internal-marketing/pilotPageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!locales.includes(localeParam as Locales)) {
    return pilotPageMetadataFromTranslation("en", "/", (translation) => ({
      title: translation.SITE_SEO_TITLE,
      description: translation.SITE_SEO_DESCRIPTION,
    }));
  }
  const locale = localeParam as Locales;

  return pilotPageMetadataFromTranslation(locale, "/", (translation) => ({
    title: translation.SITE_SEO_TITLE,
    description: translation.SITE_SEO_DESCRIPTION,
  }));
}

/** Instant Nav pilot (App Router). Public home is `app/(default-locale)` / `app/[lang]`. */
export default function InternalMarketingHomePage() {
  return <MarketingHomeView />;
}
