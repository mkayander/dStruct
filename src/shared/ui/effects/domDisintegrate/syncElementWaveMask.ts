/** Radial CSS mask that reveals particles beneath the live surface as the wave expands. */
export const WAVE_MASK_FADE_PX = 24;

const WAVE_MASK_ORIGIN_X_VAR = "--ds-wave-x";
const WAVE_MASK_ORIGIN_Y_VAR = "--ds-wave-y";
const WAVE_MASK_INNER_RADIUS_VAR = "--ds-wave-inner-r";
const WAVE_MASK_OUTER_RADIUS_VAR = "--ds-wave-outer-r";

const MODAL_WAVE_MASK_TEMPLATE = `radial-gradient(circle at var(${WAVE_MASK_ORIGIN_X_VAR}, 0px) var(${WAVE_MASK_ORIGIN_Y_VAR}, 0px), transparent var(${WAVE_MASK_INNER_RADIUS_VAR}, 0px), black var(${WAVE_MASK_OUTER_RADIUS_VAR}, 0px))`;
const PARTICLE_WAVE_MASK_TEMPLATE = `radial-gradient(circle at var(${WAVE_MASK_ORIGIN_X_VAR}, 0px) var(${WAVE_MASK_ORIGIN_Y_VAR}, 0px), black var(${WAVE_MASK_INNER_RADIUS_VAR}, 0px), transparent var(${WAVE_MASK_OUTER_RADIUS_VAR}, 0px))`;

type WaveMaskKind = "modal" | "particle";

type WaveMaskElementState = {
  kind: WaveMaskKind;
  originX: number;
  originY: number;
  innerRadius: number;
  outerRadius: number;
  templateApplied: boolean;
};

const waveMaskStateByElement = new WeakMap<HTMLElement, WaveMaskElementState>();

export type WaveMaskRadii = {
  innerRadius: number;
  outerRadius: number;
};

export const getWaveMaskRadii = (
  elapsedSeconds: number,
  waveSpeedPxPerSecond: number,
): WaveMaskRadii => {
  const waveRadius = elapsedSeconds * waveSpeedPxPerSecond;

  return {
    innerRadius: Math.max(0, waveRadius - WAVE_MASK_FADE_PX),
    outerRadius: waveRadius + WAVE_MASK_FADE_PX,
  };
};

/** Modal: transparent inside the wave (dissolved), opaque outside (glass remains). */
export const createModalWaveMask = (
  origin: { x: number; y: number },
  { innerRadius, outerRadius }: WaveMaskRadii,
): string =>
  `radial-gradient(circle at ${origin.x}px ${origin.y}px, transparent ${innerRadius}px, black ${outerRadius}px)`;

/** Particles: visible inside the wave, hidden outside (inverse of the modal mask). */
export const createParticleWaveMask = (
  origin: { x: number; y: number },
  { innerRadius, outerRadius }: WaveMaskRadii,
): string =>
  `radial-gradient(circle at ${origin.x}px ${origin.y}px, black ${innerRadius}px, transparent ${outerRadius}px)`;

const applyMaskTemplate = (
  target: HTMLElement,
  kind: WaveMaskKind,
  maskSize: string,
): void => {
  const mask =
    kind === "modal" ? MODAL_WAVE_MASK_TEMPLATE : PARTICLE_WAVE_MASK_TEMPLATE;
  target.style.maskImage = mask;
  target.style.maskSize = maskSize;
  target.style.setProperty("-webkit-mask-image", mask);
  target.style.setProperty("-webkit-mask-size", maskSize);
};

const applyWaveMaskRadii = (
  target: HTMLElement,
  kind: WaveMaskKind,
  origin: { x: number; y: number },
  radii: WaveMaskRadii,
  maskSize: string,
): void => {
  const existingState = waveMaskStateByElement.get(target);
  const state: WaveMaskElementState = existingState ?? {
    kind,
    originX: Number.NaN,
    originY: Number.NaN,
    innerRadius: Number.NaN,
    outerRadius: Number.NaN,
    templateApplied: false,
  };

  if (!state.templateApplied || state.kind !== kind) {
    applyMaskTemplate(target, kind, maskSize);
    state.kind = kind;
    state.templateApplied = true;
  }

  if (state.originX !== origin.x || state.originY !== origin.y) {
    target.style.setProperty(WAVE_MASK_ORIGIN_X_VAR, `${origin.x}px`);
    target.style.setProperty(WAVE_MASK_ORIGIN_Y_VAR, `${origin.y}px`);
    state.originX = origin.x;
    state.originY = origin.y;
  }

  if (
    state.innerRadius === radii.innerRadius &&
    state.outerRadius === radii.outerRadius
  ) {
    waveMaskStateByElement.set(target, state);
    return;
  }

  target.style.setProperty(
    WAVE_MASK_INNER_RADIUS_VAR,
    `${radii.innerRadius}px`,
  );
  target.style.setProperty(
    WAVE_MASK_OUTER_RADIUS_VAR,
    `${radii.outerRadius}px`,
  );
  state.innerRadius = radii.innerRadius;
  state.outerRadius = radii.outerRadius;
  waveMaskStateByElement.set(target, state);
};

export const applyWaveMaskToElement = (
  element: HTMLElement,
  origin: { x: number; y: number },
  elapsedSeconds: number,
  waveSpeedPxPerSecond: number,
  displayWidth: number,
  displayHeight: number,
): void => {
  const radii = getWaveMaskRadii(elapsedSeconds, waveSpeedPxPerSecond);
  const maskSize = `${displayWidth}px ${displayHeight}px`;
  applyWaveMaskRadii(element, "modal", origin, radii, maskSize);
};

export const applyParticleWaveMaskToCanvas = (
  canvas: HTMLCanvasElement,
  origin: { x: number; y: number },
  elapsedSeconds: number,
  waveSpeedPxPerSecond: number,
  canvasWidth: number,
  canvasHeight: number,
  originOffset = 0,
): void => {
  const radii = getWaveMaskRadii(elapsedSeconds, waveSpeedPxPerSecond);
  const maskSize = `${canvasWidth}px ${canvasHeight}px`;
  applyWaveMaskRadii(
    canvas,
    "particle",
    { x: origin.x + originOffset, y: origin.y + originOffset },
    radii,
    maskSize,
  );
};

const clearCssMaskStyles = (target: HTMLElement): void => {
  target.style.maskImage = "";
  target.style.maskSize = "";
  target.style.maskRepeat = "";
  target.style.imageRendering = "";
  target.style.removeProperty("-webkit-mask-image");
  target.style.removeProperty("-webkit-mask-size");
  target.style.removeProperty("-webkit-mask-repeat");
  target.style.removeProperty(WAVE_MASK_ORIGIN_X_VAR);
  target.style.removeProperty(WAVE_MASK_ORIGIN_Y_VAR);
  target.style.removeProperty(WAVE_MASK_INNER_RADIUS_VAR);
  target.style.removeProperty(WAVE_MASK_OUTER_RADIUS_VAR);
  waveMaskStateByElement.delete(target);
};

export const clearWaveMaskFromElement = clearCssMaskStyles;

export const clearParticleWaveMaskFromCanvas = clearCssMaskStyles;
