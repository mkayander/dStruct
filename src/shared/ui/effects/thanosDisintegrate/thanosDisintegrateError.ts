export type ThanosDisintegrateErrorCode =
  | "canvas_unavailable"
  | "no_particles"
  | "no_target"
  | "zero_size_surface";

export class ThanosDisintegrateError extends Error {
  readonly code: ThanosDisintegrateErrorCode;

  constructor(code: ThanosDisintegrateErrorCode, message: string) {
    super(message);
    this.name = "ThanosDisintegrateError";
    this.code = code;
  }
}
