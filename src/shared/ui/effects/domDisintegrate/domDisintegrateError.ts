export type DomDisintegrateErrorCode =
  | "canvas_unavailable"
  | "no_particles"
  | "no_target"
  | "zero_size_surface";

export class DomDisintegrateError extends Error {
  readonly code: DomDisintegrateErrorCode;

  constructor(code: DomDisintegrateErrorCode, message: string) {
    super(message);
    this.name = "DomDisintegrateError";
    this.code = code;
  }
}
