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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { type MouseEvent, useState } from "react";

import { MOBILE_APPBAR_HEIGHT } from "#/features/appBar/constants";
import { selectIsAppBarScrolled } from "#/features/appBar/model/appBarSlice";
import { SidePanel } from "#/features/menuSidePanel/ui/SidePanel";
import { useMobilePlaygroundView } from "#/features/playground/hooks/useMobilePlaygroundView";
import { useProjectBrowserContext } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { appFontStackDisplay } from "#/shared/fonts/fontVariables";
import { useProfileImageUploader } from "#/shared/hooks";
import { useI18nContext } from "#/shared/hooks";
import { useHasMounted } from "#/shared/hooks/useHasMounted";
import { useMobileLayout } from "#/shared/hooks/useMobileLayout";
import { getImageUrl } from "#/shared/lib";
import { useAppSelector } from "#/store/hooks";

const AVATAR_PLACEHOLDER = "/avatars/placeholder.png";

export type MainAppBarProps = {
  appBarVariant?: AppBarProps["variant"];
  toolbarVariant?: ToolbarProps["variant"];
  position?: AppBarProps["position"];
};

const LogoBrand: React.FC<{
  alt: string;
  showName?: boolean;
  logoSize?: number;
}> = ({ alt, showName = true, logoSize = 32 }) => (
  <MuiLink
    component={Link}
    href="/"
    sx={{
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      color: "inherit",
      mr: 1,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Image
        alt={alt}
        src="/android-chrome-192x192.png"
        width={logoSize}
        height={logoSize}
      />
      {showName && (
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontFamily: appFontStackDisplay,
            fontWeight: 700,
            letterSpacing: "-0.04em",
          }}
        >
          dStruct
        </Typography>
      )}
    </Box>
  </MuiLink>
);

export const MainAppBar: React.FC<MainAppBarProps> = ({
  appBarVariant = "elevation",
  toolbarVariant = "dense",
  position = "sticky",
}) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const theme = useTheme();
  const isMobileLayout = useMobileLayout();
  const useCompactNav = useMediaQuery(theme.breakpoints.down("lg"));
  const { LL } = useI18nContext();
  const { enqueueSnackbar } = useSnackbar();
  const hasMounted = useHasMounted();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const { openBrowser } = useProjectBrowserContext();
  const { currentView } = useMobilePlaygroundView();

  const isScrolled = useAppSelector(selectIsAppBarScrolled);
  const session = useSession();

  const isPlayground = currentPath.startsWith("/playground");
  const useMobilePlayground = isMobileLayout && isPlayground;

  const pages = [
    {
      name: LL.PLAYGROUND(),
      href: "/playground",
    },
    {
      name: LL.DAILY_PROBLEM_NAV(),
      href: "/daily",
    },
  ] as const;

  useProfileImageUploader(session);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error: unknown) {
      if (useMobilePlayground) {
        const message =
          error instanceof Error ? error.message : LL.SIGN_IN_FAILED();
        enqueueSnackbar(message, { variant: "error" });
      }
    }
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

  const toolbarHeight = useMobilePlayground ? MOBILE_APPBAR_HEIGHT : 56;
  const isCompact = useCompactNav;

  return (
    <>
      <SidePanel isOpen={isSidePanelOpen} setIsOpen={setIsSidePanelOpen} />
      <AppBar
        position={position}
        elevation={0}
        variant={appBarVariant}
        color={"transparent"}
        sx={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          transition: "all .2s",
          backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
          backgroundColor: "transparent",
          boxShadow: "none",
          borderBottom: isScrolled
            ? `1px solid ${alpha(theme.appDesign.outline, 0.18)}`
            : "1px solid transparent",
          color: theme.palette.text.primary,
        }}
      >
        <Container maxWidth="xl" disableGutters={useMobilePlayground}>
          <Toolbar
            disableGutters
            variant={toolbarVariant}
            sx={{
              height: toolbarHeight,
              px: useMobilePlayground ? 1 : { xs: 1.25, md: 0 },
            }}
          >
            <LogoBrand
              alt={LL.DSTRUCT_LOGO()}
              showName={!useCompactNav}
              logoSize={isCompact ? 24 : 32}
            />

            {useCompactNav && (
              <Box sx={{ flexGrow: 1, display: "flex" }}>
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
                  sx={{ display: "block" }}
                >
                  {pages.map((page) => (
                    <MenuItem
                      key={page.href}
                      component={Link}
                      href={page.href}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}

            {!useCompactNav && (
              <Box
                sx={{
                  flexGrow: 1,
                  gap: 1,
                  display: "flex",
                }}
              >
                {pages.map((page) => (
                  <Button
                    key={page.href}
                    component={Link}
                    href={page.href}
                    color="inherit"
                    sx={{
                      backgroundColor:
                        page.href && currentPath.startsWith(page.href)
                          ? alpha(theme.appDesign.surfaceHighest, 0.9)
                          : "transparent",
                      border:
                        page.href && currentPath.startsWith(page.href)
                          ? `1px solid ${alpha(theme.appDesign.outline, 0.22)}`
                          : "1px solid transparent",
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.appDesign.surfaceHigh,
                          0.82,
                        ),
                        borderColor: alpha(theme.appDesign.outline, 0.18),
                      },
                    }}
                  >
                    {page.name}
                  </Button>
                ))}
              </Box>
            )}

            {useCompactNav && <Box sx={{ flex: 1 }} />}

            <Stack
              direction="row"
              spacing={isCompact ? 0.5 : 1}
              alignItems="center"
              sx={{ flexGrow: 0 }}
            >
              {(!useMobilePlayground || currentView !== "browse") && (
                <Tooltip title={LL.PROJECT_BROWSER()} arrow>
                  <IconButton
                    size={isCompact ? "small" : "medium"}
                    onClick={openBrowser}
                    color="inherit"
                    aria-label={LL.PROJECT_BROWSER()}
                  >
                    <FolderOpen fontSize={isCompact ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              )}

              {(useMobilePlayground && !hasMounted) ||
              session.status === "loading" ? (
                <Skeleton
                  variant="circular"
                  animation="wave"
                  height={isCompact ? 32 : 40}
                  width={isCompact ? 32 : 40}
                />
              ) : (
                <>
                  {session.status === "unauthenticated" && (
                    <Button
                      title={LL.SIGN_IN()}
                      color="inherit"
                      size={isCompact ? "small" : "medium"}
                      onClick={handleSignIn}
                      sx={
                        isCompact
                          ? { fontSize: "0.75rem", minWidth: "auto", px: 1 }
                          : undefined
                      }
                    >
                      {LL.SIGN_IN()}
                    </Button>
                  )}
                  <Tooltip title={LL.OPEN_OPTIONS()} arrow>
                    <IconButton
                      size={isCompact ? "small" : "medium"}
                      onClick={handleOpenUserMenu}
                    >
                      {session.data ? (
                        <Avatar
                          sx={isCompact ? { width: 28, height: 28 } : undefined}
                        >
                          <Image
                            src={getImageUrl(
                              session.data.user.bucketImage ||
                                AVATAR_PLACEHOLDER,
                            )}
                            alt={`${session.data.user.name} avatar`}
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            width={isCompact ? 28 : 40}
                            height={isCompact ? 28 : 40}
                          />
                        </Avatar>
                      ) : (
                        <Settings fontSize={isCompact ? "small" : "medium"} />
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
