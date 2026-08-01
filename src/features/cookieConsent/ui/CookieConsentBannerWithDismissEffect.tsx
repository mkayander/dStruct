"use client";

import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { CookieConsentBanner } from "#/features/cookieConsent/ui/CookieConsentBanner";
import { useI18nContext } from "#/shared/hooks";
import { useThanosDisintegrate } from "#/shared/ui/effects/thanosDisintegrate";

type CookieConsentBannerWithDismissEffectProps = {
  isSettingsView: boolean;
  onAcceptAll: () => boolean;
  onRejectNonEssential: () => boolean;
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
  const { LL } = useI18nContext();
  const { enqueueSnackbar } = useSnackbar();
  const { targetRef, disintegrate, invalidateCapture } =
    useThanosDisintegrate();
  const isDismissingRef = useRef(false);
  const [frozenSettingsView, setFrozenSettingsView] = useState<boolean | null>(
    null,
  );
  const displayIsSettingsView = frozenSettingsView ?? isSettingsView;

  // Discard a stale warm capture when the banner surface content changes.
  useEffect(() => {
    invalidateCapture();
  }, [invalidateCapture, isSettingsView]);

  const withDisintegrateDismiss = useCallback(
    (action: () => boolean | void) =>
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isDismissingRef.current) {
          return;
        }

        const persisted = action();
        if (persisted === false) {
          return;
        }

        isDismissingRef.current = true;
        setFrozenSettingsView(isSettingsView);
        onBeginDismiss();

        void (async () => {
          try {
            await disintegrate({
              origin: {
                clientX: event.clientX,
                clientY: event.clientY,
              },
              maskMode: "radial",
              zIndex: 1200,
            });
          } catch (error) {
            console.error("Cookie consent dismiss animation failed", error);
            enqueueSnackbar(LL.COOKIE_DISMISS_ANIMATION_FAILED(), {
              variant: "warning",
            });
          } finally {
            setFrozenSettingsView(null);
            onCompleteDismiss();
            isDismissingRef.current = false;
          }
        })();
      },
    [
      disintegrate,
      enqueueSnackbar,
      isSettingsView,
      LL,
      onBeginDismiss,
      onCompleteDismiss,
    ],
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
