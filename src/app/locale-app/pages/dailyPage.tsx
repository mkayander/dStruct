import { DailyPageView } from "#/features/homePage/ui/DailyPageView";

import {
  createDefaultLocaleRouteMetadata,
  createLangRouteMetadata,
} from "#/app/locale-app/createLocaleRouteMetadata";

/** Marketing daily — instant client navigations to sibling routes (L5). */
export const instant = true;

const pickDailyCopy = (translation: {
  HOME_DAILY_SECTION_TITLE: string;
  HOME_DAILY_SECTION_LEAD: string;
}) => ({
  title: `${translation.HOME_DAILY_SECTION_TITLE} — dStruct`,
  description: `${translation.HOME_DAILY_SECTION_TITLE}. ${translation.HOME_DAILY_SECTION_LEAD}`,
});

export const generateDefaultLocaleDailyMetadata =
  createDefaultLocaleRouteMetadata("/daily", pickDailyCopy);

export const generateLangDailyMetadata = createLangRouteMetadata(
  "/daily",
  pickDailyCopy,
);

export function DailyPage() {
  return <DailyPageView />;
}
