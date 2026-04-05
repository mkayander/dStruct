import AccountTree from "@mui/icons-material/AccountTree";
import CallSplit from "@mui/icons-material/CallSplit";
import History from "@mui/icons-material/History";
import PlayCircleOutline from "@mui/icons-material/PlayCircleOutline";
import SkipNext from "@mui/icons-material/SkipNext";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import {
  alpha,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

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

const treeValues = [
  { value: 4, top: "10%", left: "42%" },
  { value: 2, top: "42%", left: "18%" },
  { value: 7, top: "42%", left: "66%" },
  { value: 1, top: "74%", left: "8%" },
  { value: 3, top: "74%", left: "29%" },
  { value: 6, top: "74%", left: "56%" },
  { value: 9, top: "74%", left: "78%" },
] as const;

export const HomeLandingHeroPreview: React.FC<HomeLandingHeroPreviewProps> = ({
  LL,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: { xs: 340, sm: "100%" },
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
        direction="row"
        spacing={1}
        sx={{
          p: 1.5,
          borderBottom: `1px solid ${alpha(theme.appDesign.outline, 0.14)}`,
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

        <Stack spacing={1.5} sx={{ p: { xs: 1.5, sm: 2.5 }, minWidth: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ minWidth: 0 }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {LL.HOME_PILLAR_REPLAY_TITLE()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Frame 42 / 60
            </Typography>
          </Stack>

          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 168, sm: 196 },
              borderRadius: 3,
              bgcolor: alpha(theme.appDesign.surfaceLowest, 0.92),
              border: `1px solid ${alpha(theme.appDesign.outline, 0.12)}`,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 50% 20%, ${alpha(
                  theme.appDesign.accent,
                  0.22,
                )} 0%, transparent 46%)`,
              }}
            />
            {treeValues.map((node) => (
              <Box
                key={node.value}
                sx={{
                  position: "absolute",
                  top: node.top,
                  left: node.left,
                  width: { xs: 30, sm: 38 },
                  height: { xs: 30, sm: 38 },
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  bgcolor: alpha(theme.appDesign.surfaceHigh, 0.94),
                  border: `1px solid ${alpha(theme.appDesign.accentSoft, 0.18)}`,
                  color: "text.primary",
                  fontSize: { xs: "0.78rem", sm: "0.95rem" },
                  fontWeight: 700,
                  boxShadow: `0 12px 30px ${alpha(theme.appDesign.background, 0.45)}`,
                }}
              >
                {node.value}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              borderRadius: 3,
              bgcolor: alpha(theme.appDesign.surfaceLowest, 0.86),
              border: `1px solid ${alpha(theme.appDesign.outline, 0.1)}`,
              overflow: "hidden",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ px: 1.5, py: 1.25 }}
            >
              <AccountTree
                fontSize="small"
                sx={{ color: theme.appDesign.accentSoft }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                {LL.CALLSTACK()}
              </Typography>
            </Stack>
            <Divider
              sx={{ borderColor: alpha(theme.appDesign.outline, 0.1) }}
            />
            <Stack spacing={1} sx={{ px: 1.5, py: 1.25 }}>
              <Typography variant="caption" color="text.secondary">
                02 Call invertTree(7)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                03 Call invertTree(2)
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.appDesign.accentSoft, fontWeight: 600 }}
              >
                42 Reverse node.left ↔ node.right
              </Typography>
              <Typography variant="caption" color="text.secondary">
                43 Return root (4)
              </Typography>
            </Stack>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ minWidth: 0 }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                bgcolor: alpha(theme.appDesign.surfaceHigh, 0.9),
              }}
            >
              <SkipPrevious fontSize="small" />
            </Box>
            <Box
              sx={{
                width: 38,
                height: 38,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                bgcolor: alpha(theme.appDesign.accent, 0.14),
                color: theme.appDesign.accentSoft,
              }}
            >
              <PlayCircleOutline fontSize="small" />
            </Box>
            <Box
              sx={{
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                bgcolor: alpha(theme.appDesign.surfaceHigh, 0.9),
              }}
            >
              <SkipNext fontSize="small" />
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                ml: { sm: 0.5 },
                lineHeight: 1.6,
                maxWidth: { xs: "100%", sm: 220 },
              }}
            >
              {LL.HOME_PILLAR_VIS_BODY()}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};
