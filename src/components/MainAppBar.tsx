import MenuIcon from "@mui/icons-material/Menu";
import {
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
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { type MouseEvent, useState } from "react";

import { ThemeSwitch } from "#/components/ThemeSwitch";
import { useProfileImageUploader } from "#/hooks";
import { getImageUrl } from "#/utils";

const AVATAR_PLACEHOLDER = "/avatars/placeholder.png";

type NavItem = {
  name: string;
  href: string;
};

const pages = [
  {
    name: "Dashboard",
    href: "/",
  },
  // {
  //   name: 'Pricing',
  //   href: '/',
  // },
  {
    name: "Playground",
    href: "/playground",
  },
] as const;

const settings = ["Profile", "Account", "Dashboard", "Logout"];

type MainAppBarProps = {
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  appBarVariant?: AppBarProps["variant"];
  toolbarVariant?: ToolbarProps["variant"];
};

export const MainAppBar: React.FC<MainAppBarProps> = ({
  setDarkMode,
  appBarVariant = "elevation",
  toolbarVariant = "dense",
}) => {
  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const session = useSession();

  useProfileImageUploader(session);

  const handleSignIn = async () => {
    await signIn();
  };

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavItemClick = (item: NavItem) => {
    void router.push(item.href);
  };

  return (
    <AppBar position="sticky" elevation={2} variant={appBarVariant}>
      <Container maxWidth="xl">
        <Toolbar disableGutters variant={toolbarVariant}>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <Image
              alt="dStruct Logo"
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
                color: "inherit",
                textDecoration: "none",
              }}
            >
              dStruct
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
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
                  key={page.name}
                  onClick={() => handleNavItemClick(page)}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
            <Image
              alt="dStruct Logo"
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
                key={page.name}
                onClick={() => handleNavItemClick(page)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Stack direction="row" sx={{ flexGrow: 0 }}>
            <ThemeSwitch
              onChange={(_, checked) => {
                setDarkMode(checked);
              }}
            />

            {session.status === "loading" ? (
              <Skeleton
                variant="circular"
                animation="wave"
                height={40}
                width={40}
              />
            ) : session.data ? (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>
                    <Image
                      src={getImageUrl(
                        session.data.user.bucketImage || AVATAR_PLACEHOLDER
                      )}
                      alt={`${session.data.user.name} avatar`}
                      referrerPolicy="no-referrer"
                      fill={true}
                    />
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <Button color="inherit" onClick={handleSignIn}>
                Sign In
              </Button>
            )}

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
