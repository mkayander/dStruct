import type { RefObject } from "react";

import { prewarmChunkMaskWorker } from "#/shared/ui/effects/domDisintegrate/buildChunkMaskSequenceAsync";
import { buildDisintegrateCapture } from "#/shared/ui/effects/domDisintegrate/buildDisintegrateCapture";
import type { DisintegrateCaptureSnapshot } from "#/shared/ui/effects/domDisintegrate/disintegrateCaptureSnapshot";
import {
  prebuildWarmChunkMasks,
  revokeWarmChunkMasks,
} from "#/shared/ui/effects/domDisintegrate/prebuildWarmChunkMasks";
import { resolveDomDisintegrateOptions } from "#/shared/ui/effects/domDisintegrate/resolveDomDisintegrateOptions";
import type { DomDisintegrateOptions } from "#/shared/ui/effects/domDisintegrate/types";

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
export const warmDisintegrateCapture = (
  element: HTMLElement,
  cacheRef: RefObject<DisintegrateCaptureSnapshot | null>,
  disintegrateOptions?: DomDisintegrateOptions,
): (() => void) => {
  let cancelled = false;
  const resolvedOptions = resolveDomDisintegrateOptions(
    disintegrateOptions,
    element,
  );

  if (resolvedOptions.maskMode === "chunks") {
    prewarmChunkMaskWorker();
  }

  const idleHandle = scheduleIdle(() => {
    if (cancelled) {
      return;
    }

    void buildDisintegrateCapture(element, {
      mode: "quality",
      disintegrateOptions: resolvedOptions,
    })
      .then((snapshot) => prebuildWarmChunkMasks(snapshot, resolvedOptions))
      .then((snapshot) => {
        if (!cancelled) {
          revokeWarmChunkMasks(cacheRef.current);
          cacheRef.current = snapshot;
        } else {
          revokeWarmChunkMasks(snapshot);
        }
      })
      .catch(() => {
        // Warm-up is best-effort; dismiss falls back to a fast capture.
      });
  }, 250);

  return () => {
    cancelled = true;
    cancelIdle(idleHandle);
  };
};

export { revokeWarmChunkMasks };
