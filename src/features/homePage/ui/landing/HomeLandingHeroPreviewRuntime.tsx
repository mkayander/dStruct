import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Replay from "@mui/icons-material/Replay";
import SkipNext from "@mui/icons-material/SkipNext";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import {
  Alert,
  alpha,
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Provider } from "react-redux";

import {
  callstackSlice,
  selectCallstack,
  selectCallstackFrameIndex,
  selectCallstackIsPlaying,
  selectCallstackIsReady,
  selectCallstackLength,
  selectIsLastFrame,
  selectIsRootFrame,
} from "#/features/callstack/model/callstackSlice";
import { CompactCallstackList } from "#/features/callstack/ui/CompactCallstackList";
import {
  createLandingHeroPreviewStore,
  type LandingHeroPreviewStore,
} from "#/features/homePage/model/landingHeroPreviewStore";
import { usePlayerControls } from "#/features/treeViewer/hooks";
import {
  getPlaybackStepGroups,
  getPlaybackStepIndex,
} from "#/features/treeViewer/lib";
import { TreeViewer } from "#/features/treeViewer/ui/TreeViewer";
import type { TranslationFunctions } from "#/i18n/i18n-types";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

type HomeLandingHeroPreviewRuntimeProps = {
  LL: TranslationFunctions;
};

const PLAYBACK_INTERVAL_MS = 300;
const REPLAY_RESET_PAUSE_MS = 220;

type LandingHeroPreviewRuntimeState =
  | {
      store: LandingHeroPreviewStore;
      errorMessage: null;
    }
  | {
      store: null;
      errorMessage: string;
    };

const getPreviewRuntimeErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unexpected landing preview initialization error.";
};

const HomeLandingHeroPreviewRuntimeInner: React.FC<
  HomeLandingHeroPreviewRuntimeProps
