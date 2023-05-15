import { Brightness4, Translate } from "@mui/icons-material";
import {
  alpha,
  Box,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  type SelectChangeEvent,
  SwipeableDrawer,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { useI18nContext } from "#/i18n/i18n-react";
import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";
import { loadLocaleAsync } from "#/i18n/i18n-util.async";

const localeLabels = {
  en: "English",
  ru: "Русский",
  de: "Deutsch",
};

const GITHUB_URL = "https://github.com/mkayander/leetpal";

type NavItemProps = {
  title: string;
  onClick?: () => void;
  href?: string;
};
const NavItem: React.FC<NavItemProps> = ({ title, onClick, href }) => {
  const component = href ? "a" : "button";

  return (
    <ListItem disablePadding>
      <ListItemButton component={component} href={href} onClick={onClick}>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
};

type SidePanelProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const SidePanel: React.FC<SidePanelProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const { LL, locale, setLocale } = useI18nContext();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const handleChangeLocale = async (event: SelectChangeEvent<Locales>) => {
    const newLocale = event.target.value as Locales;
    if (newLocale !== locale) {
      localStorage.setItem("locale", newLocale);
      await loadLocaleAsync(newLocale);
      setLocale(newLocale);
      void router.push(router.asPath, undefined, { locale: newLocale });
    }
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      PaperProps={{
        sx: {
          background: alpha(
            theme.palette.background.paper,
            isDarkMode ? 0.2 : 0.6
          ),
          backdropFilter: "blur(18px)",
        },
      }}
    >
      <Box role="presentation" minWidth="22vw">
        <List
          subheader={
            <ListSubheader disableSticky>{LL.MAIN_MENU()}</ListSubheader>
          }
        >
          <NavItem title={LL.PROFILE()} />
          <NavItem title="GitHub" href={GITHUB_URL} />
          <NavItem title={LL.FEEDBACK()} href={`${GITHUB_URL}/issues`} />
          <NavItem title={LL.LOGOUT()} onClick={() => signOut()} />
        </List>

        <Divider />

        <List
          subheader={
            <ListSubheader disableSticky>{LL.SETTINGS()}</ListSubheader>
          }
        >
          <ListItem>
            <ListItemIcon>
              <Brightness4 />
            </ListItemIcon>
            <ListItemText
              id="side-menu-dark-mode-switch"
              primary={LL.DARK_MODE()}
            />
            <Switch
              edge="end"
              inputProps={{
                "aria-labelledby": "side-menu-dark-mode-switch",
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Translate />
            </ListItemIcon>
            <FormControl fullWidth>
              <InputLabel id="side-panel-language-label">
                {LL.LANGUAGE()}
              </InputLabel>
              <Select
                labelId="side-panel-language-label"
                label={LL.LANGUAGE()}
                value={locale}
                onChange={handleChangeLocale}
              >
                {locales.map((locale) => (
                  <MenuItem key={locale} value={locale}>
                    <Typography>{localeLabels[locale]}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
        </List>
      </Box>
    </SwipeableDrawer>
  );
};
