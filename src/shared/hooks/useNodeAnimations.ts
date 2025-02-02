import { useEffect } from "react";

export const useNodeAnimations = (
  ref: React.RefObject<HTMLDivElement | null>,
  animationName: string | null | undefined,
  animationCount?: number,
) => {
  useEffect(() => {
    if (ref.current) {
      const animation = ref.current.style.animation;
      ref.current.style.animation = "none";
      void ref.current.offsetWidth;
      ref.current.style.animation = animation;
    }
  }, [animationCount, ref]);

  if (!animationName) {
    return null;
  }

  const animation = `${animationName} 0.3s ease-in-out`;

  return animation;
};
