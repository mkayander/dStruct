import { type RefCallback, useCallback, useEffect, useRef } from "react";

import { runThanosDisintegrate } from "#/shared/ui/effects/thanosDisintegrate/runThanosDisintegrate";
import type { RunThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/runThanosDisintegrate";
import type { ThanosCaptureSnapshot } from "#/shared/ui/effects/thanosDisintegrate/thanosCaptureSnapshot";
import { ThanosDisintegrateError } from "#/shared/ui/effects/thanosDisintegrate/thanosDisintegrateError";
import { warmThanosCapture } from "#/shared/ui/effects/thanosDisintegrate/warmThanosCapture";

type UseThanosDisintegrateResult = {
  /** Attach to the visual surface that should crumble away. */
  targetRef: RefCallback<HTMLDivElement>;
  /** Starts the disintegration animation on `targetRef`. */
  disintegrate: (options?: RunThanosDisintegrateOptions) => Promise<void>;
  /** Drops any pre-warmed capture so the next dismiss re-captures. */
  invalidateCapture: () => void;
};

/**
 * Reusable hook for triggering a Thanos-style dismiss animation on a DOM node.
 * Pre-warms a quality capture in idle time so dismiss stays responsive.
 */
export const useThanosDisintegrate = (): UseThanosDisintegrateResult => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const captureCacheRef = useRef<ThanosCaptureSnapshot | null>(null);
  const isAnimatingRef = useRef(false);
  const cancelWarmRef = useRef<(() => void) | null>(null);

  const invalidateCapture = useCallback(() => {
    captureCacheRef.current = null;
    const element = elementRef.current;
    if (!element) {
      return;
    }

    cancelWarmRef.current?.();
    cancelWarmRef.current = warmThanosCapture(element, captureCacheRef);
  }, []);

  const targetRef = useCallback((node: HTMLDivElement | null) => {
    cancelWarmRef.current?.();
    cancelWarmRef.current = null;
    elementRef.current = node;
    captureCacheRef.current = null;

    if (node) {
      // Chunk mask workers are created lazily when maskMode is "chunks".
      cancelWarmRef.current = warmThanosCapture(node, captureCacheRef);
    }
  }, []);

  useEffect(() => {
    const invalidateCache = () => {
      invalidateCapture();
    };

    window.addEventListener("resize", invalidateCache, { passive: true });
    return () => {
      window.removeEventListener("resize", invalidateCache);
      cancelWarmRef.current?.();
    };
  }, [invalidateCapture]);

  // Fonts can finish loading after the idle warm-up snapshot was taken.
  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts?.ready) {
      return;
    }

    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) {
        invalidateCapture();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [invalidateCapture]);

  const disintegrate = useCallback(
    async (options?: RunThanosDisintegrateOptions) => {
      if (isAnimatingRef.current) {
        return;
      }

      const element = elementRef.current;
      if (!element) {
        throw new ThanosDisintegrateError(
          "no_target",
          "Disintegrate target is not mounted.",
        );
      }

      isAnimatingRef.current = true;
      try {
        await runThanosDisintegrate(element, {
          ...options,
          captureSnapshot: captureCacheRef.current,
        });
      } finally {
        isAnimatingRef.current = false;
        captureCacheRef.current = null;
      }
    },
    [],
  );

  return { targetRef, disintegrate, invalidateCapture };
};
