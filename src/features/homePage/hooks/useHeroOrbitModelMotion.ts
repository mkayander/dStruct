import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import {
  getPageScrollMetrics,
  resolvePageScrollElement,
} from "#/features/homePage/hooks/getPageScrollMetrics";
import { useMobileLayout } from "#/shared/hooks";

/** Desktop: pointer parallax only (original subtlety). */
const HERO_DESKTOP_MAX_AZIMUTH_OFFSET = 0.28;
const HERO_DESKTOP_MAX_POLAR_OFFSET = 0.18;
const HERO_DESKTOP_DAMPING = 0.08;

/** Mobile: scroll-driven motion + stronger follow. */
const HERO_MOBILE_MAX_AZIMUTH_OFFSET = 0.62;
const HERO_MOBILE_MAX_POLAR_OFFSET = 0.4;
const HERO_MOBILE_DAMPING = 0.2;

const HERO_DESKTOP_POLAR_ANGLE_MIN = Math.PI / 2.9;
const HERO_DESKTOP_POLAR_ANGLE_MAX = Math.PI / 1.9;

const HERO_MOBILE_POLAR_ANGLE_MIN = Math.PI / 3.15;
const HERO_MOBILE_POLAR_ANGLE_MAX = Math.PI / 1.72;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export type UseHeroOrbitModelMotionParams = {
  controlsRef: RefObject<ThreeOrbitControls | null>;
  baseAzimuth: number;
  basePolar: number;
  /** Flip horizontal pointer mapping (e.g. left-side decoration). */
  invertPointerX?: boolean;
  /** Offset scroll position so two models do not move in lockstep on mobile. */
  scrollPhasePx?: number;
};

/**
 * Mobile: OrbitControls follow page scroll (OverlayScrollbars viewport) + eased follow.
 * Desktop: pointer parallax only; no scroll-driven motion.
 */
