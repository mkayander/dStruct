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
import {
  useArgumentsNodeData,
  useI18nContext,
  usePlayerControls,
  useSearchParam,
} from "#/hooks";
import { useMobileLayout } from "#/hooks/useMobileLayout";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { selectCallstackIsReady } from "#/store/reducers/callstackReducer";
import {
  editorSlice,
  selectIsEditingNodes,
} from "#/store/reducers/editorReducer";
import { resetStructuresState } from "#/utils";

type TabName = "structure" | "benchmark";
const TabNames = new Set<TabName>(["structure", "benchmark"]);
const isValidTabName = (name: unknown): name is TabName =>
  TabNames.has(name as TabName);

export const TreeViewPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { LL } = useI18nContext();
  const theme = useTheme();

  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [dragEvent, setDragEvent] = useState<React.MouseEvent | null>(null);

  const [tabValue, setTabValue] = useSearchParam<TabName>("mode", {
    defaultValue: "structure",
    validate: isValidTabName,
  });
  const [sliderValue, setSliderValue] = useState(100);

  const isEditingNodes = useAppSelector(selectIsEditingNodes);
  const isCallstackReady = useAppSelector(selectCallstackIsReady);
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
        minHeight: isMobile ? "70vh" : "",
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
              disabled={!isReady}
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
                  disabled={!isReady}
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
          sx={{
            position: "relative",
            height: "100%",
            p: 0,
            flexGrow: 1,
            cursor: dragEvent ? "grabbing" : "grab",
          }}
          style={{
            height: isMobile ? "70vh" : "100%",
          }}
          onMouseDown={(ev: React.MouseEvent) => {
            setDragEvent(ev);
          }}
          onMouseUp={() => {
            setDragEvent(null);
          }}
          onMouseMove={(ev: React.MouseEvent) => {
            if (dragEvent) {
              setXOffset((prev) => prev + ev.movementX);
              setYOffset((prev) => prev + ev.movementY);
            }
          }}
          onMouseLeave={() => {
            setDragEvent(null);
          }}
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
                  handleStepBack={handleStepBack}
                  handleStepForward={handleStepForward}
                />
              </Box>
            </>
          }
        >
          <div
            style={{
              transform: `translate(${xOffset}px, ${yOffset}px)`,
            }}
          >
            <TreeViewer
              replayCount={replayCount}
              playbackInterval={sliderValue}
            />
          </div>
        </StyledTabPanel>
        <StyledTabPanel value="benchmark">
          <BenchmarkView />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
