"use client";

import React, { useCallback, useRef } from "react";

import { CookieConsentBanner } from "#/features/cookieConsent/ui/CookieConsentBanner";
import { useThanosDisintegrate } from "#/shared/ui/effects/thanosDisintegrate";

type CookieConsentBannerWithDismissEffectProps = {
  isSettingsView: boolean;
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  onClose: () => void;
};

/**
 * Presentation wrapper: plays the Thanos disintegrate effect before consent actions run.
 */
export const CookieConsentBannerWithDismissEffect: React.FC<
  CookieConsentBannerWithDismissEffectProps
> = ({ isSettingsView, onAcceptAll, onRejectNonEssential, onClose }) => {
  const { targetRef, disintegrate } = useThanosDisintegrate();
  const isDismissingRef = useRef(false);

  const withDisintegrateDismiss = useCallback(
    (action: () => void) => () => {
      if (isDismissingRef.current) {
        return;
      }

      isDismissingRef.current = true;
      void (async () => {
        try {
          await disintegrate();
        } finally {
          action();
          isDismissingRef.current = false;
        }
      })();
    },
    [disintegrate],
  );

  return (
    <CookieConsentBanner
      isSettingsView={isSettingsView}
      surfaceRef={targetRef}
      onAcceptAll={withDisintegrateDismiss(onAcceptAll)}
      onRejectNonEssential={withDisintegrateDismiss(onRejectNonEssential)}
      onClose={withDisintegrateDismiss(onClose)}
    />
  );
};
