import type { Metadata } from "next";

import type { Locales } from "#/i18n/i18n-types";
import { localePathForPage } from "#/i18n/localePathForPage";
import {
  absoluteUrlFromPathname,
  DEFAULT_OG_IMAGE_URL,
  SITE_HOSTNAME,
  truncateMetaDescription,
} from "#/shared/lib/seo";

const pilotRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
};

type InternalMarketingPilotMetadataInput = {
  locale: Locales;
  /** Public page path without locale prefix, e.g. `"/"` or `"/privacy"`. */
  pagePath: string;
  title: string;
  description: string;
};

/** SEO for `/internal-marketing/[locale]/*` pilot routes (noindex; canonical = public URL). */
export function internalMarketingPilotMetadata({
  locale,
  pagePath,
  title,
  description,
}: InternalMarketingPilotMetadataInput): Metadata {
  const canonicalUrl = absoluteUrlFromPathname(
    localePathForPage(locale, pagePath),
  );
  const metaDescription = truncateMetaDescription(description);

  return {
    title,
    description: metaDescription,
    robots: pilotRobots,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      siteName: "dStruct",
      title,
      type: "website",
      url: canonicalUrl,
      description: metaDescription,
      images: [
        {
          url: DEFAULT_OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: "dStruct — LeetCode solution visualizer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [DEFAULT_OG_IMAGE_URL],
    },
    other: {
      "twitter:domain": SITE_HOSTNAME,
      "twitter:url": canonicalUrl,
    },
  };
}
