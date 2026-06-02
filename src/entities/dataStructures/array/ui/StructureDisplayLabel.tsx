import { Typography } from "@mui/material";
import React from "react";

type StructureDisplayLabelProps = {
  label: string;
};

/** Small caption above a runtime structure when we inferred a variable name from user code. */
export const StructureDisplayLabel: React.FC<StructureDisplayLabelProps> = ({
  label,
}) => (
  <Typography
    component="div"
    variant="caption"
    color="text.secondary"
    sx={{
      fontFamily: "monospace",
      lineHeight: 1.2,
      mb: 0.25,
    }}
  >
    {label}
  </Typography>
);
