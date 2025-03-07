import { TabContext, TabList } from "@mui/lab";
import { alpha, Box, Stack, Tab, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";

import {
  selectCallstackError,
  selectCallstackIsReady,
  selectCallstackResult,
  selectCallstackRuntime,
  selectConsoleLogs,
} from "#/features/callstack/model/callstackSlice";
import { CallstackTable } from "#/features/callstack/ui/CallstackTable";
import { useI18nContext } from "#/shared/hooks";
import { LoadingSkeletonOverlay } from "#/shared/ui/atoms/LoadingSkeletonOverlay";
import { PanelWrapper } from "#/shared/ui/templates/PanelWrapper";
import { StyledTabPanel } from "#/shared/ui/templates/StyledTabPanel";
import { TabListWrapper } from "#/shared/ui/templates/TabListWrapper";
import { useAppSelector } from "#/store/hooks";

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
            whiteSpace: "pre-wrap",
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

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const isReady = useAppSelector(selectCallstackIsReady);
  const runtime = useAppSelector(selectCallstackRuntime);
  const result = useAppSelector(selectCallstackResult);
  const error = useAppSelector(selectCallstackError);

  return (
    <PanelWrapper>
      <LoadingSkeletonOverlay />

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
                  {typeof runtime === "number" && (
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
        <StyledTabPanel
          value="2"
          sx={{
            p: 0,
            height: "100%",
          }}
          useScroll={false}
        >
          <CallstackTable />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
