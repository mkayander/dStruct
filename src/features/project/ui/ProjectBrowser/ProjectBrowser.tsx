import Close from "@mui/icons-material/Close";
import {
  alpha,
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";

import { useI18nContext, usePlaygroundSlugs } from "#/shared/hooks";

import { ProjectBrowserContent } from "./ProjectBrowserContent";
import { useProjectBrowserContext } from "./ProjectBrowserContext";

type ProjectBrowserProps = {
  onSelectProject?: (projectSlug: string) => void;
};

export const ProjectBrowser: React.FC<ProjectBrowserProps> = ({
  onSelectProject,
}) => {
  const { LL } = useI18nContext();
  const theme = useTheme();

  const { isOpen, closeBrowser } = useProjectBrowserContext();
  const { setProject } = usePlaygroundSlugs();

  const handleSelectProject = useCallback(
    (slug: string) => {
      void setProject(slug);
      closeBrowser();
      onSelectProject?.(slug);
    },
    [closeBrowser, onSelectProject, setProject],
  );

  const handleClose = useCallback(() => {
    closeBrowser();
  }, [closeBrowser]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard navigation: Escape to close, Ctrl/Cmd+F to focus search
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (ev: KeyboardEvent) => {
      // Escape to close browser
      if (ev.key === "Escape") {
        ev.preventDefault();
        handleClose();
        return;
      }

      // Ctrl/Cmd + F to focus search
      if ((ev.ctrlKey || ev.metaKey) && ev.key === "f") {
        ev.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={handleClose}
      aria-label="Project browser"
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", md: "800px" },
            maxWidth: { xs: "100vw", md: "90vw" },
            minWidth: { md: 300 }, // Minimum width for usability
            background: alpha(theme.palette.background.paper, 0.68),
            backdropFilter: "blur(18px)",
          },
        },
      }}
      ModalProps={{
        keepMounted: false, // Better performance on mobile
      }}
    >
      <Stack
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2,
            pb: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {LL.PROJECT_BROWSER()}
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            aria-label="Close project browser"
          >
            <Close />
          </IconButton>
        </Box>
        <Divider />

        <ProjectBrowserContent
          onSelectProject={handleSelectProject}
          searchInputRef={searchInputRef}
        />
      </Stack>
    </Drawer>
  );
};
