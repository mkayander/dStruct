import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import { ProfilePageSkeleton } from "#/features/profile/ui/ProfilePageSkeleton";
import { ProfilePageView } from "#/features/profile/ui/ProfilePageView";
import { baseLocale } from "#/i18n/i18n-util";

import { publicPageMetadataFromTranslation } from "#/app/locale-app/publicPageMetadataFromTranslation";

/** Profile — instant shell with Suspense fallback; user data client-fetched (P10). */
export const instant = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  if (!userId.trim()) {
    return {};
  }
  const pagePath = `/profile/${userId}`;

  return publicPageMetadataFromTranslation(
    baseLocale,
    pagePath,
    (translation) => ({
      title: `${translation.PROFILE} — dStruct`,
      description: translation.SITE_SEO_DESCRIPTION,
    }),
    { indexable: false },
  );
}

export default async function DefaultLocaleProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
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
