const CLOCK_DEPRECATION_FRAGMENT =
  "Clock: This module has been deprecated. Please use THREE.Timer instead.";

let installed = false;

/**
 * @react-three/fiber still constructs THREE.Clock (deprecated in three r183).
 * Remove this shim after upgrading to @react-three/fiber v10.
 */
export const suppressThreeClockDeprecationWarning = (): void => {
  if (installed || typeof window === "undefined") {
    return;
  }

  installed = true;
  const originalWarn = console.warn.bind(console);

  console.warn = (...args: unknown[]) => {
    const firstArg = args[0];
    if (
      typeof firstArg === "string" &&
      firstArg.includes(CLOCK_DEPRECATION_FRAGMENT)
    ) {
      return;
    }

    originalWarn(...args);
  };
};

suppressThreeClockDeprecationWarning();
