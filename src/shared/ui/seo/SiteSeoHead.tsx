import Head from "next/head";
import type React from "react";

import {
  DEFAULT_SITE_DESCRIPTION,
  defaultOgImageUrl,
  truncateMetaDescription,
} from "#/shared/lib/seo";

export type SiteSeoHeadProps = {
  title: string;
  description?: string;
  canonicalUrl: string;
  ogImageUrl?: string;
  /** Use for account or low-value pages that should not appear in search results. */
  noindex?: boolean;
};

export const SiteSeoHead: React.FC<SiteSeoHeadProps> = ({
  title,
  description = DEFAULT_SITE_DESCRIPTION,
  canonicalUrl,
  ogImageUrl = defaultOgImageUrl(),
  noindex = false,
}) => {
  const metaDescription = truncateMetaDescription(description);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}

      <meta property="og:site_name" content="dStruct" />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="dStruct — LeetCode solution visualizer"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="dstruct.pro" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Head>
  );
};
