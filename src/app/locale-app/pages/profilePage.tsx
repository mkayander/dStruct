import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProfilePageSkeleton } from "#/features/profile/ui/ProfilePageSkeleton";
import { ProfilePageView } from "#/features/profile/ui/ProfilePageView";
import type { Locales, Translation } from "#/i18n/i18n-types";
import { baseLocale } from "#/i18n/i18n-util";
import { authOptions } from "#/server/auth/authOptions";
import { getProfileInitialData } from "#/server/profile/getProfileInitialData";

import { ApolloHydrationProvider } from "#/app/locale-app/ApolloHydrationProvider";
import { publicRouteMetadataForLocale } from "#/app/locale-app/createLocaleRouteMetadata";
import { resolveLangParamSync } from "#/app/locale-app/resolveLangParam";

/** Profile — instant shell with Suspense fallback; user data prefetched when possible. */
export const instant = true;

const pickProfileCopy = (translation: Translation) => ({
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
  const locale = resolveLangParamSync(langParam);
  if (!locale) {
    return {};
  }
  return profileMetadataForUser(locale, userId);
}

type ProfilePageProps = {
  params: Promise<{ userId: string; lang?: string }>;
};

/** Server gate: validate `userId` and prefetch LeetCode profile when session allows. */
async function ProfilePageContent({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  if (!userId.trim()) {
    notFound();
  }

  const [session, cookieStore] = await Promise.all([
    getServerSession(authOptions),
    cookies(),
  ]);
  const leetCodeUsername = session?.user?.leetCodeUsername;
  const leetCodeSession = cookieStore.get("LEETCODE_SESSION")?.value ?? null;
  const initialCache = await getProfileInitialData(
    leetCodeUsername,
    leetCodeSession,
  );

  return (
    <ApolloHydrationProvider initialCache={initialCache}>
      <ProfilePageView />
    </ApolloHydrationProvider>
  );
}

export function ProfilePage({ params }: ProfilePageProps) {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePageContent params={params} />
    </Suspense>
  );
}
