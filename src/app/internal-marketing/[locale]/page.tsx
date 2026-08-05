import { MarketingHomeView } from "#/features/homePage/ui/MarketingHomeView";

/**
 * Instant Nav pilot (App Router). Public home remains Pages `pages/index`
 * until locale routing leaves `next.config` `i18n`.
 */
export default function InternalMarketingHomePage() {
  return <MarketingHomeView />;
}
