/**
 * Throttles a callback using requestAnimationFrame.
 * Ensures the callback runs at most once per frame, using the latest args.
 */
export function throttleWithRAF<A extends unknown[]>(
  fn: (...args: A) => void,
): (...args: A) => void {
  let rafId: number | null = null;
  let latestArgs: A | null = null;

  const schedule = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (latestArgs !== null) {
        const args = latestArgs;
        latestArgs = null;
        fn(...args);
      }
    });
  };

  return (...args: A) => {
    latestArgs = args;
    schedule();
  };
}
