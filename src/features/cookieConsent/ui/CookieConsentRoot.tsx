"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import React from "react";

import {
  CookieConsentProvider,
  useCookieConsentController,
} from "#/features/cookieConsent/context/CookieConsentContext";
import { CookieConsentBanner } from "#/features/cookieConsent/ui/CookieConsentBanner";

type CookieConsentRootProps = {
  children: React.ReactNode;
};

export const CookieConsentRoot: React.FC<CookieConsentRootProps> = ({
  children,
}) => {
  const consent = useCookieConsentController();

  return (
    <CookieConsentProvider value={{ openCookieSettings: consent.openCookieSettings }}>
      {children}
      {consent.showBanner ? (
        <CookieConsentBanner
          isSettingsView={consent.isSettingsView}
          onAcceptAll={consent.acceptAll}
          onRejectNonEssential={consent.rejectNonEssential}
          onClose={consent.closeCookieSettings}
        />
      ) : null}
      {consent.analyticsEnabled ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
    </CookieConsentProvider>
  );
};
