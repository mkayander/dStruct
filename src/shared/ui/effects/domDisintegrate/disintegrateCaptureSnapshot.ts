import type {
  DisintegrateParticle,
  DomDisintegrateOptions,
} from "#/shared/ui/effects/domDisintegrate/types";

export type DisintegrateCaptureSnapshot = {
  sourceCanvas: HTMLCanvasElement | null;
  particles: DisintegrateParticle[];
  displayWidth: number;
  displayHeight: number;
};

export const cloneDisintegrateParticles = (
  particles: DisintegrateParticle[],
): DisintegrateParticle[] => particles.map((particle) => ({ ...particle }));

export const isDisintegrateCaptureSnapshotValid = (
  snapshot: DisintegrateCaptureSnapshot,
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

export type BuildDisintegrateCaptureMode = "fast" | "quality";

export type BuildDisintegrateCaptureOptions = {
  mode: BuildDisintegrateCaptureMode;
  disintegrateOptions?: DomDisintegrateOptions;
};
