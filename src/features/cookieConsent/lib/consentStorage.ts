import {
  createVersionedJsonStorage,
  type VersionedJsonBrowserStorage,
} from "#/shared/browser-storage";

export type CookieConsentPreferences = {
  analytics: boolean;
  decidedAt: string;
};

type StoredCookieConsentPayload = {
  preferences: CookieConsentPreferences;
};

export const CONSENT_STORAGE_KEY = "dstruct-cookie-consent";
const CONSENT_VERSION = 1;

const parseConsentPayload = (payload: unknown): CookieConsentPreferences | null => {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("preferences" in payload)
  ) {
    return null;
  }

  const { preferences } = payload as StoredCookieConsentPayload;
  if (
    typeof preferences.analytics !== "boolean" ||
    typeof preferences.decidedAt !== "string"
  ) {
    return null;
  }

  return preferences;
};

export const cookieConsentStorage: VersionedJsonBrowserStorage<CookieConsentPreferences> =
  createVersionedJsonStorage<CookieConsentPreferences>({
    key: CONSENT_STORAGE_KEY,
    version: CONSENT_VERSION,
    parsePayload: parseConsentPayload,
    wrapPayload: (preferences) => ({ preferences }),
  });

export const parseCookieConsentRaw = cookieConsentStorage.parseRaw;

export const getStoredCookieConsent = (): CookieConsentPreferences | null =>
  cookieConsentStorage.get();

export const storeCookieConsent = (
  preferences: Omit<CookieConsentPreferences, "decidedAt">,
): CookieConsentPreferences | null => {
  const nextPreferences: CookieConsentPreferences = {
    ...preferences,
    decidedAt: new Date().toISOString(),
  };

  const stored = cookieConsentStorage.set(nextPreferences);
  return stored ? nextPreferences : null;
};

export const clearStoredCookieConsent = (): void => {
  cookieConsentStorage.remove();
};

export const subscribeCookieConsent = (
  listener: () => void,
): (() => void) => cookieConsentStorage.subscribe(listener);
