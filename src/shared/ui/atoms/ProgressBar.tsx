import React from "react";

import { cn } from "#/shared/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  barClassName?: string;
  bgColor?: string;
  fillColor?: string;
  height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className,
  barClassName,
  bgColor = "bg-red-500",
  fillColor = "bg-green-500",
  height = "h-1",
}) => {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded",
        height,
        bgColor,
        className,
      )}
    >
      <div
        className={cn(
          "h-full transition-all duration-300",
          fillColor,
          barClassName,
        )}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};
