import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";
import { loadI18nForLocale } from "#/i18n/loadI18nForLocale";
import { authOptions } from "#/pages/api/auth/[...nextauth]";
import {
  absoluteUrlFromPathname,
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_SITE_DESCRIPTION,
  SITE_HOSTNAME,
  truncateMetaDescription,
} from "#/shared/lib/seo";

import { AppRootLayoutClient } from "#/app/AppRootLayoutClient";

const homeTitle = "dStruct — visualize LeetCode solutions";

function localePathForSeo(locale: string): string {
  return locale === "en" ? "/" : `/${locale}`;
}

export function generateStaticParams(): { locale: Locales }[] {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!locales.includes(localeParam as Locales)) {
    return { title: homeTitle };
  }
  const locale = localeParam as Locales;
  const canonicalUrl = absoluteUrlFromPathname(localePathForSeo(locale));
  const metaDescription = truncateMetaDescription(DEFAULT_SITE_DESCRIPTION);

  return {
    title: homeTitle,
    description: metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      siteName: "dStruct",
      title: homeTitle,
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
      title: homeTitle,
      description: metaDescription,
      images: [DEFAULT_OG_IMAGE_URL],
    },
    other: {
      "twitter:domain": SITE_HOSTNAME,
      "twitter:url": canonicalUrl,
    },
  };
}

export default async function InternalMarketingLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!locales.includes(localeParam as Locales)) {
    notFound();
  }
  const locale = localeParam as Locales;
  const session = await getServerSession(authOptions);
  const i18n = await loadI18nForLocale(locale);

  return (
    <AppRootLayoutClient session={session} i18n={i18n} locale={locale}>
      {children}
    </AppRootLayoutClient>
  );
}
