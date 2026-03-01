"use client";

import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import FolderOpen from "@mui/icons-material/FolderOpen";
import Settings from "@mui/icons-material/Settings";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Toolbar,
  type ToolbarProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

import { selectCallstackIsReady } from "#/features/callstack/model/callstackSlice";
import {
  type PlaygroundView,
  useMobilePlaygroundView,
} from "#/features/playground/hooks/useMobilePlaygroundView";
import { MOBILE_APPBAR_HEIGHT } from "#/features/playground/ui/MobilePlayground";
import { useI18nContext } from "#/shared/hooks";
import { useHasMounted } from "#/shared/hooks/useHasMounted";
import { getImageUrl } from "#/shared/lib";
import { useAppSelector } from "#/store/hooks";

const AVATAR_PLACEHOLDER = "/avatars/placeholder.png";

type MobilePlaygroundToolbarProps = {
  toolbarVariant: ToolbarProps["variant"];
  onOpenUserMenu: () => void;
};

const viewLabelKeys: Record<PlaygroundView, "BROWSE" | "CODE" | "RESULTS"> = {
  browse: "BROWSE",
  code: "CODE",
  results: "RESULTS",
};

export const MobilePlaygroundToolbar: React.FC<
  MobilePlaygroundToolbarProps
> = ({ toolbarVariant, onOpenUserMenu }) => {
  const { LL } = useI18nContext();
  const hasMounted = useHasMounted();
  const session = useSession();
  const router = useRouter();
  const { currentView, hasProjectSlug, goToBrowse, goToCode, goToResults } =
    useMobilePlaygroundView();
  const hasResults = useAppSelector(selectCallstackIsReady);

  const handleBack = () => {
    if (currentView === "browse") void router.push("/");
    else if (currentView === "results") goToCode();
    else if (currentView === "code") goToBrowse();
  };

  const handleForward = () => {
    if (currentView === "browse" && hasProjectSlug) goToCode();
    else if (currentView === "code" && hasResults) goToResults();
  };

  const canGoForward =
    (currentView === "browse" && hasProjectSlug) ||
    (currentView === "code" && hasResults);

  const handleSignIn = async () => {
    await signIn();
  };

  return (
    <Toolbar
      disableGutters
      variant={toolbarVariant}
      sx={{ height: MOBILE_APPBAR_HEIGHT, px: 1 }}
    >
      <IconButton size="small" onClick={handleBack} aria-label={LL.BACK()}>
        <ArrowBack fontSize="small" />
      </IconButton>

      <Typography
        variant="subtitle2"
        noWrap
        sx={{
          mx: 1,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontSize: "0.75rem",
          color: "text.secondary",
        }}
      >
        {LL[viewLabelKeys[currentView]]()}
      </Typography>

      <IconButton
        size="small"
        onClick={handleForward}
        disabled={!canGoForward}
        aria-label="Forward"
      >
        <ArrowForward fontSize="small" />
      </IconButton>

      <Box sx={{ flex: 1 }} />

      <Stack direction="row" spacing={0.5} alignItems="center">
        {currentView !== "browse" && (
          <Tooltip title={LL.PROJECT_BROWSER()} arrow>
            <IconButton
              size="small"
              onClick={goToBrowse}
              color="inherit"
              aria-label={LL.PROJECT_BROWSER()}
            >
              <FolderOpen fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {!hasMounted || session.status === "loading" ? (
          <Skeleton
            variant="circular"
            animation="wave"
            height={32}
            width={32}
          />
        ) : (
          <>
            {session.status === "unauthenticated" && (
              <Button
                title={LL.SIGN_IN()}
                color="inherit"
                size="small"
                onClick={handleSignIn}
                sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1 }}
              >
                {LL.SIGN_IN()}
              </Button>
            )}
            <Tooltip title={LL.OPEN_OPTIONS()} arrow>
              <IconButton size="small" onClick={onOpenUserMenu}>
                {session.data ? (
                  <Avatar sx={{ width: 28, height: 28 }}>
                    <Image
                      src={getImageUrl(
                        session.data.user.bucketImage || AVATAR_PLACEHOLDER,
                      )}
                      alt={`${session.data.user.name} avatar`}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      width={28}
                      height={28}
                    />
                  </Avatar>
                ) : (
                  <Settings fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>
    </Toolbar>
  );
};
