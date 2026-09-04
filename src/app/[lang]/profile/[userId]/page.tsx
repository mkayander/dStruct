import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import { ProfilePageSkeleton } from "#/features/profile/ui/ProfilePageSkeleton";
import { ProfilePageView } from "#/features/profile/ui/ProfilePageView";
import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";

import { publicPageMetadataFromTranslation } from "#/app/locale-app/publicPageMetadataFromTranslation";

/** Profile — instant shell with Suspense fallback; user data client-fetched (P10). */
export const instant = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; userId: string }>;
}): Promise<Metadata> {
  const { lang: langParam, userId } = await params;
  if (!locales.includes(langParam as Locales) || !userId.trim()) {
    return {};
  }
  const locale = langParam as Locales;
  const pagePath = `/profile/${userId}`;

  return publicPageMetadataFromTranslation(
    locale,
    pagePath,
    (translation) => ({
      title: `${translation.PROFILE} — dStruct`,
      description: translation.SITE_SEO_DESCRIPTION,
    }),
    { indexable: false },
  );
}

export default async function LangProfilePage({
  params,
}: {
  params: Promise<{ lang: string; userId: string }>;
}) {
  const { userId } = await params;
  if (!userId.trim()) {
    notFound();
  }

  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePageView />
    </Suspense>
  );
}
