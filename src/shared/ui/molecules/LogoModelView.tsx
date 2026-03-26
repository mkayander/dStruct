import { useTheme } from "@mui/material";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import React from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { BinaryTreeModel } from "#/3d-models/BinaryTreeModel";
import { useMobileLayout } from "#/shared/hooks";

type LogoModelViewProps = {
  controlsRef: React.RefObject<ThreeOrbitControls | null>;
};

/**
 * OrbitControls.connect() sets gl.domElement.style.touchAction = "none", which
 * captures touch and blocks page scroll. Restore vertical pan on the actual
 * canvas after controls connect (this runs in a later sibling useEffect).
 */
const MobileCanvasTouchScroll: React.FC<{ active: boolean }> = ({ active }) => {
  const gl = useThree((state) => state.gl);

  React.useEffect(() => {
    const canvas = gl.domElement;
    if (!active) return;
    canvas.style.touchAction = "pan-y";
    return () => {
      canvas.style.touchAction = "none";
    };
  }, [active, gl]);

  return null;
};

export const LogoModelView: React.FC<LogoModelViewProps> = ({
  controlsRef,
}) => {
  const theme = useTheme();
  const isMobile = useMobileLayout();
  const pointerRotationEnabled = !isMobile;

  return (
    <Canvas>
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
        target={[0, 0.5, 0]}
        minAzimuthAngle={Math.PI / -2.2}
        maxAzimuthAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 10}
        maxPolarAngle={Math.PI / 1.1}
        minDistance={13}
        maxDistance={20}
        enableRotate={pointerRotationEnabled}
        enableZoom={false}
        enablePan={false}
        enableDamping={pointerRotationEnabled}
        dampingFactor={0.005}
      />
      <MobileCanvasTouchScroll active={isMobile} />
    </Canvas>
  );
};
