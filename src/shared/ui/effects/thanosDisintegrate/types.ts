export type ThanosDisintegrateMaskMode = "radial" | "chunks";

/** Click-origin radial wave or a morpheus-style grid dissolve pattern. */
export type ThanosMaskStrategy =
  | "wave"
  | "centerOut"
  | "sand"
  | "random"
  | "leftToRight"
  | "rightToLeft"
  | "topToBottom"
  | "bottomToTop"
  | "topLeftDiagonal"
  | "topRightDiagonal"
  | "bottomLeftDiagonal"
  | "bottomRightDiagonal"
  | "edgesIn"
  | "splitHorizontal"
  | "splitVertical";

export type ThanosParticleRenderMode = "color" | "sprite";

export type ThanosParticle = {
  x: number;
  y: number;
  /** Snapshot grid position used to punch holes in the captured surface. */
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  /** Per-second velocity decay (0.96 ≈ 4% loss per 60fps frame). */
  drag: number;
  /** Normalized point in [0, 1] when post-release fade begins. */
  fadeStart: number;
  /** Seconds from release until alpha reaches zero. */
  fadeDuration: number;
  /** Seconds from animation start when this particle begins to crumble. */
  releaseTime: number;
};

export type ThanosDisintegrateOrigin =
  | { x: number; y: number }
  | { clientX: number; clientY: number };

export type ThanosDisintegrateOptions = {
  /** Pixel stride when sampling the captured surface. */
  particleStep?: number;
  /** Base particle size in CSS pixels. */
  particleSize?: number;
  /** Max outward speed magnitude in px/s. */
  maxVelocity?: number;
  /** Horizontal drift in px/s. */
  windX?: number;
  /** Vertical drift in px/s. */
  windY?: number;
  /** Downward acceleration in px/s². */
  gravity?: number;
  /** Hard cap on animation duration in seconds after the wave reaches the edge. */
  maxDuration?: number;
  /** Canvas stacking order while animating. */
  zIndex?: number;
  /** Click origin for a radial crumble wave (local or client coordinates). */
  origin?: ThanosDisintegrateOrigin;
  /** Radial wave speed in px/s. */
  waveSpeed?: number;
  /** Dissolve mask style: smooth radial wave or pixel chunk bitmasks. */
  maskMode?: ThanosDisintegrateMaskMode;
  /** Max precomputed chunk mask steps (bounds memory for large surfaces). */
  maxChunkMaskSteps?: number;
  /** Dissolve pattern for particle release times (defaults to wave when origin is set). */
  maskStrategy?: ThanosMaskStrategy;
  /** Seconds for grid strategies to spread from first to last cell. */
  maskSpreadDuration?: number;
  /** Solid-color squares or snapshot sprites via drawImage. */
  particleRenderMode?: ThanosParticleRenderMode;
  /** Build chunk masks in a Web Worker when available. */
  useChunkMaskWorker?: boolean;
};

/** Options with defaults applied; excludes runtime-only `origin` and strategy defaulting. */
export type ResolvedThanosDisintegrateOptions = Required<
  Omit<ThanosDisintegrateOptions, "origin" | "maskStrategy">
>;
