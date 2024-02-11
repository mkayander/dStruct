import { useTheme } from "@mui/material";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { PythonLogoModel } from "#/3d-models/PythonLogoModel";

type PythonLogoViewProps = {
  azimuthalAngle?: number;
  polarAngle?: number;
};

export const PythonLogoView: React.FC<PythonLogoViewProps> = ({
  azimuthalAngle,
  polarAngle,
}) => {
  const theme = useTheme();

  const ref = useRef<ThreeOrbitControls | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (azimuthalAngle !== undefined) {
      ref.current.setAzimuthalAngle(azimuthalAngle);
    }
    if (polarAngle !== undefined) {
      ref.current.setPolarAngle(polarAngle);
    }
  }, [azimuthalAngle, polarAngle]);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight
        intensity={2}
        decay={2}
        color={theme.palette.primary.main}
        position={[3.592, 5.939, 3.134]}
        rotation={[-1.839, 0.602, 1.932]}
      />
      <pointLight
        intensity={1}
        decay={2}
        color={theme.palette.primary.light}
        position={[-6.44, -5.881, 2.343]}
        rotation={[-1.839, 0.602, 1.932]}
      />
      <PythonLogoModel />
      <OrbitControls
        ref={ref}
        minAzimuthAngle={Math.PI / -2.2}
        maxAzimuthAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 10}
        maxPolarAngle={Math.PI / 1.1}
        minDistance={6}
        maxDistance={15}
        enableRotate={false}
        enableZoom={false}
      />
    </Canvas>
  );
};
