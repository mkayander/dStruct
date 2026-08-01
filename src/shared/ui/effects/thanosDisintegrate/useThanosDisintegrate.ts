import { type RefObject, useCallback, useRef } from "react";

import { runThanosDisintegrate } from "#/shared/ui/effects/thanosDisintegrate/runThanosDisintegrate";
import type { ThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/types";

type UseThanosDisintegrateResult = {
  /** Attach to the visual surface that should crumble away. */
  targetRef: RefObject<HTMLDivElement | null>;
  /** Starts the disintegration animation on `targetRef`. */
  disintegrate: (options?: ThanosDisintegrateOptions) => Promise<void>;
};

/**
 * Reusable hook for triggering a Thanos-style dismiss animation on a DOM node.
 * Keeps presentation concerns separate from feature/business logic.
 */
export const useThanosDisintegrate = (): UseThanosDisintegrateResult => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingRef = useRef(false);

  const disintegrate = useCallback(
    async (options?: ThanosDisintegrateOptions) => {
      if (isAnimatingRef.current) {
        return;
      }

      const element = targetRef.current;
      if (!element) {
        return;
      }

      isAnimatingRef.current = true;
      try {
        await runThanosDisintegrate(element, options);
      } finally {
        isAnimatingRef.current = false;
      }
    },
    [],
  );

  return { targetRef, disintegrate };
};
