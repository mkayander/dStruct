import type { Metadata } from "next";

import { DailyPageView } from "#/features/homePage/ui/DailyPageView";
import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";
import { loadLocaleTranslationFunctions } from "#/i18n/loadLocaleTranslationFunctions";

import { internalMarketingPilotMetadata } from "#/app/internal-marketing/internalMarketingPilotMetadata";

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
  const LL = await loadLocaleTranslationFunctions(locale);

  return internalMarketingPilotMetadata({
    locale,
    pagePath: "/daily",
    title: `${LL.HOME_DAILY_SECTION_TITLE()} — dStruct`,
    description: `${LL.HOME_DAILY_SECTION_TITLE()}. ${LL.HOME_DAILY_SECTION_LEAD()}`,
  });
}

/** Instant Nav pilot: daily problem (noindex; public `/daily` remains canonical). */
export default function InternalMarketingDailyPage() {
  return <DailyPageView />;
}