export const useHeroOrbitModelMotion = ({
  controlsRef,
  baseAzimuth,
  basePolar,
  invertPointerX = false,
  scrollPhasePx = 0,
}: UseHeroOrbitModelMotionParams): void => {
  const isMobileLayout = useMobileLayout();
  const currentAzimuthRef = useRef(baseAzimuth);
  const currentPolarRef = useRef(basePolar);
  const targetAzimuthRef = useRef(baseAzimuth);
  const targetPolarRef = useRef(basePolar);

  const scrollAzimuthDeltaRef = useRef(0);
  const scrollPolarDeltaRef = useRef(0);
  const pointerAzimuthDeltaRef = useRef(0);
  const pointerPolarDeltaRef = useRef(0);

  const scrollRootRef = useRef<HTMLElement | Window | null>(null);

  const applyModelAngles = useCallback(
    (azimuth: number, polar: number) => {
      const controls = controlsRef.current;
      if (!controls) return;
      controls.setAzimuthalAngle(azimuth);
      controls.setPolarAngle(polar);
      controls.update();
    },
    [controlsRef],
  );

  const syncTargetFromDeltas = useCallback(() => {
    const polarMin = isMobileLayout
      ? HERO_MOBILE_POLAR_ANGLE_MIN
      : HERO_DESKTOP_POLAR_ANGLE_MIN;
    const polarMax = isMobileLayout
      ? HERO_MOBILE_POLAR_ANGLE_MAX
      : HERO_DESKTOP_POLAR_ANGLE_MAX;

    targetAzimuthRef.current =
      baseAzimuth +
      scrollAzimuthDeltaRef.current +
      pointerAzimuthDeltaRef.current;
    targetPolarRef.current = clamp(
      basePolar + scrollPolarDeltaRef.current + pointerPolarDeltaRef.current,
      polarMin,
      polarMax,
    );
  }, [baseAzimuth, basePolar, isMobileLayout]);

  const updateScrollDeltas = useCallback(() => {
    const root = scrollRootRef.current;
    if (!root) return;

    const { scrollTop, scrollableHeight } = getPageScrollMetrics(root);
    const adjustedScrollY = scrollTop + scrollPhasePx;
    const scrollProgress = clamp(adjustedScrollY / scrollableHeight, 0, 1);
    const yRatioScroll = scrollProgress - 0.5;
    const xSign = invertPointerX ? -1 : 1;
    const azimuthDrift =
      (scrollProgress - 0.5) * HERO_MOBILE_MAX_AZIMUTH_OFFSET * 3.4;

    scrollAzimuthDeltaRef.current = xSign * azimuthDrift;
    scrollPolarDeltaRef.current =
      yRatioScroll * HERO_MOBILE_MAX_POLAR_OFFSET * 3.6;
    syncTargetFromDeltas();
  }, [invertPointerX, scrollPhasePx, syncTargetFromDeltas]);

  const setModelRestingPosition = useCallback(() => {
    scrollAzimuthDeltaRef.current = 0;
    scrollPolarDeltaRef.current = 0;
    pointerAzimuthDeltaRef.current = 0;
    pointerPolarDeltaRef.current = 0;
    currentAzimuthRef.current = baseAzimuth;
    currentPolarRef.current = basePolar;
    targetAzimuthRef.current = baseAzimuth;
    targetPolarRef.current = basePolar;
    applyModelAngles(baseAzimuth, basePolar);
  }, [applyModelAngles, baseAzimuth, basePolar]);

  const resetPointerDeltas = useCallback(() => {
    pointerAzimuthDeltaRef.current = 0;
    pointerPolarDeltaRef.current = 0;
    syncTargetFromDeltas();
  }, [syncTargetFromDeltas]);

  const updateModelFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (isMobileLayout) return;

      if (
        !controlsRef.current ||
        window.innerWidth === 0 ||
        window.innerHeight === 0
      ) {
        return;
      }

      const xRatio = clientX / window.innerWidth - 0.5;
      const yRatio = clientY / window.innerHeight - 0.5;
      const xSign = invertPointerX ? -1 : 1;

      pointerAzimuthDeltaRef.current =
        -xSign * xRatio * HERO_DESKTOP_MAX_AZIMUTH_OFFSET * 2;
      pointerPolarDeltaRef.current = yRatio * HERO_DESKTOP_MAX_POLAR_OFFSET * 2;
      syncTargetFromDeltas();
    },
    [controlsRef, invertPointerX, isMobileLayout, syncTargetFromDeltas],
  );

  useEffect(() => {
    setModelRestingPosition();
  }, [isMobileLayout, setModelRestingPosition]);

  useEffect(() => {
    const frameDamping = isMobileLayout
      ? HERO_MOBILE_DAMPING
      : HERO_DESKTOP_DAMPING;

    let frameId = 0;
    let removeScrollListener: (() => void) | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let chaseFrames = 0;

    const animateModel = () => {
      const nextAzimuth =
        currentAzimuthRef.current +
        (targetAzimuthRef.current - currentAzimuthRef.current) * frameDamping;
      const nextPolar =
        currentPolarRef.current +
        (targetPolarRef.current - currentPolarRef.current) * frameDamping;

      currentAzimuthRef.current = nextAzimuth;
      currentPolarRef.current = nextPolar;
      applyModelAngles(nextAzimuth, nextPolar);

      frameId = window.requestAnimationFrame(animateModel);
    };

    if (!isMobileLayout) {
      frameId = window.requestAnimationFrame(animateModel);

      const handleWindowMouseMove = (event: MouseEvent) => {
        updateModelFromPointer(event.clientX, event.clientY);
      };

      const handlePointerExit = () => {
        resetPointerDeltas();
      };

      window.addEventListener("mousemove", handleWindowMouseMove);
      window.addEventListener("blur", handlePointerExit);
      document.documentElement.addEventListener(
        "mouseleave",
        handlePointerExit,
      );

      return () => {
        window.removeEventListener("mousemove", handleWindowMouseMove);
        window.removeEventListener("blur", handlePointerExit);
        document.documentElement.removeEventListener(
          "mouseleave",
          handlePointerExit,
        );
        window.cancelAnimationFrame(frameId);
      };
    }

    const pickScrollRoot = (): HTMLElement | Window =>
      resolvePageScrollElement() ?? window;

    const bindScrollRoot = () => {
      const nextRoot = pickScrollRoot();
      if (scrollRootRef.current === nextRoot && removeScrollListener) {
        updateScrollDeltas();
        return;
      }

      removeScrollListener?.();
      resizeObserver?.disconnect();

      scrollRootRef.current = nextRoot;

      const onScroll = () => {
        updateScrollDeltas();
      };

      nextRoot.addEventListener("scroll", onScroll, { passive: true });
      removeScrollListener = () => {
        nextRoot.removeEventListener("scroll", onScroll);
        removeScrollListener = undefined;
      };

      if (nextRoot instanceof HTMLElement) {
        resizeObserver = new ResizeObserver(() => {
          updateScrollDeltas();
        });
        resizeObserver.observe(nextRoot);
      }

      updateScrollDeltas();
    };

    bindScrollRoot();
    frameId = window.requestAnimationFrame(animateModel);

    const handleWindowResize = () => {
      updateScrollDeltas();
    };
    window.addEventListener("resize", handleWindowResize);

    const chaseDeferredOverlay = () => {
      if (chaseFrames > 90) return;
      chaseFrames += 1;
      const overlay = resolvePageScrollElement();
      if (overlay && scrollRootRef.current !== overlay) {
        bindScrollRoot();
        return;
      }
      window.requestAnimationFrame(chaseDeferredOverlay);
    };
    window.requestAnimationFrame(chaseDeferredOverlay);

    return () => {
      removeScrollListener?.();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      window.cancelAnimationFrame(frameId);
      scrollRootRef.current = null;
    };
  }, [
    applyModelAngles,
    isMobileLayout,
    resetPointerDeltas,
    updateModelFromPointer,
    updateScrollDeltas,
  ]);
};
