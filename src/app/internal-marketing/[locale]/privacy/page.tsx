import type { Metadata } from "next";

import { PrivacyPageView } from "#/features/privacy/ui/PrivacyPageView";
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
    pagePath: "/privacy",
    title: `${LL.PRIVACY_PAGE_TITLE()} — dStruct`,
    description: LL.PRIVACY_INTRO(),
  });
}

/** Instant Nav pilot: privacy policy (noindex; public `/privacy` remains canonical). */
export default function InternalMarketingPrivacyPage() {
  return <PrivacyPageView />;
}
