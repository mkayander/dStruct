/** Shared camera / orbit defaults for landing 3D decor (brand tree + Python logo). */

export const LANDING_DECOR_BRAND_BASE_AZIMUTH = Math.PI / 4.6;
export const LANDING_DECOR_BRAND_BASE_POLAR = Math.PI / 2.5;

/** Mirrored resting pose so the left-side Python decoration faces inward toward content. */
export const LANDING_DECOR_PYTHON_BASE_AZIMUTH =
  -LANDING_DECOR_BRAND_BASE_AZIMUTH;
export const LANDING_DECOR_PYTHON_BASE_POLAR = LANDING_DECOR_BRAND_BASE_POLAR;

export const LANDING_DECOR_MODEL_CAMERA: [number, number, number] = [
  1, 2.6, 22,
];
export const LANDING_DECOR_MODEL_FOV = 38;
export const LANDING_DECOR_MODEL_TARGET: [number, number, number] = [
  0, 0.75, 0,
];
export const LANDING_DECOR_MODEL_DISTANCE: readonly [number, number] = [18, 28];
