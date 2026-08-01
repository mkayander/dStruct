export type ThanosParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  size: number;
  decay: number;
  /** Animation frame when this particle begins to crumble. */
  releaseFrame: number;
};

export type ThanosDisintegrateOrigin =
  | { x: number; y: number }
  | { clientX: number; clientY: number };

export type ThanosDisintegrateOptions = {
  /** Pixel stride when sampling the captured surface. */
  particleStep?: number;
  /** Base particle size in CSS pixels. */
  particleSize?: number;
  /** Max random velocity magnitude per axis. */
  maxVelocity?: number;
  /** Horizontal drift applied each frame. */
  windX?: number;
  /** Vertical drift applied each frame. */
  windY?: number;
  /** Per-frame downward acceleration. */
  gravity?: number;
  /** Hard cap on animation frames after the wave reaches a particle. */
  maxFrames?: number;
  /** Canvas stacking order while animating. */
  zIndex?: number;
  /** Click origin for a radial crumble wave (local or client coordinates). */
  origin?: ThanosDisintegrateOrigin;
  /** Distance in pixels per one frame of wave delay. */
  waveSpeed?: number;
};
