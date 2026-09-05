import { PrivacyPageView } from "#/features/privacy/ui/PrivacyPageView";
import type { Translation } from "#/i18n/i18n-types";

import {
  createDefaultLocaleRouteMetadata,
  createLangRouteMetadata,
} from "#/app/locale-app/createLocaleRouteMetadata";

/** Marketing privacy — instant client navigations to sibling routes (L5). */
export const instant = true;

const pickPrivacyCopy = (translation: Translation) => ({
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
