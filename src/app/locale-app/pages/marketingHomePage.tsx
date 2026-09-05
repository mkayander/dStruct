import { MarketingHomeView } from "#/features/homePage/ui/MarketingHomeView";

import {
  createDefaultLocaleRouteMetadata,
  createLangRouteMetadata,
} from "#/app/locale-app/createLocaleRouteMetadata";

/** Marketing home — instant client navigations to sibling routes (L5). */
export const instant = true;

const pickHomeCopy = (translation: {
  SITE_SEO_TITLE: string;
  SITE_SEO_DESCRIPTION: string;
}) => ({
  title: translation.SITE_SEO_TITLE,
  description: translation.SITE_SEO_DESCRIPTION,
});

export const generateDefaultLocaleHomeMetadata =
  createDefaultLocaleRouteMetadata("/", pickHomeCopy);

export const generateLangHomeMetadata = createLangRouteMetadata(
  "/",
  pickHomeCopy,
);

export function MarketingHomePage() {
  return <MarketingHomeView />;
}
