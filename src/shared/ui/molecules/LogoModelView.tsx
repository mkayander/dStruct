import { useTheme } from "@mui/material";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { useMobileLayout } from "#/shared/hooks";

import { BinaryTreeModel } from "#/3d-models/BinaryTreeModel";

type LogoModelViewProps = {
  controlsRef?: React.RefObject<ThreeOrbitControls | null>;
  interactive?: boolean;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  target?: [number, number, number];
  distanceRange?: readonly [number, number];
};

/**
 * OrbitControls.connect() sets touch-action: none on the canvas and keeps
 * pointer listeners. touch-action: pan-y alone is not enough for reliable
 * scrolling (e.g. OverlayScrollbars). Let touches hit the scroll container by
 * making the canvas non-interactive; scroll-linked angles still update via ref.
 * useFrame reapplies styles in case connect() or a controls reconnect runs later.
 */
const MobileCanvasTouchScroll: React.FC<{ active: boolean }> = ({ active }) => {
  const gl = useThree((state) => state.gl);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    canvasRef.current = gl.domElement;
  }, [gl]);

  useFrame(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.pointerEvents = "none";
    canvas.style.touchAction = "auto";
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (active) {
      return () => {
        canvas.style.removeProperty("pointer-events");
        canvas.style.touchAction = "none";
      };
    }
    canvas.style.removeProperty("pointer-events");
    canvas.style.touchAction = "none";
  }, [active]);

  return null;
};

export const LogoModelView: React.FC<LogoModelViewProps> = ({
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
      <BinaryTreeModel />
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
        dampingFactor={0.005}
      />
      <MobileCanvasTouchScroll active={pointerEventsDisabled} />
    </Canvas>
  );
};
