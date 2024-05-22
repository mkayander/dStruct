import {
  FirstPage,
  LastPage,
  Pause,
  PlayArrow,
  Replay,
  Settings,
  Speed,
} from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Input,
  Slider,
  Stack,
  Tab,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { LoadingSkeletonOverlay } from "#/components/atoms/LoadingSkeletonOverlay";
import { BenchmarkChart } from "#/components/molecules/BenchmarkChart";
import { TreeViewer } from "#/components/molecules/TreeViewer/TreeViewer";
import { PanelWrapper } from "#/components/organisms/panels/common/PanelWrapper";
import {
  StyledTabPanel,
  TabListWrapper,
} from "#/components/organisms/panels/common/styled";
import { useI18nContext, useSearchParam } from "#/hooks";
import { useMobileLayout } from "#/hooks/useMobileLayout";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  callstackSlice,
  selectCallstackFrameIndex,
  selectCallstackIsPlaying,
  selectCallstackIsReady,
  selectCallstackLength,
  selectRuntimeData,
} from "#/store/reducers/callstackReducer";
import { selectTreeMaxDepth } from "#/store/reducers/structures/treeNodeReducer";
import { resetStructuresState } from "#/utils";

type TabName = "structure" | "benchmark";
const TabNames = new Set<TabName>(["structure", "benchmark"]);
const isValidTabName = (name: unknown): name is TabName =>
  TabNames.has(name as TabName);

export const TreeViewPanel: React.FC = () => {
  const dispatch = useAppDispatch();

  const { LL } = useI18nContext();

  const [tabValue, setTabValue] = useSearchParam<TabName>("mode", {
    defaultValue: "structure",
    validate: isValidTabName,
  });
  const [sliderValue, setSliderValue] = useState(100);
  const [replayCount, setReplayCount] = useState(0);

  const isCallstackReady = useAppSelector(selectCallstackIsReady);
  const callstackLength = useAppSelector(selectCallstackLength);
  const runtimeData = useAppSelector(selectRuntimeData);
  const isPlaying = useAppSelector(selectCallstackIsPlaying);
  const frameIndex = useAppSelector(selectCallstackFrameIndex);
  const maxDepth = useAppSelector(selectTreeMaxDepth);
  const isMobile = useMobileLayout();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(event.target.value));
  };

  const handleReset = () => {
    resetStructuresState(dispatch);
    dispatch(callstackSlice.actions.setFrameIndex(-1));
    dispatch(callstackSlice.actions.setIsPlaying(false));
  };

  const handleReplay = () => {
    setReplayCount(replayCount + 1);
    dispatch(callstackSlice.actions.setFrameIndex(-1));
    dispatch(callstackSlice.actions.setIsPlaying(true));
  };

  const handleStepBack = () => {
    dispatch(callstackSlice.actions.setFrameIndex(frameIndex - 1));
  };

  const handlePlay = () => {
    dispatch(callstackSlice.actions.setIsPlaying(!isPlaying));
  };

  const handleStepForward = () => {
    dispatch(callstackSlice.actions.setFrameIndex(frameIndex + 1));
  };

  const handleBlur = () => {
    if (sliderValue < 1) {
      setSliderValue(1);
    } else if (sliderValue > 700) {
      setSliderValue(700);
    }
  };

  return (
    <PanelWrapper
      sx={{
        height: isMobile ? 240 + maxDepth * 60 : "100%",
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          handleStepBack();
        } else if (event.key === "ArrowRight") {
          handleStepForward();
        } else if (event.key === " ") {
          if (
            event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLButtonElement
          )
            return;
          handlePlay();
        } else if (event.key === "r") {
          handleReplay();
        } else if (event.key === "Escape") {
          handleReset();
        }
      }}
    >
      <LoadingSkeletonOverlay />

      <TabContext value={tabValue}>
        <TabListWrapper>
          <TabList onChange={handleTabChange} aria-label={LL.PANEL_TABS()}>
            <Tab label={"Structure Viewer"} value="structure" />
            <Tab label={"Benchmark"} value="benchmark" />
          </TabList>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton>
              <Settings fontSize="small" />
            </IconButton>
            <Button
              title={LL.RESET_DATA_STRUCTURES()}
              color="inherit"
              onClick={handleReset}
              sx={{ height: "100%" }}
            >
              {LL.RESET()}
            </Button>
            <Tooltip
              title={
                isCallstackReady
                  ? LL.REPLAY_PREVIOUS_CODE_RESULT_VISUALIZATION()
                  : LL.YOU_NEED_TO_RUN_THE_CODE_FIRST()
              }
              disableInteractive={false}
              arrow
            >
              <span style={{ height: "100%" }}>
                <Button
                  color="info"
                  endIcon={<Replay />}
                  onClick={handleReplay}
                  disabled={!isCallstackReady}
                  sx={{ height: "100%", borderRadius: "0 8px 0 0" }}
                >
                  {LL.REPLAY()}
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </TabListWrapper>
        <StyledTabPanel
          value="structure"
          useScroll={!isMobile}
          sx={{ height: "100%", p: 0, position: "relative" }}
        >
          <Stack p={2} direction="row" alignItems="center" spacing={2}>
            <Box sx={{ maxWidth: 600, flexGrow: 1 }}>
              <Typography id="input-slider" variant="caption" gutterBottom>
                {LL.PLAYBACK_INTERVAL()}
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Speed />
                </Grid>
                <Grid item xs>
                  <Slider
                    value={sliderValue}
                    min={1}
                    max={700}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                  />
                </Grid>
                <Grid item>
                  <Input
                    value={sliderValue}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    renderSuffix={() => (
                      <Typography variant="caption">{LL.MS()}</Typography>
                    )}
                    inputProps={{
                      step: 5,
                      min: 1,
                      max: 700,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                    sx={{ width: "64px" }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Typography variant="caption" minWidth="3ch">
              {frameIndex}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconButton
                title="Step back"
                disabled={!callstackLength || frameIndex === -1}
                onClick={handleStepBack}
              >
                <FirstPage />
              </IconButton>
              <IconButton
                title={isPlaying ? "Pause" : "Play"}
                disabled={!callstackLength}
                onClick={handlePlay}
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton
                title="Step forward"
                disabled={
                  !callstackLength || frameIndex === callstackLength - 1
                }
                onClick={handleStepForward}
              >
                <LastPage />
              </IconButton>
            </Stack>
          </Stack>
          <Divider sx={{ mt: 1 }} />
          <TreeViewer
            replayCount={replayCount}
            playbackInterval={sliderValue}
          />
        </StyledTabPanel>
        <StyledTabPanel value="benchmark">
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <Typography variant="body2">
              <strong>Average: </strong>
              {runtimeData.benchmarkResults?.averageTime} ms
            </Typography>
            <Typography variant="body2">
              <strong>Median: </strong>
              {runtimeData.benchmarkResults?.medianTime} ms
            </Typography>
            <Typography variant="body2">
              <strong>P75: </strong>
              {runtimeData.benchmarkResults?.p75Time} ms
            </Typography>
            <Typography variant="body2">
              <strong>P90: </strong>
              {runtimeData.benchmarkResults?.p90Time} ms
            </Typography>
            <Typography variant="body2">
              <strong>P99: </strong>
              {runtimeData.benchmarkResults?.p99Time} ms
            </Typography>
          </Stack>
          <BenchmarkChart />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
