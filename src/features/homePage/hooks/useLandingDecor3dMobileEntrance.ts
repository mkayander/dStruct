import type { CSSObject } from "@mui/material/styles";
import type { RefObject } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { LANDING_DECOR_GLASS_OPACITY_SX } from "#/features/homePage/lib/landingDecor3dConstants";
import { useMobileLayout } from "#/shared/hooks";
import { prefersReducedMotion } from "#/shared/lib/prefersReducedMotion";

export type LandingDecor3dMobileEntranceVariant = "hero" | "python";

const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

const scheduleEnteredTrue = (
  setEntered: (value: boolean) => void,
  isMountedRef: RefObject<boolean>,
) => {
  let outerFrame = 0;
  let innerFrame = 0;
  outerFrame = window.requestAnimationFrame(() => {
    innerFrame = window.requestAnimationFrame(() => {
      if (isMountedRef.current) {
        setEntered(true);
      }
    });
  });
  return () => {
    window.cancelAnimationFrame(outerFrame);
    window.cancelAnimationFrame(innerFrame);
  };
};

/**
 * Mobile-only entrance (fade + slide + scale) for landing 3D decor. Desktop unchanged.
 * Hero runs shortly after mount; Python runs when `visibilityAnchorRef` intersects the viewport.
 * Respects `prefers-reduced-motion`.
 */
export const useLandingDecor3dMobileEntrance = (
  variant: LandingDecor3dMobileEntranceVariant,
  visibilityAnchorRef?: RefObject<HTMLElement | null>,
): { mobileEntranceSx: CSSObject } => {
  const isMobile = useMobileLayout();
  const [entered, setEntered] = useState(false);
  const isMountedRef = useRef(true);
  const prevIsMobileRef = useRef(isMobile);

  const reduceMotion = typeof window !== "undefined" && prefersReducedMotion();
  const skipEntranceAnimation = !isMobile || reduceMotion;
  const effectiveEntered = skipEntranceAnimation || entered;

  useLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Re-arm only when crossing from desktop → mobile so resize on mobile does not replay.
  useLayoutEffect(() => {
    const wasMobile = prevIsMobileRef.current;
    prevIsMobileRef.current = isMobile;
    if (!isMobile || reduceMotion) return;
    if (wasMobile) return;
    queueMicrotask(() => {
      setEntered(false);
    });
  }, [isMobile, reduceMotion]);

  useEffect(() => {
    if (skipEntranceAnimation || variant !== "hero") return;
    return scheduleEnteredTrue(setEntered, isMountedRef);
  }, [skipEntranceAnimation, variant]);

  useLayoutEffect(() => {
    if (skipEntranceAnimation || variant !== "python") return;

    const anchor = visibilityAnchorRef?.current;
    if (!anchor) return;

    let cancelScheduledEnter: (() => void) | undefined;

    if (typeof IntersectionObserver !== "function") {
      cancelScheduledEnter = scheduleEnteredTrue(setEntered, isMountedRef);
      return () => {
        cancelScheduledEnter?.();
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((entry) => entry.isIntersecting);
        if (!hit) return;
        observer.disconnect();
        cancelScheduledEnter?.();
        cancelScheduledEnter = scheduleEnteredTrue(setEntered, isMountedRef);
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );

    observer.observe(anchor);
    return () => {
      observer.disconnect();
      cancelScheduledEnter?.();
    };
  }, [skipEntranceAnimation, variant, visibilityAnchorRef]);

  const mobileEntranceSx = useMemo((): CSSObject => {
    if (!isMobile) {
      return {};
    }

    const fromTransform =
      variant === "hero"
        ? "translate3d(36px, 20px, 0) scale(0.88)"
        : "translate3d(-36px, 20px, 0) scale(0.88)";

    if (effectiveEntered) {
      return {
        opacity: LANDING_DECOR_GLASS_OPACITY_SX.xs,
        transform: "translate3d(0, 0, 0) scale(1)",
        transition: `opacity 0.8s ${easing}, transform 0.8s ${easing}`,
        willChange: "auto",
      };
    }

    return {
      opacity: 0,
      transform: fromTransform,
      transition: "none",
      willChange: "opacity, transform",
    };
  }, [effectiveEntered, isMobile, variant]);

  return { mobileEntranceSx };
};
