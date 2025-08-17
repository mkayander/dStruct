import { TabPanel, type TabPanelProps } from "@mui/lab";
import { Box } from "@mui/material";

import { TabContentScrollContainer } from "./TabContentScrollContainer";

type StyledTabPanelProps = TabPanelProps & {
  scrollContainerStyle?: React.CSSProperties;
  scrollViewportStyle?: React.CSSProperties;
  useScroll?: boolean;
  overlay?: React.ReactNode;
  containerId?: string;
};

export const StyledTabPanel: React.FC<StyledTabPanelProps> = ({
  scrollContainerStyle,
  scrollViewportStyle,
  useScroll = true,
  overlay,
  containerId,
  sx,
  children,
  ...restProps
}) => {
  const sxProps: StyledTabPanelProps["sx"] = {
    p: 2,
    display: "flex",
    flexDirection: "column",
    ...sx,
  };

  if (useScroll) {
    return (
      <TabPanel sx={{ p: 0, minHeight: 10, flexGrow: 1 }} {...restProps}>
        {overlay}
        <TabContentScrollContainer
          defer
          style={{ height: "100%", ...scrollContainerStyle }}
          viewportStyle={scrollViewportStyle}
        >
          <Box id={containerId} sx={sxProps}>
            {children}
          </Box>
        </TabContentScrollContainer>
      </TabPanel>
    );
  }

  return (
    <TabPanel sx={{ height: "fit-content", ...sxProps }} {...restProps}>
      <div id={containerId}>{children}</div>
    </TabPanel>
  );
};
