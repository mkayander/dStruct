import { Replay, Settings } from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import {
  alpha,
  Box,
  Button,
  IconButton,
  Stack,
  Tab,
  Tooltip,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

import { LoadingSkeletonOverlay } from "#/components/atoms/LoadingSkeletonOverlay";
import { BenchmarkView } from "#/components/molecules/BenchmarkView";
import { PlayerControls } from "#/components/molecules/PlayerControls";
import { TreeViewer } from "#/components/molecules/TreeViewer/TreeViewer";
import { PanelWrapper } from "#/components/organisms/panels/common/PanelWrapper";
import {
  StyledTabPanel,
  TabListWrapper,
} from "#/components/organisms/panels/common/styled";
import { useI18nContext, usePlayerControls, useSearchParam } from "#/hooks";
import { useMobileLayout } from "#/hooks/useMobileLayout";
import { useAppSelector } from "#/store/hooks";
import { selectCallstackIsReady } from "#/store/reducers/callstackReducer";
import { selectTreeMaxDepth } from "#/store/reducers/structures/treeNodeReducer";

type TabName = "structure" | "benchmark";
const TabNames = new Set<TabName>(["structure", "benchmark"]);
const isValidTabName = (name: unknown): name is TabName =>
  TabNames.has(name as TabName);

export const TreeViewPanel: React.FC = () => {
  const { LL } = useI18nContext();
  const theme = useTheme();

  const [tabValue, setTabValue] = useSearchParam<TabName>("mode", {
    defaultValue: "structure",
    validate: isValidTabName,
  });
  const [sliderValue, setSliderValue] = useState(100);

  const isCallstackReady = useAppSelector(selectCallstackIsReady);
  const maxDepth = useAppSelector(selectTreeMaxDepth);
  const isMobile = useMobileLayout();

  const {
    replayCount,
    handleKeyDown,
    handlePlay,
    handleReplay,
    handleReset,
    handleStepBack,
    handleStepForward,
  } = usePlayerControls();

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <PanelWrapper
      sx={{
        height: isMobile ? 240 + maxDepth * 60 : "100%",
      }}
      onKeyDown={handleKeyDown}
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
          <Box
            sx={{
              position: "absolute",
              maxWidth: "100%",
              width: "400px",
              top: "0",
              right: "0",
              borderLeft: `1px solid ${theme.palette.divider}`,
              borderBottom: `1px solid ${theme.palette.divider}`,
              borderRadius: "0 0 0 14px",
              backgroundColor: alpha(theme.palette.secondary.main, 0.05),
              zIndex: 50,
              backdropFilter: "blur(14px)",
            }}
          >
            <PlayerControls
              sliderValue={sliderValue}
              setSliderValue={setSliderValue}
              handlePlay={handlePlay}
              handleStepBack={handleStepBack}
              handleStepForward={handleStepForward}
            />
          </Box>
          <TreeViewer
            replayCount={replayCount}
            playbackInterval={sliderValue}
          />
        </StyledTabPanel>
        <StyledTabPanel value="benchmark">
          <BenchmarkView />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
