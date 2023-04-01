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

import { TreeViewer } from "#/components";
import { useMobileLayout } from "#/hooks/useMobileLayout";
import { PanelWrapper } from "#/layouts/panels/common/PanelWrapper";
import { StyledTabPanel, TabListWrapper } from "#/layouts/panels/common/styled";
import { useAppSelector } from "#/store/hooks";
import { selectCallstackIsReady } from "#/store/reducers/callstackReducer";
import { selectTreeMaxDepth } from "#/store/reducers/structures/treeNodeReducer";

export const TreeViewPanel: React.FC = () => {
  const [tabValue, setTabValue] = useState("1");
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
          <TabList onChange={handleTabChange} aria-label="panel tabs">
            <Tab label="Tree Viewer" value="1" />
          </TabList>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton>
              <Settings fontSize="small" />
            </IconButton>
            <Tooltip
              title={
                isCallstackReady
                  ? "Replay previous code result visualisation"
                  : "You need to run the code first"
              }
              disableInteractive={false}
              arrow
            >
              <span style={{ height: "100%" }}>
                <Button
                  variant="text"
                  color="info"
                  endIcon={<Replay />}
                  onClick={handleReplay}
                  disabled={!isCallstackReady}
                  sx={{ height: "100%", borderRadius: "0 8px 0 0" }}
                >
                  Replay
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
          <Box sx={{ maxWidth: 600, p: 2 }}>
            <Typography id="input-slider" variant="caption" gutterBottom>
              Playback Interval
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
                    <Typography variant="caption">ms</Typography>
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
          <Divider sx={{ mt: 1 }} />
          <TreeViewer
            replayCount={replayCount}
            playbackInterval={sliderValue}
          />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
