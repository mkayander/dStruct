import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { type SnackbarKey, useSnackbar } from "notistack";
import React from "react";

type SnackbarCloseButtonProps = {
  snackbarKey: SnackbarKey;
};

export const SnackbarCloseButton: React.FC<SnackbarCloseButtonProps> = ({
  snackbarKey,
}) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton size="small" onClick={() => closeSnackbar(snackbarKey)}>
      <Close fontSize="small" />
    </IconButton>
  );
};
