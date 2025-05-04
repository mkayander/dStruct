import React, { useRef } from "react";

export const Ripple = () => {
  const rippleRef = useRef<HTMLSpanElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const parent = (e.target as HTMLSpanElement).parentElement as HTMLElement;
    if (!parent) return;
    const ripple = rippleRef.current;
    if (!ripple) return;

    const rect = parent.getBoundingClientRect();
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${e.clientX - rect.left - radius}px`;
    ripple.style.top = `${e.clientY - rect.top - radius}px`;
    ripple.style.opacity = "1";

    // Retrigger the custom ripple animation
    ripple.style.animation = "none";
    void ripple.offsetWidth;
    ripple.style.animation = "var(--animate-ripple)";
  };

  return (
    <span
      className="absolute inset-0 top-0 left-0 h-full w-full overflow-hidden"
      style={{ pointerEvents: "auto", cursor: "inherit" }}
      onClick={handleClick}
    >
      <span
        ref={rippleRef}
        className="ripple pointer-events-none absolute rounded-full bg-white/30 opacity-0"
      />
    </span>
  );
};
