import type { NextPage } from "next";

import { ProfilePageView } from "#/features/profile/ui/ProfilePageView";
import { withI18nServerSideProps } from "#/i18n/getI18nProps";
import { useI18nContext } from "#/shared/hooks";
import {
  absoluteUrlFromPathname,
  pathnameFromResolvedUrl,
} from "#/shared/lib/seo";
import { SiteSeoHead } from "#/shared/ui/seo/SiteSeoHead";

type ProfilePageProps = {
  canonicalUrl: string;
};

const ProfilePage: NextPage<ProfilePageProps> = ({ canonicalUrl }) => {
  const { LL } = useI18nContext();

  return (
    <>
      <SiteSeoHead
        title={`${LL.PROFILE()} | dStruct`}
        description={LL.SITE_SEO_DESCRIPTION()}
        canonicalUrl={canonicalUrl}
        noindex
      />
      <ProfilePageView />
    </>
  );
};

export const getServerSideProps = withI18nServerSideProps<ProfilePageProps>(
  async (ctx) => {
    const raw = ctx.params?.userId;
    const profileUserId = typeof raw === "string" ? raw : "";
    if (!profileUserId) {
      return { notFound: true };
    }
    const pathOnly =
      pathnameFromResolvedUrl(ctx.resolvedUrl) || `/profile/${profileUserId}`;
    const canonicalUrl = absoluteUrlFromPathname(pathOnly);
    return { props: { canonicalUrl } };
  },
);

export default ProfilePage;