> = ({ LL }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const hasAutoStartedRef = useRef(false);
  const hasManualOverrideRef = useRef(false);
  const replayTimeoutRef = useRef<number | null>(null);
  const replayRestartTimeoutRef = useRef<number | null>(null);
  const {
    handleReset,
    replayCount,
    handlePlay,
    handleReplay,
    handleStepBack,
    handleStepForward,
  } = usePlayerControls();

  const isReady = useAppSelector(selectCallstackIsReady);
  const callstack = useAppSelector(selectCallstack);
  const isPlaying = useAppSelector(selectCallstackIsPlaying);
  const frameIndex = useAppSelector(selectCallstackFrameIndex);
  const callstackLength = useAppSelector(selectCallstackLength);
  const isLastFrame = useAppSelector(selectIsLastFrame);
  const isRootFrame = useAppSelector(selectIsRootFrame);
  const playbackStepGroups = useMemo(
    () => getPlaybackStepGroups(callstack.frames),
    [callstack.frames],
  );
  const activePlaybackStepIndex = useMemo(
    () => getPlaybackStepIndex(playbackStepGroups, frameIndex),
    [frameIndex, playbackStepGroups],
  );

  const stopAutoplay = () => {
    hasManualOverrideRef.current = true;
    dispatch(callstackSlice.actions.setIsPlaying(false));
  };

  const handleManualStepBack = () => {
    stopAutoplay();
    handleStepBack();
  };

  const handleManualPlayToggle = () => {
    hasManualOverrideRef.current = true;
    handlePlay();
  };

  const handleManualReplay = () => {
    stopAutoplay();
    handleReplay();
  };

  const handleManualStepForward = () => {
    stopAutoplay();
    handleStepForward();
  };

  useEffect(() => {
    if (
      !isReady ||
      callstackLength === 0 ||
      hasAutoStartedRef.current ||
      hasManualOverrideRef.current
    ) {
      return;
    }

    hasAutoStartedRef.current = true;
    handlePlay();
  }, [callstackLength, handlePlay, isReady]);

  useEffect(() => {
    if (
      !isReady ||
      !hasAutoStartedRef.current ||
      hasManualOverrideRef.current ||
      isPlaying ||
      !isLastFrame
    ) {
      return;
    }

    replayTimeoutRef.current = window.setTimeout(() => {
      handleReset();

      replayRestartTimeoutRef.current = window.setTimeout(() => {
        if (!hasManualOverrideRef.current) {
          dispatch(callstackSlice.actions.setIsPlaying(true));
        }
      }, REPLAY_RESET_PAUSE_MS);
    }, 900);

    return () => {
      if (replayTimeoutRef.current !== null) {
        window.clearTimeout(replayTimeoutRef.current);
        replayTimeoutRef.current = null;
      }
    };
  }, [dispatch, handleReset, isLastFrame, isPlaying, isReady]);

  useEffect(
    () => () => {
      if (replayTimeoutRef.current !== null) {
        window.clearTimeout(replayTimeoutRef.current);
      }
      if (replayRestartTimeoutRef.current !== null) {
        window.clearTimeout(replayRestartTimeoutRef.current);
      }
    },
    [],
  );

  return (
    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
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
          Step {Math.max(activePlaybackStepIndex + 1, 0)} /{" "}
          {playbackStepGroups.length || callstackLength}
        </Typography>
      </Stack>

      <Box
        sx={{
          position: "relative",
          minHeight: 212,
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
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            px: 1,
            py: 1.25,
          }}
        >
          <TreeViewer
            playbackInterval={PLAYBACK_INTERVAL_MS}
            replayCount={replayCount}
            binaryTreeAlign="center"
          />
        </Box>
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
          <Typography variant="subtitle2" color="text.secondary">
            {LL.CALLSTACK()}
          </Typography>
        </Stack>
        <CompactCallstackList height={262} />
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ minWidth: 0 }}
      >
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={handleManualStepBack}
            disabled={!isReady || isRootFrame}
            aria-label="Step back"
            title="Step back"
            sx={{
              bgcolor: alpha(theme.appDesign.surfaceHigh, 0.9),
            }}
          >
            <SkipPrevious fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={
              isLastFrame && !isPlaying
                ? handleManualReplay
                : handleManualPlayToggle
            }
            disabled={!callstackLength}
            aria-label={
              isLastFrame && !isPlaying
                ? "Replay"
                : isPlaying
                  ? "Pause"
                  : "Play"
            }
            title={
              isLastFrame && !isPlaying
                ? "Replay"
                : isPlaying
                  ? "Pause"
                  : "Play"
            }
            sx={{
              bgcolor: alpha(theme.appDesign.accent, 0.14),
              color: theme.appDesign.accentSoft,
            }}
          >
            {isLastFrame && !isPlaying ? (
              <Replay fontSize="small" />
            ) : isPlaying ? (
              <Pause fontSize="small" />
            ) : (
              <PlayArrow fontSize="small" />
            )}
          </IconButton>
          <IconButton
            size="small"
            onClick={handleManualStepForward}
            disabled={!isReady || isLastFrame}
            aria-label="Step forward"
            title="Step forward"
            sx={{
              bgcolor: alpha(theme.appDesign.surfaceHigh, 0.9),
            }}
          >
            <SkipNext fontSize="small" />
          </IconButton>
        </Stack>
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
  );
};

export const HomeLandingHeroPreviewRuntime: React.FC<
  HomeLandingHeroPreviewRuntimeProps
> = ({ LL }) => {
  const [runtimeState] = useState<LandingHeroPreviewRuntimeState>(() => {
    try {
      return {
        store: createLandingHeroPreviewStore(),
        errorMessage: null,
      };
    } catch (error) {
      return {
        store: null,
        errorMessage: getPreviewRuntimeErrorMessage(error),
      };
    }
  });

  if (!runtimeState.store) {
    return (
      <Alert severity="error" variant="outlined">
        <Typography variant="subtitle2">
          Landing preview failed to load.
        </Typography>
        <Typography variant="caption">{runtimeState.errorMessage}</Typography>
      </Alert>
    );
  }

  return (
    <Provider store={runtimeState.store}>
      <HomeLandingHeroPreviewRuntimeInner LL={LL} />
    </Provider>
  );
};
