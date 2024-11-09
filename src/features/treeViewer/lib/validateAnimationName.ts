import type { AnimationName } from "#/entities/dataStructures/node/model/nodeSlice";

export const validateAnimationName = (
  name?: string | null,
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
