import type { Locales } from "./i18n-types";
import { locales } from "./i18n-util";

/** Native-language labels for the language picker (every locale must have an entry). */
export const localeLabels: Record<Locales, string> = {
  ar: "العربية",
  be: "Беларуская",
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  hi: "हिन्दी",
  id: "Bahasa Indonesia",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  nl: "Nederlands",
  pl: "Polski",
  pt: "Português",
  ru: "Русский",
  sr: "Srpski",
  tr: "Türkçe",
  uk: "Українська",
  vi: "Tiếng Việt",
  zh: "简体中文",
};

/**
 * Locales shown in the settings language select: high-traffic EdTech markets first,
 * then the rest alphabetically by label. Must include every configured locale.
 */
const EDTECH_LOCALE_ORDER: Locales[] = [
  "en",
  "es",
  "pt",
  "fr",
  "de",
  "zh",
  "hi",
  "ja",
  "ko",
  "ru",
  "ar",
  "vi",
  "id",
  "tr",
  "it",
  "pl",
  "nl",
  "uk",
  "be",
  "sr",
];

export const localesForLanguagePicker: Locales[] = (() => {
  const configured = new Set(locales);
  const ordered = EDTECH_LOCALE_ORDER.filter((localeCode) =>
    configured.has(localeCode),
  );
  const missingFromOrder = locales.filter(
    (localeCode) => !ordered.includes(localeCode),
  );
  missingFromOrder.sort((left, right) =>
    localeLabels[left].localeCompare(localeLabels[right], "en"),
  );
  return [...ordered, ...missingFromOrder];
})();
