import { useTheme } from "@mui/material";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { useMobileLayout } from "#/shared/hooks";
import { OrbitModelCanvasTouchScroll } from "#/shared/ui/molecules/OrbitModelCanvasTouchScroll";

import { PythonLogoModel } from "#/3d-models/PythonLogoModel";

type PythonLogoModelViewProps = {
  controlsRef?: React.RefObject<ThreeOrbitControls | null>;
  interactive?: boolean;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  target?: [number, number, number];
  distanceRange?: readonly [number, number];
};

export const PythonLogoModelView: React.FC<PythonLogoModelViewProps> = ({
  controlsRef,
  interactive = true,
  cameraPosition = [0, 0, 5],
  cameraFov = 50,
  target = [0, 0.5, 0],
  distanceRange = [13, 20],
}) => {
  const theme = useTheme();
  const isMobile = useMobileLayout();
  const pointerRotationEnabled = interactive && !isMobile;
  const pointerEventsDisabled = isMobile || !interactive;

  return (
    <Canvas
      camera={{ position: cameraPosition, fov: cameraFov }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 0);
      }}
      style={{
        background: "transparent",
        ...(pointerEventsDisabled ? { pointerEvents: "none" } : {}),
      }}
    >
      <ambientLight intensity={2.5} />
      <pointLight
        intensity={2}
        decay={2}
        color={theme.palette.secondary.main}
        position={[3.592, 5.939, 3.134]}
        rotation={[-1.839, 0.602, 1.932]}
      />
      <pointLight
        intensity={2}
        decay={2}
        color={theme.palette.primary.light}
        position={[-6.44, -5.881, 2.343]}
        rotation={[-1.839, 0.602, 1.932]}
      />
      <PythonLogoModel />
      <OrbitControls
        ref={controlsRef}
        enabled={pointerRotationEnabled}
        target={target}
        minAzimuthAngle={Math.PI / -2.2}
        maxAzimuthAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 10}
        maxPolarAngle={Math.PI / 1.1}
        minDistance={distanceRange[0]}
        maxDistance={distanceRange[1]}
        enableRotate={pointerRotationEnabled}
        enableZoom={false}
        enablePan={false}
        enableDamping={pointerRotationEnabled}
        dampingFactor={0.02}
      />
      <OrbitModelCanvasTouchScroll active={pointerEventsDisabled} />
    </Canvas>
  );
};
