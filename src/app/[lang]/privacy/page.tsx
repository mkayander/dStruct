import type { Metadata } from "next";

import { PrivacyPageView } from "#/features/privacy/ui/PrivacyPageView";
import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";

import { publicPageMetadataFromTranslation } from "#/app/locale-app/publicPageMetadataFromTranslation";

/** Marketing privacy — instant client navigations to sibling routes (L5). */
export const instant = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: langParam } = await params;
  if (!locales.includes(langParam as Locales)) {
    return {};
  }
  const locale = langParam as Locales;

  return publicPageMetadataFromTranslation(
    locale,
    "/privacy",
    (translation) => ({
      title: `${translation.PRIVACY_PAGE_TITLE} — dStruct`,
      description: translation.PRIVACY_INTRO,
    }),
  );
}

export default function LangPrivacyPage() {
  return <PrivacyPageView />;
}
