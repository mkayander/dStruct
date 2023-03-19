import { alpha, Box, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ArcherContainer } from "react-archer";
import ScrollContainer from "react-indiana-drag-scroll";

import { NodesView } from "#/components/NodesView";
import { useAppSelector } from "#/store/hooks";
import { treeDataSelector } from "#/store/reducers/treeNodeReducer";

const overlayStyles = {
  content: "''",
  height: "100%",
  width: "32px",
  position: "absolute",
  pointerEvents: "none",
  top: 0,
  transition: "opacity .3s",
};

type TreeViewerProps = {
  playbackInterval: number;
  replayCount: number;
};

export const TreeViewer: React.FC<TreeViewerProps> = ({
  playbackInterval,
  replayCount,
}) => {
  const theme = useTheme();

  const treeState = useAppSelector(treeDataSelector);

  // Archer container forced re-render after animations hack
  useEffect(() => {
    const timeoutId = setTimeout(() => setForceUpdate((prev) => !prev), 50);

    return () => clearTimeout(timeoutId);
  }, [treeState]);

  const scrollRef = useRef<HTMLElement>() as React.Ref<HTMLElement>;
  const [, setForceUpdate] = useState(false);
  const [scrolledStart, setScrolledStart] = useState(true);
  const [scrolledEnd, setScrolledEnd] = useState(true);

  const handleScroll = () => {
    // TODO: The Ref types from the "indiana" library should be fixed
    const current = (scrollRef as React.MutableRefObject<HTMLElement>).current;
    const offset = 10;

    setScrolledStart(current.scrollLeft <= offset);
    setScrolledEnd(
      current.scrollLeft + current.offsetWidth >= current.scrollWidth - offset
    );
  };

  useEffect(() => {
    handleScroll();
  }, [treeState]);

  useEffect(() => {
    const handler = () => {
      handleScroll();
    };
    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      rowGap={1}
      borderRadius={1}
      position="relative"
      width="100%"
      height="100%"
      sx={{
        "&:before": {
          ...overlayStyles,
          left: 0,
          background: "linear-gradient(90deg, black, transparent)",
          opacity: scrolledStart ? 0 : 0.3,
        },
        "&:after": {
          ...overlayStyles,
          right: 0,
          background: "linear-gradient(-90deg, black, transparent)",
          opacity: scrolledEnd ? 0 : 0.3,
        },
        ".indiana-scroll-container": {
          cursor: !scrolledStart || !scrolledEnd ? "grab" : "initial",
        },
        ".indiana-scroll-container--dragging": {
          cursor: "grabbing",
        },
      }}
    >
      <ScrollContainer
        innerRef={scrollRef}
        onScroll={handleScroll}
        style={{ height: "100%" }}
      >
        <Box
          sx={{
            height: "100%",
            m: 3,
            path: {
              transition: "fill 0.3s",
            },
          }}
        >
          <ArcherContainer
            lineStyle="straight"
            strokeColor={alpha(theme.palette.primary.dark, 0.5)}
            strokeWidth={4}
            endMarker={false}
            style={{
              height: "100%",
            }}
            svgContainerStyle={{
              overflow: "visible",
              height: "100%",
            }}
          >
            <Box display="flex">
              {Object.entries(treeState).map(([treeName, data]) => (
                <NodesView
                  key={treeName}
                  treeName={treeName}
                  nodes={data.nodes}
                  playbackInterval={playbackInterval}
                  replayCount={replayCount}
                />
              ))}
            </Box>
          </ArcherContainer>
        </Box>
      </ScrollContainer>
    </Box>
  );
};
