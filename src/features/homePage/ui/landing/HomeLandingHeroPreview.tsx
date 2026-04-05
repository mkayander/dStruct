import CallSplit from "@mui/icons-material/CallSplit";
import History from "@mui/icons-material/History";
import PlayCircleOutline from "@mui/icons-material/PlayCircleOutline";
import { alpha, Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import React from "react";

import { HomeLandingHeroPreviewRuntime } from "#/features/homePage/ui/landing/HomeLandingHeroPreviewRuntime";
import type { TranslationFunctions } from "#/i18n/i18n-types";

type HomeLandingHeroPreviewProps = {
  LL: TranslationFunctions;
};

const codeSnippet = `function invertTree(root) {
  if (!root) return null;

  const left = invertTree(root.left);
  const right = invertTree(root.right);

  root.left = right;
  root.right = left;
  return root;
}`;

const WINDOW_CONTROLS = ["#ff5f57", "#febc2e", "#28c840"] as const;

export const HomeLandingHeroPreview: React.FC<HomeLandingHeroPreviewProps> = ({
  LL,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minWidth: 0,
        mx: { xs: "auto", sm: 0 },
        borderRadius: 4,
        border: `1px solid ${alpha(theme.appDesign.outline, 0.18)}`,
        bgcolor: alpha(theme.appDesign.surface, 0.86),
        backdropFilter: "blur(18px)",
        boxShadow: `0 24px 60px ${alpha(theme.appDesign.background, 0.46)}`,
        overflow: "hidden",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.25}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{
          p: 1.5,
          borderBottom: `1px solid ${alpha(theme.appDesign.outline, 0.14)}`,
          columnGap: 1.5,
          rowGap: 1.25,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {WINDOW_CONTROLS.map((color) => (
            <Box
              key={color}
              sx={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                bgcolor: color,
                boxShadow: `0 0 0 1px ${alpha(theme.appDesign.background, 0.35)} inset`,
              }}
            />
          ))}
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: "wrap",
            rowGap: 1,
          }}
        >
          <Chip
            size="small"
            icon={<PlayCircleOutline fontSize="small" />}
            label={LL.HOME_HOW_STEP_2_TITLE()}
          />
          <Chip
            size="small"
            icon={<History fontSize="small" />}
            label={LL.REPLAY()}
          />
          <Chip
            size="small"
            icon={<CallSplit fontSize="small" />}
            label={LL.CALLSTACK()}
          />
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            p: { xs: 1.5, sm: 2.5 },
            minWidth: 0,
            borderRight: {
              xs: "none",
              md: `1px solid ${alpha(theme.appDesign.outline, 0.14)}`,
            },
            borderBottom: {
              xs: `1px solid ${alpha(theme.appDesign.outline, 0.14)}`,
              md: "none",
            },
          }}
        >
          <Stack spacing={1.25}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ minWidth: 0 }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                javascript
              </Typography>
              <Typography variant="caption" color="text.secondary">
                solution.js
              </Typography>
            </Stack>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 0,
                overflowX: "auto",
                fontFamily:
                  '"IBM Plex Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace',
                fontSize: { xs: "0.76rem", sm: "0.86rem" },
                lineHeight: 1.7,
                color: theme.appDesign.accentSoft,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {codeSnippet}
            </Box>
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 1.5, sm: 2.5 }, minWidth: 0 }}>
          <HomeLandingHeroPreviewRuntime LL={LL} />
        </Box>
      </Box>
    </Box>
  );
};
