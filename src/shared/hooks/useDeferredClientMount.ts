import { useLayoutEffect, useRef, useState } from "react";

export type DeferredClientMountState = {
  /** True one frame after mount or Activity show. */
  isReady: boolean;
  /** Increments each show cycle so heavy clients can force a fresh instance. */
  mountKey: number;
};

/**
 * Defers client-only mount one frame; resets on cleanup so Cache Components /
 * Activity hide-show cycles recreate heavy runtimes (WebGL, Monaco).
 *
 * Cleanup runs in `useLayoutEffect` so disposal happens before the route is hidden.
 */
export function useDeferredClientMount(
  onCleanup?: () => void,
): DeferredClientMountState {
  const [isReady, setIsReady] = useState(false);
  const [mountKey, setMountKey] = useState(0);
  const onCleanupRef = useRef(onCleanup);

  useLayoutEffect(() => {
    onCleanupRef.current = onCleanup;
  });

  useLayoutEffect(() => {
    let frameId = 0;
    frameId = window.requestAnimationFrame(() => {
      setIsReady(true);
      setMountKey((previousKey) => previousKey + 1);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      onCleanupRef.current?.();
      setIsReady(false);
    };
  }, []);

  return { isReady, mountKey };
}
