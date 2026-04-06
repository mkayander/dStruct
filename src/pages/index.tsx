import type { NextPage } from "next";

import { HomeLandingFaq } from "#/features/homePage/ui/landing/HomeLandingFaq";
import { HomeLandingHero } from "#/features/homePage/ui/landing/HomeLandingHero";
import { HomeLandingSections } from "#/features/homePage/ui/landing/HomeLandingSections";
import type { Locales, Translations } from "#/i18n/i18n-types";
import { useI18nContext } from "#/shared/hooks";
import { SITE_ORIGIN } from "#/shared/lib/seo";
import { SiteSeoHead } from "#/shared/ui/seo/SiteSeoHead";
import { MainLayout } from "#/shared/ui/templates/MainLayout";

const DashboardPage: NextPage<{
  i18n: {
    locale: Locales;
    dictionary: Translations;
  };
}> = () => {
  const { LL } = useI18nContext();

  return (
    <MainLayout headerPosition="fixed">
      <SiteSeoHead
        title="dStruct — visualize LeetCode solutions"
        canonicalUrl={`${SITE_ORIGIN}/`}
      />
      <HomeLandingHero LL={LL} />

      <HomeLandingSections LL={LL} />

      <HomeLandingFaq LL={LL} />
    </MainLayout>
  );
};

export { getI18nProps as getStaticProps } from "#/i18n/getI18nProps";

export default DashboardPage;
