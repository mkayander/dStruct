import Translate from "@mui/icons-material/Translate";
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
  Typography,
  useTheme,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

import { useOptionalCookieConsentContext } from "#/features/cookieConsent/context/CookieConsentContext";
import type { Locales } from "#/i18n/i18n-types";
import { loadLocaleAsync } from "#/i18n/i18n-util.async";
import { localeLabels, localesForLanguagePicker } from "#/i18n/labels";
import { setStoredLocale } from "#/shared/browser-storage/localeStorage";
import { useI18nContext, usePagesRouterCompat } from "#/shared/hooks";

import { GITHUB_URL } from "#/constants";

type NavItemProps = {
  title: string;
  onClick?: () => void;
  href?: string;
};
const NavItem: React.FC<NavItemProps> = ({ title, onClick, href }) => {
  const component: React.ElementType = href ? "a" : "button";

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
  const pagesRouter = usePagesRouterCompat();
  const { LL, locale: activeLocale } = useI18nContext();
  const theme = useTheme();
  const session = useSession();
  const cookieConsent = useOptionalCookieConsentContext();

  const handleOpenCookieSettings = () => {
    cookieConsent?.openCookieSettings();
    setIsOpen(false);
  };

  const handleChangeLocale = async (event: SelectChangeEvent<Locales>) => {
    const newLocale = event.target.value as Locales;
    const currentLocale = pagesRouter?.locale ?? activeLocale;
    if (newLocale === currentLocale) {
      return;
    }
    setStoredLocale(newLocale);
    await loadLocaleAsync(newLocale);
    if (pagesRouter) {
      void pagesRouter.push(pagesRouter.asPath, undefined, {
        locale: newLocale,
      });
      return;
    }
    // App Router marketing home: full navigation to locale home URL.
    window.location.assign(newLocale === "en" ? "/" : `/${newLocale}`);
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      slotProps={{
        paper: {
          sx: {
            background: alpha(theme.appDesign.surfaceHigh, 0.88),
            backdropFilter: "blur(20px)",
            borderLeft: `1px solid ${alpha(theme.appDesign.outline, 0.16)}`,
          },
        },
      }}
    >
      <Box
        role="presentation"
        sx={{
          minWidth: "22vw",
        }}
      >
        <List
          subheader={
            <ListSubheader disableSticky>{LL.MAIN_MENU()}</ListSubheader>
          }
        >
          <Link href={`/profile/${session.data?.user.id ?? ""}`}>
            <NavItem title={LL.PROFILE()} />
          </Link>
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
              <Translate />
            </ListItemIcon>
            <FormControl fullWidth>
              <InputLabel id="side-panel-language-label">
                {LL.LANGUAGE()}
              </InputLabel>
              <Select
                labelId="side-panel-language-label"
                label={LL.LANGUAGE()}
                value={(pagesRouter?.locale as Locales) ?? activeLocale ?? "en"}
                onChange={handleChangeLocale}
              >
                {localesForLanguagePicker.map((locale) => (
                  <MenuItem key={locale} value={locale}>
                    <Typography>{localeLabels[locale]}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
          <NavItem title={LL.PRIVACY_POLICY()} href="/privacy" />
          {cookieConsent ? (
            <NavItem
              title={LL.COOKIE_SETTINGS_LINK()}
              onClick={handleOpenCookieSettings}
            />
          ) : null}
        </List>
      </Box>
    </SwipeableDrawer>
  );
};
