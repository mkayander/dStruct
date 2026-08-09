import type { Locales } from "#/i18n/i18n-types";

/**
 * Map a language-select DOM value to a configured locale.
 * Literal switch only (no path building) so navigation sinks stay CodeQL-safe.
 */
export function parseSelectLocaleValue(value: string): Locales | null {
  switch (value) {
    case "ar":
      return "ar";
    case "be":
      return "be";
    case "de":
      return "de";
    case "en":
      return "en";
    case "es":
      return "es";
    case "fr":
      return "fr";
    case "hi":
      return "hi";
    case "id":
      return "id";
    case "it":
      return "it";
    case "ja":
      return "ja";
    case "ko":
      return "ko";
    case "nl":
      return "nl";
    case "pl":
      return "pl";
    case "pt":
      return "pt";
    case "ru":
      return "ru";
    case "sr":
      return "sr";
    case "tr":
      return "tr";
    case "uk":
      return "uk";
    case "vi":
      return "vi";
    case "zh":
      return "zh";
    default:
      return null;
  }
}
