import { useTheme } from "@mui/material";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { BinaryTreeModel } from "#/3d-models/BinaryTreeModel";

type LogoModelViewProps = {
  controlsRef: React.MutableRefObject<ThreeOrbitControls | null>;
};

export const LogoModelView: React.FC<LogoModelViewProps> = ({
  controlsRef,
}) => {
  const theme = useTheme();

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
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
        minAzimuthAngle={Math.PI / -2.2}
        maxAzimuthAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 10}
        maxPolarAngle={Math.PI / 1.1}
        minDistance={10}
        maxDistance={15}
        enableRotate={true}
        enableZoom={false}
      />
    </Canvas>
  );
};
