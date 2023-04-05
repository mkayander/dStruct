import type { AnimationName } from "#/store/reducers/structures/treeNodeReducer";

export const validateAnimationName = (
  name?: string
): AnimationName | undefined => {
  if (!name) return;

  switch (name) {
    case "blink":
      return name;
    default:
      console.warn(`Invalid animation name: ${name}`);
      return;
  }
};
