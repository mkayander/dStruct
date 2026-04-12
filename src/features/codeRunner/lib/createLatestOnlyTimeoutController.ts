export type LatestTimeoutTask = (
  isLatest: () => boolean,
) => void | Promise<void>;

export type LatestOnlyTimeoutController = {
  clear: () => void;
  schedule: (task: LatestTimeoutTask, delayMs: number) => void;
};

export const createLatestOnlyTimeoutController =
  (): LatestOnlyTimeoutController => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let generation = 0;

    const clear = () => {
      generation += 1;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const schedule = (task: LatestTimeoutTask, delayMs: number) => {
      clear();
      const scheduledGeneration = generation;
      timeoutId = setTimeout(() => {
        timeoutId = null;
        void task(() => scheduledGeneration === generation);
      }, delayMs);
    };

    return { clear, schedule };
  };
