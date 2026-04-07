import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { useMobileLayout } from "#/shared/hooks";

const HERO_MODEL_MAX_AZIMUTH_OFFSET = 0.28;
const HERO_MODEL_MAX_POLAR_OFFSET = 0.18;
/** Lerp factor per frame toward target angles (higher = snappier follow). */
const HERO_MODEL_DAMPING = 0.14;

const HERO_POLAR_ANGLE_MIN = Math.PI / 2.9;
const HERO_POLAR_ANGLE_MAX = Math.PI / 1.9;

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
 * Drives OrbitControls azimuth/polar from window scroll on all viewports, with optional
 * pointer parallax on desktop. Eased follow via requestAnimationFrame.
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
    targetAzimuthRef.current =
      baseAzimuth +
      scrollAzimuthDeltaRef.current +
      pointerAzimuthDeltaRef.current;
    targetPolarRef.current = clamp(
      basePolar + scrollPolarDeltaRef.current + pointerPolarDeltaRef.current,
      HERO_POLAR_ANGLE_MIN,
      HERO_POLAR_ANGLE_MAX,
    );
  }, [baseAzimuth, basePolar]);

  const updateScrollDeltas = useCallback(() => {
    const scrollY = window.scrollY + scrollPhasePx;
    const denom = Math.max(window.innerHeight * 0.9, 1);
    const scrollProgress = clamp(scrollY / denom, 0, 1);
    const yRatioScroll = scrollProgress - 0.5;
    const xSign = invertPointerX ? -1 : 1;
    const azimuthDrift =
      (scrollProgress - 0.5) * HERO_MODEL_MAX_AZIMUTH_OFFSET * 2.2;

    scrollAzimuthDeltaRef.current = xSign * azimuthDrift;
    scrollPolarDeltaRef.current =
      yRatioScroll * HERO_MODEL_MAX_POLAR_OFFSET * 2.4;
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
        -xSign * xRatio * HERO_MODEL_MAX_AZIMUTH_OFFSET * 2;
      pointerPolarDeltaRef.current = yRatio * HERO_MODEL_MAX_POLAR_OFFSET * 2;
      syncTargetFromDeltas();
    },
    [controlsRef, invertPointerX, isMobileLayout, syncTargetFromDeltas],
  );

  useEffect(() => {
    setModelRestingPosition();
  }, [setModelRestingPosition]);

  useEffect(() => {
    updateScrollDeltas();

    let frameId = 0;

    const animateModel = () => {
      const nextAzimuth =
        currentAzimuthRef.current +
        (targetAzimuthRef.current - currentAzimuthRef.current) *
          HERO_MODEL_DAMPING;
      const nextPolar =
        currentPolarRef.current +
        (targetPolarRef.current - currentPolarRef.current) * HERO_MODEL_DAMPING;

      currentAzimuthRef.current = nextAzimuth;
      currentPolarRef.current = nextPolar;
      applyModelAngles(nextAzimuth, nextPolar);

      frameId = window.requestAnimationFrame(animateModel);
    };

    const handleScroll = () => {
      updateScrollDeltas();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    frameId = window.requestAnimationFrame(animateModel);

    const cleanupScroll = () => {
      window.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(frameId);
    };

    if (isMobileLayout) {
      return cleanupScroll;
    }

    const handleWindowMouseMove = (event: MouseEvent) => {
      updateModelFromPointer(event.clientX, event.clientY);
    };

    const handlePointerExit = () => {
      resetPointerDeltas();
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("blur", handlePointerExit);
    document.documentElement.addEventListener("mouseleave", handlePointerExit);

    return () => {
      cleanupScroll();
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("blur", handlePointerExit);
      document.documentElement.removeEventListener(
        "mouseleave",
        handlePointerExit,
      );
    };
  }, [
    applyModelAngles,
    isMobileLayout,
    resetPointerDeltas,
    updateModelFromPointer,
    updateScrollDeltas,
  ]);
};
