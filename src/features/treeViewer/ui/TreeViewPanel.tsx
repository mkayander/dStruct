import FilterCenterFocus from "@mui/icons-material/FilterCenterFocus";
import ZoomIn from "@mui/icons-material/ZoomIn";
import ZoomOut from "@mui/icons-material/ZoomOut";
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

import { hasGraphArgumentsSelector } from "#/entities/dataStructures/node/model/nodeSlice";
import { BenchmarkView } from "#/features/benchmark/ui/BenchmarkView";
import { selectCallstackIsReady } from "#/features/callstack/model/callstackSlice";
import {
  editorSlice,
  selectIsEditingNodes,
  selectIsPanning,
  selectIsViewAtDefault,
} from "#/features/treeViewer/model/editorSlice";
import { PlayerControls } from "#/features/treeViewer/ui/PlayerControls";
import { TreeViewer } from "#/features/treeViewer/ui/TreeViewer";
import { useI18nContext, useSearchParam } from "#/shared/hooks";
import { LoadingSkeletonOverlay } from "#/shared/ui/atoms/LoadingSkeletonOverlay";
import { iconButtonHoverSx } from "#/shared/ui/styles/iconButtonHoverStyles";
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

type ZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  isAtDefault: boolean;
};

const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  isAtDefault,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: "absolute",
        right: 12,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        padding: 0.5,
        borderRadius: 2,
        background: alpha(theme.palette.background.paper, isDark ? 0.25 : 0.55),
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: `1px solid ${alpha(
          theme.palette.common.white,
          isDark ? 0.08 : 0.35,
        )}`,
        boxShadow: `0 8px 32px ${alpha(
          theme.palette.common.black,
          isDark ? 0.4 : 0.08,
        )}`,
      }}
    >
      <IconButton
        title="Zoom in"
        onClick={onZoomIn}
        size="small"
        sx={iconButtonHoverSx(theme)}
      >
        <ZoomIn fontSize="small" />
      </IconButton>
      <IconButton
        title="Zoom out"
        onClick={onZoomOut}
        size="small"
        sx={iconButtonHoverSx(theme)}
      >
        <ZoomOut fontSize="small" />
      </IconButton>
      <Box
        sx={{
          height: 1,
          mx: 0.5,
          background: alpha(theme.palette.divider, 0.5),
        }}
      />
      <IconButton
        title="Reset view (pan and zoom)"
        onClick={onReset}
        disabled={isAtDefault}
        size="small"
        sx={iconButtonHoverSx(theme)}
      >
        <FilterCenterFocus fontSize="small" />
      </IconButton>
    </Box>
  );
};

type ControlsOverlayProps = {
  sliderValue: number;
  setSliderValue: (value: number) => void;
  handlePlay: () => void;
  handleReplay: () => void;
  handleStepBack: () => void;
  handleStepForward: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onViewReset: () => void;
  isViewAtDefault: boolean;
};

const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  sliderValue,
  setSliderValue,
  handlePlay,
  handleReplay,
  handleStepBack,
  handleStepForward,
  onZoomIn,
  onZoomOut,
  onViewReset,
  isViewAtDefault,
}) => {
  const dispatch = useAppDispatch();
  const isEditingNodes = useAppSelector(selectIsEditingNodes);
  const hasGraphArguments = useAppSelector(hasGraphArgumentsSelector);
  const theme = useTheme();
  const { saveGraphNodePositions, clearGraphNodePositions } =
    useArgumentsNodeData();

  const handleEditButtonClick = () => {
    if (!isEditingNodes) {
      resetStructuresState(dispatch, false, true);
    } else {
      saveGraphNodePositions();
    }
    dispatch(editorSlice.actions.setIsEditing(!isEditingNodes));
  };

  return (
    <>
      <ZoomControls
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onReset={onViewReset}
        isAtDefault={isViewAtDefault}
      />
      {hasGraphArguments && (
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
      )}
      <Box
        sx={{
          position: "absolute",
          maxWidth: "94%",
          width: "400px",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "12px 12px 0 0",
          background: alpha(
            theme.palette.background.paper,
            theme.palette.mode === "dark" ? 0.25 : 0.55,
          ),
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: `1px solid ${alpha(
            theme.palette.common.white,
            theme.palette.mode === "dark" ? 0.08 : 0.35,
          )}`,
          borderBottom: "none",
          boxShadow: `0 8px 32px ${alpha(
            theme.palette.common.black,
            theme.palette.mode === "dark" ? 0.4 : 0.08,
          )}`,
          zIndex: 70,
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
  );
};

type TabName = "structure" | "benchmark";
const TabNames = new Set<TabName>(["structure", "benchmark"]);
const isValidTabName = (name: unknown): name is TabName =>
  TabNames.has(name as TabName);

export type TreeViewPanelProps = {
  /** Optional actions to render in the tab header (e.g. output panel collapse on mobile) */
  trailingHeaderActions?: React.ReactNode;
  /** From SplitPanelsLayout - panel vertical size (unused, for type compatibility) */
  verticalSize?: number;
};

export const TreeViewPanel: React.FC<TreeViewPanelProps> = ({
  trailingHeaderActions,
  verticalSize: _verticalSize,
}) => {
  const { LL } = useI18nContext();

  const [tabValue, setTabValue] = useSearchParam<TabName>("mode", {
    defaultValue: "structure",
    validate: isValidTabName,
  });
  const [sliderValue, setSliderValue] = useState(100);

  const isEditingNodes = useAppSelector(selectIsEditingNodes);
  const isCallstackReady = useAppSelector(selectCallstackIsReady);
  const isPanning = useAppSelector(selectIsPanning);
  const isViewAtDefault = useAppSelector(selectIsViewAtDefault);

  const {
    handlePanStart,
    handlePanEnd,
    handleViewReset,
    handleMouseMove,
    handleZoomIn,
    handleZoomOut,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    viewerRef,
  } = useViewerPan();

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

  const isReady = isCallstackReady && !isEditingNodes;

  const overlay = (
    <ControlsOverlay
      sliderValue={sliderValue}
      setSliderValue={setSliderValue}
      handlePlay={handlePlay}
      handleReplay={handleReplay}
      handleStepBack={handleStepBack}
      handleStepForward={handleStepForward}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onViewReset={handleViewReset}
      isViewAtDefault={isViewAtDefault}
    />
  );

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
            {trailingHeaderActions}
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
          overlay={overlay}
        >
          <div
            ref={viewerRef}
            onMouseDown={(ev: React.MouseEvent) => {
              if (ev.button === 0) {
                handlePanStart(ev);
              }
            }}
            onMouseUp={handlePanEnd}
            onMouseMove={handleMouseMove}
            onMouseLeave={handlePanEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ height: "100%", width: "100%", touchAction: "none" }}
          >
            <PannableViewer>
              <TreeViewer
                replayCount={replayCount}
                playbackInterval={sliderValue}
              />
            </PannableViewer>
          </div>
        </StyledTabPanel>
        <StyledTabPanel value="benchmark">
          <BenchmarkView />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
