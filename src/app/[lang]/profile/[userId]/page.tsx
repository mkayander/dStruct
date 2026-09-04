import type { Metadata } from "next";
import { Suspense } from "react";

import { ProfilePageGate } from "#/features/profile/ui/ProfilePageGate";
import { ProfilePageSkeleton } from "#/features/profile/ui/ProfilePageSkeleton";
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

export default function LangProfilePage({
  params,
}: {
  params: Promise<{ lang: string; userId: string }>;
}) {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePageGate params={params} />
    </Suspense>
  );
}
