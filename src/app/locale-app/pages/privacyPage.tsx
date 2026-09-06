import { PrivacyPageContent } from "#/features/privacy/ui/PrivacyPageContent";
import { PrivacyPageShell } from "#/features/privacy/ui/PrivacyPageShell";
import { createTranslationFunctions } from "#/i18n/createTranslationFunctions";
import type { Locales, Translation } from "#/i18n/i18n-types";
import { baseLocale } from "#/i18n/i18n-util";
import { loadI18nForLocale } from "#/i18n/loadI18nForLocale";

import {
  createDefaultLocaleRouteMetadata,
  createLangRouteMetadata,
} from "#/app/locale-app/createLocaleRouteMetadata";
import { resolveLangParamSync } from "#/app/locale-app/resolveLangParam";

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

async function resolvePrivacyLocale(
  params?: Promise<{ lang?: string }>,
): Promise<Locales> {
  if (!params) {
    return baseLocale;
  }
  const { lang: langParam } = await params;
  if (!langParam) {
    return baseLocale;
  }
  return resolveLangParamSync(langParam) ?? baseLocale;
}

export async function PrivacyPage({ params }: PrivacyPageProps = {}) {
  const locale = await resolvePrivacyLocale(params);
  const { translations } = await loadI18nForLocale(locale);
  const translation = translations[locale];
  if (!translation) {
    throw new Error(`Missing translations for locale: ${locale}`);
  }
  const LL = createTranslationFunctions(locale, translation);
  const homePath = locale === baseLocale ? "/" : `/${locale}`;

  return (
    <PrivacyPageShell>
      <PrivacyPageContent LL={LL} homePath={homePath} />
    </PrivacyPageShell>
  );
}
