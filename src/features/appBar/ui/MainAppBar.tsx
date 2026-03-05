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
import { useSnackbar } from "notistack";
import React, { type MouseEvent, useState } from "react";

import { MOBILE_APPBAR_HEIGHT } from "#/features/appBar/constants";
import { selectIsAppBarScrolled } from "#/features/appBar/model/appBarSlice";
import { SidePanel } from "#/features/menuSidePanel/ui/SidePanel";
import { useMobilePlaygroundView } from "#/features/playground/hooks/useMobilePlaygroundView";
import { useProjectBrowserContext } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
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
          sx={{ fontFamily: "'Share Tech', sans-serif" }}
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
  const isMobile = useMobileLayout();
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
  const useMobilePlayground = isMobile && isPlayground;

  const pages = [
    {
      name: LL.PLAYGROUND(),
      href: "/playground",
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
  const isCompact = useMobilePlayground;

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
          <Toolbar
            disableGutters
            variant={toolbarVariant}
            sx={{
              height: toolbarHeight,
              px: useMobilePlayground ? 1 : undefined,
            }}
          >
            <LogoBrand
              alt={LL.DSTRUCT_LOGO()}
              showName={true}
              logoSize={isCompact ? 24 : 32}
            />

            {!useMobilePlayground && (
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
            )}

            {!useMobilePlayground && (
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
            )}

            {useMobilePlayground && <Box sx={{ flex: 1 }} />}

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
