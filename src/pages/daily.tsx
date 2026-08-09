import type { InferGetStaticPropsType, NextPage } from "next";

import { DailyPageView } from "#/features/homePage/ui/DailyPageView";
import { getI18nPropsWithCanonical } from "#/i18n/getI18nProps";
import { useI18nContext } from "#/shared/hooks";
import { SiteSeoHead } from "#/shared/ui/seo/SiteSeoHead";

export const getStaticProps = getI18nPropsWithCanonical("/daily");

type DailyProblemPageProps = InferGetStaticPropsType<typeof getStaticProps>;

const DailyProblemPage: NextPage<DailyProblemPageProps> = ({
  canonicalUrl,
}) => {
  const { LL } = useI18nContext();

  return (
    <>
      <SiteSeoHead
        title={`${LL.HOME_DAILY_SECTION_TITLE()} — dStruct`}
        description={`${LL.HOME_DAILY_SECTION_TITLE()}. ${LL.HOME_DAILY_SECTION_LEAD()}`}
        canonicalUrl={canonicalUrl}
      />
      <DailyPageView />
    </>
  );
};

export default DailyProblemPage;
