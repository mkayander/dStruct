import { DailyApolloIsland } from "#/features/homePage/ui/DailyApolloIsland";
import { DailyPageContent } from "#/features/homePage/ui/DailyPageContent";
import { getServerTranslationFunctions } from "#/i18n/getServerTranslationFunctions";
import type { Translation } from "#/i18n/i18n-types";

import {
  createDefaultLocaleRouteMetadata,
  createLangRouteMetadata,
} from "#/app/locale-app/createLocaleRouteMetadata";
import { resolvePageLocale } from "#/app/locale-app/resolvePageLocale";

/** Marketing daily — instant client navigations to sibling routes (L5). */
export const instant = true;

const pickDailyCopy = (translation: Translation) => ({
  title: `${translation.HOME_DAILY_SECTION_TITLE} — dStruct`,
  description: `${translation.HOME_DAILY_SECTION_TITLE}. ${translation.HOME_DAILY_SECTION_LEAD}`,
});

export const generateDefaultLocaleDailyMetadata =
  createDefaultLocaleRouteMetadata("/daily", pickDailyCopy);

export const generateLangDailyMetadata = createLangRouteMetadata(
  "/daily",
  pickDailyCopy,
);

type DailyPageProps = {
  params?: Promise<{ lang?: string }>;
};

export async function DailyPage({ params }: DailyPageProps = {}) {
  const locale = await resolvePageLocale(params);
  const LL = await getServerTranslationFunctions(locale);

  return (
    <DailyPageContent LL={LL}>
      <DailyApolloIsland />
    </DailyPageContent>
  );
}
