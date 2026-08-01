"use client";

import React, { useCallback, useRef, useState } from "react";

import { CookieConsentBanner } from "#/features/cookieConsent/ui/CookieConsentBanner";
import { useThanosDisintegrate } from "#/shared/ui/effects/thanosDisintegrate";
import { waitForPaint } from "#/shared/ui/effects/thanosDisintegrate/waitForPaint";

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
  const [frozenSettingsView, setFrozenSettingsView] = useState<boolean | null>(
    null,
  );
  const displayIsSettingsView = frozenSettingsView ?? isSettingsView;

  const withDisintegrateDismiss = useCallback(
    (action: () => void) => () => {
      if (isDismissingRef.current) {
        return;
      }

      isDismissingRef.current = true;
      setFrozenSettingsView(isSettingsView);
      onBeginDismiss();
      action();

      void (async () => {
        try {
          await waitForPaint();
          await disintegrate();
        } finally {
          setFrozenSettingsView(null);
          onCompleteDismiss();
          isDismissingRef.current = false;
        }
      })();
    },
    [disintegrate, isSettingsView, onBeginDismiss, onCompleteDismiss],
  );

  return (
    <CookieConsentBanner
      isSettingsView={displayIsSettingsView}
      surfaceRef={targetRef}
      onAcceptAll={withDisintegrateDismiss(onAcceptAll)}
      onRejectNonEssential={withDisintegrateDismiss(onRejectNonEssential)}
      onClose={withDisintegrateDismiss(onClose)}
    />
  );
};
