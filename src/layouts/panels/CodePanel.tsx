import { AutoFixHigh, PlayArrow } from "@mui/icons-material";
import { LoadingButton, TabContext, TabList } from "@mui/lab";
import { Box, IconButton, Stack, Tab, Tooltip } from "@mui/material";
import type * as monaco from "monaco-editor";
import Image from "next/image";
import parserBabel from "prettier/parser-babel";
import prettier from "prettier/standalone";
import React, { useEffect, useState } from "react";
import shortUUID from "short-uuid";

import { CodeRunner, SolutionSelectBar } from "#/components";
import prettierIcon from "#/components/CodeRunner/assets/prettierIcon.svg";
import { usePlaygroundIds } from "#/hooks";
import { createRuntimeTree } from "#/hooks/useRuntimeBinaryTree";
import { PanelWrapper } from "#/layouts/panels/common/PanelWrapper";
import { StyledTabPanel, TabListWrapper } from "#/layouts/panels/common/styled";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  callstackSlice,
  selectRuntimeData,
} from "#/store/reducers/callstackReducer";
import { selectIsEditable } from "#/store/reducers/projectReducer";
import {
  treeDataSelector,
  treeNodeSlice,
} from "#/store/reducers/treeNodeReducer";
import { trpc } from "#/utils";

const uuid = shortUUID();

export const CodePanel: React.FC = () => {
  const dispatch = useAppDispatch();

  const [value, setValue] = useState("1");
  const [codeInput, setCodeInput] = useState<string>("");
  const [monacoInstance, setMonacoInstance] = useState<typeof monaco | null>(
    null
  );
  const [textModel, setTextModel] = useState<monaco.editor.ITextModel | null>(
    null
  );

  const {
    projectId: selectedProjectId = "",
    solutionId: selectedSolutionId = "",
  } = usePlaygroundIds();
  const isEditable = useAppSelector(selectIsEditable);
  const { error } = useAppSelector(selectRuntimeData);

  const selectedProject = trpc.project.getById.useQuery(
    selectedProjectId || "",
    {
      enabled: Boolean(selectedProjectId),
    }
  );
  const currentSolution = trpc.project.getSolutionById.useQuery(
    {
      id: selectedSolutionId,
      projectId: selectedProjectId,
    },
    {
      enabled: Boolean(selectedProjectId && selectedSolutionId),
    }
  );

  const updateSolution = trpc.project.updateSolution.useMutation();

  const nodesData = useAppSelector(treeDataSelector);

  useEffect(() => {
    if (currentSolution.data?.code) setCodeInput(currentSolution.data.code);
  }, [currentSolution.data]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!selectedProjectId || !selectedSolutionId || !isEditable) return;

    const timeoutId = setTimeout(() => {
      updateSolution.mutate({
        projectId: selectedProjectId,
        solutionId: selectedSolutionId,
        code: codeInput,
      });
    }, 750);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeInput, error]);

  useEffect(() => {
    if (!monacoInstance || !textModel) return;
    if (!error) {
      monacoInstance.editor.setModelMarkers(
        textModel,
        "javascript",
        [] // clear markers
      );
      return;
    }

    let startLineNumber = 3;
    let endLineNumber = 9;
    let startColumn = 1;
    let endColumn = 10;

    const [, posLine] = error.stack?.split("\n") ?? [];

    if (posLine) {
      const [, line, column] = posLine.match(/:(\d+):(\d+)\)$/) ?? [];

      if (line && column) {
        startLineNumber = Number(line) - 2;
        endLineNumber = Number(line) - 2;
        startColumn = Number(column);
        endColumn = Number(column) + 10;
      }
    }

    const markers = monacoInstance.editor.getModelMarkers({
      owner: "error",
      resource: textModel.uri,
    });
    console.log({ markers });
    monacoInstance.editor.setModelMarkers(textModel, "javascript", [
      {
        severity: monacoInstance.MarkerSeverity.Error,
        message: `${error.name}: ${error.message}`,
        startLineNumber,
        endLineNumber,
        startColumn,
        endColumn,
      },
    ]);
  }, [error, monacoInstance, textModel]);

  const handleRunCode = () => {
    console.log("Run code:\n", codeInput);

    const tree = createRuntimeTree(nodesData, dispatch);
    if (!tree) {
      console.error("No tree to run");
      return;
    }

    const getInputFunction = new Function(codeInput);

    let runtime = performance.now();

    try {
      const runFunction = getInputFunction();
      console.log("Run function:\n", runFunction);

      // Before running the code, clear the callstack
      dispatch(callstackSlice.actions.removeAll());
      dispatch(treeNodeSlice.actions.resetAll()); // Reset all nodes to default

      const result = runFunction(tree);
      runtime = performance.now() - runtime;

      console.log("Runtime: ", runtime);

      // Identify that the callstack is filled and can now be used
      dispatch(
        callstackSlice.actions.setStatus({
          isReady: true,
          error: null,
          result,
          runtime,
        })
      );

      console.log("Result:\n", result);
    } catch (e: unknown) {
      runtime = performance.now() - runtime;
      if (e instanceof Error) {
        dispatch(
          callstackSlice.actions.addOne({
            id: uuid.generate(),
            timestamp: performance.now(),
            nodeId: "",
            name: "error",
          })
        );
        dispatch(
          callstackSlice.actions.setStatus({
            isReady: true,
            error: { name: e.name, message: e.message, stack: e.stack },
            result: null,
            runtime,
          })
        );
      } else {
        console.error("Invalid error type: ", e);
      }
    }
  };

  const handleFormatCode = () => {
    const formattedCode = prettier.format(codeInput, {
      parser: "babel",
      plugins: [parserBabel],
    });
    setCodeInput(formattedCode);
  };

  return (
    <PanelWrapper>
      <TabContext value={value}>
        <TabListWrapper>
          <TabList onChange={handleChange} aria-label="panel tabs">
            <Tab label="Code Runner" value="1" />
          </TabList>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip
              title={
                <Box display="flex" alignItems="center" gap="3px">
                  Format code with <b>Prettier</b>{" "}
                  <Image
                    alt="'Prettier' formatting icon"
                    {...prettierIcon}
                    width={22}
                    height={22}
                  />
                </Box>
              }
              arrow
            >
              <IconButton onClick={handleFormatCode}>
                <AutoFixHigh fontSize="small" />
              </IconButton>
            </Tooltip>
            <LoadingButton
              variant="text"
              color="success"
              title="Run code"
              endIcon={<PlayArrow />}
              loadingPosition="end"
              onClick={handleRunCode}
              sx={{ height: "100%", borderRadius: 0 }}
            >
              Run
            </LoadingButton>
          </Stack>
        </TabListWrapper>
        <StyledTabPanel value="1">
          <SolutionSelectBar selectedProject={selectedProject} mb={1} />
          <CodeRunner
            value={codeInput}
            onChange={(value) => setCodeInput(value || "")}
            isUpdating={updateSolution.isLoading}
            setMonacoInstance={setMonacoInstance}
            setTextModel={setTextModel}
          />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
