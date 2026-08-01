"use client";

import React, { useCallback, useRef } from "react";

import { CookieConsentBanner } from "#/features/cookieConsent/ui/CookieConsentBanner";
import { useThanosDisintegrate } from "#/shared/ui/effects/thanosDisintegrate";

type CookieConsentBannerWithDismissEffectProps = {
  isSettingsView: boolean;
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  onClose: () => void;
  onBeginDismiss: () => void;
  onCompleteDismiss: () => void;
};

/**
 * Presentation wrapper: persists consent immediately, then plays the Thanos
 * disintegrate effect while the banner stays mounted for the animation.
 */
export const CookieConsentBannerWithDismissEffect: React.FC<
  CookieConsentBannerWithDismissEffectProps
> = ({
  isSettingsView,
  onAcceptAll,
  onRejectNonEssential,
  onClose,
  onBeginDismiss,
  onCompleteDismiss,
}) => {
  const { targetRef, disintegrate } = useThanosDisintegrate();
  const isDismissingRef = useRef(false);

  const withDisintegrateDismiss = useCallback(
    (action: () => void) => () => {
      if (isDismissingRef.current) {
        return;
      }

      isDismissingRef.current = true;
      onBeginDismiss();
      action();

      void (async () => {
        try {
          await disintegrate();
        } finally {
          onCompleteDismiss();
          isDismissingRef.current = false;
        }
      })();
    },
    [disintegrate, onBeginDismiss, onCompleteDismiss],
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
