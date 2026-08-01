import { useBrowserStorageSnapshot } from "#/shared/browser-storage";

import {
  cookieConsentStorage,
  type CookieConsentPreferences,
} from "#/features/cookieConsent/lib/consentStorage";

export const useCookieConsentStorage = (): CookieConsentPreferences | null =>
  useBrowserStorageSnapshot(cookieConsentStorage);
