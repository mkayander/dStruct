export type CookieConsentPreferences = {
  analytics: boolean;
  decidedAt: string;
};

type StoredCookieConsent = {
  version: number;
  preferences: CookieConsentPreferences;
};

export const CONSENT_STORAGE_KEY = "dstruct-cookie-consent";
const CONSENT_VERSION = 1;

const consentListeners = new Set<() => void>();

const runOnClient = <T>(fn: () => T): T | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return fn();
};

const notifyConsentListeners = () => {
  consentListeners.forEach((listener) => listener());
};

export const subscribeCookieConsent = (listener: () => void): (() => void) => {
  consentListeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === CONSENT_STORAGE_KEY) {
      listener();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    consentListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
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

export const parseCookieConsentRaw = (
  raw: string | null,
): CookieConsentPreferences | null => {
  if (!raw) {
    return null;
  }

  return parseStoredConsent(raw)?.preferences ?? null;
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
): CookieConsentPreferences | null => {
  const nextPreferences: CookieConsentPreferences = {
    ...preferences,
    decidedAt: new Date().toISOString(),
  };

  const stored = runOnClient(() => {
    try {
      const payload: StoredCookieConsent = {
        version: CONSENT_VERSION,
        preferences: nextPreferences,
      };
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
      notifyConsentListeners();
      return nextPreferences;
    } catch {
      return null;
    }
  });

  return stored ?? null;
};

export const clearStoredCookieConsent = (): void => {
  runOnClient(() => {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      notifyConsentListeners();
    } catch {
      // Ignore storage errors (private mode, quota).
    }
  });
};
