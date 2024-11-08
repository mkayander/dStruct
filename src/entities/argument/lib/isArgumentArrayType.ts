import { ArgumentType } from "../model/argumentObject";
import type { ArgumentArrayType, ArgumentObject } from "../model/types";

export function isArgumentArrayType(
  type: ArgumentType,
): type is ArgumentArrayType;
export function isArgumentArrayType(
  arg: ArgumentObject,
): arg is ArgumentObject<ArgumentArrayType>;
export function isArgumentArrayType(
  arg: ArgumentObject | ArgumentType,
): arg is ArgumentObject<ArgumentArrayType> {
  if (typeof arg === "object") {
    return isArgumentArrayType(arg.type);
  }

  return (
    arg === ArgumentType.ARRAY ||
    arg === ArgumentType.MATRIX ||
    arg === ArgumentType.STRING ||
    arg === ArgumentType.SET ||
    arg === ArgumentType.MAP ||
    arg === ArgumentType.OBJECT
  );
}
