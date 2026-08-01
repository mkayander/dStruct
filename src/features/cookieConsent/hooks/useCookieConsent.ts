import { useCallback, useState } from "react";
import { useSnackbar } from "notistack";

import { useCookieConsentStorage } from "#/features/cookieConsent/hooks/useCookieConsentStorage";
import { storeCookieConsent } from "#/features/cookieConsent/lib/consentStorage";
import { useI18nContext } from "#/shared/hooks";

type UseCookieConsentResult = {
  showBanner: boolean;
  isSettingsView: boolean;
  analyticsEnabled: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
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
    (analytics: boolean) => {
      const stored = storeCookieConsent({ analytics });
      if (stored) {
        setSettingsOpen(false);
        return;
      }

      enqueueSnackbar(LL.COOKIE_CONSENT_STORE_FAILED(), { variant: "error" });
    },
    [enqueueSnackbar, LL],
  );

  const acceptAll = useCallback(() => {
    persistConsent(true);
  }, [persistConsent]);

  const rejectNonEssential = useCallback(() => {
    persistConsent(false);
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
