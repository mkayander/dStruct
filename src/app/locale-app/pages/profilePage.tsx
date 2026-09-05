import type { Metadata } from "next";
import { Suspense } from "react";

import { ProfilePageGate } from "#/features/profile/ui/ProfilePageGate";
import { ProfilePageSkeleton } from "#/features/profile/ui/ProfilePageSkeleton";
import type { Locales } from "#/i18n/i18n-types";
import { baseLocale } from "#/i18n/i18n-util";

import { publicRouteMetadataForLocale } from "#/app/locale-app/createLocaleRouteMetadata";
import { resolveLangParam } from "#/app/locale-app/resolveLangParam";

/** Profile — instant shell with Suspense fallback; user data client-fetched (P10). */
export const instant = true;

const pickProfileCopy = (translation: {
  PROFILE: string;
  SITE_SEO_DESCRIPTION: string;
}) => ({
  title: `${translation.PROFILE} — dStruct`,
  description: translation.SITE_SEO_DESCRIPTION,
});

const profileMetadataOptions = { indexable: false as const };

async function profileMetadataForUser(
  locale: Locales,
  userId: string,
): Promise<Metadata> {
  if (!userId.trim()) {
    return {};
  }
  return publicRouteMetadataForLocale(
    locale,
    `/profile/${userId}`,
    pickProfileCopy,
    profileMetadataOptions,
  );
}

export async function generateDefaultLocaleProfileMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  return profileMetadataForUser(baseLocale, userId);
}

export async function generateLangProfileMetadata({
  params,
}: {
  params: Promise<{ lang: string; userId: string }>;
}): Promise<Metadata> {
  const { lang: langParam, userId } = await params;
  const locale = await resolveLangParam(Promise.resolve({ lang: langParam }));
  if (!locale) {
    return {};
  }
  return profileMetadataForUser(locale, userId);
}

type ProfilePageProps = {
  params: Promise<{ userId: string }>;
};

export function ProfilePage({ params }: ProfilePageProps) {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePageGate params={params} />
    </Suspense>
  );
}
