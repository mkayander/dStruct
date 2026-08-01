"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import React from "react";

import { useCookieConsent } from "#/features/cookieConsent/hooks/useCookieConsent";
import { CookieConsentBanner } from "#/features/cookieConsent/ui/CookieConsentBanner";

type CookieConsentRootProps = {
  children: React.ReactNode;
};

export const CookieConsentRoot: React.FC<CookieConsentRootProps> = ({
  children,
}) => {
  const {
    showBanner,
    analyticsEnabled,
    acceptAll,
    rejectNonEssential,
  } = useCookieConsent();

  return (
    <>
      {children}
      {showBanner ? (
        <CookieConsentBanner
          onAcceptAll={acceptAll}
          onRejectNonEssential={rejectNonEssential}
        />
      ) : null}
      {analyticsEnabled ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
    </>
  );
};
