import { useFrame, useThree } from "@react-three/fiber";
import { type FC, useEffect, useLayoutEffect, useRef } from "react";

/**
 * OrbitControls.connect() sets touch-action: none on the canvas. When the
 * canvas should not capture gestures (mobile / decorative scenes), keep scroll
 * working by forcing pointer-events: none and touch-action: auto.
 * useFrame reapplies styles in case connect() runs again later.
 */
export const OrbitModelCanvasTouchScroll: FC<{ active: boolean }> = ({
  active,
}) => {
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
