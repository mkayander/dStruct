import { DailyPageView } from "#/features/homePage/ui/DailyPageView";
import type { Translation } from "#/i18n/i18n-types";
import { getDailyInitialData } from "#/server/daily/getDailyInitialData";

import { ApolloHydrationProvider } from "#/app/locale-app/ApolloHydrationProvider";
import {
  createDefaultLocaleRouteMetadata,
  createLangRouteMetadata,
} from "#/app/locale-app/createLocaleRouteMetadata";

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

export async function DailyPage() {
  const initialCache = await getDailyInitialData();

  return (
    <ApolloHydrationProvider initialCache={initialCache}>
      <DailyPageView />
    </ApolloHydrationProvider>
  );
}
