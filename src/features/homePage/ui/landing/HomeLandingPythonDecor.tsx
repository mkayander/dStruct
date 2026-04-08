import { Box } from "@mui/material";
import React, { useRef } from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { useHeroOrbitModelMotion } from "#/features/homePage/hooks/useHeroOrbitModelMotion";
import { useLandingDecor3dMobileEntrance } from "#/features/homePage/hooks/useLandingDecor3dMobileEntrance";
import {
  LANDING_DECOR_GLASS_OPACITY_SX,
  LANDING_DECOR_MODEL_CAMERA,
  LANDING_DECOR_MODEL_DISTANCE,
  LANDING_DECOR_MODEL_FOV,
  LANDING_DECOR_MODEL_TARGET,
  LANDING_DECOR_PYTHON_BASE_AZIMUTH,
  LANDING_DECOR_PYTHON_BASE_POLAR,
  LANDING_DECOR_PYTHON_CANVAS_SIZE_PX,
  LANDING_DECOR_PYTHON_IDLE_MOTION_PHASE_SEC,
} from "#/features/homePage/lib/landingDecor3dConstants";
import { PythonLogoModelView } from "#/shared/ui/molecules/PythonLogoModelView";

/**
 * Ambient Python 3D logo: absolutely positioned within a `position: relative` parent
 * so it does not take foreground layout space (same idea as the hero brand model).
 */
export const HomeLandingPythonDecor: React.FC = () => {
  const pythonControlsRef = useRef<ThreeOrbitControls>(null);
  const pythonVisibilityAnchorRef = useRef<HTMLDivElement>(null);
  const { mobileEntranceSx } = useLandingDecor3dMobileEntrance(
    "python",
    pythonVisibilityAnchorRef,
  );

  useHeroOrbitModelMotion({
    controlsRef: pythonControlsRef,
    baseAzimuth: LANDING_DECOR_PYTHON_BASE_AZIMUTH,
    basePolar: LANDING_DECOR_PYTHON_BASE_POLAR,
    invertPointerX: true,
    idleMotionPhaseSec: LANDING_DECOR_PYTHON_IDLE_MOTION_PHASE_SEC,
  });

  return (
    <Box
      ref={pythonVisibilityAnchorRef}
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: { xs: -118, sm: -180, md: -320 },
          transform: "translateY(-50%)",
          width: LANDING_DECOR_PYTHON_CANVAS_SIZE_PX,
          height: LANDING_DECOR_PYTHON_CANVAS_SIZE_PX,
        }}
      >
        <Box
          sx={[
            {
              width: "100%",
              height: "100%",
              opacity: LANDING_DECOR_GLASS_OPACITY_SX,
              filter: "blur(0.4px)",
              maskImage:
                "radial-gradient(circle at 52% 50%, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.88) 30%, rgba(0,0,0,0.44) 64%, transparent 90%)",
            },
            mobileEntranceSx,
          ]}
        >
          <PythonLogoModelView
            controlsRef={pythonControlsRef}
            interactive={false}
            cameraPosition={LANDING_DECOR_MODEL_CAMERA}
            cameraFov={LANDING_DECOR_MODEL_FOV}
            target={LANDING_DECOR_MODEL_TARGET}
            distanceRange={LANDING_DECOR_MODEL_DISTANCE}
          />
        </Box>
      </Box>
    </Box>
  );
};
