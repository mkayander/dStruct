import type { RefObject } from "react";

import { buildThanosCapture } from "#/shared/ui/effects/thanosDisintegrate/buildThanosCapture";
import { resolveThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/resolveThanosDisintegrateOptions";
import type { ThanosCaptureSnapshot } from "#/shared/ui/effects/thanosDisintegrate/thanosCaptureSnapshot";
import type { ThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/types";

type IdleRequestCallback = (deadline: IdleDeadline) => void;

const scheduleIdle = (
  callback: IdleRequestCallback,
  timeoutMs: number,
): number => {
  if (typeof requestIdleCallback === "function") {
    return requestIdleCallback(callback, { timeout: timeoutMs });
  }

  return setTimeout(() => {
    callback({
      didTimeout: true,
      timeRemaining: () => 0,
    });
  }, 0) as unknown as number;
};

const cancelIdle = (handle: number): void => {
  if (typeof cancelIdleCallback === "function") {
    cancelIdleCallback(handle);
  } else {
    clearTimeout(handle);
  }
};

/** Pre-captures in idle time so dismiss does not block on SnapDOM. */
export const warmThanosCapture = (
  element: HTMLElement,
  cacheRef: RefObject<ThanosCaptureSnapshot | null>,
  disintegrateOptions?: ThanosDisintegrateOptions,
): (() => void) => {
  let cancelled = false;
  const resolvedOptions = resolveThanosDisintegrateOptions(disintegrateOptions);

  const idleHandle = scheduleIdle(() => {
    if (cancelled) {
      return;
    }

    void buildThanosCapture(element, {
      mode: "quality",
      disintegrateOptions: resolvedOptions,
    })
      .then((snapshot) => {
        if (!cancelled) {
          cacheRef.current = snapshot;
        }
      })
      .catch(() => {
        // Warm-up is best-effort; dismiss falls back to a fast capture.
      });
  }, 2_000);

  return () => {
    cancelled = true;
    cancelIdle(idleHandle);
  };
};
