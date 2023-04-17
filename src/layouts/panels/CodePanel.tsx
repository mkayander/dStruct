import { AutoFixHigh, PlayArrow } from "@mui/icons-material";
import { LoadingButton, TabContext, TabList } from "@mui/lab";
import { Box, IconButton, Stack, Tab, Tooltip } from "@mui/material";
import type * as monaco from "monaco-editor";
import { useSession } from "next-auth/react";
import Image from "next/image";
import parserBabel from "prettier/parser-babel";
import prettier from "prettier/standalone";
import React, { useEffect, useState } from "react";
import shortUUID from "short-uuid";

import { CodeRunner, EditorStateIcon, SolutionSelectBar } from "#/components";
import prettierIcon from "#/components/CodeRunner/assets/prettierIcon.svg";
import { EditorState } from "#/components/CodeRunner/EditorStateIcon";
import { usePlaygroundSlugs } from "#/hooks";
import { PanelWrapper } from "#/layouts/panels/common/PanelWrapper";
import { StyledTabPanel, TabListWrapper } from "#/layouts/panels/common/styled";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  callstackSlice,
  selectRuntimeData,
} from "#/store/reducers/callstackReducer";
import { selectCaseArguments } from "#/store/reducers/caseReducer";
import { selectIsEditable } from "#/store/reducers/projectReducer";
import { arrayDataSelector } from "#/store/reducers/structures/arrayReducer";
import { treeDataSelector } from "#/store/reducers/structures/treeNodeReducer";
import { createCaseRuntimeArgs, resetStructuresState, trpc } from "#/utils";

const uuid = shortUUID();

export const CodePanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const session = useSession();

  const [tabValue, setTabValue] = useState("1");
  const [codeInput, setCodeInput] = useState<string>("");
  const [monacoInstance, setMonacoInstance] = useState<typeof monaco | null>(
    null
  );
  const [textModel, setTextModel] = useState<monaco.editor.ITextModel | null>(
    null
  );
  const [editorState, setEditorState] = useState(EditorState.INITIAL);

  const { projectSlug = "", solutionSlug = "" } = usePlaygroundSlugs();
  const isEditable = useAppSelector(selectIsEditable);
  const { error } = useAppSelector(selectRuntimeData);

  const selectedProject = trpc.project.getBySlug.useQuery(projectSlug || "", {
    enabled: Boolean(projectSlug),
  });
  const currentSolution = trpc.project.getSolutionBySlug.useQuery(
    {
      projectId: selectedProject.data?.id || "",
      slug: solutionSlug,
    },
    {
      enabled: Boolean(selectedProject.data?.id && solutionSlug),
    }
  );

  const updateSolution = trpc.project.updateSolution.useMutation({
    onSuccess: () => {
      setEditorState(EditorState.SAVED_ON_SERVER);
    },
  });

  const treeStore = useAppSelector(treeDataSelector);
  const arrayStore = useAppSelector(arrayDataSelector);
  const caseArgs = useAppSelector(selectCaseArguments);

  // Update code on solution change
  useEffect(() => {
    if (!currentSolution.data?.code) return;

    setEditorState(EditorState.INITIAL);
    setCodeInput(currentSolution.data.code);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSolution.data]);

  // Save code changes on server
  useEffect(() => {
    if (!currentSolution.data || editorState !== EditorState.PENDING_CHANGES)
      return;

    const timeoutId = setTimeout(() => {
      updateSolution.mutate({
        projectId: currentSolution.data.projectId,
        solutionId: currentSolution.data.id,
        code: codeInput,
      });
    }, 750);

    return () => clearTimeout(timeoutId);
  }, [
    codeInput,
    currentSolution.data,
    editorState,
    projectSlug,
    solutionSlug,
    updateSolution,
  ]);

  // Handle code errors
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleRunCode = () => {
    const args = createCaseRuntimeArgs(
      dispatch,
      treeStore,
      arrayStore,
      caseArgs
    );

    const getInputFunction = new Function(codeInput);

    const startTimestamp = performance.now();

    try {
      const context = {
        TreeNode() {
          console.log("TreeNode is not available in this context");
          // this.name = "TreeNode";
        },
      };

      Object.assign(window, context);

      const runFunction = getInputFunction();

      // Before running the code, clear the callstack
      dispatch(callstackSlice.actions.removeAll());
      resetStructuresState(dispatch);

      const result = runFunction(...args);
      const runtime = performance.now() - startTimestamp;

      const serializedResult =
        typeof result === "object"
          ? JSON.parse(JSON.stringify(result))
          : result;

      // Identify that the callstack is filled and can now be used
      dispatch(
        callstackSlice.actions.setStatus({
          isReady: true,
          error: null,
          result: serializedResult,
          runtime,
          startTimestamp,
        })
      );
    } catch (e: unknown) {
      const runtime = performance.now() - startTimestamp;
      if (e instanceof Error) {
        dispatch(
          callstackSlice.actions.addOne({
            id: uuid.generate(),
            timestamp: performance.now(),
            name: "error",
          })
        );
        dispatch(
          callstackSlice.actions.setStatus({
            isReady: true,
            error: { name: e.name, message: e.message, stack: e.stack },
            result: null,
            runtime,
            startTimestamp,
          })
        );
      } else {
        console.error("Invalid error type: ", e);
      }
    }
  };

  const handleChangeCode = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent
  ) => {
    setCodeInput(value ?? "");
    const range = ev.changes[0]?.rangeLength ?? 0;
    if (session.status === "unauthenticated" && range > 0 && range < 200) {
      setEditorState(EditorState.FORKED_UNAUTHENTICATED);
    } else if (projectSlug && solutionSlug && isEditable) {
      setEditorState(EditorState.PENDING_CHANGES);
    }
  };

  const handleFormatCode = () => {
    const formattedCode = prettier.format(codeInput, {
      parser: "babel",
      plugins: [parserBabel],
    });
    setCodeInput(formattedCode);
  };

  const isLoading =
    selectedProject.isLoading ||
    currentSolution.isLoading ||
    updateSolution.isLoading;

  return (
    <PanelWrapper>
      <TabContext value={tabValue}>
        <TabListWrapper>
          <TabList onChange={handleTabChange} aria-label="panel tabs">
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
              sx={{ height: "100%", borderRadius: "0 8px 0 0" }}
            >
              Run
            </LoadingButton>
          </Stack>
        </TabListWrapper>
        <StyledTabPanel
          value="1"
          useScroll={false}
          scrollContainerStyle={{ zIndex: 1000, overflowY: "hidden" }}
          scrollViewportStyle={{ zIndex: 100, overflowY: "hidden" }}
          sx={{ p: 1, overflowY: "hidden" }}
        >
          <SolutionSelectBar selectedProject={selectedProject} mx={1} my={1} />
          <Box
            sx={{
              position: "relative",
            }}
          >
            <CodeRunner
              value={codeInput}
              onChange={handleChangeCode}
              isUpdating={isLoading}
              setMonacoInstance={setMonacoInstance}
              setTextModel={setTextModel}
            />
            <Box
              sx={{
                position: "absolute",
                top: "6px",
                right: "20px",
                opacity: 0.7,
              }}
            >
              <EditorStateIcon
                state={editorState}
                isLoading={updateSolution.isLoading}
              />
            </Box>
          </Box>
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
