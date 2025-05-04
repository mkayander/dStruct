import type { ReactNode } from "react";
import React from "react";

import { Button } from "#/shadcn/ui/button";
import { cn } from "#/shared/lib/utils";

import { Ripple } from "./Ripple";

interface RateButtonProps {
  icon: ReactNode;
  count: number;
  className?: string;
  variant?: "left" | "right" | "standalone";
  onClick?: () => void;
}

export const RateButton: React.FC<RateButtonProps> = ({
  icon,
  count,
  className,
  variant = "standalone",
  onClick,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "left":
        return "rounded-r-none border-r border-border";
      case "right":
        return "rounded-l-none";
      default:
        return "";
    }
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "relative flex items-center gap-1 px-3",
        getVariantClasses(),
        className,
      )}
      size="sm"
      onClick={onClick}
    >
      <span className="mr-1">{icon}</span>
      <span>{count}</span>
    </Button>
  );
};
