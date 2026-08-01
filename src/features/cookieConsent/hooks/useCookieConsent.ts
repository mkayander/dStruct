import { useCallback, useState } from "react";

import { useCookieConsentStorage } from "#/features/cookieConsent/hooks/useCookieConsentStorage";
import { storeCookieConsent } from "#/features/cookieConsent/lib/consentStorage";

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
  const preferences = useCookieConsentStorage();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const closeCookieSettings = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  const acceptAll = useCallback(() => {
    storeCookieConsent({ analytics: true });
    setSettingsOpen(false);
  }, []);

  const rejectNonEssential = useCallback(() => {
    storeCookieConsent({ analytics: false });
    setSettingsOpen(false);
  }, []);

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
