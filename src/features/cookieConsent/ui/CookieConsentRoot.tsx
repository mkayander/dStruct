"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import React, { useState } from "react";

import {
  CookieConsentProvider,
  useCookieConsentController,
} from "#/features/cookieConsent/context/CookieConsentContext";
import { CookieConsentBannerWithDismissEffect } from "#/features/cookieConsent/ui/CookieConsentBannerWithDismissEffect";
import { useHasMounted } from "#/shared/hooks/useHasMounted";

type CookieConsentRootProps = {
  children: React.ReactNode;
};

export const CookieConsentRoot: React.FC<CookieConsentRootProps> = ({
  children,
}) => {
  const hasMounted = useHasMounted();
  const consent = useCookieConsentController();
  const [isDismissAnimating, setIsDismissAnimating] = useState(false);
  const showConsentChrome = hasMounted;
  const showBanner = consent.showBanner || isDismissAnimating;

  return (
    <CookieConsentProvider
      value={{ openCookieSettings: consent.openCookieSettings }}
    >
      {children}
      {showConsentChrome && showBanner ? (
        <CookieConsentBannerWithDismissEffect
          isSettingsView={consent.isSettingsView}
          onAcceptAll={consent.acceptAll}
          onRejectNonEssential={consent.rejectNonEssential}
          onClose={consent.closeCookieSettings}
          onBeginDismiss={() => setIsDismissAnimating(true)}
          onCompleteDismiss={() => setIsDismissAnimating(false)}
        />
      ) : null}
      {showConsentChrome && consent.analyticsEnabled ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
    </CookieConsentProvider>
  );
};
