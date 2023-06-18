"use client";

import { Settings } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  alpha,
  AppBar,
  type AppBarProps,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Toolbar,
  type ToolbarProps,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { type MouseEvent, useEffect, useState } from "react";

import { SidePanel } from "#/components/Page/SidePanel";
import { ThemeSwitch } from "#/components/Page/ThemeSwitch";
import { useProfileImageUploader } from "#/hooks";
import { useI18nContext } from "#/i18n/i18n-react";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  appBarSlice,
  selectIsAppBarScrolled,
} from "#/store/reducers/appBarReducer";
import { getImageUrl, trpc } from "#/utils";

const AVATAR_PLACEHOLDER = "/avatars/placeholder.png";

type NavItem = {
  name: string;
  href: string;
};

type MainAppBarProps = {
  appBarVariant?: AppBarProps["variant"];
  toolbarVariant?: ToolbarProps["variant"];
};

export const MainAppBar: React.FC<MainAppBarProps> = ({
  appBarVariant = "elevation",
  toolbarVariant = "dense",
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useTheme();
  const { LL } = useI18nContext();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const isScrolled = useAppSelector(selectIsAppBarScrolled);

  const session = useSession();

  const pages = [
    {
      name: LL.DASHBOARD(),
      href: "/",
    },
    {
      name: LL.PLAYGROUND(),
      href: "/playground",
    },
  ] as const;

  useProfileImageUploader(session);

  const handleSignIn = async () => {
    await signIn();
  };

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = () => {
    setIsSidePanelOpen(true);
  };

  const handleNavItemClick = (item: NavItem) => {
    void router.push(item.href);
  };

  useEffect(() => {
    const cachedDarkModeValue = localStorage.getItem("isLightMode");
    dispatch(appBarSlice.actions.setIsLightMode(Boolean(cachedDarkModeValue)));
  }, [dispatch]);

  useEffect(() => {
    const isLightMode = theme.palette.mode === "light";
    const databaseLightModeValue = session.data?.user.usesLightMode;

    databaseLightModeValue !== undefined &&
      databaseLightModeValue !== isLightMode &&
      dispatch(appBarSlice.actions.setIsLightMode(databaseLightModeValue));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.data?.user.usesLightMode]);

  const lightModeMutation = trpc.user.setLightMode.useMutation();

  const handleLightModeSwitch = (value: boolean) => {
    dispatch(appBarSlice.actions.setIsLightMode(value));
    session.status === "authenticated" && lightModeMutation.mutate(value);
    localStorage.setItem("isLightMode", value ? "true" : "");
  };

  return (
    <AppBar
      position="sticky"
      elevation={isScrolled ? 2 : 0}
      variant={appBarVariant}
      sx={{
        transition: "background .1s, borderBottom .1s",
        backdropFilter: "blur(12px)",
        boxShadow: `0 0 12px 0 ${alpha(
          theme.palette.primary.main,
          isScrolled ? 0.2 : 0
        )}`,
        background: isScrolled
          ? alpha(theme.palette.primary.main, 0.2)
          : alpha(theme.palette.primary.main, 0),
        borderBottom: `1px solid ${alpha(
          theme.palette.common.white,
          isScrolled ? 0.05 : 0
        )}`,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters variant={toolbarVariant}>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <Image
              alt={LL.DSTRUCT_LOGO()}
              src="/android-chrome-192x192.png"
              width="32"
              height="32"
            />
          </Box>
          {/* TODO: Remove legacyBehavior - issue with nested MUI links https://github.com/mui/material-ui/issues/34898 */}
          <Link href="/" legacyBehavior={true}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "'Share Tech', sans-serif",
                textDecoration: "none",
              }}
            >
              dStruct
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label={LL.CURRENT_USER_ACCOUNT()}
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.href}
                  onClick={() => handleNavItemClick(page)}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
            <Image
              alt={LL.DSTRUCT_LOGO()}
              src="/android-chrome-192x192.png"
              width="32"
              height="32"
            />
          </Box>
          <Link href="/" legacyBehavior={true}>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "'Share Tech', sans-serif",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              dStruct
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.href}
                onClick={() => handleNavItemClick(page)}
                color="inherit"
                sx={{ my: 2, display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ flexGrow: 0 }}
          >
            <ThemeSwitch
              onChange={(_, checked) => {
                handleLightModeSwitch(!checked);
              }}
            />

            {session.status === "loading" ? (
              <Skeleton
                variant="circular"
                animation="wave"
                height={40}
                width={40}
              />
            ) : (
              <>
                {session.status === "unauthenticated" ? (
                  <Button
                    title={LL.SIGN_IN()}
                    color="inherit"
                    onClick={handleSignIn}
                  >
                    {LL.SIGN_IN()}
                  </Button>
                ) : null}
                <Tooltip title={LL.OPEN_OPTIONS()} arrow>
                  <IconButton onClick={handleOpenUserMenu}>
                    {session.data ? (
                      <Avatar>
                        <Image
                          src={getImageUrl(
                            session.data.user.bucketImage || AVATAR_PLACEHOLDER
                          )}
                          alt={`${session.data.user.name} avatar`}
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          fill={true}
                        />
                      </Avatar>
                    ) : (
                      <Settings />
                    )}
                  </IconButton>
                </Tooltip>
              </>
            )}

            <SidePanel
              isOpen={isSidePanelOpen}
              setIsOpen={setIsSidePanelOpen}
            />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
