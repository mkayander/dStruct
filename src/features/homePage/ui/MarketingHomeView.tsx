"use client";

/**
 * Marketing home UI. Public `/` and `app/[lang]` reuse this.
 */
import { HomeLandingFaq } from "#/features/homePage/ui/landing/HomeLandingFaq";
import { HomeLandingHero } from "#/features/homePage/ui/landing/HomeLandingHero";
import { HomeLandingSections } from "#/features/homePage/ui/landing/HomeLandingSections";
import { useMarketingScrollViewport } from "#/features/marketing/context/MarketingScrollContext";
import { useI18nContext } from "#/shared/hooks";

export const MarketingHomeView: React.FC = () => {
  const { LL } = useI18nContext();
  const pageScrollViewport = useMarketingScrollViewport();

  return (
    <>
      <HomeLandingHero LL={LL} pageScrollViewport={pageScrollViewport} />
      <HomeLandingSections LL={LL} />
      <HomeLandingFaq LL={LL} />
    </>
  );
};
