export type CookieConsentPreferences = {
  analytics: boolean;
  decidedAt: string;
};

type StoredCookieConsent = {
  version: number;
  preferences: CookieConsentPreferences;
};

const CONSENT_STORAGE_KEY = "dstruct-cookie-consent";
const CONSENT_VERSION = 1;

const runOnClient = <T>(fn: () => T): T | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return fn();
};

const parseStoredConsent = (raw: string): StoredCookieConsent | null => {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      !("preferences" in parsed)
    ) {
      return null;
    }

    const stored = parsed as StoredCookieConsent;
    if (stored.version !== CONSENT_VERSION) {
      return null;
    }

    const { preferences } = stored;
    if (
      typeof preferences.analytics !== "boolean" ||
      typeof preferences.decidedAt !== "string"
    ) {
      return null;
    }

    return stored;
  } catch {
    return null;
  }
};

export const getStoredCookieConsent = (): CookieConsentPreferences | null => {
  const stored = runOnClient(() => {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return parseStoredConsent(raw);
  });

  return stored?.preferences ?? null;
};

export const storeCookieConsent = (
  preferences: Omit<CookieConsentPreferences, "decidedAt">,
): CookieConsentPreferences => {
  const nextPreferences: CookieConsentPreferences = {
    ...preferences,
    decidedAt: new Date().toISOString(),
  };

  runOnClient(() => {
    const payload: StoredCookieConsent = {
      version: CONSENT_VERSION,
      preferences: nextPreferences,
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  });

  return nextPreferences;
};

export const clearStoredCookieConsent = (): void => {
  runOnClient(() => localStorage.removeItem(CONSENT_STORAGE_KEY));
};
