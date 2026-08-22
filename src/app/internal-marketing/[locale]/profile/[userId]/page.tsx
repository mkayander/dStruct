import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProfilePageView } from "#/features/profile/ui/ProfilePageView";
import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";

import { pilotPageMetadataFromTranslation } from "#/app/internal-marketing/pilotPageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; userId: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, userId } = await params;
  if (!locales.includes(localeParam as Locales) || !userId.trim()) {
    return { robots: { index: false, follow: false } };
  }
  const locale = localeParam as Locales;
  const pagePath = `/profile/${userId}`;

  return pilotPageMetadataFromTranslation(locale, pagePath, (translation) => ({
    title: `${translation.PROFILE} — dStruct`,
    description: translation.SITE_SEO_DESCRIPTION,
  }));
}

/** Instant Nav pilot: profile (noindex; public `/profile/[userId]` remains canonical). */
export default async function InternalMarketingProfilePage({
  params,
}: {
  params: Promise<{ locale: string; userId: string }>;
}) {
  const { userId } = await params;
  if (!userId.trim()) {
    notFound();
  }

  return <ProfilePageView />;
}
