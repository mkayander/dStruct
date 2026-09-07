import { PrivacyPageContent } from "#/features/privacy/ui/PrivacyPageContent";
import { getServerTranslationFunctions } from "#/i18n/getServerTranslationFunctions";
import type { Translation } from "#/i18n/i18n-types";
import { baseLocale } from "#/i18n/i18n-util";

import {
  createDefaultLocaleRouteMetadata,
  createLangRouteMetadata,
} from "#/app/locale-app/createLocaleRouteMetadata";
import { resolvePageLocale } from "#/app/locale-app/resolvePageLocale";

/** Marketing privacy — instant client navigations; body is server-rendered (RSC). */
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

type PrivacyPageProps = {
  params?: Promise<{ lang?: string }>;
};

export async function PrivacyPage({ params }: PrivacyPageProps = {}) {
  const locale = await resolvePageLocale(params);
  const LL = await getServerTranslationFunctions(locale);
  const homePath = locale === baseLocale ? "/" : `/${locale}`;

  return <PrivacyPageContent LL={LL} homePath={homePath} />;
}
