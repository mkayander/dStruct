import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";

import { useCookieConsentStorage } from "#/features/cookieConsent/hooks/useCookieConsentStorage";
import { storeCookieConsent } from "#/features/cookieConsent/lib/consentStorage";
import { useI18nContext } from "#/shared/hooks";

type UseCookieConsentResult = {
  showBanner: boolean;
  isSettingsView: boolean;
  analyticsEnabled: boolean;
  acceptAll: () => boolean;
  rejectNonEssential: () => boolean;
  openCookieSettings: () => void;
  closeCookieSettings: () => void;
};

export const useCookieConsent = (): UseCookieConsentResult => {
  const { LL } = useI18nContext();
  const { enqueueSnackbar } = useSnackbar();
  const preferences = useCookieConsentStorage();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const closeCookieSettings = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  const persistConsent = useCallback(
    (analytics: boolean): boolean => {
      const stored = storeCookieConsent({ analytics });
      if (stored) {
        setSettingsOpen(false);
        return true;
      }

      enqueueSnackbar(LL.COOKIE_CONSENT_STORE_FAILED(), { variant: "error" });
      return false;
    },
    [enqueueSnackbar, LL],
  );

  const acceptAll = useCallback((): boolean => {
    return persistConsent(true);
  }, [persistConsent]);

  const rejectNonEssential = useCallback((): boolean => {
    return persistConsent(false);
  }, [persistConsent]);

  const openCookieSettings = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  const hasUndecidedConsent = preferences === null;
  const showBanner = hasUndecidedConsent || settingsOpen;
  const isSettingsView = settingsOpen && !hasUndecidedConsent;
  const analyticsEnabled = preferences?.analytics === true;

  return {
    showBanner,
    isSettingsView,
    analyticsEnabled,
    acceptAll,
    rejectNonEssential,
    openCookieSettings,
    closeCookieSettings,
  };
};
