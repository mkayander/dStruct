import type {
  ThanosDisintegrateOptions,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";

export type ThanosCaptureSnapshot = {
  sourceCanvas: HTMLCanvasElement | null;
  particles: ThanosParticle[];
  displayWidth: number;
  displayHeight: number;
};

export const cloneThanosParticles = (
  particles: ThanosParticle[],
): ThanosParticle[] => particles.map((particle) => ({ ...particle }));

export const isThanosCaptureSnapshotValid = (
  snapshot: ThanosCaptureSnapshot,
  element: HTMLElement,
): boolean => {
  const rect = element.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));

  return (
    snapshot.displayWidth === width &&
    snapshot.displayHeight === height &&
    snapshot.particles.length > 0
  );
};

export const getElementDisplaySize = (
  element: HTMLElement,
): { displayWidth: number; displayHeight: number } => {
  const rect = element.getBoundingClientRect();
  return {
    displayWidth: Math.max(1, Math.round(rect.width)),
    displayHeight: Math.max(1, Math.round(rect.height)),
  };
};

export type BuildThanosCaptureMode = "fast" | "quality";

export type BuildThanosCaptureOptions = {
  mode: BuildThanosCaptureMode;
  disintegrateOptions?: ThanosDisintegrateOptions;
};
