import type { Locales } from "#/i18n/i18n-types";
import { createStringStorage } from "#/shared/browser-storage";

const localeStorage = createStringStorage({
  key: "locale",
});

export const getStoredLocale = (): Locales | null => {
  const value = localeStorage.get();
  return value ? (value as Locales) : null;
};

export const setStoredLocale = (locale: Locales): boolean =>
  localeStorage.set(locale);
