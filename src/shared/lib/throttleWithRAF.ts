/**
 * Throttles a callback using requestAnimationFrame.
 * Ensures the callback runs at most once per frame, using the latest args.
 */
export type ThrottledWithRAF<A extends unknown[]> = ((...args: A) => void) & {
  cancel: () => void;
};

export function throttleWithRAF<A extends unknown[]>(
  fn: (...args: A) => void,
): ThrottledWithRAF<A> {
  let rafId: number | null = null;
  let latestArgs: A | null = null;

  const cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    latestArgs = null;
  };

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

  const throttled = ((...args: A) => {
    latestArgs = args;
    schedule();
  }) as ThrottledWithRAF<A>;

  throttled.cancel = cancel;

  return throttled;
}
