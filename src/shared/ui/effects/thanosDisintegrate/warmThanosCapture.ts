import type { RefObject } from "react";

import { buildThanosCapture } from "#/shared/ui/effects/thanosDisintegrate/buildThanosCapture";
import type { ThanosCaptureSnapshot } from "#/shared/ui/effects/thanosDisintegrate/thanosCaptureSnapshot";

type IdleRequestCallback = (deadline: IdleDeadline) => void;

const scheduleIdle = (
  callback: IdleRequestCallback,
  timeoutMs: number,
): number => {
  if (typeof requestIdleCallback === "function") {
    return requestIdleCallback(callback, { timeout: timeoutMs });
  }

  return window.setTimeout(() => {
    callback({
      didTimeout: true,
      timeRemaining: () => 0,
    });
  }, 0);
};

const cancelIdle = (handle: number): void => {
  if (typeof cancelIdleCallback === "function") {
    cancelIdleCallback(handle);
  } else {
    window.clearTimeout(handle);
  }
};

/** Pre-captures in idle time so dismiss does not block on SnapDOM. */
export const warmThanosCapture = (
  element: HTMLElement,
  cacheRef: RefObject<ThanosCaptureSnapshot | null>,
): (() => void) => {
  let cancelled = false;

  const idleHandle = scheduleIdle(() => {
    if (cancelled) {
      return;
    }

    void buildThanosCapture(element, { mode: "quality" }).then((snapshot) => {
      if (!cancelled) {
        cacheRef.current = snapshot;
      }
    });
  }, 2_000);

  return () => {
    cancelled = true;
    cancelIdle(idleHandle);
  };
};
