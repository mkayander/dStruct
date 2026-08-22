"use client";

/**
 * Marketing home UI. Public `/` and `app/[lang]` reuse this.
 */
import { useState } from "react";

import { HomeLandingFaq } from "#/features/homePage/ui/landing/HomeLandingFaq";
import { HomeLandingHero } from "#/features/homePage/ui/landing/HomeLandingHero";
import { HomeLandingSections } from "#/features/homePage/ui/landing/HomeLandingSections";
import { useI18nContext } from "#/shared/hooks";
import { MainLayout } from "#/shared/ui/templates/MainLayout";

export const MarketingHomeView: React.FC = () => {
  const { LL } = useI18nContext();
  const [pageScrollViewport, setPageScrollViewport] =
    useState<HTMLDivElement | null>(null);

  return (
    <MainLayout
      headerPosition="fixed"
      pageScrollViewportRef={setPageScrollViewport}
    >
      <HomeLandingHero LL={LL} pageScrollViewport={pageScrollViewport} />
      <HomeLandingSections LL={LL} />
      <HomeLandingFaq LL={LL} />
    </MainLayout>
  );
};
