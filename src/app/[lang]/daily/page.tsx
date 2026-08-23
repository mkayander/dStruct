import type { Metadata } from "next";

import { DailyPageView } from "#/features/homePage/ui/DailyPageView";
import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";

import { publicPageMetadataFromTranslation } from "#/app/locale-app/publicPageMetadataFromTranslation";

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

  return publicPageMetadataFromTranslation(locale, "/daily", (translation) => ({
    title: `${translation.HOME_DAILY_SECTION_TITLE} — dStruct`,
    description: `${translation.HOME_DAILY_SECTION_TITLE}. ${translation.HOME_DAILY_SECTION_LEAD}`,
  }));
}

export default function LangDailyPage() {
  return <DailyPageView />;
}
