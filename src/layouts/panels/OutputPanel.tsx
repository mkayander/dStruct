import { TabContext, TabList } from "@mui/lab";
import { alpha, Box, Stack, Tab, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";

import { CallstackTable } from "#/components/CallstackTable";
import { useI18nContext } from "#/i18n/i18n-react";
import { PanelWrapper } from "#/layouts/panels/common/PanelWrapper";
import { StyledTabPanel, TabListWrapper } from "#/layouts/panels/common/styled";
import { useAppSelector } from "#/store/hooks";
import { selectConsoleLogs } from "#/store/reducers/callstackReducer";

const ConsoleOutput: React.FC = () => {
  const theme = useTheme();

  const { LL } = useI18nContext();

  const logs = useAppSelector(selectConsoleLogs);

  if (!logs.length) return null;

  return (
    <Typography variant="caption">
      {LL.CONSOLE_OUTPUT()}:
      <Box
        component="div"
        sx={{
          backgroundColor: alpha(theme.palette.info.dark, 0.08),
          p: 1,
          borderRadius: 2,
          div: {
            "white-space": "pre-wrap",
          },
        }}
      >
        <pre>
          {logs.map((log) => (
            <div key={log.id}>{log.args.join(" ")}</div>
          ))}
        </pre>
      </Box>
    </Typography>
  );
};

const ResultData: React.FC<{
  result: string | number | null;
}> = ({ result }) => {
  const theme = useTheme();

  const { LL } = useI18nContext();

  return (
    <Typography variant="caption">
      {LL.RETURNED()}:
      <Box
        component="div"
        sx={{
          backgroundColor: alpha(theme.palette.success.dark, 0.2),
          p: 1,
          borderRadius: 2,
        }}
      >
        <pre>{result}</pre>
      </Box>
    </Typography>
  );
};

export const OutputPanel: React.FC = () => {
  const [value, setValue] = useState("1");

  const { LL } = useI18nContext();

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
          <TabList onChange={handleChange} aria-label={LL.PANEL_TABS()}>
            <Tab label={LL.OUTPUT()} value="1" />
            <Tab label={LL.CALLSTACK()} value="2" />
          </TabList>
        </TabListWrapper>

        <StyledTabPanel value="1">
          <Stack spacing={2}>
            {!isReady ? (
              <Box display="box">
                <Typography variant="h5">{LL.NO_DATA()}</Typography>
                <Typography variant="caption">
                  {LL.YOU_NEED_TO_RUN_THE_CODE_FIRST()}
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
              <Stack spacing={1}>
                <Stack direction="row" spacing={1}>
                  <Typography variant="h5" color="success.main">
                    {LL.SUCCESS()}
                  </Typography>
                  {runtime && (
                    <Typography variant="caption" color="text.disabled" mt={1}>
                      {LL.RUNTIME()}: {runtime.toFixed(2)} {LL.MS()}
                    </Typography>
                  )}
                </Stack>
                <ConsoleOutput />
                <ResultData result={result} />
              </Stack>
            )}
          </Stack>
        </StyledTabPanel>
        <StyledTabPanel value="2">
          <CallstackTable />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
