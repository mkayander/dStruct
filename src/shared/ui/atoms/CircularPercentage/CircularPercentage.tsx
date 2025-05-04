"use client";

import React, { useEffect, useState } from "react";

import { colors } from "#/shared/lib/colors";

const SIZE = 44;
const VIEW_BOX = `${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`;

interface CircularPercentageProps extends React.PropsWithChildren {
  value?: number;
  size?: number;
  radius?: number;
  thickness?: number;
  bgColor?: string;
}

export const CircularPercentage: React.FC<CircularPercentageProps> = ({
  size = 128,
  thickness = 4.6,
  value = 0,
  bgColor,
  children,
}) => {
  const [displayedLevel, setDisplayedLevel] = useState(0);
  useEffect(() => {
    setDisplayedLevel(value);
  }, [value]);

  const radius = (SIZE - thickness) / 2;

  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference.toFixed(3);
  const strokeDashoffset = `${(
    ((100 - displayedLevel) / 100) *
    circumference
  ).toFixed(3)}px`;

  const sizePx = `${size}px`;

  return (
    <div
      className="relative"
      aria-valuenow={Math.round(value)}
      style={{
        height: sizePx,
        width: sizePx,
      }}
    >
      <svg
        viewBox={VIEW_BOX}
        className="h-full w-full pointer-events-none -rotate-90 absolute overflow-visible"
      >
        <defs>
          <linearGradient
            id="circle-gradient"
            x1="100%"
            y1="-30%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor={colors.error.main} />
            <stop offset="20%" stopColor={colors.info.main} />
            <stop offset="50%" stopColor={colors.secondary.light} />
            <stop offset="100%" stopColor={colors.success.main} />
          </linearGradient>
        </defs>
        <circle
          cx={SIZE}
          cy={SIZE}
          r={radius}
          stroke={bgColor || colors.primary.main}
          strokeWidth={thickness}
          fill="none"
          className="opacity-40"
        />
        <circle
          cx={SIZE}
          cy={SIZE}
          r={radius}
          stroke="url(#circle-gradient)"
          strokeWidth={thickness}
          fill="none"
          className="transition-[stroke-dashoffset] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            strokeDasharray,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className="z-20 w-full h-full flex flex-col justify-center items-center">
        {children ? children : `${value?.toFixed(2)}%`}
      </div>
    </div>
  );
};
