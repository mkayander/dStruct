import { TabContext, TabList } from "@mui/lab";
import { alpha, Box, Tab, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";

import { CallstackTable } from "#/components/CallstackTable";
import { PanelWrapper } from "#/layouts/panels/common/PanelWrapper";
import { StyledTabPanel, TabListWrapper } from "#/layouts/panels/common/styled";

import { useAppSelector } from "#/store/hooks";

export const OutputPanel: React.FC = () => {
  const theme = useTheme();

  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { isReady, runtime, result, error } = useAppSelector(
    (state) => state.callstack
  );

  return (
    <PanelWrapper>
      <TabContext value={value}>
        <TabListWrapper>
          <TabList onChange={handleChange} aria-label="panel tabs">
            <Tab label="Output" value="1" />
            <Tab label="Callstack" value="2" />
          </TabList>
        </TabListWrapper>

        <StyledTabPanel value="1">
          <Box display="flex" flexDirection="row" gap={2}>
            {!isReady ? (
              <Box display="box">
                <Typography variant="h5">No data</Typography>
                <Typography variant="caption">
                  You need to run the code first
                </Typography>
              </Box>
            ) : error ? (
              <Box display="box">
                <Typography variant="h5" color="error">
                  {error.name}: {error.message}
                </Typography>
                <Typography variant="caption" color="error">
                  {error.stack}
                </Typography>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="h5" color="success.main">
                  Success
                </Typography>
                <Typography variant="caption">
                  Returned:{" "}
                  <Box
                    component="div"
                    sx={{
                      backgroundColor: alpha(theme.palette.success.dark, 0.2),
                      p: 1,
                      borderRadius: 2,
                    }}
                  >
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                  </Box>
                </Typography>
              </Box>
            )}

            {runtime && (
              <Typography variant="caption" color="text.disabled" mt={1}>
                Runtime: {runtime.toFixed(2)} ms
              </Typography>
            )}
          </Box>
        </StyledTabPanel>
        <StyledTabPanel value="2">
          <CallstackTable />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
