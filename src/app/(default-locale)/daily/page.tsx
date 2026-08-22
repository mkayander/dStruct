import type { Metadata } from "next";

import { DailyPageView } from "#/features/homePage/ui/DailyPageView";
import { baseLocale } from "#/i18n/i18n-util";

import { publicPageMetadataFromTranslation } from "#/app/locale-app/publicPageMetadataFromTranslation";

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataFromTranslation(
    baseLocale,
    "/daily",
    (translation) => ({
      title: `${translation.HOME_DAILY_SECTION_TITLE} — dStruct`,
      description: `${translation.HOME_DAILY_SECTION_TITLE}. ${translation.HOME_DAILY_SECTION_LEAD}`,
    }),
  );
}

export default function DefaultLocaleDailyPage() {
  return <DailyPageView />;
}
