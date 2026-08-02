import { captureElementViaSvgForeignObject } from "#/shared/ui/effects/domDisintegrate/captureElementViaSvgForeignObject";

/** Fast synchronous-path capture (SVG foreignObject). SnapDOM runs only via idle warm-up. */
export const captureElementToCanvas = captureElementViaSvgForeignObject;
