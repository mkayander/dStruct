import { Add } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";

type AddArgumentButtonProps = {
  onClick: () => void;
  title: string;
};

export const AddArgumentButton: React.FC<AddArgumentButtonProps> = ({
  onClick,
  title,
}) => {
  return (
    <Box display="flex" justifyContent="center">
      <IconButton title={title} onClick={onClick}>
        <Add />
      </IconButton>
    </Box>
  );
};
