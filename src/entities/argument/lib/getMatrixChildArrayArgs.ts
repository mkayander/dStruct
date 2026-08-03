import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type {
  ArgumentArrayType,
  ArgumentObject,
} from "#/entities/argument/model/types";

export const getChildArrayName = (name: string, index: number) =>
  `${name}-[${index}]`;

type ArrayArg = ArgumentObject<ArgumentArrayType>;

export const getMatrixChildArrayArgs = (
  arg: ArrayArg,
  onParsed?: (arg: ArrayArg, index: number) => void,
): ArrayArg[] => {
  const input = JSON.parse(arg.input) as (Array<number | string> | string)[];
  const childArgs: ArrayArg[] = [];

  for (let i = 0; i < input.length; i++) {
    const name = getChildArrayName(arg.name, i);
    const item = input[i];
    const newArg: ArrayArg = {
      name,
      parentName: arg.name,
      type: Array.isArray(item) ? ArgumentType.ARRAY : ArgumentType.STRING,
      input: JSON.stringify(item),
      order: arg.order + i + 1,
    };
    childArgs.push(newArg);
    onParsed?.(newArg, i);
  }

  return childArgs;
};
