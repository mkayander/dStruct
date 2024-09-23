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
  Link as MuiLink,
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

import { ThemeSwitch } from "#/components/atoms/ThemeSwitch";
import { SidePanel } from "#/components/organisms/SidePanel";
import { useProfileImageUploader } from "#/hooks";
import { useI18nContext } from "#/hooks";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  appBarSlice,
  selectIsAppBarScrolled,
} from "#/store/reducers/appBarReducer";
import { getImageUrl, trpc } from "#/utils";

const AVATAR_PLACEHOLDER = "/avatars/placeholder.png";

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
  const currentPath = router.pathname;
  const theme = useTheme();
  const { LL } = useI18nContext();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const isScrolled = useAppSelector(selectIsAppBarScrolled);

  const session = useSession();

  const pages = [
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

  useEffect(() => {
    const cachedDarkModeValue = localStorage.getItem("isLightMode");
    dispatch(appBarSlice.actions.setIsLightMode(Boolean(cachedDarkModeValue)));
  }, [dispatch]);

  useEffect(() => {
    const isLightMode = theme.palette.mode === "light";
    const databaseLightModeValue = session.data?.user.usesLightMode;

    if (
      databaseLightModeValue !== undefined &&
      databaseLightModeValue !== isLightMode
    ) {
      dispatch(appBarSlice.actions.setIsLightMode(databaseLightModeValue));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.data?.user.usesLightMode]);

  const lightModeMutation = trpc.user.setLightMode.useMutation();

  const handleLightModeSwitch = (value: boolean) => {
    dispatch(appBarSlice.actions.setIsLightMode(value));
    if (session.status === "authenticated") {
      lightModeMutation.mutate(value);
    }
    localStorage.setItem("isLightMode", value ? "true" : "");
  };

  return (
    <>
      <SidePanel isOpen={isSidePanelOpen} setIsOpen={setIsSidePanelOpen} />
      <AppBar
        position="sticky"
        elevation={isScrolled ? 2 : 0}
        variant={appBarVariant}
        sx={{
          transition: "background .1s, borderBottom .1s",
          backdropFilter: "blur(12px)",
          boxShadow: `0 0 12px 0 ${alpha(
            theme.palette.primary.main,
            isScrolled ? 0.2 : 0,
          )}`,
          background: isScrolled
            ? alpha(theme.palette.primary.main, 0.2)
            : alpha(theme.palette.primary.main, 0),
          borderBottom: `1px solid ${alpha(
            theme.palette.common.white,
            isScrolled ? 0.05 : 0,
          )}`,
          color: theme.palette.text.primary,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters variant={toolbarVariant} sx={{ height: 56 }}>
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
              <Image
                alt={LL.DSTRUCT_LOGO()}
                src="/android-chrome-192x192.png"
                width="32"
                height="32"
              />
            </Box>
            {/* TODO: Remove legacyBehavior - issue with nested MUI links https://github.com/mui/material-ui/issues/34898 */}
            <Link href="/" legacyBehavior={true} passHref>
              <MuiLink
                variant="h6"
                noWrap
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "'Share Tech', sans-serif",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                dStruct
              </MuiLink>
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
                  <MenuItem key={page.href}>
                    <Link href={page.href}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </Link>
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
            <Link href="/" legacyBehavior={true} passHref>
              <MuiLink
                variant="h5"
                noWrap
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
              </MuiLink>
            </Link>
            <Box
              sx={{ flexGrow: 1, gap: 1, display: { xs: "none", md: "flex" } }}
            >
              {pages.map((page) => (
                <Link key={page.href} href={page.href}>
                  <Button
                    key={page.href}
                    color="inherit"
                    sx={{
                      backgroundColor:
                        page.href && currentPath.startsWith(page.href)
                          ? alpha("#fff", 0.1)
                          : "",
                    }}
                  >
                    {page.name}
                  </Button>
                </Link>
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
                              session.data.user.bucketImage ||
                                AVATAR_PLACEHOLDER,
                            )}
                            alt={`${session.data.user.name} avatar`}
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            width={40}
                            height={40}
                          />
                        </Avatar>
                      ) : (
                        <Settings />
                      )}
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
