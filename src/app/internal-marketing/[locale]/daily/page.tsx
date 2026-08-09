import type { Metadata } from "next";

import { DailyPageView } from "#/features/homePage/ui/DailyPageView";
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
    return { robots: { index: false, follow: false } };
  }
  const locale = localeParam as Locales;

  return pilotPageMetadataFromTranslation(locale, "/daily", (translation) => ({
    title: `${translation.HOME_DAILY_SECTION_TITLE} — dStruct`,
    description: `${translation.HOME_DAILY_SECTION_TITLE}. ${translation.HOME_DAILY_SECTION_LEAD}`,
  }));
}

/** Instant Nav pilot: daily problem (noindex; public `/daily` remains canonical). */
export default function InternalMarketingDailyPage() {
  return <DailyPageView />;
}
