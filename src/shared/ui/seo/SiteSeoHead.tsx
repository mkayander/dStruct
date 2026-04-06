import Head from "next/head";
import type React from "react";

import {
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_SITE_DESCRIPTION,
  SITE_HOSTNAME,
  truncateMetaDescription,
} from "#/shared/lib/seo";

/**
 * Props for {@link SiteSeoHead}: per-page title, description, canonical, and social preview.
 */
export type SiteSeoHeadProps = {
  /** Document `<title>`; also used for `og:title` and `twitter:title`. */
  title: string;
  /** Meta description and social descriptions; defaults to {@link DEFAULT_SITE_DESCRIPTION}. */
  description?: string;
  /** Absolute canonical URL; must match the preferred URL for this document (incl. locale prefix). */
  canonicalUrl: string;
  /** Open Graph / Twitter image URL; defaults to {@link DEFAULT_OG_IMAGE_URL}. */
  ogImageUrl?: string;
  /**
   * When true, emits `robots` so the page is not indexed.
   * Default combination is `noindex, follow` so crawlers may still follow links to public pages.
   */
  noindex?: boolean;
  /**
   * When `noindex` is true: if true, use `noindex, nofollow`; if false (default), use `noindex, follow`.
   */
  noFollowWhenNoindex?: boolean;
};

/**
 * Renders `next/head` tags for core SEO and social sharing (canonical, meta description,
 * Open Graph, Twitter Card). Use once per page instead of duplicating tags in `_document`.
 */
export const SiteSeoHead: React.FC<SiteSeoHeadProps> = ({
  title,
  description = DEFAULT_SITE_DESCRIPTION,
  canonicalUrl,
  ogImageUrl = DEFAULT_OG_IMAGE_URL,
  noindex = false,
  noFollowWhenNoindex = false,
}) => {
  const metaDescription = truncateMetaDescription(description);
  const robotsWhenNoindex = noFollowWhenNoindex
    ? "noindex, nofollow"
    : "noindex, follow";

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
