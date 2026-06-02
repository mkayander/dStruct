import type { InferGetStaticPropsType, NextPage } from "next";
import { useState } from "react";

import { HomeLandingFaq } from "#/features/homePage/ui/landing/HomeLandingFaq";
import { HomeLandingHero } from "#/features/homePage/ui/landing/HomeLandingHero";
import { HomeLandingSections } from "#/features/homePage/ui/landing/HomeLandingSections";
import { getI18nPropsWithCanonical } from "#/i18n/getI18nProps";
import { useI18nContext } from "#/shared/hooks";
import { SiteSeoHead } from "#/shared/ui/seo/SiteSeoHead";
import { MainLayout } from "#/shared/ui/templates/MainLayout";

export const getStaticProps = getI18nPropsWithCanonical("/");

type DashboardProps = InferGetStaticPropsType<typeof getStaticProps>;

const DashboardPage: NextPage<DashboardProps> = ({ canonicalUrl }) => {
  const { LL } = useI18nContext();
  const [pageScrollViewport, setPageScrollViewport] =
    useState<HTMLDivElement | null>(null);

  return (
    <MainLayout
      headerPosition="fixed"
      pageScrollViewportRef={setPageScrollViewport}
    >
      <SiteSeoHead
        title="dStruct — visualize LeetCode solutions"
        canonicalUrl={canonicalUrl}
      />
      <HomeLandingHero LL={LL} pageScrollViewport={pageScrollViewport} />

      <HomeLandingSections LL={LL} />

      <HomeLandingFaq LL={LL} />
    </MainLayout>
  );
};

export default DashboardPage;
