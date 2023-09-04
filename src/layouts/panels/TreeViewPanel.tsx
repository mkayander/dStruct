import { Replay, Settings, Speed } from "@mui/icons-material";
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

import { TreeViewer } from "#/components/organisms/TreeViewer/TreeViewer";
import { useI18nContext } from "#/hooks";
import { useMobileLayout } from "#/hooks/useMobileLayout";
import { PanelWrapper } from "#/layouts/panels/common/PanelWrapper";
import { StyledTabPanel, TabListWrapper } from "#/layouts/panels/common/styled";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { selectCallstackIsReady } from "#/store/reducers/callstackReducer";
import { selectTreeMaxDepth } from "#/store/reducers/structures/treeNodeReducer";
import { resetStructuresState } from "#/utils";

export const TreeViewPanel: React.FC = () => {
  const dispatch = useAppDispatch();

  const { LL } = useI18nContext();

  const [tabValue, setTabValue] = useState("1");
  const [frameIndex, setFrameIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(100);
  const [replayCount, setReplayCount] = useState(0);

  const isCallstackReady = useAppSelector(selectCallstackIsReady);
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
  };

  const handleReplay = () => {
    setReplayCount(replayCount + 1);
  };

  const handleBlur = () => {
    if (sliderValue < 5) {
      setSliderValue(5);
    } else if (sliderValue > 700) {
      setSliderValue(700);
    }
  };

  return (
    <PanelWrapper
      sx={{
        height: isMobile ? 240 + maxDepth * 60 : "100%",
      }}
    >
      <TabContext value={tabValue}>
        <TabListWrapper>
          <TabList onChange={handleTabChange} aria-label={LL.PANEL_TABS()}>
            <Tab label={LL.TREE_VIEWER()} value="1" />
          </TabList>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton>
              <Settings fontSize="small" />
            </IconButton>
            <Button
              // title="Reset data structures to initial states"
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
          value="1"
          scrollContainerStyle={{ height: "100%" }}
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
                    min={5}
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
                      min: 5,
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
          </Stack>
          <Divider sx={{ mt: 1 }} />
          <TreeViewer
            frameState={[frameIndex, setFrameIndex]}
            replayCount={replayCount}
            playbackInterval={sliderValue}
          />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
