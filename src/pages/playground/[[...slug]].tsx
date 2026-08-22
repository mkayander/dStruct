import type { GetServerSideProps, NextPage } from "next";

import { resolvePlaygroundPageSeo } from "#/features/playground/lib/resolvePlaygroundPageSeo";
import { PlaygroundPageView } from "#/features/playground/ui/PlaygroundPageView";
import { loadI18nServerProps, localeFromContext } from "#/i18n/getI18nProps";
import {
  absoluteUrlFromPathname,
  pathnameFromResolvedUrl,
} from "#/shared/lib/seo";
import {
  resolveSsrDeviceType,
  setDeviceHintResponseHeaders,
} from "#/shared/lib/ssrDevice";
import { SiteSeoHead } from "#/shared/ui/seo/SiteSeoHead";
import type { SsrDeviceType } from "#/themes";

type PlaygroundPageProps = {
  ssrDeviceType: SsrDeviceType;
  canonicalUrl: string;
  pageTitle: string;
  pageDescription: string;
};

const PlaygroundPage: NextPage<PlaygroundPageProps> = ({
  canonicalUrl,
  pageTitle,
  pageDescription,
}) => (
  <>
    <SiteSeoHead
      title={pageTitle}
      description={pageDescription}
      canonicalUrl={canonicalUrl}
    />
    <PlaygroundPageView />
  </>
);

export const getServerSideProps: GetServerSideProps<
  PlaygroundPageProps
> = async (context) => {
  const { req, res, params, resolvedUrl } = context;
  const ssrDeviceType = resolveSsrDeviceType(req.headers);
  setDeviceHintResponseHeaders(res);

  const slug = params?.slug;
  const slugStr = Array.isArray(slug) ? slug[0] : undefined;
  const pathOnly = pathnameFromResolvedUrl(resolvedUrl) || "/playground";
  const canonicalUrl = absoluteUrlFromPathname(pathOnly);

  const locale = localeFromContext(context);
  const { pageTitle, pageDescription } = await resolvePlaygroundPageSeo(
    locale,
    slugStr,
  );
  const { i18n } = await loadI18nServerProps(context);

  return {
    props: {
      ssrDeviceType,
      canonicalUrl,
      pageTitle,
      pageDescription,
      i18n,
    },
  };
};

export default PlaygroundPage;
