import {
  type CookieConsentPreferences,
  cookieConsentStorage,
} from "#/features/cookieConsent/lib/consentStorage";
import { useBrowserStorageSnapshot } from "#/shared/browser-storage";

export const useCookieConsentStorage = (): CookieConsentPreferences | null =>
  useBrowserStorageSnapshot(cookieConsentStorage);
