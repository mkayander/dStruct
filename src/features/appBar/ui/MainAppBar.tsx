"use client";

import FolderOpen from "@mui/icons-material/FolderOpen";
import MenuIcon from "@mui/icons-material/Menu";
import Settings from "@mui/icons-material/Settings";
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
import React, { type MouseEvent, useState } from "react";

import { selectIsAppBarScrolled } from "#/features/appBar/model/appBarSlice";
import { MobilePlaygroundToolbar } from "#/features/appBar/ui/MobilePlaygroundToolbar";
import { SidePanel } from "#/features/menuSidePanel/ui/SidePanel";
import { useProjectBrowserContext } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { useProfileImageUploader } from "#/shared/hooks";
import { useI18nContext } from "#/shared/hooks";
import { useMobileLayout } from "#/shared/hooks/useMobileLayout";
import { getImageUrl } from "#/shared/lib";
import { useAppSelector } from "#/store/hooks";

const AVATAR_PLACEHOLDER = "/avatars/placeholder.png";

export type MainAppBarProps = {
  appBarVariant?: AppBarProps["variant"];
  toolbarVariant?: ToolbarProps["variant"];
  position?: AppBarProps["position"];
};

export const MainAppBar: React.FC<MainAppBarProps> = ({
  appBarVariant = "elevation",
  toolbarVariant = "dense",
  position = "sticky",
}) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const theme = useTheme();
  const isMobile = useMobileLayout();
  const { LL } = useI18nContext();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const { openBrowser } = useProjectBrowserContext();

  const isScrolled = useAppSelector(selectIsAppBarScrolled);

  const session = useSession();

  const isPlayground = currentPath.startsWith("/playground");
  const useMobilePlayground = isMobile && isPlayground;

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

  return (
    <>
      <SidePanel isOpen={isSidePanelOpen} setIsOpen={setIsSidePanelOpen} />
      <AppBar
        position={position}
        elevation={isScrolled ? 2 : 0}
        variant={appBarVariant}
        color={"transparent"}
        sx={{
          transition: "all .2s",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
          background: isScrolled
            ? alpha(theme.palette.primary.main, 0.2)
            : alpha(theme.palette.primary.main, 0),
          boxShadow: `0 0 12px 0 ${alpha(
            theme.palette.primary.main,
            isScrolled ? 0.2 : 0,
          )}`,
          borderBottom: `1px solid ${alpha(
            theme.palette.common.white,
            isScrolled ? 0.05 : 0,
          )}`,
          color: theme.palette.text.primary,
        }}
      >
        <Container maxWidth="xl" disableGutters={useMobilePlayground}>
          {useMobilePlayground ? (
            <MobilePlaygroundToolbar
              toolbarVariant={toolbarVariant}
              onOpenUserMenu={handleOpenUserMenu}
            />
          ) : (
            <Toolbar
              disableGutters
              variant={toolbarVariant}
              sx={{ height: 56 }}
            >
              <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
                <Image
                  alt={LL.DSTRUCT_LOGO()}
                  src="/android-chrome-192x192.png"
                  width="32"
                  height="32"
                />
              </Box>
              <MuiLink
                component={Link}
                href="/"
                variant="h6"
                noWrap
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
              <MuiLink
                component={Link}
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
              <Box
                sx={{
                  flexGrow: 1,
                  gap: 1,
                  display: { xs: "none", md: "flex" },
                }}
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
                <Tooltip title={LL.PROJECT_BROWSER()} arrow>
                  <IconButton
                    onClick={openBrowser}
                    color="inherit"
                    aria-label={LL.PROJECT_BROWSER()}
                  >
                    <FolderOpen />
                  </IconButton>
                </Tooltip>
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
          )}
        </Container>
      </AppBar>
    </>
  );
};
