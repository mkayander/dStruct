import type { InferGetStaticPropsType, NextPage } from "next";

import { PrivacyPageView } from "#/features/privacy/ui/PrivacyPageView";
import { getI18nPropsWithCanonical } from "#/i18n/getI18nProps";
import { useI18nContext } from "#/shared/hooks";
import { SiteSeoHead } from "#/shared/ui/seo/SiteSeoHead";

export const getStaticProps = getI18nPropsWithCanonical("/privacy");

type PrivacyPageProps = InferGetStaticPropsType<typeof getStaticProps>;

const PrivacyPage: NextPage<PrivacyPageProps> = ({ canonicalUrl }) => {
  const { LL } = useI18nContext();

  return (
    <>
      <SiteSeoHead
        title={`${LL.PRIVACY_PAGE_TITLE()} — dStruct`}
        description={LL.PRIVACY_INTRO()}
        canonicalUrl={canonicalUrl}
      />
      <PrivacyPageView />
    </>
  );
};

export default PrivacyPage;
