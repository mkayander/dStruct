import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Defers client-only mount one frame; resets `isReady` on cleanup so Cache
 * Components / Activity hide-show cycles recreate heavy runtimes (WebGL, Monaco).
 */
export function useDeferredClientMount(onCleanup?: () => void): boolean {
  const [isReady, setIsReady] = useState(false);
  const onCleanupRef = useRef(onCleanup);

  useLayoutEffect(() => {
    onCleanupRef.current = onCleanup;
  });

  useEffect(() => {
    let frameId = 0;
    frameId = window.requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      onCleanupRef.current?.();
      setIsReady(false);
    };
  }, []);

  return isReady;
}
