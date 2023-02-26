import { type Theme, useMediaQuery } from "@mui/material";

export const useMobileLayout = () =>
  useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
