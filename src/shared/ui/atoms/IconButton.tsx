import {
  IconButton as MuiIconButton,
  type IconButtonProps as MuiIconButtonProps,
} from "@mui/material";
import React from "react";

type IconButtonProps = MuiIconButtonProps & {
  icon: React.ReactNode;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, ...props }, ref) => {
    return (
      <MuiIconButton
        ref={ref}
        size="small"
        sx={{
          width: 32,
          height: 32,
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
        {...props}
      >
        {icon}
      </MuiIconButton>
    );
  },
);

IconButton.displayName = "IconButton";
