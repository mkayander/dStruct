import type { AnimationName } from "#/store/reducers/treeNodeReducer";

export const validateAnimationName = (
  name?: string
): AnimationName | undefined => {
  switch (name) {
    case "blink":
      return name;
    default:
      console.warn(`Invalid animation name: ${name}`);
      return undefined;
  }
};
