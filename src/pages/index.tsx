import type { InferGetStaticPropsType, NextPage } from "next";

import { MarketingHomeView } from "#/features/homePage/ui/MarketingHomeView";
import { getI18nPropsWithCanonical } from "#/i18n/getI18nProps";
import { useI18nContext } from "#/shared/hooks";
import { SiteSeoHead } from "#/shared/ui/seo/SiteSeoHead";

export const getStaticProps = getI18nPropsWithCanonical("/");

type DashboardProps = InferGetStaticPropsType<typeof getStaticProps>;

/**
 * Public marketing home (Pages Router + `i18n`).
 *
 * App Router `internal-marketing/[locale]` keeps the Instant Nav pilot, but
 * Pages `i18n` cannot rewrite bare `/{locale}` into App routes (invoke path
 * becomes `/{locale}/internal-marketing/...` → 404). Public cutover waits on
 * migrating locale routing off `next.config` `i18n`.
 */
const DashboardPage: NextPage<DashboardProps> = ({ canonicalUrl }) => {
  const { LL } = useI18nContext();

  return (
    <>
      <SiteSeoHead
        title={LL.SITE_SEO_TITLE()}
        description={LL.SITE_SEO_DESCRIPTION()}
        canonicalUrl={canonicalUrl}
      />
      <MarketingHomeView />
    </>
  );
};

export default DashboardPage;
