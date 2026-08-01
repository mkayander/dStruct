import { cookieConsentStorage, type CookieConsentPreferences } from "#/features/cookieConsent/lib/consentStorage";
import { useBrowserStorageSnapshot } from "#/shared/browser-storage";

export const useCookieConsentStorage = (): CookieConsentPreferences | null =>
  useBrowserStorageSnapshot(cookieConsentStorage);
