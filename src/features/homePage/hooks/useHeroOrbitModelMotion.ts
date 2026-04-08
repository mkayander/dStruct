import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { LANDING_HERO_ORBIT_TUNING } from "#/features/homePage/lib/landingHeroOrbitMotionConstants";
import { useMobileLayout } from "#/shared/hooks";
import { prefersReducedMotion } from "#/shared/lib/prefersReducedMotion";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const TOUCH_DELTA_EPSILON = 0.0004;

export type UseHeroOrbitModelMotionParams = {
  controlsRef: RefObject<ThreeOrbitControls | null>;
  baseAzimuth: number;
  basePolar: number;
  /** Flip horizontal pointer mapping (e.g. left-side decoration). */
  invertPointerX?: boolean;
  /** Seconds offset into idle motion so paired models do not move in phase. */
  idleMotionPhaseSec?: number;
};

/**
 * Mobile: idle oscillation + touch parallax from screen-space finger position (window touches).
 * Desktop: pointer parallax only. No scroll-driven motion.
 */
export const useHeroOrbitModelMotion = ({
  controlsRef,
  baseAzimuth,
  basePolar,
  invertPointerX = false,
  idleMotionPhaseSec = 0,
}: UseHeroOrbitModelMotionParams): void => {
  const isMobileLayout = useMobileLayout();
  const currentAzimuthRef = useRef(baseAzimuth);
  const currentPolarRef = useRef(basePolar);
  const targetAzimuthRef = useRef(baseAzimuth);
  const targetPolarRef = useRef(basePolar);

  const pointerAzimuthDeltaRef = useRef(0);
  const pointerPolarDeltaRef = useRef(0);
  const touchAzimuthDeltaRef = useRef(0);
  const touchPolarDeltaRef = useRef(0);
  const idleAzimuthSmoothedRef = useRef(0);
  const idlePolarSmoothedRef = useRef(0);
  const touchActiveRef = useRef(false);

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
    const polar = isMobileLayout
      ? LANDING_HERO_ORBIT_TUNING.mobile
      : LANDING_HERO_ORBIT_TUNING.desktop;

    const pointerAzimuth = isMobileLayout
      ? touchAzimuthDeltaRef.current
      : pointerAzimuthDeltaRef.current;
    const pointerPolar = isMobileLayout
      ? touchPolarDeltaRef.current
      : pointerPolarDeltaRef.current;

    targetAzimuthRef.current =
      baseAzimuth + idleAzimuthSmoothedRef.current + pointerAzimuth;
    targetPolarRef.current = clamp(
      basePolar + idlePolarSmoothedRef.current + pointerPolar,
      polar.polarAngleMin,
      polar.polarAngleMax,
    );
  }, [baseAzimuth, basePolar, isMobileLayout]);

  const setModelRestingPosition = useCallback(() => {
    pointerAzimuthDeltaRef.current = 0;
    pointerPolarDeltaRef.current = 0;
    touchAzimuthDeltaRef.current = 0;
    touchPolarDeltaRef.current = 0;
    idleAzimuthSmoothedRef.current = 0;
    idlePolarSmoothedRef.current = 0;
    touchActiveRef.current = false;
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

      const desktop = LANDING_HERO_ORBIT_TUNING.desktop;
      const xRatio = clientX / window.innerWidth - 0.5;
      const yRatio = clientY / window.innerHeight - 0.5;
      const xSign = invertPointerX ? -1 : 1;

      pointerAzimuthDeltaRef.current =
        -xSign *
        xRatio *
        desktop.maxAzimuthOffset *
        desktop.pointerAzimuthMultiplier;
      pointerPolarDeltaRef.current =
        yRatio * desktop.maxPolarOffset * desktop.pointerPolarMultiplier;
      syncTargetFromDeltas();
    },
    [controlsRef, invertPointerX, isMobileLayout, syncTargetFromDeltas],
  );

  const updateModelFromTouch = useCallback(
    (clientX: number, clientY: number) => {
      if (
        !isMobileLayout ||
        !controlsRef.current ||
        window.innerWidth === 0 ||
        window.innerHeight === 0
      ) {
        return;
      }

      const mobile = LANDING_HERO_ORBIT_TUNING.mobile;
      const xRatio = clientX / window.innerWidth - 0.5;
      const yRatio = clientY / window.innerHeight - 0.5;
      const xSign = invertPointerX ? -1 : 1;

      touchAzimuthDeltaRef.current =
        -xSign *
        xRatio *
        mobile.maxAzimuthOffset *
        mobile.touchAzimuthMultiplier;
      touchPolarDeltaRef.current =
        yRatio * mobile.maxPolarOffset * mobile.touchPolarMultiplier;
      syncTargetFromDeltas();
    },
    [controlsRef, invertPointerX, isMobileLayout, syncTargetFromDeltas],
  );

  useEffect(() => {
    setModelRestingPosition();
  }, [isMobileLayout, setModelRestingPosition]);

  useEffect(() => {
    const frameDamping = isMobileLayout
      ? LANDING_HERO_ORBIT_TUNING.mobile.frameDamping
      : LANDING_HERO_ORBIT_TUNING.desktop.frameDamping;

    let frameId = 0;

    const reduceMotionClient = prefersReducedMotion();

    const animateModel = () => {
      if (isMobileLayout) {
        const mobile = LANDING_HERO_ORBIT_TUNING.mobile;

        if (!reduceMotionClient) {
          const timeSec = performance.now() / 1000 + idleMotionPhaseSec;

          const idleAzimuthTarget =
            Math.sin(timeSec * mobile.idleAzimuthAngularSpeed) *
              mobile.idleAzimuthAmplitudeRad +
            Math.sin(
              timeSec * mobile.idleAzimuthAngularSpeed * 1.73 +
                idleMotionPhaseSec * 2.1,
            ) *
              mobile.idleAzimuthAmplitudeRad *
              mobile.idleSecondaryAzimuthScale;

          const idlePolarTarget =
            Math.cos(timeSec * mobile.idlePolarAngularSpeed + 0.7) *
              mobile.idlePolarAmplitudeRad +
            Math.sin(
              timeSec * mobile.idlePolarAngularSpeed * 0.61 +
                idleMotionPhaseSec,
            ) *
              mobile.idlePolarAmplitudeRad *
              mobile.idleSecondaryPolarScale;

          idleAzimuthSmoothedRef.current +=
            (idleAzimuthTarget - idleAzimuthSmoothedRef.current) *
            mobile.idleSmoothing;
          idlePolarSmoothedRef.current +=
            (idlePolarTarget - idlePolarSmoothedRef.current) *
            mobile.idleSmoothing;
        }

        if (!touchActiveRef.current) {
          const decay = 1 - mobile.touchReleaseDecay;
          touchAzimuthDeltaRef.current *= decay;
          touchPolarDeltaRef.current *= decay;
          if (
            Math.abs(touchAzimuthDeltaRef.current) < TOUCH_DELTA_EPSILON &&
            Math.abs(touchPolarDeltaRef.current) < TOUCH_DELTA_EPSILON
          ) {
            touchAzimuthDeltaRef.current = 0;
            touchPolarDeltaRef.current = 0;
          }
        }

        syncTargetFromDeltas();
      }

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

    frameId = window.requestAnimationFrame(animateModel);

    const syncTouchFromEvent = (event: TouchEvent) => {
      const primaryTouch = event.touches.item(0);
      if (!primaryTouch) return;
      updateModelFromTouch(primaryTouch.clientX, primaryTouch.clientY);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchActiveRef.current = true;
      syncTouchFromEvent(event);
    };

    const handleTouchMove = (event: TouchEvent) => {
      syncTouchFromEvent(event);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (event.touches.length === 0) {
        touchActiveRef.current = false;
      } else {
        syncTouchFromEvent(event);
      }
    };

    const touchOptions = { passive: true, capture: true } as const;
    window.addEventListener("touchstart", handleTouchStart, touchOptions);
    window.addEventListener("touchmove", handleTouchMove, touchOptions);
    window.addEventListener("touchend", handleTouchEnd, touchOptions);
    window.addEventListener("touchcancel", handleTouchEnd, touchOptions);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart, touchOptions);
      window.removeEventListener("touchmove", handleTouchMove, touchOptions);
      window.removeEventListener("touchend", handleTouchEnd, touchOptions);
      window.removeEventListener("touchcancel", handleTouchEnd, touchOptions);
      window.cancelAnimationFrame(frameId);
    };
  }, [
    applyModelAngles,
    idleMotionPhaseSec,
    isMobileLayout,
    resetPointerDeltas,
    syncTargetFromDeltas,
    updateModelFromPointer,
    updateModelFromTouch,
  ]);
};
