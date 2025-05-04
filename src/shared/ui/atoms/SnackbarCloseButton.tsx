import { Close } from "@mui/icons-material";
import { type SnackbarKey, useSnackbar } from "notistack";
import React from "react";

import { Button } from "#/shadcn/ui/button";
import { cn } from "#/shared/lib/utils";

type SnackbarCloseButtonProps = {
  snackbarKey: SnackbarKey;
  className?: string;
};

export const SnackbarCloseButton: React.FC<SnackbarCloseButtonProps> = ({
  snackbarKey,
  className,
}) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "text-foreground/60 hover:bg-background/80 hover:text-foreground h-6 w-6 rounded-full bg-transparent p-0",
        className,
      )}
      onClick={() => closeSnackbar(snackbarKey)}
    >
      <Close fontSize="small" />
      <span className="sr-only">Close</span>
    </Button>
  );
};
