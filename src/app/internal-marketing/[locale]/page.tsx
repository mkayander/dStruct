import type { Metadata } from "next";

import { MarketingHomeView } from "#/features/homePage/ui/MarketingHomeView";
import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";
import { DEFAULT_SITE_DESCRIPTION } from "#/shared/lib/seo";

import { internalMarketingPilotMetadata } from "#/app/internal-marketing/internalMarketingPilotMetadata";

const homeTitle = "dStruct — visualize LeetCode solutions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!locales.includes(localeParam as Locales)) {
    return { title: homeTitle, robots: { index: false, follow: false } };
  }
  const locale = localeParam as Locales;

  return internalMarketingPilotMetadata({
    locale,
    pagePath: "/",
    title: homeTitle,
    description: DEFAULT_SITE_DESCRIPTION,
  });
}

/**
 * Instant Nav pilot (App Router). Public home remains Pages `pages/index`
 * until locale routing leaves `next.config` `i18n`.
 */
export default function InternalMarketingHomePage() {
  return <MarketingHomeView />;
}
