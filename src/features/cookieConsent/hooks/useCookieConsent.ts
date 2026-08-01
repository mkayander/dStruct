import { useCallback, useEffect, useState } from "react";

import {
  getStoredCookieConsent,
  storeCookieConsent,
  type CookieConsentPreferences,
} from "#/features/cookieConsent/lib/consentStorage";
import { useHasMounted } from "#/shared/hooks/useHasMounted";

type UseCookieConsentResult = {
  preferences: CookieConsentPreferences | null;
  showBanner: boolean;
  analyticsEnabled: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
};

export const useCookieConsent = (): UseCookieConsentResult => {
  const hasMounted = useHasMounted();
  const [preferences, setPreferences] = useState<CookieConsentPreferences | null>(
    null,
  );

  // Hydrate consent from localStorage after mount to avoid SSR/client mismatch.
  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    setPreferences(getStoredCookieConsent());
  }, [hasMounted]);

  const acceptAll = useCallback(() => {
    const nextPreferences = storeCookieConsent({ analytics: true });
    setPreferences(nextPreferences);
  }, []);

  const rejectNonEssential = useCallback(() => {
    const nextPreferences = storeCookieConsent({ analytics: false });
    setPreferences(nextPreferences);
  }, []);

  const showBanner = hasMounted && preferences === null;
  const analyticsEnabled = preferences?.analytics === true;

  return {
    preferences,
    showBanner,
    analyticsEnabled,
    acceptAll,
    rejectNonEssential,
  };
};
