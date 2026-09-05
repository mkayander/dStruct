import { PrivacyPageView } from "#/features/privacy/ui/PrivacyPageView";

import {
  createDefaultLocaleRouteMetadata,
  createLangRouteMetadata,
} from "#/app/locale-app/createLocaleRouteMetadata";

/** Marketing privacy — instant client navigations to sibling routes (L5). */
export const instant = true;

const pickPrivacyCopy = (translation: {
  PRIVACY_PAGE_TITLE: string;
  PRIVACY_INTRO: string;
}) => ({
  title: `${translation.PRIVACY_PAGE_TITLE} — dStruct`,
  description: translation.PRIVACY_INTRO,
});

export const generateDefaultLocalePrivacyMetadata =
  createDefaultLocaleRouteMetadata("/privacy", pickPrivacyCopy);

export const generateLangPrivacyMetadata = createLangRouteMetadata(
  "/privacy",
  pickPrivacyCopy,
);

export function PrivacyPage() {
  return <PrivacyPageView />;
}
