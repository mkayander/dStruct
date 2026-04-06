import { MarketingHomeView } from "#/features/homePage/ui/MarketingHomeView";

/**
 * Internal App path; `proxy.ts` rewrites `/` → `/internal-marketing/en` and `/{locale}` here.
 */
export default function InternalMarketingHomePage() {
  return <MarketingHomeView />;
}
