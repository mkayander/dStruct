export type ThanosParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  decay: number;
};

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
  /** Hard cap on animation frames. */
  maxFrames?: number;
  /** Canvas stacking order while animating. */
  zIndex?: number;
};
