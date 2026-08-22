import type { Metadata } from "next";

import { PrivacyPageView } from "#/features/privacy/ui/PrivacyPageView";
import { baseLocale } from "#/i18n/i18n-util";

import { publicPageMetadataFromTranslation } from "#/app/locale-app/publicPageMetadataFromTranslation";

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataFromTranslation(
    baseLocale,
    "/privacy",
    (translation) => ({
      title: `${translation.PRIVACY_PAGE_TITLE} — dStruct`,
      description: translation.PRIVACY_INTRO,
    }),
  );
}

export default function DefaultLocalePrivacyPage() {
  return <PrivacyPageView />;
}
