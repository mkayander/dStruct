import Head from "next/head";
import type React from "react";

import {
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_SITE_DESCRIPTION,
  SITE_HOSTNAME,
  truncateMetaDescription,
} from "#/shared/lib/seo";

export type SiteSeoHeadProps = {
  title: string;
  description?: string;
  canonicalUrl: string;
  ogImageUrl?: string;
  /** Use for account or low-value pages that should not appear in search results. */
  noindex?: boolean;
  /**
   * When `noindex` is true, pass `false` to disallow following links (default).
   * Prefer `noindex, follow` so crawlers can still discover linked public pages.
   */
  noFollowWhenNoindex?: boolean;
};

export const SiteSeoHead: React.FC<SiteSeoHeadProps> = ({
  title,
  description = DEFAULT_SITE_DESCRIPTION,
  canonicalUrl,
  ogImageUrl = DEFAULT_OG_IMAGE_URL,
  noindex = false,
  noFollowWhenNoindex = false,
}) => {
  const metaDescription = truncateMetaDescription(description);
  const robotsWhenNoindex = noFollowWhenNoindex ? "noindex, nofollow" : "noindex, follow";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex ? <meta name="robots" content={robotsWhenNoindex} /> : null}

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
      <meta name="twitter:domain" content={SITE_HOSTNAME} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Head>
  );
};
