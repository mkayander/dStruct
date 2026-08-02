export type DomDisintegrateMaskMode = "radial" | "chunks";

/** Click-origin radial wave or a morpheus-style grid dissolve pattern. */
export type DisintegrateMaskStrategy =
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

export type DisintegrateParticleRenderMode = "color" | "sprite";

/** Outward burst ("splat") or fire-spark flutter with buoyant rise ("windy"). */
export type DisintegrateParticleMotionMode = "splat" | "windy";

export type DisintegrateParticle = {
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
  /** Per-particle seed for turbulence phase, frequency, and influence. */
  turbulenceSeed: number;
};

export type DomDisintegrateOrigin =
  | { x: number; y: number }
  | { clientX: number; clientY: number };

export type DomDisintegrateOptions = {
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
  origin?: DomDisintegrateOrigin;
  /** Radial wave speed in px/s. */
  waveSpeed?: number;
  /** Dissolve mask style: smooth radial wave or pixel chunk bitmasks. */
  maskMode?: DomDisintegrateMaskMode;
  /** Max precomputed chunk mask steps (bounds memory for large surfaces). */
  maxChunkMaskSteps?: number;
  /** Dissolve pattern for particle release times (defaults to wave when origin is set). */
  maskStrategy?: DisintegrateMaskStrategy;
  /** Seconds for grid strategies to spread from first to last cell. */
  maskSpreadDuration?: number;
  /** Solid-color squares or snapshot sprites via drawImage. */
  particleRenderMode?: DisintegrateParticleRenderMode;
  /** Build chunk masks in a Web Worker when available. */
  useChunkMaskWorker?: boolean;
  /** Particle physics style after release (defaults to windy). */
  particleMotionMode?: DisintegrateParticleMotionMode;
};

/** Options with defaults applied; excludes runtime-only `origin` and strategy defaulting. */
export type ResolvedDomDisintegrateOptions = Required<
  Omit<DomDisintegrateOptions, "origin" | "maskStrategy">
>;
