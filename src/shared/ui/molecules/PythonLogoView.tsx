import { useTheme } from "@mui/material";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { PythonLogoModel } from "#/3d-models/PythonLogoModel";

type PythonLogoViewProps = {
  controlsRef: React.RefObject<ThreeOrbitControls | null>;
};

export const PythonLogoView: React.FC<PythonLogoViewProps> = ({
  controlsRef,
}) => {
  const theme = useTheme();

  return (
    <Canvas>
      <ambientLight intensity={2.25} />
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
        ref={controlsRef}
        minAzimuthAngle={Math.PI / -2.2}
        maxAzimuthAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 10}
        maxPolarAngle={Math.PI / 1.1}
        minDistance={6}
        maxDistance={15}
        enableRotate={true}
        enableZoom={false}
        enablePan={false}
        dampingFactor={0.005}
      />
    </Canvas>
  );
};
