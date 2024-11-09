import { FilterCenterFocus } from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import {
  alpha,
  Box,
  Button,
  IconButton,
  Stack,
  Tab,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

import { BenchmarkView } from "#/features/benchmark/ui/BenchmarkView";
import { selectCallstackIsReady } from "#/features/callstack/model/callstackSlice";
import {
  editorSlice,
  selectIsEditingNodes,
  selectIsPanning,
  selectIsViewCentered,
} from "#/features/treeViewer/model/editorSlice";
import { PlayerControls } from "#/features/treeViewer/ui/PlayerControls";
import { TreeViewer } from "#/features/treeViewer/ui/TreeViewer";
import { useI18nContext, useSearchParam } from "#/shared/hooks";
import { useMobileLayout } from "#/shared/hooks/useMobileLayout";
import { LoadingSkeletonOverlay } from "#/shared/ui/atoms/LoadingSkeletonOverlay";
import { PanelWrapper } from "#/shared/ui/templates/PanelWrapper";
import { PannableViewer } from "#/shared/ui/templates/PannableViewer";
import { StyledTabPanel } from "#/shared/ui/templates/StyledTabPanel";
import { TabListWrapper } from "#/shared/ui/templates/TabListWrapper";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

import {
  useArgumentsNodeData,
  usePlayerControls,
  useViewerPan,
} from "../hooks";
import { resetStructuresState } from "../lib";

type TabName = "structure" | "benchmark";
const TabNames = new Set<TabName>(["structure", "benchmark"]);
const isValidTabName = (name: unknown): name is TabName =>
  TabNames.has(name as TabName);

export const TreeViewPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { LL } = useI18nContext();
  const theme = useTheme();

  const [tabValue, setTabValue] = useSearchParam<TabName>("mode", {
    defaultValue: "structure",
    validate: isValidTabName,
  });
  const [sliderValue, setSliderValue] = useState(100);

  const isEditingNodes = useAppSelector(selectIsEditingNodes);
  const isCallstackReady = useAppSelector(selectCallstackIsReady);
  const isMobile = useMobileLayout();
  const isPanning = useAppSelector(selectIsPanning);
  const isViewCentered = useAppSelector(selectIsViewCentered);

  const { handlePanStart, handlePanEnd, handlePanReset, handleMouseMove } =
    useViewerPan();

  const {
    replayCount,
    handleKeyDown,
    handlePlay,
    handleReplay,
    handleReset,
    handleStepBack,
    handleStepForward,
  } = usePlayerControls();

  const { saveGraphNodePositions, clearGraphNodePositions } =
    useArgumentsNodeData();

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleEditButtonClick = () => {
    if (!isEditingNodes) {
      resetStructuresState(dispatch, false, true);
    } else {
      saveGraphNodePositions();
    }
    dispatch(editorSlice.actions.setIsEditing(!isEditingNodes));
  };

  const isReady = isCallstackReady && !isEditingNodes;

  return (
    <PanelWrapper
      sx={{
        height: "100%",
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
            <IconButton
              title="Reset view pan"
              disabled={isViewCentered}
              onClick={handlePanReset}
            >
              <FilterCenterFocus fontSize="small" />
            </IconButton>
            <Button
              title={LL.RESET_DATA_STRUCTURES()}
              disabled={!isReady}
              color="inherit"
              onClick={handleReset}
              sx={{ height: "100%" }}
            >
              {LL.RESET()}
            </Button>
          </Stack>
        </TabListWrapper>
        <StyledTabPanel
          value="structure"
          sx={{
            position: "relative",
            height: "100%",
            p: 0,
            flexGrow: 1,
            cursor: isPanning ? "grabbing" : "grab",
          }}
          style={{
            height: isMobile ? "70vh" : "100%",
          }}
          onMouseDown={(ev: React.MouseEvent) => {
            handlePanStart(ev);
          }}
          onMouseUp={handlePanEnd}
          onMouseMove={handleMouseMove}
          onMouseLeave={handlePanEnd}
          overlay={
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: 62,
                  right: 8,
                  zIndex: 50,
                }}
              >
                <Stack gap={1}>
                  <Button
                    title={`${isEditingNodes ? "Save" : "Edit"} graph node positions`}
                    color={isEditingNodes ? "success" : "info"}
                    onClick={handleEditButtonClick}
                  >
                    {isEditingNodes ? "Save" : "Edit"}
                  </Button>
                  {isEditingNodes && (
                    <Button
                      title="Your changes will be lost"
                      color="warning"
                      onClick={clearGraphNodePositions}
                    >
                      Recalculate
                    </Button>
                  )}
                </Stack>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  maxWidth: "94%",
                  width: "400px",
                  bottom: "0",
                  left: "50%",
                  transform: "translateX(-50%)",
                  border: `1px solid ${theme.palette.divider}`,
                  borderBottom: "none",
                  borderRadius: "8px 8px 0 0",
                  backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                  boxShadow: `0 4px 30px ${alpha(theme.palette.secondary.main, 0.1)}`,
                  zIndex: 70,
                  backdropFilter: "blur(14px)",
                }}
              >
                <PlayerControls
                  disabled={isEditingNodes}
                  sliderValue={sliderValue}
                  setSliderValue={setSliderValue}
                  handlePlay={handlePlay}
                  handleReplay={handleReplay}
                  handleStepBack={handleStepBack}
                  handleStepForward={handleStepForward}
                />
              </Box>
            </>
          }
        >
          <PannableViewer>
            <TreeViewer
              replayCount={replayCount}
              playbackInterval={sliderValue}
            />
          </PannableViewer>
        </StyledTabPanel>
        <StyledTabPanel value="benchmark">
          <BenchmarkView />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
