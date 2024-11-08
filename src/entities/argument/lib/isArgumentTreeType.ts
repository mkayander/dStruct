import {
  argumentTreeTypeValues,
  type ArgumentType,
} from "../model/argumentObject";
import type { ArgumentObject, ArgumentTreeType } from "../model/types";

export function isArgumentTreeType(
  type: ArgumentType,
): type is ArgumentTreeType;
export function isArgumentTreeType(
  arg: ArgumentObject,
): arg is ArgumentObject<ArgumentTreeType>;
export function isArgumentTreeType(
  arg: ArgumentObject | ArgumentType,
): arg is ArgumentObject<ArgumentTreeType> {
  if (typeof arg === "object") {
    return isArgumentTreeType(arg.type);
  }

  return argumentTreeTypeValues.has(arg);
}
