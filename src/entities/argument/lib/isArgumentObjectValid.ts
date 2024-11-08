import type { ArgumentObjectMap } from "../model/types";
import { argumentObjectValidator } from "./argumentObjectValidator";

export const isArgumentObjectValid = (
  args: unknown,
): args is ArgumentObjectMap => {
  if (typeof args !== "object" || args === null) {
    return false;
  }

  for (const arg of Object.values(args)) {
    if (typeof arg !== "object" || arg === null) {
      return false;
    }
    if (!argumentObjectValidator.safeParse(arg).success) {
      return false;
    }
  }

  return true;
};
