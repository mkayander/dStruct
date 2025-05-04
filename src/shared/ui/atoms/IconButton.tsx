import * as React from "react";

import { Button } from "#/shadcn/ui/button";
import { cn } from "#/shared/lib/utils";

type IconButtonProps = React.ComponentProps<typeof Button> & {
  icon: React.ReactNode;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("group relative h-8 w-8", className)}
        {...props}
      >
        <div className="absolute inset-0 rounded-full bg-current opacity-0 transition-opacity group-hover:opacity-10" />
        {icon}
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";
