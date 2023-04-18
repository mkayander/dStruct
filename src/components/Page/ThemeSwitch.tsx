import { Switch, type SwitchProps, Tooltip, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledThemeSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    backgroundColor: "#111 !important",
    opacity: "0.3 !important",
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M 9 2 c -1.05 0 -2.05 0.16 -3 0.46 c 4.06 1.27 7 5.06 7 9.54 c 0 4.48 -2.94 8.27 -7 9.54 c 0.95 0.3 1.95 0.46 3 0.46 c 5.52 0 10 -4.48 10 -10 S 14.52 2 9 2 Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M 20 8.69 V 4 h -4.69 L 12 0.69 L 8.69 4 H 4 v 4.69 L 0.69 12 L 4 15.31 V 20 h 4.69 L 12 23.31 L 15.31 20 H 20 v -4.69 L 23.31 12 L 20 8.69 Z M 12 18 c -3.31 0 -6 -2.69 -6 -6 s 2.69 -6 6 -6 s 6 2.69 6 6 s -2.69 6 -6 6 Z m 0 -10 c -2.21 0 -4 1.79 -4 4 s 1.79 4 4 4 s 4 -1.79 4 -4 s -1.79 -4 -4 -4 Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

type ThemeSwitchProps = Omit<SwitchProps, "checked">;

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ ...restProps }) => {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  return (
    <Tooltip
      title={isDark ? "Switch to light mode 🌞" : "Switch to dark mode 🌚"}
      arrow={true}
    >
      <StyledThemeSwitch checked={isDark} {...restProps} />
    </Tooltip>
  );
};
