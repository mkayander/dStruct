import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { useMobileLayout } from "#/shared/hooks";

const HERO_MODEL_MAX_AZIMUTH_OFFSET = 0.28;
const HERO_MODEL_MAX_POLAR_OFFSET = 0.18;
const HERO_MODEL_DAMPING = 0.08;

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
 * Drives OrbitControls azimuth/polar from pointer (desktop) or window scroll (mobile),
 * with eased follow. Matches the landing hero brand-logo behavior; use twice for two models.
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

  const setModelRestingPosition = useCallback(() => {
    currentAzimuthRef.current = baseAzimuth;
    currentPolarRef.current = basePolar;
    targetAzimuthRef.current = baseAzimuth;
    targetPolarRef.current = basePolar;
    applyModelAngles(baseAzimuth, basePolar);
  }, [applyModelAngles, baseAzimuth, basePolar]);

  const resetModelAngles = useCallback(() => {
    targetAzimuthRef.current = baseAzimuth;
    targetPolarRef.current = basePolar;
  }, [baseAzimuth, basePolar]);

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

      targetAzimuthRef.current =
        baseAzimuth - xSign * xRatio * HERO_MODEL_MAX_AZIMUTH_OFFSET * 2;
      targetPolarRef.current = clamp(
        basePolar + yRatio * HERO_MODEL_MAX_POLAR_OFFSET * 2,
        HERO_POLAR_ANGLE_MIN,
        HERO_POLAR_ANGLE_MAX,
      );
    },
    [baseAzimuth, basePolar, controlsRef, invertPointerX, isMobileLayout],
  );

  const updateModelFromScroll = useCallback(() => {
    if (!isMobileLayout) return;

    const scrollY = window.scrollY + scrollPhasePx;
    const denom = Math.max(window.innerHeight * 0.9, 1);
    const t = clamp(scrollY / denom, 0, 1);
    const yRatio = t - 0.5;
    const xSign = invertPointerX ? -1 : 1;
    const azimuthDrift = (t - 0.5) * HERO_MODEL_MAX_AZIMUTH_OFFSET * 2.2;

    targetAzimuthRef.current = baseAzimuth + xSign * azimuthDrift;
    targetPolarRef.current = clamp(
      basePolar + yRatio * HERO_MODEL_MAX_POLAR_OFFSET * 2.4,
      HERO_POLAR_ANGLE_MIN,
      HERO_POLAR_ANGLE_MAX,
    );
  }, [baseAzimuth, basePolar, invertPointerX, isMobileLayout, scrollPhasePx]);

  useEffect(() => {
    setModelRestingPosition();
  }, [setModelRestingPosition]);

  useEffect(() => {
    if (isMobileLayout) {
      updateModelFromScroll();

      let frameId = 0;

      const animateModel = () => {
        const nextAzimuth =
          currentAzimuthRef.current +
          (targetAzimuthRef.current - currentAzimuthRef.current) *
            HERO_MODEL_DAMPING;
        const nextPolar =
          currentPolarRef.current +
          (targetPolarRef.current - currentPolarRef.current) *
            HERO_MODEL_DAMPING;

        currentAzimuthRef.current = nextAzimuth;
        currentPolarRef.current = nextPolar;
        applyModelAngles(nextAzimuth, nextPolar);

        frameId = window.requestAnimationFrame(animateModel);
      };

      const handleScroll = () => {
        updateModelFromScroll();
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      frameId = window.requestAnimationFrame(animateModel);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.cancelAnimationFrame(frameId);
      };
    }

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

    const handleWindowMouseMove = (event: MouseEvent) => {
      updateModelFromPointer(event.clientX, event.clientY);
    };

    const handlePointerExit = () => {
      resetModelAngles();
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("blur", handlePointerExit);
    document.documentElement.addEventListener("mouseleave", handlePointerExit);
    frameId = window.requestAnimationFrame(animateModel);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("blur", handlePointerExit);
      document.documentElement.removeEventListener(
        "mouseleave",
        handlePointerExit,
      );
      window.cancelAnimationFrame(frameId);
    };
  }, [
    applyModelAngles,
    isMobileLayout,
    resetModelAngles,
    updateModelFromPointer,
    updateModelFromScroll,
  ]);
};
