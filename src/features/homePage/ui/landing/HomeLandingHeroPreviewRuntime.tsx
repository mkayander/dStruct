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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { useLandingHeroPreviewPlaybackGate } from "#/features/homePage/hooks/useLandingHeroPreviewPlaybackGate";
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
  pageScrollViewport: HTMLDivElement | null;
};

const PLAYBACK_INTERVAL_MS = 600;
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

  return "";
};

const HomeLandingHeroPreviewRuntimeInner: React.FC<
  HomeLandingHeroPreviewRuntimeProps
> = ({ LL, pageScrollViewport }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const previewRootRef = useRef<HTMLDivElement>(null);
  const hasAutoStartedRef = useRef(false);
  const hasManualOverrideRef = useRef(false);
  const wasPlayingBeforeSuppressRef = useRef(false);
  const replayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const replayRestartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const { isPlaybackSuppressed } = useLandingHeroPreviewPlaybackGate({
    previewRootRef,
    pageScrollViewport,
  });
  const {
    handleReset,
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
    () =>
      getPlaybackStepGroups(callstack.frames, { forCallstackDisplay: true }),
    [callstack.frames],
  );
  const activePlaybackStepIndex = useMemo(
    () => getPlaybackStepIndex(playbackStepGroups, frameIndex),
    [frameIndex, playbackStepGroups],
  );

  const clearReplayTimers = useCallback(() => {
    if (replayTimeoutRef.current !== null) {
      clearTimeout(replayTimeoutRef.current);
      replayTimeoutRef.current = null;
    }
    if (replayRestartTimeoutRef.current !== null) {
      clearTimeout(replayRestartTimeoutRef.current);
      replayRestartTimeoutRef.current = null;
    }
  }, []);

  // Auto-replay schedules a 900ms wait, then reset, then a short pause before setIsPlaying(true).
  // When reset runs, `isLastFrame` becomes false and this effect re-runs; its cleanup must not clear
  // the post-reset timeout or replay never resumes (playground-style reset sets isPlaying false).
  const clearAutoReplayEndDelayOnly = useCallback(() => {
    if (replayTimeoutRef.current !== null) {
      clearTimeout(replayTimeoutRef.current);
      replayTimeoutRef.current = null;
    }
  }, []);

  const stopAutoplay = () => {
    clearReplayTimers();
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

  // Landing UX: pause autoplay during page scroll or when the preview leaves the viewport so playback
  // does not compete with scroll compositing; resume only if playback was active before suppression.
  useEffect(() => {
    if (!isPlaybackSuppressed) {
      if (
        wasPlayingBeforeSuppressRef.current &&
        !hasManualOverrideRef.current &&
        isReady &&
        !isLastFrame
      ) {
        dispatch(callstackSlice.actions.setIsPlaying(true));
      }
      wasPlayingBeforeSuppressRef.current = false;
      return;
    }

    if (isPlaying) {
      wasPlayingBeforeSuppressRef.current = true;
      dispatch(callstackSlice.actions.setIsPlaying(false));
    }
    clearReplayTimers();
  }, [
    clearReplayTimers,
    dispatch,
    isLastFrame,
    isPlaybackSuppressed,
    isPlaying,
    isReady,
  ]);

  useEffect(() => {
    if (
      !isReady ||
      callstackLength === 0 ||
      hasAutoStartedRef.current ||
      hasManualOverrideRef.current ||
      isPlaybackSuppressed
    ) {
      return;
    }

    hasAutoStartedRef.current = true;
    handlePlay();
  }, [callstackLength, handlePlay, isPlaybackSuppressed, isReady]);

  useEffect(() => {
    if (
      !isReady ||
      !hasAutoStartedRef.current ||
      hasManualOverrideRef.current ||
      isPlaybackSuppressed ||
      isPlaying ||
      !isLastFrame
    ) {
      return;
    }

    replayTimeoutRef.current = setTimeout(() => {
      replayTimeoutRef.current = null;
      handleReset();

      replayRestartTimeoutRef.current = setTimeout(() => {
        replayRestartTimeoutRef.current = null;
        if (!hasManualOverrideRef.current) {
          dispatch(callstackSlice.actions.setIsPlaying(true));
        }
      }, REPLAY_RESET_PAUSE_MS);
    }, 900);

    return clearAutoReplayEndDelayOnly;
  }, [
    clearAutoReplayEndDelayOnly,
    dispatch,
    handleReset,
    isLastFrame,
    isPlaybackSuppressed,
    isPlaying,
    isReady,
  ]);

  useEffect(
    () => () => {
      clearReplayTimers();
    },
    [clearReplayTimers],
  );

  return (
    <Stack ref={previewRootRef} spacing={1.5} sx={{ minWidth: 0 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          minWidth: 0,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: "text.secondary",
          }}
        >
          {LL.HOME_PILLAR_REPLAY_TITLE()}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
          }}
        >
          {LL.HOME_PREVIEW_STEP_PROGRESS({
            step: Math.max(activePlaybackStepIndex + 1, 0),
            total: playbackStepGroups.length || callstackLength,
          })}
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
            binaryTreeAlign="center"
            disableLayoutTransitions={true}
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
          sx={{
            alignItems: "center",
            px: 1.5,
            py: 1.25,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.secondary",
            }}
          >
            {LL.CALLSTACK()}
          </Typography>
        </Stack>
        <CompactCallstackList height={262} />
      </Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{
          alignItems: "center",
          minWidth: 0,
        }}
      >
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            justifyContent: { xs: "flex-end", sm: "flex-start" },
          }}
        >
          <IconButton
            size="small"
            onClick={handleManualStepBack}
            disabled={!isReady || isRootFrame}
            aria-label={LL.HOME_PREVIEW_STEP_BACK()}
            title={LL.HOME_PREVIEW_STEP_BACK()}
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
                ? LL.REPLAY()
                : isPlaying
                  ? LL.HOME_LANDING_PREVIEW_PAUSE()
                  : LL.HOME_LANDING_PREVIEW_PLAY()
            }
            title={
              isLastFrame && !isPlaying
                ? LL.REPLAY()
                : isPlaying
                  ? LL.HOME_LANDING_PREVIEW_PAUSE()
                  : LL.HOME_LANDING_PREVIEW_PLAY()
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
            aria-label={LL.HOME_PREVIEW_STEP_FORWARD()}
            title={LL.HOME_PREVIEW_STEP_FORWARD()}
            sx={{
              bgcolor: alpha(theme.appDesign.surfaceHigh, 0.9),
            }}
          >
            <SkipNext fontSize="small" />
          </IconButton>
        </Stack>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            ml: { sm: 0.5 },
            lineHeight: 1.6,
            maxWidth: { xs: "100%", sm: 220 },
            textAlign: { xs: "right", sm: "left" },
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
> = ({ LL, pageScrollViewport }) => {
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
          {LL.HOME_LANDING_PREVIEW_LOAD_FAILED()}
        </Typography>
        <Typography variant="caption">
          {runtimeState.errorMessage ||
            LL.HOME_LANDING_PREVIEW_ERROR_UNEXPECTED()}
        </Typography>
      </Alert>
    );
  }

  return (
    <Provider store={runtimeState.store}>
      <HomeLandingHeroPreviewRuntimeInner
        LL={LL}
        pageScrollViewport={pageScrollViewport}
      />
    </Provider>
  );
};
