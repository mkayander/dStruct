import { useMemo, useSyncExternalStore } from "react";

import {
  CONSENT_STORAGE_KEY,
  parseCookieConsentRaw,
  subscribeCookieConsent,
  type CookieConsentPreferences,
} from "#/features/cookieConsent/lib/consentStorage";

const getClientSnapshot = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(CONSENT_STORAGE_KEY);
};

const getServerSnapshot = (): string | null => null;

export const useCookieConsentStorage = (): CookieConsentPreferences | null => {
  const rawSnapshot = useSyncExternalStore(
    subscribeCookieConsent,
    getClientSnapshot,
    getServerSnapshot,
  );

  return useMemo(
    () => parseCookieConsentRaw(rawSnapshot),
    [rawSnapshot],
  );
};
