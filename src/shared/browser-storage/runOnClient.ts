export const runOnClient = <T>(fn: () => T): T | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return fn();
};

export const isBrowser = (): boolean => typeof window !== "undefined";
